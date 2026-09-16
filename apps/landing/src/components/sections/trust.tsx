import { ReceiptText, ShieldCheck, SlidersHorizontal } from "lucide-react"

import { Island, IslandCard } from "@/components/island"
import { Reveal } from "@/components/reveal"

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

export function Trust() {
  return (
    <Island id="seguranca" className="scroll-mt-20 px-6 py-12 md:px-12 md:py-16">
      <h2 className="text-[clamp(2rem,3.2vw,3rem)] font-bold leading-tight tracking-tight">
        Confiança e <span className="text-primary">segurança</span>
      </h2>

      <div className="mt-10 grid gap-2.5 lg:grid-cols-3">
        {points.map((point, index) => (
          <Reveal key={point.title} delay={index * 100} className="h-full">
            <IslandCard className="flex h-full flex-col gap-4 px-6 py-8">
              <span className="grid size-10 shrink-0 place-items-center rounded-md bg-surface-sunken text-primary">
                <point.icon aria-hidden="true" className="size-5" />
              </span>
              <h3 className="text-lg font-semibold text-foreground">{point.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{point.body}</p>
            </IslandCard>
          </Reveal>
        ))}
      </div>
    </Island>
  )
}
