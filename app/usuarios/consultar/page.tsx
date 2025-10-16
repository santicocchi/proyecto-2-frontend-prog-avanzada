"use client"

import * as React from "react"
import { AppHeader } from "@/components/app-header"
import { QuickNavLeft } from "@/components/quick-nav-left"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Eye, Search } from "lucide-react"
import { getUsuarios, type Usuario } from "@/lib/api-service"

export default function ConsultarUsuariosPage() {
  const [usuarios, setUsuarios] = React.useState<Usuario[]>([])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    loadUsuarios()
  }, [])

  const loadUsuarios = async () => {
    try {
      const data = await getUsuarios()
      setUsuarios(data)
    } catch (error) {
      console.error("Error al cargar usuarios:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsuarios = usuarios.filter((usuario) => usuario.email.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="min-h-screen bg-background">
      <AppHeader showBreadcrumbs />
      <div className="flex">
        <QuickNavLeft />
        <main className="flex-1 lg:ml-72 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Consultar Usuarios</h1>
              <p className="text-muted-foreground mt-2">Gestiona los usuarios del sistema</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="rounded-lg border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Roles</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          Cargando usuarios...
                        </TableCell>
                      </TableRow>
                    ) : filteredUsuarios.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No se encontraron usuarios
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsuarios.map((usuario) => (
                        <TableRow key={usuario.id}>
                          <TableCell className="font-mono text-sm">{usuario.id}</TableCell>
                          <TableCell>{usuario.email}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {usuario.role.map((rol) => (
                                <Badge key={rol.id} variant="secondary">
                                  {rol.name}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon" title="Ver detalles">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" title="Editar">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" title="Eliminar">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
