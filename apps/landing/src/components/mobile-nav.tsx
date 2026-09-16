import { XIcon } from "lucide-react"
import { useEffect, useRef } from "react"

import { Button } from "@/components/ui/button"
import { navLinks } from "@/lib/nav"
import { loginUrl, registerUrl } from "@/lib/urls"

type MobileNavProps = {
  onClose: () => void
}

/**
 * Overlay de navegação abaixo de `md`. Um Dialog do Base UI seria peso morto
 * aqui: a única interação é fechar, e os links já levam o foco embora.
 */
export function MobileNav({ onClose }: MobileNavProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose()
    }

    // Trava o scroll do fundo enquanto o overlay cobre a tela.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose])

  return (
    <div
      id="mobile-nav"
      className="fixed inset-0 z-50 flex flex-col bg-background px-6 py-4 md:hidden"
    >
      <div className="flex items-center justify-between">
        <img src="/images/logo.png" alt="Zello" width={83} height={45} className="h-11 w-auto" />
        <Button
          ref={closeRef}
          variant="ghost"
          size="icon-lg"
          aria-label="Fechar menu"
          onClick={onClose}
        >
          <XIcon />
        </Button>
      </div>

      <nav aria-label="Seções" className="mt-12 flex flex-col gap-8">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="text-3xl font-semibold text-foreground transition-colors hover:text-primary"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-3 pb-8">
        <Button
          render={<a href={loginUrl} />}
          nativeButton={false}
          variant="outline"
          size="xl"
          className="w-full border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground"
        >
          Entrar
        </Button>
        <Button render={<a href={registerUrl} />} nativeButton={false} size="xl" className="w-full">
          Criar conta
        </Button>
      </div>
    </div>
  )
}
