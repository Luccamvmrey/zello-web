import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  AdminAccount,
  AdminAccountStatusFilter,
  AdminOverview,
  RejectAccountDto,
} from '@repo/types'
import { api } from '@/lib/api'

export const adminKeys = {
  accounts: (status: AdminAccountStatusFilter) => ['admin', 'accounts', status] as const,
  overview: ['admin', 'overview'] as const,
}

export function useAdminAccounts(status: AdminAccountStatusFilter) {
  return useQuery({
    queryKey: adminKeys.accounts(status),
    queryFn: async (): Promise<AdminAccount[]> => {
      const { data } = await api.get<AdminAccount[]>('/admin/accounts', { params: { status } })
      return data
    },
  })
}

export function useAdminOverview() {
  return useQuery({
    queryKey: adminKeys.overview,
    queryFn: async (): Promise<AdminOverview> => {
      const { data } = await api.get<AdminOverview>('/admin/overview')
      return data
    },
  })
}

function useAdminAccountAction(action: 'approve' | 'reject' | 'reactivate') {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto?: RejectAccountDto }): Promise<AdminAccount> => {
      const { data } = await api.patch<AdminAccount>(`/admin/accounts/${id}/${action}`, dto)
      return data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'accounts'] })
      void queryClient.invalidateQueries({ queryKey: adminKeys.overview })
    },
  })
}

export function useApproveAccount() {
  return useAdminAccountAction('approve')
}

export function useRejectAccount() {
  return useAdminAccountAction('reject')
}

export function useReactivateAccount() {
  return useAdminAccountAction('reactivate')
}
