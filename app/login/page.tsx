// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import { AppHeader } from "@/components/app-header"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Button } from "@/components/ui/button"
// import { Eye, EyeOff } from "lucide-react"

// export default function LoginPage() {
//   const [showPassword, setShowPassword] = useState(false)

//   return (
//     <div className="min-h-screen bg-background">
//       <AppHeader />
//       <main className="container mx-auto px-6 py-12 flex items-center justify-center min-h-[calc(100vh-4rem)]">
//         <Card className="w-full max-w-md shadow-lg">
//           <CardHeader className="space-y-3 text-center">
//             <CardTitle className="text-3xl font-bold text-balance">
//               Bienvenido al sistema de gestión de ventas
//             </CardTitle>
//             <CardDescription className="text-lg font-semibold">INICIO DE SESIÓN</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input id="email" type="email" placeholder="correo@ejemplo.com" autoComplete="email" />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="password">Contraseña</Label>
//                 <div className="relative">
//                   <Input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     placeholder="••••••••"
//                     autoComplete="current-password"
//                   />
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="icon"
//                     className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
//                     onClick={() => setShowPassword(!showPassword)}
//                     aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
//                   >
//                     {showPassword ? (
//                       <EyeOff className="h-4 w-4 text-muted-foreground" />
//                     ) : (
//                       <Eye className="h-4 w-4 text-muted-foreground" />
//                     )}
//                   </Button>
//                 </div>
//               </div>

//               <div className="text-right">
//                 <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
//                   ¿Olvidaste tu contraseña?
//                 </Link>
//               </div>
//             </div>

//             <Button className="w-full bg-[#2B3A8F] hover:bg-[#1e2870] text-white" size="lg">
//               INICIAR SESIÓN
//             </Button>

//             <p className="text-center text-sm text-muted-foreground">
//               ¿No tienes cuenta?{" "}
//               <Link href="/auth/register" className="font-semibold text-[#2B3A8F] hover:underline dark:text-blue-400">
//                 CREAR CUENTA
//               </Link>
//             </p>
//           </CardContent>
//         </Card>
//       </main>
//     </div>
//   )
// }
"use client"

import { useState } from "react"
import Link from "next/link"
import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { loginUser } from "@/lib/auth"
import { LoginFormData } from "@/types/auth"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
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

      setError(result.message || "Error al iniciar sesión")
    } catch (err: any) {
      setError(err?.message || "Error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError("")
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError("")
    setPassword(e.target.value)
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-6 py-12 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-3 text-center">
            <CardTitle className="text-3xl font-bold text-balance">
              Bienvenido al sistema de gestión de ventas
            </CardTitle>
            <CardDescription className="text-lg font-semibold">INICIO DE SESIÓN</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    autoComplete="email"
                    value={email}
                    onChange={handleEmailChange}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      value={password}
                      onChange={handlePasswordChange}
                      disabled={loading}
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

                <div className="text-right">
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#2B3A8F] hover:bg-[#1e2870] text-white"
                size="lg"
                disabled={loading}
              >
                {loading ? "Iniciando sesión..." : "INICIAR SESIÓN"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                ¿No tienes cuenta?{" "}
                <Link href="/register" className="font-semibold text-[#2B3A8F] hover:underline dark:text-blue-400">
                  CREAR CUENTA
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
