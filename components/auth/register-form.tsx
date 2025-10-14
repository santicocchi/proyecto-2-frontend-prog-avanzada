"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import api from "@/services/api"
import { AxiosResponse } from "axios"
import { useRouter } from "next/navigation"
import { RegisterDTO } from "@/types/auth"
import { SuccessModal } from "../success-modal"
import { ErrorModal } from "../error-modal"

export function RegisterForm() {
    const [formData, setFormData] = useState<RegisterDTO>({
        // nombre: "",
        // apellido: "",
        // telefono: "",
        email: "",
        password: "",
    })

    const [loading, setLoading] = useState(false)

    // estado para modales
    const [successOpen, setSuccessOpen] = useState(false)
    const [errorOpen, setErrorOpen] = useState(false)
    const [modalMessage, setModalMessage] = useState("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            let response: AxiosResponse

            response = await api.post("/users/register", formData)

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

    const router = useRouter()
    return (
        <>
            {/* Modales de éxito y error */}
            <SuccessModal
                isOpen={successOpen}
                onOpenChange={(open) => {
                    setSuccessOpen(open)
                    if (!open) {
                        router.push("/login")
                    }
                }}
                message={modalMessage}
            />

            <ErrorModal
                isOpen={errorOpen}
                onOpenChange={setErrorOpen}
                message={modalMessage}
            />

            <Card className="w-full max-w-md mx-auto">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-primary">
                        "Registro de Usuario"
                    </CardTitle>
                    <CardDescription>
                        "Completa tus datos para registrarte en el sistema"
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Campos base */}
                        {/* <div className="space-y-2">
                            <Label htmlFor="nombre">Nombre</Label>
                            <Input
                                id="nombre"
                                name="nombre"
                                type="text"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="apellido">Apellido</Label>
                            <Input
                                id="apellido"
                                name="apellido"
                                type="text"
                                value={formData.apellido}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="telefono">Teléfono</Label>
                            <Input
                                id="telefono"
                                name="telefono"
                                type="text"
                                value={formData.telefono}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div> */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Botón enviar */}
                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90"
                            disabled={loading}
                        >
                            {loading
                                ? "Registrando..."
                                : "Registrarse"}
                        </Button>

                        {/* Volver al login */}
                        <div className="text-center space-y-2">
                            <p className="text-sm text-muted-foreground">
                                ¿Ya tienes cuenta?{" "}
                                <Link
                                    href="/login"
                                    className="text-primary hover:text-primary/80 transition-colors font-medium"
                                >
                                    Inicia sesión aquí
                                </Link>
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}
