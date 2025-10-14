"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff } from "lucide-react"
import api from "@/services/api"
import { AxiosResponse } from "axios"
import { RegisterDTO } from "@/types/auth"
import { SuccessModal } from "@/components/success-modal"
import { ErrorModal } from "@/components/error-modal"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState<RegisterDTO>({
    email: "",
    password: "",
  })
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [errorOpen, setErrorOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.password || !confirmPassword) {
      setModalMessage("Por favor, complete todos los campos")
      setErrorOpen(true)
      return
    }

    if (formData.password !== confirmPassword) {
      setModalMessage("Las contraseñas no coinciden")
      setErrorOpen(true)
      return
    }

    setLoading(true)

    try {
      let response: AxiosResponse = await api.post("/users/register", formData)

      if (response.status !== 201) {
        setModalMessage(response.data?.message || "Error en el registro")
        setErrorOpen(true)
        return
      }

      setModalMessage("Registro exitoso. Ahora puedes iniciar sesión.")
      setSuccessOpen(true)
    } catch (err: any) {
      setModalMessage(err?.response?.data?.message || err?.message || "Error inesperado")
      setErrorOpen(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Modales */}
      <SuccessModal
        isOpen={successOpen}
        onOpenChange={(open) => {
          setSuccessOpen(open)
          if (!open) router.push("/auth/login")
        }}
        message={modalMessage}
      />

      <ErrorModal
        isOpen={errorOpen}
        onOpenChange={setErrorOpen}
        message={modalMessage}
      />

      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="container mx-auto px-6 py-12 flex items-center justify-center">
          <Card className="w-full max-w-2xl shadow-lg">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-3xl font-bold">CREAR CUENTA</CardTitle>
              <CardDescription className="text-base">
                Completa el formulario para registrarte
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Campos de ejemplo deshabilitados o futuros */}
                  {/* <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input id="nombre" name="nombre" placeholder="Juan" onChange={handleChange} disabled={loading} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apellido">Apellido</Label>
                    <Input id="apellido" name="apellido" placeholder="Pérez" onChange={handleChange} disabled={loading} />
                  </div> */}

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="correo@ejemplo.com"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={loading}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="confirm-password">Repetir contraseña</Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="text-sm text-muted-foreground">[reCAPTCHA placeholder]</div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#2B3A8F] hover:bg-[#1e2870] text-white"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Registrando..." : "CREAR CUENTA"}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  ¿Ya tienes cuenta?{" "}
                  <Link href="/login" className="font-semibold text-[#2B3A8F] hover:underline dark:text-blue-400">
                    INICIA SESIÓN
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  )
}
