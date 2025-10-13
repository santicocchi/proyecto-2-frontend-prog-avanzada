"use client"
import { AppHeader } from "@/components/app-header"
import { QuickNavLeft } from "@/components/quick-nav-left"
import { MarcaForm, type MarcaFormData } from "@/components/marca-form"
import { createMarca } from "@/lib/api-service"
import { useRouter } from "next/navigation"

export default function RegistrarMarcaPage() {
  const router = useRouter()

  const handleSubmit = async (data: MarcaFormData) => {
    try {
      await createMarca(data)
      alert("Marca registrada exitosamente")
      router.push("/marcas/consultar")
    } catch (error) {
      console.error("Error al registrar marca:", error)
      alert("Error al registrar la marca")
    }
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
          <MarcaForm onSubmit={handleSubmit} />
        </main>
      </div>
    </div>
  )
}
