"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Eye } from "lucide-react"
import type { Proveedor } from "@/lib/mock-data"

interface ProveedorTableProps {
  proveedores: Proveedor[]
  onEdit?: (proveedor: Proveedor) => void
  onDelete?: (id: string) => void
  onView?: (proveedor: Proveedor) => void
}

export function ProveedorTable({ proveedores, onEdit, onDelete, onView }: ProveedorTableProps) {
  if (proveedores.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No hay proveedores registrados</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Nombre</TableHead>
            <TableHead className="font-semibold">Descripción</TableHead>
            <TableHead className="text-right font-semibold">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {proveedores.map((proveedor) => (
            <TableRow key={proveedor.id}>
              <TableCell className="font-medium">{proveedor.nombre}</TableCell>
              <TableCell className="max-w-md truncate">{proveedor.descripcion}</TableCell>
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
                    onClick={() => onDelete?.(proveedor.id)}
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
  )
}
