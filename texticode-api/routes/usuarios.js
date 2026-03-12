import { Router } from 'express'
import pool from '../db.js'

const router = Router()

// GET todos los usuarios (con nombre de rol)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT u.Id_Usuario, u.Nombre_Completo, u.Nombre_Usuario,
             u.Correo, u.Telefono, u.Direccion, u.Estado,
             r.Nombre_Rol AS Rol
      FROM usuario u
      INNER JOIN rol r ON u.Id_Rol = r.Id_Rol
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET un usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT u.Id_Usuario, u.Nombre_Completo, u.Nombre_Usuario,
             u.Correo, u.Telefono, u.Direccion, u.Estado,
             r.Nombre_Rol AS Rol
      FROM usuario u
      INNER JOIN rol r ON u.Id_Rol = r.Id_Rol
      WHERE u.Id_Usuario = ?
    `, [req.params.id])

    if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST login
router.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body
  if (!correo || !contrasena)
    return res.status(400).json({ error: 'Correo y contraseña son requeridos' })

  try {
    const [rows] = await pool.query(`
      SELECT u.Id_Usuario, u.Nombre_Completo, u.Nombre_Usuario,
             u.Correo, u.Estado, r.Nombre_Rol AS Rol
      FROM usuario u
      INNER JOIN rol r ON u.Id_Rol = r.Id_Rol
      WHERE u.Correo = ? AND u.Contrasena = ? AND u.Estado = 'activo'
    `, [correo, contrasena])

    if (rows.length === 0)
      return res.status(401).json({ error: 'Credenciales incorrectas o usuario inactivo' })

    res.json({ mensaje: 'Login exitoso', usuario: rows[0] })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST crear usuario
router.post('/', async (req, res) => {
  const { Id_Rol, Nombre_Completo, Nombre_Usuario, Correo, Telefono, Direccion, Estado, Contrasena } = req.body
  if (!Id_Rol || !Nombre_Completo || !Nombre_Usuario || !Correo || !Contrasena)
    return res.status(400).json({ error: 'Faltan campos obligatorios' })

  try {
    const [result] = await pool.query(`
      INSERT INTO usuario (Id_Rol, Nombre_Completo, Nombre_Usuario, Correo, Telefono, Direccion, Estado, Contrasena)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [Id_Rol, Nombre_Completo, Nombre_Usuario, Correo, Telefono || null, Direccion || null, Estado || 'activo', Contrasena])

    res.status(201).json({ mensaje: 'Usuario creado', Id_Usuario: result.insertId })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ error: 'El correo o nombre de usuario ya existe' })
    res.status(500).json({ error: err.message })
  }
})

// PUT actualizar usuario
router.put('/:id', async (req, res) => {
  const { Id_Rol, Nombre_Completo, Nombre_Usuario, Correo, Telefono, Direccion, Estado } = req.body
  try {
    const [result] = await pool.query(`
      UPDATE usuario
      SET Id_Rol=?, Nombre_Completo=?, Nombre_Usuario=?, Correo=?, Telefono=?, Direccion=?, Estado=?
      WHERE Id_Usuario=?
    `, [Id_Rol, Nombre_Completo, Nombre_Usuario, Correo, Telefono || null, Direccion || null, Estado, req.params.id])

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' })
    res.json({ mensaje: 'Usuario actualizado' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE usuario
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM usuario WHERE Id_Usuario = ?', [req.params.id])
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' })
    res.json({ mensaje: 'Usuario eliminado' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
