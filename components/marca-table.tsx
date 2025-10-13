"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, Pencil, Trash2, Search } from "lucide-react"
import type { Marca } from "@/lib/mock-data"

interface MarcaTableProps {
  marcas: Marca[]
  onEdit?: (marca: Marca) => void
  onDelete?: (id: string) => void
  onView?: (marca: Marca) => void
}

export function MarcaTable({ marcas, onEdit, onDelete, onView }: MarcaTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("")

  const filteredMarcas = marcas.filter(
    (marca) =>
      marca.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      marca.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o email..."
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
              <TableHead>Email</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMarcas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No se encontraron marcas
                </TableCell>
              </TableRow>
            ) : (
              filteredMarcas.map((marca) => (
                <TableRow key={marca.id}>
                  <TableCell className="font-mono text-sm">{marca.id}</TableCell>
                  <TableCell className="font-medium">{marca.nombre}</TableCell>
                  <TableCell>{marca.email}</TableCell>
                  <TableCell className="max-w-md truncate">{marca.descripcion}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onView?.(marca)} title="Ver detalles">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onEdit?.(marca)} title="Editar">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete?.(marca.id)} title="Eliminar">
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
