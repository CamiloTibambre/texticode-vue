<template>
  <div class="layout">
    <AppSidebar :rol="rolNormalizado" />

    <main class="main">
      <section class="hero-card">
        <div>
          <span class="eyebrow">Integración externa</span>
          <h1>Google Calendar</h1>
          <p>
            Conecta tu cuenta de Google para crear recordatorios de órdenes, invitar usuarios y consultar próximos eventos desde Texticode.
          </p>
        </div>
        <div class="hero-actions">
          <button v-if="!status.connected" class="btn-primary" @click="conectar" :disabled="cargando || !config.configurado">
            Conectar Google Calendar
          </button>
          <button v-else class="btn-secondary" @click="desconectar" :disabled="cargando">
            Desconectar
          </button>
          <button class="btn-secondary" @click="cargarTodo" :disabled="cargando">Actualizar</button>
        </div>
      </section>

      <div v-if="mensaje" class="alert" :class="mensajeTipo">{{ mensaje }}</div>

      <section v-if="!config.configurado" class="setup-card warning">
        <h2>Configuración pendiente en el backend</h2>
        <p>Para habilitar OAuth agrega estas variables al archivo <code>.env</code> de <strong>texticode-api</strong>:</p>
        <ul>
          <li v-for="env in config.faltantes" :key="env"><code>{{ env }}</code></li>
          <li><code>GOOGLE_CALENDAR_REDIRECT_URI=http://localhost:3001/api/google-calendar/oauth2callback</code></li>
          <li><code>FRONTEND_URL=http://localhost:5173</code></li>
        </ul>
      </section>

      <section class="cards-grid">
        <article class="info-card">
          <span class="card-label">Estado</span>
          <h3>{{ status.connected ? 'Cuenta conectada' : 'Sin conexión' }}</h3>
          <p v-if="status.connected">{{ status.cuenta?.Google_Email }} · Calendario {{ status.cuenta?.Calendar_Id }}</p>
          <p v-else>Conecta cada usuario para poder escribir directamente en su calendario principal.</p>
        </article>
        <article class="info-card">
          <span class="card-label">Recordatorios</span>
          <h3>Email + ventanas emergentes</h3>
          <p>Las órdenes se crean con aviso por correo 24 h antes, popup 60 min antes y popup 10 min antes.</p>
        </article>
        <article class="info-card">
          <span class="card-label">Invitados</span>
          <h3>Cliente, operario y roles</h3>
          <p>Los administradores pueden sincronizar una orden con todos los usuarios conectados o con roles específicos.</p>
        </article>
      </section>

      <section class="panel">
        <div class="panel-head">
          <div>
            <span class="eyebrow">Órdenes</span>
            <h2>Sincronizar fechas límite</h2>
          </div>
          <button v-if="esAdmin" class="btn-primary" @click="sincronizarTodas" :disabled="!status.connected || sincronizando || ordenes.length === 0">
            {{ sincronizando ? 'Sincronizando...' : 'Sincronizar todas' }}
          </button>
        </div>

        <div v-if="cargando" class="empty">Cargando información...</div>
        <div v-else-if="ordenes.length === 0" class="empty">No hay órdenes disponibles para tu rol.</div>
        <div v-else class="orders-list">
          <article v-for="orden in ordenes" :key="orden.Id_Orden" class="order-card">
            <div>
              <div class="order-title">#{{ orden.Id_Orden }} · {{ orden.Producto || orden.Descripcion }}</div>
              <p>{{ orden.Cliente ? `Cliente: ${orden.Cliente}` : '' }} {{ orden.Operario ? `· Operario: ${orden.Operario}` : '' }}</p>
              <div class="order-meta">
                <span>{{ formatFecha(orden.Fecha_Limite) }}</span>
                <span :class="['pill', prioridadClass(orden.Prioridad)]">{{ orden.Prioridad || 'Media' }}</span>
                <span class="pill neutral">{{ orden.Estado || 'En Proceso' }}</span>
              </div>
            </div>
            <div class="order-actions">
              <button class="btn-primary small" @click="sincronizarOrden(orden)" :disabled="!status.connected || sincronizando">
                Añadir a Google
              </button>
              <button class="btn-secondary small" @click="descargarIcs(orden)">Descargar .ics</button>
            </div>
          </article>
        </div>
      </section>

      <section class="panel">
        <div class="panel-head">
          <div>
            <span class="eyebrow">Próximos eventos</span>
            <h2>Tu calendario conectado</h2>
          </div>
        </div>
        <div v-if="!status.connected" class="empty">Conecta Google Calendar para ver tus próximos eventos.</div>
        <div v-else-if="eventos.length === 0" class="empty">No hay eventos próximos sincronizados o visibles.</div>
        <ul v-else class="events-list">
          <li v-for="evento in eventos" :key="evento.id">
            <strong>{{ evento.summary || 'Evento sin título' }}</strong>
            <span>{{ formatEvento(evento) }}</span>
            <a v-if="evento.htmlLink" :href="evento.htmlLink" target="_blank" rel="noreferrer">Abrir</a>
          </li>
        </ul>
      </section>

      <section v-if="esAdmin" class="panel">
        <div class="panel-head">
          <div>
            <span class="eyebrow">Administración</span>
            <h2>Usuarios conectados</h2>
          </div>
        </div>
        <div v-if="usuariosConectados.length === 0" class="empty">Ningún usuario ha conectado Google Calendar todavía.</div>
        <div v-else class="connected-grid">
          <div v-for="u in usuariosConectados" :key="u.Id_Usuario" class="connected-user">
            <strong>{{ u.Nombre_Completo }}</strong>
            <span>{{ u.Rol }} · {{ u.Google_Email || u.Correo }}</span>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from '../components/AppSidebar.vue'
import { useAuthStore } from '../stores/auth'
import {
  getGoogleCalendarConfig,
  getGoogleCalendarAuthUrl,
  getGoogleCalendarStatus,
  desconectarGoogleCalendar,
  getGoogleCalendarEvents,
  getUsuariosGoogleCalendar,
  sincronizarOrdenGoogleCalendar,
  generarIcsOrden,
  getOrdenes,
  getOrdenesDeCliente,
  getOrdenesDeOperario,
} from '../services/api'

const auth = useAuthStore()
const route = useRoute()

const cargando = ref(false)
const sincronizando = ref(false)
const mensaje = ref('')
const mensajeTipo = ref('success')
const config = ref({ configurado: true, faltantes: [] })
const status = ref({ connected: false, cuenta: null })
const eventos = ref([])
const ordenes = ref([])
const usuariosConectados = ref([])

const rolNormalizado = computed(() => {
  const rol = (auth.rol || '').toLowerCase()
  return rol === 'administrador' ? 'admin' : rol
})
const esAdmin = computed(() => rolNormalizado.value === 'admin')

function avisar(texto, tipo = 'success') {
  mensaje.value = texto
  mensajeTipo.value = tipo
  setTimeout(() => { mensaje.value = '' }, 5000)
}

async function conectar() {
  try {
    const data = await getGoogleCalendarAuthUrl(auth.idUsuario, route.path)
    window.location.href = data.url
  } catch (err) {
    avisar(err.message || 'No se pudo iniciar OAuth con Google.', 'danger')
  }
}

async function desconectar() {
  try {
    await desconectarGoogleCalendar(auth.idUsuario)
    status.value = { connected: false, cuenta: null }
    eventos.value = []
    avisar('Google Calendar desconectado correctamente.')
  } catch (err) {
    avisar(err.message || 'No se pudo desconectar Google Calendar.', 'danger')
  }
}

async function cargarOrdenes() {
  if (esAdmin.value) ordenes.value = await getOrdenes()
  else if (rolNormalizado.value === 'cliente') ordenes.value = await getOrdenesDeCliente(auth.idUsuario)
  else if (rolNormalizado.value === 'operario') ordenes.value = await getOrdenesDeOperario(auth.idUsuario)
  else ordenes.value = []
}

async function cargarEventos() {
  if (!status.value.connected) {
    eventos.value = []
    return
  }
  eventos.value = await getGoogleCalendarEvents(auth.idUsuario, { maxResults: 10 })
}

async function cargarTodo() {
  cargando.value = true
  try {
    const [cfg, st] = await Promise.all([
      getGoogleCalendarConfig(),
      getGoogleCalendarStatus(auth.idUsuario),
    ])
    config.value = cfg
    status.value = st
    await Promise.all([
      cargarOrdenes(),
      cargarEventos(),
      esAdmin.value ? getUsuariosGoogleCalendar().then(r => { usuariosConectados.value = r }) : Promise.resolve(),
    ])
  } catch (err) {
    avisar(err.message || 'No se pudo cargar la integración.', 'danger')
  } finally {
    cargando.value = false
  }
}

async function sincronizarOrden(orden) {
  sincronizando.value = true
  try {
    const body = esAdmin.value
      ? { includeCliente: true, includeOperario: true, includeAllUsers: false, includeAttendees: true, sendUpdates: 'all' }
      : { userIds: [auth.idUsuario], includeCliente: false, includeOperario: false, includeAttendees: false, sendUpdates: 'none' }
    const res = await sincronizarOrdenGoogleCalendar(orden.Id_Orden, body)
    avisar(`Orden #${orden.Id_Orden}: ${res.creados}/${res.total} calendarios actualizados.`)
    await cargarEventos()
    if (esAdmin.value) usuariosConectados.value = await getUsuariosGoogleCalendar()
  } catch (err) {
    avisar(err.message || 'No se pudo sincronizar la orden.', 'danger')
  } finally {
    sincronizando.value = false
  }
}

async function sincronizarTodas() {
  sincronizando.value = true
  try {
    let creados = 0
    let total = 0
    for (const orden of ordenes.value) {
      const res = await sincronizarOrdenGoogleCalendar(orden.Id_Orden, {
        includeCliente: true,
        includeOperario: true,
        includeAttendees: true,
        sendUpdates: 'all',
      })
      creados += res.creados
      total += res.total
    }
    avisar(`Sincronización masiva terminada: ${creados}/${total} calendarios actualizados.`)
    await cargarEventos()
  } catch (err) {
    avisar(err.message || 'Error durante la sincronización masiva.', 'danger')
  } finally {
    sincronizando.value = false
  }
}

async function descargarIcs(orden) {
  try {
    const data = await generarIcsOrden(orden.Id_Orden)
    const blob = new Blob([data.content], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = data.filename
    a.click()
    URL.revokeObjectURL(url)
  } catch (err) {
    avisar(err.message || 'No se pudo generar el archivo .ics.', 'danger')
  }
}

function formatFecha(fecha) {
  if (!fecha) return 'Sin fecha límite'
  return new Date(fecha).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
}

function formatEvento(evento) {
  const raw = evento.start?.dateTime || evento.start?.date
  if (!raw) return 'Sin fecha'
  return new Date(raw).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: evento.start?.dateTime ? 'short' : undefined })
}

function prioridadClass(prioridad = '') {
  return {
    alta: 'danger-pill',
    media: 'warning-pill',
    baja: 'success-pill',
  }[prioridad.toLowerCase()] || 'neutral'
}

onMounted(async () => {
  if (route.query.googleCalendar === 'connected') avisar('Cuenta de Google Calendar conectada correctamente.')
  if (route.query.googleCalendar === 'error') avisar(route.query.message || 'Google devolvió un error durante OAuth.', 'danger')
  await cargarTodo()
})
</script>

<style scoped>
.layout { display: flex; min-height: 100vh; background: #f1f5f9; }
.main { flex: 1; padding: 28px 30px; margin-left: 0; }
.hero-card, .panel, .info-card, .setup-card { background: rgba(255,255,255,0.92); border: 1px solid rgba(226,232,240,0.9); border-radius: 18px; box-shadow: 0 18px 45px rgba(15,23,42,0.06); }
.hero-card { padding: 28px; display: flex; justify-content: space-between; gap: 20px; align-items: center; margin-bottom: 18px; }
.eyebrow { display: inline-block; font-size: 11px; text-transform: uppercase; letter-spacing: .12em; color: #2563eb; font-weight: 800; margin-bottom: 6px; }
h1, h2, h3, p { margin: 0; }
h1 { font-size: 34px; color: #0f172a; }
h2 { font-size: 20px; color: #111827; }
h3 { font-size: 18px; color: #1f3a52; margin-bottom: 8px; }
p { color: #64748b; line-height: 1.55; }
.hero-actions { display: flex; gap: 10px; flex-wrap: wrap; justify-content: flex-end; }
.btn-primary, .btn-secondary { border: none; border-radius: 10px; padding: 11px 16px; font-weight: 700; cursor: pointer; transition: .2s ease; }
.btn-primary { background: #1f3a52; color: white; }
.btn-primary:hover:not(:disabled) { background: #162d42; transform: translateY(-1px); }
.btn-secondary { background: white; color: #1f3a52; border: 1px solid #dbe3ea; }
.btn-secondary:hover:not(:disabled) { background: #f8fafc; }
button:disabled { opacity: .55; cursor: not-allowed; }
.small { padding: 8px 12px; font-size: 12px; }
.alert { padding: 12px 16px; border-radius: 12px; margin-bottom: 16px; font-weight: 700; }
.alert.success { background: #dcfce7; color: #166534; }
.alert.danger { background: #fee2e2; color: #991b1b; }
.setup-card { padding: 18px 20px; margin-bottom: 18px; }
.setup-card.warning { border-color: #fde68a; background: #fffbeb; }
.setup-card ul { margin-bottom: 0; color: #92400e; }
code { background: rgba(15,23,42,.08); padding: 2px 6px; border-radius: 6px; }
.cards-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; margin-bottom: 18px; }
.info-card { padding: 20px; }
.card-label { display: inline-block; color: #94a3b8; font-size: 12px; font-weight: 800; margin-bottom: 8px; }
.panel { padding: 22px; margin-bottom: 18px; }
.panel-head { display: flex; justify-content: space-between; gap: 16px; align-items: center; margin-bottom: 18px; }
.empty { padding: 26px; text-align: center; color: #94a3b8; background: #f8fafc; border-radius: 14px; }
.orders-list { display: grid; gap: 12px; }
.order-card { display: flex; justify-content: space-between; gap: 16px; padding: 16px; border: 1px solid #e2e8f0; border-radius: 14px; background: #fff; }
.order-title { font-weight: 800; color: #0f172a; margin-bottom: 6px; }
.order-meta, .order-actions { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 10px; }
.pill { display: inline-flex; border-radius: 999px; padding: 4px 10px; font-size: 11px; font-weight: 800; }
.danger-pill { background: #fee2e2; color: #991b1b; }
.warning-pill { background: #fef3c7; color: #92400e; }
.success-pill { background: #dcfce7; color: #166534; }
.neutral { background: #eef2f7; color: #475569; }
.events-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; }
.events-list li { display: grid; grid-template-columns: 1fr auto auto; gap: 14px; align-items: center; padding: 14px; border-radius: 12px; background: #f8fafc; color: #475569; }
.events-list a { color: #2563eb; font-weight: 800; text-decoration: none; }
.connected-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
.connected-user { padding: 14px; border-radius: 12px; background: #f8fafc; display: flex; flex-direction: column; gap: 4px; }
.connected-user span { color: #64748b; font-size: 13px; }
@media (max-width: 900px) {
  .hero-card, .order-card, .panel-head { flex-direction: column; align-items: stretch; }
  .cards-grid { grid-template-columns: 1fr; }
  .events-list li { grid-template-columns: 1fr; }
}
</style>
