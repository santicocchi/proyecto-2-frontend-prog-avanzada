"use client"

import * as React from "react"
import { AppHeader } from "@/components/app-header"
import { QuickNavLeft } from "@/components/quick-nav-left"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getUsuarioActual, updateUsuarioActual } from "@/lib/api-service"
import { Loader2, Eye, EyeOff, Pencil } from "lucide-react"
import type { Usuario } from "@/lib/mock-data"
import WithAuth from "@/components/auth/withAuth"
import RoleGuard from "@/components/auth/RoleGuard"

export default function PerfilPage() {
  const [usuario, setUsuario] = React.useState<Usuario | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [editing, setEditing] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    rol: "",
  })

  React.useEffect(() => {
    loadUsuario()
  }, [])

  const loadUsuario = async () => {
    try {
      const data = await getUsuarioActual()
      setUsuario(data)
      setFormData({
        email: data.email,
        password: data.password,
        rol: data.rol,
      })
    } catch (error) {
      console.error("Error al cargar usuario:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      await updateUsuarioActual(formData)
      alert("Perfil actualizado exitosamente")
      setEditing(false)
      loadUsuario()
    } catch (error) {
      console.error("Error al actualizar perfil:", error)
      alert("Error al actualizar perfil")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <WithAuth>
        <RoleGuard allowedRoles={['administrador', 'vendedor']} >
          <div className="min-h-screen bg-background">
            <AppHeader showBreadcrumbs />
            <div className="flex">
              <QuickNavLeft />
              <main className="flex-1 lg:ml-72 p-6">
                <div className="flex items-center justify-center h-96">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              </main>
            </div>
          </div>
        </RoleGuard>
      </WithAuth>
    )
  }

  return (
    <WithAuth>
      <RoleGuard allowedRoles={['administrador', 'vendedor']} >
        <div className="min-h-screen bg-background">
          <AppHeader showBreadcrumbs />
          <div className="flex">
            <QuickNavLeft />
            <main className="flex-1 lg:ml-72 p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Mi Perfil</h1>
                <p className="text-muted-foreground">Visualiza y edita tu información personal</p>
              </div>

              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Información Personal</CardTitle>
                      <CardDescription>Datos de tu cuenta en el sistema</CardDescription>
                    </div>
                    {!editing && (
                      <Button variant="outline" onClick={() => setEditing(true)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!editing}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          disabled={!editing}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rol">Rol</Label>
                      <Input id="rol" value={formData.rol} disabled className="bg-muted" />
                      <p className="text-sm text-muted-foreground">El rol no puede ser modificado</p>
                    </div>

                    {editing && (
                      <div className="flex gap-4">
                        <Button type="submit" className="flex-1 bg-[#2B3A8F] hover:bg-[#1e2870]" disabled={saving}>
                          {saving ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Guardando...
                            </>
                          ) : (
                            "Guardar Cambios"
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1 bg-transparent"
                          onClick={() => {
                            setEditing(false)
                            setFormData({
                              email: usuario?.email || "",
                              password: usuario?.password || "",
                              rol: usuario?.rol || "",
                            })
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </main>
          </div>
        </div>
      </RoleGuard>
    </WithAuth>
  )
}
