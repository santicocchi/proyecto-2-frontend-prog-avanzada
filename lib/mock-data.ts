// Mock data para desarrollo - Reemplazar con llamadas a API reales

export interface Marca {
  id: string
  nombre: string
  email: string
  descripcion: string
  logo?: string
}

export interface Linea {
  id: string
  marcaId: string
  nombre: string
  descripcion: string
}

export interface Proveedor {
  id: string
  nombre: string
  descripcion: string
}

export interface Producto {
  id: string
  codigo: string
  nombre: string
  descripcion: string
  imagen?: string
  marcaId: string
  lineaId: string
  proveedorId: string
  precio: number
  stock: number
}

export const mockMarcas: Marca[] = [
  {
    id: "1",
    nombre: "Nike",
    email: "contacto@nike.com",
    descripcion: "Marca deportiva líder mundial en calzado y ropa deportiva",
    logo: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "2",
    nombre: "Adidas",
    email: "info@adidas.com",
    descripcion: "Marca alemana de ropa y accesorios deportivos",
    logo: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "3",
    nombre: "Puma",
    email: "contacto@puma.com",
    descripcion: "Empresa multinacional alemana de ropa y calzado deportivo",
    logo: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "4",
    nombre: "Reebok",
    email: "info@reebok.com",
    descripcion: "Marca británica de calzado y ropa deportiva",
    logo: "/placeholder.svg?height=100&width=100",
  },
]

export const mockLineas: Linea[] = [
  {
    id: "1",
    marcaId: "1",
    nombre: "Running",
    descripcion: "Línea especializada en calzado y ropa para correr",
  },
  {
    id: "2",
    marcaId: "1",
    nombre: "Basketball",
    descripcion: "Productos diseñados para básquetbol profesional",
  },
  {
    id: "3",
    marcaId: "1",
    nombre: "Training",
    descripcion: "Equipamiento para entrenamiento general y gimnasio",
  },
  {
    id: "4",
    marcaId: "2",
    nombre: "Originals",
    descripcion: "Línea clásica con diseños icónicos de Adidas",
  },
  {
    id: "5",
    marcaId: "2",
    nombre: "Performance",
    descripcion: "Productos de alto rendimiento para atletas",
  },
  {
    id: "6",
    marcaId: "3",
    nombre: "Motorsport",
    descripcion: "Colección inspirada en deportes de motor",
  },
  {
    id: "7",
    marcaId: "3",
    nombre: "Training",
    descripcion: "Línea para entrenamiento y fitness",
  },
  {
    id: "8",
    marcaId: "4",
    nombre: "Classic",
    descripcion: "Diseños clásicos y atemporales de Reebok",
  },
]

export const mockProveedores: Proveedor[] = [
  {
    id: "1",
    nombre: "Distribuidora Deportiva SA",
    descripcion: "Proveedor mayorista de artículos deportivos con 20 años de experiencia",
  },
  {
    id: "2",
    nombre: "Importadora Global",
    descripcion: "Importación directa de marcas internacionales",
  },
  {
    id: "3",
    nombre: "Textiles y Calzados SRL",
    descripcion: "Especialistas en textiles deportivos y calzado",
  },
  {
    id: "4",
    nombre: "Accesorios Pro",
    descripcion: "Proveedor de accesorios y complementos deportivos",
  },
]

export const mockProductos: Producto[] = [
  {
    id: "1",
    codigo: "110233020013",
    nombre: "Zapatilla Air Max 2024",
    descripcion: "Zapatilla de running con tecnología Air Max",
    imagen: "/placeholder.svg?height=100&width=100",
    marcaId: "1",
    lineaId: "1",
    proveedorId: "1",
    precio: 3333,
    stock: 15,
  },
  {
    id: "2",
    codigo: "110233020014",
    nombre: "Camiseta Dri-FIT",
    descripcion: "Camiseta deportiva con tecnología de secado rápido",
    marcaId: "1",
    lineaId: "3",
    proveedorId: "2",
    precio: 1500,
    stock: 30,
  },
  {
    id: "3",
    codigo: "110233020015",
    nombre: "Zapatilla Ultraboost",
    descripcion: "Zapatilla de running con tecnología Boost",
    marcaId: "2",
    lineaId: "5",
    proveedorId: "1",
    precio: 4200,
    stock: 12,
  },
  {
    id: "4",
    codigo: "110233020016",
    nombre: "Buzo Originals",
    descripcion: "Buzo clásico con logo bordado",
    marcaId: "2",
    lineaId: "4",
    proveedorId: "3",
    precio: 2800,
    stock: 20,
  },
  {
    id: "5",
    codigo: "110233020017",
    nombre: "Zapatilla RS-X",
    descripcion: "Zapatilla urbana con diseño retro",
    marcaId: "3",
    lineaId: "7",
    proveedorId: "1",
    precio: 3500,
    stock: 8,
  },
  {
    id: "6",
    codigo: "110233020018",
    nombre: "Short Training",
    descripcion: "Short deportivo para entrenamiento",
    marcaId: "4",
    lineaId: "8",
    proveedorId: "2",
    precio: 1200,
    stock: 25,
  },
  {
    id: "7",
    codigo: "110233020019",
    nombre: "Medias Deportivas Pack x3",
    descripcion: "Pack de 3 pares de medias deportivas",
    marcaId: "1",
    lineaId: "3",
    proveedorId: "4",
    precio: 800,
    stock: 50,
  },
]

export interface Cliente {
  id: string
  nombre: string
  apellido: string
  tipoDocumento: string
  numeroDocumento: string
  telefono: string
  createdAt: Date
  updatedAt: Date
}

export interface FormaPago {
  id: string
  nombre: string
  descripcion: string
}

export interface DetalleVenta {
  id: string
  cantidad: number
  subtotal: number
  productoId: string
  ventaId: string
  createdAt: Date
  updatedAt: Date
}

export interface Venta {
  id: string
  fechaVenta: Date
  total: number
  clienteId: string
  formaPagoId: string
  detallesVenta: DetalleVenta[]
  createdAt: Date
  updatedAt: Date
}

export interface Usuario {
  id: string
  email: string
  password: string
  rol: string
}

export const mockClientes: Cliente[] = [
  {
    id: "1",
    nombre: "Juan",
    apellido: "Pérez",
    tipoDocumento: "DNI",
    numeroDocumento: "12345678",
    telefono: "1123456789",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    nombre: "María",
    apellido: "González",
    tipoDocumento: "DNI",
    numeroDocumento: "23456789",
    telefono: "1134567890",
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10"),
  },
  {
    id: "3",
    nombre: "Carlos",
    apellido: "Rodríguez",
    tipoDocumento: "DNI",
    numeroDocumento: "34567890",
    telefono: "1145678901",
    createdAt: new Date("2024-03-05"),
    updatedAt: new Date("2024-03-05"),
  },
  {
    id: "4",
    nombre: "Ana",
    apellido: "Martínez",
    tipoDocumento: "DNI",
    numeroDocumento: "45678901",
    telefono: "1156789012",
    createdAt: new Date("2024-04-20"),
    updatedAt: new Date("2024-04-20"),
  },
]

export const mockFormasPago: FormaPago[] = [
  {
    id: "1",
    nombre: "Efectivo",
    descripcion: "Pago en efectivo",
  },
  {
    id: "2",
    nombre: "Tarjeta de Débito",
    descripcion: "Pago con tarjeta de débito",
  },
  {
    id: "3",
    nombre: "Tarjeta de Crédito",
    descripcion: "Pago con tarjeta de crédito",
  },
  {
    id: "4",
    nombre: "Transferencia",
    descripcion: "Transferencia bancaria",
  },
]

export const mockVentas: Venta[] = [
  {
    id: "1",
    fechaVenta: new Date("2024-10-01"),
    total: 6666,
    clienteId: "1",
    formaPagoId: "1",
    detallesVenta: [
      {
        id: "1",
        cantidad: 2,
        subtotal: 6666,
        productoId: "1",
        ventaId: "1",
        createdAt: new Date("2024-10-01"),
        updatedAt: new Date("2024-10-01"),
      },
    ],
    createdAt: new Date("2024-10-01"),
    updatedAt: new Date("2024-10-01"),
  },
  {
    id: "2",
    fechaVenta: new Date("2024-10-05"),
    total: 7000,
    clienteId: "2",
    formaPagoId: "2",
    detallesVenta: [
      {
        id: "2",
        cantidad: 1,
        subtotal: 4200,
        productoId: "3",
        ventaId: "2",
        createdAt: new Date("2024-10-05"),
        updatedAt: new Date("2024-10-05"),
      },
      {
        id: "3",
        cantidad: 1,
        subtotal: 2800,
        productoId: "4",
        ventaId: "2",
        createdAt: new Date("2024-10-05"),
        updatedAt: new Date("2024-10-05"),
      },
    ],
    createdAt: new Date("2024-10-05"),
    updatedAt: new Date("2024-10-05"),
  },
  {
    id: "3",
    fechaVenta: new Date("2024-10-10"),
    total: 3500,
    clienteId: "3",
    formaPagoId: "3",
    detallesVenta: [
      {
        id: "4",
        cantidad: 1,
        subtotal: 3500,
        productoId: "5",
        ventaId: "3",
        createdAt: new Date("2024-10-10"),
        updatedAt: new Date("2024-10-10"),
      },
    ],
    createdAt: new Date("2024-10-10"),
    updatedAt: new Date("2024-10-10"),
  },
]

export const mockUsuarioActual: Usuario = {
  id: "1",
  email: "admin@sistema.com",
  password: "********",
  rol: "Administrador",
}
