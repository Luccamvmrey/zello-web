import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { SplitRule, CreateSplitRuleDto, UpdateSplitRuleDto } from '@repo/types'
import { api } from '@/lib/api'

export const splitRuleKeys = {
  all: ['split-rules'] as const,
  list: (includeInactive?: boolean) =>
    [...splitRuleKeys.all, 'list', { includeInactive: !!includeInactive }] as const,
}

export function useSplitRules(includeInactive = false) {
  return useQuery({
    queryKey: splitRuleKeys.list(includeInactive),
    queryFn: async (): Promise<SplitRule[]> => {
      const { data } = await api.get<SplitRule[]>('/split-rules', {
        params: includeInactive ? { includeInactive: true } : undefined,
      })
      return data
    },
  })
}

export function useCreateSplitRule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (dto: CreateSplitRuleDto): Promise<SplitRule> => {
      const { data } = await api.post<SplitRule>('/split-rules', dto)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: splitRuleKeys.all }),
  })
}

export function useUpdateSplitRule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      dto,
    }: {
      id: string
      dto: UpdateSplitRuleDto
    }): Promise<SplitRule> => {
      const { data } = await api.patch<SplitRule>(`/split-rules/${id}`, dto)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: splitRuleKeys.all }),
  })
}

export function useDeleteSplitRule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/split-rules/${id}`)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: splitRuleKeys.all }),
  })
}
