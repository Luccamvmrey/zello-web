import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ListToolbarProps {
  /** Contagem, busca — o que situa a lista. Fica à esquerda. */
  children?: ReactNode
  /** Filtros e toggles. Ficam à direita. */
  actions?: ReactNode
  className?: string
}

/**
 * Faixa entre o cabeçalho da página e a tabela. Existe para que filtros e
 * toggles tenham um lugar em vez de flutuarem soltos sobre a lista.
 */
export function ListToolbar({ children, actions, className }: ListToolbarProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className="text-muted-foreground text-sm">{children}</div>
      {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
    </div>
  )
}
