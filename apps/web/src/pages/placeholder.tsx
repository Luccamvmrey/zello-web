import type { LucideIcon } from 'lucide-react'

interface PlaceholderPageProps {
  title: string
  description: string
  icon: LucideIcon
}

/**
 * Página de seção ainda não implementada. Existe para que a navegação
 * funcione de ponta a ponta desde a Camada 0.
 */
export function PlaceholderPage({
  title,
  description,
  icon: Icon,
}: PlaceholderPageProps) {
  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="text-muted-foreground mt-1 text-sm">{description}</p>

      <div className="border-border mt-8 flex flex-col items-center gap-3 rounded-lg border border-dashed px-6 py-16 text-center">
        <Icon className="text-muted-foreground size-8" aria-hidden="true" />
        <p className="text-muted-foreground text-sm">Em construção</p>
      </div>
    </section>
  )
}
