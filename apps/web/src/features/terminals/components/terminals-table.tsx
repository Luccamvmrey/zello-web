import { BanIcon, EyeIcon, PencilIcon, RotateCcwIcon } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import type { LogicalTerminalWithCount } from '@repo/types'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { DataTable, type DataTableColumn } from '@/components/data-table'
import { apiErrorMessage } from '@/lib/api'
import { useDeleteTerminal, useReactivateTerminal } from '@/lib/queries/terminals'
import { TerminalFormDialog } from './terminal-form-dialog'

interface TerminalsTableProps {
  data: LogicalTerminalWithCount[]
  isLoading?: boolean
  emptyState?: React.ReactNode
}

export function TerminalsTable({ data, isLoading, emptyState }: TerminalsTableProps) {
  const [editing, setEditing] = useState<LogicalTerminalWithCount | null>(null)
  const [deactivating, setDeactivating] = useState<LogicalTerminalWithCount | null>(null)
  const deleteTerminal = useDeleteTerminal()
  const reactivateTerminal = useReactivateTerminal()

  async function handleConfirmDeactivate() {
    if (!deactivating) return

    try {
      await deleteTerminal.mutateAsync(deactivating.id)
      toast.success('Terminal desativado.')
      setDeactivating(null)
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Não foi possível desativar o terminal.'))
    }
  }

  async function handleReactivate(terminal: LogicalTerminalWithCount) {
    try {
      await reactivateTerminal.mutateAsync(terminal.id)
      toast.success('Terminal reativado.')
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Não foi possível reativar o terminal.'))
    }
  }

  const columns: DataTableColumn<LogicalTerminalWithCount>[] = [
    { key: 'name', header: 'Nome', render: (r) => r.name },
    {
      key: 'physicalTerminalCount',
      header: 'Terminais Físicos',
      render: (r) => (r.physicalTerminalCount > 0 ? `${r.physicalTerminalCount} vinculados` : 'Nenhum'),
    },
    {
      key: 'actions',
      header: 'Ações',
      className: 'text-right',
      render: (r) => (
        <div className="flex justify-end gap-1">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  render={<Link to={`/terminals/${r.id}`} />}
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Ver detalhes do terminal"
                />
              }
            >
              <EyeIcon />
            </TooltipTrigger>
            <TooltipContent>Ver detalhes</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={<Button variant="ghost" size="icon-sm" aria-label="Editar terminal" />}
              onClick={() => setEditing(r)}
            >
              <PencilIcon />
            </TooltipTrigger>
            <TooltipContent>Editar</TooltipContent>
          </Tooltip>

          {r.active ? (
            <Tooltip>
              <TooltipTrigger
                render={<Button variant="ghost" size="icon-sm" aria-label="Desativar terminal" />}
                onClick={() => setDeactivating(r)}
              >
                <BanIcon />
              </TooltipTrigger>
              <TooltipContent>Desativar</TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger
                render={<Button variant="ghost" size="icon-sm" aria-label="Reativar terminal" />}
                onClick={() => handleReactivate(r)}
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
        getRowKey={(r) => r.id}
      />

      {editing ? (
        <TerminalFormDialog
          open={!!editing}
          onOpenChange={(open) => !open && setEditing(null)}
          mode="edit"
          terminal={editing}
        />
      ) : null}

      <ConfirmDialog
        open={!!deactivating}
        onOpenChange={(open) => !open && setDeactivating(null)}
        title="Desativar terminal?"
        description={
          deactivating ? `${deactivating.name} não aparecerá mais na lista padrão de terminais.` : undefined
        }
        onConfirm={handleConfirmDeactivate}
        confirmLabel="Desativar"
        isConfirming={deleteTerminal.isPending}
      />
    </>
  )
}
