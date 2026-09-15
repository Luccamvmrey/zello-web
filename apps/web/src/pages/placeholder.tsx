import type { LucideIcon } from 'lucide-react'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'

interface PlaceholderPageProps {
  title: string
  description: string
  icon: LucideIcon
  /** O que a tela vai permitir fazer. Uma caixa vazia sem isto não informa nada. */
  upcoming: string
}

/**
 * Página de seção ainda não implementada. Existe para que a navegação
 * funcione de ponta a ponta desde a Camada 0.
 */
export function PlaceholderPage({
  title,
  description,
  icon: Icon,
  upcoming,
}: PlaceholderPageProps) {
  return (
    <section>
      <PageHeader title={title} description={description} />

      <div className="border-border-subtle mt-8 rounded-xl border border-dashed">
        <EmptyState icon={Icon} title="Em breve" description={upcoming} />
      </div>
    </section>
  )
}
