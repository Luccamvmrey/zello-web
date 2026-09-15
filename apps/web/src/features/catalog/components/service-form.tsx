import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import type { Service } from '@repo/types'
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
import { useCreateService, useUpdateService } from '@/lib/queries/services'
import { scrollToFirstError } from '@/lib/utils'

const formSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome.'),
  price: z.coerce.number({ error: 'Informe um valor.' }).positive('O preço deve ser maior que zero.'),
})

export type ServiceFormValues = z.infer<typeof formSchema>

interface ServiceFormProps {
  mode: 'create' | 'edit'
  service?: Service
  onSuccess?: (service: Service) => void
  /** Quando presente, o rodapé ganha um "Cancelar" ao lado do envio. */
  onCancel?: () => void
}

export function ServiceForm({ mode, service, onSuccess, onCancel }: ServiceFormProps) {
  const [apiError, setApiError] = useState<string | null>(null)
  const createService = useCreateService()
  const updateService = useUpdateService()
  const isSubmitting = createService.isPending || updateService.isPending

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: service?.name ?? '',
      price: (service?.price ?? '') as unknown as number,
    },
  })

  async function onSubmit(values: ServiceFormValues) {
    setApiError(null)

    try {
      const payload = {
        name: values.name.trim(),
        price: Number(values.price),
      }

      if (mode === 'create') {
        const created = await createService.mutateAsync(payload)
        toast.success('Serviço criado.')
        onSuccess?.(created)
      } else {
        const updated = await updateService.mutateAsync({ id: service!.id, dto: payload })
        toast.success('Serviço atualizado.')
        onSuccess?.(updated)
      }
    } catch (err) {
      setApiError(apiErrorMessage(err, 'Não foi possível salvar o serviço.'))
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, scrollToFirstError)}
        className="flex flex-col gap-4"
      >
        <div className="-mx-1 flex max-h-[60vh] flex-col gap-4 overflow-y-auto px-1">
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

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">R$</span>
                    <Input
                      {...field}
                      value={field.value as string | number}
                      type="number"
                      step="0.01"
                      inputMode="decimal"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
