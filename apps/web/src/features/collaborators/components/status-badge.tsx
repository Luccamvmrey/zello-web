import type { OnboardingStatus } from '@repo/types'

/**
 * Status na ordem do fluxo: PENDING → INVITED → LINKED → ACTIVE.
 * A cor acompanha essa progressão — neutro, dourado (esperando o colaborador),
 * tinta (vinculado) e verde (recebendo) — toda ela vinda dos tokens da marca.
 * Nunca usar a paleta padrão do Tailwind aqui: seria uma segunda paleta
 * convivendo com a do produto.
 */
export const STATUS_BADGE: Record<OnboardingStatus, { label: string; className: string }> = {
  PENDING: {
    label: 'Pendente',
    className: 'bg-muted text-muted-foreground',
  },
  INVITED: {
    label: 'Convidado',
    className: 'bg-warning/12 text-warning',
  },
  LINKED: {
    label: 'Vinculado',
    className: 'bg-primary/12 text-primary',
  },
  ACTIVE: {
    label: 'Ativo',
    className: 'bg-success/12 text-success',
  },
}
