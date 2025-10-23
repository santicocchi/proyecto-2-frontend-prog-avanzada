"use client"

import * as React from "react"
import { AppHeader } from "@/components/app-header"
import { QuickNavLeft } from "@/components/quick-nav-left"
import { LineaTable } from "@/components/linea-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { getMarcas, getLineas, deleteLinea } from "@/lib/api-service"
import type { Marca, Linea } from "@/lib/mock-data"
import WithAuth from "@/components/auth/withAuth"
import RoleGuard from "@/components/auth/RoleGuard"

export default function ConsultarLineasPage() {
  const [marcas, setMarcas] = React.useState<Marca[]>([])
  const [lineas, setLineas] = React.useState<Linea[]>([])

  React.useEffect(() => {
    Promise.all([getMarcas(), getLineas()]).then(([marcasData, lineasData]) => {
      setMarcas(marcasData)
      setLineas(lineasData)
    })
  }, [])

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta línea?")) {
      try {
        await deleteLinea(id)
        setLineas(lineas.filter((l) => l.id !== id))
        alert("Línea eliminada exitosamente")
      } catch (error) {
        console.error("Error al eliminar línea:", error)
        alert("Error al eliminar la línea")
      }
    }
  }

  const handleEdit = (linea: Linea) => {
    alert(`Editar línea: ${linea.nombre} (funcionalidad pendiente)`)
  }

  const handleView = (linea: Linea) => {
    const marca = marcas.find((m) => m.id === linea.marcaId)
    alert(`Ver detalles de: ${linea.nombre}\n\nMarca: ${marca?.nombre}\n\nDescripción: ${linea.descripcion}`)
  }

  return (
    <WithAuth>
      <RoleGuard allowedRoles={['dueño','empleado']} >
        <div className="min-h-screen bg-background">
          <AppHeader showBreadcrumbs />
          <div className="flex">
            <QuickNavLeft />
            <main className="flex-1 lg:ml-72 p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Consultar Líneas</h1>
                  <p className="text-muted-foreground">Administra y visualiza todas las líneas/categorías registradas</p>
                </div>
                <Button asChild>
                  <Link href="/lineas/registrar">
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva Línea
                  </Link>
                </Button>
              </div>
              <LineaTable marcas={marcas} lineas={lineas} onEdit={handleEdit} onDelete={handleDelete} onView={handleView} />
            </main>
          </div>
        </div>
      </RoleGuard>
    </WithAuth>
  )
}
