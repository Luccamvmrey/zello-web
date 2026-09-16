import { ArrowRightIcon } from "lucide-react"

import { Island } from "@/components/island"
import { Button } from "@/components/ui/button"
import { registerUrl } from "@/lib/urls"

export function FinalCta() {
  return (
    // Island normal, não uma banda lima: uma superfície clara do tamanho da
    // seção quebraria o conceito de painéis flutuando num mar escuro.
    <Island
      id="cta"
      className="flex scroll-mt-20 flex-col items-center gap-6 px-6 py-20 text-center md:px-12 md:py-28"
    >
      <h2 className="max-w-3xl text-[clamp(2rem,3.4vw,3rem)] font-bold leading-tight tracking-tight text-balance">
        Pronto pra parar de calcular repasse na mão?
      </h2>
      <p className="max-w-xl text-[clamp(1rem,1.2vw,1.125rem)] leading-relaxed text-muted-foreground">
        Crie sua conta e comece a dividir cada pagamento no instante da venda, com registro
        auditável de cada centavo.
      </p>
      <Button
        render={<a href={registerUrl} />}
        nativeButton={false}
        size="xl"
        className="mt-2 rounded-[10px] text-[1.125rem]"
      >
        Criar conta
        <ArrowRightIcon />
      </Button>
    </Island>
  )
}
