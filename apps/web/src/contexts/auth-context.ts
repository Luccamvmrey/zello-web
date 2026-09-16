import { createContext, use } from 'react'
import type {
  EstablishmentSummary,
  LoginPayload,
  MeResponse,
  RegisterPayload,
  RegisterResponse,
} from '@repo/types'

export interface AuthContextValue {
  user: MeResponse | null
  establishment: EstablishmentSummary | null
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<RegisterResponse>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export const ME_QUERY_KEY = ['auth', 'me'] as const

export function useAuth(): AuthContextValue {
  const context = use(AuthContext)

  if (!context) {
    throw new Error('useAuth precisa estar dentro de um <AuthProvider>.')
  }

  return context
}
