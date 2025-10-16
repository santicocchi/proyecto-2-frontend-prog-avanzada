"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Eye, Pencil, Trash2, Search } from "lucide-react"
import { getMarcas, deleteMarca, type Marca } from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"

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
  }, [loadMarcas, refreshTrigger])

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

  const filteredMarcas = marcas.filter((marca) => marca.nombre.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
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
                      <Button variant="ghost" size="icon" onClick={() => onView?.(marca)} title="Ver detalles">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onEdit?.(marca)} title="Editar">
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
  )
}
