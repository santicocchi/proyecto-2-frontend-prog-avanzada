import { AppHeader } from "@/components/app-header"
import RoleGuard from "@/components/auth/RoleGuard"
import WithAuth from "@/components/auth/withAuth"
import { QuickNavLeft } from "@/components/quick-nav-left"
import { VentaForm } from "@/components/venta-form"

export default function RegistrarVentaPage() {
  return (
    <WithAuth>
      <RoleGuard allowedRoles={['dueño', 'empleado']} >
        <div className="min-h-screen bg-background">
          <AppHeader showBreadcrumbs />
          <div className="flex">
            <QuickNavLeft />
            <main className="flex-1 lg:ml-72 p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Registrar Venta</h1>
                <p className="text-muted-foreground">Complete el formulario para registrar una nueva venta</p>
              </div>
              <VentaForm />
            </main>
          </div>
        </div>
      </RoleGuard>
    </WithAuth>
  )
}
