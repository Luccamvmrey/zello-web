import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface FormActionsProps {
  children: ReactNode
  /** Recua a barra até as bordas do container. Use a mesma medida do padding lateral da página. */
  className?: string
}

/**
 * Barra de ações de formulário longo: gruda no fim da área de scroll para que
 * "Salvar" não dependa de o usuário chegar ao fim da página.
 *
 * As ações ficam à direita e na ordem [secundária, primária] — full-width no
 * celular, onde não há espaço para duas lado a lado com folga.
 */
export function FormActions({ children, className }: FormActionsProps) {
  return (
    <div
      className={cn(
        'border-border-subtle bg-background sticky bottom-0 z-10 -mx-4 mt-2 flex flex-col-reverse gap-2 border-t px-4 py-4 sm:mx-0 sm:flex-row sm:justify-end sm:px-0',
        className,
      )}
    >
      {children}
    </div>
  )
}
