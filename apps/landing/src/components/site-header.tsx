import { MenuIcon } from "lucide-react"
import { useState } from "react"

import { MobileNav } from "@/components/mobile-nav"
import { Button } from "@/components/ui/button"
import { navLinks } from "@/lib/nav"
import { loginUrl } from "@/lib/urls"

/**
 * O header não é uma island: fica direto sobre o "mar", com blur, e o flow
 * field continua visível por trás dele.
 */
export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    // O overlay mobile fica FORA do <header> de propósito: `backdrop-filter`
    // transforma o header em containing block para descendentes `fixed`, e o
    // `inset-0` do menu passaria a valer contra a faixa do header em vez da
    // viewport.
    <>
      <header className="sticky top-0 z-50 bg-background backdrop-blur-[8px]">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 py-3 md:px-8">
          <a href="#" aria-label="Zello — início" className="shrink-0">
            <img
              src="/images/logo.png"
              alt="Zello"
              width={83}
              height={45}
              className="h-9 w-auto md:h-[45px]"
            />
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
            <Button
              render={<a href={loginUrl} />}
              nativeButton={false}
              variant="outline"
              size="lg"
              className="hidden border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground md:inline-flex"
            >
              Entrar
            </Button>

            <Button
              variant="ghost"
              size="icon-lg"
              className="md:hidden"
              aria-label="Abrir menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen(true)}
            >
              <MenuIcon />
            </Button>
          </div>
        </div>
      </header>

      {menuOpen ? <MobileNav onClose={() => setMenuOpen(false)} /> : null}
    </>
  )
}
