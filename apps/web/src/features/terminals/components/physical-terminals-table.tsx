import type { PhysicalTerminalSummary } from '@repo/types'
import { Badge } from '@/components/ui/badge'
import { DataTable, type DataTableColumn } from '@/components/data-table'
import { formatDateTime } from '@/lib/utils'
import { STATUS_BADGE } from './terminal-status-badge'

interface PhysicalTerminalsTableProps {
  data: PhysicalTerminalSummary[]
  isLoading?: boolean
  emptyState?: React.ReactNode
}

export function PhysicalTerminalsTable({
  data,
  isLoading,
  emptyState,
}: PhysicalTerminalsTableProps) {
  const columns: DataTableColumn<PhysicalTerminalSummary>[] = [
    { key: 'machineSerial', header: 'Nº de Série', render: (r) => r.machineSerial },
    { key: 'deviceName', header: 'Dispositivo', render: (r) => r.deviceName ?? '—' },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <Badge className={STATUS_BADGE[r.status].className}>{STATUS_BADGE[r.status].label}</Badge>
      ),
    },
    {
      key: 'lastSeenAt',
      header: 'Último acesso',
      render: (r) => (r.lastSeenAt ? formatDateTime(r.lastSeenAt) : 'Nunca'),
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
