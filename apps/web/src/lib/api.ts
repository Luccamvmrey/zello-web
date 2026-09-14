import axios, { AxiosError } from 'axios'
import { clearToken, getToken } from './auth-storage'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
})

api.interceptors.request.use((config) => {
  const token = getToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Token expirado ou inválido: derruba a sessão e volta para o login.
    // O próprio /auth/login responde 401 em credenciais erradas, então
    // aquele caso é tratado pelo formulário e não deve redirecionar.
    const isLoginAttempt = error.config?.url?.includes('/auth/login')

    if (error.response?.status === 401 && !isLoginAttempt) {
      clearToken()

      if (window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
    }

    return Promise.reject(error)
  },
)

/** Extrai a mensagem de erro da API, com fallback legível. */
export function apiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    const message = (error.response?.data as { message?: string | string[] })
      ?.message

    if (Array.isArray(message)) return message[0] ?? fallback
    if (typeof message === 'string') return message
    if (!error.response) return 'Não foi possível falar com o servidor.'
  }

  return fallback
}
