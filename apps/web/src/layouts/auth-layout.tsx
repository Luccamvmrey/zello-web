import { Navigate, Outlet } from 'react-router-dom'
import { BrandMark } from '@repo/ui/brand-mark'
import { useAuth } from '@/contexts/auth-context'
import { getToken } from '@/lib/auth-storage'

/** Moldura das telas públicas (login e registro). */
export function AuthLayout() {
  const { user, isLoading } = useAuth()

  if (getToken() && isLoading) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <p className="text-muted-foreground text-sm">Carregando…</p>
      </div>
    )
  }

  // Já autenticado: não faz sentido ver login/registro.
  // O token precisa entrar na condição: o AuthenticatedLayout redireciona para
  // cá quando não há token, então redirecionar de volta olhando só para `user`
  // (que ainda pode estar no cache do React Query logo após o logout) gera um
  // ping-pong infinito entre /login e /dashboard.
  if (getToken() && user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-2">
          <BrandMark className="text-primary size-6" />
          <span className="text-xl font-semibold tracking-tight">Zello</span>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
