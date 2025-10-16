"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Trash2, Eye, Filter, Search, Barcode, LinkIcon } from "lucide-react"
import {
  getProductos,
  getProductoById,
  deleteProducto,
  updateProducto,
  getProveedores,
  asociarProveedorProducto,
  getMarcas,
  getLineas,
  type ProductoBackend,
  type CreateProductoDto,
  type ProveedorBackend,
  type Marca,
  type Linea,
} from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"

export function ProductoTable() {
  const { toast } = useToast()
  const [productos, setProductos] = React.useState<ProductoBackend[]>([])
  const [searchNombre, setSearchNombre] = React.useState("")
  const [searchCodigo, setSearchCodigo] = React.useState("")
  const [showFilterModal, setShowFilterModal] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  const [viewModalOpen, setViewModalOpen] = React.useState(false)
  const [editModalOpen, setEditModalOpen] = React.useState(false)
  const [asociarModalOpen, setAsociarModalOpen] = React.useState(false)
  const [selectedProducto, setSelectedProducto] = React.useState<any>(null)

  const [editForm, setEditForm] = React.useState<CreateProductoDto>({
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    marcaId: 0,
    lineaId: 0,
  })

  const [proveedores, setProveedores] = React.useState<ProveedorBackend[]>([])
  const [asociarForm, setAsociarForm] = React.useState({
    proveedorId: 0,
    productoId: 0,
    precio_proveedor: 0,
    codigo_proveedor: "",
  })

  const [marcas, setMarcas] = React.useState<Marca[]>([])
  const [lineas, setLineas] = React.useState<Linea[]>([])

  React.useEffect(() => {
    loadProductos()
    loadProveedores()
    loadMarcas()
    loadLineas()
  }, [])

  const loadProductos = async () => {
    try {
      const data = await getProductos()
      setProductos(data)
    } catch (error) {
      console.error("Error al cargar productos:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadProveedores = async () => {
    try {
      const data = await getProveedores()
      setProveedores(data)
    } catch (error) {
      console.error("Error al cargar proveedores:", error)
    }
  }

  const loadMarcas = async () => {
    try {
      const data = await getMarcas()
      setMarcas(data)
    } catch (error) {
      console.error("Error al cargar marcas:", error)
    }
  }

  const loadLineas = async () => {
    try {
      const data = await getLineas()
      setLineas(data)
    } catch (error) {
      console.error("Error al cargar líneas:", error)
    }
  }

  const handleView = async (producto: ProductoBackend) => {
    try {
      const detalles = await getProductoById(producto.id.toString())
      if (detalles) {
        setSelectedProducto(detalles)
        setViewModalOpen(true)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los detalles del producto.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = async (producto: ProductoBackend) => {
    try {
      const detalles = await getProductoById(producto.id.toString())
      if (detalles) {
        setSelectedProducto(detalles)
        setEditForm({
          nombre: detalles.nombre,
          descripcion: detalles.descripcion,
          precio: Number.parseFloat(detalles.precio_sin_impuesto),
          stock: detalles.stock,
          marcaId: typeof detalles.marca === "object" ? detalles.marca.id : 0,
          lineaId: Array.isArray(detalles.linea) && detalles.linea.length > 0 ? detalles.linea[0].id : 0,
        })
        setEditModalOpen(true)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos del producto.",
        variant: "destructive",
      })
    }
  }

  const handleSaveEdit = async () => {
    if (!selectedProducto) return

    try {
      await updateProducto(selectedProducto.id.toString(), editForm)
      toast({
        title: "Éxito",
        description: "Producto actualizado correctamente.",
      })
      setEditModalOpen(false)
      loadProductos()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el producto.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) return

    try {
      await deleteProducto(id.toString())
      toast({
        title: "Éxito",
        description: "Producto eliminado correctamente.",
      })
      loadProductos()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto.",
        variant: "destructive",
      })
    }
  }

  const handleAsociarProveedor = (producto: ProductoBackend) => {
    setAsociarForm({
      proveedorId: 0,
      productoId: producto.id,
      precio_proveedor: 0,
      codigo_proveedor: "",
    })
    setAsociarModalOpen(true)
  }

  const handleSaveAsociacion = async () => {
    if (asociarForm.proveedorId === 0) {
      toast({
        title: "Error",
        description: "Debes seleccionar un proveedor.",
        variant: "destructive",
      })
      return
    }

    try {
      await asociarProveedorProducto(asociarForm)
      toast({
        title: "Éxito",
        description: "Proveedor asociado correctamente al producto.",
      })
      setAsociarModalOpen(false)
      loadProductos()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo asociar el proveedor al producto.",
        variant: "destructive",
      })
    }
  }

  const filteredProductos = productos.filter((producto) => {
    const matchNombre = producto.nombre.toLowerCase().includes(searchNombre.toLowerCase())
    return matchNombre
  })

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
          <Dialog open={showFilterModal} onOpenChange={setShowFilterModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filtros Avanzados</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <p className="text-sm text-muted-foreground">Filtros avanzados disponibles próximamente...</p>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={() => setShowFilterModal(true)} className="bg-transparent">
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
          </Button>

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
                <TableHead className="font-semibold">Línea</TableHead>
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
                    <TableCell>{typeof producto.marca === "object" ? producto.marca.nombre : producto.marca}</TableCell>
                    <TableCell>
                      {Array.isArray(producto.linea) ? (
                        <div className="flex flex-wrap gap-1">
                          {producto.linea.map((l) => (
                            <Badge key={l.id} variant="secondary" className="text-xs">
                              {l.nombre}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          {producto.linea}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>X {producto.stock}</TableCell>
                    <TableCell>${producto.precio_con_impuesto.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleAsociarProveedor(producto)}
                          title="Asociar a proveedor"
                          className="h-8 w-8"
                        >
                          <LinkIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleView(producto)}
                          title="Ver detalles"
                          className="h-8 w-8"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(producto)}
                          title="Editar"
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(producto.id)}
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

      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles del Producto</DialogTitle>
          </DialogHeader>
          {selectedProducto && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground">ID</Label>
                  <p className="text-base">{selectedProducto.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground">Nombre</Label>
                  <p className="text-base">{selectedProducto.nombre}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-semibold text-muted-foreground">Descripción</Label>
                  <p className="text-base">{selectedProducto.descripcion}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground">Marca</Label>
                  <p className="text-base">{selectedProducto.marca}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground">Línea</Label>
                  <p className="text-base">{selectedProducto.linea}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground">Stock</Label>
                  <p className="text-base">{selectedProducto.stock} unidades</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground">Precio sin Impuesto</Label>
                  <p className="text-base">${Number.parseFloat(selectedProducto.precio_sin_impuesto).toFixed(2)}</p>
                </div>
                {selectedProducto.impuesto && (
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">Impuesto</Label>
                    <p className="text-base">{selectedProducto.impuesto}%</p>
                  </div>
                )}
                {selectedProducto.precio_con_impuesto && (
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">Precio con Impuesto</Label>
                    <p className="text-base">${selectedProducto.precio_con_impuesto.toFixed(2)}</p>
                  </div>
                )}
              </div>

              {selectedProducto.proveedores && selectedProducto.proveedores.length > 0 && (
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground mb-2 block">Proveedores</Label>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Nombre</TableHead>
                          <TableHead>Código</TableHead>
                          <TableHead>Precio</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedProducto.proveedores.map((prov: any, idx: number) => (
                          <TableRow key={idx}>
                            <TableCell>{prov.nombre}</TableCell>
                            <TableCell className="font-mono">{prov.codigo_proveedor}</TableCell>
                            <TableCell>${Number.parseFloat(prov.precio_proveedor).toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                {selectedProducto.createdAt && (
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">Fecha de Creación</Label>
                    <p className="text-base">{new Date(selectedProducto.createdAt).toLocaleString()}</p>
                  </div>
                )}
                {selectedProducto.updatedAt && (
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">Última Modificación</Label>
                    <p className="text-base">{new Date(selectedProducto.updatedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-nombre">Nombre</Label>
              <Input
                id="edit-nombre"
                value={editForm.nombre}
                onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-descripcion">Descripción</Label>
              <Input
                id="edit-descripcion"
                value={editForm.descripcion}
                onChange={(e) => setEditForm({ ...editForm, descripcion: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-precio">Precio</Label>
                <Input
                  id="edit-precio"
                  type="number"
                  value={editForm.precio}
                  onChange={(e) => setEditForm({ ...editForm, precio: Number.parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-stock">Stock</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  value={editForm.stock}
                  onChange={(e) => setEditForm({ ...editForm, stock: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-marca">Marca</Label>
              <Select
                value={editForm.marcaId.toString()}
                onValueChange={(value) => setEditForm({ ...editForm, marcaId: Number.parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar marca" />
                </SelectTrigger>
                <SelectContent>
                  {marcas.map((marca) => (
                    <SelectItem key={marca.id} value={marca.id.toString()}>
                      {marca.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-linea">Línea</Label>
              <Select
                value={editForm.lineaId.toString()}
                onValueChange={(value) => setEditForm({ ...editForm, lineaId: Number.parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar línea" />
                </SelectTrigger>
                <SelectContent>
                  {lineas.map((linea) => (
                    <SelectItem key={linea.id} value={linea.id.toString()}>
                      {linea.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={asociarModalOpen} onOpenChange={setAsociarModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asociar Proveedor al Producto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="proveedor">Proveedor</Label>
              <Select
                value={asociarForm.proveedorId.toString()}
                onValueChange={(value) => setAsociarForm({ ...asociarForm, proveedorId: Number.parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar proveedor" />
                </SelectTrigger>
                <SelectContent>
                  {proveedores.map((proveedor) => (
                    <SelectItem key={proveedor.id} value={proveedor.id.toString()}>
                      {proveedor.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="precio-proveedor">Precio del Proveedor</Label>
              <Input
                id="precio-proveedor"
                type="number"
                value={asociarForm.precio_proveedor}
                onChange={(e) =>
                  setAsociarForm({ ...asociarForm, precio_proveedor: Number.parseFloat(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="codigo-proveedor">Código del Proveedor</Label>
              <Input
                id="codigo-proveedor"
                value={asociarForm.codigo_proveedor}
                onChange={(e) => setAsociarForm({ ...asociarForm, codigo_proveedor: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAsociarModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveAsociacion}>Asociar Proveedor</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
