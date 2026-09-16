/**
 * Calculadora de economia da landing.
 *
 * Premissa (ilustrativa, não fiscal): sem o split, o valor repassado ao
 * colaborador transita pela conta do estabelecimento e é tributado lá. Com o
 * split, o valor vai direto ao colaborador — não transita, então não é
 * tributado no estabelecimento. A economia é o imposto que deixa de incidir.
 *
 * A alíquota é uma média simplificada. A fórmula real depende de validação
 * com contador; a landing sempre exibe o disclaimer ao lado do resultado.
 */
export const TAX_RATE = 0.15

export type SavingsInput = {
  /** Faturamento mensal em reais (não centavos). */
  monthlyRevenue: number
  /** Fatia do faturamento repassada a colaboradores, em 0–100. */
  passThroughPercent: number
}

export type SavingsResult = {
  passedThrough: number
  withoutZello: number
  withZello: number
  savings: number
}

export function calculateSavings({
  monthlyRevenue,
  passThroughPercent,
}: SavingsInput): SavingsResult {
  const revenue = Number.isFinite(monthlyRevenue) ? Math.max(monthlyRevenue, 0) : 0
  const percent = Number.isFinite(passThroughPercent)
    ? Math.min(Math.max(passThroughPercent, 0), 100) / 100
    : 0

  const passedThrough = revenue * percent
  const withoutZello = passedThrough * TAX_RATE
  const withZello = 0

  return {
    passedThrough,
    withoutZello,
    withZello,
    savings: withoutZello - withZello,
  }
}
