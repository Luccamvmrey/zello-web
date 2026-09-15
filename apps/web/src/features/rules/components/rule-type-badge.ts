import type { SplitRuleType } from '@repo/types'

/**
 * O spec pede badge "azul" para Percentual, mas o tema não tem token de azul
 * e o Design Contract proíbe criar um token novo para uma necessidade de uma
 * única tela — por isso Percentual usa --muted (neutro) e Fixo usa --warning
 * (âmbar, que já bate com o texto do spec).
 */
export const TYPE_BADGE: Record<SplitRuleType, { label: string; className: string }> = {
  PERCENTAGE: {
    label: 'Percentual',
    className: 'bg-muted text-muted-foreground',
  },
  FIXED: {
    label: 'Fixo',
    className: 'bg-warning/12 text-warning',
  },
}
