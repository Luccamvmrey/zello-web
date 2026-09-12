import { BrandMark } from "@/components/brand-mark"
import { SectionContainer } from "@/components/section-container"

const navLinks = [
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Calculadora", href: "#calculadora" },
  { label: "Segurança", href: "#seguranca" },
]

function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border py-10">
      <SectionContainer className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex max-w-xs flex-col gap-3">
          <div className="flex items-center gap-2">
            <BrandMark className="text-primary dark:text-highlight" />
            <span className="font-mono text-lg font-medium tracking-tight text-foreground">
              Zello
            </span>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Divisão automática de pagamentos no instante da venda, com registro
            auditável de cada divisão.
          </p>
        </div>

        <nav aria-label="Rodapé" className="flex flex-col gap-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </SectionContainer>

      <SectionContainer className="mt-10 border-t border-border pt-6">
        <p className="font-mono text-xs text-muted-foreground">© {year} Zello</p>
      </SectionContainer>
    </footer>
  )
}

export { SiteFooter }
