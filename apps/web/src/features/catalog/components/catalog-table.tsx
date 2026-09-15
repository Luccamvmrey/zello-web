import { BanIcon, PencilIcon, RotateCcwIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import type { Service } from '@repo/types'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { DataTable, type DataTableColumn } from '@/components/data-table'
import { apiErrorMessage } from '@/lib/api'
import { useDeleteService, useReactivateService } from '@/lib/queries/services'
import { formatBRL } from '@/lib/utils'
import { ServiceFormDialog } from './service-form-dialog'

interface CatalogTableProps {
  data: Service[]
  isLoading?: boolean
  emptyState?: React.ReactNode
}

export function CatalogTable({ data, isLoading, emptyState }: CatalogTableProps) {
  const [editing, setEditing] = useState<Service | null>(null)
  const [deactivating, setDeactivating] = useState<Service | null>(null)
  const deleteService = useDeleteService()
  const reactivateService = useReactivateService()

  async function handleConfirmDeactivate() {
    if (!deactivating) return

    try {
      await deleteService.mutateAsync(deactivating.id)
      toast.success('Serviço desativado.')
      setDeactivating(null)
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Não foi possível desativar o serviço.'))
    }
  }

  async function handleReactivate(service: Service) {
    try {
      await reactivateService.mutateAsync(service.id)
      toast.success('Serviço reativado.')
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Não foi possível reativar o serviço.'))
    }
  }

  const columns: DataTableColumn<Service>[] = [
    { key: 'name', header: 'Nome', render: (s) => s.name },
    {
      key: 'price',
      header: 'Preço',
      className: 'text-right tabular',
      render: (s) => formatBRL(s.price),
    },
    {
      key: 'actions',
      header: 'Ações',
      className: 'text-right',
      render: (s) => (
        <div className="flex justify-end gap-1">
          <Tooltip>
            <TooltipTrigger
              render={<Button variant="ghost" size="icon-sm" aria-label="Editar serviço" />}
              onClick={() => setEditing(s)}
            >
              <PencilIcon />
            </TooltipTrigger>
            <TooltipContent>Editar</TooltipContent>
          </Tooltip>

          {s.active ? (
            <Tooltip>
              <TooltipTrigger
                render={<Button variant="ghost" size="icon-sm" aria-label="Desativar serviço" />}
                onClick={() => setDeactivating(s)}
              >
                <BanIcon />
              </TooltipTrigger>
              <TooltipContent>Desativar</TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger
                render={<Button variant="ghost" size="icon-sm" aria-label="Reativar serviço" />}
                onClick={() => handleReactivate(s)}
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
        getRowKey={(s) => s.id}
      />

      {editing ? (
        <ServiceFormDialog
          open={!!editing}
          onOpenChange={(open) => !open && setEditing(null)}
          mode="edit"
          service={editing}
        />
      ) : null}

      <ConfirmDialog
        open={!!deactivating}
        onOpenChange={(open) => !open && setDeactivating(null)}
        title="Desativar serviço?"
        description={
          deactivating ? `${deactivating.name} não aparecerá mais na lista padrão de serviços.` : undefined
        }
        onConfirm={handleConfirmDeactivate}
        confirmLabel="Desativar"
        isConfirming={deleteService.isPending}
      />
    </>
  )
}
