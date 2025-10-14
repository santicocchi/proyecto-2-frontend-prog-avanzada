"use client"
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { loginUser } from "@/lib/auth"
import { LoginFormData } from "@/types/auth"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [formData, setFormData] = useState<LoginFormData>({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const emailTrim = email.trim()
    const passwordTrim = password.trim()

    if (!emailTrim || !passwordTrim) {
      setError("Por favor, complete todos los campos")
      return
    }

    setLoading(true)
    try {
      const result = await loginUser(emailTrim, passwordTrim)

      if (result.ok) {
        window.location.href = "/"
        return
      }

      // Mostrar el mensaje específico del backend
      setError(result.message || "Error al iniciar sesión")
    } catch (err: any) {
      // console.error("[v0] Unexpected login error:", err)
      setError(err?.message || "Error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  // Limpia el error cuando el usuario empieza a tipear de nuevo
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError("")
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError("")
    setPassword(e.target.value)
  }



  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary">
          "Iniciar Sesión"
        </CardTitle>
        <CardDescription>
          "Ingrese sus credenciales para acceder al sistema"
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}


          <>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="ejemplo@correo.com"
                required
                className="w-full"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                required
                className="w-full"
                disabled={loading}
              />
            </div>
          </>


          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
            {loading
              ? "Iniciando sesión..."
              : "Iniciar Sesión"}
          </Button>


          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <Link href="/register" className="text-primary hover:text-primary/80 transition-colors font-medium">
                Regístrate aquí
              </Link>
            </p>
          </div>

        </form>
      </CardContent>
    </Card>
  )
}
