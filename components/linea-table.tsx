"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Eye, Pencil, Trash2, Search, Loader2 } from "lucide-react"
import { getLineas, deleteLinea, updateLinea, getLineaById, type Linea, type LineaDetallada } from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"

interface LineaTableProps {
  onEdit?: (linea: Linea) => void
  onView?: (linea: Linea) => void
  refreshTrigger?: number
}

export function LineaTable({ onEdit, onView, refreshTrigger }: LineaTableProps) {
  const { toast } = useToast()
  const [lineas, setLineas] = React.useState<Linea[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [editingLinea, setEditingLinea] = React.useState<Linea | null>(null)
  const [viewingLinea, setViewingLinea] = React.useState<LineaDetallada | null>(null)
  const [editFormData, setEditFormData] = React.useState({ nombre: "" })
  const [submitting, setSubmitting] = React.useState(false)

  React.useEffect(() => {
    loadLineas()
  }, [refreshTrigger])

  const loadLineas = async () => {
    try {
      setLoading(true)
      const data = await getLineas()
      setLineas(data)
    } catch (error) {
      console.error("Error al cargar líneas:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las líneas.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta línea?")) return

    try {
      await deleteLinea(id.toString())
      toast({
        title: "Línea eliminada",
        description: "La línea se ha eliminado correctamente.",
      })
      loadLineas()
    } catch (error) {
      console.error("Error al eliminar línea:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la línea.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (linea: Linea) => {
    setEditingLinea(linea)
    setEditFormData({ nombre: linea.nombre })
  }

  const handleSaveEdit = async () => {
    if (!editingLinea) return

    setSubmitting(true)
    try {
      await updateLinea(editingLinea.id.toString(), editFormData)
      toast({
        title: "Línea actualizada",
        description: "La línea se ha actualizado correctamente.",
      })
      setEditingLinea(null)
      loadLineas()
    } catch (error) {
      console.error("Error al actualizar línea:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar la línea.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleView = async (linea: Linea) => {
    try {
      const detalles = await getLineaById(linea.id.toString())
      if (detalles) {
        setViewingLinea(detalles)
      }
    } catch (error) {
      console.error("Error al cargar detalles de línea:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los detalles de la línea.",
        variant: "destructive",
      })
    }
  }

  const filteredLineas = lineas.filter((linea) => linea.nombre.toLowerCase().includes(searchTerm.toLowerCase()))

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="rounded-lg border bg-card p-12 text-center">
        <p className="text-muted-foreground">Cargando líneas...</p>
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
              placeholder="Buscar línea por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {filteredLineas.length === 0 ? (
          <div className="rounded-lg border bg-card p-12 text-center">
            <p className="text-muted-foreground">
              {searchTerm ? "No se encontraron líneas con ese nombre" : "No hay líneas registradas"}
            </p>
          </div>
        ) : (
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Nombre</TableHead>
                  <TableHead className="text-right font-semibold">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLineas.map((linea) => (
                  <TableRow key={linea.id}>
                    <TableCell className="font-mono text-sm">{linea.id}</TableCell>
                    <TableCell className="font-medium">{linea.nombre}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleView(linea)} title="Ver detalles">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(linea)} title="Editar">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(linea.id)}
                          title="Eliminar"
                          className="text-destructive hover:text-destructive"
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

      <Dialog open={!!editingLinea} onOpenChange={() => setEditingLinea(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Línea</DialogTitle>
            <DialogDescription>Modifica el nombre de la línea</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-nombre">Nombre de la Línea</Label>
              <Input
                id="edit-nombre"
                value={editFormData.nombre}
                onChange={(e) => setEditFormData({ nombre: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingLinea(null)} disabled={submitting}>
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

      <Dialog open={!!viewingLinea} onOpenChange={() => setViewingLinea(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles de la Línea</DialogTitle>
            <DialogDescription>Información completa de la línea</DialogDescription>
          </DialogHeader>
          {viewingLinea && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">ID</Label>
                  <p className="font-mono text-sm">{viewingLinea.id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Nombre</Label>
                  <p className="font-medium">{viewingLinea.nombre}</p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Marcas Asociadas</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {viewingLinea.marcas && viewingLinea.marcas.length > 0 ? (
                    viewingLinea.marcas.map((marca) => (
                      <Badge key={marca.id} variant="secondary">
                        {marca.nombre}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No hay marcas asociadas</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Label className="text-muted-foreground">Fecha de Creación</Label>
                  <p className="text-sm">{formatDate(viewingLinea.createdAt)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Última Modificación</Label>
                  <p className="text-sm">{formatDate(viewingLinea.updatedAt)}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewingLinea(null)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
