import { ReceiptText, ShieldCheck, SlidersHorizontal } from "lucide-react"
import { LedgerRule } from "@/components/ledger-rule"
import { Reveal } from "@/components/reveal"
import { SectionContainer } from "@/components/section-container"

const points = [
  {
    icon: ShieldCheck,
    title: "Processamento sobre a infraestrutura da Stone",
    body: "O dinheiro passa pela infraestrutura de pagamento da Stone, uma processadora já estabelecida no mercado. O Zello não guarda nem movimenta o valor por conta própria — ele apenas define como a divisão acontece no instante da venda.",
  },
  {
    icon: ReceiptText,
    title: "Toda divisão vira um registro",
    body: "Cada divisão de pagamento gera um registro com data, valor e destino. Isso fica disponível pra você consultar quando quiser — sem depender de memória ou de planilha paralela.",
  },
  {
    icon: SlidersHorizontal,
    title: "Você define as regras da divisão",
    body: "A porcentagem de cada profissional é configurada por você e vale a partir da próxima venda. Nada é decidido pelo Zello, e nenhuma mudança altera divisões que já aconteceram.",
  },
]

function Trust() {
  return (
    <section
      id="seguranca"
      className="scroll-mt-20 border-b border-border bg-secondary py-16 sm:py-24"
    >
      <SectionContainer>
        <Reveal>
          <h2 className="font-mono text-2xl tracking-tight text-foreground lg:text-4xl">
            Confiança e segurança
          </h2>
        </Reveal>

        <div className="mt-10 flex flex-col lg:grid lg:grid-cols-3 lg:gap-x-10">
          <LedgerRule className="lg:hidden" />
          {points.map((point, index) => (
            <Reveal key={point.title} delay={index * 100}>
              <div className="flex flex-col gap-4 py-6 lg:border-t lg:border-border lg:py-0 lg:pt-6">
                <span className="grid size-10 shrink-0 place-items-center rounded-md border border-border bg-background text-primary dark:text-highlight">
                  <point.icon aria-hidden="true" className="size-5" />
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="font-medium text-foreground">{point.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {point.body}
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

export { Trust }
