import { FlowField } from "@/components/flow-field"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { FinalCta } from "@/components/sections/final-cta"
import { Hero } from "@/components/sections/hero"
import { HowItWorks } from "@/components/sections/how-it-works"
import { SavingsCalculator } from "@/components/sections/savings-calculator"
import { Trust } from "@/components/sections/trust"

function App() {
  return (
    <div className="relative min-h-dvh bg-background">
      <FlowField />
      <div className="relative z-10 flex min-h-dvh flex-col md:rounded-[20px]">
        <SiteHeader />
        <main className="flex flex-col gap-2.5 px-2 pt-2 mx-auto md:px-2.5 md:pt-2.5 container">
          <Hero />
          <HowItWorks />
          <SavingsCalculator />
          <Trust />
          <FinalCta />
        </main>
        <SiteFooter />
      </div>
    </div>
  )
}

export default App
