import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AppMobileHeader, AppSidebar } from '@/components/app-sidebar'
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

  // Cadastro do estabelecimento é obrigatório antes de usar o resto do painel.
  if (!user.establishmentId) {
    return <Navigate to="/onboarding" replace />
  }

  return (
    <div className="flex h-dvh">
      <AppSidebar />
      {/* min-w-0 impede que conteúdo largo (tabelas) estoure o flex e crie
          scroll horizontal na página inteira. */}
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
