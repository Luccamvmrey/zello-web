export { cn } from "cn"

/** Aplica a máscara XX.XXX.XXX/XXXX-XX enquanto o usuário digita. */
export function formatCnpj(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 14)
  const parts = [
    digits.slice(0, 2),
    digits.slice(2, 5),
    digits.slice(5, 8),
    digits.slice(8, 12),
    digits.slice(12, 14),
  ]

  let result = parts[0]
  if (parts[1]) result += `.${parts[1]}`
  if (parts[2]) result += `.${parts[2]}`
  if (parts[3]) result += `/${parts[3]}`
  if (parts[4]) result += `-${parts[4]}`

  return result
}

/** Remove a máscara antes de enviar para a API. */
export function unformatCnpj(value: string): string {
  return value.replace(/\D/g, '')
}

/** Aplica a máscara 00000-000 enquanto o usuário digita. */
export function formatCep(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  const parts = [digits.slice(0, 5), digits.slice(5, 8)]

  let result = parts[0]
  if (parts[1]) result += `-${parts[1]}`

  return result
}

/** Remove a máscara antes de enviar para a API. */
export function unformatCep(value: string): string {
  return value.replace(/\D/g, '')
}

/** Aplica a máscara 000.000.000-00 enquanto o usuário digita. */
export function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  const parts = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 9), digits.slice(9, 11)]

  let result = parts[0]
  if (parts[1]) result += `.${parts[1]}`
  if (parts[2]) result += `.${parts[2]}`
  if (parts[3]) result += `-${parts[3]}`

  return result
}

/** Remove a máscara antes de enviar para a API. */
export function unformatCpf(value: string): string {
  return value.replace(/\D/g, '')
}

/** Aplica a máscara (00) 00000-0000 / (00) 0000-0000 enquanto o usuário digita. */
export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  const ddd = digits.slice(0, 2)
  const rest = digits.slice(2)

  if (!ddd) return ''

  let result = `(${ddd}`
  if (digits.length < 3) return result
  result += ') '

  if (rest.length <= 8) {
    result += rest.slice(0, 4)
    if (rest.length > 4) result += `-${rest.slice(4, 8)}`
  } else {
    result += rest.slice(0, 5)
    if (rest.length > 5) result += `-${rest.slice(5, 9)}`
  }

  return result
}

/** Remove a máscara antes de enviar para a API. */
export function unformatPhone(value: string): string {
  return value.replace(/\D/g, '')
}

/** Máscara dinâmica de documento conforme o tipo selecionado (CPF ou CNPJ). */
export function formatDocument(value: string, type: 'CPF' | 'CNPJ'): string {
  return type === 'CPF' ? formatCpf(value) : formatCnpj(value)
}

/** Remove a máscara de um documento (CPF ou CNPJ) antes de enviar para a API. */
export function unformatDocument(value: string): string {
  return value.replace(/\D/g, '')
}

/** Formata um número como moeda brasileira (ex.: 50 → "R$ 50,00"). */
export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

/** Formata um percentual (ex.: 70 → "70%"). */
export function formatPercentage(value: number): string {
  return `${value}%`
}

/**
 * Handler de submit inválido do react-hook-form: rola o primeiro campo com
 * erro até o centro da tela. Sem isso, um formulário longo pode "não fazer
 * nada" ao submeter, porque o erro ficou fora da área visível.
 *
 * Uso: `form.handleSubmit(onSubmit, scrollToFirstError)`
 */
export function scrollToFirstError(errors: Record<string, unknown>): void {
  const firstName = Object.keys(errors)[0]
  if (!firstName) return

  const field = document.querySelector<HTMLElement>(
    `[name="${CSS.escape(firstName)}"]`,
  )
  field?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
