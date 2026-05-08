import { Router } from 'express'
import crypto from 'crypto'
import pool from '../db.js'

const router = Router()

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo'
const GOOGLE_CALENDAR_API = 'https://www.googleapis.com/calendar/v3'
const SCOPES = [
  'openid',
  'email',
  'profile',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly',
]

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
const TIMEZONE = process.env.GOOGLE_CALENDAR_TIMEZONE || 'America/Bogota'

let tablaLista = false

function googleConfig() {
  return {
    clientId: process.env.GOOGLE_CALENDAR_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CALENDAR_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_CALENDAR_REDIRECT_URI || 'http://localhost:3001/api/google-calendar/oauth2callback',
  }
}

function validarConfig() {
  const cfg = googleConfig()
  const faltantes = []
  if (!cfg.clientId) faltantes.push('GOOGLE_CALENDAR_CLIENT_ID')
  if (!cfg.clientSecret) faltantes.push('GOOGLE_CALENDAR_CLIENT_SECRET')
  if (!cfg.redirectUri) faltantes.push('GOOGLE_CALENDAR_REDIRECT_URI')
  return { ok: faltantes.length === 0, faltantes, ...cfg }
}

async function asegurarTabla() {
  if (tablaLista) return
  await pool.query(`
    CREATE TABLE IF NOT EXISTS google_calendar_tokens (
      Id_Usuario INT NOT NULL PRIMARY KEY,
      Google_Email VARCHAR(255) NULL,
      Access_Token TEXT NOT NULL,
      Refresh_Token TEXT NULL,
      Scope TEXT NULL,
      Token_Type VARCHAR(50) NULL,
      Expiry_Date BIGINT NULL,
      Calendar_Id VARCHAR(255) NOT NULL DEFAULT 'primary',
      Sync_Enabled TINYINT(1) NOT NULL DEFAULT 1,
      Created_At TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      Updated_At TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_google_calendar_usuario
        FOREIGN KEY (Id_Usuario) REFERENCES usuario(Id_Usuario)
        ON DELETE CASCADE
    )
  `)
  tablaLista = true
}

function encodeState(state) {
  return Buffer.from(JSON.stringify(state)).toString('base64url')
}

function decodeState(raw) {
  try { return JSON.parse(Buffer.from(raw || '', 'base64url').toString('utf8')) }
  catch { return {} }
}

function escapeIcs(value = '') {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
}

function normalizarFecha(fecha) {
  if (!fecha) return null
  if (fecha instanceof Date) return fecha.toISOString().slice(0, 10)
  return String(fecha).split('T')[0]
}

function fechaOrden(fechaLimite) {
  const base = normalizarFecha(fechaLimite)
  if (!base) return null
  return {
    start: { dateTime: `${base}T09:00:00`, timeZone: TIMEZONE },
    end: { dateTime: `${base}T10:00:00`, timeZone: TIMEZONE },
  }
}

function colorPorPrioridad(prioridad = '') {
  const p = prioridad.toLowerCase()
  if (p === 'alta') return '11'
  if (p === 'media') return '5'
  if (p === 'baja') return '10'
  return '1'
}

function crearEventoOrden(orden, asistentes = [], opciones = {}) {
  const fechas = fechaOrden(orden.Fecha_Limite)
  const resumen = `Texticode: Orden #${orden.Id_Orden}${orden.Producto ? ` - ${orden.Producto}` : ''}`
  const descripcion = [
    `Orden de producción #${orden.Id_Orden}`,
    `Cliente: ${orden.Cliente || orden.Nombre_Cliente || 'No asignado'}`,
    `Producto: ${orden.Producto || 'No especificado'}`,
    `Descripción: ${orden.Descripcion || 'Sin descripción'}`,
    `Cantidad: ${orden.Cantidad || '—'}`,
    `Prioridad: ${orden.Prioridad || 'Media'}`,
    `Estado: ${orden.Estado || 'En Proceso'}`,
    '',
    'Evento sincronizado automáticamente desde Texticode.',
  ].join('\n')

  const event = {
    summary: resumen,
    description: descripcion,
    location: opciones.location || 'Texticode',
    colorId: colorPorPrioridad(orden.Prioridad),
    transparency: 'opaque',
    visibility: opciones.visibility || 'default',
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: Number(opciones.emailReminderMinutes ?? 24 * 60) },
        { method: 'popup', minutes: Number(opciones.popupReminderMinutes ?? 60) },
        { method: 'popup', minutes: 10 },
      ],
    },
    extendedProperties: {
      private: {
        texticodeOrdenId: String(orden.Id_Orden),
        texticodeEstado: orden.Estado || '',
        texticodePrioridad: orden.Prioridad || '',
      },
    },
    source: {
      title: 'Texticode',
      url: FRONTEND_URL,
    },
  }

  if (fechas) Object.assign(event, fechas)
  if (asistentes.length) {
    event.attendees = asistentes
      .filter(a => a.Correo || a.email)
      .map(a => ({ email: a.Correo || a.email, displayName: a.Nombre_Completo || a.nombre || undefined }))
  }
  if (opciones.createMeet) {
    event.conferenceData = {
      createRequest: {
        requestId: `texticode-${orden.Id_Orden}-${crypto.randomUUID()}`.slice(0, 100),
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    }
  }
  return event
}

async function postForm(url, params) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error_description || data.error || `Error HTTP ${res.status}`)
  return data
}

async function googleRequest(url, accessToken, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error?.message || data.error || `Google Calendar HTTP ${res.status}`)
  return data
}

async function obtenerTokenUsuario(idUsuario) {
  await asegurarTabla()
  const [rows] = await pool.query('SELECT * FROM google_calendar_tokens WHERE Id_Usuario = ? AND Sync_Enabled = 1', [idUsuario])
  if (!rows.length) return null
  const token = rows[0]
  const cfg = validarConfig()

  const expiraPronto = token.Expiry_Date && Number(token.Expiry_Date) < Date.now() + 60_000
  if (expiraPronto && token.Refresh_Token && cfg.ok) {
    const refreshed = await postForm(GOOGLE_TOKEN_URL, {
      client_id: cfg.clientId,
      client_secret: cfg.clientSecret,
      refresh_token: token.Refresh_Token,
      grant_type: 'refresh_token',
    })
    token.Access_Token = refreshed.access_token
    token.Expiry_Date = refreshed.expires_in ? Date.now() + refreshed.expires_in * 1000 : token.Expiry_Date
    await pool.query(
      'UPDATE google_calendar_tokens SET Access_Token=?, Expiry_Date=?, Scope=?, Token_Type=? WHERE Id_Usuario=?',
      [token.Access_Token, token.Expiry_Date, refreshed.scope || token.Scope, refreshed.token_type || token.Token_Type, idUsuario]
    )
  }
  return token
}

async function obtenerOrden(idOrden) {
  const [rows] = await pool.query(`
    SELECT op.*, u.Nombre_Completo AS Cliente, u.Correo AS Cliente_Correo,
           oper.Nombre_Completo AS Operario, oper.Correo AS Operario_Correo,
           m.Nombre_Material AS NombreMaterial
    FROM orden_produccion op
    INNER JOIN usuario u ON op.Id_Cliente = u.Id_Usuario
    INNER JOIN material m ON op.Id_Material = m.Id_Material
    LEFT JOIN usuario oper ON op.Id_Operario = oper.Id_Usuario
    WHERE op.Id_Orden = ?
  `, [idOrden])
  return rows[0] || null
}

async function usuariosDestino(orden, body = {}) {
  const ids = new Set((body.userIds || []).filter(Boolean).map(String))
  if (body.includeCliente !== false && orden?.Id_Cliente) ids.add(String(orden.Id_Cliente))
  if (body.includeOperario !== false && orden?.Id_Operario) ids.add(String(orden.Id_Operario))

  let rows = []
  if (body.includeAllUsers) {
    const [all] = await pool.query(`
      SELECT u.Id_Usuario, u.Nombre_Completo, u.Correo, r.Nombre_Rol AS Rol
      FROM usuario u INNER JOIN rol r ON u.Id_Rol = r.Id_Rol
      WHERE u.Estado = 'activo' AND u.Correo IS NOT NULL
    `)
    rows = all
  } else if (body.roles?.length) {
    const placeholders = body.roles.map(() => '?').join(',')
    const [byRole] = await pool.query(`
      SELECT u.Id_Usuario, u.Nombre_Completo, u.Correo, r.Nombre_Rol AS Rol
      FROM usuario u INNER JOIN rol r ON u.Id_Rol = r.Id_Rol
      WHERE u.Estado = 'activo' AND LOWER(r.Nombre_Rol) IN (${placeholders})
    `, body.roles.map(r => String(r).toLowerCase()))
    rows = byRole
  }

  if (ids.size) {
    const placeholders = [...ids].map(() => '?').join(',')
    const [byIds] = await pool.query(`
      SELECT u.Id_Usuario, u.Nombre_Completo, u.Correo, r.Nombre_Rol AS Rol
      FROM usuario u INNER JOIN rol r ON u.Id_Rol = r.Id_Rol
      WHERE u.Id_Usuario IN (${placeholders}) AND u.Correo IS NOT NULL
    `, [...ids])
    rows.push(...byIds)
  }

  return [...new Map(rows.map(u => [String(u.Id_Usuario), u])).values()]
}

router.get('/config', (req, res) => {
  const cfg = validarConfig()
  res.json({ configurado: cfg.ok, faltantes: cfg.faltantes, redirectUri: cfg.redirectUri, scopes: SCOPES, timezone: TIMEZONE })
})

router.get('/auth-url', async (req, res) => {
  const { ok, faltantes, clientId, redirectUri } = validarConfig()
  if (!ok) return res.status(500).json({ error: `Faltan variables de entorno: ${faltantes.join(', ')}` })
  const { userId, returnTo = '/calendario' } = req.query
  if (!userId) return res.status(400).json({ error: 'userId es requerido' })

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: SCOPES.join(' '),
    access_type: 'offline',
    include_granted_scopes: 'true',
    prompt: 'consent',
    state: encodeState({ userId, returnTo }),
  })
  res.json({ url: `${GOOGLE_AUTH_URL}?${params.toString()}` })
})

router.get('/oauth2callback', async (req, res) => {
  const cfg = validarConfig()
  const state = decodeState(req.query.state)
  const returnTo = state.returnTo || '/calendario'
  try {
    if (!cfg.ok) throw new Error(`Faltan variables: ${cfg.faltantes.join(', ')}`)
    if (!req.query.code) throw new Error(req.query.error || 'No llegó el código de autorización')
    if (!state.userId) throw new Error('No llegó el usuario en el state OAuth')

    await asegurarTabla()
    const tokens = await postForm(GOOGLE_TOKEN_URL, {
      code: req.query.code,
      client_id: cfg.clientId,
      client_secret: cfg.clientSecret,
      redirect_uri: cfg.redirectUri,
      grant_type: 'authorization_code',
    })
    const userInfo = await googleRequest(GOOGLE_USERINFO_URL, tokens.access_token)
    const expiryDate = tokens.expires_in ? Date.now() + tokens.expires_in * 1000 : null

    const [prev] = await pool.query('SELECT Refresh_Token FROM google_calendar_tokens WHERE Id_Usuario = ?', [state.userId])
    const refreshToken = tokens.refresh_token || prev[0]?.Refresh_Token || null

    await pool.query(`
      INSERT INTO google_calendar_tokens
        (Id_Usuario, Google_Email, Access_Token, Refresh_Token, Scope, Token_Type, Expiry_Date, Calendar_Id, Sync_Enabled)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'primary', 1)
      ON DUPLICATE KEY UPDATE
        Google_Email=VALUES(Google_Email), Access_Token=VALUES(Access_Token),
        Refresh_Token=COALESCE(VALUES(Refresh_Token), Refresh_Token), Scope=VALUES(Scope),
        Token_Type=VALUES(Token_Type), Expiry_Date=VALUES(Expiry_Date), Sync_Enabled=1
    `, [state.userId, userInfo.email || null, tokens.access_token, refreshToken, tokens.scope, tokens.token_type, expiryDate])

    res.redirect(`${FRONTEND_URL}${returnTo}?googleCalendar=connected`)
  } catch (err) {
    res.redirect(`${FRONTEND_URL}${returnTo}?googleCalendar=error&message=${encodeURIComponent(err.message)}`)
  }
})

router.get('/status/:idUsuario', async (req, res) => {
  await asegurarTabla()
  const [rows] = await pool.query(`
    SELECT Id_Usuario, Google_Email, Calendar_Id, Sync_Enabled, Updated_At
    FROM google_calendar_tokens WHERE Id_Usuario = ?
  `, [req.params.idUsuario])
  res.json({ connected: rows.length > 0 && rows[0].Sync_Enabled === 1, cuenta: rows[0] || null })
})

router.delete('/disconnect/:idUsuario', async (req, res) => {
  await asegurarTabla()
  await pool.query('DELETE FROM google_calendar_tokens WHERE Id_Usuario = ?', [req.params.idUsuario])
  res.json({ mensaje: 'Google Calendar desconectado' })
})

router.get('/events/:idUsuario', async (req, res) => {
  const token = await obtenerTokenUsuario(req.params.idUsuario)
  if (!token) return res.status(404).json({ error: 'El usuario no ha conectado Google Calendar' })
  const params = new URLSearchParams({
    timeMin: req.query.timeMin || new Date().toISOString(),
    maxResults: req.query.maxResults || '20',
    singleEvents: 'true',
    orderBy: 'startTime',
  })
  if (req.query.timeMax) params.set('timeMax', req.query.timeMax)
  const data = await googleRequest(`${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(token.Calendar_Id)}/events?${params}`, token.Access_Token)
  res.json(data.items || [])
})

router.get('/connected-users', async (req, res) => {
  await asegurarTabla()
  const [rows] = await pool.query(`
    SELECT u.Id_Usuario, u.Nombre_Completo, u.Correo, r.Nombre_Rol AS Rol,
           g.Google_Email, g.Updated_At
    FROM google_calendar_tokens g
    INNER JOIN usuario u ON g.Id_Usuario = u.Id_Usuario
    INNER JOIN rol r ON u.Id_Rol = r.Id_Rol
    WHERE g.Sync_Enabled = 1
    ORDER BY r.Nombre_Rol, u.Nombre_Completo
  `)
  res.json(rows)
})

router.post('/orders/:id/sync', async (req, res) => {
  const orden = await obtenerOrden(req.params.id)
  if (!orden) return res.status(404).json({ error: 'Orden no encontrada' })

  const destinatarios = await usuariosDestino(orden, req.body)
  if (!destinatarios.length) return res.status(400).json({ error: 'No se encontraron usuarios destino' })

  const resultados = []
  const asistentes = req.body.includeAttendees === false ? [] : destinatarios

  for (const usuario of destinatarios) {
    try {
      const token = await obtenerTokenUsuario(usuario.Id_Usuario)
      if (!token) {
        resultados.push({ Id_Usuario: usuario.Id_Usuario, nombre: usuario.Nombre_Completo, ok: false, skipped: true, error: 'Google Calendar no conectado' })
        continue
      }
      const event = crearEventoOrden(orden, asistentes, req.body)
      const params = new URLSearchParams({ sendUpdates: req.body.sendUpdates || 'all' })
      if (req.body.createMeet) params.set('conferenceDataVersion', '1')
      const created = await googleRequest(
        `${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(token.Calendar_Id)}/events?${params}`,
        token.Access_Token,
        { method: 'POST', body: JSON.stringify(event) }
      )
      resultados.push({ Id_Usuario: usuario.Id_Usuario, nombre: usuario.Nombre_Completo, ok: true, eventId: created.id, htmlLink: created.htmlLink })
    } catch (err) {
      resultados.push({ Id_Usuario: usuario.Id_Usuario, nombre: usuario.Nombre_Completo, ok: false, error: err.message })
    }
  }

  res.json({ ordenId: orden.Id_Orden, total: resultados.length, creados: resultados.filter(r => r.ok).length, resultados })
})

router.post('/events/manual', async (req, res) => {
  const { creatorUserId, targetUserIds = [], title, description, start, end, attendees = [], reminders = {} } = req.body
  if (!creatorUserId || !title || !start || !end) return res.status(400).json({ error: 'creatorUserId, title, start y end son obligatorios' })

  const ids = targetUserIds.length ? targetUserIds : [creatorUserId]
  const resultados = []
  for (const idUsuario of ids) {
    try {
      const token = await obtenerTokenUsuario(idUsuario)
      if (!token) throw new Error('Google Calendar no conectado')
      const event = {
        summary: title,
        description: description || 'Evento creado desde Texticode.',
        start: { dateTime: start, timeZone: TIMEZONE },
        end: { dateTime: end, timeZone: TIMEZONE },
        attendees,
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: Number(reminders.email ?? 24 * 60) },
            { method: 'popup', minutes: Number(reminders.popup ?? 60) },
          ],
        },
      }
      const created = await googleRequest(`${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(token.Calendar_Id)}/events?sendUpdates=all`, token.Access_Token, { method: 'POST', body: JSON.stringify(event) })
      resultados.push({ Id_Usuario: idUsuario, ok: true, eventId: created.id, htmlLink: created.htmlLink })
    } catch (err) {
      resultados.push({ Id_Usuario: idUsuario, ok: false, error: err.message })
    }
  }
  res.json({ total: resultados.length, creados: resultados.filter(r => r.ok).length, resultados })
})

router.post('/ics/order/:id', async (req, res) => {
  const orden = await obtenerOrden(req.params.id)
  if (!orden) return res.status(404).json({ error: 'Orden no encontrada' })
  const base = normalizarFecha(orden.Fecha_Limite)
  const date = (base || new Date().toISOString().slice(0, 10)).replaceAll('-', '')
  const uid = `texticode-orden-${orden.Id_Orden}@texticode.local`
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Texticode//Google Calendar Sync//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')}`,
    `DTSTART;VALUE=DATE:${date}`,
    `DTEND;VALUE=DATE:${date}`,
    `SUMMARY:${escapeIcs(`Texticode: Orden #${orden.Id_Orden}${orden.Producto ? ` - ${orden.Producto}` : ''}`)}`,
    `DESCRIPTION:${escapeIcs(crearEventoOrden(orden).description)}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeIcs('Recordatorio de orden Texticode')}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  res.json({ filename: `texticode-orden-${orden.Id_Orden}.ics`, content: ics })
})

export default router
