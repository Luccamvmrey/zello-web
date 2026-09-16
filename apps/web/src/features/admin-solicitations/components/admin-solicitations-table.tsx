import { CheckIcon, EyeIcon, XIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import type {
  AdminSolicitation,
  CollaboratorSolicitationData,
  TerminalSolicitationData,
} from '@repo/types'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { DataTable, type DataTableColumn } from '@/components/data-table'
import { apiErrorMessage } from '@/lib/api'
import { useApproveSolicitation, useRejectSolicitation } from '@/lib/queries/admin-solicitations'
import { formatDateTime, formatDocument } from '@/lib/utils'
import { SOLICITATION_STATUS_BADGE } from '@/features/solicitations/components/solicitation-status-badge'
import { SolicitationDetailDialog } from './solicitation-detail-dialog'

interface AdminSolicitationsTableProps {
  data: AdminSolicitation[]
  isLoading?: boolean
  emptyState?: React.ReactNode
}

function summarizeData(solicitation: AdminSolicitation): string {
  if (solicitation.type === 'NEW_COLLABORATOR') {
    const data = solicitation.data as CollaboratorSolicitationData
    return `${data.name} — ${formatDocument(data.document, data.documentType)}`
  }

  return (solicitation.data as TerminalSolicitationData).name
}

export function AdminSolicitationsTable({
  data,
  isLoading,
  emptyState,
}: AdminSolicitationsTableProps) {
  const [viewing, setViewing] = useState<AdminSolicitation | null>(null)
  const [rejecting, setRejecting] = useState<AdminSolicitation | null>(null)
  const [notes, setNotes] = useState('')
  const approveSolicitation = useApproveSolicitation()
  const rejectSolicitation = useRejectSolicitation()

  async function handleApprove(solicitation: AdminSolicitation) {
    try {
      await approveSolicitation.mutateAsync({ id: solicitation.id })
      toast.success('Solicitação aprovada. O recurso foi criado.')
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Não foi possível aprovar a solicitação.'))
    }
  }

  async function handleConfirmReject() {
    if (!rejecting) return

    try {
      await rejectSolicitation.mutateAsync({ id: rejecting.id, dto: { notes: notes || undefined } })
      toast.success('Solicitação rejeitada.')
      setRejecting(null)
      setNotes('')
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Não foi possível rejeitar a solicitação.'))
    }
  }

  const columns: DataTableColumn<AdminSolicitation>[] = [
    {
      key: 'type',
      header: 'Tipo',
      render: (r) => (
        <Badge className="bg-muted text-muted-foreground">
          {r.type === 'NEW_COLLABORATOR' ? 'Colaborador' : 'Terminal'}
        </Badge>
      ),
    },
    { key: 'establishment', header: 'Estabelecimento', render: (r) => r.establishment.nomeFantasia },
    { key: 'details', header: 'Detalhes', render: (r) => summarizeData(r) },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <Badge className={SOLICITATION_STATUS_BADGE[r.status].className}>
          {SOLICITATION_STATUS_BADGE[r.status].label}
        </Badge>
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
      render: (r) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setViewing(r)}>
            <EyeIcon /> Ver
          </Button>
          {r.status === 'PENDING' ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleApprove(r)}
                disabled={approveSolicitation.isPending}
              >
                <CheckIcon /> Aprovar
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setRejecting(r)}>
                <XIcon /> Rejeitar
              </Button>
            </>
          ) : null}
        </div>
      ),
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

      <SolicitationDetailDialog
        solicitation={viewing}
        onOpenChange={(open) => !open && setViewing(null)}
      />

      <AlertDialog
        open={!!rejecting}
        onOpenChange={(open) => {
          if (!open) {
            setRejecting(null)
            setNotes('')
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rejeitar solicitação?</AlertDialogTitle>
            <AlertDialogDescription>
              {rejecting ? summarizeData(rejecting) : undefined}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Textarea
            placeholder="Observações (opcional)"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />

          <AlertDialogFooter>
            <AlertDialogCancel disabled={rejectSolicitation.isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={rejectSolicitation.isPending}
              onClick={handleConfirmReject}
            >
              Rejeitar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
