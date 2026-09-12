import { cn } from "@/lib/utils"

/**
 * The Zello mark: one stream forking into two. Same gesture as the splitting
 * path in the hero receipt, so the logo and the product illustration rhyme.
 */
function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className={cn("size-5", className)}
    >
      <path
        d="M12 3V9C12 12 9.5 12.5 7 15C5 17 4.5 18.5 4.5 21M12 9C12 12 14.5 12.5 17 15C19 17 19.5 18.5 19.5 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export { BrandMark }
