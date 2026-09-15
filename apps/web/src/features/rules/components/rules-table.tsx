import { BanIcon, PencilIcon, RotateCcwIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import type { SplitRule } from '@repo/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { DataTable, type DataTableColumn } from '@/components/data-table'
import { apiErrorMessage } from '@/lib/api'
import { useDeleteSplitRule, useReactivateSplitRule } from '@/lib/queries/split-rules'
import { formatBRL, formatPercentage } from '@/lib/utils'
import { RuleFormDialog } from './rule-form-dialog'
import { TYPE_BADGE } from './rule-type-badge'

interface RulesTableProps {
  data: SplitRule[]
  isLoading?: boolean
  emptyState?: React.ReactNode
}

export function RulesTable({ data, isLoading, emptyState }: RulesTableProps) {
  const [editing, setEditing] = useState<SplitRule | null>(null)
  const [deactivating, setDeactivating] = useState<SplitRule | null>(null)
  const deleteSplitRule = useDeleteSplitRule()
  const reactivateSplitRule = useReactivateSplitRule()

  async function handleConfirmDeactivate() {
    if (!deactivating) return

    try {
      await deleteSplitRule.mutateAsync(deactivating.id)
      toast.success('Regra desativada.')
      setDeactivating(null)
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Não foi possível desativar a regra.'))
    }
  }

  async function handleReactivate(rule: SplitRule) {
    try {
      await reactivateSplitRule.mutateAsync(rule.id)
      toast.success('Regra reativada.')
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Não foi possível reativar a regra.'))
    }
  }

  const columns: DataTableColumn<SplitRule>[] = [
    { key: 'name', header: 'Nome', render: (r) => r.name },
    {
      key: 'type',
      header: 'Tipo',
      render: (r) => (
        <Badge className={TYPE_BADGE[r.type].className}>{TYPE_BADGE[r.type].label}</Badge>
      ),
    },
    {
      key: 'value',
      header: 'Valor',
      className: 'text-right tabular',
      render: (r) => (r.type === 'PERCENTAGE' ? formatPercentage(r.value) : formatBRL(r.value)),
    },
    {
      key: 'description',
      header: 'Descrição',
      render: (r) => <span className="block max-w-[220px] truncate">{r.description ?? '—'}</span>,
    },
    {
      key: 'actions',
      header: 'Ações',
      className: 'text-right',
      render: (r) => (
        <div className="flex justify-end gap-1">
          <Tooltip>
            <TooltipTrigger
              render={<Button variant="ghost" size="icon-sm" aria-label="Editar regra" />}
              onClick={() => setEditing(r)}
            >
              <PencilIcon />
            </TooltipTrigger>
            <TooltipContent>Editar</TooltipContent>
          </Tooltip>

          {r.active ? (
            <Tooltip>
              <TooltipTrigger
                render={<Button variant="ghost" size="icon-sm" aria-label="Desativar regra" />}
                onClick={() => setDeactivating(r)}
              >
                <BanIcon />
              </TooltipTrigger>
              <TooltipContent>Desativar</TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger
                render={<Button variant="ghost" size="icon-sm" aria-label="Reativar regra" />}
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
        <RuleFormDialog
          open={!!editing}
          onOpenChange={(open) => !open && setEditing(null)}
          mode="edit"
          rule={editing}
        />
      ) : null}

      <ConfirmDialog
        open={!!deactivating}
        onOpenChange={(open) => !open && setDeactivating(null)}
        title="Desativar regra?"
        description={
          deactivating ? `${deactivating.name} não aparecerá mais na lista padrão de regras.` : undefined
        }
        onConfirm={handleConfirmDeactivate}
        confirmLabel="Desativar"
        isConfirming={deleteSplitRule.isPending}
      />
    </>
  )
}
