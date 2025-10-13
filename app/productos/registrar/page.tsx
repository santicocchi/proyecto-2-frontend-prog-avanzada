"use client"

import * as React from "react"
import { AppHeader } from "@/components/app-header"
import { QuickNavLeft } from "@/components/quick-nav-left"
import { ProductoForm } from "@/components/producto-form"
import { getMarcas, getProveedores, createProducto } from "@/lib/api-service"
import type { Marca, Proveedor } from "@/lib/mock-data"
import type { ProductoFormData } from "@/components/producto-form"

export default function RegistrarProductoPage() {
  const [marcas, setMarcas] = React.useState<Marca[]>([])
  const [proveedores, setProveedores] = React.useState<Proveedor[]>([])

  React.useEffect(() => {
    getMarcas().then(setMarcas)
    getProveedores().then(setProveedores)
  }, [])

  const handleSubmit = async (data: ProductoFormData) => {
    try {
      await createProducto({
        nombre: data.nombre,
        descripcion: data.descripcion,
        marcaId: data.marcaId,
        lineaId: data.lineaId,
        proveedorId: data.proveedorId,
        precio: data.precio,
        stock: 0,
      })
      alert("Producto registrado exitosamente")
    } catch (error) {
      console.error("Error al registrar producto:", error)
      alert("Error al registrar producto")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader showBreadcrumbs />
      <div className="flex">
        <QuickNavLeft />
        <main className="flex-1 lg:ml-72 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Registrar Producto</h1>
            <p className="text-muted-foreground">Completa el formulario para añadir un nuevo producto al sistema</p>
          </div>
          <ProductoForm marcas={marcas} proveedores={proveedores} onSubmit={handleSubmit} />
        </main>
      </div>
    </div>
  )
}
