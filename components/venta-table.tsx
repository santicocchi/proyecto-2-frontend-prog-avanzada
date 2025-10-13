"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Trash2, Eye, Search } from "lucide-react"
import { getVentas, getClientes, getFormasPago, getProductos } from "@/lib/api-service"
import { mockVentas, mockClientes, mockFormasPago, mockProductos } from "@/lib/mock-data"
import type { Venta, Cliente, FormaPago, Producto } from "@/lib/mock-data"

export function VentaTable() {
  const [ventas, setVentas] = React.useState<Venta[]>([])
  const [clientes, setClientes] = React.useState<Cliente[]>([])
  const [formasPago, setFormasPago] = React.useState<FormaPago[]>([])
  const [productos, setProductos] = React.useState<Producto[]>([])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [ventasData, clientesData, formasPagoData, productosData] = await Promise.all([
        getVentas(),
        getClientes(),
        getFormasPago(),
        getProductos(),
      ])
      setVentas(ventasData)
      setClientes(clientesData)
      setFormasPago(formasPagoData)
      setProductos(productosData)
    } catch (error) {
      console.error("Error al cargar datos:", error)
      setVentas(mockVentas)
      setClientes(mockClientes)
      setFormasPago(mockFormasPago)
      setProductos(mockProductos)
    } finally {
      setLoading(false)
    }
  }

  const getClienteNombre = (clienteId: string) => {
    const cliente = clientes.find((c) => c.id === clienteId)
    return cliente ? `${cliente.nombre} ${cliente.apellido}` : "-"
  }

  const getFormaPagoNombre = (formaPagoId: string) => {
    const formaPago = formasPago.find((fp) => fp.id === formaPagoId)
    return formaPago?.nombre || "-"
  }

  const filteredVentas = ventas.filter((venta) => {
    const clienteNombre = getClienteNombre(venta.clienteId).toLowerCase()
    return clienteNombre.includes(searchTerm.toLowerCase()) || venta.id.includes(searchTerm)
  })

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-AR")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por ID o cliente..."
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
              <TableHead>Fecha Venta</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Forma de Pago</TableHead>
              <TableHead>Productos</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Cargando ventas...
                </TableCell>
              </TableRow>
            ) : filteredVentas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No se encontraron ventas
                </TableCell>
              </TableRow>
            ) : (
              filteredVentas.map((venta) => (
                <TableRow key={venta.id}>
                  <TableCell className="font-mono text-sm">{venta.id}</TableCell>
                  <TableCell>{formatDate(venta.fechaVenta)}</TableCell>
                  <TableCell>{getClienteNombre(venta.clienteId)}</TableCell>
                  <TableCell>{getFormaPagoNombre(venta.formaPagoId)}</TableCell>
                  <TableCell>{venta.detallesVenta.length} producto(s)</TableCell>
                  <TableCell className="text-right font-semibold">${venta.total}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" title="Ver detalles">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Editar">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Eliminar">
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
