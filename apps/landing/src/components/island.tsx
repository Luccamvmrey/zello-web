import type { ComponentPropsWithoutRef } from "react"

import { cn } from "@/lib/utils"

/**
 * Painel flutuante sobre o "mar" (--background).
 *
 * A superfície é translúcida com backdrop-blur para o flow field aparecer
 * difuso por trás do conteúdo — nítido ele disputaria com o texto.
 *
 * O raio do blur é 4px, não um valor alto: o campo é feito de pontos e linhas
 * de 1–2px, e um blur grande (testado a 24px) apaga exatamente esse tipo de
 * feição — a island volta a parecer chapada. 4px suaviza o traço sem destruí-lo,
 * e é a mesma ordem de grandeza do header (8px).
 *
 * Sem borda e sem sombra: o painel é definido só pelo tom e pelo blur. Um
 * `ring` foi tentado para reforçar a silhueta e ficou marcado demais.
 *
 * 16px de raio no mobile, 20px a partir de `md` (§9).
 */
export function Island({ className, ...props }: ComponentPropsWithoutRef<"section">) {
  return (
    <section
      className={cn(
        "rounded-2xl bg-surface-sunken/60 backdrop-blur-[1px] md:rounded-[20px]",
        className
      )}
      {...props}
    />
  )
}

/**
 * Card dentro de uma island. Sobe um tom (--card) para se separar da
 * superfície que o contém.
 *
 * Sem `backdrop-blur` próprio de propósito: ele já vive dentro de uma island
 * que aplica o filtro, e seu fundo compõe por cima do resultado já borrado do
 * pai. Um segundo backdrop-filter aninhado só empilharia custo de compositing
 * sem mudar o visual.
 */
export function IslandCard({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("rounded-2xl bg-card/55 md:rounded-[20px]", className)}
      {...props}
    />
  )
}
