"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Marca } from "@/lib/mock-data"

interface LineaFormProps {
  marcas: Marca[]
  onSubmit?: (data: LineaFormData) => void
  initialData?: LineaFormData
  isEditing?: boolean
}

export interface LineaFormData {
  marcaId: string
  nombre: string
  descripcion: string
}

export function LineaForm({ marcas, onSubmit, initialData, isEditing = false }: LineaFormProps) {
  const [formData, setFormData] = React.useState<LineaFormData>(
    initialData || {
      marcaId: "",
      nombre: "",
      descripcion: "",
    },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Editar Línea" : "Registrar Nueva Línea"}</CardTitle>
        <CardDescription>
          {isEditing ? "Modifica los datos de la línea" : "Completa los datos para registrar una nueva línea/categoría"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="marca">Marca *</Label>
            <Select value={formData.marcaId} onValueChange={(value) => setFormData({ ...formData, marcaId: value })}>
              <SelectTrigger id="marca">
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

          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre de la Categoría *</Label>
            <Input
              id="nombre"
              placeholder="Ej: Running, Basketball, Training"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción *</Label>
            <Textarea
              id="descripcion"
              placeholder="Describe la línea de productos, características principales..."
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1" disabled={!formData.marcaId}>
              {isEditing ? "Guardar Cambios" : "Registrar Línea"}
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
