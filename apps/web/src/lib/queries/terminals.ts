import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  LogicalTerminal,
  LogicalTerminalDetail,
  LogicalTerminalWithCount,
  CreateTerminalDto,
  UpdateTerminalDto,
} from '@repo/types'
import { api } from '@/lib/api'

export const terminalKeys = {
  all: ['terminals'] as const,
  list: (includeInactive?: boolean) =>
    [...terminalKeys.all, 'list', { includeInactive: !!includeInactive }] as const,
  detail: (id: string) => [...terminalKeys.all, 'detail', id] as const,
}

export function useTerminals(includeInactive = false) {
  return useQuery({
    queryKey: terminalKeys.list(includeInactive),
    queryFn: async (): Promise<LogicalTerminalWithCount[]> => {
      const { data } = await api.get<LogicalTerminalWithCount[]>('/terminals', {
        params: includeInactive ? { includeInactive: true } : undefined,
      })
      return data
    },
  })
}

export function useTerminal(id: string) {
  return useQuery({
    queryKey: terminalKeys.detail(id),
    queryFn: async (): Promise<LogicalTerminalDetail> => {
      const { data } = await api.get<LogicalTerminalDetail>(`/terminals/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export function useCreateTerminal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (dto: CreateTerminalDto): Promise<LogicalTerminal> => {
      const { data } = await api.post<LogicalTerminal>('/terminals', dto)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: terminalKeys.all }),
  })
}

export function useUpdateTerminal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      dto,
    }: {
      id: string
      dto: UpdateTerminalDto
    }): Promise<LogicalTerminal> => {
      const { data } = await api.patch<LogicalTerminal>(`/terminals/${id}`, dto)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: terminalKeys.all }),
  })
}

export function useDeleteTerminal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/terminals/${id}`)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: terminalKeys.all }),
  })
}

export function useReactivateTerminal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<LogicalTerminal> => {
      const { data } = await api.patch<LogicalTerminal>(`/terminals/${id}/reactivate`)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: terminalKeys.all }),
  })
}
