import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import type { CreateTerminalDto, LogicalTerminal } from '@repo/types'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { apiErrorMessage } from '@/lib/api'
import { useCreateTerminal, useUpdateTerminal } from '@/lib/queries/terminals'
import { scrollToFirstError } from '@/lib/utils'

const formSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome.'),
})

export type TerminalFormValues = z.infer<typeof formSchema>

/**
 * Quando presente, substitui as mutations internas de create/update — usado
 * pelo fluxo de solicitação (spec R.2), que envia o mesmo payload pra
 * `POST /solicitations` em vez de `POST /terminals`.
 */
export interface TerminalFormSubmitOverride {
  onSubmit: (dto: CreateTerminalDto) => Promise<void>
  successMessage: string
  submitLabel: string
}

interface TerminalFormProps {
  mode: 'create' | 'edit'
  terminal?: LogicalTerminal
  onSuccess?: () => void
  /** Quando presente, o rodapé ganha um "Cancelar" ao lado do envio. */
  onCancel?: () => void
  submitOverride?: TerminalFormSubmitOverride
}

export function TerminalForm({ mode, terminal, onSuccess, onCancel, submitOverride }: TerminalFormProps) {
  const [apiError, setApiError] = useState<string | null>(null)
  const createTerminal = useCreateTerminal()
  const updateTerminal = useUpdateTerminal()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: terminal?.name ?? '',
    },
  })

  const isSubmitting =
    createTerminal.isPending || updateTerminal.isPending || form.formState.isSubmitting

  async function onSubmit(values: TerminalFormValues) {
    setApiError(null)

    try {
      const payload = { name: values.name.trim() }

      if (submitOverride) {
        await submitOverride.onSubmit(payload)
        toast.success(submitOverride.successMessage)
      } else if (mode === 'create') {
        await createTerminal.mutateAsync(payload)
        toast.success('Terminal criado.')
      } else {
        await updateTerminal.mutateAsync({ id: terminal!.id, dto: payload })
        toast.success('Terminal atualizado.')
      }
      onSuccess?.()
    } catch (err) {
      setApiError(apiErrorMessage(err, 'Não foi possível salvar o terminal.'))
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, scrollToFirstError)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {apiError ? (
          <p role="alert" className="text-destructive flex items-start gap-1.5 text-sm">
            <AlertCircleIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>{apiError}</span>
          </p>
        ) : null}

        <DialogFooter>
          {onCancel ? (
            <Button type="button" variant="ghost" disabled={isSubmitting} onClick={onCancel}>
              Cancelar
            </Button>
          ) : null}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? 'Salvando…'
              : submitOverride?.submitLabel ?? (mode === 'create' ? 'Adicionar' : 'Salvar')}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
