import Link from "next/link"
import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    LogIn,
    UserPlus,
    ShoppingCart,
    FileText,
    Tag,
    Package,
    BarChart3,
    ArrowRight,
    Users,
    User,
    Layers,
    Truck,
    UserCircle,
} from "lucide-react"
import WithAuth from "@/components/auth/withAuth"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const dashboardCards = [
    // {
    //     title: "Iniciar Sesión",
    //     description: "Accede a tu cuenta del sistema",
    //     icon: LogIn,
    //     href: "/auth/login",
    //     color: "text-blue-600 dark:text-blue-400",
    // },
    // {
    //     title: "Crear Cuenta",
    //     description: "Registra un nuevo usuario",
    //     icon: UserPlus,
    //     href: "/auth/register",
    //     color: "text-green-600 dark:text-green-400",
    // },
    {
        title: "Mi Perfil",
        description: "Ver y editar mis datos personales",
        icon: User,
        href: "/perfil",
        color: "text-violet-600 dark:text-violet-400",
    },
    {
        title: "Registrar Venta",
        description: "Carga una nueva venta al sistema",
        icon: ShoppingCart,
        href: "/ventas/registrar",
        color: "text-purple-600 dark:text-purple-400",
    },
    {
        title: "Consultar Ventas",
        description: "Visualiza y gestiona las ventas",
        icon: FileText,
        href: "/ventas/consultar",
        color: "text-indigo-600 dark:text-indigo-400",
    },
    {
        title: "Registrar Cliente",
        description: "Añade un nuevo cliente",
        icon: UserCircle,
        href: "/clientes/registrar",
        color: "text-rose-600 dark:text-rose-400",
    },
    {
        title: "Consultar Clientes",
        description: "Administra los clientes registrados",
        icon: Users,
        href: "/clientes/consultar",
        color: "text-fuchsia-600 dark:text-fuchsia-400",
    },
    {
        title: "Registrar Marca",
        description: "Añade una nueva marca",
        icon: Tag,
        href: "/marcas/registrar",
        color: "text-pink-600 dark:text-pink-400",
    },
    {
        title: "Consultar Marcas",
        description: "Administra las marcas registradas",
        icon: FileText,
        href: "/marcas/consultar",
        color: "text-orange-600 dark:text-orange-400",
    },
    {
        title: "Registrar Línea",
        description: "Añade una nueva línea/categoría",
        icon: Layers,
        href: "/lineas/registrar",
        color: "text-amber-600 dark:text-amber-400",
    },
    {
        title: "Consultar Líneas",
        description: "Administra las líneas registradas",
        icon: Layers,
        href: "/lineas/consultar",
        color: "text-yellow-600 dark:text-yellow-400",
    },
    {
        title: "Registrar Producto",
        description: "Añade un nuevo producto",
        icon: Package,
        href: "/productos/registrar",
        color: "text-teal-600 dark:text-teal-400",
    },
    {
        title: "Consultar Productos",
        description: "Administra los productos registrados",
        icon: Package,
        href: "/productos/consultar",
        color: "text-cyan-600 dark:text-cyan-400",
    },
    {
        title: "Registrar Proveedor",
        description: "Añade un nuevo proveedor",
        icon: Truck,
        href: "/proveedores/registrar",
        color: "text-sky-600 dark:text-sky-400",
    },
    {
        title: "Consultar Proveedores",
        description: "Administra los proveedores registrados",
        icon: Truck,
        href: "/proveedores/consultar",
        color: "text-blue-600 dark:text-blue-400",
    },
    // {
    //     title: "Registrar Usuario",
    //     description: "Añade un nuevo empleado al sistema",
    //     icon: UserPlus,
    //     href: "/usuarios/registrar",
    //     color: "text-emerald-600 dark:text-emerald-400",
    // },
    {
        title: "Consultar Usuarios",
        description: "Administra los usuarios del sistema",
        icon: Users,
        href: "/usuarios/consultar",
        color: "text-lime-600 dark:text-lime-400",
    },
    {
        title: "Estadísticas",
        description: "Visualiza reportes y métricas",
        icon: BarChart3,
        href: "/estadisticas",
        color: "text-red-600 dark:text-red-400",
    },
]

export default async function DashboardPage() {

    const cookieStore = cookies();

    // Verifico si existe la cookie de sesión
    const isLoggedIn = (await cookieStore).has("access_token");

    // Si está logueado => dashboard
    if (!isLoggedIn) {
        redirect("/login");
    }
    return (
        <WithAuth>
            <div className="min-h-screen bg-background">
                <AppHeader />
                <main className="container mx-auto px-6 py-12">
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl font-bold mb-4 text-balance">Bienvenido al Sistema de Gestión</h1>
                        <p className="text-lg text-muted-foreground text-pretty">Selecciona una opción para comenzar</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        {dashboardCards.map((card) => {
                            const Icon = card.icon
                            return (
                                <Link
                                    key={card.href}
                                    href={card.href}
                                    className="group block"
                                >
                                    <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer">
                                        <CardHeader>
                                            <div className={`mb-4 ${card.color}`}>
                                                <Icon className="h-12 w-12" />
                                            </div>
                                            <CardTitle className="text-xl">{card.title}</CardTitle>
                                            <CardDescription className="">{card.description}</CardDescription>
                                        </CardHeader>
                                    </Card>
                                </Link>
                            )
                        })}
                    </div>

                </main>
            </div>
        </WithAuth>
    )
}
