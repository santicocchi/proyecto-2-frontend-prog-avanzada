"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createCliente, type CreateClienteDto } from "@/lib/api-service"
import { Loader2 } from "lucide-react"
import { useNotify } from "@/lib/notify"

const TIPO_DOCUMENTO_MAP: Record<string, number> = {
  DNI: 1,
  CUIT: 2,
  Pasaporte: 3,
}

const onlyDigits = (s: string) => s.replace(/\D+/g, "")
const isDigits = (s: string) => /^\d+$/.test(s)

export function ClienteForm() {
  const notify = useNotify()

  const [loading, setLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    nombre: "",
    apellido: "",
    tipoDocumento: "DNI",
    num_documento: "",
    telefono: "",
  })

  const validar = () => {
    if (!formData.nombre.trim() || !formData.apellido.trim()) {
      return "Nombre y apellido son obligatorios"
    }
    if (!formData.num_documento.trim()) {
      return "El número de documento es obligatorio"
    }
    if (!isDigits(formData.num_documento)) {
      return "El número de documento debe contener solo números"
    }
    if (!formData.telefono.trim()) {
      return "El teléfono es obligatorio"
    }
    if (!isDigits(formData.telefono)) {
      return "El teléfono debe contener solo números"
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const err = validar()
    if (err) {
      notify.error(err)
      return
    }

    setLoading(true)
    try {
      const clienteDto: CreateClienteDto = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        num_documento: formData.num_documento.trim(),
        telefono: formData.telefono.trim(),
        tipo_documento: TIPO_DOCUMENTO_MAP[formData.tipoDocumento],
      }

      await createCliente(clienteDto)
      notify.success("Cliente registrado exitosamente")

      setFormData({
        nombre: "",
        apellido: "",
        tipoDocumento: "DNI",
        num_documento: "",
        telefono: "",
      })
    } catch (error) {
      console.error("Error al registrar cliente:", error)
      notify.apiError(error, "Error al registrar cliente")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Registrar Nuevo Cliente</CardTitle>
        <CardDescription>Complete los datos del cliente</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido *</Label>
              <Input
                id="apellido"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipoDocumento">Tipo de Documento *</Label>
              <Select
                value={formData.tipoDocumento}
                onValueChange={(value) => setFormData({ ...formData, tipoDocumento: value })}
              >
                <SelectTrigger id="tipoDocumento">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DNI">DNI</SelectItem>
                  <SelectItem value="CUIT">CUIT</SelectItem>
                  <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="num_documento">Número de Documento *</Label>
              <Input
                id="num_documento"
                value={formData.num_documento}
                inputMode="numeric"
                pattern="[0-9]*"
                onChange={(e) =>
                  setFormData({ ...formData, num_documento: onlyDigits(e.target.value) })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono *</Label>
            <Input
              id="telefono"
              value={formData.telefono}
              inputMode="numeric"
              pattern="[0-9]*"
              onChange={(e) =>
                setFormData({ ...formData, telefono: onlyDigits(e.target.value) })
              }
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#2B3A8F] hover:bg-[#1e2870]"
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar Cliente"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
