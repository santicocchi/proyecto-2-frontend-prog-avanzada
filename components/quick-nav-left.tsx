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
  LogIn,
  UserPlus,
  Users,
  User,
  Layers,
  Truck,
  UserCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"

const navSections = [
  {
    title: "Autenticación",
    items: [
      { href: "/auth/login", label: "Iniciar Sesión", icon: LogIn },
      { href: "/auth/register", label: "Crear Cuenta", icon: UserPlus },
    ],
  },
  {
    title: "Perfil",
    items: [{ href: "/perfil", label: "Mi Perfil", icon: User }],
  },
  {
    title: "Ventas",
    items: [
      { href: "/ventas/registrar", label: "Registrar Venta", icon: ShoppingCart },
      { href: "/ventas/consultar", label: "Consultar Ventas", icon: FileText },
    ],
  },
  {
    title: "Clientes",
    items: [
      { href: "/clientes/registrar", label: "Registrar Cliente", icon: UserCircle },
      { href: "/clientes/consultar", label: "Consultar Clientes", icon: Users },
    ],
  },
  {
    title: "Marcas",
    items: [
      { href: "/marcas/registrar", label: "Registrar Marca", icon: Tag },
      { href: "/marcas/consultar", label: "Consultar Marcas", icon: FileText },
    ],
  },
  {
    title: "Líneas",
    items: [
      { href: "/lineas/registrar", label: "Registrar Línea", icon: Layers },
      { href: "/lineas/consultar", label: "Consultar Líneas", icon: FileText },
    ],
  },
  {
    title: "Productos",
    items: [
      { href: "/productos/registrar", label: "Registrar Producto", icon: Package },
      { href: "/productos/consultar", label: "Consultar Productos", icon: FileText },
    ],
  },
  {
    title: "Proveedores",
    items: [
      { href: "/proveedores/registrar", label: "Registrar Proveedor", icon: Truck },
      { href: "/proveedores/consultar", label: "Consultar Proveedores", icon: FileText },
    ],
  },
  {
    title: "Usuarios",
    items: [
      { href: "/usuarios/registrar", label: "Registrar Usuario", icon: UserPlus },
      { href: "/usuarios/consultar", label: "Consultar Usuarios", icon: Users },
    ],
  },
  {
    title: "Estadísticas",
    items: [{ href: "/estadisticas", label: "Ver Estadísticas", icon: BarChart3 }],
  },
]

export function QuickNavLeft() {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [open, setOpen] = React.useState(false)

  const NavContent = () => (
    <nav className="space-y-6">
      {navSections.map((section) => (
        <div key={section.title}>
          <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">{section.title}</h3>
          <ul className="space-y-1">
            {section.items.map((item) => {
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
                      isActive && "bg-[#2B3A8F] text-white hover:bg-[#2B3A8F]/90 dark:bg-[#1e2870]",
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
      ))}
    </nav>
  )

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

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 border-r bg-background p-6 overflow-y-auto">
      <h2 className="mb-6 text-lg font-semibold">Navegación Rápida</h2>
      <NavContent />
    </aside>
  )
}
