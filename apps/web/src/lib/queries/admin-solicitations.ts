import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  AdminSolicitation,
  RejectSolicitationDto,
  SolicitationStatusFilter,
  SolicitationType,
} from '@repo/types'
import { api } from '@/lib/api'
import { adminKeys } from '@/lib/queries/admin'
import { collaboratorKeys } from '@/lib/queries/collaborators'
import { terminalKeys } from '@/lib/queries/terminals'

export interface AdminSolicitationFilters {
  type?: SolicitationType
  status?: SolicitationStatusFilter
  establishmentId?: string
}

export const adminSolicitationKeys = {
  all: ['admin', 'solicitations'] as const,
  list: (filters: AdminSolicitationFilters) => [...adminSolicitationKeys.all, 'list', filters] as const,
}

export function useAdminSolicitations(filters: AdminSolicitationFilters) {
  return useQuery({
    queryKey: adminSolicitationKeys.list(filters),
    queryFn: async (): Promise<AdminSolicitation[]> => {
      const { data } = await api.get<AdminSolicitation[]>('/admin/solicitations', { params: filters })
      return data
    },
  })
}

function useAdminSolicitationAction(action: 'approve' | 'reject') {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      dto,
    }: {
      id: string
      dto?: RejectSolicitationDto
    }): Promise<AdminSolicitation> => {
      const { data } = await api.patch<AdminSolicitation>(`/admin/solicitations/${id}/${action}`, dto)
      return data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminSolicitationKeys.all })
      void queryClient.invalidateQueries({ queryKey: adminKeys.overview })
      void queryClient.invalidateQueries({ queryKey: collaboratorKeys.all })
      void queryClient.invalidateQueries({ queryKey: terminalKeys.all })
    },
  })
}

export function useApproveSolicitation() {
  return useAdminSolicitationAction('approve')
}

export function useRejectSolicitation() {
  return useAdminSolicitationAction('reject')
}
