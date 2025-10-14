"use client"
import { AppHeader } from "@/components/app-header"
import { QuickNavLeft } from "@/components/quick-nav-left"
import { ProveedorForm } from "@/components/proveedor-form"
import { createProveedor } from "@/lib/api-service"
import type { ProveedorFormData } from "@/components/proveedor-form"
import WithAuth from "@/components/auth/withAuth"
import RoleGuard from "@/components/auth/RoleGuard"

export default function RegistrarProveedorPage() {
  const handleSubmit = async (data: ProveedorFormData) => {
    try {
      await createProveedor(data)
      alert("Proveedor registrado exitosamente")
    } catch (error) {
      console.error("Error al registrar proveedor:", error)
      alert("Error al registrar proveedor")
    }
  }

  return (
    <WithAuth>
          <RoleGuard allowedRoles={['administrador', 'vendedor']} >
    <div className="min-h-screen bg-background">
      <AppHeader showBreadcrumbs />
      <div className="flex">
        <QuickNavLeft />
        <main className="flex-1 lg:ml-72 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Registrar Proveedor</h1>
            <p className="text-muted-foreground">Completa el formulario para añadir un nuevo proveedor al sistema</p>
          </div>
          <ProveedorForm onSubmit={handleSubmit} />
        </main>
      </div>
    </div>
    </RoleGuard>
    </WithAuth>
  )
}
