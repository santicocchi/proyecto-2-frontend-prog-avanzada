import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Home, LogIn } from "lucide-react"
import Link from "next/link"

export default function Page() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">Acceso No Autorizado</CardTitle>
                    <CardDescription className="text-gray-600">No tienes permisos para acceder a esta página</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-center">
                        <p className="text-sm text-gray-500 mb-6">
                            Tu sesión puede haber expirado o no tienes los permisos necesarios para ver este contenido.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button asChild className="w-full">
                            <Link href="/">
                                <Home className="mr-2 h-4 w-4" />
                                Volver al Inicio
                            </Link>
                        </Button>
                    </div>

                    <div className="text-center pt-4">
                        <p className="text-xs text-gray-400">Si crees que esto es un error, contacta al administrador</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
