"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Pencil, Trash2, Search, Loader2 } from "lucide-react"
import { getClientes, deleteCliente, updateCliente, type Cliente, type CreateClienteDto } from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"

export function ClienteTable() {
  const { toast } = useToast()
  const [clientes, setClientes] = React.useState<Cliente[]>([])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [loading, setLoading] = React.useState(true)
  const [editingCliente, setEditingCliente] = React.useState<Cliente | null>(null)
  const [editFormData, setEditFormData] = React.useState<CreateClienteDto>({
    nombre: "",
    apellido: "",
    num_documento: "",
    telefono: "",
    tipo_documento: 1,
  })
  const [submitting, setSubmitting] = React.useState(false)

  React.useEffect(() => {
    loadClientes()
  }, [])

  const loadClientes = async () => {
    try {
      const data = await getClientes()
      setClientes(data)
    } catch (error) {
      console.error("Error al cargar clientes:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los clientes.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este cliente?")) return

    try {
      await deleteCliente(id.toString())
      toast({
        title: "Cliente eliminado",
        description: "El cliente se ha eliminado correctamente.",
      })
      loadClientes()
    } catch (error) {
      console.error("Error al eliminar cliente:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el cliente.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente)
    setEditFormData({
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      num_documento: cliente.num_documento,
      telefono: cliente.telefono,
      tipo_documento: cliente.tipo_documento === "DNI" ? 1 : 2,
    })
  }

  const handleSaveEdit = async () => {
    if (!editingCliente) return

    setSubmitting(true)
    try {
      await updateCliente(editingCliente.id.toString(), editFormData)
      toast({
        title: "Cliente actualizado",
        description: "Los datos del cliente se han actualizado correctamente.",
      })
      setEditingCliente(null)
      loadClientes()
    } catch (error) {
      console.error("Error al actualizar cliente:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el cliente.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.num_documento.includes(searchTerm),
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR")
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, apellido o documento..."
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
                <TableHead>Nombre</TableHead>
                <TableHead>Apellido</TableHead>
                <TableHead>Tipo Doc.</TableHead>
                <TableHead>Nº Documento</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Fecha Creación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Cargando clientes...
                  </TableCell>
                </TableRow>
              ) : filteredClientes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No se encontraron clientes
                  </TableCell>
                </TableRow>
              ) : (
                filteredClientes.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell className="font-mono text-sm">{cliente.id}</TableCell>
                    <TableCell>{cliente.nombre}</TableCell>
                    <TableCell>{cliente.apellido}</TableCell>
                    <TableCell>{cliente.tipo_documento}</TableCell>
                    <TableCell className="font-mono">{cliente.num_documento}</TableCell>
                    <TableCell>{cliente.telefono}</TableCell>
                    <TableCell>{formatDate(cliente.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(cliente)} title="Editar">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(cliente.id)} title="Eliminar">
                          <Trash2 className="h-4 w-4 text-destructive" />
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

      <Dialog open={!!editingCliente} onOpenChange={() => setEditingCliente(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>Modifica los datos del cliente</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-nombre">Nombre</Label>
              <Input
                id="edit-nombre"
                value={editFormData.nombre}
                onChange={(e) => setEditFormData({ ...editFormData, nombre: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-apellido">Apellido</Label>
              <Input
                id="edit-apellido"
                value={editFormData.apellido}
                onChange={(e) => setEditFormData({ ...editFormData, apellido: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-tipo-documento">Tipo de Documento</Label>
              <Select
                value={editFormData.tipo_documento.toString()}
                onValueChange={(value) => setEditFormData({ ...editFormData, tipo_documento: Number(value) })}
              >
                <SelectTrigger id="edit-tipo-documento">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">DNI</SelectItem>
                  <SelectItem value="2">Pasaporte</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-num-documento">Número de Documento</Label>
              <Input
                id="edit-num-documento"
                value={editFormData.num_documento}
                onChange={(e) => setEditFormData({ ...editFormData, num_documento: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-telefono">Teléfono</Label>
              <Input
                id="edit-telefono"
                value={editFormData.telefono}
                onChange={(e) => setEditFormData({ ...editFormData, telefono: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCliente(null)} disabled={submitting}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit} disabled={submitting} className="bg-[#2B3A8F] hover:bg-[#1e2870]">
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
