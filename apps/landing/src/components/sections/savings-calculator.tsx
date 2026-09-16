import { useId, useState } from "react"

import { CurrencyInput, PercentInput } from "@/components/currency-input"
import { Island, IslandCard } from "@/components/island"
import { Button } from "@/components/ui/button"
import { calculateSavings, type SavingsResult } from "@/lib/calculator"
import { formatBRL } from "@/lib/utils"

export function SavingsCalculator() {
  const revenueId = useId()
  const percentId = useId()

  const [revenueCents, setRevenueCents] = useState(10_000_000)
  const [passThroughPercent, setPassThroughPercent] = useState(30)
  const [result, setResult] = useState<SavingsResult | null>(null)

  function handleCalculate() {
    setResult(
      calculateSavings({
        monthlyRevenue: revenueCents / 100,
        passThroughPercent,
      })
    )
  }

  return (
    <div id="calculadora" className="flex scroll-mt-20 flex-col gap-2.5 lg:flex-row">
      <Island className="px-6 py-12 md:px-12 lg:w-[40%]">
        <h2 className="text-[clamp(2rem,3.2vw,3rem)] font-bold leading-tight tracking-tight">
          Simule sua <span className="text-primary">economia</span>
        </h2>
        <p className="mt-4 text-[clamp(1rem,1.2vw,1.125rem)] text-muted-foreground">
          Descubra o quanto você pode economizar deixando de receber — e de ser tributado
          por — dinheiro que nunca foi seu.
        </p>
      </Island>

      <Island className="px-6 py-12 md:px-12 lg:w-[60%]">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-stretch">
          <div className="flex min-w-0 flex-1 flex-col gap-8">
            <CurrencyInput
              id={revenueId}
              label="Faturamento mensal"
              cents={revenueCents}
              onChange={setRevenueCents}
            />
            <PercentInput
              id={percentId}
              label="Média de repasse"
              value={passThroughPercent}
              onChange={setPassThroughPercent}
            />

            {/* O spec pede "estilo secundário", mas `--secondary` resolve para
                --bg-elevated — exatamente a superfície da island, o que apagaria o
                botão. Dentro desta seção "Calcular" é a ação principal, então usa
                o primário. */}
            <Button size="xl" className="rounded-[10px]" onClick={handleCalculate}>
              Calcular
            </Button>
          </div>

          {result ? (
            <div className="flex flex-col lg:w-[200px] lg:shrink-0">
              <div className="grid grid-cols-3 gap-2 lg:grid-cols-1">
                <ResultCard label="Sem Zello" value={formatBRL(result.withoutZello)} />
                <ResultCard label="Com Zello" value={formatBRL(result.withZello)} />
                <ResultCard label="Economia*" value={formatBRL(result.savings)} />
              </div>

              <p className="mt-auto pt-4 text-xs text-muted-foreground">
                * Valores ilustrativos. Não constitui orientação fiscal.
              </p>
            </div>
          ) : null}
        </div>
      </Island>
    </div>
  )
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <IslandCard className="min-w-0 px-3 py-3">
      <p className="truncate text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 truncate text-[clamp(1rem,1.4vw,1.25rem)] font-semibold tabular-nums text-primary">
        {value}
      </p>
    </IslandCard>
  )
}
