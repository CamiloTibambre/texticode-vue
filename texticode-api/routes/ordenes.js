import { Router } from 'express'
import pool from '../db.js'

const router = Router()

// GET todas las órdenes
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT op.*,
             u."Nombre_Completo" AS "Cliente",
             m."Nombre_Material" AS "NombreMaterial"
      FROM orden_produccion op
      INNER JOIN usuario u ON op."Id_Cliente" = u."Id_Usuario"
      INNER JOIN material m ON op."Id_Material" = m."Id_Material"
      ORDER BY op."Fecha_Limite" ASC
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET órdenes asignadas a un operario
router.get('/operario/:idOperario', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT op.*,
             u."Nombre_Completo" AS "Cliente",
             m."Nombre_Material" AS "NombreMaterial"
      FROM orden_produccion op
      INNER JOIN usuario u ON op."Id_Cliente" = u."Id_Usuario"
      INNER JOIN material m ON op."Id_Material" = m."Id_Material"
      WHERE op."Id_Operario" = $1
      ORDER BY op."Fecha_Limite" ASC
    `, [req.params.idOperario])
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET órdenes de un cliente
router.get('/cliente/:idCliente', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT op.*,
             u."Nombre_Completo" AS "Cliente",
             m."Nombre_Material" AS "NombreMaterial"
      FROM orden_produccion op
      INNER JOIN usuario u ON op."Id_Cliente" = u."Id_Usuario"
      INNER JOIN material m ON op."Id_Material" = m."Id_Material"
      WHERE op."Id_Cliente" = $1
      ORDER BY op."Fecha_Limite" ASC
    `, [req.params.idCliente])
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET orden por ID
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT op.*,
             u."Nombre_Completo" AS "Cliente",
             m."Nombre_Material" AS "NombreMaterial"
      FROM orden_produccion op
      INNER JOIN usuario u ON op."Id_Cliente" = u."Id_Usuario"
      INNER JOIN material m ON op."Id_Material" = m."Id_Material"
      WHERE op."Id_Orden" = $1
    `, [req.params.id])
    if (rows.length === 0) return res.status(404).json({ error: 'Orden no encontrada' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET órdenes por estado
router.get('/estado/:estado', async (req, res) => {
  const estadosValidos = ['En Proceso', 'Completada', 'Pausado']
  if (!estadosValidos.includes(req.params.estado))
    return res.status(400).json({ error: 'Estado inválido' })
  try {
    const { rows } = await pool.query(`
      SELECT op.*,
             u."Nombre_Completo" AS "Cliente",
             m."Nombre_Material" AS "NombreMaterial"
      FROM orden_produccion op
      INNER JOIN usuario u ON op."Id_Cliente" = u."Id_Usuario"
      INNER JOIN material m ON op."Id_Material" = m."Id_Material"
      WHERE op."Estado" = $1
    `, [req.params.estado])
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST crear orden
router.post('/', async (req, res) => {
  const {
    Id_Cliente, Id_Material, Id_Operario,
    Producto, Descripcion, Cantidad,
    Prioridad, Fecha_Limite, Estado,
    Dificultad
  } = req.body

  if (!Id_Cliente || !Id_Material || !Descripcion || !Cantidad || !Fecha_Limite)
    return res.status(400).json({ error: 'Faltan campos obligatorios' })

  try {
    const { rows } = await pool.query(`
      INSERT INTO orden_produccion
        ("Id_Cliente", "Id_Material", "Id_Operario", "Producto", "Descripcion",
         "Cantidad", "Prioridad", "Fecha_Limite", "Estado", "Dificultad")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING "Id_Orden"
    `, [
      Id_Cliente,
      Id_Material,
      Id_Operario  || null,
      Producto     || null,
      Descripcion,
      Cantidad,
      Prioridad    || 'Media',
      Fecha_Limite,
      Estado       || 'En Proceso',
      Dificultad   || 'Media',
    ])
    res.status(201).json({ mensaje: 'Orden creada', Id_Orden: rows[0].Id_Orden })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT actualizar orden
router.put('/:id', async (req, res) => {
  const {
    Id_Cliente, Id_Material, Id_Operario, Producto, Descripcion,
    Cantidad, Prioridad, Fecha_Limite, Estado,
    Unidades, Unidades_Realizadas,
    Dificultad
  } = req.body

  try {
    const { rowCount } = await pool.query(`
      UPDATE orden_produccion
      SET "Id_Cliente"=$1, "Id_Material"=$2, "Id_Operario"=$3, "Producto"=$4, "Descripcion"=$5,
          "Cantidad"=$6, "Prioridad"=$7, "Fecha_Limite"=$8, "Estado"=$9,
          "Unidades"=$10, "Unidades_Realizadas"=$11,
          "Dificultad"=$12
      WHERE "Id_Orden"=$13
    `, [
      Id_Cliente, Id_Material, Id_Operario || null,
      Producto || null, Descripcion, Cantidad, Prioridad,
      Fecha_Limite, Estado,
      Unidades ?? null, Unidades_Realizadas ?? null,
      Dificultad || 'Media',
      req.params.id,
    ])

    if (rowCount === 0) return res.status(404).json({ error: 'Orden no encontrada' })
    res.json({ mensaje: 'Orden actualizada' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE orden
router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM orden_produccion WHERE "Id_Orden" = $1',
      [req.params.id]
    )
    if (rowCount === 0) return res.status(404).json({ error: 'Orden no encontrada' })
    res.json({ mensaje: 'Orden eliminada' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router