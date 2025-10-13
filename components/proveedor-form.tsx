"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ProveedorFormProps {
  onSubmit?: (data: ProveedorFormData) => void
  initialData?: ProveedorFormData
  isEditing?: boolean
}

export interface ProveedorFormData {
  nombre: string
  descripcion: string
}

export function ProveedorForm({ onSubmit, initialData, isEditing = false }: ProveedorFormProps) {
  const [formData, setFormData] = React.useState<ProveedorFormData>(
    initialData || {
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
        <CardTitle>{isEditing ? "Editar Proveedor" : "Registrar Nuevo Proveedor"}</CardTitle>
        <CardDescription>
          {isEditing ? "Modifica los datos del proveedor" : "Completa los datos para registrar un nuevo proveedor"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del Proveedor *</Label>
            <Input
              id="nombre"
              placeholder="Ej: Distribuidora Deportiva SA"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción *</Label>
            <Textarea
              id="descripcion"
              placeholder="Describe el proveedor, sus servicios, especialidades..."
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1">
              {isEditing ? "Guardar Cambios" : "Registrar Proveedor"}
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
