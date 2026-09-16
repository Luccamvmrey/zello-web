import type { Collaborator } from '@repo/types'
import { Badge } from '@/components/ui/badge'
import { DataTable, type DataTableColumn } from '@/components/data-table'
import { formatDocument } from '@/lib/utils'
import { STATUS_BADGE } from './status-badge'

interface CollaboratorsTableProps {
  data: Collaborator[]
  isLoading?: boolean
  emptyState?: React.ReactNode
}

/**
 * Read-only: criar/editar/desativar colaborador agora passa pelo fluxo de
 * solicitação (spec R.2) — os endpoints de escrita são @AdminOnly().
 */
export function CollaboratorsTable({ data, isLoading, emptyState }: CollaboratorsTableProps) {
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
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      emptyState={emptyState}
      getRowKey={(c) => c.id}
    />
  )
}
