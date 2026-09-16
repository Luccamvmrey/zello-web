import { EyeIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { LogicalTerminalWithCount } from '@repo/types'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { DataTable, type DataTableColumn } from '@/components/data-table'

interface TerminalsTableProps {
  data: LogicalTerminalWithCount[]
  isLoading?: boolean
  emptyState?: React.ReactNode
}

/**
 * Read-only: criar/editar/desativar terminal agora passa pelo fluxo de
 * solicitação (spec R.2) — os endpoints de escrita são @AdminOnly().
 */
export function TerminalsTable({ data, isLoading, emptyState }: TerminalsTableProps) {
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
        <div className="flex justify-end">
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
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      emptyState={emptyState}
      getRowKey={(r) => r.id}
    />
  )
}
