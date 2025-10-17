"use client"
import { AppHeader } from "@/components/app-header"
import { QuickNavLeft } from "@/components/quick-nav-left"
import { ProductoForm } from "@/components/producto-form"
import WithAuth from "@/components/auth/withAuth"
import RoleGuard from "@/components/auth/RoleGuard"

export default function RegistrarProductoPage() {
  return (
    <WithAuth>
      <RoleGuard allowedRoles={['dueño']} >
        <div className="min-h-screen bg-background">
          <AppHeader showBreadcrumbs />
          <div className="flex">
            <QuickNavLeft />
            <main className="flex-1 lg:ml-72 p-6">
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Registrar Producto</h1>
                <p className="text-muted-foreground">Completa el formulario para añadir un nuevo producto al sistema</p>
              </div>
              <ProductoForm />
            </main>
          </div>
        </div>
      </RoleGuard>
    </WithAuth>
  )
}
