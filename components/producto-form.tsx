"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Plus } from "lucide-react"
import { MarcaForm, type MarcaFormData } from "./marca-form"
import { LineaForm, type LineaFormData } from "./linea-form"
import type { Marca, Proveedor, Linea } from "@/lib/mock-data"
import { createMarca, createLinea, getLineasByMarca } from "@/lib/api-service"

interface ProductoFormProps {
  marcas: Marca[]
  proveedores: Proveedor[]
  onSubmit?: (data: ProductoFormData) => void
  initialData?: ProductoFormData
  isEditing?: boolean
}

export interface ProductoFormData {
  nombre: string
  descripcion: string
  imagen?: File | string
  marcaId: string
  lineaId: string
  proveedorId: string
  precio: number
}

export function ProductoForm({ marcas, proveedores, onSubmit, initialData, isEditing = false }: ProductoFormProps) {
  const [formData, setFormData] = React.useState<ProductoFormData>(
    initialData || {
      nombre: "",
      descripcion: "",
      marcaId: "",
      lineaId: "",
      proveedorId: "",
      precio: 0,
    },
  )

  const [lineasDisponibles, setLineasDisponibles] = React.useState<Linea[]>([])
  const [showMarcaModal, setShowMarcaModal] = React.useState(false)
  const [showLineaModal, setShowLineaModal] = React.useState(false)
  const [localMarcas, setLocalMarcas] = React.useState<Marca[]>(marcas)

  React.useEffect(() => {
    if (formData.marcaId) {
      getLineasByMarca(formData.marcaId).then(setLineasDisponibles)
    } else {
      setLineasDisponibles([])
      setFormData((prev) => ({ ...prev, lineaId: "" }))
    }
  }, [formData.marcaId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, imagen: file })
    }
  }

  const handleCreateMarca = async (marcaData: MarcaFormData) => {
  try {
    const newMarca = await createMarca({
      ...marcaData,
      logo: undefined // or whatever the default value for logo should be
    });
    // rest of the code
  } catch (error) {
    console.error("Error al crear marca:", error);
  }
};

  const handleCreateLinea = async (lineaData: LineaFormData) => {
    try {
      const newLinea = await createLinea(lineaData)
      setLineasDisponibles([...lineasDisponibles, newLinea])
      setFormData({ ...formData, lineaId: newLinea.id })
      setShowLineaModal(false)
    } catch (error) {
      console.error("Error al crear línea:", error)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Editar Producto" : "Registrar Nuevo Producto"}</CardTitle>
        <CardDescription>
          {isEditing ? "Modifica los datos del producto" : "Completa los datos para registrar un nuevo producto"}
        </CardDescription>
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
                  <input id="imagen" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
                </label>
              </Button>
              {formData.imagen && (
                <span className="text-sm text-muted-foreground">
                  {formData.imagen instanceof File ? formData.imagen.name : "Imagen cargada"}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="proveedor">Proveedor *</Label>
            <Select
              value={formData.proveedorId}
              onValueChange={(value) => setFormData({ ...formData, proveedorId: value })}
            >
              <SelectTrigger id="proveedor">
                <SelectValue placeholder="Selecciona un proveedor" />
              </SelectTrigger>
              <SelectContent>
                {proveedores.map((proveedor) => (
                  <SelectItem key={proveedor.id} value={proveedor.id}>
                    {proveedor.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                  <MarcaForm onSubmit={handleCreateMarca} />
                </DialogContent>
              </Dialog>
            </div>
            <Select value={formData.marcaId} onValueChange={(value) => setFormData({ ...formData, marcaId: value })}>
              <SelectTrigger id="marca">
                <SelectValue placeholder="Selecciona una marca" />
              </SelectTrigger>
              <SelectContent>
                {localMarcas.map((marca) => (
                  <SelectItem key={marca.id} value={marca.id}>
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
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-primary"
                    disabled={!formData.marcaId}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Crear Línea
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Crear Nueva Línea</DialogTitle>
                  </DialogHeader>
                  <LineaForm
                    marcas={localMarcas}
                    onSubmit={handleCreateLinea}
                    initialData={{ marcaId: formData.marcaId, nombre: "", descripcion: "" }}
                  />
                </DialogContent>
              </Dialog>
            </div>
            <Select
              value={formData.lineaId}
              onValueChange={(value) => setFormData({ ...formData, lineaId: value })}
              disabled={!formData.marcaId}
            >
              <SelectTrigger id="linea">
                <SelectValue placeholder={formData.marcaId ? "Selecciona una línea" : "Primero selecciona una marca"} />
              </SelectTrigger>
              <SelectContent>
                {lineasDisponibles.map((linea) => (
                  <SelectItem key={linea.id} value={linea.id}>
                    {linea.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1" disabled={!formData.marcaId || !formData.lineaId}>
              {isEditing ? "Guardar Cambios" : "Guardar Producto"}
            </Button>
            <Button type="button" variant="outline" className="flex-1 bg-transparent">
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
