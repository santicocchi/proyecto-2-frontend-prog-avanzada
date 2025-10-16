"use client"

import * as React from "react"
import Link from "next/link"
import { AppHeader } from "@/components/app-header"
import { QuickNavLeft } from "@/components/quick-nav-left"
import { ProveedorTable } from "@/components/proveedor-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { getProveedores } from "@/lib/api-service"
import type { Proveedor } from "@/lib/mock-data"

export default function ConsultarProveedoresPage() {
  const [proveedores, setProveedores] = React.useState<Proveedor[]>([])

  React.useEffect(() => {
    getProveedores().then(setProveedores)
  }, [])

  const handleEdit = (proveedor: Proveedor) => {
    console.log("Editar proveedor:", proveedor)
    // TODO: Implementar edición
  }

  const handleDelete = (id: string) => {
    console.log("Eliminar proveedor:", id)
    // TODO: Implementar eliminación
  }

  const handleView = (proveedor: Proveedor) => {
    console.log("Ver proveedor:", proveedor)
    // TODO: Implementar vista detallada
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader showBreadcrumbs />
      <div className="flex">
        <QuickNavLeft />
        <main className="flex-1 lg:ml-72 p-6">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Consultar Proveedores</h1>
              <p className="text-muted-foreground">Administra y visualiza todos los proveedores del sistema</p>
            </div>
            <Button asChild size="lg">
              <Link href="/proveedores/registrar">
                <Plus className="mr-2 h-5 w-5" />
                Agregar Proveedor
              </Link>
            </Button>
          </div>
          <ProveedorTable proveedores={proveedores} onEdit={handleEdit} onDelete={handleDelete} onView={handleView} />
        </main>
      </div>
    </div>
  )
}
