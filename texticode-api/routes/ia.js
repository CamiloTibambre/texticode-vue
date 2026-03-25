import { Router } from 'express'
import pool from '../db.js'

const router = Router()

router.post('/analizar', async (req, res) => {
  const rolRaw = (req.body?.rol || '').toLowerCase()
  const rol = rolRaw === 'administrador' ? 'admin' : rolRaw
  const consulta = (req.body?.consulta || '').trim()
  const idUsuario = Number(req.body?.idUsuario) || null

  if (!['admin', 'operario', 'cliente'].includes(rol)) {
    return res.status(400).json({ error: 'Rol inválido para análisis IA' })
  }

  try {
    const { whereSql, params } = construirFiltroPorRol(rol, idUsuario)

    const [ordenes] = await pool.query(
      `SELECT Id_Orden, Estado, Prioridad, Fecha_Limite, Cantidad, Unidades_Realizadas
       FROM orden_produccion
       ${whereSql}`,
      params,
    )

    const [materialesBajos] = await pool.query(
      `SELECT Nombre_Material, Stock_Actual, Stock_Minimo
       FROM material
       WHERE Stock_Actual <= Stock_Minimo
       ORDER BY Stock_Actual ASC
       LIMIT 4`,
    )

    const hoy = new Date()
    const total = ordenes.length
    const completadas = ordenes.filter((o) => normalizarEstado(o.Estado) === 'completada').length
    const pendientes = ordenes.filter((o) => normalizarEstado(o.Estado) === 'pendiente').length
    const enProceso = ordenes.filter((o) => normalizarEstado(o.Estado) === 'en-proceso').length
    const atrasadas = ordenes.filter((o) => {
      if (!o.Fecha_Limite) return false
      return new Date(o.Fecha_Limite) < hoy && normalizarEstado(o.Estado) !== 'completada'
    }).length

    const riesgoPct = total ? Math.min(95, Math.round(((atrasadas + pendientes) / total) * 100)) : 0
    const tasaCumplimiento = total ? Math.round((completadas / total) * 100) : 0

    const kpis = construirKpisPorRol({ rol, total, completadas, pendientes, enProceso, atrasadas, riesgoPct, tasaCumplimiento })
    const alertas = construirAlertasPorRol({ rol, atrasadas, materialesBajos, pendientes, enProceso, riesgoPct })
    const automatizaciones = construirAutomatizacionesPorRol(rol)

    const respuesta = {
      resumen: consulta
        ? `Analicé tu consulta "${consulta}" con ${total} órdenes del sistema y encontré ${alertas.length} alertas clave.`
        : `Analicé tus datos operativos y detecté focos de optimización inmediatos.`,
      acciones: construirAccionesPorRol({ rol, atrasadas, materialesBajos, pendientes, enProceso }),
      confianza: Math.max(87, 96 - Math.min(8, atrasadas)),
    }

    res.json({ kpis, alertas, automatizaciones, respuesta })
  } catch (error) {
    res.status(500).json({ error: error.message || 'No fue posible ejecutar el análisis IA' })
  }
})

function construirFiltroPorRol(rol, idUsuario) {
  if (rol === 'operario' && idUsuario) {
    return { whereSql: 'WHERE Id_Operario = ?', params: [idUsuario] }
  }

  if (rol === 'cliente' && idUsuario) {
    return { whereSql: 'WHERE Id_Cliente = ?', params: [idUsuario] }
  }

  return { whereSql: '', params: [] }
}

function normalizarEstado(estado = '') {
  const value = String(estado).trim().toLowerCase()
  if (['completada', 'entregado', 'completado'].includes(value)) return 'completada'
  if (['en proceso', 'en-proceso', 'proceso'].includes(value)) return 'en-proceso'
  if (['pendiente', 'pausado', 'pausa'].includes(value)) return 'pendiente'
  return value || 'pendiente'
}

function construirKpisPorRol({ rol, total, completadas, pendientes, enProceso, atrasadas, riesgoPct, tasaCumplimiento }) {
  if (rol === 'admin') {
    return [
      { label: 'Órdenes analizadas', value: String(total), hint: `${completadas} completadas` },
      { label: 'Riesgo global', value: `${riesgoPct}%`, hint: `${atrasadas} atrasadas` },
      { label: 'Cumplimiento', value: `${tasaCumplimiento}%`, hint: `${pendientes} pendientes` },
    ]
  }

  if (rol === 'operario') {
    return [
      { label: 'Mis órdenes', value: String(total), hint: `${enProceso} en proceso` },
      { label: 'Atrasadas', value: String(atrasadas), hint: 'Priorización sugerida por IA' },
      { label: 'Cumplidas', value: `${tasaCumplimiento}%`, hint: `${completadas} completadas` },
    ]
  }

  return [
    { label: 'Tus pedidos', value: String(total), hint: `${enProceso} en producción` },
    { label: 'Riesgo entrega', value: `${riesgoPct}%`, hint: `${atrasadas} con posible retraso` },
    { label: 'Cumplimiento', value: `${tasaCumplimiento}%`, hint: 'Actualizado en tiempo real' },
  ]
}

function construirAlertasPorRol({ rol, atrasadas, materialesBajos, pendientes, enProceso, riesgoPct }) {
  const alertas = []

  if (atrasadas > 0) {
    alertas.push({
      titulo: `${atrasadas} órdenes fuera de fecha`,
      detalle: 'Se recomienda reasignar prioridad y confirmar capacidad de producción.',
      nivel: 'alta',
    })
  }

  if (materialesBajos.length > 0 && rol !== 'cliente') {
    const material = materialesBajos[0]
    alertas.push({
      titulo: `Stock crítico: ${material.Nombre_Material}`,
      detalle: `Stock actual ${material.Stock_Actual}, mínimo ${material.Stock_Minimo}.`,
      nivel: 'media',
    })
  }

  if (rol === 'cliente') {
    alertas.push({
      titulo: 'Predicción de entrega actualizada',
      detalle: `Riesgo actual ${riesgoPct}%. Te sugerimos activar alertas por WhatsApp.`,
      nivel: riesgoPct > 50 ? 'media' : 'baja',
    })
  } else {
    alertas.push({
      titulo: 'Carga operativa detectada',
      detalle: `${enProceso} órdenes en proceso y ${pendientes} pendientes requieren secuencia óptima.`,
      nivel: enProceso > 5 ? 'media' : 'baja',
    })
  }

  return alertas.slice(0, 3)
}

function construirAutomatizacionesPorRol(rol) {
  if (rol === 'admin') {
    return [
      { nombre: 'Rebalanceador de producción', descripcion: 'Redistribuye carga operativa por prioridad y fecha límite.' },
      { nombre: 'Abastecimiento predictivo', descripcion: 'Dispara alertas y compras cuando el stock cae al umbral.' },
      { nombre: 'Reporte ejecutivo IA', descripcion: 'Resume riesgos y oportunidades para comité de dirección.' },
    ]
  }

  if (rol === 'operario') {
    return [
      { nombre: 'Secuenciador de tareas', descripcion: 'Ordena automáticamente tus órdenes para reducir tiempos muertos.' },
      { nombre: 'Inspector de calidad', descripcion: 'Checklist preventivo dinámico según tipo de prenda.' },
      { nombre: 'Actualizador de avances', descripcion: 'Sugiere el siguiente hito a reportar según progreso.' },
    ]
  }

  return [
    { nombre: 'Asistente de estado', descripcion: 'Resumen automático del estado de tus pedidos.' },
    { nombre: 'Comunicador proactivo', descripcion: 'Notifica cambios de ETA y estado sin que tengas que consultar.' },
    { nombre: 'Recomendador de urgencias', descripcion: 'Sugiere rutas rápidas según disponibilidad y riesgo.' },
  ]
}

function construirAccionesPorRol({ rol, atrasadas, materialesBajos, pendientes, enProceso }) {
  if (rol === 'admin') {
    return [
      `Mover 2 recursos a órdenes atrasadas (${atrasadas}) durante el siguiente turno.`,
      materialesBajos.length
        ? `Comprar material crítico: ${materialesBajos[0].Nombre_Material} en las próximas 24 horas.`
        : 'Mantener política de inventario actual con monitoreo diario.',
      `Ejecutar reunión de revisión con foco en ${pendientes} órdenes pendientes.`,
    ]
  }

  if (rol === 'operario') {
    return [
      `Atacar primero órdenes con mayor riesgo de atraso (${atrasadas}).`,
      'Aplicar control de calidad en punto intermedio (50%) y final (100%).',
      `Planificar bloque de trabajo continuo para ${enProceso} órdenes en proceso.`,
    ]
  }

  return [
    'Activar notificaciones para cambios de fecha en tiempo real.',
    `Revisar pedidos en proceso (${enProceso}) y coordinar recepción preventiva.`,
    'Descargar comprobantes automáticamente al pasar a estado entregado.',
  ]
}

export default router
