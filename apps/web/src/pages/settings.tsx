import type { EstablishmentWithCounts } from '@repo/types'
import { PageHeader } from '@/components/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import {
  EstablishmentForm,
  SEGMENTO_OPTIONS,
  type EstablishmentFormValues,
} from '@/features/establishment/establishment-form'
import { useEstablishmentMe } from '@/lib/queries/establishments'
import { formatCep, formatCnpj } from '@/lib/utils'

function mapToFormValues(
  establishment: EstablishmentWithCounts,
): Partial<EstablishmentFormValues> {
  const isKnownSegmento = (SEGMENTO_OPTIONS as readonly string[]).includes(
    establishment.segmento,
  )

  return {
    cnpj: formatCnpj(establishment.cnpj),
    nomeFantasia: establishment.nomeFantasia,
    razaoSocial: establishment.razaoSocial,
    segmento: isKnownSegmento ? establishment.segmento : 'Outro',
    segmentoOutro: isKnownSegmento ? '' : establishment.segmento,
    cep: establishment.cep ? formatCep(establishment.cep) : '',
    logradouro: establishment.logradouro ?? '',
    numero: establishment.numero ?? '',
    complemento: establishment.complemento ?? '',
    bairro: establishment.bairro ?? '',
    cidade: establishment.cidade ?? '',
    estado: establishment.estado ?? '',
    faturamento: establishment.faturamento?.toString() ?? '',
    encargosTributarios: establishment.encargosTributarios?.toString() ?? '',
    numPdvs: establishment.numPdvs.toString(),
  }
}

/** Espelha a forma real do formulário — três seções — em vez de três barras genéricas. */
function FormSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      {[4, 7, 3].map((fieldCount, section) => (
        <div key={section} className="flex flex-col gap-4">
          <Skeleton className="h-5 w-32" />
          <div className="grid grid-cols-12 gap-4">
            {Array.from({ length: fieldCount }).map((_, field) => (
              <div key={field} className="col-span-12 flex flex-col gap-2 sm:col-span-6">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function SettingsPage() {
  const { data, isLoading } = useEstablishmentMe()

  return (
    <section className="max-w-2xl">
      <PageHeader
        title="Configurações"
        description="Dados do estabelecimento e preferências da conta."
      />

      <div className="mt-8">
        {isLoading || !data ? (
          <FormSkeleton />
        ) : (
          <EstablishmentForm mode="edit" defaultValues={mapToFormValues(data)} />
        )}
      </div>
    </section>
  )
}
