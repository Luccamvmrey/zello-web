export { cn } from "cn"

export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Moeda com centavos, a partir de um inteiro de centavos. O input da
 * calculadora guarda centavos para não acumular erro de float enquanto o
 * usuário digita; formatBRL (sem centavos) continua servindo aos resultados.
 */
export function formatBRLCents(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100)
}
