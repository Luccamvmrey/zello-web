import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Hero } from "@/components/sections/hero"
import { Segments } from "@/components/sections/segments"
import { BeforeAfter } from "@/components/sections/before-after"
import { HowItWorks } from "@/components/sections/how-it-works"
import { SavingsCalculator } from "@/components/sections/savings-calculator"
import { Trust } from "@/components/sections/trust"
import { FinalCta } from "@/components/sections/final-cta"

function App() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main>
        <Hero />
        <Segments />
        <BeforeAfter />
        <HowItWorks />
        <SavingsCalculator />
        <Trust />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  )
}

export default App
