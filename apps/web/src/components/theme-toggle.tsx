import { Moon, Sun } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'zello-theme'

/**
 * Lê de volta o que o script inline do index.html já decidiu e aplicou antes
 * da primeira pintura, para que o estado do botão sempre bata com o documento.
 */
function resolveInitialTheme(): 'light' | 'dark' {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

/**
 * Vive dentro da sidebar, que é escura nos dois temas — por isso usa as cores
 * `sidebar-*` e não as do tema da página.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<'light' | 'dark'>(resolveInitialTheme)

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.classList.toggle('dark', next === 'dark')
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Modo privativo / storage bloqueado: o tema vale só para esta sessão.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Usar tema claro' : 'Usar tema escuro'}
      className={cn(
        'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground focus-visible:ring-sidebar-ring flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors outline-none focus-visible:ring-2',
        className,
      )}
    >
      {theme === 'dark' ? (
        <Sun className="size-4 shrink-0" aria-hidden="true" />
      ) : (
        <Moon className="size-4 shrink-0" aria-hidden="true" />
      )}
      {theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
    </button>
  )
}
