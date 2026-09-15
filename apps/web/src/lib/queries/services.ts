import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Service, CreateServiceDto, UpdateServiceDto } from '@repo/types'
import { api } from '@/lib/api'

export const serviceKeys = {
  all: ['services'] as const,
  list: (includeInactive?: boolean) =>
    [...serviceKeys.all, 'list', { includeInactive: !!includeInactive }] as const,
}

export function useServices(includeInactive = false) {
  return useQuery({
    queryKey: serviceKeys.list(includeInactive),
    queryFn: async (): Promise<Service[]> => {
      const { data } = await api.get<Service[]>('/services', {
        params: includeInactive ? { includeInactive: true } : undefined,
      })
      return data
    },
  })
}

export function useCreateService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (dto: CreateServiceDto): Promise<Service> => {
      const { data } = await api.post<Service>('/services', dto)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: serviceKeys.all }),
  })
}

export function useUpdateService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      dto,
    }: {
      id: string
      dto: UpdateServiceDto
    }): Promise<Service> => {
      const { data } = await api.patch<Service>(`/services/${id}`, dto)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: serviceKeys.all }),
  })
}

export function useDeleteService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/services/${id}`)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: serviceKeys.all }),
  })
}

export function useReactivateService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<Service> => {
      const { data } = await api.patch<Service>(`/services/${id}/reactivate`)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: serviceKeys.all }),
  })
}
