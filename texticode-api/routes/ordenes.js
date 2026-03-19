import { Router } from 'express'
import pool from '../db.js'

const router = Router()

// GET todas las órdenes de producción (con nombre de cliente y producto)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT op.*, 
             u.Nombre_Completo AS Cliente,
             m.Nombre_Material AS Producto
      FROM orden_produccion op
      INNER JOIN usuario u ON op.Id_Cliente = u.Id_Usuario
      INNER JOIN material m ON op.Id_Material = m.Id_Material
      ORDER BY op.Fecha_Limite ASC
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET orden por ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT op.*, 
             u.Nombre_Completo AS Cliente,
             m.Nombre_Material AS Producto
      FROM orden_produccion op
      INNER JOIN usuario u ON op.Id_Cliente = u.Id_Usuario
      INNER JOIN material m ON op.Id_Material = m.Id_Material
      WHERE op.Id_Orden = ?
    `, [req.params.id])

    if (rows.length === 0) return res.status(404).json({ error: 'Orden no encontrada' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET órdenes por estado
router.get('/estado/:estado', async (req, res) => {
  const estadosValidos = ['En Proceso', 'Completada', 'Cancelada']
  if (!estadosValidos.includes(req.params.estado))
    return res.status(400).json({ error: 'Estado inválido' })

  try {
    const [rows] = await pool.query(`
      SELECT op.*, u.Nombre_Completo AS Cliente, m.Nombre_Material AS Producto
      FROM orden_produccion op
      INNER JOIN usuario u ON op.Id_Cliente = u.Id_Usuario
      INNER JOIN material m ON op.Id_Material = m.Id_Material
      WHERE op.Estado = ?
    `, [req.params.estado])
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST crear orden
router.post('/', async (req, res) => {
  const { Id_Cliente, Id_Producto, Cantidad, Prioridad, Fecha_Limite, Descripcion, Estado } = req.body
  if (!Id_Cliente || !Id_Producto || !Cantidad || !Fecha_Limite || !Descripcion)
    return res.status(400).json({ error: 'Faltan campos obligatorios' })

  try {
    const [result] = await pool.query(`
      INSERT INTO orden_produccion (Id_Cliente, Id_Producto, Cantidad, Prioridad, Fecha_Limite, Descripcion, Estado)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [Id_Cliente, Id_Producto, Cantidad, Prioridad || 'Media', Fecha_Limite, Descripcion, Estado || 'En Proceso'])

    res.status(201).json({ mensaje: 'Orden creada', Id_Orden: result.insertId })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT actualizar orden
router.put('/:id', async (req, res) => {
  const { Id_Cliente, Id_Producto, Cantidad, Prioridad, Fecha_Limite, Descripcion, Estado } = req.body
  try {
    const [result] = await pool.query(`
      UPDATE orden_produccion
      SET Id_Cliente=?, Id_Producto=?, Cantidad=?, Prioridad=?, Fecha_Limite=?, Descripcion=?, Estado=?
      WHERE Id_Orden=?
    `, [Id_Cliente, Id_Producto, Cantidad, Prioridad, Fecha_Limite, Descripcion, Estado, req.params.id])

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Orden no encontrada' })
    res.json({ mensaje: 'Orden actualizada' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE orden
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM orden_produccion WHERE Id_Orden = ?', [req.params.id])
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Orden no encontrada' })
    res.json({ mensaje: 'Orden eliminada' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
