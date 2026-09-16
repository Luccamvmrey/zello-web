import { useLayoutEffect, useRef } from "react"

import { formatBRLCents } from "@/lib/utils"

const FIELD_CLASS =
  "min-w-0 max-w-full bg-transparent text-[clamp(1.5rem,3vw,3rem)] font-semibold tabular-nums text-primary outline-none placeholder:text-primary/50"

/**
 * Faz o campo crescer com o que o usuário digita.
 *
 * O design original media o texto num span espelho, mas o span nunca bate
 * exatamente com a caixa do input (métricas de form control) e o último
 * caractere ficava cortado. Medir o próprio input — zerar a largura e ler o
 * scrollWidth — é exato por construção.
 *
 * A medição também precisa rodar de novo quando a webfont (Geist, via
 * @fontsource) termina de carregar depois do efeito — senão o texto muda de
 * largura sob a mesma `text` e o valor fica cortado (o efeito não reroda
 * porque sua única dependência não mudou). Também reroda no resize: o
 * font-size usa clamp(...vw...), então a largura necessária muda com a
 * viewport mesmo com `text` igual.
 */
function useAutoWidth(text: string) {
  const ref = useRef<HTMLInputElement>(null)

  useLayoutEffect(() => {
    const input = ref.current
    if (!input) return

    const measure = () => {
      input.style.width = "0px"
      input.style.width = `${input.scrollWidth + 2}px`
    }

    measure()
    document.fonts?.ready.then(measure)
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [text])

  return ref
}

type CurrencyInputProps = {
  id: string
  label: string
  /** Valor em centavos — inteiro, para não acumular erro de float. */
  cents: number
  onChange: (cents: number) => void
}

export function CurrencyInput({ id, label, cents, onChange }: CurrencyInputProps) {
  const text = formatBRLCents(cents)
  const ref = useAutoWidth(text)

  return (
    <div>
      <label htmlFor={id} className="block text-sm text-muted-foreground">
        {label}
      </label>

      <div className="mt-2 inline-flex max-w-full border-b border-primary pb-1">
        <input
          ref={ref}
          id={id}
          value={text}
          inputMode="numeric"
          autoComplete="off"
          // Só os dígitos importam: reconstrói o valor em centavos a cada
          // tecla, o que mantém a máscara estável mesmo colando texto.
          // Limitado a 10 dígitos (até R$ 99.999.999,99): acima disso o
          // valor não cabe mais no campo sem cortar visualmente, e não é um
          // faturamento mensal realista para este simulador.
          onChange={(event) => {
            const digits = event.target.value.replace(/\D/g, "").slice(0, 10)
            onChange(digits ? Number.parseInt(digits, 10) : 0)
          }}
          className={FIELD_CLASS}
        />
      </div>
    </div>
  )
}

type PercentInputProps = {
  id: string
  label: string
  /** Percentual em 0–100. */
  value: number
  onChange: (value: number) => void
}

export function PercentInput({ id, label, value, onChange }: PercentInputProps) {
  const text = String(value)
  const ref = useAutoWidth(text)

  return (
    <div>
      <label htmlFor={id} className="block text-sm text-muted-foreground">
        {label}
      </label>

      <div className="mt-2 inline-flex max-w-full items-baseline border-b border-primary pb-1">
        <input
          ref={ref}
          id={id}
          value={text}
          inputMode="numeric"
          autoComplete="off"
          onChange={(event) => {
            const digits = event.target.value.replace(/\D/g, "").slice(0, 3)
            onChange(digits ? Math.min(Number.parseInt(digits, 10), 100) : 0)
          }}
          className={FIELD_CLASS}
        />
        <span aria-hidden="true" className={FIELD_CLASS}>
          %
        </span>
      </div>
    </div>
  )
}
