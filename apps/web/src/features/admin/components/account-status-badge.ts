import type { AccountStatus } from '@repo/types'

export const ACCOUNT_STATUS_BADGE: Record<AccountStatus, { label: string; className: string }> = {
  PENDING_APPROVAL: {
    label: 'Pendente',
    className: 'bg-warning/12 text-warning',
  },
  ACTIVE: {
    label: 'Ativa',
    className: 'bg-success/12 text-success',
  },
  SUSPENDED: {
    label: 'Suspensa',
    className: 'bg-destructive/12 text-destructive',
  },
}
