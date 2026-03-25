import { Router } from 'express'
import pool from '../db.js'
import bcrypt from 'bcryptjs'

const router = Router()

// GET todos los usuarios (con nombre de rol)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT u.Id_Usuario, u.Nombre_Completo, u.Nombre_Usuario,
             u.Correo, u.Telefono, u.Estado, u.Fecha_Registro,
             r.Nombre_Rol AS Rol, r.Id_Rol
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
             u.Correo, u.Telefono, u.Estado, u.Fecha_Registro,
             r.Nombre_Rol AS Rol, r.Id_Rol
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

// POST login — compara con bcrypt
router.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body
  if (!correo || !contrasena)
    return res.status(400).json({ error: 'Correo y contraseña son requeridos' })

  try {
    const [rows] = await pool.query(`
      SELECT u.Id_Usuario, u.Nombre_Completo, u.Nombre_Usuario,
             u.Correo, u.Contrasena, u.Estado, r.Nombre_Rol AS Rol
      FROM usuario u
      INNER JOIN rol r ON u.Id_Rol = r.Id_Rol
      WHERE (u.Correo = ? OR u.Nombre_Usuario = ?) AND u.Estado = 'activo'
    `, [correo, correo])

    if (rows.length === 0)
      return res.status(401).json({ error: 'Credenciales incorrectas o usuario inactivo' })

    const usuario = rows[0]

    // Soporta contraseñas con bcrypt y texto plano (migración gradual)
    let passwordValida = false
    if (usuario.Contrasena.startsWith('$2')) {
      passwordValida = await bcrypt.compare(contrasena, usuario.Contrasena)
    } else {
      passwordValida = (contrasena === usuario.Contrasena)
    }

    if (!passwordValida)
      return res.status(401).json({ error: 'Credenciales incorrectas o usuario inactivo' })

    // No devolver la contraseña al frontend
    const { Contrasena, ...usuarioSinPass } = usuario
    res.json({ mensaje: 'Login exitoso', usuario: usuarioSinPass })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST crear usuario — encripta la contraseña con bcrypt
router.post('/', async (req, res) => {
  const { Id_Rol, Nombre_Completo, Nombre_Usuario, Correo, Estado, Contrasena } = req.body
  if (!Id_Rol || !Nombre_Completo || !Nombre_Usuario || !Correo || !Contrasena)
    return res.status(400).json({ error: 'Faltan campos obligatorios' })

  try {
    const hash = await bcrypt.hash(Contrasena, 10)

    const [result] = await pool.query(`
      INSERT INTO usuario (Id_Rol, Nombre_Completo, Nombre_Usuario, Correo, Estado, Contrasena)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [Id_Rol, Nombre_Completo, Nombre_Usuario, Correo || null, Estado || 'activo', hash])

    res.status(201).json({ mensaje: 'Usuario creado', Id_Usuario: result.insertId })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ error: 'El correo o nombre de usuario ya existe' })
    res.status(500).json({ error: err.message })
  }
})

// PUT actualizar usuario — encripta la contraseña si se envía una nueva
router.put('/:id', async (req, res) => {
  const { Id_Rol, Nombre_Completo, Nombre_Usuario, Correo, Estado, Contrasena } = req.body
  try {
    if (Contrasena && Contrasena.trim() !== '') {
      // Se envió nueva contraseña — encriptarla
      const hash = await bcrypt.hash(Contrasena, 10)
      await pool.query(`
        UPDATE usuario
        SET Id_Rol=?, Nombre_Completo=?, Nombre_Usuario=?, Correo=?, Estado=?, Contrasena=?
        WHERE Id_Usuario=?
      `, [Id_Rol, Nombre_Completo, Nombre_Usuario, Correo || null, Estado, hash, req.params.id])
    } else {
      // No se envió contraseña — mantener la actual
      await pool.query(`
        UPDATE usuario
        SET Id_Rol=?, Nombre_Completo=?, Nombre_Usuario=?, Correo=?, Estado=?
        WHERE Id_Usuario=?
      `, [Id_Rol, Nombre_Completo, Nombre_Usuario, Correo || null, Estado, req.params.id])
    }

    res.json({ mensaje: 'Usuario actualizado' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH inactivar usuario (soft delete)
router.patch('/:id/inactivar', async (req, res) => {
  try {
    const [result] = await pool.query(
      `UPDATE usuario SET Estado = 'inactivo' WHERE Id_Usuario = ?`,
      [req.params.id]
    )
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' })
    res.json({ mensaje: 'Usuario inactivado' })
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
