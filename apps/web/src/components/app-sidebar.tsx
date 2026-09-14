import {
  LayoutDashboard,
  LogOut,
  Monitor,
  Receipt,
  Scale,
  Settings,
  Tags,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { BrandMark } from '@repo/ui/brand-mark'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/auth-context'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

const MAIN_NAV: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/collaborators', label: 'Colaboradores', icon: Users },
  { to: '/rules', label: 'Regras', icon: Scale },
  { to: '/catalog', label: 'Catálogo', icon: Tags },
  { to: '/terminals', label: 'Terminais', icon: Monitor },
  { to: '/sales', label: 'Vendas', icon: Receipt },
]

const SETTINGS_NAV: NavItem[] = [
  { to: '/settings', label: 'Configurações', icon: Settings },
]

function SidebarLink({ to, label, icon: Icon }: NavItem) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
          'outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
          isActive
            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
            : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
        )
      }
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      {label}
    </NavLink>
  )
}

export function AppSidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="bg-sidebar text-sidebar-foreground flex h-dvh w-60 shrink-0 flex-col border-r border-sidebar-border">
      <div className="flex items-center gap-2 px-5 py-5">
        <BrandMark className="size-6 text-highlight" />
        <span className="text-lg font-semibold tracking-tight">Zello</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {MAIN_NAV.map((item) => (
          <SidebarLink key={item.to} {...item} />
        ))}

        <hr className="border-sidebar-border my-3" />

        {SETTINGS_NAV.map((item) => (
          <SidebarLink key={item.to} {...item} />
        ))}
      </nav>

      <div className="border-sidebar-border border-t px-3 py-3">
        <div className="px-2 pb-2">
          <p className="truncate text-sm font-medium">{user?.name}</p>
          <p className="text-sidebar-foreground/60 truncate text-xs">
            {user?.email}
          </p>
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
    </aside>
  )
}
