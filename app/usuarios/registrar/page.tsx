import { AppHeader } from "@/components/app-header"
import { QuickNavLeft } from "@/components/quick-nav-left"
import { ScreenPlaceholder } from "@/components/screen-placeholder"

export default function RegistrarUsuarioPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader showBreadcrumbs />
      <div className="flex">
        <QuickNavLeft />
        <main className="flex-1 lg:ml-72 p-6">
          <ScreenPlaceholder
            title="Registrar Usuario"
            description="Pantalla vacía. Aquí irá el formulario para dar de alta empleados/usuarios del sistema."
          />
        </main>
      </div>
    </div>
  )
}
