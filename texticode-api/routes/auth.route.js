// backend/routes/usuarios.js
// Agrega este endpoint a tu archivo de rutas de usuarios existente
// Instala dependencias si no las tienes: npm install jsonwebtoken bcryptjs

const express = require('express')
const router  = express.Router()
const jwt     = require('jsonwebtoken')
const bcrypt  = require('bcryptjs')
const db      = require('../db')  // tu conexión MySQL existente

const JWT_SECRET  = process.env.JWT_SECRET  || 'cambia_este_secreto_seguro'
const JWT_EXPIRES = process.env.JWT_EXPIRES || '8h'

/**
 * POST /api/usuarios/login
 * Body: { correo: string, contrasena: string }
 * Acepta correo o Nombre_Usuario en el campo "correo"
 */
router.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body

  if (!correo || !contrasena) {
    return res.status(400).json({ error: 'Completa todos los campos.' })
  }

  try {
    const [rows] = await db.execute(
      `SELECT u.Id_Usuario, u.Nombre_Completo, u.Nombre_Usuario,
              u.Correo, u.Contrasena, u.Estado, u.Id_Rol,
              r.Nombre_Rol AS Rol
       FROM usuario u
       INNER JOIN rol r ON r.Id_Rol = u.Id_Rol
       WHERE u.Correo = ? OR u.Nombre_Usuario = ?
       LIMIT 1`,
      [correo, correo]
    )

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' })
    }

    const user = rows[0]

    if (user.Estado === 'inactivo') {
      return res.status(403).json({ error: 'Tu cuenta está inactiva. Contacta al administrador.' })
    }

    // Verifica contraseña — soporta bcrypt y texto plano
    let passwordValida = false
    const esHash = user.Contrasena.startsWith('$2')
    if (esHash) {
      passwordValida = await bcrypt.compare(contrasena, user.Contrasena)
    } else {
      passwordValida = (contrasena === user.Contrasena)
    }

    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' })
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.Id_Usuario, rol: user.Id_Rol, usuario: user.Nombre_Usuario },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    )

    return res.status(200).json({
      token,
      usuario: {
        Id_Usuario:      user.Id_Usuario,
        Nombre_Completo: user.Nombre_Completo,
        Nombre_Usuario:  user.Nombre_Usuario,
        Correo:          user.Correo,
        Id_Rol:          user.Id_Rol,
        Rol:             user.Rol,
        Estado:          user.Estado,
      },
    })

  } catch (err) {
    console.error('Error en /usuarios/login:', err)
    return res.status(500).json({ error: 'Error interno del servidor.' })
  }
})

module.exports = router


/* ─────────────────────────────────────────────────────────
   middleware/authMiddleware.js
   Para proteger otras rutas con JWT
   Uso: router.get('/usuarios', verificarToken, (req, res) => { ... })
──────────────────────────────────────────────────────────*/
/*
const jwt = require('jsonwebtoken')

function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return res.status(401).json({ error: 'Token requerido.' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cambia_este_secreto_seguro')
    req.usuario = decoded
    next()
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido o expirado.' })
  }
}

module.exports = verificarToken
*/


/* ─────────────────────────────────────────────────────────
   .env — Agrega en la raíz de tu backend
──────────────────────────────────────────────────────────*/
/*
DB_HOST=127.0.0.1
DB_PORT=3307
DB_USER=root
DB_PASS=
DB_NAME=texticode
JWT_SECRET=mi_clave_super_secreta_2026
JWT_EXPIRES=8h
*/
