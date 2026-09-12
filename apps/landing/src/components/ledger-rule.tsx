import { cn } from "@/lib/utils"

function LedgerRule({ className }: { className?: string }) {
  return <div role="presentation" className={cn("h-px w-full bg-border", className)} />
}

export { LedgerRule }
