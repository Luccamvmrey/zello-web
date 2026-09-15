import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import type { LogicalTerminal } from '@repo/types'
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

interface TerminalFormProps {
  mode: 'create' | 'edit'
  terminal?: LogicalTerminal
  onSuccess?: (terminal: LogicalTerminal) => void
  /** Quando presente, o rodapé ganha um "Cancelar" ao lado do envio. */
  onCancel?: () => void
}

export function TerminalForm({ mode, terminal, onSuccess, onCancel }: TerminalFormProps) {
  const [apiError, setApiError] = useState<string | null>(null)
  const createTerminal = useCreateTerminal()
  const updateTerminal = useUpdateTerminal()
  const isSubmitting = createTerminal.isPending || updateTerminal.isPending

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: terminal?.name ?? '',
    },
  })

  async function onSubmit(values: TerminalFormValues) {
    setApiError(null)

    try {
      const payload = { name: values.name.trim() }

      if (mode === 'create') {
        const created = await createTerminal.mutateAsync(payload)
        toast.success('Terminal criado.')
        onSuccess?.(created)
      } else {
        const updated = await updateTerminal.mutateAsync({ id: terminal!.id, dto: payload })
        toast.success('Terminal atualizado.')
        onSuccess?.(updated)
      }
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
            {isSubmitting ? 'Salvando…' : mode === 'create' ? 'Adicionar' : 'Salvar'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
