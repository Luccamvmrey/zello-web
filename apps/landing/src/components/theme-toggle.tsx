import { Moon, Sun } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const STORAGE_KEY = "zello-theme"

/**
 * Reads back what the inline script in index.html already decided and applied
 * before first paint, so the toggle's state always matches the document.
 */
function resolveInitialTheme(): "light" | "dark" {
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(resolveInitialTheme)

  function toggle() {
    const next = theme === "dark" ? "light" : "dark"
    setTheme(next)
    document.documentElement.classList.toggle("dark", next === "dark")
    localStorage.setItem(STORAGE_KEY, next)
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggle}
      aria-label={theme === "dark" ? "Usar tema claro" : "Usar tema escuro"}
    >
      <Sun className="hidden dark:block" />
      <Moon className="block dark:hidden" />
    </Button>
  )
}

export { ThemeToggle }
