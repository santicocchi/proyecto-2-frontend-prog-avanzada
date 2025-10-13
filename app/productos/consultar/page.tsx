"use client"

import * as React from "react"
import Link from "next/link"
import { AppHeader } from "@/components/app-header"
import { QuickNavLeft } from "@/components/quick-nav-left"
import { ProductoTable } from "@/components/producto-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { getProductos, getMarcas, getLineas, getProveedores } from "@/lib/api-service"
import type { Producto, Marca, Linea, Proveedor } from "@/lib/mock-data"

export default function ConsultarProductosPage() {
  const [productos, setProductos] = React.useState<Producto[]>([])
  const [marcas, setMarcas] = React.useState<Marca[]>([])
  const [lineas, setLineas] = React.useState<Linea[]>([])
  const [proveedores, setProveedores] = React.useState<Proveedor[]>([])

  React.useEffect(() => {
    getProductos().then(setProductos)
    getMarcas().then(setMarcas)
    getLineas().then(setLineas)
    getProveedores().then(setProveedores)
  }, [])

  const handleEdit = (producto: Producto) => {
    console.log("Editar producto:", producto)
    // TODO: Implementar edición
  }

  const handleDelete = (id: string) => {
    console.log("Eliminar producto:", id)
    // TODO: Implementar eliminación
  }

  const handleView = (producto: Producto) => {
    console.log("Ver producto:", producto)
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
              <h1 className="text-3xl font-bold mb-2">Consultar Productos</h1>
              <p className="text-muted-foreground">Administra y visualiza todos los productos del sistema</p>
            </div>
            <Button asChild size="lg">
              <Link href="/productos/registrar">
                <Plus className="mr-2 h-5 w-5" />
                Agregar Producto
              </Link>
            </Button>
          </div>
          <ProductoTable
            productos={productos}
            marcas={marcas}
            lineas={lineas}
            proveedores={proveedores}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        </main>
      </div>
    </div>
  )
}
