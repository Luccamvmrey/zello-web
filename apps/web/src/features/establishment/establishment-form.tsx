import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { Establishment } from '@repo/types'
import { Button } from '@/components/ui/button'
import { FormActions } from '@/components/form-actions'
import { FormSection } from '@/components/form-section'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useCreateEstablishment,
  useUpdateEstablishment,
} from '@/lib/queries/establishments'
import { apiErrorMessage } from '@/lib/api'
import {
  formatCep,
  formatCnpj,
  scrollToFirstError,
  unformatCep,
  unformatCnpj,
} from '@/lib/utils'
import { toast } from 'sonner'
import { useState } from 'react'
import { AlertCircleIcon } from 'lucide-react'
import { BR_STATES } from './br-states'

export const SEGMENTO_OPTIONS = [
  'Clínica Veterinária',
  'Salão de Beleza',
  'Barbearia',
  'Consultório Médico',
  'Consultório Odontológico',
  'Estúdio de Tatuagem',
] as const

const OUTRO = 'Outro'

const formSchema = z
  .object({
    cnpj: z
      .string()
      .refine((value) => unformatCnpj(value).length === 14, 'CNPJ deve conter 14 dígitos.'),
    nomeFantasia: z.string().trim().min(1, 'Informe o nome fantasia.'),
    razaoSocial: z.string().trim().min(1, 'Informe a razão social.'),
    segmento: z.string().min(1, 'Selecione um segmento.'),
    segmentoOutro: z.string().optional(),
    cep: z
      .string()
      .optional()
      .refine((value) => !value || unformatCep(value).length === 8, 'CEP deve conter 8 dígitos.'),
    logradouro: z.string().optional(),
    numero: z.string().optional(),
    complemento: z.string().optional(),
    bairro: z.string().optional(),
    cidade: z.string().optional(),
    estado: z.string().optional(),
    faturamento: z.string().optional(),
    encargosTributarios: z
      .string()
      .optional()
      .refine((value) => {
        if (!value) return true
        const num = Number(value)
        return num >= 0 && num <= 100
      }, 'Deve estar entre 0 e 100.'),
    numPdvs: z
      .string()
      .optional()
      .refine((value) => {
        if (!value) return true
        return Number(value) >= 1
      }, 'Deve ser ao menos 1.'),
  })
  .refine((data) => data.segmento !== OUTRO || !!data.segmentoOutro?.trim(), {
    message: 'Informe o segmento.',
    path: ['segmentoOutro'],
  })

export type EstablishmentFormValues = z.infer<typeof formSchema>

interface EstablishmentFormProps {
  mode: 'create' | 'edit'
  defaultValues?: Partial<EstablishmentFormValues>
  onSuccess?: (establishment: Establishment) => void
}

const EMPTY_VALUES: EstablishmentFormValues = {
  cnpj: '',
  nomeFantasia: '',
  razaoSocial: '',
  segmento: '',
  segmentoOutro: '',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  faturamento: '',
  encargosTributarios: '',
  numPdvs: '',
}

export function EstablishmentForm({ mode, defaultValues, onSuccess }: EstablishmentFormProps) {
  const [apiError, setApiError] = useState<string | null>(null)
  const createEstablishment = useCreateEstablishment()
  const updateEstablishment = useUpdateEstablishment()
  const isSubmitting = createEstablishment.isPending || updateEstablishment.isPending

  const initialValues = { ...EMPTY_VALUES, ...defaultValues }

  const form = useForm<EstablishmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  })

  const segmento = form.watch('segmento')
  const isDirty = form.formState.isDirty

  async function onSubmit(values: EstablishmentFormValues) {
    setApiError(null)

    const payload = {
      cnpj: unformatCnpj(values.cnpj),
      nomeFantasia: values.nomeFantasia.trim(),
      razaoSocial: values.razaoSocial.trim(),
      segmento: values.segmento === OUTRO ? values.segmentoOutro!.trim() : values.segmento,
      cep: values.cep ? unformatCep(values.cep) : undefined,
      logradouro: values.logradouro?.trim() || undefined,
      numero: values.numero?.trim() || undefined,
      complemento: values.complemento?.trim() || undefined,
      bairro: values.bairro?.trim() || undefined,
      cidade: values.cidade?.trim() || undefined,
      estado: values.estado || undefined,
      faturamento: values.faturamento ? Number(values.faturamento) : undefined,
      encargosTributarios: values.encargosTributarios
        ? Number(values.encargosTributarios)
        : undefined,
      numPdvs: values.numPdvs ? Number(values.numPdvs) : undefined,
    }

    try {
      if (mode === 'create') {
        const establishment = await createEstablishment.mutateAsync(payload)
        toast.success('Estabelecimento cadastrado.')
        onSuccess?.(establishment)
      } else {
        const establishment = await updateEstablishment.mutateAsync(payload)
        toast.success('Estabelecimento atualizado.')
        form.reset(values)
        onSuccess?.(establishment)
      }
    } catch (err) {
      setApiError(apiErrorMessage(err, 'Não foi possível salvar o estabelecimento.'))
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, scrollToFirstError)}
        className="flex flex-col gap-8"
      >
        <p className="text-muted-foreground text-xs">
          Campos marcados com <span className="text-foreground">*</span> são obrigatórios.
        </p>

        <FormSection
          title="Identificação"
          description="Como o estabelecimento aparece nos documentos e no extrato."
        >
          <FormField
            control={form.control}
            name="cnpj"
            render={({ field }) => (
              <FormItem className="col-span-12 sm:col-span-6">
                <FormLabel required>CNPJ</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    inputMode="numeric"
                    aria-required="true"
                    placeholder="00.000.000/0000-00"
                    className="tabular"
                    onChange={(event) => field.onChange(formatCnpj(event.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nomeFantasia"
            render={({ field }) => (
              <FormItem className="col-span-12 sm:col-span-6">
                <FormLabel required>Nome Fantasia</FormLabel>
                <FormControl>
                  <Input {...field} aria-required="true" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="razaoSocial"
            render={({ field }) => (
              <FormItem className="col-span-12">
                <FormLabel required>Razão Social</FormLabel>
                <FormControl>
                  <Input {...field} aria-required="true" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="segmento"
            render={({ field }) => (
              <FormItem
                className={segmento === OUTRO ? 'col-span-12 sm:col-span-6' : 'col-span-12'}
              >
                <FormLabel required>Segmento</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full" aria-required="true">
                      <SelectValue placeholder="Selecione um segmento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SEGMENTO_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                    <SelectItem value={OUTRO}>{OUTRO}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {segmento === OUTRO ? (
            <FormField
              control={form.control}
              name="segmentoOutro"
              render={({ field }) => (
                <FormItem className="col-span-12 sm:col-span-6">
                  <FormLabel required>Qual segmento?</FormLabel>
                  <FormControl>
                    <Input {...field} aria-required="true" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}
        </FormSection>

        <FormSection
          title="Endereço"
          description="Onde o estabelecimento opera. Opcional, mas aparece no cadastro da Stone."
        >
          <FormField
            control={form.control}
            name="cep"
            render={({ field }) => (
              <FormItem className="col-span-12 sm:col-span-3">
                <FormLabel>CEP</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    inputMode="numeric"
                    placeholder="00000-000"
                    className="tabular"
                    onChange={(event) => field.onChange(formatCep(event.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="logradouro"
            render={({ field }) => (
              <FormItem className="col-span-12 sm:col-span-9">
                <FormLabel>Rua / Avenida</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numero"
            render={({ field }) => (
              <FormItem className="col-span-12 sm:col-span-3">
                <FormLabel>Número</FormLabel>
                <FormControl>
                  <Input {...field} className="tabular" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="complemento"
            render={({ field }) => (
              <FormItem className="col-span-12 sm:col-span-4">
                <FormLabel>Complemento</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bairro"
            render={({ field }) => (
              <FormItem className="col-span-12 sm:col-span-5">
                <FormLabel>Bairro</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cidade"
            render={({ field }) => (
              <FormItem className="col-span-12 sm:col-span-8">
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estado"
            render={({ field }) => (
              <FormItem className="col-span-12 sm:col-span-4">
                <FormLabel>Estado</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="UF" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {BR_STATES.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection
          title="Operação"
          description="Usado para estimar quanto o Zello economiza por mês. Dá para ajustar depois."
        >
          <FormField
            control={form.control}
            name="faturamento"
            render={({ field }) => (
              <FormItem className="col-span-12 sm:col-span-4">
                <FormLabel>Faturamento mensal estimado</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">R$</span>
                    <Input {...field} type="number" min={0} step="0.01" className="tabular" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="encargosTributarios"
            render={({ field }) => (
              <FormItem className="col-span-12 sm:col-span-4">
                <FormLabel>Encargos tributários médios</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input
                      {...field}
                      type="number"
                      min={0}
                      max={100}
                      step="0.01"
                      className="tabular"
                    />
                    <span className="text-muted-foreground text-sm">%</span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numPdvs"
            render={({ field }) => (
              <FormItem className="col-span-12 sm:col-span-4">
                <FormLabel>Número de PDVs</FormLabel>
                <FormControl>
                  <Input {...field} type="number" min={1} placeholder="1" className="tabular" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        {apiError ? (
          <p
            role="alert"
            className="text-destructive flex items-start gap-1.5 text-sm"
          >
            <AlertCircleIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>{apiError}</span>
          </p>
        ) : null}

        <FormActions>
          {mode === 'edit' ? (
            <Button
              type="button"
              variant="ghost"
              size="lg"
              disabled={isSubmitting || !isDirty}
              onClick={() => {
                setApiError(null)
                form.reset(initialValues)
              }}
            >
              Descartar alterações
            </Button>
          ) : null}

          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting
              ? 'Salvando…'
              : mode === 'create'
                ? 'Começar a usar o Zello'
                : 'Salvar alterações'}
          </Button>
        </FormActions>
      </form>
    </Form>
  )
}
