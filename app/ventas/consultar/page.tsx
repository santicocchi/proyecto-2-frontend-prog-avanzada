import { AppHeader } from "@/components/app-header"
import RoleGuard from "@/components/auth/RoleGuard"
import WithAuth from "@/components/auth/withAuth"
import { QuickNavLeft } from "@/components/quick-nav-left"
import { Button } from "@/components/ui/button"
import { VentaTable } from "@/components/venta-table"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function ConsultarVentasPage() {
  return (
    <WithAuth>
      <RoleGuard allowedRoles={['dueño', 'empleado']} >
        <div className="min-h-screen bg-background">
          <AppHeader showBreadcrumbs />
          <div className="flex">
            <QuickNavLeft />
            <main className="flex-1 lg:ml-72 p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Consultar Ventas</h1>
                  <p className="text-muted-foreground">Administra las ventas registradas en el sistema</p>
                </div>
                <Button asChild className="bg-[#2B3A8F] hover:bg-[#1e2870]">
                  <Link href="/ventas/registrar">
                    <Plus className="mr-2 h-4 w-4" />
                    Registrar Venta
                  </Link>
                </Button>
              </div>
              <VentaTable />
            </main>
          </div>
        </div>
      </RoleGuard>
    </WithAuth>
  )
}
