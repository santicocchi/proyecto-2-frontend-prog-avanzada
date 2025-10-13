"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Eye, Pencil, Trash2 } from "lucide-react"
import type { Marca, Linea } from "@/lib/mock-data"

interface LineaTableProps {
  marcas: Marca[]
  lineas: Linea[]
  onEdit?: (linea: Linea) => void
  onDelete?: (id: string) => void
  onView?: (linea: Linea) => void
}

export function LineaTable({ marcas, lineas, onEdit, onDelete, onView }: LineaTableProps) {
  const [selectedMarcaId, setSelectedMarcaId] = React.useState<string>("")
  const [selectedLineaId, setSelectedLineaId] = React.useState<string>("")

  const filteredLineas = selectedMarcaId ? lineas.filter((linea) => linea.marcaId === selectedMarcaId) : []

  const displayedLineas = selectedLineaId
    ? filteredLineas.filter((linea) => linea.id === selectedLineaId)
    : filteredLineas

  const getMarcaNombre = (marcaId: string) => {
    return marcas.find((m) => m.id === marcaId)?.nombre || "Desconocida"
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="marca-filter">Seleccionar Marca *</Label>
          <Select value={selectedMarcaId} onValueChange={setSelectedMarcaId}>
            <SelectTrigger id="marca-filter">
              <SelectValue placeholder="Selecciona una marca" />
            </SelectTrigger>
            <SelectContent>
              {marcas.map((marca) => (
                <SelectItem key={marca.id} value={marca.id}>
                  {marca.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedMarcaId && filteredLineas.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="linea-filter">Filtrar por Línea (opcional)</Label>
            <Select value={selectedLineaId} onValueChange={setSelectedLineaId}>
              <SelectTrigger id="linea-filter">
                <SelectValue placeholder="Todas las líneas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las líneas</SelectItem>
                {filteredLineas.map((linea) => (
                  <SelectItem key={linea.id} value={linea.id}>
                    {linea.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {!selectedMarcaId ? (
        <div className="rounded-lg border bg-card p-12 text-center">
          <p className="text-muted-foreground">Selecciona una marca para ver sus líneas</p>
        </div>
      ) : displayedLineas.length === 0 ? (
        <div className="rounded-lg border bg-card p-12 text-center">
          <p className="text-muted-foreground">No hay líneas registradas para esta marca</p>
        </div>
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedLineas.map((linea) => (
                <TableRow key={linea.id}>
                  <TableCell className="font-mono text-sm">{linea.id}</TableCell>
                  <TableCell className="font-medium">{getMarcaNombre(linea.marcaId)}</TableCell>
                  <TableCell className="font-medium">{linea.nombre}</TableCell>
                  <TableCell className="max-w-md truncate">{linea.descripcion}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onView?.(linea)} title="Ver detalles">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onEdit?.(linea)} title="Editar">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete?.(linea.id)} title="Eliminar">
                        <Trash2 className="h-4 w-4 text-destructive" />
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
