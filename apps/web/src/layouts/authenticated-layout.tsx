import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AppSidebar } from '@/components/app-sidebar'
import { useAuth } from '@/contexts/auth-context'
import { getToken } from '@/lib/auth-storage'

export function AuthenticatedLayout() {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  // Sem token sequer: nem tenta validar.
  if (!getToken()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  // Validando o token no mount — não pisca a tela de login.
  if (isLoading) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <p className="text-muted-foreground text-sm">Carregando…</p>
      </div>
    )
  }

  // Token presente mas rejeitado pela API.
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return (
    <div className="flex h-dvh">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl px-8 py-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
