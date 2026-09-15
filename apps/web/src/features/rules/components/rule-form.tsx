import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircleIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import type { SplitRule } from '@repo/types'
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { apiErrorMessage } from '@/lib/api'
import { useCreateSplitRule, useUpdateSplitRule } from '@/lib/queries/split-rules'
import { scrollToFirstError } from '@/lib/utils'

const formSchema = z
  .object({
    name: z.string().trim().min(1, 'Informe o nome.'),
    type: z.enum(['PERCENTAGE', 'FIXED']),
    value: z.coerce.number({ error: 'Informe um valor.' }),
    description: z.string().optional(),
  })
  .refine(
    (data) => (data.type === 'PERCENTAGE' ? data.value >= 0.01 && data.value <= 100 : data.value > 0),
    {
      message: 'Valor fora do intervalo permitido para este tipo.',
      path: ['value'],
    },
  )

export type RuleFormValues = z.infer<typeof formSchema>

interface RuleFormProps {
  mode: 'create' | 'edit'
  rule?: SplitRule
  onSuccess?: (rule: SplitRule) => void
  /** Quando presente, o rodapé ganha um "Cancelar" ao lado do envio. */
  onCancel?: () => void
}

export function RuleForm({ mode, rule, onSuccess, onCancel }: RuleFormProps) {
  const [apiError, setApiError] = useState<string | null>(null)
  const createSplitRule = useCreateSplitRule()
  const updateSplitRule = useUpdateSplitRule()
  const isSubmitting = createSplitRule.isPending || updateSplitRule.isPending

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: rule?.name ?? '',
      type: rule?.type ?? 'PERCENTAGE',
      value: (rule?.value ?? '') as unknown as number,
      description: rule?.description ?? '',
    },
  })

  const type = form.watch('type')

  // O spec exige limpar o valor sempre que o tipo mudar (mesmo editando),
  // para evitar enviar 70 como R$70 por engano.
  useEffect(() => {
    form.setValue('value', '' as unknown as number)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  const valueLabel =
    type === 'PERCENTAGE' ? 'Porcentagem do colaborador (%)' : 'Valor retido pelo estabelecimento (R$)'

  async function onSubmit(values: RuleFormValues) {
    setApiError(null)

    try {
      const payload = {
        name: values.name.trim(),
        type: values.type,
        value: Number(values.value),
        description: values.description?.trim() || undefined,
      }

      if (mode === 'create') {
        const created = await createSplitRule.mutateAsync(payload)
        toast.success('Regra criada.')
        onSuccess?.(created)
      } else {
        const updated = await updateSplitRule.mutateAsync({ id: rule!.id, dto: payload })
        toast.success('Regra atualizada.')
        onSuccess?.(updated)
      }
    } catch (err) {
      setApiError(apiErrorMessage(err, 'Não foi possível salvar a regra.'))
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
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <FormControl>
                  <RadioGroup
                    className="flex flex-row gap-4"
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <label className="flex items-center gap-2 text-sm">
                      <RadioGroupItem value="PERCENTAGE" />
                      Percentual
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <RadioGroupItem value="FIXED" />
                      Fixo
                    </label>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{valueLabel}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value as string | number}
                    type="number"
                    step="0.01"
                    inputMode="decimal"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea {...field} />
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
