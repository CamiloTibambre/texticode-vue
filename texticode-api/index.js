import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

import usuariosRouter      from './routes/usuarios.js'
import materialesRouter    from './routes/materiales.js'
import ordenesRouter       from './routes/ordenes.js'
import comprobantesRouter  from './routes/comprobantes.js'
import rolesRouter         from './routes/roles.js'
import ordenMaterialRouter from './routes/orden_material.js'
import usuarioOrdenRouter  from './routes/usuario_orden.js'

const app = express()

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/usuarios',       usuariosRouter)
app.use('/api/materiales',     materialesRouter)
app.use('/api/ordenes',        ordenesRouter)
app.use('/api/comprobantes',   comprobantesRouter)
app.use('/api/roles',          rolesRouter)
app.use('/api/orden-material', ordenMaterialRouter)
app.use('/api/usuario-orden',  usuarioOrdenRouter)

app.get('/', (req, res) => {
  res.json({
    mensaje: '✅ Texticode API funcionando',
    endpoints: [
      'GET  /api/usuarios',
      'GET  /api/materiales',
      'GET  /api/ordenes',
      'GET  /api/comprobantes',
      'GET  /api/roles',
      'GET  /api/orden-material/orden/:id',
      'GET  /api/usuario-orden/orden/:id',
    ]
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
})
