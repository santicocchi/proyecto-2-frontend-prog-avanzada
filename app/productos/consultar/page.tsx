"use client"

import * as React from "react"
import Link from "next/link"
import { AppHeader } from "@/components/app-header"
import { QuickNavLeft } from "@/components/quick-nav-left"
import { ProductoTable } from "@/components/producto-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import WithAuth from "@/components/auth/withAuth"
import RoleGuard from "@/components/auth/RoleGuard"

export default function ConsultarProductosPage() {
  return (
    <WithAuth>
      <RoleGuard allowedRoles={['dueño', 'vendedor']} >
        <div className="min-h-screen bg-background">
          <AppHeader showBreadcrumbs />
          <div className="flex">
            <QuickNavLeft />
            <main className="flex-1 lg:ml-72 p-6">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Consultar Productos</h1>
                  <p className="text-muted-foreground">Administra y visualiza todos los productos del sistema</p>
                </div>
                <Button asChild size="lg">
                  <Link href="/productos/registrar">
                    <Plus className="mr-2 h-5 w-5" />
                    Agregar Producto
                  </Link>
                </Button>
              </div>
              <ProductoTable />
            </main>
          </div>
        </div>
      </RoleGuard>
    </WithAuth>
  )
}
