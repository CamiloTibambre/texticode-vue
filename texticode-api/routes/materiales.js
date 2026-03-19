import { Router } from 'express'
import pool from '../db.js'

const router = Router()

// GET todos los materiales
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM material ORDER BY Nombre_Material')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET material por ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM material WHERE Id_Material = ?', [req.params.id])
    if (rows.length === 0) return res.status(404).json({ error: 'Material no encontrado' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET materiales con stock bajo (stock_actual <= stock_minimo)
router.get('/alertas/stock-bajo', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM material WHERE Stock_Actual <= Stock_Minimo ORDER BY Stock_Actual ASC'
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST crear material
router.post('/', async (req, res) => {
  const { Nombre_Material, Categoria, Stock_Actual, Unidad, Stock_Minimo, Stock_Maximo } = req.body
  if (!Nombre_Material || !Categoria || !Unidad)
    return res.status(400).json({ error: 'Faltan campos obligatorios' })

  try {
    const [result] = await pool.query(`
      INSERT INTO material (Nombre_Material, Categoria, Stock_Actual, Unidad, Stock_Minimo, Stock_Maximo)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [Nombre_Material, Categoria, Stock_Actual || 0, Unidad, Stock_Minimo || 0, Stock_Maximo || 0])

    res.status(201).json({ mensaje: 'Material creado', Id_Material: result.insertId })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ error: 'Ya existe un material con ese nombre' })
    res.status(500).json({ error: err.message })
  }
})

// PUT actualizar material
router.put('/:id', async (req, res) => {
  const { Nombre_Material, Categoria, Stock_Actual, Unidad, Stock_Minimo, Stock_Maximo } = req.body
  try {
    const [result] = await pool.query(`
      UPDATE material
      SET Nombre_Material=?, Categoria=?, Stock_Actual=?, Unidad=?, Stock_Minimo=?, Stock_Maximo=?
      WHERE Id_Material=?
    `, [Nombre_Material, Categoria, Stock_Actual, Unidad, Stock_Minimo, Stock_Maximo, req.params.id])

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Material no encontrado' })
    res.json({ mensaje: 'Material actualizado' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE material
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM material WHERE Id_Material = ?', [req.params.id])
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Material no encontrado' })
    res.json({ mensaje: 'Material eliminado' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
