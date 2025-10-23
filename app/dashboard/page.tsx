"use client"

import Link from "next/link"
import { AppHeader } from "@/components/app-header"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, FileText, Tag, Package, BarChart3, Users, Layers, Truck, UserCircle } from "lucide-react"
import WithAuth from "@/components/auth/withAuth"
import { useAuth } from "@/components/auth/context/UserContext"

export default function DashboardPage() {
  const { hasRole, user } = useAuth()

  // 🔧 Si el contexto todavía está cargando, podemos mostrar un loader
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando datos del usuario...</p>
      </div>
    )
  }

  const dashboardCards = [
    {
      title: "Registrar Venta",
      description: "Carga una nueva venta al sistema",
      icon: ShoppingCart,
      href: "/ventas/registrar",
      color: "text-purple-600 dark:text-purple-400",
      roles: ["dueño", "empleado"],
    },
    {
      title: "Consultar Ventas",
      description: "Visualiza y gestiona las ventas",
      icon: FileText,
      href: "/ventas/consultar",
      color: "text-indigo-600 dark:text-indigo-400",
      roles: ["dueño", "empleado"],
    },
    {
      title: "Registrar Cliente",
      description: "Añade un nuevo cliente",
      icon: UserCircle,
      href: "/clientes/registrar",
      color: "text-rose-600 dark:text-rose-400",
      roles: ["dueño", "empleado"],
    },
    {
      title: "Consultar Clientes",
      description: "Administra los clientes registrados",
      icon: Users,
      href: "/clientes/consultar",
      color: "text-fuchsia-600 dark:text-fuchsia-400",
      roles: ["dueño", "empleado"],
    },
    {
      title: "Registrar Marca",
      description: "Añade una nueva marca",
      icon: Tag,
      href: "/marcas/registrar",
      color: "text-pink-600 dark:text-pink-400",
      roles: ["dueño"],
    },
    {
      title: "Consultar Marcas",
      description: "Administra las marcas registradas",
      icon: FileText,
      href: "/marcas/consultar",
      color: "text-orange-600 dark:text-orange-400",
      roles: ["dueño", "empleado"],
    },
    {
      title: "Registrar Línea",
      description: "Añade una nueva línea/categoría",
      icon: Layers,
      href: "/lineas/registrar",
      color: "text-amber-600 dark:text-amber-400",
      roles: ["dueño"],
    },
    {
      title: "Consultar Líneas",
      description: "Administra las líneas registradas",
      icon: Layers,
      href: "/lineas/consultar",
      color: "text-yellow-600 dark:text-yellow-400",
      roles: ["dueño", "empleado"],
    },
    {
      title: "Registrar Producto",
      description: "Añade un nuevo producto",
      icon: Package,
      href: "/productos/registrar",
      color: "text-teal-600 dark:text-teal-400",
      roles: ["dueño"],
    },
    {
      title: "Consultar Productos",
      description: "Administra los productos registrados",
      icon: Package,
      href: "/productos/consultar",
      color: "text-cyan-600 dark:text-cyan-400",
      roles: ["dueño", "empleado"],
    },
    {
      title: "Registrar Proveedor",
      description: "Añade un nuevo proveedor",
      icon: Truck,
      href: "/proveedores/registrar",
      color: "text-sky-600 dark:text-sky-400",
      roles: ["dueño"],
    },
    {
      title: "Consultar Proveedores",
      description: "Administra los proveedores registrados",
      icon: Truck,
      href: "/proveedores/consultar",
      color: "text-blue-600 dark:text-blue-400",
      roles: ["dueño", "empleado"],
    },
    {
      title: "Consultar Usuarios",
      description: "Administra los usuarios del sistema",
      icon: Users,
      href: "/usuarios/consultar",
      color: "text-lime-600 dark:text-lime-400",
      roles: ["dueño"],
    },
    {
      title: "Estadísticas",
      description: "Visualiza reportes y métricas",
      icon: BarChart3,
      href: "/estadisticas",
      color: "text-red-600 dark:text-red-400",
      roles: ["dueño", "empleado"],
    },
  ]

  // 🧠 Filtrar las tarjetas según los roles del usuario
  const visibleCards = dashboardCards.filter((card) =>
    card.roles?.some((role) => hasRole(role))
  )

  return (
    <WithAuth>
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="container mx-auto px-6 py-12">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4 text-balance">Bienvenido al Sistema de Gestión</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Selecciona una opción para comenzar
            </p>
          </div>

          {visibleCards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {visibleCards.map((card) => {
                const Icon = card.icon
                return (
                  <Link key={card.href} href={card.href} className="group block">
                    <Card className="hover:shadow-lg hover:-translate-y-1 hover:bg-blue-100 transition-all duration-200 cursor-pointer">
                      <CardHeader>
                        <div className={`mb-4 ${card.color}`}>
                          <Icon className="h-12 w-12" />
                        </div>
                        <CardTitle className="text-xl">{card.title}</CardTitle>
                        <CardDescription>{card.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center mt-16">
              <p className="text-lg text-muted-foreground">
                No tenés permisos para acceder a ninguna sección del sistema.
              </p>
            </div>
          )}
        </main>
      </div>
    </WithAuth>
  )
}
