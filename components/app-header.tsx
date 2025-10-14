"use client"

import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Home, LogOut } from "lucide-react"
import { logoutUser } from "@/lib/auth"  // 👈 Importamos la función
import { use } from "react"
import { useAuth } from "./auth/context/UserContext"

interface AppHeaderProps {
  showBreadcrumbs?: boolean
}

export function AppHeader({ showBreadcrumbs = false }: AppHeaderProps) {
  const {user} = useAuth()

  // 👇 Función para manejar el logout
  const handleLogout = async () => {
    try {
      await logoutUser()
      window.location.href = "/"
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

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

          {user && (
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            aria-label="Cerrar sesión"
          >
            <LogOut className="h-5 w-5" />
          </Button>
          )}
        </div>
      </div>
    </header>
  )
}
