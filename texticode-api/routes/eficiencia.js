import express from 'express'
import db from '../db.js'
import verificarApiKey from '../apiKey.js'

const router = express.Router()

router.use(verificarApiKey)

// ─────────────────────────────────────────
// Prendas por día ponderadas por dificultad.
// Las órdenes que tienen al menos una observación de problema
// registrada se EXCLUYEN del conteo: el operario no es responsable
// de ese retraso, por lo que no deben afectar su rendimiento.
//
// Alta=3 | Media=2 | Baja=1
// ─────────────────────────────────────────
const SQL_PRENDAS_POR_DIA = `
  ROUND(
    COALESCE(SUM(
      CASE
        WHEN (
          SELECT COUNT(*) FROM observacion_operario ob2
          WHERE ob2.Id_Orden = op.Id_Orden
        ) = 0
        THEN op.Unidades_Realizadas * CASE op.Dificultad
              WHEN 'Alta'  THEN 3
              WHEN 'Media' THEN 2
              WHEN 'Baja'  THEN 1
              ELSE 2
            END
        ELSE NULL   -- orden con problema: no suma al ponderado
      END
    ), 0) /
    NULLIF(
      SUM(
        CASE
          WHEN (
            SELECT COUNT(*) FROM observacion_operario ob3
            WHERE ob3.Id_Orden = op.Id_Orden
          ) = 0
          THEN GREATEST(DATEDIFF(CURDATE(), DATE(op.Fecha_Creacion)), 1)
          ELSE 0    -- tampoco cuenta los días de esa orden en el divisor
        END
      ),
      0
    ), 1
  )
`

// ─────────────────────────────────────────
// Órdenes "en retraso real": vencidas Y sin observación registrada.
// Si hay observación, el retraso fue externo y no penaliza.
// ─────────────────────────────────────────
const SQL_ORDENES_EN_RETRASO = `
  COUNT(
    CASE
      WHEN CURDATE() > op.Fecha_Limite
       AND op.Estado IN ('En Proceso', 'Pausado')
       AND (
         SELECT COUNT(*) FROM observacion_operario ob4
         WHERE ob4.Id_Orden = op.Id_Orden
       ) = 0
      THEN 1
    END
  )
`

// ─────────────────────────────────────────
// GET /api/eficiencia/operarios/:id
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

      ${SQL_PRENDAS_POR_DIA} AS prendas_por_dia,

      COALESCE(SUM(op.Unidades_Realizadas), 0) AS total_unidades_producidas,

      ${SQL_ORDENES_EN_RETRASO} AS ordenes_en_retraso,

      COUNT(CASE WHEN op.Estado = 'Completada' THEN 1 END) AS ordenes_completadas,
      COUNT(CASE WHEN op.Estado = 'En Proceso' THEN 1 END) AS ordenes_en_proceso,
      COUNT(CASE WHEN op.Estado = 'Pausado'    THEN 1 END) AS ordenes_pausadas,

      -- Órdenes con problema reportado (informativo)
      COUNT(
        CASE WHEN (
          SELECT COUNT(*) FROM observacion_operario ob5
          WHERE ob5.Id_Orden = op.Id_Orden
        ) > 0 THEN 1 END
      ) AS ordenes_con_problema,

      CASE
        WHEN ${SQL_ORDENES_EN_RETRASO} > 0 THEN 'Bajo'
        WHEN ${SQL_PRENDAS_POR_DIA} >= 10  THEN 'Alto'
        WHEN ${SQL_PRENDAS_POR_DIA} >= 3   THEN 'Medio'
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

  // Órdenes del operario con flag de si tiene problema reportado
  const [ordenes] = await db.query(`
    SELECT 
      op.Id_Orden, op.Producto, op.Estado, op.Prioridad, op.Dificultad,
      op.Unidades_Realizadas, op.Unidades, op.Fecha_Limite,
      CASE 
        WHEN CURDATE() > op.Fecha_Limite AND op.Estado IN ('En Proceso', 'Pausado') 
        THEN true ELSE false 
      END AS en_retraso,
      CASE
        WHEN (
          SELECT COUNT(*) FROM observacion_operario ob
          WHERE ob.Id_Orden = op.Id_Orden
        ) > 0 THEN true ELSE false
      END AS tiene_problema
    FROM orden_produccion op
    WHERE op.Id_Operario = ?
    ORDER BY op.Fecha_Limite ASC
  `, [id])

  // Para cada orden, traer sus observaciones vinculadas
  const ordenesConObs = await Promise.all(
    ordenes.map(async (o) => {
      const [obs] = await db.query(`
        SELECT ob.Id_Observacion, ob.Observacion, ob.Fecha,
               u.Nombre_Completo AS Admin
        FROM observacion_operario ob
        INNER JOIN usuario u ON ob.Id_Admin = u.Id_Usuario
        WHERE ob.Id_Operario = ? AND ob.Id_Orden = ?
        ORDER BY ob.Fecha DESC
      `, [id, o.Id_Orden])
      return { ...o, observaciones: obs }
    })
  )

  res.json({
    ok: true,
    data: { ...rows[0], ordenes_detalle: ordenesConObs }
  })
})

// ─────────────────────────────────────────
// GET /api/eficiencia/operarios
// ─────────────────────────────────────────
router.get('/operarios', async (req, res) => {
  const { rendimiento, estado, limite } = req.query

  const [rows] = await db.query(`
    SELECT 
      u.Id_Usuario,
      u.Nombre_Completo,
      u.Nombre_Usuario,

      ${SQL_PRENDAS_POR_DIA} AS prendas_por_dia,

      COALESCE(SUM(op.Unidades_Realizadas), 0) AS total_unidades_producidas,

      ${SQL_ORDENES_EN_RETRASO} AS ordenes_en_retraso,

      COUNT(CASE WHEN op.Estado = 'Completada' THEN 1 END) AS ordenes_completadas,
      COUNT(CASE WHEN op.Estado = 'En Proceso' THEN 1 END) AS ordenes_en_proceso,
      COUNT(CASE WHEN op.Estado = 'Pausado'    THEN 1 END) AS ordenes_pausadas,

      COUNT(
        CASE WHEN (
          SELECT COUNT(*) FROM observacion_operario ob5
          WHERE ob5.Id_Orden = op.Id_Orden
        ) > 0 THEN 1 END
      ) AS ordenes_con_problema,

      CASE
        WHEN ${SQL_ORDENES_EN_RETRASO} > 0 THEN 'Bajo'
        WHEN ${SQL_PRENDAS_POR_DIA} >= 10  THEN 'Alto'
        WHEN ${SQL_PRENDAS_POR_DIA} >= 3   THEN 'Medio'
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

// ─────────────────────────────────────────
// POST /api/eficiencia/observaciones
// Body: { Id_Operario, Id_Admin, Id_Orden, Observacion }
// ─────────────────────────────────────────
router.post('/observaciones', async (req, res) => {
  const { Id_Operario, Id_Admin, Id_Orden, Observacion } = req.body

  if (!Id_Operario || !Id_Admin || !Id_Orden || !Observacion) {
    return res.status(400).json({ ok: false, mensaje: 'Id_Operario, Id_Admin, Id_Orden y Observacion son requeridos' })
  }

  if (Observacion.length > 500) {
    return res.status(400).json({ ok: false, mensaje: 'La observación no puede superar 500 caracteres' })
  }

  const [operario] = await db.query(
    `SELECT u.Id_Usuario FROM usuario u 
     INNER JOIN rol r ON u.Id_Rol = r.Id_Rol 
     WHERE u.Id_Usuario = ? AND r.Nombre_Rol = 'operario' AND u.Estado = 'activo'`,
    [Id_Operario]
  )
  if (operario.length === 0) {
    return res.status(404).json({ ok: false, mensaje: 'Operario no encontrado o no activo' })
  }

  const [orden] = await db.query(
    `SELECT Id_Orden FROM orden_produccion WHERE Id_Orden = ? AND Id_Operario = ?`,
    [Id_Orden, Id_Operario]
  )
  if (orden.length === 0) {
    return res.status(400).json({ ok: false, mensaje: 'La orden no pertenece a este operario' })
  }

  const [result] = await db.query(
    `INSERT INTO observacion_operario (Id_Operario, Id_Orden, Id_Admin, Observacion) VALUES (?, ?, ?, ?)`,
    [Id_Operario, Id_Orden, Id_Admin, Observacion]
  )

  res.status(201).json({
    ok: true,
    mensaje: 'Observación registrada correctamente',
    data: { Id_Observacion: result.insertId, Id_Operario, Id_Orden, Id_Admin, Observacion }
  })
})

// ─────────────────────────────────────────
// GET /api/eficiencia/observaciones/:id
// Filtra por orden si se pasa ?Id_Orden=
// ─────────────────────────────────────────
router.get('/observaciones/:id', async (req, res) => {
  const { id } = req.params
  const { Id_Orden } = req.query

  let sql = `
    SELECT ob.Id_Observacion, ob.Id_Orden, ob.Observacion, ob.Fecha,
           u.Nombre_Completo AS Admin
    FROM observacion_operario ob
    INNER JOIN usuario u ON ob.Id_Admin = u.Id_Usuario
    WHERE ob.Id_Operario = ?
  `
  const params = [id]

  if (Id_Orden) {
    sql += ` AND ob.Id_Orden = ?`
    params.push(Id_Orden)
  }

  sql += ` ORDER BY ob.Fecha DESC`

  const [rows] = await db.query(sql, params)

  res.json({ ok: true, total: rows.length, data: rows })
})

export default router