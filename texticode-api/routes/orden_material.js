import { Router } from 'express'
import pool from '../db.js'

const router = Router()

// GET todos los materiales de una orden
router.get('/orden/:idOrden', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT om.*, m.Nombre_Producto, m.Unidad
      FROM orden_material om
      INNER JOIN material m ON om.Id_Producto = m.Id_Material
      WHERE om.Id_Orden = ?
    `, [req.params.idOrden])
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST agregar material a una orden
router.post('/', async (req, res) => {
  const { Id_Orden, Id_Producto, Cantidad_Usada } = req.body
  if (!Id_Orden || !Id_Producto || !Cantidad_Usada)
    return res.status(400).json({ error: 'Faltan campos obligatorios' })

  try {
    await pool.query(`
      INSERT INTO orden_material (Id_Orden, Id_Producto, Cantidad_Usada)
      VALUES (?, ?, ?)
    `, [Id_Orden, Id_Producto, Cantidad_Usada])

    res.status(201).json({ mensaje: 'Material agregado a la orden' })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ error: 'Ese material ya está en la orden' })
    res.status(500).json({ error: err.message })
  }
})

// PUT actualizar cantidad usada
router.put('/:idOrden/:idProducto', async (req, res) => {
  const { Cantidad_Usada } = req.body
  try {
    const [result] = await pool.query(`
      UPDATE orden_material SET Cantidad_Usada=?
      WHERE Id_Orden=? AND Id_Producto=?
    `, [Cantidad_Usada, req.params.idOrden, req.params.idProducto])

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Registro no encontrado' })
    res.json({ mensaje: 'Cantidad actualizada' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE quitar material de una orden
router.delete('/:idOrden/:idProducto', async (req, res) => {
  try {
    const [result] = await pool.query(`
      DELETE FROM orden_material WHERE Id_Orden=? AND Id_Producto=?
    `, [req.params.idOrden, req.params.idProducto])

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Registro no encontrado' })
    res.json({ mensaje: 'Material eliminado de la orden' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
