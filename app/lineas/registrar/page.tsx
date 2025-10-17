"use client"

import * as React from "react"
import { AppHeader } from "@/components/app-header"
import { QuickNavLeft } from "@/components/quick-nav-left"
import { LineaForm, type LineaFormData } from "@/components/linea-form"
import { createLinea, getMarcas } from "@/lib/api-service"
import type { Marca } from "@/lib/mock-data"
import { useRouter } from "next/navigation"
import WithAuth from "@/components/auth/withAuth"
import RoleGuard from "@/components/auth/RoleGuard"

export default function RegistrarLineaPage() {
  const router = useRouter()
  const [marcas, setMarcas] = React.useState<Marca[]>([])

  React.useEffect(() => {
    getMarcas().then(setMarcas)
  }, [])

  const handleSubmit = async (data: LineaFormData) => {
    try {
      await createLinea(data)
      alert("Línea registrada exitosamente")
      router.push("/lineas/consultar")
    } catch (error) {
      console.error("Error al registrar línea:", error)
      alert("Error al registrar la línea")
    }
  }

  return (
    <WithAuth>
      <RoleGuard allowedRoles={['dueño', 'vendedor']} >
        <div className="min-h-screen bg-background">
          <AppHeader showBreadcrumbs />
          <div className="flex">
            <QuickNavLeft />
            <main className="flex-1 lg:ml-72 p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Registrar Línea</h1>
                <p className="text-muted-foreground">Completa el formulario para añadir una nueva línea/categoría</p>
              </div>
              <LineaForm marcas={marcas} onSubmit={handleSubmit} />
            </main>
          </div>
        </div>
      </RoleGuard>
    </WithAuth>
  )
}
