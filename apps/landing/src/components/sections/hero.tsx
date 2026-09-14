import { ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionContainer } from "@/components/section-container"
import { registerUrl } from "@/lib/urls"
import { cn } from "@/lib/utils"

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border py-16 sm:py-24 lg:py-32">
      <div
        aria-hidden="true"
        className="ledger-paper pointer-events-none absolute inset-0 opacity-60"
      />

      <SectionContainer className="relative flex flex-col items-start gap-12 sm:flex-row sm:items-center sm:justify-between sm:gap-16">
        <div className="flex max-w-lg flex-col items-start gap-6 lg:max-w-xl xl:max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 font-mono text-xs text-secondary-foreground">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-highlight" />
            Divisão automática no instante da venda
          </p>

          <h1 className="font-mono text-3xl leading-tight tracking-tight text-balance text-foreground sm:text-4xl lg:text-6xl lg:leading-[1.05] xl:text-7xl">
            O pagamento já nasce{" "}
            {/* The brand theme keeps --primary dark in both schemes, so it is
                illegible on the dark ground; brass carries the accent there. */}
            <span className="text-primary dark:text-highlight">dividido.</span>
          </h1>

          <p className="text-base leading-relaxed text-muted-foreground lg:text-lg">
            No instante em que o cliente paga, a parte de cada profissional já
            sai direto pra conta dele. Sem repasse manual no fim do mês, sem
            acerto de boca, sem dinheiro do outro passando pela sua conta.
          </p>

          <div className="flex flex-col items-stretch gap-3 self-stretch sm:flex-row sm:items-center sm:self-auto">
            <Button
              render={<a href={registerUrl} />}
              nativeButton={false}
              size="xl"
            >
              Criar conta
            </Button>
            <Button
              render={<a href="#como-funciona" />}
              nativeButton={false}
              variant="ghost"
              size="xl"
            >
              Ver como funciona
            </Button>
          </div>

          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck aria-hidden="true" className="size-4 shrink-0 text-primary dark:text-highlight" />
            Sobre a infraestrutura de pagamento da Stone
          </p>
        </div>

        <Receipt />
      </SectionContainer>
    </section>
  )
}

/**
 * One row of the split, drawn as a branch off the receipt's vertical rail:
 *
 *   │
 *   ├──  Estabelecimento ······ R$ 108
 *   └──  Profissional ········· R$  72
 */
function Destination({
  label,
  amount,
  animationClass,
  emphasis,
}: {
  label: string
  amount: string
  /** Full literal class — Tailwind cannot extract an interpolated one. */
  animationClass: string
  emphasis?: boolean
}) {
  return (
    <div
      className={cn("relative flex items-baseline gap-2 pl-6", animationClass)}
    >
      <span
        aria-hidden="true"
        className="absolute top-[0.6rem] left-0 w-4 border-t border-border"
      />
      <dt className="shrink-0 text-sm text-muted-foreground lg:text-base">
        {label}
      </dt>
      <span
        aria-hidden="true"
        className="mb-1 flex-1 border-b border-dashed border-border"
      />
      <dd
        className={
          emphasis
            ? "font-mono text-sm font-medium tabular-nums text-highlight lg:text-base"
            : "font-mono text-sm tabular-nums text-foreground lg:text-base"
        }
      >
        {amount}
      </dd>
    </div>
  )
}

function Receipt() {
  return (
    <div
      role="img"
      aria-label="Recibo ilustrando uma venda de R$ 180 sendo dividida automaticamente: R$ 108 para o estabelecimento e R$ 72 para o profissional."
      className="w-full max-w-xs shrink-0 rounded-lg border border-border bg-card px-6 py-5 shadow-lg transition-transform duration-300 lg:max-w-md lg:shrink lg:-rotate-[1.5deg] lg:px-8 lg:py-7 lg:hover:rotate-0 xl:max-w-lg"
    >
      <p className="text-xs tracking-wide text-muted-foreground uppercase lg:text-sm">
        Venda no balcão
      </p>
      <p className="mt-1 font-mono text-2xl font-medium tabular-nums text-foreground lg:text-4xl">
        R$ 180
      </p>

      <div
        aria-hidden="true"
        className="my-5 h-px w-full origin-left bg-border motion-safe:animate-[zello-split-rule_0.5s_ease-out_0.2s_both]"
      />

      {/* The rail the two branches hang off. It is a sibling rather than a
          border on the list so the draw-down scale does not squash the rows. */}
      <dl className="relative ml-1 flex flex-col gap-4 py-1 lg:gap-5">
        <span
          aria-hidden="true"
          className="absolute inset-y-1 left-0 w-px origin-top bg-border motion-safe:animate-[zello-split-rail_0.4s_ease-out_0.3s_both]"
        />
        <Destination
          label="Estabelecimento"
          amount="R$ 108"
          animationClass="motion-safe:animate-[zello-split-line_0.5s_ease-out_0.55s_both]"
        />
        <Destination
          label="Profissional"
          amount="R$ 72"
          emphasis
          animationClass="motion-safe:animate-[zello-split-line_0.5s_ease-out_0.75s_both]"
        />
      </dl>

      <div
        aria-hidden="true"
        className="mt-6 border-t border-dashed border-border pt-3"
      >
        <p className="font-mono text-[0.65rem] tracking-widest text-muted-foreground uppercase">
          Zello · divisão automática
        </p>
      </div>
    </div>
  )
}

export { Hero }
