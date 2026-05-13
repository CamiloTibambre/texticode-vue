// src/services/api.js
// Archivo para consumir la API desde Vue
// Colócalo en: texticode-vue/src/services/api.js

const BASE    = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
const API_KEY = 'texticode-2026'

async function request(url, options = {}) {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error en la API')
  return data
}

// Peticiones con API Key (para endpoints protegidos de eficiencia)
async function requestWithKey(url, options = {}) {
  const res = await fetch(`${BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.mensaje || data.error || 'Error en la API')
  return data
}

// ── USUARIOS ──────────────────────────────────────────────
export const getUsuarios        = ()         => request('/usuarios')
export const getUsuario         = (id)       => request(`/usuarios/${id}`)
export const loginUsuario       = (body)     => request('/usuarios/login', { method: 'POST', body: JSON.stringify(body) })
export const crearUsuario       = (body)     => request('/usuarios', { method: 'POST', body: JSON.stringify(body) })
export const actualizarUsuario  = (id, body) => request(`/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(body) })
export const eliminarUsuario    = (id)       => request(`/usuarios/${id}`, { method: 'DELETE' })

// ── MATERIALES ────────────────────────────────────────────
export const getMateriales       = ()         => request('/materiales')
export const getMaterial         = (id)       => request(`/materiales/${id}`)
export const getStockBajo        = ()         => request('/materiales/alertas/stock-bajo')
export const crearMaterial       = (body)     => request('/materiales', { method: 'POST', body: JSON.stringify(body) })
export const actualizarMaterial  = (id, body) => request(`/materiales/${id}`, { method: 'PUT', body: JSON.stringify(body) })
export const eliminarMaterial    = (id)       => request(`/materiales/${id}`, { method: 'DELETE' })

// ── ÓRDENES DE PRODUCCIÓN ─────────────────────────────────
export const getOrdenes           = ()         => request('/ordenes')
export const getOrden             = (id)       => request(`/ordenes/${id}`)
export const getOrdenesByEstado   = (estado)   => request(`/ordenes/estado/${encodeURIComponent(estado)}`)
export const getOrdenesDeOperario = (id)       => request(`/ordenes/operario/${id}`)
export const getOrdenesDeCliente  = (id)       => request(`/ordenes/cliente/${id}`)
export const crearOrden           = (body)     => request('/ordenes', { method: 'POST', body: JSON.stringify(body) })
export const actualizarOrden      = (id, body) => request(`/ordenes/${id}`, { method: 'PUT', body: JSON.stringify(body) })
export const eliminarOrden        = (id)       => request(`/ordenes/${id}`, { method: 'DELETE' })

// ── COMPROBANTES ──────────────────────────────────────────
export const getComprobantes           = ()          => request('/comprobantes')
export const getComprobantesPorCliente = (idCliente) => request(`/comprobantes/cliente/${idCliente}`)
export const getComprobante            = (id)        => request(`/comprobantes/${id}`)
export const crearComprobante          = (body)      => request('/comprobantes', { method: 'POST', body: JSON.stringify(body) })
export const actualizarComprobante     = (id, body)  => request(`/comprobantes/${id}`, { method: 'PUT', body: JSON.stringify(body) })
export const eliminarComprobante       = (id)        => request(`/comprobantes/${id}`, { method: 'DELETE' })

// ── ROLES ─────────────────────────────────────────────────
export const getRoles    = ()         => request('/roles')
export const getRol      = (id)       => request(`/roles/${id}`)
export const crearRol    = (body)     => request('/roles', { method: 'POST', body: JSON.stringify(body) })
export const eliminarRol = (id)       => request(`/roles/${id}`, { method: 'DELETE' })

// ── ORDEN MATERIAL ────────────────────────────────────────
export const getMaterialesDeOrden  = (idOrden)              => request(`/orden-material/orden/${idOrden}`)
export const agregarMaterialOrden  = (body)                 => request('/orden-material', { method: 'POST', body: JSON.stringify(body) })
export const eliminarMaterialOrden = (idOrden, idProducto)  => request(`/orden-material/${idOrden}/${idProducto}`, { method: 'DELETE' })

// ── USUARIO ORDEN ─────────────────────────────────────────
export const getUsuariosDeOrden     = (idOrden)            => request(`/usuario-orden/orden/${idOrden}`)
export const getOrdenesDeUsuario    = (idUsuario)          => request(`/usuario-orden/usuario/${idUsuario}`)
export const asignarUsuarioOrden    = (body)               => request('/usuario-orden', { method: 'POST', body: JSON.stringify(body) })
export const desasignarUsuarioOrden = (idUsuario, idOrden) => request(`/usuario-orden/${idUsuario}/${idOrden}`, { method: 'DELETE' })

// ── EFICIENCIA DE OPERARIOS ───────────────────────────────
// GET /api/eficiencia/operarios → todos los operarios con ranking y rendimiento
export async function getEficienciaOperarios(filtros = {}) {
  const params = new URLSearchParams()
  if (filtros.rendimiento) params.append('rendimiento', filtros.rendimiento)
  if (filtros.estado)      params.append('estado',      filtros.estado)
  if (filtros.limite)      params.append('limite',      filtros.limite)
  const query = params.toString() ? `?${params}` : ''
  const json = await requestWithKey(`/eficiencia/operarios${query}`)
  return json.data
}

// GET /api/eficiencia/operarios/:id → un operario con detalle de sus órdenes
export async function getEficienciaOperario(id) {
  const json = await requestWithKey(`/eficiencia/operarios/${id}`)
  return json.data
}