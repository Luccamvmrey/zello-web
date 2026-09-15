import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  CreateEstablishmentDto,
  Establishment,
  EstablishmentWithCounts,
  UpdateEstablishmentDto,
} from '@repo/types'
import { ME_QUERY_KEY } from '@/contexts/auth-context'
import { api } from '@/lib/api'

export const establishmentKeys = {
  me: ['establishments', 'me'] as const,
}

export function useEstablishmentMe(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: establishmentKeys.me,
    queryFn: async (): Promise<EstablishmentWithCounts> => {
      const { data } = await api.get<EstablishmentWithCounts>('/establishments/me')
      return data
    },
    enabled: options?.enabled,
  })
}

export function useCreateEstablishment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (dto: CreateEstablishmentDto): Promise<Establishment> => {
      const { data } = await api.post<Establishment>('/establishments', dto)
      return data
    },
    onSuccess: (establishment) => {
      queryClient.setQueryData(establishmentKeys.me, establishment)
      // AuthContext.user.establishmentId precisa refletir o vínculo recém-criado
      // para a redireção de onboarding parar de disparar.
      return queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY })
    },
  })
}

export function useUpdateEstablishment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (dto: UpdateEstablishmentDto): Promise<Establishment> => {
      const { data } = await api.patch<Establishment>('/establishments/me', dto)
      return data
    },
    onSuccess: (establishment) => {
      queryClient.setQueryData(
        establishmentKeys.me,
        (old: EstablishmentWithCounts | undefined) =>
          old ? { ...old, ...establishment } : old,
      )
    },
  })
}
