import express from 'express'
import db from '../db.js'
import verificarApiKey from '../apiKey.js'

const router = express.Router()

router.use(verificarApiKey)

// ─────────────────────────────────────────
// PATH PARAM
// GET /api/eficiencia/operarios/:id
// Devuelve el rendimiento de un operario específico + detalle de sus órdenes
// ─────────────────────────────────────────
router.get('/operarios/:id', async (req, res) => {
  const { id } = req.params

  if (isNaN(id)) {
    return res.status(400).json({ ok: false, mensaje: 'El id debe ser un número válido' })
  }

  const [rows] = await db.query(`
    SELECT 
      u.Id_Usuario,
      u.Nombre_Completo,
      u.Nombre_Usuario,
      u.Correo,
      u.Telefono,

      ROUND(
        COALESCE(SUM(op.Unidades_Realizadas), 0) /
        NULLIF(
          SUM(GREATEST(DATEDIFF(CURDATE(), DATE(op.Fecha_Creacion)), 1)),
          0
        ), 1
      ) AS prendas_por_dia,

      COALESCE(SUM(op.Unidades_Realizadas), 0) AS total_unidades_producidas,

      COUNT(
        CASE WHEN CURDATE() > op.Fecha_Limite
             AND op.Estado IN ('En Proceso', 'Pausado')
        THEN 1 END
      ) AS ordenes_en_retraso,

      COUNT(CASE WHEN op.Estado = 'Completada' THEN 1 END) AS ordenes_completadas,
      COUNT(CASE WHEN op.Estado = 'En Proceso' THEN 1 END) AS ordenes_en_proceso,
      COUNT(CASE WHEN op.Estado = 'Pausado'    THEN 1 END) AS ordenes_pausadas,

      CASE
        WHEN COUNT(
          CASE WHEN CURDATE() > op.Fecha_Limite
               AND op.Estado IN ('En Proceso', 'Pausado')
          THEN 1 END
        ) > 0 THEN 'Bajo'
        WHEN ROUND(
          COALESCE(SUM(op.Unidades_Realizadas), 0) /
          NULLIF(SUM(GREATEST(DATEDIFF(CURDATE(), DATE(op.Fecha_Creacion)), 1)), 0), 1
        ) >= 10 THEN 'Alto'
        WHEN ROUND(
          COALESCE(SUM(op.Unidades_Realizadas), 0) /
          NULLIF(SUM(GREATEST(DATEDIFF(CURDATE(), DATE(op.Fecha_Creacion)), 1)), 0), 1
        ) >= 3 THEN 'Medio'
        ELSE 'Bajo'
      END AS rendimiento

    FROM usuario u
    INNER JOIN rol r ON u.Id_Rol = r.Id_Rol AND r.Nombre_Rol = 'operario'
    LEFT JOIN orden_produccion op ON op.Id_Operario = u.Id_Usuario
    WHERE u.Id_Usuario = ? AND u.Estado = 'activo'
    GROUP BY u.Id_Usuario, u.Nombre_Completo, u.Nombre_Usuario, u.Correo, u.Telefono
  `, [id])

  if (rows.length === 0) {
    return res.status(404).json({ ok: false, mensaje: `No se encontró operario con id ${id}` })
  }

  const [ordenes] = await db.query(`
    SELECT 
      Id_Orden, Producto, Estado, Prioridad,
      Unidades_Realizadas, Unidades, Fecha_Limite,
      CASE 
        WHEN CURDATE() > Fecha_Limite AND Estado IN ('En Proceso', 'Pausado') 
        THEN true ELSE false 
      END AS en_retraso
    FROM orden_produccion
    WHERE Id_Operario = ?
    ORDER BY Fecha_Limite ASC
  `, [id])

  res.json({
    ok: true,
    data: { ...rows[0], ordenes_detalle: ordenes }
  })
})

// ─────────────────────────────────────────
// QUERY PARAMS
// GET /api/eficiencia/operarios
// ?rendimiento=Alto|Medio|Bajo
// ?estado=Completada|En Proceso|Pausado
// ?limite=5
// ─────────────────────────────────────────
router.get('/operarios', async (req, res) => {
  const { rendimiento, estado, limite } = req.query  // ← línea que faltaba

  const [rows] = await db.query(`
    SELECT 
      u.Id_Usuario,
      u.Nombre_Completo,
      u.Nombre_Usuario,

      ROUND(
        COALESCE(SUM(op.Unidades_Realizadas), 0) /
        NULLIF(
          SUM(GREATEST(DATEDIFF(CURDATE(), DATE(op.Fecha_Creacion)), 1)),
          0
        ), 1
      ) AS prendas_por_dia,

      COALESCE(SUM(op.Unidades_Realizadas), 0) AS total_unidades_producidas,

      COUNT(
        CASE WHEN CURDATE() > op.Fecha_Limite
             AND op.Estado IN ('En Proceso', 'Pausado')
        THEN 1 END
      ) AS ordenes_en_retraso,

      COUNT(CASE WHEN op.Estado = 'Completada' THEN 1 END) AS ordenes_completadas,
      COUNT(CASE WHEN op.Estado = 'En Proceso' THEN 1 END) AS ordenes_en_proceso,
      COUNT(CASE WHEN op.Estado = 'Pausado'    THEN 1 END) AS ordenes_pausadas,

      CASE
        WHEN COUNT(
          CASE WHEN CURDATE() > op.Fecha_Limite
               AND op.Estado IN ('En Proceso', 'Pausado')
          THEN 1 END
        ) > 0 THEN 'Bajo'
        WHEN ROUND(
          COALESCE(SUM(op.Unidades_Realizadas), 0) /
          NULLIF(SUM(GREATEST(DATEDIFF(CURDATE(), DATE(op.Fecha_Creacion)), 1)), 0), 1
        ) >= 10 THEN 'Alto'
        WHEN ROUND(
          COALESCE(SUM(op.Unidades_Realizadas), 0) /
          NULLIF(SUM(GREATEST(DATEDIFF(CURDATE(), DATE(op.Fecha_Creacion)), 1)), 0), 1
        ) >= 3 THEN 'Medio'
        ELSE 'Bajo'
      END AS rendimiento

    FROM usuario u
    INNER JOIN rol r ON u.Id_Rol = r.Id_Rol AND r.Nombre_Rol = 'operario'
    LEFT JOIN orden_produccion op ON op.Id_Operario = u.Id_Usuario
    WHERE u.Estado = 'activo'
    GROUP BY u.Id_Usuario, u.Nombre_Completo, u.Nombre_Usuario
    ORDER BY prendas_por_dia DESC
  `)

  let resultado = rows

  if (rendimiento) {
    const validos = ['Alto', 'Medio', 'Bajo']
    if (!validos.includes(rendimiento)) {
      return res.status(400).json({ ok: false, mensaje: `rendimiento inválido. Usa: ${validos.join(', ')}` })
    }
    resultado = resultado.filter(r => r.rendimiento === rendimiento)
  }

  if (estado) {
    const validos = ['Completada', 'En Proceso', 'Pausado']
    if (!validos.includes(estado)) {
      return res.status(400).json({ ok: false, mensaje: `estado inválido. Usa: ${validos.join(', ')}` })
    }
    resultado = resultado.filter(r => {
      if (estado === 'Completada') return r.ordenes_completadas > 0
      if (estado === 'En Proceso') return r.ordenes_en_proceso > 0
      if (estado === 'Pausado')    return r.ordenes_pausadas > 0
    })
  }

  if (limite) {
    const n = parseInt(limite)
    if (isNaN(n) || n <= 0) {
      return res.status(400).json({ ok: false, mensaje: 'limite debe ser un número positivo' })
    }
    resultado = resultado.slice(0, n)
  }

  res.json({
    ok: true,
    total: resultado.length,
    filtros_aplicados: { rendimiento: rendimiento || null, estado: estado || null, limite: limite || null },
    data: resultado
  })
})

export default router