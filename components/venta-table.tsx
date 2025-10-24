"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Eye, Filter, X, ChevronLeft, ChevronRight } from "lucide-react"
import {
  getVentasAdvanced,
  getVentaById,
  getClientes,
  getFormasPago,
  getUsuarios,
  type VentaListItem,
  type VentaDetallada,
  type Cliente,
  type FormaPago,
  type Usuario,
  type FindAdvancedVentaDto,
} from "@/lib/api-service"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function VentaTable() {
  const [ventas, setVentas] = React.useState<VentaListItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [selectedVenta, setSelectedVenta] = React.useState<VentaDetallada | null>(null)
  const [showDetailModal, setShowDetailModal] = React.useState(false)
  const [loadingDetail, setLoadingDetail] = React.useState(false)

  // Estados para filtros
  const [showFilterModal, setShowFilterModal] = React.useState(false)
  const [filters, setFilters] = React.useState<FindAdvancedVentaDto>({
    clienteId: null,
    formaPagoId: null,
    userId: null,
    total: null,
    take: 10,
    page: 1,
  })

  // Estados para datos de los selectores
  const [clientes, setClientes] = React.useState<Cliente[]>([])
  const [formasPago, setFormasPago] = React.useState<FormaPago[]>([])
  const [usuarios, setUsuarios] = React.useState<Usuario[]>([])

  // Estados para paginación
  const [totalVentas, setTotalVentas] = React.useState(0)
  const [totalPages, setTotalPages] = React.useState(0)

  React.useEffect(() => {
    loadInitialData()
  }, [])

  React.useEffect(() => {
    loadVentas()
  }, [filters])

  const loadInitialData = async () => {
    try {
      const [clientesData, formasPagoData, usuariosData] = await Promise.all([
        getClientes().catch((err) => {
          console.error("Error al cargar clientes:", err)
          return []
        }),
        getFormasPago().catch((err) => {
          console.error("Error al cargar formas de pago:", err)
          return []
        }),
        getUsuarios().catch((err) => {
          console.error("Error al cargar usuarios:", err)
          return []
        }),
      ])
      console.log('clientes :) :',clientesData)
      setClientes(Array.isArray(clientesData.data) ? clientesData.data : [])
      setFormasPago(Array.isArray(formasPagoData) ? formasPagoData : [])
      setUsuarios(Array.isArray(usuariosData) ? usuariosData : [])
    } catch (error) {
      console.error("Error al cargar datos iniciales:", error)
      setClientes([])
      setFormasPago([])
      setUsuarios([])
    }
  }

  const loadVentas = async () => {
    setLoading(true)
    try {
      const response = await getVentasAdvanced(filters)
      setVentas(response.data)
      setTotalVentas(response.total)
      setTotalPages(Math.ceil(response.total / (filters.take || 10)))
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

  const handleApplyFilters = () => {
    setFilters({ ...filters, page: 1 })
    setShowFilterModal(false)
  }

  const handleClearFilters = () => {
    setFilters({
      clienteId: null,
      formaPagoId: null,
      userId: null,
      total: null,
      take: 10,
      page: 1,
    })
    setShowFilterModal(false)
  }

  const activeFiltersCount = [filters.clienteId, filters.formaPagoId, filters.userId, filters.total].filter(
    Boolean,
  ).length

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage })
  }

  const handleTakeChange = (newTake: string) => {
    setFilters({ ...filters, take: Number.parseInt(newTake), page: 1 })
  }

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
          <Button variant="outline" onClick={() => setShowFilterModal(true)} className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros Avanzados
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleClearFilters}>
              <X className="h-4 w-4 mr-1" />
              Limpiar filtros
            </Button>
          )}
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
              ) : ventas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No se encontraron ventas
                  </TableCell>
                </TableRow>
              ) : (
                ventas.map((venta) => (
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

        {!loading && ventas.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Mostrando {((filters.page || 1) - 1) * (filters.take || 10) + 1} a{" "}
              {Math.min((filters.page || 1) * (filters.take || 10), totalVentas)} de {totalVentas} ventas
            </div>
            <div className="flex items-center gap-2">
              <Select value={filters.take?.toString() || "10"} onValueChange={handleTakeChange}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 por página</SelectItem>
                  <SelectItem value="10">10 por página</SelectItem>
                  <SelectItem value="20">20 por página</SelectItem>
                  <SelectItem value="50">50 por página</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange((filters.page || 1) - 1)}
                  disabled={filters.page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm px-3">
                  Página {filters.page} de {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange((filters.page || 1) + 1)}
                  disabled={filters.page === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Dialog open={showFilterModal} onOpenChange={setShowFilterModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Filtros Avanzados</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Select
                value={filters.clienteId?.toString() || "all"}
                onValueChange={(value) =>
                  setFilters({ ...filters, clienteId: value === "all" ? null : Number.parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los clientes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los clientes</SelectItem>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id.toString()}>
                      {cliente.nombre} {cliente.apellido}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Forma de Pago</Label>
              <Select
                value={filters.formaPagoId?.toString() || "all"}
                onValueChange={(value) =>
                  setFilters({ ...filters, formaPagoId: value === "all" ? null : Number.parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las formas de pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las formas de pago</SelectItem>
                  {formasPago.map((fp) => (
                    <SelectItem key={fp.id} value={fp.id.toString()}>
                      {fp.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Usuario Responsable</Label>
              <Select
                value={filters.userId?.toString() || "all"}
                onValueChange={(value) =>
                  setFilters({ ...filters, userId: value === "all" ? null : Number.parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los usuarios" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los usuarios</SelectItem>
                  {usuarios.map((usuario) => (
                    <SelectItem key={usuario.id} value={usuario.id.toString()}>
                      {usuario.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Total Exacto</Label>
              <Input
                type="number"
                placeholder="Ej: 50000"
                value={filters.total ?? ""}
                onChange={(e) =>
                  setFilters({ ...filters, total: e.target.value ? Number.parseFloat(e.target.value) : null })
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowFilterModal(false)}>
              Cancelar
            </Button>
            <Button variant="outline" onClick={handleClearFilters}>
              Limpiar
            </Button>
            <Button onClick={handleApplyFilters}>Aplicar Filtros</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="!max-w-[90vw] !w-[90vw] !h-auto overflow-y-auto p-8 rounded-xl">
          <DialogHeader>
            <DialogTitle>Detalle de Venta #{selectedVenta?.id}</DialogTitle>
          </DialogHeader>

          {loadingDetail ? (
            <div className="py-8 text-center text-muted-foreground">Cargando detalles...</div>
          ) : selectedVenta ? (
            <div className="space-y-2">
              {/* Información general */}
              <div className="grid grid-cols-4 gap-2 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Cliente</p>
                  <p className="font-semibold">{selectedVenta.cliente}</p>
                  <p className="text-sm text-muted-foreground">Telefono: {selectedVenta.telefono_cliente}</p>
                  <p className="text-sm text-muted-foreground">{selectedVenta.documento}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fecha y Hora de Venta</p>
                  <p className="font-semibold">{formatDateTime(selectedVenta.fecha)}</p>
                  <p className="text-sm text-muted-foreground mt-2">Responsable de la Venta</p>
                  <p className="font-semibold">{selectedVenta.responsable}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Forma de Pago</p>
                  <Badge variant="outline" className="mt-1">
                    {selectedVenta.formaPago}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de Creacion</p>
                  <p className="text-sm">{formatDateTime(selectedVenta.createdAt)}</p>
                </div>
              </div>

              {/* Detalles de productos */}
              <div>
                <h3 className="font-semibold mb-3">Productos</h3>
                <div className="rounded-lg border">
                  <Table className="w-full border-collapse text-sm text-left [&_th]:px-2 [&_td]:px-2 [&_th]:py-2 [&_td]:py-1">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Impuesto</TableHead>
                        <TableHead>Precio + Imp.</TableHead>
                        <TableHead>Cant.</TableHead>
                        <TableHead>Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedVenta.detallesVenta.map((detalle, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{detalle.producto}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{detalle.descripcion}</TableCell>
                          <TableCell>${Number(detalle.precio_sin_impuesto).toFixed(2)}</TableCell>
                          <TableCell>{detalle.impuesto}%</TableCell>
                          <TableCell>${detalle.precio_impuesto.toFixed(2)}</TableCell>
                          <TableCell>{detalle.cantidad}</TableCell>
                          <TableCell className="font-semibold">${Number(detalle.subtotal).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={6} className="text-left font-bold text-lg">
                          Total:
                        </TableCell>
                        <TableCell className="text-left font-bold text-lg">
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
