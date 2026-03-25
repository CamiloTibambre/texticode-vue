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
      `SELECT
        op.Id_Orden,
        op.Estado,
        op.Prioridad,
        op.Fecha_Limite,
        op.Cantidad,
        op.Unidades_Realizadas,
        op.Producto,
        op.Descripcion,
        c.Nombre_Completo AS Cliente,
        m.Nombre_Material AS Material
      FROM orden_produccion op
      INNER JOIN usuario c ON c.Id_Usuario = op.Id_Cliente
      INNER JOIN material m ON m.Id_Material = op.Id_Material
      ${whereSql}`,
      params,
    )

    const [materialesBajos] = await pool.query(
      `SELECT Nombre_Material, Stock_Actual, Stock_Minimo
       FROM material
       WHERE Stock_Actual <= Stock_Minimo
       ORDER BY (Stock_Minimo - Stock_Actual) DESC
       LIMIT 5`,
    )

    const resumen = construirResumen(ordenes)
    const prioridades = construirPrioridades(ordenes, rol)
    const kpis = construirKpisPorRol({ rol, ...resumen })
    const alertas = construirAlertasPorRol({ rol, ...resumen, materialesBajos })
    const automatizaciones = construirAutomatizacionesPorRol(rol)
    const playbook = construirPlaybook({ rol, resumen, prioridades, materialesBajos })

    const respuesta = {
      resumen: consulta
        ? `Procesé tu consulta: "${consulta}" y prioricé ${prioridades.length} frentes críticos.`
        : 'Analicé producción, riesgo y cumplimiento; ya tienes un plan accionable para ejecutar hoy.',
      acciones: construirAccionesPorRol({ rol, resumen, prioridades, materialesBajos }),
      confianza: Math.max(89, 97 - Math.min(7, resumen.atrasadas)),
    }

    res.json({
      kpis,
      alertas,
      automatizaciones,
      prioridades,
      playbook,
      respuesta,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    res.status(500).json({ error: error.message || 'No fue posible ejecutar el análisis IA' })
  }
})

function construirFiltroPorRol(rol, idUsuario) {
  if (rol === 'operario' && idUsuario) {
    return { whereSql: 'WHERE op.Id_Operario = ?', params: [idUsuario] }
  }
  if (rol === 'cliente' && idUsuario) {
    return { whereSql: 'WHERE op.Id_Cliente = ?', params: [idUsuario] }
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

function prioridadScore(prioridad = '') {
  const p = String(prioridad).toLowerCase()
  if (p === 'alta') return 3
  if (p === 'media') return 2
  return 1
}

function construirResumen(ordenes) {
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

  return { total, completadas, pendientes, enProceso, atrasadas, riesgoPct, tasaCumplimiento }
}

function construirPrioridades(ordenes, rol) {
  const hoy = new Date()

  return ordenes
    .filter((o) => normalizarEstado(o.Estado) !== 'completada')
    .map((o) => {
      const fecha = o.Fecha_Limite ? new Date(o.Fecha_Limite) : null
      const diasVencidos = fecha ? Math.max(0, Math.floor((hoy - fecha) / (1000 * 60 * 60 * 24))) : 0
      const avance = o.Cantidad > 0
        ? Math.min(100, Math.round(((Number(o.Unidades_Realizadas) || 0) / Number(o.Cantidad)) * 100))
        : 0
      const score = prioridadScore(o.Prioridad) * 20 + diasVencidos * 10 + (100 - avance) * 0.3

      return {
        idOrden: o.Id_Orden,
        titulo: o.Producto || o.Descripcion || `Orden #${o.Id_Orden}`,
        cliente: rol === 'operario' ? undefined : o.Cliente,
        material: o.Material,
        estado: o.Estado,
        prioridad: o.Prioridad || 'Media',
        avance,
        score: Math.round(score),
        razon: diasVencidos > 0
          ? `Atraso de ${diasVencidos} día(s) + prioridad ${o.Prioridad || 'Media'}`
          : `Prioridad ${o.Prioridad || 'Media'} con avance ${avance}%`,
      }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
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
      { label: 'Mis órdenes activas', value: String(enProceso + pendientes), hint: `${enProceso} en proceso` },
      { label: 'Atrasadas', value: String(atrasadas), hint: 'Priorización automática aplicada' },
      { label: 'Cumplidas', value: `${tasaCumplimiento}%`, hint: `${completadas} completadas` },
    ]
  }
  return [
    { label: 'Tus pedidos', value: String(total), hint: `${enProceso} en producción` },
    { label: 'Riesgo entrega', value: `${riesgoPct}%`, hint: `${atrasadas} con potencial retraso` },
    { label: 'Cumplimiento', value: `${tasaCumplimiento}%`, hint: 'Seguimiento automático' },
  ]
}

function construirAlertasPorRol({ rol, atrasadas, materialesBajos, pendientes, enProceso, riesgoPct }) {
  const alertas = []

  if (atrasadas > 0) {
    alertas.push({
      titulo: `${atrasadas} órdenes fuera de fecha`,
      detalle: 'Recomendado: reasignar capacidad y bloquear nuevas órdenes no críticas.',
      nivel: 'alta',
    })
  }

  if (materialesBajos.length > 0 && rol !== 'cliente') {
    const material = materialesBajos[0]
    alertas.push({
      titulo: `Stock crítico: ${material.Nombre_Material}`,
      detalle: `Actual ${material.Stock_Actual} / Mínimo ${material.Stock_Minimo}.`,
      nivel: 'media',
    })
  }

  alertas.push(
    rol === 'cliente'
      ? {
          titulo: 'ETA en revisión dinámica',
          detalle: `El riesgo de tu flujo actual es ${riesgoPct}%. Activa comunicación proactiva.`,
          nivel: riesgoPct > 50 ? 'media' : 'baja',
        }
      : {
          titulo: 'Carga operativa concentrada',
          detalle: `${enProceso} en proceso y ${pendientes} pendientes. Conviene secuenciar por score.`,
          nivel: enProceso > 5 ? 'media' : 'baja',
        },
  )

  return alertas.slice(0, 3)
}

function construirAutomatizacionesPorRol(rol) {
  if (rol === 'admin') {
    return [
      { nombre: 'Ruteador de capacidad', descripcion: 'Reasigna personal y estaciones según score de riesgo.' },
      { nombre: 'Compra predictiva', descripcion: 'Genera orden de compra cuando material cae al umbral.' },
      { nombre: 'Brief ejecutivo', descripcion: 'Resumen automático diario para comité de operaciones.' },
    ]
  }
  if (rol === 'operario') {
    return [
      { nombre: 'Secuencia inteligente', descripcion: 'Ordena la cola del día para minimizar bloqueos.' },
      { nombre: 'Checklist IA de calidad', descripcion: 'Activa puntos de control por tipo de prenda.' },
      { nombre: 'Asistente de reporte', descripcion: 'Sugiere avances y alertas antes del cierre de turno.' },
    ]
  }
  return [
    { nombre: 'Radar de entregas', descripcion: 'Monitorea cambios de estado y ETA continuamente.' },
    { nombre: 'Comunicador proactivo', descripcion: 'Genera mensajes automáticos de estado de pedido.' },
    { nombre: 'Asistente de recompra', descripcion: 'Sugiere cuándo y qué volver a pedir según historial.' },
  ]
}

function construirPlaybook({ rol, resumen, prioridades, materialesBajos }) {
  const top = prioridades[0]
  return {
    inmediato: top
      ? `Priorizar Orden #${top.idOrden} (${top.titulo}) por score ${top.score}.`
      : 'No hay órdenes críticas en este momento.',
    estaSemana:
      resumen.atrasadas > 0
        ? `Objetivo: reducir atrasos de ${resumen.atrasadas} a ${Math.max(0, resumen.atrasadas - 2)}.`
        : 'Objetivo: mantener cero atrasos y aumentar cumplimiento +5%.',
    comunicacion:
      rol === 'cliente'
        ? 'Enviar actualización automática de ETA y estado al correo del cliente.'
        : materialesBajos.length
          ? `Notificar compras por riesgo en ${materialesBajos[0].Nombre_Material}.`
          : 'Enviar resumen diario de cumplimiento al cierre del turno.',
  }
}

function construirAccionesPorRol({ rol, resumen, prioridades, materialesBajos }) {
  const top = prioridades[0]
  if (rol === 'admin') {
    return [
      top ? `Asignar refuerzo inmediato a Orden #${top.idOrden}.` : 'Mantener distribución actual de capacidad.',
      materialesBajos.length
        ? `Lanzar compra de ${materialesBajos[0].Nombre_Material} en las próximas 12 horas.`
        : 'Sin compras urgentes de materiales hoy.',
      `Foco diario: bajar riesgo global de ${resumen.riesgoPct}% a menos de ${Math.max(20, resumen.riesgoPct - 10)}%.`,
    ]
  }

  if (rol === 'operario') {
    return [
      top ? `Comenzar turno con Orden #${top.idOrden} (${top.razon}).` : 'No hay prioridad crítica asignada.',
      'Aplicar control de calidad al 50% y 100% de cada orden priorizada.',
      `Cerrar turno dejando menos de ${Math.max(0, resumen.pendientes - 1)} órdenes pendientes.`,
    ]
  }

  return [
    'Activar canal de notificaciones para cambios de ETA.',
    top ? `Pedido más sensible detectado: Orden #${top.idOrden}.` : 'No se detectan pedidos sensibles ahora.',
    'Programar confirmación de entrega automática al pasar a “Completada”.',
  ]
}

export default router
