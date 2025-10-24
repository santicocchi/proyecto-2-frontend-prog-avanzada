// Servicio de API - Conectado con backend
// Configuración base de la API
const API_BASE_URL = "http://localhost:3001"

import api from "@/services/api"

// ============= TIPOS =============

export interface Marca {
  id: number
  nombre: string
  lineas?: Linea[]
}

export interface Linea {
  id: number
  nombre: string
}

export interface CreateMarcaDto {
  nombre: string
  lineas?: number[]
}

export interface CreateLineaDto {
  nombre: string
}

export interface CreateProveedorDto {
  nombre: string
  direccion: string
  cuit: string
}

export interface ProveedorBackend {
  id: number
  nombre: string
  cuit: string
  direccion?: string // Agregando direccion opcional
  createdAt?: string
  updatedAt?: string
}

export interface Cliente {
  id: number
  nombre: string
  apellido: string
  tipo_documento: string
  num_documento: string
  telefono: string
  createdAt: string
  updatedAt: string
}

export interface CreateClienteDto {
  nombre: string
  apellido: string
  num_documento: string
  telefono: string
  tipo_documento: number // 1 para DNI, etc.
}

export interface ProductoBackend {
  id: number
  nombre: string
  descripcion: string
  precio_sin_impuesto: string
  precio_con_impuesto: number // Agregando precio_con_impuesto para mostrar en selección de productos
  impuesto?: number // Agregando impuesto opcional para detalles
  stock: number
  marca:
    | {
        id: number
        nombre: string
      }
    | string // Puede ser objeto o string según el endpoint
  linea:
    | {
        id: number
        nombre: string
      }
    | string // Puede ser objeto o string según el endpoint
  proveedores?: Array<{
    // Agregando proveedores para detalles
    nombre: string
    precio_proveedor: string
    codigo_proveedor: string
  }>
  createdAt?: string
  updatedAt?: string
}

export interface CreateProductoDto {
  nombre: string
  descripcion: string
  precio: number
  stock: number
  marcaId: number
  lineaId: number
}

export interface Usuario {
  id: number
  email: string
  password: string
  role: Array<{
    id: number
    name: string
    permissionCodes: Array<{
      id: number
      name: string
    }>
  }>
}

export interface FormaPago {
  id: number
  nombre: string
}

export interface VentaListItem {
  id: number
  fecha: string
  cliente: string
  responsable: string
  formaPago: string
  total: number
}

export interface DetalleVentaDetallado {
  producto: string
  descripcion: string
  precio_sin_impuesto: string
  impuesto: number
  precio_impuesto: number
  cantidad: number
  subtotal: string
}

export interface VentaDetallada {
  id: number
  fecha: string
  cliente: string
  documento: string
  telefono_cliente: string
  responsable: string
  formaPago: string
  detallesVenta: DetalleVentaDetallado[]
  total: number
  createdAt: string
  updatedAt: string
}

export interface CreateVentaDto {
  fecha_venta: string // ISO date string
  clienteId: number
  formaPagoId: number
  userId: number
  detallesVenta: Array<{
    productoId: number
    cantidad: number
  }>
}

export interface LineaDetallada {
  id: number
  nombre: string
  marcas: Array<{
    id: number
    nombre: string
  }>
  createdAt: string
  updatedAt: string
}

export interface AsociarProveedorProductoDto {
  proveedorId: number
  productoId: number
  precio_proveedor: number
  codigo_proveedor: string
}

export interface AsignarLineaMarcaDto {
  lineaId: number
}

export interface FindAdvancedProductoDto {
  marcaId: number | null
  proveedorId: number | null
  lineaId: number | null
  stockDesde: number | null
  stockHasta: number | null
  precioDesde: number | null
  precioHasta: number | null
  codigoProveedor: string | null
  take: number | null
  page: number | null
}

export interface ProductosAdvancedResponse {
  total: number
  data: ProductoBackend[]
}

export interface FindAdvancedVentaDto {
  clienteId: number | null
  formaPagoId: number | null
  userId: number | null
  total: number | null
  take: number | null
  page: number | null
}

export interface VentasAdvancedResponse {
  total: number
  data: VentaListItem[]
}

// ============= MARCAS =============

export async function getMarcas(): Promise<Marca[]> {
  try {
    const response = await api.get("/marca")
    return response.data
  } catch (error) {
    console.error("Error en getMarcas:", error)
    throw error
  }
}

export async function getMarcaById(id: string): Promise<Marca | undefined> {
  try {
    const response = await api.get(`/marca/${id}`)
    return response.data
  } catch (error) {
    console.error("Error en getMarcaById:", error)
    throw error
  }
}

export async function createMarca(marca: CreateMarcaDto): Promise<Marca> {
  try {
    const response = await api.post("/marca", marca)
    return response.data
  } catch (error) {
    console.error("Error en createMarca:", error)
    throw error
  }
}

export async function updateMarca(id: string, marca: Partial<CreateMarcaDto>): Promise<Marca> {
  try {
    const response = await api.patch(`/marca/${id}`, marca) // Cambiando updateMarca a PATCH en lugar de PUT
    return response.data
  } catch (error) {
    console.error("Error en updateMarca:", error)
    throw error
  }
}

export async function deleteMarca(id: string): Promise<void> {
  try {
    await api.delete(`/marca/${id}`)
  } catch (error) {
    console.error("Error en deleteMarca:", error)
    throw error
  }
}

export async function asignarLineaMarca(marcaId: string, lineaId: number): Promise<{ message: string }> {
  try {
    const response = await api.post(`/marca/${marcaId}/assign-linea`, { lineaId })
    return response.data
  } catch (error) {
    console.error("Error en asignarLineaMarca:", error)
    throw error
  }
}

// ============= LÍNEAS =============

export async function getLineas(): Promise<Linea[]> {
  try {
    const response = await api.get("/linea")
    return response.data
  } catch (error) {
    console.error("Error en getLineas:", error)
    throw error
  }
}

export async function getLineasByMarca(marcaId: number): Promise<Linea[]> {
  try {
    const response = await api.get(`/linea`, { params: { marcaId } })
    return response.data
  } catch (error) {
    console.error("Error en getLineasByMarca:", error)
    throw error
  }
}

export async function getLineaById(id: string): Promise<LineaDetallada | undefined> {
  try {
    const response = await api.get(`/linea/${id}`)
    return response.data
  } catch (error) {
    console.error("Error en getLineaById:", error)
    throw error
  }
}

export async function createLinea(linea: CreateLineaDto): Promise<Linea> {
  try {
    const response = await api.post("/linea", linea)
    return response.data
  } catch (error) {
    console.error("Error en createLinea:", error)
    throw error
  }
}

export async function updateLinea(id: string, linea: Partial<CreateLineaDto>): Promise<Linea> {
  try {
    const response = await api.patch(`/linea/${id}`, linea) // Cambiando updateLinea a PATCH en lugar de PUT
    return response.data
  } catch (error) {
    console.error("Error en updateLinea:", error)
    throw error
  }
}

export async function deleteLinea(id: string): Promise<void> {
  try {
    await api.delete(`/linea/${id}`)
  } catch (error) {
    console.error("Error en deleteLinea:", error)
    throw error
  }
}

// ============= PROVEEDORES =============

export async function getProveedores(): Promise<ProveedorBackend[]> {
  try {
    const response = await api.get("/proveedor")
    return response.data
  } catch (error) {
    console.error("Error en getProveedores:", error)
    throw error
  }
}

export async function getProveedorById(id: string): Promise<ProveedorBackend | undefined> {
  try {
    const response = await api.get(`/proveedor/${id}`)
    return response.data
  } catch (error) {
    console.error("Error en getProveedorById:", error)
    throw error
  }
}

export async function createProveedor(proveedor: CreateProveedorDto): Promise<ProveedorBackend> {
  try {
    const response = await api.post("/proveedor", proveedor)
    return response.data
  } catch (error) {
    console.error("Error en createProveedor:", error)
    throw error
  }
}

export async function updateProveedor(id: string, proveedor: Partial<CreateProveedorDto>): Promise<ProveedorBackend> {
  try {
    const response = await api.patch(`/proveedor/${id}`, proveedor) // Cambiando a PATCH
    return response.data
  } catch (error) {
    console.error("Error en updateProveedor:", error)
    throw error
  }
}

export async function deleteProveedor(id: string): Promise<void> {
  try {
    await api.delete(`/proveedor/${id}`)
  } catch (error) {
    console.error("Error en deleteProveedor:", error)
    throw error
  }
}

// ============= PRODUCTOS =============

export async function getProductos(): Promise<ProductoBackend[]> {
  try {
    const response = await api.get("/producto")
    return response.data
  } catch (error) {
    console.error("Error en getProductos:", error)
    throw error
  }
}

export async function getProductoById(id: string): Promise<ProductoBackend | undefined> {
  try {
    const response = await api.get(`/producto/${id}`)
    return response.data
  } catch (error) {
    console.error("Error en getProductoById:", error)
    throw error
  }
}

export async function createProducto(producto: CreateProductoDto): Promise<ProductoBackend> {
  try {
    const response = await api.post("/producto", producto)
    return response.data
  } catch (error) {
    console.error("Error en createProducto:", error)
    throw error
  }
}

export async function updateProducto(id: string, producto: Partial<CreateProductoDto>): Promise<ProductoBackend> {
  try {
    const response = await api.patch(`/producto/${id}`, producto) // Cambiando a PATCH
    return response.data
  } catch (error) {
    console.error("Error en updateProducto:", error)
    throw error
  }
}

export async function deleteProducto(id: string): Promise<void> {
  try {
    await api.delete(`/producto/${id}`)
  } catch (error) {
    console.error("Error en deleteProducto:", error)
    throw error
  }
}

export async function getProductosAdvanced(filters: FindAdvancedProductoDto): Promise<ProductosAdvancedResponse> {
  try {
    const params: any = {}
    if (filters.codigoProveedor) params.codigoProveedor = filters.codigoProveedor
    if (filters.proveedorId) params.proveedorId = filters.proveedorId
    if (filters.lineaId) params.lineaId = filters.lineaId
    if (filters.marcaId) params.marcaId = filters.marcaId
    if (filters.precioDesde) params.precioDesde = filters.precioDesde
    if (filters.precioHasta) params.precioHasta = filters.precioHasta
    if (filters.stockDesde) params.stockDesde = filters.stockDesde
    if (filters.stockHasta) params.stockHasta = filters.stockHasta
    if (filters.take) params.take = filters.take
    if (filters.page) params.page = filters.page
    const response = await api.get("/producto/advanced", { params: params })
    return response.data
  } catch (error) {
    console.error("Error en getProductosAdvanced:", error)
    throw error
  }
}

// ============= CLIENTES =============

export async function getClientes(): Promise<{data:Cliente[], total:number}> {
  try {
    const response = await api.get("/cliente")
    if (!response.data) {
      return { data: [], total: 0 }
    }
    return response.data
  } catch (error) {
    console.error("Error en getClientes:", error)
    throw error
  }
}

export async function getClienteById(id: string): Promise<Cliente | undefined> {
  try {
    const response = await api.get(`/cliente/${id}`)
    return response.data
  } catch (error) {
    console.error("Error en getClienteById:", error)
    throw error
  }
}

export async function createCliente(cliente: CreateClienteDto): Promise<Cliente> {
  try {
    const response = await api.post("/cliente", cliente)
    return response.data
  } catch (error) {
    console.error("Error en createCliente:", error)
    throw error
  }
}

export async function updateCliente(id: string, cliente: Partial<CreateClienteDto>): Promise<Cliente> {
  try {
    const response = await api.patch(`/cliente/${id}`, cliente) // Cambiando updateCliente a PATCH en lugar de PUT
    return response.data
  } catch (error) {
    console.error("Error en updateCliente:", error)
    throw error
  }
}

export async function deleteCliente(id: string): Promise<void> {
  try {
    await api.delete(`/cliente/${id}`)
  } catch (error) {
    console.error("Error en deleteCliente:", error)
    throw error
  }
}

// ============= USUARIOS =============

export async function getUsuarios(): Promise<Usuario[]> {
  try {
    const response = await api.get("/users")
    return response.data
  } catch (error) {
    console.error("Error en getUsuarios:", error)
    throw error
  }
}

export async function getUsuarioById(id: string): Promise<Usuario | undefined> {
  try {
    const response = await api.get(`/users/${id}`)
    return response.data
  } catch (error) {
    console.error("Error en getUsuarioById:", error)
    throw error
  }
}

export async function updateUsuario(usuario: Partial<Usuario>): Promise<Usuario> {
  try {
    const response = await api.put(`/users/${usuario.id}`, usuario)
    return response.data
  } catch (error) {
    console.error("Error en updateUsuario:", error)
    throw error
  }
}

export async function getUsuarioActual(): Promise<Usuario | null> {
  try {
    // Asumiendo que hay un endpoint para obtener el usuario actual
    const response = await api.get("/users/me")
    return response.data
  } catch (error) {
    console.error("Error en getUsuarioActual:", error)
    return null
  }
}

export async function updateUsuarioActual(usuario: Partial<Usuario>): Promise<Usuario> {
  try {
    const response = await api.put("/users/me", usuario)
    return response.data
  } catch (error) {
    console.error("Error en updateUsuarioActual:", error)
    throw error
  }
}

// ============= FORMAS DE PAGO =============

export async function getFormasPago(): Promise<FormaPago[]> {
  try {
    const response = await api.get("/forma-pago")
    return response.data
  } catch (error) {
    console.error("Error en getFormasPago:", error)
    throw error
  }
}

// ============= VENTAS =============

export async function getVentas(): Promise<VentaListItem[]> {
  try {
    const response = await api.get("/venta")
    return response.data
  } catch (error) {
    console.error("Error en getVentas:", error)
    throw error
  }
}

export async function getVentasAdvanced(filters: FindAdvancedVentaDto): Promise<VentasAdvancedResponse> {
  try {
    const params: any = {}
    if (filters.clienteId) params.clienteId = filters.clienteId
    if (filters.formaPagoId) params.formaPagoId = filters.formaPagoId
    if (filters.userId) params.userId = filters.userId
    if (filters.total) params.total = filters.total
    if (filters.take) params.take = filters.take
    if (filters.page) params.page = filters.page

    const response = await api.get("/venta/advanced", { params })
    return response.data
  } catch (error) {
    console.error("Error en getVentasAdvanced:", error)
    throw error
  }
}

export async function getVentaById(id: number): Promise<VentaDetallada> {
  try {
    const response = await api.get(`/venta/${id}`)
    return response.data
  } catch (error) {
    console.error("Error en getVentaById:", error)
    throw error
  }
}

export async function createVenta(venta: CreateVentaDto): Promise<any> {
  try {
    const response = await api.post("/venta", venta)
    return response.data
  } catch (error) {
    console.error("Error en createVenta:", error)
    throw error
  }
}

export async function updateVenta(id: number, venta: Partial<CreateVentaDto>): Promise<any> {
  try {
    const response = await api.put(`/venta/${id}`, venta)
    return response.data
  } catch (error) {
    console.error("Error en updateVenta:", error)
    throw error
  }
}

export async function deleteVenta(id: number): Promise<void> {
  try {
    await api.delete(`/venta/${id}`)
  } catch (error) {
    console.error("Error en deleteVenta:", error)
    throw error
  }
}

export async function asociarProveedorProducto(data: AsociarProveedorProductoDto): Promise<any> {
  try {
    const response = await api.post("/proveedor-x-producto", data)
    return response.data
  } catch (error) {
    console.error("Error en asociarProveedorProducto:", error)
    throw error
  }
}
