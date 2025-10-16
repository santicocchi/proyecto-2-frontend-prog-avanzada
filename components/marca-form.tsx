"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { createMarca, getLineas, type CreateMarcaDto, type Linea } from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"

interface MarcaFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function MarcaForm({ onSuccess, onCancel }: MarcaFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)
  const [lineas, setLineas] = React.useState<Linea[]>([])
  const [formData, setFormData] = React.useState<CreateMarcaDto>({
    nombre: "",
    lineas: [],
  })

  React.useEffect(() => {
    getLineas()
      .then(setLineas)
      .catch((error) => {
        console.error("Error al cargar líneas:", error)
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await createMarca(formData)
      toast({
        title: "Marca creada",
        description: "La marca se ha registrado correctamente.",
      })
      onSuccess?.()
    } catch (error) {
      console.error("Error al crear marca:", error)
      toast({
        title: "Error",
        description: "No se pudo crear la marca. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLineaToggle = (lineaId: number) => {
    setFormData((prev) => ({
      ...prev,
      lineas: prev.lineas?.includes(lineaId)
        ? prev.lineas.filter((id) => id !== lineaId)
        : [...(prev.lineas || []), lineaId],
    }))
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Registrar Nueva Marca</CardTitle>
        <CardDescription>Completa los datos para registrar una nueva marca</CardDescription>
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
              disabled={loading}
            />
          </div>

          {lineas.length > 0 && (
            <div className="space-y-2">
              <Label>Líneas Asociadas (opcional)</Label>
              <div className="space-y-2 border rounded-lg p-4">
                {lineas.map((linea) => (
                  <div key={linea.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`linea-${linea.id}`}
                      checked={formData.lineas?.includes(linea.id)}
                      onCheckedChange={() => handleLineaToggle(linea.id)}
                      disabled={loading}
                    />
                    <label
                      htmlFor={`linea-${linea.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {linea.nombre}
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">Selecciona las líneas que pertenecen a esta marca</p>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Guardando..." : "Registrar Marca"}
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
