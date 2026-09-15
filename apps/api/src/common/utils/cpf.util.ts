/** Remove tudo que não for dígito. Usado antes de validar/persistir um CPF. */
export function normalizeCpf(raw: string): string {
  return raw.replace(/\D/g, '');
}

function checkDigit(digits: string, weightStart: number): number {
  let sum = 0;
  let weight = weightStart;
  for (const digit of digits) {
    sum += Number(digit) * weight;
    weight -= 1;
  }
  const rest = (sum * 10) % 11;
  return rest === 10 ? 0 : rest;
}

/** Valida os dígitos verificadores de um CPF já normalizado (11 dígitos). */
export function isValidCpf(cpf: string): boolean {
  if (!/^\d{11}$/.test(cpf)) {
    return false;
  }

  if (/^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  const firstDigit = checkDigit(cpf.slice(0, 9), 10);
  if (firstDigit !== Number(cpf[9])) {
    return false;
  }

  const secondDigit = checkDigit(cpf.slice(0, 10), 11);
  return secondDigit === Number(cpf[10]);
}
