import type {
  AdminSolicitation,
  CollaboratorSolicitationData,
  TerminalSolicitationData,
} from '@repo/types'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { formatDateTime, formatDocument } from '@/lib/utils'
import { SOLICITATION_STATUS_BADGE } from '@/features/solicitations/components/solicitation-status-badge'

interface SolicitationDetailDialogProps {
  solicitation: AdminSolicitation | null
  onOpenChange: (open: boolean) => void
}

const TYPE_LABEL: Record<AdminSolicitation['type'], string> = {
  NEW_COLLABORATOR: 'Novo colaborador',
  NEW_TERMINAL: 'Novo terminal',
}

export function SolicitationDetailDialog({
  solicitation,
  onOpenChange,
}: SolicitationDetailDialogProps) {
  return (
    <Dialog open={!!solicitation} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalhes da solicitação</DialogTitle>
        </DialogHeader>

        {solicitation ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Label className="text-muted-foreground">Tipo</Label>
              <p className="text-sm">{TYPE_LABEL[solicitation.type]}</p>
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-muted-foreground">Data de criação</Label>
              <p className="text-sm">{formatDateTime(solicitation.createdAt)}</p>
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-muted-foreground">Estabelecimento</Label>
              <p className="text-sm">
                {solicitation.establishment.nomeFantasia} — {solicitation.establishment.cnpj}
              </p>
            </div>

            {solicitation.type === 'NEW_COLLABORATOR' ? (
              <>
                <div className="flex flex-col gap-1">
                  <Label className="text-muted-foreground">Nome</Label>
                  <p className="text-sm">
                    {(solicitation.data as CollaboratorSolicitationData).name}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-muted-foreground">Documento</Label>
                  <p className="text-sm">
                    {formatDocument(
                      (solicitation.data as CollaboratorSolicitationData).document,
                      (solicitation.data as CollaboratorSolicitationData).documentType,
                    )}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="text-sm">
                    {(solicitation.data as CollaboratorSolicitationData).email}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-1">
                <Label className="text-muted-foreground">Nome do terminal</Label>
                <p className="text-sm">{(solicitation.data as TerminalSolicitationData).name}</p>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <Label className="text-muted-foreground">Status</Label>
              <div>
                <Badge className={SOLICITATION_STATUS_BADGE[solicitation.status].className}>
                  {SOLICITATION_STATUS_BADGE[solicitation.status].label}
                </Badge>
              </div>
            </div>

            {solicitation.status !== 'PENDING' ? (
              <>
                <div className="flex flex-col gap-1">
                  <Label className="text-muted-foreground">Revisada em</Label>
                  <p className="text-sm">
                    {solicitation.reviewedAt ? formatDateTime(solicitation.reviewedAt) : '—'}
                  </p>
                </div>
                {solicitation.adminNotes ? (
                  <div className="flex flex-col gap-1">
                    <Label className="text-muted-foreground">Observações</Label>
                    <p className="text-sm">{solicitation.adminNotes}</p>
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
