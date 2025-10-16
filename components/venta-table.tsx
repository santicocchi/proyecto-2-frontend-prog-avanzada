"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Eye, Search } from "lucide-react"
import { getVentas, getVentaById, type VentaListItem, type VentaDetallada } from "@/lib/api-service"
import { Badge } from "@/components/ui/badge"

export function VentaTable() {
  const [ventas, setVentas] = React.useState<VentaListItem[]>([])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [loading, setLoading] = React.useState(true)
  const [selectedVenta, setSelectedVenta] = React.useState<VentaDetallada | null>(null)
  const [showDetailModal, setShowDetailModal] = React.useState(false)
  const [loadingDetail, setLoadingDetail] = React.useState(false)

  React.useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const ventasData = await getVentas()
      setVentas(ventasData)
    } catch (error) {
      console.error("Error al cargar ventas:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerDetalle = async (ventaId: number) => {
    setLoadingDetail(true)
    setShowDetailModal(true)
    try {
      const detalle = await getVentaById(ventaId)
      setSelectedVenta(detalle)
    } catch (error) {
      console.error("Error al cargar detalle de venta:", error)
      alert("Error al cargar los detalles de la venta")
      setShowDetailModal(false)
    } finally {
      setLoadingDetail(false)
    }
  }

  const filteredVentas = ventas.filter((venta) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      venta.cliente.toLowerCase().includes(searchLower) ||
      venta.id.toString().includes(searchTerm) ||
      venta.responsable.toLowerCase().includes(searchLower)
    )
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-AR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por ID, cliente o responsable..."
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
                <TableHead>Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Forma de Pago</TableHead>
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
                    <TableCell>{formatDate(venta.fecha)}</TableCell>
                    <TableCell>{venta.cliente}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{venta.responsable}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{venta.formaPago}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">${venta.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Ver detalles"
                          onClick={() => handleVerDetalle(venta.id)}
                        >
                          <Eye className="h-4 w-4" />
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

      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalle de Venta #{selectedVenta?.id}</DialogTitle>
          </DialogHeader>

          {loadingDetail ? (
            <div className="py-8 text-center text-muted-foreground">Cargando detalles...</div>
          ) : selectedVenta ? (
            <div className="space-y-6">
              {/* Información general */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Cliente</p>
                  <p className="font-semibold">{selectedVenta.cliente}</p>
                  <p className="text-sm text-muted-foreground mt-1">{selectedVenta.documento}</p>
                  <p className="text-sm text-muted-foreground">{selectedVenta.telefono_cliente}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de Venta</p>
                  <p className="font-semibold">{formatDateTime(selectedVenta.fecha)}</p>
                  <p className="text-sm text-muted-foreground mt-2">Responsable</p>
                  <p className="font-semibold">{selectedVenta.responsable}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Forma de Pago</p>
                  <Badge variant="outline" className="mt-1">
                    {selectedVenta.formaPago}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Creado</p>
                  <p className="text-sm">{formatDateTime(selectedVenta.createdAt)}</p>
                </div>
              </div>

              {/* Detalles de productos */}
              <div>
                <h3 className="font-semibold mb-3">Productos</h3>
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead className="text-right">Precio</TableHead>
                        <TableHead className="text-center">Impuesto</TableHead>
                        <TableHead className="text-right">Precio + Imp.</TableHead>
                        <TableHead className="text-center">Cant.</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedVenta.detallesVenta.map((detalle, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{detalle.producto}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{detalle.descripcion}</TableCell>
                          <TableCell className="text-right">
                            ${Number(detalle.precio_sin_impuesto).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-center">{detalle.impuesto}%</TableCell>
                          <TableCell className="text-right">${detalle.precio_impuesto.toFixed(2)}</TableCell>
                          <TableCell className="text-center">{detalle.cantidad}</TableCell>
                          <TableCell className="text-right font-semibold">
                            ${Number(detalle.subtotal).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={6} className="text-right font-bold text-lg">
                          Total:
                        </TableCell>
                        <TableCell className="text-right font-bold text-lg">
                          ${selectedVenta.total.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}
