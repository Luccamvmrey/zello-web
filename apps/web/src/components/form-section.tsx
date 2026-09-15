import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface FormSectionProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

/**
 * Agrupa campos de um mesmo assunto. Um formulário longo sem isto vira um
 * scroll indiferenciado — CNPJ, endereço e faturamento são três perguntas
 * diferentes e precisam ler como três blocos.
 *
 * Os filhos entram num grid de 12 colunas: use `col-span-12` (texto livre),
 * `sm:col-span-6` (par), `sm:col-span-4` e `sm:col-span-3` (campos curtos).
 */
export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <section className={cn('flex flex-col gap-4', className)}>
      <div className="border-border-subtle border-b pb-2">
        <h2 className="font-heading text-base font-medium">{title}</h2>
        {description ? (
          <p className="text-muted-foreground mt-0.5 text-xs">{description}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-12 gap-4">{children}</div>
    </section>
  )
}
