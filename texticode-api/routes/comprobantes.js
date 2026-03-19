import { Router } from 'express'
import pool from '../db.js'

const router = Router()

// GET todos los comprobantes (con usuario y orden)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*,
             u.Nombre_Completo AS Usuario,
             op.Descripcion AS Orden_Descripcion,
             op.Estado AS Orden_Estado
      FROM comprobantes c
      INNER JOIN usuario u ON c.Id_Usuario = u.Id_Usuario
      INNER JOIN orden_produccion op ON c.Id_Orden = op.Id_Orden
      ORDER BY c.Fecha_Limite DESC
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET comprobante por ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*,
             u.Nombre_Completo AS Usuario,
             op.Descripcion AS Orden_Descripcion
      FROM comprobantes c
      INNER JOIN usuario u ON c.Id_Usuario = u.Id_Usuario
      INNER JOIN orden_produccion op ON c.Id_Orden = op.Id_Orden
      WHERE c.Id_Comprobante = ?
    `, [req.params.id])

    if (rows.length === 0) return res.status(404).json({ error: 'Comprobante no encontrado' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST crear comprobante
router.post('/', async (req, res) => {
  const { Id_Usuario, Id_Orden, Estado, Fecha_Limite } = req.body
  if (!Id_Usuario || !Id_Orden)
    return res.status(400).json({ error: 'Id_Usuario e Id_Orden son obligatorios' })

  try {
    const [result] = await pool.query(`
      INSERT INTO comprobantes (Id_Usuario, Id_Orden, Estado, Fecha_Limite)
      VALUES (?, ?, ?, ?)
    `, [Id_Usuario, Id_Orden, Estado || 'Pendiente', Fecha_Limite || null])

    res.status(201).json({ mensaje: 'Comprobante creado', Id_Comprobante: result.insertId })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT actualizar estado del comprobante
router.put('/:id', async (req, res) => {
  const { Estado, Fecha_Limite } = req.body
  try {
    const [result] = await pool.query(`
      UPDATE comprobantes SET Estado=?, Fecha_Limite=? WHERE Id_Comprobante=?
    `, [Estado, Fecha_Limite || null, req.params.id])

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Comprobante no encontrado' })
    res.json({ mensaje: 'Comprobante actualizado' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE comprobante
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM comprobantes WHERE Id_Comprobante = ?', [req.params.id])
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Comprobante no encontrado' })
    res.json({ mensaje: 'Comprobante eliminado' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
