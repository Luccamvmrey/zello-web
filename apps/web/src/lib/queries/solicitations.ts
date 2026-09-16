import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CreateSolicitationDto, Solicitation, SolicitationStatus, SolicitationType } from '@repo/types'
import { api } from '@/lib/api'

export interface SolicitationFilters {
  type?: SolicitationType
  status?: SolicitationStatus
}

export const solicitationKeys = {
  all: ['solicitations'] as const,
  list: (filters: SolicitationFilters) => [...solicitationKeys.all, 'list', filters] as const,
}

export function useSolicitations(filters: SolicitationFilters) {
  return useQuery({
    queryKey: solicitationKeys.list(filters),
    queryFn: async (): Promise<Solicitation[]> => {
      const { data } = await api.get<Solicitation[]>('/solicitations', { params: filters })
      return data
    },
  })
}

export function useCreateSolicitation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (dto: CreateSolicitationDto): Promise<Solicitation> => {
      const { data } = await api.post<Solicitation>('/solicitations', dto)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: solicitationKeys.all }),
  })
}

export function useCancelSolicitation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/solicitations/${id}`)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: solicitationKeys.all }),
  })
}
