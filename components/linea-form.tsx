"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createLinea, type CreateLineaDto } from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"

interface LineaFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function LineaForm({ onSuccess, onCancel }: LineaFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)
  const [formData, setFormData] = React.useState<CreateLineaDto>({
    nombre: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await createLinea(formData)
      toast({
        title: "Línea creada",
        description: "La línea se ha registrado correctamente.",
      })
      setFormData({ nombre: "" })
      onSuccess?.()
    } catch (error) {
      console.error("Error al crear línea:", error)
      toast({
        title: "Error",
        description: "No se pudo crear la línea. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Registrar Nueva Línea</CardTitle>
        <CardDescription>Completa los datos para registrar una nueva línea/categoría</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre de la Línea *</Label>
            <Input
              id="nombre"
              placeholder="Ej: Zapatillas deportivas, Pantalones, Remeras"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Guardando..." : "Registrar Línea"}
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
