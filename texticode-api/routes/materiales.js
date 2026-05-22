import { Router } from 'express'
import pool from '../db.js'

const router = Router()

// GET todos los materiales
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT m.*,
             u."Nombre_Completo" AS "Nombre_Cliente"
      FROM material m
      LEFT JOIN usuario u ON m."Id_Cliente" = u."Id_Usuario"
      ORDER BY m."Nombre_Material"
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET material por ID
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT m.*,
             u."Nombre_Completo" AS "Nombre_Cliente"
      FROM material m
      LEFT JOIN usuario u ON m."Id_Cliente" = u."Id_Usuario"
      WHERE m."Id_Material" = $1
    `, [req.params.id])
    if (rows.length === 0) return res.status(404).json({ error: 'Material no encontrado' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET materiales con stock bajo
router.get('/alertas/stock-bajo', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT m.*,
             u."Nombre_Completo" AS "Nombre_Cliente"
      FROM material m
      LEFT JOIN usuario u ON m."Id_Cliente" = u."Id_Usuario"
      WHERE m."Stock_Actual" <= m."Stock_Minimo"
      ORDER BY m."Stock_Actual" ASC
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST crear material
router.post('/', async (req, res) => {
  const { Nombre_Material, Categoria, Stock_Actual, Unidad, Stock_Minimo, Stock_Maximo, Id_Cliente } = req.body
  if (!Nombre_Material || !Categoria || !Unidad)
    return res.status(400).json({ error: 'Faltan campos obligatorios' })

  try {
    const { rows } = await pool.query(`
      INSERT INTO material ("Nombre_Material", "Categoria", "Stock_Actual", "Unidad", "Stock_Minimo", "Stock_Maximo", "Id_Cliente")
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING "Id_Material"
    `, [
      Nombre_Material,
      Categoria,
      Stock_Actual ?? 0,
      Unidad,
      Stock_Minimo  ?? 0,
      Stock_Maximo  ?? 0,
      Id_Cliente    || null,
    ])

    res.status(201).json({ mensaje: 'Material creado', Id_Material: rows[0].Id_Material })
  } catch (err) {
    if (err.code === '23505')
      return res.status(409).json({ error: 'Ya existe un material con ese nombre' })
    res.status(500).json({ error: err.message })
  }
})

// PUT actualizar material
router.put('/:id', async (req, res) => {
  const { Nombre_Material, Categoria, Stock_Actual, Unidad, Stock_Minimo, Stock_Maximo, Id_Cliente } = req.body
  try {
    const { rowCount } = await pool.query(`
      UPDATE material
      SET "Nombre_Material" = $1,
          "Categoria"       = $2,
          "Stock_Actual"    = $3,
          "Unidad"          = $4,
          "Stock_Minimo"    = $5,
          "Stock_Maximo"    = $6,
          "Id_Cliente"      = $7
      WHERE "Id_Material" = $8
    `, [
      Nombre_Material,
      Categoria,
      Stock_Actual,
      Unidad,
      Stock_Minimo,
      Stock_Maximo,
      Id_Cliente || null,
      req.params.id,
    ])

    if (rowCount === 0) return res.status(404).json({ error: 'Material no encontrado' })
    res.json({ mensaje: 'Material actualizado' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE material
router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM material WHERE "Id_Material" = $1', [req.params.id])
    if (rowCount === 0) return res.status(404).json({ error: 'Material no encontrado' })
    res.json({ mensaje: 'Material eliminado' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router