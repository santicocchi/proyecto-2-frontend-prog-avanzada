"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Menu,
  ShoppingCart,
  FileText,
  Tag,
  Package,
  BarChart3,
  Users,
  UserCircle,
  Layers,
  Truck,
  ChartPie,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"
import { useAuth } from "./auth/context/UserContext"

//  Estructura de navegación con roles
const navSections = [
  {
    title: "Dashboards",
    items: [
      {
        href: "/dashboard",
        label: "Dashboard",
        icon: ChartPie,
        roles: ["dueño", "empleado"], //  permitido para ambos
      },
    ],
  },
  {
    title: "Ventas",
    items: [
      { href: "/ventas/registrar", label: "Registrar Venta", icon: ShoppingCart, roles: ["dueño", "empleado"] },
      { href: "/ventas/consultar", label: "Consultar Ventas", icon: FileText, roles: ["dueño", "empleado"] },
    ],
  },
  {
    title: "Clientes",
    items: [
      { href: "/clientes/registrar", label: "Registrar Cliente", icon: UserCircle, roles: ["dueño", "empleado"] },
      { href: "/clientes/consultar", label: "Consultar Clientes", icon: Users, roles: ["dueño", "empleado"] },
    ],
  },
  {
    title: "Marcas",
    items: [
      { href: "/marcas/registrar", label: "Registrar Marca", icon: Tag, roles: ["dueño"] },
      { href: "/marcas/consultar", label: "Consultar Marcas", icon: FileText, roles: ["dueño", "empleado"] },
    ],
  },
  {
    title: "Líneas",
    items: [
      { href: "/lineas/registrar", label: "Registrar Línea", icon: Layers, roles: ["dueño"] },
      { href: "/lineas/consultar", label: "Consultar Líneas", icon: FileText, roles: ["dueño", "empleado"] },
    ],
  },
  {
    title: "Productos",
    items: [
      { href: "/productos/registrar", label: "Registrar Producto", icon: Package, roles: ["dueño"] },
      { href: "/productos/consultar", label: "Consultar Productos", icon: FileText, roles: ["dueño", "empleado"] },
    ],
  },
  {
    title: "Proveedores",
    items: [
      { href: "/proveedores/registrar", label: "Registrar Proveedor", icon: Truck, roles: ["dueño"] },
      { href: "/proveedores/consultar", label: "Consultar Proveedores", icon: FileText, roles: ["dueño", "empleado"] },
    ],
  },
  {
    title: "Usuarios",
    items: [{ href: "/usuarios/consultar", label: "Consultar Usuarios", icon: Users, roles: ["dueño"] }],
  },
  {
    title: "Estadísticas",
    items: [{ href: "/estadisticas", label: "Ver Estadísticas", icon: BarChart3, roles: ["dueño", "empleado"] }],
  },
]

export function QuickNavLeft() {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [open, setOpen] = React.useState(false)

  const { user, hasRole } = useAuth()

  //  Renderizado dinámico con validación de roles
  const NavContent = () => (
    <nav className="space-y-6">
      {navSections.map((section) => {
        // Filtrar ítems según roles del usuario
        const visibleItems = section.items.filter((item) =>
          item.roles?.some((role) => hasRole(role))
        )

        if (visibleItems.length === 0) return null

        return (
          <div key={section.title}>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {visibleItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isActive &&
                          "bg-[#2B3A8F] text-white hover:bg-[#2B3A8F]/90 dark:bg-[#1e2870]"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </nav>
  )

  //  Mobile version (Drawer)
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed top-20 left-4 z-40 h-10 w-10 rounded-full shadow-lg bg-transparent"
            aria-label="Abrir navegación rápida"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle>Navegación Rápida</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <NavContent />
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  // Desktop version (Sidebar)
  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 border-r bg-background p-6 overflow-y-auto">
      <NavContent />
    </aside>
  )
}
