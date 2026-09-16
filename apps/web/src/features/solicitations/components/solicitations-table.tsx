import { InfoIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import type {
  CollaboratorSolicitationData,
  Solicitation,
  SolicitationType,
  TerminalSolicitationData,
} from '@repo/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { DataTable, type DataTableColumn } from '@/components/data-table'
import { apiErrorMessage } from '@/lib/api'
import { useCancelSolicitation } from '@/lib/queries/solicitations'
import { formatDateTime, formatDocument } from '@/lib/utils'
import { SOLICITATION_STATUS_BADGE } from './solicitation-status-badge'

interface SolicitationsTableProps {
  type: SolicitationType
  data: Solicitation[]
  isLoading?: boolean
  emptyState?: React.ReactNode
}

export function SolicitationsTable({ type, data, isLoading, emptyState }: SolicitationsTableProps) {
  const [cancelling, setCancelling] = useState<Solicitation | null>(null)
  const cancelSolicitation = useCancelSolicitation()

  async function handleConfirmCancel() {
    if (!cancelling) return

    try {
      await cancelSolicitation.mutateAsync(cancelling.id)
      toast.success('Solicitação cancelada.')
      setCancelling(null)
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Não foi possível cancelar a solicitação.'))
    }
  }

  const baseColumns: DataTableColumn<Solicitation>[] =
    type === 'NEW_COLLABORATOR'
      ? [
          {
            key: 'name',
            header: 'Nome',
            render: (r) => (r.data as CollaboratorSolicitationData).name,
          },
          {
            key: 'document',
            header: 'Documento',
            className: 'tabular',
            render: (r) => {
              const data = r.data as CollaboratorSolicitationData
              return formatDocument(data.document, data.documentType)
            },
          },
          {
            key: 'email',
            header: 'Email',
            render: (r) => (r.data as CollaboratorSolicitationData).email,
          },
        ]
      : [
          {
            key: 'name',
            header: 'Nome',
            render: (r) => (r.data as TerminalSolicitationData).name,
          },
        ]

  const columns: DataTableColumn<Solicitation>[] = [
    ...baseColumns,
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <div className="flex items-center gap-1.5">
          <Badge className={SOLICITATION_STATUS_BADGE[r.status].className}>
            {SOLICITATION_STATUS_BADGE[r.status].label}
          </Badge>
          {r.status === 'REJECTED' && r.adminNotes ? (
            <Tooltip>
              <TooltipTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Ver motivo da rejeição" />}>
                <InfoIcon />
              </TooltipTrigger>
              <TooltipContent>{r.adminNotes}</TooltipContent>
            </Tooltip>
          ) : null}
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Data',
      render: (r) => formatDateTime(r.createdAt),
    },
    {
      key: 'actions',
      header: 'Ações',
      className: 'text-right',
      render: (r) =>
        r.status === 'PENDING' ? (
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={() => setCancelling(r)}>
              Cancelar
            </Button>
          </div>
        ) : null,
    },
  ]

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        emptyState={emptyState}
        getRowKey={(r) => r.id}
      />

      <ConfirmDialog
        open={!!cancelling}
        onOpenChange={(open) => !open && setCancelling(null)}
        title="Cancelar solicitação?"
        description="A solicitação será removida e não poderá mais ser aprovada."
        onConfirm={handleConfirmCancel}
        confirmLabel="Cancelar solicitação"
        isConfirming={cancelSolicitation.isPending}
      />
    </>
  )
}
