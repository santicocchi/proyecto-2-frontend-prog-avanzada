"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createProveedor, type CreateProveedorDto } from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"

interface ProveedorFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function ProveedorForm({ onSuccess, onCancel }: ProveedorFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)
  const [formData, setFormData] = React.useState<CreateProveedorDto>({
    nombre: "",
    direccion: "",
    cuit: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await createProveedor(formData)
      toast({
        title: "Proveedor creado",
        description: "El proveedor se ha registrado correctamente.",
      })
      setFormData({ nombre: "", direccion: "", cuit: "" })
      onSuccess?.()
    } catch (error) {
      console.error("Error al crear proveedor:", error)
      toast({
        title: "Error",
        description: "No se pudo crear el proveedor. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Registrar Nuevo Proveedor</CardTitle>
        <CardDescription>Completa los datos para registrar un nuevo proveedor</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del Proveedor *</Label>
            <Input
              id="nombre"
              placeholder="Ej: Adidas Oficial"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección *</Label>
            <Input
              id="direccion"
              placeholder="Ej: San Juan 7126"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cuit">CUIT *</Label>
            <Input
              id="cuit"
              placeholder="Ej: 20442436281"
              value={formData.cuit}
              onChange={(e) => setFormData({ ...formData, cuit: e.target.value })}
              required
              disabled={loading}
              maxLength={11}
            />
            <p className="text-sm text-muted-foreground">Ingresa el CUIT sin guiones ni espacios</p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Guardando..." : "Registrar Proveedor"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
