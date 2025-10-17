"use client"

import * as React from "react"
import { AppHeader } from "@/components/app-header"
import { QuickNavLeft } from "@/components/quick-nav-left"
import { MarcaTable } from "@/components/marca-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import type { Marca } from "@/lib/api-service"
import WithAuth from "@/components/auth/withAuth"
import RoleGuard from "@/components/auth/RoleGuard"

export default function ConsultarMarcasPage() {
  const [refreshTrigger, setRefreshTrigger] = React.useState(0)

  const handleEdit = (marca: Marca) => {
    alert(`Editar marca: ${marca.nombre} (funcionalidad pendiente)`)
  }

  const handleView = (marca: Marca) => {
    const lineasText = marca.lineas?.map((l) => l.nombre).join(", ") || "Sin líneas"
    alert(`Ver detalles de: ${marca.nombre}\n\nID: ${marca.id}\n\nLíneas: ${lineasText}`)
  }

  return (
    <WithAuth>
      <RoleGuard allowedRoles={['dueño', 'vendedor']} >
        <div className="min-h-screen bg-background">
          <AppHeader showBreadcrumbs />
          <div className="flex">
            <QuickNavLeft />
            <main className="flex-1 lg:ml-72 p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Consultar Marcas</h1>
                  <p className="text-muted-foreground">Administra y visualiza todas las marcas registradas</p>
                </div>
                <Button asChild>
                  <Link href="/marcas/registrar">
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva Marca
                  </Link>
                </Button>
              </div>
              <MarcaTable onEdit={handleEdit} onView={handleView} refreshTrigger={refreshTrigger} />
            </main>
          </div>
        </div>
      </RoleGuard>
    </WithAuth>
  )
}
