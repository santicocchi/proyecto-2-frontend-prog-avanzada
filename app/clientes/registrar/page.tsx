"use client"
import { AppHeader } from "@/components/app-header"
import RoleGuard from "@/components/auth/RoleGuard"
import WithAuth from "@/components/auth/withAuth"
import { ClienteForm } from "@/components/cliente-form"
import { QuickNavLeft } from "@/components/quick-nav-left"

export default function RegistrarClientePage() {
  return (
    <WithAuth>
      <RoleGuard allowedRoles={["administrador", "vendedor"]} >
        <div className="min-h-screen bg-background">
          <AppHeader showBreadcrumbs />
          <div className="flex">
            <QuickNavLeft />
            <main className="flex-1 lg:ml-72 p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Registrar Cliente</h1>
                <p className="text-muted-foreground">Complete el formulario para registrar un nuevo cliente</p>
              </div>
              <ClienteForm />
            </main>
          </div>
        </div>
      </RoleGuard>
    </WithAuth >
  )
}
