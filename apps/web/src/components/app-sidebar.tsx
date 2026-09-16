import {
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Scale,
  Settings,
  ShieldCheck,
  Tags,
  type LucideIcon,
} from 'lucide-react'
import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { BrandMark } from '@repo/ui/brand-mark'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/auth-context'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

const ESTABLISHMENT_MAIN_NAV: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/solicitations', label: 'Solicitações', icon: ClipboardList },
  { to: '/rules', label: 'Regras', icon: Scale },
  { to: '/catalog', label: 'Catálogo', icon: Tags },
]

const ADMIN_MAIN_NAV: NavItem[] = [
  { to: '/admin', label: 'Visão Geral', icon: LayoutDashboard },
  { to: '/admin/accounts', label: 'Contas', icon: ShieldCheck },
  { to: '/admin/solicitations', label: 'Solicitações', icon: ClipboardList },
]

const SETTINGS_NAV: NavItem[] = [
  { to: '/settings', label: 'Configurações', icon: Settings },
]

function SidebarLink({ to, label, icon: Icon, onNavigate }: NavItem & { onNavigate?: () => void }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
          'outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
          isActive
            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
            : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
        )
      }
    >
      {({ isActive }) => (
        <>
          {/* O tom de fundo sozinho não sustenta o estado ativo em telas ruins —
              a barra dourada é o sinal redundante. */}
          {isActive ? (
            <span
              aria-hidden="true"
              className="bg-highlight absolute inset-y-1 left-0 w-0.5 rounded-full"
            />
          ) : null}
          <Icon className="size-4 shrink-0" aria-hidden="true" />
          {label}
        </>
      )}
    </NavLink>
  )
}

/** Conteúdo compartilhado entre a sidebar fixa (desktop) e o drawer (mobile). */
function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'ADMIN'
  const mainNav = isAdmin ? ADMIN_MAIN_NAV : ESTABLISHMENT_MAIN_NAV

  function handleLogout() {
    onNavigate?.()
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3">
        {mainNav.map((item) => (
          <SidebarLink key={item.to} {...item} onNavigate={onNavigate} />
        ))}

        {isAdmin ? null : (
          <>
            <hr className="border-sidebar-border my-3" />
            {SETTINGS_NAV.map((item) => (
              <SidebarLink key={item.to} {...item} onNavigate={onNavigate} />
            ))}
          </>
        )}
      </nav>

      <div className="border-sidebar-border border-t px-3 py-3">
        <div className="px-2 pb-2">
          <p className="truncate text-sm font-medium">{user?.name}</p>
          <p className="text-sidebar-foreground/60 truncate text-xs">{user?.email}</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground focus-visible:ring-sidebar-ring flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors outline-none focus-visible:ring-2"
        >
          <LogOut className="size-4 shrink-0" aria-hidden="true" />
          Sair
        </button>
      </div>
    </>
  )
}

function SidebarBrand() {
  return (
    <div className="flex items-center gap-2 px-5 py-5">
      <BrandMark className="size-6 text-highlight" />
      <span className="text-lg font-semibold tracking-tight">Zello</span>
    </div>
  )
}

/** Sidebar fixa. Só existe a partir de `lg` — abaixo disso vira o drawer. */
export function AppSidebar() {
  return (
    <aside className="bg-sidebar text-sidebar-foreground border-sidebar-border hidden h-dvh w-60 shrink-0 flex-col border-r lg:flex">
      <SidebarBrand />
      <SidebarBody />
    </aside>
  )
}

/**
 * Barra superior do mobile: marca + gatilho do drawer. Contraparte do
 * `AppSidebar`, montada apenas abaixo de `lg`.
 */
export function AppMobileHeader() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // Fecha o drawer quando a rota muda por qualquer caminho (link, voltar, redirect).
  const [lastPath, setLastPath] = useState(location.pathname)
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname)
    if (open) setOpen(false)
  }

  return (
    <header className="bg-sidebar text-sidebar-foreground border-sidebar-border sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b px-4 lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          className="text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground focus-visible:ring-sidebar-ring -ml-2 flex size-11 items-center justify-center rounded-md transition-colors outline-none focus-visible:ring-2"
          aria-label="Abrir navegação"
        >
          <Menu className="size-5" aria-hidden="true" />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="bg-sidebar text-sidebar-foreground border-sidebar-border"
        >
          <SheetTitle className="sr-only">Navegação</SheetTitle>
          <SidebarBrand />
          <SidebarBody onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex items-center gap-2">
        <BrandMark className="size-5 text-highlight" />
        <span className="font-semibold tracking-tight">Zello</span>
      </div>
    </header>
  )
}
