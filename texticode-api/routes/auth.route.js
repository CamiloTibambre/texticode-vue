<<<<<<< HEAD
import express  from 'express'
import crypto   from 'crypto'
import sgMail   from '@sendgrid/mail'
import db       from '../db.js'
import jwt      from 'jsonwebtoken'
import bcrypt   from 'bcryptjs'

const router = express.Router()

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
=======
// backend/routes/usuarios.js
// Agrega este endpoint a tu archivo de rutas de usuarios existente
// Instala dependencias si no las tienes: npm install jsonwebtoken bcryptjs

const express = require('express')
const router  = express.Router()
const jwt     = require('jsonwebtoken')
const bcrypt  = require('bcryptjs')
const db      = require('../db')  // tu conexión MySQL existente
>>>>>>> a8905268374bb67a62da02f0c667af47be5c3ab3

const JWT_SECRET  = process.env.JWT_SECRET  || 'cambia_este_secreto_seguro'
const JWT_EXPIRES = process.env.JWT_EXPIRES || '8h'

<<<<<<< HEAD
// ─────────────────────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────────────────────
=======
/**
 * POST /api/usuarios/login
 * Body: { correo: string, contrasena: string }
 * Acepta correo o Nombre_Usuario en el campo "correo"
 */
>>>>>>> a8905268374bb67a62da02f0c667af47be5c3ab3
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

<<<<<<< HEAD
=======
    // Verifica contraseña — soporta bcrypt y texto plano
>>>>>>> a8905268374bb67a62da02f0c667af47be5c3ab3
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

<<<<<<< HEAD
=======
    // Generar token JWT
>>>>>>> a8905268374bb67a62da02f0c667af47be5c3ab3
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
<<<<<<< HEAD
    console.error('Error en /login:', err)
=======
    console.error('Error en /usuarios/login:', err)
>>>>>>> a8905268374bb67a62da02f0c667af47be5c3ab3
    return res.status(500).json({ error: 'Error interno del servidor.' })
  }
})

<<<<<<< HEAD
// ─────────────────────────────────────────────────────────
// POST /api/auth/recuperar-contrasena
// ─────────────────────────────────────────────────────────
router.post('/recuperar-contrasena', async (req, res) => {
  const { email } = req.body

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ mensaje: 'El correo no es válido.' })
  }

  try {
    const [rows] = await db.execute(
      `SELECT u.Id_Usuario, u.Nombre_Completo, u.Correo
       FROM usuario u
       WHERE u.Correo = ?
       LIMIT 1`,
      [email.trim().toLowerCase()]
    )

    if (!rows.length) {
      return res.status(200).json({ mensaje: 'Si el correo está registrado, recibirás el enlace.' })
    }

    const usuario = rows[0]

    const token      = crypto.randomBytes(32).toString('hex')
    const expiracion = new Date(Date.now() + 60 * 60 * 1000)

    await db.execute(
      `INSERT INTO tokens_recuperacion (Id_Usuario, token, expiracion, usado)
       VALUES (?, ?, ?, 0)
       ON DUPLICATE KEY UPDATE token = VALUES(token), expiracion = VALUES(expiracion), usado = 0`,
      [usuario.Id_Usuario, token, expiracion]
    )

    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
    const enlace = `${FRONTEND_URL}/cambiar-contrasena?token=${token}`

    await sgMail.send({
      to:      usuario.Correo,
      from:    process.env.SENDGRID_FROM_EMAIL,
      subject: 'Texticode — Cambiar contraseña',
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
            <tr><td align="center">
              <table width="100%" style="max-width:520px;background:#fff;border-radius:16px;overflow:hidden;
                box-shadow:0 4px 24px rgba(0,0,0,0.10);">
                <tr>
                  <td style="background:linear-gradient(135deg,#1f3a52,#2d6a9f);padding:32px;text-align:center;">
                    <p style="margin:0;font-size:22px;font-weight:700;color:#fff;">Texticode</p>
                    <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.7);">Sistema de gestión textil</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:32px;">
                    <div style="text-align:center;margin-bottom:20px;">
                      <span style="font-size:40px;">🔐</span>
                    </div>
                    <h2 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#0d1f2d;text-align:center;">
                      Cambio de contraseña
                    </h2>
                    <p style="font-size:14px;color:#4b5563;text-align:center;line-height:1.6;">
                      Hola <strong style="color:#1f3a52;">${usuario.Nombre_Completo}</strong>,
                      recibimos una solicitud para cambiar tu contraseña en Texticode.
                    </p>
                    <div style="text-align:center;margin:24px 0;">
                      <a href="${enlace}" style="display:inline-block;padding:14px 32px;
                        background:linear-gradient(135deg,#1f3a52,#2d5478);
                        color:#fff;text-decoration:none;border-radius:10px;
                        font-size:15px;font-weight:600;">
                        Cambiar contraseña
                      </a>
                    </div>
                    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:12px 16px;">
                      <p style="margin:0;font-size:12.5px;color:#92400e;text-align:center;">
                        ⏱ Este enlace expira en <strong>1 hora</strong>.
                      </p>
                    </div>
                    <p style="font-size:12px;color:#9ca3af;text-align:center;margin-top:16px;">
                      Si no solicitaste este cambio, ignora este correo.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 32px 28px;text-align:center;border-top:1px solid #f3f4f6;">
                    <p style="margin:0;font-size:11px;color:#c4c9d4;">
                      Texticode © 2026 · Sistema de gestión textil · ADSO 2026
                    </p>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>
        </body>
        </html>
      `
    })

    return res.status(200).json({ mensaje: 'Si el correo está registrado, recibirás el enlace.' })

  } catch (err) {
    console.error('[recuperar-contrasena]', err?.response?.body || err.message)
    return res.status(500).json({ mensaje: 'Error interno. Intenta más tarde.' })
  }
})

// ─────────────────────────────────────────────────────────
// GET /api/auth/validar-token?token=xxx
// ─────────────────────────────────────────────────────────
router.get('/validar-token', async (req, res) => {
  const { token } = req.query

  if (!token) {
    return res.status(400).json({ mensaje: 'Token requerido' })
  }

  try {
    const [rows] = await db.query(
      `SELECT id FROM tokens_recuperacion
       WHERE token = ? AND usado = 0 AND expiracion > NOW()`,
      [token]
    )

    if (rows.length === 0) {
      return res.status(400).json({ mensaje: 'Token inválido o expirado' })
    }

    return res.status(200).json({ valido: true })
  } catch (error) {
    console.error('Error validando token:', error)
    return res.status(500).json({ mensaje: 'Error del servidor' })
  }
})

// ─────────────────────────────────────────────────────────
// POST /api/auth/cambiar-contrasena
// ─────────────────────────────────────────────────────────
router.post('/cambiar-contrasena', async (req, res) => {
  const { token, nuevaPassword } = req.body

  if (!token || !nuevaPassword) {
    return res.status(400).json({ mensaje: 'Datos incompletos' })
  }

  if (nuevaPassword.length < 8) {
    return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 8 caracteres' })
  }

  try {
    const [rows] = await db.query(
      `SELECT id, Id_Usuario FROM tokens_recuperacion
       WHERE token = ? AND usado = 0 AND expiracion > NOW()`,
      [token]
    )

    if (rows.length === 0) {
      return res.status(400).json({ mensaje: 'El enlace es inválido o ya expiró. Solicita uno nuevo.' })
    }

    const { id: tokenId, Id_Usuario } = rows[0]

    const hash = await bcrypt.hash(nuevaPassword, 10)

    await db.query(
      `UPDATE usuario SET Contrasena = ? WHERE Id_Usuario = ?`,
      [hash, Id_Usuario]
    )

    await db.query(
      `UPDATE tokens_recuperacion SET usado = 1 WHERE id = ?`,
      [tokenId]
    )

    return res.status(200).json({ mensaje: 'Contraseña actualizada exitosamente' })
  } catch (error) {
    console.error('Error cambiando contraseña:', error)
    return res.status(500).json({ mensaje: 'Error del servidor' })
  }
})

export default router
=======
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
>>>>>>> a8905268374bb67a62da02f0c667af47be5c3ab3
