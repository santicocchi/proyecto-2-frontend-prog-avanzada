"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Plus, Loader2 } from "lucide-react"
import { MarcaForm } from "./marca-form"
import { LineaForm } from "./linea-form"
import { getMarcas, createProducto, type CreateProductoDto } from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"

export function ProductoForm() {
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)
  const [marcas, setMarcas] = React.useState<any[]>([])
  const [lineas, setLineas] = React.useState<any[]>([])
  const [showMarcaModal, setShowMarcaModal] = React.useState(false)
  const [showLineaModal, setShowLineaModal] = React.useState(false)

  const [formData, setFormData] = React.useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    marcaId: "",
    lineaId: "",
  })

  React.useEffect(() => {
    loadMarcas()
  }, [])

  React.useEffect(() => {
    if (formData.marcaId) {
      loadLineasByMarca(formData.marcaId)
    } else {
      setLineas([])
    }
  }, [formData.marcaId])

  const loadMarcas = async () => {
    try {
      const data = await getMarcas()
      setMarcas(data)
    } catch (error) {
      console.error("Error al cargar marcas:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las marcas",
        variant: "destructive",
      })
    }
  }

  const loadLineasByMarca = async (marcaId: string) => {
    try {
      const marcaSeleccionada = marcas.find((m) => m.id.toString() === marcaId)
      if (marcaSeleccionada?.lineas) {
        setLineas(marcaSeleccionada.lineas)
      } else {
        setLineas([])
      }
    } catch (error) {
      console.error("Error al cargar líneas:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las líneas",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.marcaId || !formData.lineaId) {
        toast({
          title: "Error",
          description: "Debes seleccionar una marca y una línea",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      const productoDto: CreateProductoDto = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: formData.precio,
        stock: formData.stock,
        marcaId: Number.parseInt(formData.marcaId),
        lineaId: Number.parseInt(formData.lineaId),
      }

      await createProducto(productoDto)

      toast({
        title: "Éxito",
        description: "Producto registrado exitosamente",
      })

      setFormData({
        nombre: "",
        descripcion: "",
        precio: 0,
        stock: 0,
        marcaId: "",
        lineaId: "",
      })
    } catch (error: any) {
      console.error("Error al registrar producto:", error)
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Error al registrar producto",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleMarcaSuccess = async () => {
    await loadMarcas()
    setShowMarcaModal(false)
    toast({
      title: "Éxito",
      description: "Marca creada exitosamente",
    })
  }

  const handleLineaSuccess = async () => {
    if (formData.marcaId) {
      await loadMarcas() // Recargar marcas para obtener las líneas actualizadas
      await loadLineasByMarca(formData.marcaId)
    }
    setShowLineaModal(false)
    toast({
      title: "Éxito",
      description: "Línea creada exitosamente",
    })
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Registrar Nuevo Producto</CardTitle>
        <CardDescription>Completa los datos para registrar un nuevo producto</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              id="nombre"
              placeholder="Ej: Zapatilla Air Max 2024"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción *</Label>
            <Textarea
              id="descripcion"
              placeholder="Describe el producto, características, materiales..."
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imagen">Imagen</Label>
            <div className="flex items-center gap-4">
              <Button type="button" variant="outline" className="relative bg-transparent" asChild>
                <label htmlFor="imagen" className="cursor-pointer">
                  <Upload className="mr-2 h-4 w-4" />
                  Seleccionar Imagen
                  <input id="imagen" type="file" accept="image/*" className="sr-only" />
                </label>
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="marca">Marca *</Label>
              <Dialog open={showMarcaModal} onOpenChange={setShowMarcaModal}>
                <DialogTrigger asChild>
                  <Button type="button" variant="link" size="sm" className="h-auto p-0 text-primary">
                    <Plus className="mr-1 h-3 w-3" />
                    Crear Marca
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Crear Nueva Marca</DialogTitle>
                  </DialogHeader>
                  <MarcaForm onSuccess={handleMarcaSuccess} onCancel={() => setShowMarcaModal(false)} />
                </DialogContent>
              </Dialog>
            </div>
            <Select
              value={formData.marcaId}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  marcaId: value,
                  lineaId: "", // Limpiar línea seleccionada al cambiar de marca
                })
              }
              required
            >
              <SelectTrigger id="marca">
                <SelectValue placeholder="Selecciona una marca" />
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
            <div className="flex items-center justify-between">
              <Label htmlFor="linea">Línea *</Label>
              <Dialog open={showLineaModal} onOpenChange={setShowLineaModal}>
                <DialogTrigger asChild>
                  <Button type="button" variant="link" size="sm" className="h-auto p-0 text-primary">
                    <Plus className="mr-1 h-3 w-3" />
                    Crear Línea
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Crear Nueva Línea</DialogTitle>
                  </DialogHeader>
                  <LineaForm onSuccess={handleLineaSuccess} onCancel={() => setShowLineaModal(false)} />
                </DialogContent>
              </Dialog>
            </div>
            <Select
              value={formData.lineaId}
              onValueChange={(value) => setFormData({ ...formData, lineaId: value })}
              required
              disabled={!formData.marcaId} // Deshabilitar si no hay marca seleccionada
            >
              <SelectTrigger id="linea">
                <SelectValue
                  placeholder={
                    !formData.marcaId
                      ? "Primero selecciona una marca"
                      : lineas.length === 0
                        ? "No hay líneas para esta marca"
                        : "Selecciona una línea"
                  }
                />
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="precio">Precio *</Label>
              <Input
                id="precio"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.precio || ""}
                onChange={(e) => setFormData({ ...formData, precio: Number.parseFloat(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                placeholder="0"
                value={formData.stock || ""}
                onChange={(e) => setFormData({ ...formData, stock: Number.parseInt(e.target.value) || 0 })}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#2B3A8F] hover:bg-[#1e2870]"
            size="lg"
            disabled={loading || !formData.marcaId || !formData.lineaId}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar Producto"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
