// Servicio de API - Preparado para conectar con backend
// Por ahora usa mock data, reemplazar con fetch/axios cuando esté el backend

import {
  mockMarcas,
  mockLineas,
  mockProveedores,
  mockProductos,
  mockClientes,
  mockFormasPago,
  mockVentas,
  mockUsuarioActual,
  type Marca,
  type Linea,
  type Proveedor,
  type Producto,
  type Cliente,
  type FormaPago,
  type Venta,
  type Usuario,
} from "./mock-data"

// ============= MARCAS =============

export async function getMarcas(): Promise<Marca[]> {
  // TODO: Reemplazar con: return fetch('/api/marcas').then(res => res.json())
  return Promise.resolve(mockMarcas)
}

export async function getMarcaById(id: string): Promise<Marca | undefined> {
  // TODO: Reemplazar con: return fetch(`/api/marcas/${id}`).then(res => res.json())
  return Promise.resolve(mockMarcas.find((m) => m.id === id))
}

export async function createMarca(marca: Omit<Marca, "id">): Promise<Marca> {
  // TODO: Reemplazar con: return fetch('/api/marcas', { method: 'POST', body: JSON.stringify(marca) })
  console.log("Crear marca:", marca)
  return Promise.resolve({ ...marca, id: Date.now().toString() })
}

export async function updateMarca(id: string, marca: Partial<Marca>): Promise<Marca> {
  // TODO: Reemplazar con: return fetch(`/api/marcas/${id}`, { method: 'PUT', body: JSON.stringify(marca) })
  console.log("Actualizar marca:", id, marca)
  return Promise.resolve({ ...mockMarcas[0], ...marca, id })
}

export async function deleteMarca(id: string): Promise<void> {
  // TODO: Reemplazar con: return fetch(`/api/marcas/${id}`, { method: 'DELETE' })
  console.log("Eliminar marca:", id)
  return Promise.resolve()
}

// ============= LÍNEAS =============

export async function getLineas(): Promise<Linea[]> {
  // TODO: Reemplazar con: return fetch('/api/lineas').then(res => res.json())
  return Promise.resolve(mockLineas)
}

export async function getLineasByMarca(marcaId: string): Promise<Linea[]> {
  // TODO: Reemplazar con: return fetch(`/api/lineas?marcaId=${marcaId}`).then(res => res.json())
  return Promise.resolve(mockLineas.filter((l) => l.marcaId === marcaId))
}

export async function getLineaById(id: string): Promise<Linea | undefined> {
  // TODO: Reemplazar con: return fetch(`/api/lineas/${id}`).then(res => res.json())
  return Promise.resolve(mockLineas.find((l) => l.id === id))
}

export async function createLinea(linea: Omit<Linea, "id">): Promise<Linea> {
  // TODO: Reemplazar con: return fetch('/api/lineas', { method: 'POST', body: JSON.stringify(linea) })
  console.log("Crear línea:", linea)
  return Promise.resolve({ ...linea, id: Date.now().toString() })
}

export async function updateLinea(id: string, linea: Partial<Linea>): Promise<Linea> {
  // TODO: Reemplazar con: return fetch(`/api/lineas/${id}`, { method: 'PUT', body: JSON.stringify(linea) })
  console.log("Actualizar línea:", id, linea)
  return Promise.resolve({ ...mockLineas[0], ...linea, id })
}

export async function deleteLinea(id: string): Promise<void> {
  // TODO: Reemplazar con: return fetch(`/api/lineas/${id}`, { method: 'DELETE' })
  console.log("Eliminar línea:", id)
  return Promise.resolve()
}

// ============= PROVEEDORES =============

export async function getProveedores(): Promise<Proveedor[]> {
  // TODO: Reemplazar con: return fetch('/api/proveedores').then(res => res.json())
  return Promise.resolve(mockProveedores)
}

export async function getProveedorById(id: string): Promise<Proveedor | undefined> {
  // TODO: Reemplazar con: return fetch(`/api/proveedores/${id}`).then(res => res.json())
  return Promise.resolve(mockProveedores.find((p) => p.id === id))
}

export async function createProveedor(proveedor: Omit<Proveedor, "id">): Promise<Proveedor> {
  // TODO: Reemplazar con: return fetch('/api/proveedores', { method: 'POST', body: JSON.stringify(proveedor) })
  console.log("Crear proveedor:", proveedor)
  return Promise.resolve({ ...proveedor, id: Date.now().toString() })
}

export async function updateProveedor(id: string, proveedor: Partial<Proveedor>): Promise<Proveedor> {
  // TODO: Reemplazar con: return fetch(`/api/proveedores/${id}`, { method: 'PUT', body: JSON.stringify(proveedor) })
  console.log("Actualizar proveedor:", id, proveedor)
  return Promise.resolve({ ...mockProveedores[0], ...proveedor, id })
}

export async function deleteProveedor(id: string): Promise<void> {
  // TODO: Reemplazar con: return fetch(`/api/proveedores/${id}`, { method: 'DELETE' })
  console.log("Eliminar proveedor:", id)
  return Promise.resolve()
}

// ============= PRODUCTOS =============

export async function getProductos(): Promise<Producto[]> {
  // TODO: Reemplazar con: return fetch('/api/productos').then(res => res.json())
  return Promise.resolve(mockProductos)
}

export async function getProductoById(id: string): Promise<Producto | undefined> {
  // TODO: Reemplazar con: return fetch(`/api/productos/${id}`).then(res => res.json())
  return Promise.resolve(mockProductos.find((p) => p.id === id))
}

export async function createProducto(producto: Omit<Producto, "id" | "codigo">): Promise<Producto> {
  // TODO: Reemplazar con: return fetch('/api/productos', { method: 'POST', body: JSON.stringify(producto) })
  console.log("Crear producto:", producto)
  const codigo = `110233${Date.now().toString().slice(-6)}`
  return Promise.resolve({ ...producto, id: Date.now().toString(), codigo })
}

export async function updateProducto(id: string, producto: Partial<Producto>): Promise<Producto> {
  // TODO: Reemplazar con: return fetch(`/api/productos/${id}`, { method: 'PUT', body: JSON.stringify(producto) })
  console.log("Actualizar producto:", id, producto)
  return Promise.resolve({ ...mockProductos[0], ...producto, id })
}

export async function deleteProducto(id: string): Promise<void> {
  // TODO: Reemplazar con: return fetch(`/api/productos/${id}`, { method: 'DELETE' })
  console.log("Eliminar producto:", id)
  return Promise.resolve()
}

// ============= CLIENTES =============

export async function getClientes(): Promise<Cliente[]> {
  // TODO: Reemplazar con: return fetch('/api/clientes').then(res => res.json())
  return Promise.resolve(mockClientes)
}

export async function getClienteById(id: string): Promise<Cliente | undefined> {
  // TODO: Reemplazar con: return fetch(`/api/clientes/${id}`).then(res => res.json())
  return Promise.resolve(mockClientes.find((c) => c.id === id))
}

export async function createCliente(cliente: Omit<Cliente, "id" | "createdAt" | "updatedAt">): Promise<Cliente> {
  // TODO: Reemplazar con: return fetch('/api/clientes', { method: 'POST', body: JSON.stringify(cliente) })
  console.log("Crear cliente:", cliente)
  const now = new Date()
  return Promise.resolve({ ...cliente, id: Date.now().toString(), createdAt: now, updatedAt: now })
}

export async function updateCliente(id: string, cliente: Partial<Cliente>): Promise<Cliente> {
  // TODO: Reemplazar con: return fetch(`/api/clientes/${id}`, { method: 'PUT', body: JSON.stringify(cliente) })
  console.log("Actualizar cliente:", id, cliente)
  return Promise.resolve({ ...mockClientes[0], ...cliente, id, updatedAt: new Date() })
}

export async function deleteCliente(id: string): Promise<void> {
  // TODO: Reemplazar con: return fetch(`/api/clientes/${id}`, { method: 'DELETE' })
  console.log("Eliminar cliente:", id)
  return Promise.resolve()
}

// ============= FORMAS DE PAGO =============

export async function getFormasPago(): Promise<FormaPago[]> {
  // TODO: Reemplazar con: return fetch('/api/formas-pago').then(res => res.json())
  return Promise.resolve(mockFormasPago)
}

// ============= VENTAS =============

export async function getVentas(): Promise<Venta[]> {
  // TODO: Reemplazar con: return fetch('/api/ventas').then(res => res.json())
  return Promise.resolve(mockVentas)
}

export async function getVentaById(id: string): Promise<Venta | undefined> {
  // TODO: Reemplazar con: return fetch(`/api/ventas/${id}`).then(res => res.json())
  return Promise.resolve(mockVentas.find((v) => v.id === id))
}

export async function createVenta(venta: Omit<Venta, "id" | "createdAt" | "updatedAt">): Promise<Venta> {
  // TODO: Reemplazar con: return fetch('/api/ventas', { method: 'POST', body: JSON.stringify(venta) })
  console.log("Crear venta:", venta)
  const now = new Date()
  return Promise.resolve({ ...venta, id: Date.now().toString(), createdAt: now, updatedAt: now })
}

export async function updateVenta(id: string, venta: Partial<Venta>): Promise<Venta> {
  // TODO: Reemplazar con: return fetch(`/api/ventas/${id}`, { method: 'PUT', body: JSON.stringify(venta) })
  console.log("Actualizar venta:", id, venta)
  return Promise.resolve({ ...mockVentas[0], ...venta, id, updatedAt: new Date() })
}

export async function deleteVenta(id: string): Promise<void> {
  // TODO: Reemplazar con: return fetch(`/api/ventas/${id}`, { method: 'DELETE' })
  console.log("Eliminar venta:", id)
  return Promise.resolve()
}

// ============= USUARIO ACTUAL =============

export async function getUsuarioActual(): Promise<Usuario> {
  // TODO: Reemplazar con: return fetch('/api/auth/me').then(res => res.json())
  return Promise.resolve(mockUsuarioActual)
}

export async function updateUsuarioActual(usuario: Partial<Usuario>): Promise<Usuario> {
  // TODO: Reemplazar con: return fetch('/api/auth/me', { method: 'PUT', body: JSON.stringify(usuario) })
  console.log("Actualizar usuario actual:", usuario)
  return Promise.resolve({ ...mockUsuarioActual, ...usuario })
}
