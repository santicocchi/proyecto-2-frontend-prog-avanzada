"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Trash2, Eye, Search } from "lucide-react"
import { getProveedores, deleteProveedor, type ProveedorBackend } from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"

interface ProveedorTableProps {
  onEdit?: (proveedor: ProveedorBackend) => void
  onView?: (proveedor: ProveedorBackend) => void
  refreshTrigger?: number
}

export function ProveedorTable({ onEdit, onView, refreshTrigger }: ProveedorTableProps) {
  const { toast } = useToast()
  const [proveedores, setProveedores] = React.useState<ProveedorBackend[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")

  React.useEffect(() => {
    loadProveedores()
  }, [refreshTrigger])

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

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este proveedor?")) return

    try {
      await deleteProveedor(id.toString())
      toast({
        title: "Proveedor eliminado",
        description: "El proveedor se ha eliminado correctamente.",
      })
      loadProveedores()
    } catch (error) {
      console.error("Error al eliminar proveedor:", error)
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
                        onClick={() => onView?.(proveedor)}
                        title="Ver detalles"
                        className="h-8 w-8"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit?.(proveedor)}
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
  )
}
