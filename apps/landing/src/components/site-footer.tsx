import { legalLinks, navLinks } from "@/lib/nav"

/**
 * Como o header, o rodapé não é uma island — fica direto no fundo escuro,
 * separado das islands por um gap maior.
 *
 * O spec R.3 pede --text-muted aqui, mas #6b7068 sobre #121210 dá 3.69:1 —
 * abaixo dos 4.5:1 da WCAG para texto de 14px (reprovado pelo Lighthouse).
 * Usa --text-secondary, que continua lendo como secundário e passa.
 */
export function SiteFooter() {
  return (
    <footer className="mt-10 px-4 py-20 md:px-8">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center gap-10 text-center md:flex-row md:items-start md:justify-between md:text-left">
        <img
          src="/images/logo.png"
          alt="Zello"
          width={83}
          height={45}
          className="h-9 w-auto"
        />

        <nav
          aria-label="Rodapé"
          className="flex flex-col items-center gap-4 md:flex-row md:flex-wrap md:justify-center md:gap-8"
        >
          {[...navLinks, ...legalLinks].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Zello</p>
      </div>
    </footer>
  )
}
