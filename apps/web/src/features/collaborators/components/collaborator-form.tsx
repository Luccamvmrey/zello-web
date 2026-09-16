import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircleIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import type { Collaborator, CreateCollaboratorDto } from '@repo/types'
import { Badge } from '@/components/ui/badge'
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
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { apiErrorMessage } from '@/lib/api'
import { useCreateCollaborator, useUpdateCollaborator } from '@/lib/queries/collaborators'
import {
  formatDocument,
  formatPhone,
  scrollToFirstError,
  unformatDocument,
  unformatPhone,
} from '@/lib/utils'
import { STATUS_BADGE } from './status-badge'

const formSchema = z
  .object({
    name: z.string().trim().min(1, 'Informe o nome.'),
    email: z.string().trim().email('Informe um e-mail válido.'),
    phone: z.string().optional(),
    documentType: z.enum(['CPF', 'CNPJ']),
    document: z.string(),
  })
  .refine(
    (data) =>
      unformatDocument(data.document).length === (data.documentType === 'CPF' ? 11 : 14),
    {
      message: 'Documento inválido para o tipo selecionado.',
      path: ['document'],
    },
  )

export type CollaboratorFormValues = z.infer<typeof formSchema>

/**
 * Quando presente, substitui as mutations internas de create/update — usado
 * pelo fluxo de solicitação (spec R.2), que envia o mesmo payload pra
 * `POST /solicitations` em vez de `POST /collaborators`.
 */
export interface CollaboratorFormSubmitOverride {
  onSubmit: (dto: CreateCollaboratorDto) => Promise<void>
  successMessage: string
  submitLabel: string
}

interface CollaboratorFormProps {
  mode: 'create' | 'edit'
  collaborator?: Collaborator
  onSuccess?: () => void
  /** Quando presente, o rodapé ganha um "Cancelar" ao lado do envio. */
  onCancel?: () => void
  submitOverride?: CollaboratorFormSubmitOverride
}

export function CollaboratorForm({
  mode,
  collaborator,
  onSuccess,
  onCancel,
  submitOverride,
}: CollaboratorFormProps) {
  const [apiError, setApiError] = useState<string | null>(null)
  const createCollaborator = useCreateCollaborator()
  const updateCollaborator = useUpdateCollaborator()

  const form = useForm<CollaboratorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: collaborator?.name ?? '',
      email: collaborator?.email ?? '',
      phone: collaborator?.phone ? formatPhone(collaborator.phone) : '',
      documentType: collaborator?.documentType ?? 'CPF',
      document: collaborator ? formatDocument(collaborator.document, collaborator.documentType) : '',
    },
  })

  const isSubmitting =
    createCollaborator.isPending || updateCollaborator.isPending || form.formState.isSubmitting

  const documentType = form.watch('documentType')

  useEffect(() => {
    if (mode === 'create') {
      form.setValue('document', '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentType])

  async function onSubmit(values: CollaboratorFormValues) {
    setApiError(null)

    try {
      if (submitOverride) {
        await submitOverride.onSubmit({
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone ? unformatPhone(values.phone) : undefined,
          document: unformatDocument(values.document),
          documentType: values.documentType,
        })
        toast.success(submitOverride.successMessage)
      } else if (mode === 'create') {
        await createCollaborator.mutateAsync({
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone ? unformatPhone(values.phone) : undefined,
          document: unformatDocument(values.document),
          documentType: values.documentType,
        })
        toast.success('Colaborador adicionado.')
      } else {
        await updateCollaborator.mutateAsync({
          id: collaborator!.id,
          dto: {
            name: values.name.trim(),
            email: values.email.trim(),
            phone: values.phone ? unformatPhone(values.phone) : undefined,
          },
        })
        toast.success('Colaborador atualizado.')
      }
      onSuccess?.()
    } catch (err) {
      setApiError(apiErrorMessage(err, 'Não foi possível salvar o colaborador.'))
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, scrollToFirstError)}
        className="flex flex-col gap-4"
      >
        {/* Em tela baixa (celular deitado) o formulário rola dentro do diálogo
            em vez de empurrar o rodapé para fora da tela. O padding lateral
            evita que o anel de foco seja cortado pelo overflow. */}
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  inputMode="numeric"
                  placeholder="(00) 00000-0000"
                  onChange={(event) => field.onChange(formatPhone(event.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {mode === 'create' ? (
          <>
            <FormField
              control={form.control}
              name="documentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de documento</FormLabel>
                  <FormControl>
                    <RadioGroup
                      className="flex flex-row gap-4"
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <label className="flex items-center gap-2 text-sm">
                        <RadioGroupItem value="CPF" />
                        CPF
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <RadioGroupItem value="CNPJ" />
                        CNPJ
                      </label>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="document"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documento</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      inputMode="numeric"
                      onChange={(event) =>
                        field.onChange(formatDocument(event.target.value, documentType))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        ) : (
          <>
            <div className="flex flex-col gap-1">
              <Label className="text-muted-foreground">Tipo de documento</Label>
              <p className="text-sm">{documentType}</p>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-muted-foreground">Documento</Label>
              <p className="text-sm">{formatDocument(form.getValues('document'), documentType)}</p>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-muted-foreground">Status</Label>
              <div>
                <Badge className={STATUS_BADGE[collaborator!.onboardingStatus].className}>
                  {STATUS_BADGE[collaborator!.onboardingStatus].label}
                </Badge>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-muted-foreground">ID Stone</Label>
              <p className="text-sm">{collaborator!.stoneRecebedorId ?? '—'}</p>
            </div>
          </>
        )}
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
            {isSubmitting
              ? 'Salvando…'
              : submitOverride?.submitLabel ?? (mode === 'create' ? 'Adicionar' : 'Salvar')}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
