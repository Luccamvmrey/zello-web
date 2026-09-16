import { ArrowRightIcon } from "lucide-react"

import { Island } from "@/components/island"
import { Button } from "@/components/ui/button"
import { registerUrl } from "@/lib/urls"

export function Hero() {
  return (
    <Island className="flex min-h-[88vh] flex-col gap-10 px-6 py-14 md:px-12 md:py-20 lg:flex-row lg:items-center lg:gap-6">
      <div className="lg:w-[55%]">
        <h1 className="font-bold leading-[0.95] tracking-tight">
          <span className="block text-[clamp(1.9rem,3.4vw,3.5rem)]">Seu repasse,</span>
          <span className="block text-[clamp(2.3rem,4.4vw,4.5rem)] text-primary">
            Simplificado.
          </span>
        </h1>

        <p className="mt-8 max-w-[900px] text-[clamp(0.875rem,1.1vw,1.25rem)] leading-snug text-muted-foreground">
          Estrutura de pagamentos inteligentes que elimina o dinheiro parado na sua conta.
          O valor do profissional vai direto para ele, no momento da venda.
        </p>

        <Button
          render={<a href={registerUrl} />}
          nativeButton={false}
          size="xl"
          className="mt-10 rounded-[10px] text-[1.125rem]"
        >
          Criar conta
          <ArrowRightIcon />
        </Button>
      </div>

      <div className="lg:w-[45%]">
        <picture>
          <source srcSet="/images/poscel.webp" type="image/webp" />
          <img
            src="/images/poscel.png"
            alt="Celular com o painel da Zello ao lado de uma maquininha de cartão"
            width={1362}
            height={1463}
            fetchPriority="high"
            decoding="async"
            className="mx-auto h-auto w-full max-w-[560px] object-contain"
          />
        </picture>
      </div>
    </Island>
  )
}
