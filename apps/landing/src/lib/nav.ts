/** Fonte única dos links de navegação — consumida pelo header, pelo menu
 *  mobile e pelo rodapé. Antes o array vivia duplicado em dois arquivos. */
export const navLinks = [
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Calculadora", href: "#calculadora" },
  { label: "Segurança", href: "#seguranca" },
] as const

/** Páginas institucionais ainda não escritas — só o rodapé as lista. */
export const legalLinks = [
  { label: "Política de Privacidade", href: "#" },
  { label: "Termos de Uso", href: "#" },
] as const
