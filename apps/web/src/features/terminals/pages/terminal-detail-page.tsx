import { ArrowLeftIcon } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { useTerminal } from '@/lib/queries/terminals'
import { PhysicalTerminalsTable } from '../components/physical-terminals-table'

export function TerminalDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError } = useTerminal(id ?? '')

  return (
    <div className="flex flex-col gap-6">
      <Button
        render={<Link to="/terminals" />}
        variant="ghost"
        size="sm"
        className="w-fit"
      >
        <ArrowLeftIcon />
        Voltar
      </Button>

      {isError ? (
        <EmptyState title="Terminal não encontrado" description="Ele pode ter sido removido ou o link está incorreto." />
      ) : (
        <>
          <div className="flex flex-col gap-3">
            <PageHeader title={data?.name ?? (isLoading ? 'Carregando…' : '')} />
            {data ? (
              <Badge
                className={
                  data.active ? 'bg-success/12 text-success w-fit' : 'bg-muted text-muted-foreground w-fit'
                }
              >
                {data.active ? 'Ativo' : 'Inativo'}
              </Badge>
            ) : null}
          </div>

          <PhysicalTerminalsTable
            data={data?.physicalTerminals ?? []}
            isLoading={isLoading}
            emptyState={
              <EmptyState
                title="Nenhum terminal físico vinculado"
                description="O vínculo é feito pelo aplicativo do terminal."
              />
            }
          />
        </>
      )}
    </div>
  )
}
