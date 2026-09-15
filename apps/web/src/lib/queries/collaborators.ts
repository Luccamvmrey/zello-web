import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Collaborator, CreateCollaboratorDto, UpdateCollaboratorDto } from '@repo/types'
import { api } from '@/lib/api'

export const collaboratorKeys = {
  all: ['collaborators'] as const,
  list: (includeInactive?: boolean) =>
    [...collaboratorKeys.all, 'list', { includeInactive: !!includeInactive }] as const,
}

export function useCollaborators(includeInactive = false) {
  return useQuery({
    queryKey: collaboratorKeys.list(includeInactive),
    queryFn: async (): Promise<Collaborator[]> => {
      const { data } = await api.get<Collaborator[]>('/collaborators', {
        params: includeInactive ? { includeInactive: true } : undefined,
      })
      return data
    },
  })
}

export function useCreateCollaborator() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (dto: CreateCollaboratorDto): Promise<Collaborator> => {
      const { data } = await api.post<Collaborator>('/collaborators', dto)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: collaboratorKeys.all }),
  })
}

export function useUpdateCollaborator() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      dto,
    }: {
      id: string
      dto: UpdateCollaboratorDto
    }): Promise<Collaborator> => {
      const { data } = await api.patch<Collaborator>(`/collaborators/${id}`, dto)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: collaboratorKeys.all }),
  })
}

export function useDeleteCollaborator() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/collaborators/${id}`)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: collaboratorKeys.all }),
  })
}

export function useReactivateCollaborator() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<Collaborator> => {
      const { data } = await api.patch<Collaborator>(`/collaborators/${id}/reactivate`)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: collaboratorKeys.all }),
  })
}
