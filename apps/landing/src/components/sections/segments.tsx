import { Building2, Scissors, Sparkles, Stethoscope } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { SectionContainer } from "@/components/section-container"

const segments = [
  { icon: Stethoscope, label: "Clínicas" },
  { icon: Scissors, label: "Salões" },
  { icon: Sparkles, label: "Barbearias" },
  { icon: Building2, label: "Consultórios" },
]

function Segments() {
  return (
    <section className="border-b border-border bg-secondary py-12 sm:py-16">
      <SectionContainer>
        <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Feito para
        </p>

        <ul className="mt-8 grid grid-cols-2 gap-y-8 lg:grid-cols-4 lg:gap-y-0 lg:divide-x lg:divide-border">
          {segments.map((segment, index) => (
            <Reveal
              as="li"
              key={segment.label}
              delay={index * 80}
              className="flex items-center gap-3 lg:justify-center lg:px-4"
            >
              <segment.icon
                aria-hidden="true"
                className="size-5 shrink-0 text-primary dark:text-highlight"
              />
              <span className="font-mono text-base tracking-tight text-foreground lg:text-lg">
                {segment.label}
              </span>
            </Reveal>
          ))}
        </ul>

        <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
          — e qualquer lugar onde mais de um profissional atende sob o mesmo
          teto.
        </p>
      </SectionContainer>
    </section>
  )
}

export { Segments }
