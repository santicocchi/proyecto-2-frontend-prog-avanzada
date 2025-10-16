"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  createVenta,
  getClientes,
  getFormasPago,
  getProductos,
  type Cliente,
  type FormaPago,
  type ProductoBackend,
  type CreateVentaDto,
} from "@/lib/api-service"
import { Loader2, Plus, Trash2 } from "lucide-react"

interface DetalleVentaForm {
  productoId: number
  cantidad: number
  precio: number
  subtotal: number
  nombreProducto: string
}

export function VentaForm() {
  const [loading, setLoading] = React.useState(false)
  const [clientes, setClientes] = React.useState<Cliente[]>([])
  const [formasPago, setFormasPago] = React.useState<FormaPago[]>([])
  const [productos, setProductos] = React.useState<ProductoBackend[]>([])
  const [detalles, setDetalles] = React.useState<DetalleVentaForm[]>([])
  const [formData, setFormData] = React.useState({
    clienteId: "",
    formaPagoId: "",
    userId: "1", // Hardcoded por ahora, debería venir de la sesión
    fechaVenta: new Date().toISOString().split("T")[0],
  })
  const [nuevoDetalle, setNuevoDetalle] = React.useState({
    productoId: "",
    cantidad: 1,
  })

  React.useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [clientesData, formasPagoData, productosData] = await Promise.all([
        getClientes(),
        getFormasPago(),
        getProductos(),
      ])
      setClientes(clientesData)
      setFormasPago(formasPagoData)
      setProductos(productosData)
    } catch (error) {
      console.error("Error al cargar datos:", error)
    }
  }

  const agregarDetalle = () => {
    if (!nuevoDetalle.productoId || nuevoDetalle.cantidad <= 0) {
      alert("Seleccione un producto y cantidad válida")
      return
    }

    const producto = productos.find((p) => p.id === Number(nuevoDetalle.productoId))
    if (!producto) return

    const precio = Number.parseFloat(producto.precio_sin_impuesto)
    const subtotal = precio * nuevoDetalle.cantidad

    setDetalles([
      ...detalles,
      {
        productoId: Number(nuevoDetalle.productoId),
        cantidad: nuevoDetalle.cantidad,
        precio,
        subtotal,
        nombreProducto: producto.nombre,
      },
    ])
    setNuevoDetalle({ productoId: "", cantidad: 1 })
  }

  const eliminarDetalle = (index: number) => {
    setDetalles(detalles.filter((_, i) => i !== index))
  }

  const calcularTotal = () => {
    return detalles.reduce((sum, detalle) => sum + detalle.subtotal, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (detalles.length === 0) {
      alert("Debe agregar al menos un producto")
      return
    }

    if (!formData.clienteId || !formData.formaPagoId) {
      alert("Complete todos los campos requeridos")
      return
    }

    setLoading(true)

    try {
      const ventaData: CreateVentaDto = {
        fecha_venta: new Date(formData.fechaVenta).toISOString(),
        clienteId: Number(formData.clienteId),
        formaPagoId: Number(formData.formaPagoId),
        userId: Number(formData.userId),
        detallesVenta: detalles.map((d) => ({
          productoId: d.productoId,
          cantidad: d.cantidad,
        })),
      }

      await createVenta(ventaData)
      alert("Venta registrada exitosamente")

      setFormData({
        clienteId: "",
        formaPagoId: "",
        userId: "1",
        fechaVenta: new Date().toISOString().split("T")[0],
      })
      setDetalles([])
    } catch (error) {
      console.error("Error al registrar venta:", error)
      alert("Error al registrar venta")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Registrar Nueva Venta</CardTitle>
        <CardDescription>Complete los datos de la venta y agregue los productos</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clienteId">Cliente *</Label>
              <Select
                value={formData.clienteId}
                onValueChange={(value) => setFormData({ ...formData, clienteId: value })}
              >
                <SelectTrigger id="clienteId">
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id.toString()}>
                      {cliente.nombre} {cliente.apellido}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="formaPagoId">Forma de Pago *</Label>
              <Select
                value={formData.formaPagoId}
                onValueChange={(value) => setFormData({ ...formData, formaPagoId: value })}
              >
                <SelectTrigger id="formaPagoId">
                  <SelectValue placeholder="Seleccionar forma de pago" />
                </SelectTrigger>
                <SelectContent>
                  {formasPago.map((fp) => (
                    <SelectItem key={fp.id} value={fp.id.toString()}>
                      {fp.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaVenta">Fecha de Venta *</Label>
              <Input
                id="fechaVenta"
                type="date"
                value={formData.fechaVenta}
                onChange={(e) => setFormData({ ...formData, fechaVenta: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-semibold">Agregar Productos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="productoId">Producto</Label>
                <Select
                  value={nuevoDetalle.productoId}
                  onValueChange={(value) => setNuevoDetalle({ ...nuevoDetalle, productoId: value })}
                >
                  <SelectTrigger id="productoId">
                    <SelectValue placeholder="Seleccionar producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {productos.map((producto) => (
                      <SelectItem key={producto.id} value={producto.id.toString()}>
                        {producto.nombre} - ${producto.precio_sin_impuesto}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cantidad">Cantidad</Label>
                <div className="flex gap-2">
                  <Input
                    id="cantidad"
                    type="number"
                    min="1"
                    value={nuevoDetalle.cantidad}
                    onChange={(e) =>
                      setNuevoDetalle({ ...nuevoDetalle, cantidad: Number.parseInt(e.target.value) || 1 })
                    }
                  />
                  <Button type="button" onClick={agregarDetalle} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {detalles.length > 0 && (
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead className="text-right">Cantidad</TableHead>
                      <TableHead className="text-right">Precio Unit.</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detalles.map((detalle, index) => (
                      <TableRow key={index}>
                        <TableCell>{detalle.nombreProducto}</TableCell>
                        <TableCell className="text-right">{detalle.cantidad}</TableCell>
                        <TableCell className="text-right">${detalle.precio.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${detalle.subtotal.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <Button type="button" variant="ghost" size="icon" onClick={() => eliminarDetalle(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-semibold">
                        Total:
                      </TableCell>
                      <TableCell className="text-right font-bold text-lg">${calcularTotal().toFixed(2)}</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full bg-[#2B3A8F] hover:bg-[#1e2870]" size="lg" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar Venta"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
