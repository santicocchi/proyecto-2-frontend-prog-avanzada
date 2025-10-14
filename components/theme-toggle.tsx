"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Evita el "hydration mismatch" en Next.js
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="h-9 w-9 text-white hover:bg-white/10"
      aria-label="Cambiar tema"
    >
      {isDark ? (
        <Sun className="h-5 w-5" /> 
      ) : (
        <Moon className="h-5 w-5" /> 
      )}
    </Button>
  )
}
