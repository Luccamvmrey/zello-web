import type { TerminalStatus } from '@repo/types'

export const STATUS_BADGE: Record<TerminalStatus, { label: string; className: string }> = {
  PAIRED: {
    label: 'Vinculado',
    className: 'bg-success/12 text-success',
  },
  UNPAIRED: {
    label: 'Não vinculado',
    className: 'bg-muted text-muted-foreground',
  },
  OFFLINE: {
    label: 'Offline',
    className: 'bg-destructive/10 text-destructive',
  },
}
