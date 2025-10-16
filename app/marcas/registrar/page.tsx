"use client"
import { AppHeader } from "@/components/app-header"
import { QuickNavLeft } from "@/components/quick-nav-left"
import { MarcaForm } from "@/components/marca-form"
import { useRouter } from "next/navigation"

export default function RegistrarMarcaPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push("/marcas/consultar")
  }

  const handleCancel = () => {
    router.push("/marcas/consultar")
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader showBreadcrumbs />
      <div className="flex">
        <QuickNavLeft />
        <main className="flex-1 lg:ml-72 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Registrar Marca</h1>
            <p className="text-muted-foreground">Completa el formulario para añadir una nueva marca al sistema</p>
          </div>
          <MarcaForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </main>
      </div>
    </div>
  )
}
