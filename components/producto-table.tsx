"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Pencil, Trash2, Eye, Filter, Search, Barcode } from "lucide-react"
import { getProductos, type ProductoBackend } from "@/lib/api-service"

export function ProductoTable() {
  const [productos, setProductos] = React.useState<ProductoBackend[]>([])
  const [searchNombre, setSearchNombre] = React.useState("")
  const [searchCodigo, setSearchCodigo] = React.useState("")
  const [showFilterModal, setShowFilterModal] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    loadProductos()
  }, [])

  const loadProductos = async () => {
    try {
      const data = await getProductos()
      setProductos(data)
    } catch (error) {
      console.error("Error al cargar productos:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProductos = productos.filter((producto) => {
    const matchNombre = producto.nombre.toLowerCase().includes(searchNombre.toLowerCase())
    return matchNombre
  })

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
            disabled
          />
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Nombre</TableHead>
              <TableHead className="font-semibold">Marca</TableHead>
              <TableHead className="font-semibold">Líneas</TableHead>
              <TableHead className="font-semibold">Stock</TableHead>
              <TableHead className="font-semibold">Precio</TableHead>
              <TableHead className="text-right font-semibold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Cargando productos...
                </TableCell>
              </TableRow>
            ) : filteredProductos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No se encontraron productos
                </TableCell>
              </TableRow>
            ) : (
              filteredProductos.map((producto) => (
                <TableRow key={producto.id}>
                  <TableCell className="font-mono text-sm">{producto.id}</TableCell>
                  <TableCell className="font-medium">{producto.nombre}</TableCell>
                  <TableCell>{producto.marca.nombre}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {producto.linea.map((l) => (
                        <Badge key={l.id} variant="secondary" className="text-xs">
                          {l.nombre}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>X {producto.stock}</TableCell>
                  <TableCell>${Number.parseFloat(producto.precio_sin_impuesto).toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" title="Ver detalles" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Editar" className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Eliminar"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
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
