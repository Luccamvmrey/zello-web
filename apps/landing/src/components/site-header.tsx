import { BrandMark } from "@/components/brand-mark"
import { SectionContainer } from "@/components/section-container"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { registerUrl } from "@/lib/urls"

const navLinks = [
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Calculadora", href: "#calculadora" },
  { label: "Segurança", href: "#seguranca" },
]

function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 py-3 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
      <SectionContainer className="flex items-center justify-between gap-4">
        <a href="#" className="flex items-center gap-2">
          <BrandMark className="text-primary dark:text-highlight" />
          <span className="font-mono text-lg font-medium tracking-tight text-foreground">
            Zello
          </span>
        </a>

        <nav aria-label="Seções" className="hidden items-center gap-8 md:flex">
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

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            render={<a href={registerUrl} />}
            nativeButton={false}
            size="sm"
          >
            Criar conta
          </Button>
        </div>
      </SectionContainer>
    </header>
  )
}

export { SiteHeader }
