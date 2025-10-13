"use client"

import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

interface AppHeaderProps {
  showBreadcrumbs?: boolean
}

export function AppHeader({ showBreadcrumbs = false }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#2B3A8F] dark:bg-[#1e2870]">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-white">Sistema de Gestión de Ventas</h1>
          {showBreadcrumbs && <Breadcrumbs />}
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <Link href="/" aria-label="Ir al inicio">
              <Home className="h-5 w-5" />
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
