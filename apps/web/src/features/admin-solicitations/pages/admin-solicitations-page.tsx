import { ClipboardListIcon } from 'lucide-react'
import { useState } from 'react'
import type { SolicitationStatusFilter, SolicitationType } from '@repo/types'
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
import { useAdminEstablishments } from '@/lib/queries/admin'
import { useAdminSolicitations } from '@/lib/queries/admin-solicitations'
import { AdminSolicitationsTable } from '../components/admin-solicitations-table'

const STATUS_OPTIONS: { value: SolicitationStatusFilter; label: string }[] = [
  { value: 'PENDING', label: 'Pendentes' },
  { value: 'APPROVED', label: 'Aprovadas' },
  { value: 'REJECTED', label: 'Rejeitadas' },
  { value: 'ALL', label: 'Todas' },
]

const TYPE_OPTIONS: { value: SolicitationType | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Todos os tipos' },
  { value: 'NEW_COLLABORATOR', label: 'Colaborador' },
  { value: 'NEW_TERMINAL', label: 'Terminal' },
]

export function AdminSolicitationsPage() {
  const [status, setStatus] = useState<SolicitationStatusFilter>('PENDING')
  const [type, setType] = useState<SolicitationType | 'ALL'>('ALL')
  const [establishmentId, setEstablishmentId] = useState<string>('ALL')

  const { data: establishments } = useAdminEstablishments()
  const { data, isLoading } = useAdminSolicitations({
    status,
    type: type === 'ALL' ? undefined : type,
    establishmentId: establishmentId === 'ALL' ? undefined : establishmentId,
  })

  const count = data?.length ?? 0

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Solicitações"
        description="Aprove ou rejeite pedidos de novos colaboradores e terminais."
      />

      <ListToolbar
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <Select value={type} onValueChange={(value) => setType(value as SolicitationType | 'ALL')}>
              <SelectTrigger className="w-44">
                <SelectValue>
                  {(value: SolicitationType | 'ALL') =>
                    TYPE_OPTIONS.find((option) => option.value === value)?.label
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={establishmentId}
              onValueChange={(value) => setEstablishmentId(value ?? 'ALL')}
            >
              <SelectTrigger className="w-52">
                <SelectValue>
                  {(value: string) =>
                    value === 'ALL'
                      ? 'Todos os estabelecimentos'
                      : establishments?.find((option) => option.id === value)?.nomeFantasia
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos os estabelecimentos</SelectItem>
                {establishments?.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.nomeFantasia}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={status}
              onValueChange={(value) => setStatus(value as SolicitationStatusFilter)}
            >
              <SelectTrigger className="w-40">
                <SelectValue>
                  {(value: SolicitationStatusFilter) =>
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
          </div>
        }
      >
        {isLoading ? (
          <Skeleton className="h-4 w-28" />
        ) : (
          `${count} ${count === 1 ? 'solicitação' : 'solicitações'}`
        )}
      </ListToolbar>

      <AdminSolicitationsTable
        data={data ?? []}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            icon={ClipboardListIcon}
            title="Nenhuma solicitação encontrada"
            description="Nada por aqui com este filtro."
          />
        }
      />
    </div>
  )
}
