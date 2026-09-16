import { UsersIcon } from 'lucide-react'
import { useState } from 'react'
import type { AdminAccountStatusFilter } from '@repo/types'
import { EmptyState } from '@/components/empty-state'
import { ListToolbar } from '@/components/list-toolbar'
import { PageHeader } from '@/components/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAdminAccounts } from '@/lib/queries/admin'
import { AdminAccountsTable } from '../components/admin-accounts-table'

const STATUS_OPTIONS: { value: AdminAccountStatusFilter; label: string }[] = [
  { value: 'PENDING_APPROVAL', label: 'Pendentes' },
  { value: 'ACTIVE', label: 'Ativas' },
  { value: 'SUSPENDED', label: 'Suspensas' },
  { value: 'ALL', label: 'Todas' },
]

export function AdminAccountsPage() {
  const [status, setStatus] = useState<AdminAccountStatusFilter>('PENDING_APPROVAL')
  const { data, isLoading } = useAdminAccounts(status)

  const count = data?.length ?? 0

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Contas" description="Aprove, suspenda ou reative contas de estabelecimento." />

      <ListToolbar
        actions={
          <Select value={status} onValueChange={(value) => setStatus(value as AdminAccountStatusFilter)}>
            <SelectTrigger className="w-40">
              <SelectValue>
                {(value: AdminAccountStatusFilter) =>
                  STATUS_OPTIONS.find((option) => option.value === value)?.label
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      >
        {isLoading ? <Skeleton className="h-4 w-28" /> : `${count} ${count === 1 ? 'conta' : 'contas'}`}
      </ListToolbar>

      <AdminAccountsTable
        data={data ?? []}
        isLoading={isLoading}
        emptyState={
          <EmptyState icon={UsersIcon} title="Nenhuma conta encontrada" description="Nada por aqui com este filtro." />
        }
      />
    </div>
  )
}
