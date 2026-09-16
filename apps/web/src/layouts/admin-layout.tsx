import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AppMobileHeader, AppSidebar } from '@/components/app-sidebar'
import { useAuth } from '@/contexts/auth-context'
import { getToken } from '@/lib/auth-storage'

export function AdminLayout() {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (!getToken()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (isLoading) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <p className="text-muted-foreground text-sm">Carregando…</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  // Rotas admin não são de establishment — manda de volta quem não é admin.
  if (user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="flex h-dvh">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppMobileHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
