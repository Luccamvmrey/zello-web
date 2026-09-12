import { Check, Minus } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { SectionContainer } from "@/components/section-container"

const today = [
  "Planilha conferida no fim do mês",
  "Cálculo manual do repasse de cada profissional",
  "Dinheiro do profissional passando pela sua conta",
  "“Combinado de boca”, sem registro de quem recebeu o quê",
]

const withZello = [
  "Divisão feita no instante da venda",
  "Cada parte direto na conta certa",
  "Nada do profissional passa pela sua conta",
  "Registro com data, valor e destino em toda divisão",
]

function BeforeAfter() {
  return (
    <section className="border-b border-border py-16 sm:py-24">
      <SectionContainer>
        <Reveal>
          <h2 className="font-mono text-2xl tracking-tight text-balance text-foreground lg:text-4xl">
            O fim do mês muda de lugar.
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            O trabalho de dividir não some porque alguém passou a fazer mais
            rápido. Ele some porque deixou de existir.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-0">
          <Reveal className="lg:pr-12">
            <h3 className="font-mono text-sm tracking-widest text-muted-foreground uppercase">
              Hoje
            </h3>
            <ul className="mt-6 flex flex-col gap-4">
              {today.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Minus
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                  />
                  <span className="text-sm leading-relaxed text-muted-foreground">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120} className="lg:border-l lg:border-border lg:pl-12">
            <h3 className="font-mono text-sm tracking-widest text-highlight uppercase">
              Com Zello
            </h3>
            <ul className="mt-6 flex flex-col gap-4">
              {withZello.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-highlight"
                  />
                  <span className="text-sm leading-relaxed text-foreground">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </SectionContainer>
    </section>
  )
}

export { BeforeAfter }
