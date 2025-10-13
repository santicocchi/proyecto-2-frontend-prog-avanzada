"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export function Breadcrumbs() {
  const pathname = usePathname()

  const pathSegments = pathname.split("/").filter(Boolean)

  const breadcrumbMap: Record<string, string> = {
    auth: "Autenticación",
    login: "Iniciar Sesión",
    register: "Crear Cuenta",
    ventas: "Ventas",
    registrar: "Registrar",
    consultar: "Consultar",
    marcas: "Marcas",
    productos: "Productos",
    estadisticas: "Estadísticas",
  }

  if (pathSegments.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-white/80">
      <Link href="/" className="hover:text-white transition-colors">
        Inicio
      </Link>
      {pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join("/")}`
        const isLast = index === pathSegments.length - 1
        const label = breadcrumbMap[segment] || segment

        return (
          <div key={path} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4" />
            {isLast ? (
              <span className="text-white font-medium">{label}</span>
            ) : (
              <Link href={path} className="hover:text-white transition-colors">
                {label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
