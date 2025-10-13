import { AppHeader } from "@/components/app-header"
import { QuickNavLeft } from "@/components/quick-nav-left"
import { ScreenPlaceholder } from "@/components/screen-placeholder"

export default function ConsultarUsuariosPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader showBreadcrumbs />
      <div className="flex">
        <QuickNavLeft />
        <main className="flex-1 lg:ml-72 p-6">
          <ScreenPlaceholder
            title="Consultar Usuarios"
            description="Pantalla vacía. Aquí irá la tabla con filtros para consultar, editar y eliminar usuarios/empleados."
          />
        </main>
      </div>
    </div>
  )
}
