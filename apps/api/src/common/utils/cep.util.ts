/** Remove tudo que não for dígito. Usado antes de validar/persistir um CEP. */
export function normalizeCep(raw: string): string {
  return raw.replace(/\D/g, '');
}
