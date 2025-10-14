import { AppHeader } from "@/components/app-header"
import RoleGuard from "@/components/auth/RoleGuard"
import WithAuth from "@/components/auth/withAuth"
import { QuickNavLeft } from "@/components/quick-nav-left"
import { ScreenPlaceholder } from "@/components/screen-placeholder"

export default function EstadisticasPage() {
  return (
    <WithAuth>
      <RoleGuard allowedRoles={['administrador', 'vendedor']} >
        <div className="min-h-screen bg-background">
          <AppHeader showBreadcrumbs />
          <div className="flex">
            <QuickNavLeft />
            <main className="flex-1 lg:ml-72 p-6">
              <ScreenPlaceholder
                title="Estadísticas"
                description="Pantalla vacía. Aquí irán los widgets y gráficos con métricas como ventas por mes, top marcas, productos más vendidos, etc."
              />
            </main>
          </div>
        </div>
      </RoleGuard>
    </WithAuth>
  )
}
