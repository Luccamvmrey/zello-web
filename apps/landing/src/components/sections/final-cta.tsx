import { Button } from "@/components/ui/button"
import { SectionContainer } from "@/components/section-container"

function FinalCta() {
  return (
    <section id="cta" className="scroll-mt-20 bg-primary py-20 sm:py-28">
      <SectionContainer className="flex flex-col items-center gap-6 text-center">
        <h2 className="max-w-2xl font-mono text-2xl tracking-tight text-balance text-primary-foreground sm:text-3xl lg:text-5xl">
          Pronto pra parar de calcular repasse na mão?
        </h2>
        <p className="max-w-md text-sm leading-relaxed text-primary-foreground/80 lg:text-base">
          Crie sua conta e comece a dividir cada pagamento no instante da
          venda, com registro auditável de cada centavo.
        </p>
        <Button
          render={<a href="#" />}
          nativeButton={false}
          size="xl"
          className="mt-2 bg-background text-foreground hover:bg-background/90"
        >
          Criar conta
        </Button>
      </SectionContainer>
    </section>
  )
}

export { FinalCta }
