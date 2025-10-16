"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, Pencil, Trash2, Search } from "lucide-react"
import { getLineas, deleteLinea, type Linea } from "@/lib/api-service"
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

  const filteredLineas = lineas.filter((linea) => linea.nombre.toLowerCase().includes(searchTerm.toLowerCase()))

  if (loading) {
    return (
      <div className="rounded-lg border bg-card p-12 text-center">
        <p className="text-muted-foreground">Cargando líneas...</p>
      </div>
    )
  }

  return (
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
                      <Button variant="ghost" size="icon" onClick={() => onView?.(linea)} title="Ver detalles">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onEdit?.(linea)} title="Editar">
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
  )
}
