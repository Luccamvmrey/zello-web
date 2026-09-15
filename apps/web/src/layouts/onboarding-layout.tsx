import { Navigate, Outlet } from 'react-router-dom'
import { BrandMark } from '@repo/ui/brand-mark'
import { useAuth } from '@/contexts/auth-context'
import { getToken } from '@/lib/auth-storage'

/** Moldura do onboarding: sem sidebar, tela inteira dedicada ao formulário. */
export function OnboardingLayout() {
  const { user, isLoading } = useAuth()

  if (!getToken()) {
    return <Navigate to="/login" replace />
  }

  if (isLoading) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <p className="text-muted-foreground text-sm">Carregando…</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.establishmentId) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="flex min-h-dvh flex-col items-center px-4 py-10 sm:px-6 sm:py-12">
      <div className="w-full max-w-2xl">
        <div className="mb-8 flex items-center gap-2">
          <BrandMark className="text-primary size-6" />
          <span className="text-xl font-semibold tracking-tight">Zello</span>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
