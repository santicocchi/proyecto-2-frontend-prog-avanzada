"use client"

import * as React from "react"
import { AppHeader } from "@/components/app-header"
import { QuickNavLeft } from "@/components/quick-nav-left"
import { MarcaTable } from "@/components/marca-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { getMarcas, deleteMarca } from "@/lib/api-service"
import type { Marca } from "@/lib/mock-data"
import WithAuth from "@/components/auth/withAuth"
import RoleGuard from "@/components/auth/RoleGuard"

export default function ConsultarMarcasPage() {
  const [marcas, setMarcas] = React.useState<Marca[]>([])

  React.useEffect(() => {
    getMarcas().then(setMarcas)
  }, [])

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta marca?")) {
      try {
        await deleteMarca(id)
        setMarcas(marcas.filter((m) => m.id !== id))
        alert("Marca eliminada exitosamente")
      } catch (error) {
        console.error("Error al eliminar marca:", error)
        alert("Error al eliminar la marca")
      }
    }
  }

  const handleEdit = (marca: Marca) => {
    alert(`Editar marca: ${marca.nombre} (funcionalidad pendiente)`)
  }

  const handleView = (marca: Marca) => {
    alert(`Ver detalles de: ${marca.nombre}\n\nEmail: ${marca.email}\n\nDescripción: ${marca.descripcion}`)
  }

  return (
    <WithAuth>
          <RoleGuard allowedRoles={['administrador', 'vendedor']} >
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
          <MarcaTable marcas={marcas} onEdit={handleEdit} onDelete={handleDelete} onView={handleView} />
        </main>
      </div>
    </div>
    </RoleGuard>
    </WithAuth>
  )
}
