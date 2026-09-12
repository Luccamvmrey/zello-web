import { useId, useState } from "react"
import { Input } from "@/components/ui/input"
import { LedgerRule } from "@/components/ledger-rule"
import { SectionContainer } from "@/components/section-container"
import { formatBRL } from "@/lib/utils"

const REVENUE_MAX = 200000
const TAX_RATE_MAX = 40

function SavingsCalculator() {
  const revenueId = useId()
  const taxRateId = useId()
  const [revenue, setRevenue] = useState(30000)
  const [taxRate, setTaxRate] = useState(15)

  const estimate = Math.max(revenue, 0) * (Math.max(taxRate, 0) / 100)

  return (
    <section
      id="calculadora"
      className="surface-inverted scroll-mt-20 border-b border-border py-16 sm:py-24"
    >
      <SectionContainer>
        <h2 className="font-mono text-2xl tracking-tight text-balance text-foreground lg:text-4xl">
          Quanto hoje passa pela sua conta sem precisar?
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          Informe o faturamento e a alíquota média de encargos do seu
          estabelecimento pra ver, em números, o tamanho do valor que hoje
          entra e sai da sua conta antes de chegar ao profissional certo.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
          <Field
            id={revenueId}
            label="Faturamento mensal (R$)"
            value={revenue}
            onChange={setRevenue}
            min={0}
            max={REVENUE_MAX}
            step={500}
          />
          <Field
            id={taxRateId}
            label="Alíquota média de encargos (%)"
            value={taxRate}
            onChange={setTaxRate}
            min={0}
            max={TAX_RATE_MAX}
            step={0.5}
          />
        </div>

        <LedgerRule className="mt-12" />

        <div className="flex flex-col gap-8 py-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">
              Valor estimado que passa pela sua conta sem precisar
            </span>
            <span className="font-mono text-5xl font-medium tracking-tight tabular-nums text-highlight lg:text-7xl">
              {formatBRL(estimate)}
              <span className="ml-2 font-sans text-base font-normal text-muted-foreground">
                / mês
              </span>
            </span>
          </div>

          <dl className="flex gap-10">
            <div className="flex flex-col gap-1">
              <dt className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                Por ano
              </dt>
              <dd className="font-mono text-xl tabular-nums text-foreground">
                {formatBRL(estimate * 12)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                Em 5 anos
              </dt>
              <dd className="font-mono text-xl tabular-nums text-foreground">
                {formatBRL(estimate * 60)}
              </dd>
            </div>
          </dl>
        </div>

        <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
          Estimativa ilustrativa, calculada apenas com os números que você
          digitou acima. Não é um cálculo tributário validado por contador ou
          advogado — use como referência, não como orientação fiscal.
        </p>
      </SectionContainer>
    </section>
  )
}

function Field({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step,
}: {
  id: string
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
}) {
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={id} className="text-sm text-muted-foreground">
        {label}
      </label>
      <Input
        id={id}
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-12 font-mono text-lg tabular-nums"
      />
      {/* Mirrors the number field so the section invites a drag, not just
          typing. aria-hidden because the input above is the labelled control. */}
      <input
        aria-hidden="true"
        tabIndex={-1}
        type="range"
        min={min}
        max={max}
        step={step}
        value={Math.min(Math.max(value, min), max)}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted accent-highlight"
      />
    </div>
  )
}

export { SavingsCalculator }
