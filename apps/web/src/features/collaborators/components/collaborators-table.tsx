import { PencilIcon, RotateCcwIcon, UserXIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import type { Collaborator } from '@repo/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { DataTable, type DataTableColumn } from '@/components/data-table'
import { apiErrorMessage } from '@/lib/api'
import { useDeleteCollaborator, useReactivateCollaborator } from '@/lib/queries/collaborators'
import { formatDocument } from '@/lib/utils'
import { CollaboratorFormDialog } from './collaborator-form-dialog'
import { STATUS_BADGE } from './status-badge'

interface CollaboratorsTableProps {
  data: Collaborator[]
  isLoading?: boolean
  emptyState?: React.ReactNode
}

export function CollaboratorsTable({ data, isLoading, emptyState }: CollaboratorsTableProps) {
  const [editing, setEditing] = useState<Collaborator | null>(null)
  const [deactivating, setDeactivating] = useState<Collaborator | null>(null)
  const deleteCollaborator = useDeleteCollaborator()
  const reactivateCollaborator = useReactivateCollaborator()

  async function handleConfirmDeactivate() {
    if (!deactivating) return

    try {
      await deleteCollaborator.mutateAsync(deactivating.id)
      toast.success('Colaborador desativado.')
      setDeactivating(null)
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Não foi possível desativar o colaborador.'))
    }
  }

  async function handleReactivate(collaborator: Collaborator) {
    try {
      await reactivateCollaborator.mutateAsync(collaborator.id)
      toast.success('Colaborador reativado.')
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Não foi possível reativar o colaborador.'))
    }
  }

  const columns: DataTableColumn<Collaborator>[] = [
    { key: 'name', header: 'Nome', render: (c) => c.name },
    {
      key: 'document',
      header: 'Documento',
      className: 'tabular',
      render: (c) => formatDocument(c.document, c.documentType),
    },
    { key: 'email', header: 'Email', render: (c) => c.email },
    {
      key: 'status',
      header: 'Status',
      render: (c) => (
        <Badge className={STATUS_BADGE[c.onboardingStatus].className}>
          {STATUS_BADGE[c.onboardingStatus].label}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Ações',
      className: 'text-right',
      render: (c) => (
        <div className="flex justify-end gap-1">
          <Tooltip>
            <TooltipTrigger
              render={<Button variant="ghost" size="icon-sm" aria-label="Editar colaborador" />}
              onClick={() => setEditing(c)}
            >
              <PencilIcon />
            </TooltipTrigger>
            <TooltipContent>Editar</TooltipContent>
          </Tooltip>

          {c.active ? (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button variant="ghost" size="icon-sm" aria-label="Desativar colaborador" />
                }
                onClick={() => setDeactivating(c)}
              >
                <UserXIcon />
              </TooltipTrigger>
              <TooltipContent>Desativar</TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button variant="ghost" size="icon-sm" aria-label="Reativar colaborador" />
                }
                onClick={() => handleReactivate(c)}
              >
                <RotateCcwIcon />
              </TooltipTrigger>
              <TooltipContent>Reativar</TooltipContent>
            </Tooltip>
          )}
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
        getRowKey={(c) => c.id}
      />

      {editing ? (
        <CollaboratorFormDialog
          open={!!editing}
          onOpenChange={(open) => !open && setEditing(null)}
          mode="edit"
          collaborator={editing}
        />
      ) : null}

      <ConfirmDialog
        open={!!deactivating}
        onOpenChange={(open) => !open && setDeactivating(null)}
        title="Desativar colaborador?"
        description={
          deactivating
            ? `${deactivating.name} não aparecerá mais na lista padrão de colaboradores.`
            : undefined
        }
        onConfirm={handleConfirmDeactivate}
        confirmLabel="Desativar"
        isConfirming={deleteCollaborator.isPending}
      />
    </>
  )
}
