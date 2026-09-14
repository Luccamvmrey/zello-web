import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo, type ReactNode } from 'react'
import type { AuthResponse, LoginPayload, MeResponse, RegisterPayload } from '@repo/types'
import { api } from '@/lib/api'
import { clearToken, getToken, setToken } from '@/lib/auth-storage'
import { AuthContext, ME_QUERY_KEY, type AuthContextValue } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()

  const meQuery = useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: async (): Promise<MeResponse> => {
      const { data } = await api.get<MeResponse>('/auth/me')
      return data
    },
    // Sem token não há o que validar — evita um 401 garantido no mount.
    enabled: getToken() !== null,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

  const applySession = useCallback(
    (response: AuthResponse) => {
      setToken(response.accessToken)
      // Semeia o cache para o layout renderizar sem um segundo round-trip.
      queryClient.setQueryData<MeResponse>(ME_QUERY_KEY, {
        ...response.user,
        establishment: null,
      })
      return queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY })
    },
    [queryClient],
  )

  const loginMutation = useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await api.post<AuthResponse>('/auth/login', payload)
      return data
    },
    onSuccess: applySession,
  })

  const registerMutation = useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const { data } = await api.post<AuthResponse>('/auth/register', payload)
      return data
    },
    onSuccess: applySession,
  })

  const logout = useCallback(() => {
    clearToken()
    // Zera a sessão no mesmo commit: só `clear()` não reseta o resultado que o
    // observer montado já calculou, e o layout ainda enxergaria o usuário logado.
    queryClient.setQueryData<MeResponse | null>(ME_QUERY_KEY, null)
    queryClient.clear()
  }, [queryClient])

  const value = useMemo<AuthContextValue>(() => {
    const user = meQuery.data ?? null

    return {
      user,
      establishment: user?.establishment ?? null,
      // Só "carregando" quando existe um token a validar.
      isLoading: getToken() !== null && meQuery.isPending,
      login: async (payload) => {
        await loginMutation.mutateAsync(payload)
      },
      register: async (payload) => {
        await registerMutation.mutateAsync(payload)
      },
      logout,
    }
  }, [meQuery.data, meQuery.isPending, loginMutation, registerMutation, logout])

  return <AuthContext value={value}>{children}</AuthContext>
}
