import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

/**
 * Topo de toda página autenticada. A régua abaixo do título é o que dá "topo"
 * à página; o traço dourado sobre ela é a marca de livro-razão — o único
 * acento de cor da moldura.
 */
export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        'border-border-subtle relative flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-start sm:justify-between',
        className,
      )}
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="text-muted-foreground mt-1 text-sm">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}

      <span
        aria-hidden="true"
        className="bg-highlight absolute -bottom-px left-0 h-px w-8"
      />
    </div>
  )
}
