"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload } from "lucide-react"

interface MarcaFormProps {
  onSubmit?: (data: MarcaFormData) => void
  initialData?: MarcaFormData
  isEditing?: boolean
}

export interface MarcaFormData {
  nombre: string
  email: string
  descripcion: string
  logo?: File | string
}

export function MarcaForm({ onSubmit, initialData, isEditing = false }: MarcaFormProps) {
  const [formData, setFormData] = React.useState<MarcaFormData>(
    initialData || {
      nombre: "",
      email: "",
      descripcion: "",
    },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, logo: file })
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Editar Marca" : "Registrar Nueva Marca"}</CardTitle>
        <CardDescription>
          {isEditing ? "Modifica los datos de la marca" : "Completa los datos para registrar una nueva marca"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre de la Marca *</Label>
            <Input
              id="nombre"
              placeholder="Ej: Nike, Adidas, Puma"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email de Contacto *</Label>
            <Input
              id="email"
              type="email"
              placeholder="contacto@marca.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción *</Label>
            <Textarea
              id="descripcion"
              placeholder="Describe la marca, su historia, productos principales..."
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Logo de la Marca</Label>
            <div className="flex items-center gap-4">
              <Button type="button" variant="outline" className="relative bg-transparent" asChild>
                <label htmlFor="logo" className="cursor-pointer">
                  <Upload className="mr-2 h-4 w-4" />
                  Seleccionar Imagen
                  <input id="logo" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
                </label>
              </Button>
              {formData.logo && (
                <span className="text-sm text-muted-foreground">
                  {formData.logo instanceof File ? formData.logo.name : "Imagen cargada"}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">Formatos aceptados: JPG, PNG, SVG (máx. 2MB)</p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1">
              {isEditing ? "Guardar Cambios" : "Registrar Marca"}
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
