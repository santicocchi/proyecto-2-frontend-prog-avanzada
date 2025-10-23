"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Search, Plus } from "lucide-react"
import {
  getMarcas,
  deleteMarca,
  updateMarca,
  getLineas,
  asignarLineaMarca,
  type Marca,
  type Linea,
} from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MarcaTableProps {
  onEdit?: (marca: Marca) => void
  onView?: (marca: Marca) => void
  refreshTrigger?: number
}

export function MarcaTable({ onEdit, onView, refreshTrigger }: MarcaTableProps) {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [marcas, setMarcas] = React.useState<Marca[]>([])
  const [loading, setLoading] = React.useState(true)
  const [editingMarca, setEditingMarca] = React.useState<Marca | null>(null)
  const [editFormData, setEditFormData] = React.useState({ nombre: "", lineas: [] as number[] })
  const [availableLineas, setAvailableLineas] = React.useState<Linea[]>([])
  const [submitting, setSubmitting] = React.useState(false)
  const [assigningMarca, setAssigningMarca] = React.useState<Marca | null>(null)
  const [selectedLineaId, setSelectedLineaId] = React.useState<string>("")

  const loadMarcas = React.useCallback(async () => {
    setLoading(true)
    try {
      const data = await getMarcas()
      setMarcas(data)
    } catch (error) {
      console.error("Error al cargar marcas:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las marcas.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  React.useEffect(() => {
    loadMarcas()
    loadLineas()
  }, [loadMarcas, refreshTrigger])

  const loadLineas = async () => {
    try {
      const data = await getLineas()
      setAvailableLineas(data)
    } catch (error) {
      console.error("Error al cargar líneas:", error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta marca?")) return

    try {
      await deleteMarca(id.toString())
      toast({
        title: "Marca eliminada",
        description: "La marca se ha eliminado correctamente.",
      })
      loadMarcas()
    } catch (error) {
      console.error("Error al eliminar marca:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la marca.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (marca: Marca) => {
    setEditingMarca(marca)
    setEditFormData({
      nombre: marca.nombre,
      lineas: marca.lineas?.map((l) => l.id) || [],
    })
  }

  const handleSaveEdit = async () => {
    if (!editingMarca) return

    setSubmitting(true)
    try {
      await updateMarca(editingMarca.id.toString(), editFormData)
      toast({
        title: "Marca actualizada",
        description: "La marca se ha actualizado correctamente.",
      })
      setEditingMarca(null)
      loadMarcas()
    } catch (error) {
      console.error("Error al actualizar marca:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar la marca.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleOpenAssignLinea = (marca: Marca) => {
    setAssigningMarca(marca)
    setSelectedLineaId("")
  }

  const handleAssignLinea = async () => {
    if (!assigningMarca || !selectedLineaId) return

    setSubmitting(true)
    try {
      const response = await asignarLineaMarca(assigningMarca.id.toString(), Number.parseInt(selectedLineaId))
      toast({
        title: "Éxito",
        description: response.message,
      })
      setAssigningMarca(null)
      setSelectedLineaId("")
      loadMarcas()
    } catch (error: any) {
      console.error("Error al asignar línea:", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "No se pudo asignar la línea a la marca.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const toggleLinea = (lineaId: number) => {
    setEditFormData((prev) => ({
      ...prev,
      lineas: prev.lineas.includes(lineaId) ? prev.lineas.filter((id) => id !== lineaId) : [...prev.lineas, lineaId],
    }))
  }

  const filteredMarcas = marcas.filter((marca) => marca.nombre.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre..."
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
                <TableHead>Líneas</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Cargando marcas...
                  </TableCell>
                </TableRow>
              ) : filteredMarcas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No se encontraron marcas
                  </TableCell>
                </TableRow>
              ) : (
                filteredMarcas.map((marca) => (
                  <TableRow key={marca.id}>
                    <TableCell className="font-mono text-sm">{marca.id}</TableCell>
                    <TableCell className="font-medium">{marca.nombre}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {marca.lineas && marca.lineas.length > 0 ? (
                          marca.lineas.map((linea) => (
                            <Badge key={linea.id} variant="secondary">
                              {linea.nombre}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">Sin líneas</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenAssignLinea(marca)}
                          title="Asignar Línea"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(marca)} title="Editar">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(marca.id)} title="Eliminar">
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

      <Dialog open={!!editingMarca} onOpenChange={() => setEditingMarca(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Marca</DialogTitle>
            <DialogDescription>Modifica los datos de la marca</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-nombre">Nombre de la Marca</Label>
              <Input
                id="edit-nombre"
                value={editFormData.nombre}
                onChange={(e) => setEditFormData({ ...editFormData, nombre: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Líneas Asociadas</Label>
              <div className="border rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto">
                {availableLineas.map((linea) => (
                  <div key={linea.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`linea-${linea.id}`}
                      checked={editFormData.lineas.includes(linea.id)}
                      onCheckedChange={() => toggleLinea(linea.id)}
                    />
                    <label htmlFor={`linea-${linea.id}`} className="text-sm cursor-pointer">
                      {linea.nombre}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingMarca(null)} disabled={submitting}>
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

      <Dialog open={!!assigningMarca} onOpenChange={() => setAssigningMarca(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Asignar Línea a Marca</DialogTitle>
            <DialogDescription>
              Selecciona una línea para asignar a la marca <strong>{assigningMarca?.nombre}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="select-linea">Línea</Label>
              <Select value={selectedLineaId} onValueChange={setSelectedLineaId}>
                <SelectTrigger id="select-linea">
                  <SelectValue placeholder="Selecciona una línea" />
                </SelectTrigger>
                <SelectContent>
                  {availableLineas.map((linea) => (
                    <SelectItem key={linea.id} value={linea.id.toString()}>
                      {linea.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssigningMarca(null)} disabled={submitting}>
              Cancelar
            </Button>
            <Button
              onClick={handleAssignLinea}
              disabled={submitting || !selectedLineaId}
              className="bg-[#2B3A8F] hover:bg-[#1e2870]"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Asignando...
                </>
              ) : (
                "Asignar Línea"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
