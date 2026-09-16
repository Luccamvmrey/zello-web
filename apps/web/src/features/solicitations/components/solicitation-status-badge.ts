import type { SolicitationStatus } from '@repo/types'

export const SOLICITATION_STATUS_BADGE: Record<
  SolicitationStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: 'Pendente',
    className: 'bg-warning/12 text-warning',
  },
  APPROVED: {
    label: 'Aprovada',
    className: 'bg-success/12 text-success',
  },
  REJECTED: {
    label: 'Rejeitada',
    className: 'bg-destructive/12 text-destructive',
  },
}
