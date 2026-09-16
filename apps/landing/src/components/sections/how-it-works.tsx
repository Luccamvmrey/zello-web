import { Island } from "@/components/island"
import { Reveal } from "@/components/reveal"

const steps = [
  {
    step: "1º Passo:",
    title: "Cliente realiza o pagamento.",
    description: "Da maneira que preferir, seja via pix, crédito ou débito.",
    image: "/images/passo1.webp",
    imageWidth: 1200,
    imageHeight: 658,
  },
  {
    step: "2º Passo:",
    title: "Nosso sistema calcula e divide os valores.",
    description:
      "Respeitando suas regras de negócio, seja um valor fixo ou percentual.",
    image: "/images/passo2.webp",
    imageWidth: 1200,
    imageHeight: 658,
  },
  {
    step: "3º Passo:",
    title: "O pagamento é liberado.",
    description:
      "Com notas fiscais emitidas de maneira prática, rápida e segura.",
    image: "/images/passo3.webp",
    imageWidth: 1200,
    imageHeight: 1200,
  },
]

export function HowItWorks() {
  return (
    <div
      id="como-funciona"
      className="flex scroll-mt-20 flex-col gap-2.5 lg:flex-row lg:items-stretch"
    >
      {/* 1. MUDANÇA AQUI: Reduzi a largura de lg:w-[45%] para lg:w-[40%] (ou até 35% se preferir) */}
      <Island className="px-6 py-12 md:px-12 lg:w-[45%]">
        {/* Adicionei um flex e justify-center caso queira centralizar verticalmente no futuro, 
            mas o sticky vai manter ele no topo durante o scroll */}
        <div className="lg:sticky lg:top-16">
          <h2 className="text-[clamp(1.6rem,3.2vw,2.8rem)] font-bold leading-tight tracking-tight">
            Como funciona<span className="text-primary">?</span>
          </h2>
          <p className="mt-4 text-[clamp(0.875rem,1.1vw,1.05rem)] text-muted-foreground">
            Veja passo a passo como isso é possível.
          </p>
        </div>
      </Island>

      {/* 1. MUDANÇA AQUI: Aumentei a largura de lg:w-[55%] para lg:w-[60%] */}
      <div className="flex flex-col gap-2.5 lg:w-[55%]">
        {steps.map((step, index) => (
          <Reveal key={step.step} delay={index * 80}>
            {/* 2. MUDANÇA AQUI: Reduzi o padding vertical de md:py-12 para md:py-8 */}
            <Island
              className={`flex h-full min-h-[300px] items-start gap-3 px-6 py-8 md:px-10 md:py-10 ${
                index % 2 === 1 ? "flex-row-reverse" : ""
              }`}
            >
              <div className="min-w-0 flex-1 self-start">
                <p className="text-[clamp(1.05rem,1.75vw,1.6rem)] font-semibold text-primary">
                  {step.step}
                </p>
                <h3 className="mt-2 text-[clamp(1rem,1.5vw,1.4rem)] font-semibold leading-tight text-foreground">
                  {step.title}
                </h3>
                <p className="mt-4 text-[clamp(0.875rem,1vw,0.9rem)] text-muted-foreground">
                  {step.description}
                </p>
              </div>
              <img
                src={step.image}
                alt={step.title}
                width={step.imageWidth}
                height={step.imageHeight}
                loading="lazy"
                decoding="async"
                className="hidden aspect-square w-44 shrink-0 rounded-lg object-cover sm:block md:w-60 lg:w-64"
              />
            </Island>
          </Reveal>
        ))}
      </div>
    </div>
  )
}