/** Remove tudo que não for dígito. Usado antes de validar/persistir um CNPJ. */
export function normalizeCnpj(raw: string): string {
  return raw.replace(/\D/g, '');
}

function checkDigit(digits: string, weights: number[]): number {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    sum += Number(digits[i]) * weights[i];
  }
  const rest = sum % 11;
  return rest < 2 ? 0 : 11 - rest;
}

const FIRST_DIGIT_WEIGHTS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const SECOND_DIGIT_WEIGHTS = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

/** Valida os dígitos verificadores de um CNPJ já normalizado (14 dígitos). */
export function isValidCnpj(cnpj: string): boolean {
  if (!/^\d{14}$/.test(cnpj)) {
    return false;
  }

  if (/^(\d)\1{13}$/.test(cnpj)) {
    return false;
  }

  const firstDigit = checkDigit(cnpj.slice(0, 12), FIRST_DIGIT_WEIGHTS);
  if (firstDigit !== Number(cnpj[12])) {
    return false;
  }

  const secondDigit = checkDigit(cnpj.slice(0, 13), SECOND_DIGIT_WEIGHTS);
  return secondDigit === Number(cnpj[13]);
}
