import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"

function SectionContainer({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-3xl px-6 sm:px-8 lg:max-w-6xl lg:px-12 xl:max-w-7xl",
        className,
      )}
      {...props}
    />
  )
}

export { SectionContainer }
