import { LedgerRule } from "@/components/ledger-rule"
import { Reveal } from "@/components/reveal"
import { SectionContainer } from "@/components/section-container"

const steps = [
  {
    title: "O cliente paga",
    body: "A venda acontece do jeito que já acontece hoje — no cartão, no Pix, como for. Nada muda pra quem está pagando.",
  },
  {
    title: "O valor se divide na hora",
    body: "No mesmo instante da venda, a parte de cada profissional já segue direto pra conta dele. Não passa pela conta do estabelecimento.",
  },
  {
    title: "Cada divisão fica registrada",
    body: "Toda divisão gera um registro com data, valor e destino. Sem planilha, sem “combinado de boca”, sem dúvida sobre quem recebeu o quê.",
  },
  {
    title: "Fim do repasse manual",
    body: "Ninguém mais precisa calcular e transferir a parte de cada profissional no fim do mês. O sistema já fez isso na hora da venda.",
  },
]

function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="scroll-mt-20 border-b border-border py-16 sm:py-24"
    >
      <SectionContainer>
        <Reveal>
          <h2 className="font-mono text-2xl tracking-tight text-foreground lg:text-4xl">
            Como funciona
          </h2>
        </Reveal>

        <div className="mt-10 flex flex-col lg:grid lg:grid-cols-4 lg:gap-x-8">
          <LedgerRule className="lg:hidden" />
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 100}>
              <div className="flex flex-col gap-2 py-6 sm:flex-row sm:gap-8 lg:flex-col lg:gap-3 lg:py-0">
                {/* Desktop: the step markers sit on a shared rule, so the four
                    columns read as one sequence rather than four cards. */}
                <div className="hidden lg:block">
                  <div className="relative border-t border-border pt-6">
                    <span
                      aria-hidden="true"
                      className="absolute -top-[3px] left-0 size-1.5 rounded-full bg-highlight"
                    />
                    <span className="font-mono text-4xl tabular-nums text-highlight/40">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                <span className="font-mono text-sm text-highlight tabular-nums sm:w-10 sm:shrink-0 lg:hidden">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="flex flex-col gap-1">
                  <h3 className="font-medium text-foreground">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              </div>
              <LedgerRule className="lg:hidden" />
            </Reveal>
          ))}
        </div>
      </SectionContainer>
    </section>
  )
}

export { HowItWorks }
