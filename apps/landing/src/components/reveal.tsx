import { useEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Fades content up the first time it scrolls into view.
 *
 * Falls back to showing content immediately where IntersectionObserver is
 * missing, and the CSS that hides pending content is gated behind
 * prefers-reduced-motion, so motion-averse readers always see it.
 */
function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode
  delay?: number
  className?: string
  as?: "div" | "li" | "section"
}) {
  const ref = useRef<HTMLElement>(null)
  const [state, setState] = useState<"pending" | "visible">(() =>
    typeof IntersectionObserver === "undefined" ? "visible" : "pending"
  )

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === "undefined") return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setState("visible")
            observer.disconnect()
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px" }
    )

    observer.observe(node)

    // Failsafe: content must never stay invisible because the observer did
    // not fire (print, headless capture, scroll containers we did not expect).
    const timer = window.setTimeout(() => {
      setState("visible")
      observer.disconnect()
    }, 3000)

    return () => {
      window.clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  return (
    <Tag
      ref={ref as never}
      data-reveal={state}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as never) : undefined}
      className={cn(className)}
    >
      {children}
    </Tag>
  )
}

export { Reveal }
