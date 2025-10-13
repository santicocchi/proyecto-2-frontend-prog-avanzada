"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Pencil, Trash2, Eye, Filter, Search, Barcode } from "lucide-react"
import type { Producto, Marca, Linea, Proveedor } from "@/lib/mock-data"

interface ProductoTableProps {
  productos: Producto[]
  marcas: Marca[]
  lineas: Linea[]
  proveedores: Proveedor[]
  onEdit?: (producto: Producto) => void
  onDelete?: (id: string) => void
  onView?: (producto: Producto) => void
}

export function ProductoTable({
  productos,
  marcas,
  lineas,
  proveedores,
  onEdit,
  onDelete,
  onView,
}: ProductoTableProps) {
  const [searchNombre, setSearchNombre] = React.useState("")
  const [searchCodigo, setSearchCodigo] = React.useState("")
  const [showFilterModal, setShowFilterModal] = React.useState(false)

  const getMarcaNombre = (marcaId: string) => marcas.find((m) => m.id === marcaId)?.nombre || "-"
  const getLineaNombre = (lineaId: string) => lineas.find((l) => l.id === lineaId)?.nombre || "-"
  const getProveedorNombre = (proveedorId: string) => proveedores.find((p) => p.id === proveedorId)?.nombre || "-"

  const filteredProductos = productos.filter((producto) => {
    const matchNombre = producto.nombre.toLowerCase().includes(searchNombre.toLowerCase())
    const matchCodigo = producto.codigo.includes(searchCodigo)
    return matchNombre && matchCodigo
  })

  if (productos.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No hay productos registrados</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <Dialog open={showFilterModal} onOpenChange={setShowFilterModal}>
          <DialogTrigger asChild>
            <Button variant="outline" className="bg-transparent">
              <Filter className="mr-2 h-4 w-4" />
              Filtrar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filtros Avanzados</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground">Filtros avanzados disponibles próximamente...</p>
            </div>
          </DialogContent>
        </Dialog>

        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar producto por nombre"
            value={searchNombre}
            onChange={(e) => setSearchNombre(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex-1 min-w-[200px] relative">
          <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar producto por código de barra"
            value={searchCodigo}
            onChange={(e) => setSearchCodigo(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Código</TableHead>
              <TableHead className="font-semibold">Nombre</TableHead>
              <TableHead className="font-semibold">Marca</TableHead>
              <TableHead className="font-semibold">Línea</TableHead>
              <TableHead className="font-semibold">Proveedor</TableHead>
              <TableHead className="font-semibold">Stock</TableHead>
              <TableHead className="font-semibold">Precio</TableHead>
              <TableHead className="text-right font-semibold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProductos.map((producto) => (
              <TableRow key={producto.id}>
                <TableCell className="font-mono text-sm">{producto.codigo}</TableCell>
                <TableCell className="font-medium">{producto.nombre}</TableCell>
                <TableCell>{getMarcaNombre(producto.marcaId)}</TableCell>
                <TableCell>{getLineaNombre(producto.lineaId)}</TableCell>
                <TableCell>{getProveedorNombre(producto.proveedorId)}</TableCell>
                <TableCell>X {producto.stock}</TableCell>
                <TableCell>${producto.precio}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView?.(producto)}
                      title="Ver detalles"
                      className="h-8 w-8"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit?.(producto)}
                      title="Editar"
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete?.(producto.id)}
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

      {filteredProductos.length === 0 && productos.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No se encontraron productos con los filtros aplicados</p>
        </div>
      )}
    </div>
  )
}
