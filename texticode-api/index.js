import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

<<<<<<< HEAD
import usuariosRouter       from './routes/usuarios.js'
import materialesRouter     from './routes/materiales.js'
import ordenesRouter        from './routes/ordenes.js'
import comprobantesRouter   from './routes/comprobantes.js'
import rolesRouter          from './routes/roles.js'
import ordenMaterialRouter  from './routes/orden_material.js'
import usuarioOrdenRouter   from './routes/usuario_orden.js'
import notificacionesRouter from './routes/notificaciones.js'
import authRouter           from './routes/auth.route.js'
=======
import usuariosRouter      from './routes/usuarios.js'
import materialesRouter    from './routes/materiales.js'
import ordenesRouter       from './routes/ordenes.js'
import comprobantesRouter  from './routes/comprobantes.js'
import rolesRouter         from './routes/roles.js'
import ordenMaterialRouter from './routes/orden_material.js'
import usuarioOrdenRouter  from './routes/usuario_orden.js'
>>>>>>> a8905268374bb67a62da02f0c667af47be5c3ab3

const app = express()

app.use(cors({ origin: 'http://localhost:5173' }))
<<<<<<< HEAD
app.use(express.json({ limit: '10mb' }))

app.use('/api/usuarios',         usuariosRouter)
app.use('/api/materiales',       materialesRouter)
app.use('/api/ordenes',          ordenesRouter)
app.use('/api/comprobantes',     comprobantesRouter)
app.use('/api/roles',            rolesRouter)
app.use('/api/orden-material',   ordenMaterialRouter)
app.use('/api/usuario-orden',    usuarioOrdenRouter)
app.use('/api/notificaciones',   notificacionesRouter)
app.use('/api/auth',             authRouter)
=======
app.use(express.json())

app.use('/api/usuarios',       usuariosRouter)
app.use('/api/materiales',     materialesRouter)
app.use('/api/ordenes',        ordenesRouter)
app.use('/api/comprobantes',   comprobantesRouter)
app.use('/api/roles',          rolesRouter)
app.use('/api/orden-material', ordenMaterialRouter)
app.use('/api/usuario-orden',  usuarioOrdenRouter)
>>>>>>> a8905268374bb67a62da02f0c667af47be5c3ab3

app.get('/', (req, res) => {
  res.json({
    mensaje: '✅ Texticode API funcionando',
    endpoints: [
      'GET  /api/usuarios',
      'GET  /api/materiales',
      'GET  /api/ordenes',
      'GET  /api/comprobantes',
      'GET  /api/comprobantes/cliente/:idCliente',
      'GET  /api/roles',
      'GET  /api/orden-material/orden/:id',
      'GET  /api/usuario-orden/orden/:id',
<<<<<<< HEAD
      'POST /api/notificaciones/estado',
      'POST /api/notificaciones/comprobante',
      'POST /api/notificaciones/tarea',
      'GET  /api/notificaciones/estadisticas',
      'POST /api/auth/recuperar-contrasena',
=======
>>>>>>> a8905268374bb67a62da02f0c667af47be5c3ab3
    ]
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
})