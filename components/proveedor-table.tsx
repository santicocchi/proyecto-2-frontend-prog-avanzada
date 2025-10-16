"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Pencil, Trash2, Eye, Search } from "lucide-react"
import {
  getProveedores,
  getProveedorById,
  deleteProveedor,
  updateProveedor,
  type ProveedorBackend,
  type CreateProveedorDto,
} from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"

export function ProveedorTable() {
  const { toast } = useToast()
  const [proveedores, setProveedores] = React.useState<ProveedorBackend[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")

  const [editModalOpen, setEditModalOpen] = React.useState(false)
  const [viewModalOpen, setViewModalOpen] = React.useState(false)
  const [selectedProveedor, setSelectedProveedor] = React.useState<ProveedorBackend | null>(null)
  const [editForm, setEditForm] = React.useState<CreateProveedorDto>({
    nombre: "",
    direccion: "",
    cuit: "",
  })

  React.useEffect(() => {
    loadProveedores()
  }, [])

  const loadProveedores = async () => {
    try {
      setLoading(true)
      const data = await getProveedores()
      setProveedores(data)
    } catch (error) {
      console.error("Error al cargar proveedores:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los proveedores.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleView = async (proveedor: ProveedorBackend) => {
    try {
      const detalles = await getProveedorById(proveedor.id.toString())
      if (detalles) {
        setSelectedProveedor(detalles)
        setViewModalOpen(true)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los detalles del proveedor.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = async (proveedor: ProveedorBackend) => {
    try {
      const detalles = await getProveedorById(proveedor.id.toString())
      if (detalles) {
        setSelectedProveedor(detalles)
        setEditForm({
          nombre: detalles.nombre,
          direccion: detalles.direccion || "",
          cuit: detalles.cuit,
        })
        setEditModalOpen(true)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos del proveedor.",
        variant: "destructive",
      })
    }
  }

  const handleSaveEdit = async () => {
    if (!selectedProveedor) return

    try {
      await updateProveedor(selectedProveedor.id.toString(), editForm)
      toast({
        title: "Éxito",
        description: "Proveedor actualizado correctamente.",
      })
      setEditModalOpen(false)
      loadProveedores()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el proveedor.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este proveedor?")) return

    try {
      await deleteProveedor(id.toString())
      toast({
        title: "Éxito",
        description: "Proveedor eliminado correctamente.",
      })
      loadProveedores()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el proveedor.",
        variant: "destructive",
      })
    }
  }

  const filteredProveedores = proveedores.filter(
    (proveedor) =>
      proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || proveedor.cuit.includes(searchTerm),
  )

  if (loading) {
    return (
      <div className="rounded-lg border bg-card p-12 text-center">
        <p className="text-muted-foreground">Cargando proveedores...</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar proveedor por nombre o CUIT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {filteredProveedores.length === 0 ? (
          <div className="rounded-lg border bg-card p-12 text-center">
            <p className="text-muted-foreground">
              {searchTerm ? "No se encontraron proveedores" : "No hay proveedores registrados"}
            </p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Nombre</TableHead>
                  <TableHead className="font-semibold">CUIT</TableHead>
                  <TableHead className="text-right font-semibold">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProveedores.map((proveedor) => (
                  <TableRow key={proveedor.id}>
                    <TableCell className="font-mono text-sm">{proveedor.id}</TableCell>
                    <TableCell className="font-medium">{proveedor.nombre}</TableCell>
                    <TableCell className="font-mono text-sm">{proveedor.cuit}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleView(proveedor)}
                          title="Ver detalles"
                          className="h-8 w-8"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(proveedor)}
                          title="Editar"
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(proveedor.id)}
                          title="Eliminar"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles del Proveedor</DialogTitle>
          </DialogHeader>
          {selectedProveedor && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground">ID</Label>
                  <p className="text-base">{selectedProveedor.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground">Nombre</Label>
                  <p className="text-base">{selectedProveedor.nombre}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground">CUIT</Label>
                  <p className="text-base font-mono">{selectedProveedor.cuit}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground">Dirección</Label>
                  <p className="text-base">{selectedProveedor.direccion || "No especificada"}</p>
                </div>
                {selectedProveedor.createdAt && (
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">Fecha de Creación</Label>
                    <p className="text-base">{new Date(selectedProveedor.createdAt).toLocaleString()}</p>
                  </div>
                )}
                {selectedProveedor.updatedAt && (
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">Última Modificación</Label>
                    <p className="text-base">{new Date(selectedProveedor.updatedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Proveedor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-nombre">Nombre</Label>
              <Input
                id="edit-nombre"
                value={editForm.nombre}
                onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-direccion">Dirección</Label>
              <Input
                id="edit-direccion"
                value={editForm.direccion}
                onChange={(e) => setEditForm({ ...editForm, direccion: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-cuit">CUIT</Label>
              <Input
                id="edit-cuit"
                value={editForm.cuit}
                onChange={(e) => setEditForm({ ...editForm, cuit: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
