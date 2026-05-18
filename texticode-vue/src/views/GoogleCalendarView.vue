<template>
  <div class="calendar-page">
    <AppSidebar :rol="rolActual" />

    <main class="calendar-main">
      <section class="hero-card">
        <div>
          <span class="eyebrow">Integración externa · Google Workspace</span>
          <h1>Google Calendar inteligente para Texticode</h1>
          <p>
            Vincula una cuenta existente, sincroniza fechas de entrega, crea recordatorios automáticos
            y permite al administrador saber qué usuarios ya conectaron Google.
          </p>
        </div>
        <div class="hero-orbit" aria-hidden="true">
          <span class="calendar-glyph">G</span>
          <span class="orbit-dot dot-1"></span>
          <span class="orbit-dot dot-2"></span>
          <span class="orbit-dot dot-3"></span>
        </div>
      </section>

      <section class="grid">
        <article class="panel status-panel">
          <div class="panel-head">
            <div>
              <h2>Estado de vinculación</h2>
              <p>Solo se habilita para usuarios creados previamente por el administrador.</p>
            </div>
            <span class="status-pill" :class="status.connected ? 'ok' : 'pending'">
              {{ status.connected ? 'Conectado' : 'Pendiente' }}
            </span>
          </div>

          <div v-if="loading" class="skeleton">Consultando Google Calendar...</div>

          <template v-else>
            <div v-if="status.connected" class="connected-box">
              <div class="google-avatar">G</div>
              <div>
                <strong>{{ status.profile?.email }}</strong>
                <span>Calendario: {{ status.profile?.calendarId || 'primary' }}</span>
                <span>Última sincronización: {{ formatDate(status.profile?.lastSyncAt) }}</span>
              </div>
            </div>

            <div v-else class="empty-box">
              <strong>Vincula tu cuenta de Google</strong>
              <span>Se pedirán permisos de calendario, perfil y correo para OAuth 2.0.</span>
            </div>

            <div class="actions">
              <button class="primary" @click="iniciarVinculacion" :disabled="working">
                {{ status.connected ? 'Reautorizar Google' : 'Vincular cuenta con Google' }}
              </button>
              <button v-if="status.connected" class="danger" @click="desvincular" :disabled="working">
                Desvincular
              </button>
            </div>
          </template>
        </article>

        <article class="panel">
          <h2>Sincronización innovadora</h2>
          <p class="muted">Texticode crea eventos por cada fecha límite de entrega y los mantiene actualizados.</p>

          <div class="feature-list">
            <div class="feature"><span>⚡</span><strong>Eventos automáticos</strong><small>Orden, producto, prioridad, cliente y operario.</small></div>
            <div class="feature"><span>🔔</span><strong>Recordatorios</strong><small>Email 48h antes y alerta 24h antes.</small></div>
            <div class="feature"><span>🎨</span><strong>Color por prioridad</strong><small>Alta, media o baja se reconocen visualmente.</small></div>
            <div class="feature"><span>🔁</span><strong>Actualización segura</strong><small>No duplica eventos: usa el Id de orden Texticode.</small></div>
          </div>

          <button class="sync-btn" @click="sincronizar" :disabled="working || !status.connected">
            Sincronizar entregas ahora
          </button>
          <p v-if="syncResult" class="result">{{ syncResult }}</p>
        </article>
      </section>

      <section class="grid lower">
        <article class="panel">
          <div class="panel-head">
            <div>
              <h2>Próximos eventos Texticode</h2>
              <p>Vista rápida desde el calendario personal conectado.</p>
            </div>
            <button class="ghost" @click="cargarEventos" :disabled="!status.connected || working">Actualizar</button>
          </div>

          <div v-if="events.length" class="event-list">
            <a v-for="event in events" :key="event.id" class="event-card" :href="event.htmlLink" target="_blank" rel="noreferrer">
              <span class="event-date">{{ formatEventDate(event.start) }}</span>
              <strong>{{ event.summary }}</strong>
            </a>
          </div>
          <div v-else class="empty-box compact">Aún no hay eventos Texticode consultados.</div>
        </article>

        <article v-if="esAdmin" class="panel admin-panel">
          <div class="panel-head">
            <div>
              <h2>Usuarios con Google vinculado</h2>
              <p>Control administrativo sin crear usuarios automáticamente desde Google.</p>
            </div>
            <button class="ghost" @click="cargarUsuariosGoogle">Actualizar</button>
          </div>

          <div class="user-table">
            <div v-for="user in connectedUsers" :key="user.Id_Usuario" class="user-row">
              <div>
                <strong>{{ user.Nombre_Completo }}</strong>
                <span>{{ user.Rol }} · {{ user.Correo }}</span>
              </div>
              <span class="mini-pill" :class="user.Google_Email ? 'ok' : 'pending'">
                {{ user.Google_Email ? 'Google activo' : 'Sin vincular' }}
              </span>
            </div>
          </div>
        </article>

        <article class="panel config-panel">
          <h2>Configuración requerida en Google Console</h2>
          <ol>
            <li>Crear un proyecto en Google Cloud Console y habilitar <strong>Google Calendar API</strong>.</li>
            <li>Configurar OAuth consent screen como externo, publicar la app y declarar los scopes de Calendar.</li>
            <li>Crear credenciales OAuth 2.0 tipo Web application.</li>
            <li>Agregar redirect URI: <code>http://localhost:3001/api/google/callback</code> o el dominio real.</li>
            <li>Definir en el backend: <code>GOOGLE_CLIENT_ID</code>, <code>GOOGLE_CLIENT_SECRET</code>, <code>GOOGLE_REDIRECT_URI</code> y <code>FRONTEND_URL</code>.</li>
          </ol>
        </article>
      </section>

      <Transition name="toast">
        <div v-if="message" class="toast" :class="messageType">{{ message }}</div>
      </Transition>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import AppSidebar from '../components/AppSidebar.vue'
import { useAuthStore } from '../stores/auth'
import {
  getGoogleAuthUrl,
  getGoogleCalendarStatus,
  getGoogleConnectedUsers,
  getGoogleUpcomingEvents,
  syncGoogleDeliveryEvents,
  unlinkGoogleCalendar,
} from '../services/api'

const auth = useAuthStore()
const loading = ref(true)
const working = ref(false)
const status = ref({ connected: false, profile: null })
const events = ref([])
const connectedUsers = ref([])
const syncResult = ref('')
const message = ref('')
const messageType = ref('success')

const rolActual = computed(() => {
  const rol = auth.rol
  if (rol === 'administrador') return 'admin'
  return rol || 'cliente'
})
const esAdmin = computed(() => rolActual.value === 'admin')

function notify(text, type = 'success') {
  message.value = text
  messageType.value = type
  setTimeout(() => { message.value = '' }, 3600)
}

async function cargarEstado() {
  loading.value = true
  try {
    status.value = await getGoogleCalendarStatus()
    if (status.value.connected) await cargarEventos()
  } catch (error) {
    notify(error.message, 'error')
  } finally {
    loading.value = false
  }
}

async function iniciarVinculacion() {
  working.value = true
  try {
    const data = await getGoogleAuthUrl('link')
    window.location.href = data.url
  } catch (error) {
    notify(error.message, 'error')
    working.value = false
  }
}

async function desvincular() {
  if (!confirm('¿Deseas desvincular Google Calendar de tu cuenta?')) return
  working.value = true
  try {
    await unlinkGoogleCalendar()
    status.value = { connected: false, profile: null }
    events.value = []
    notify('Cuenta de Google desvinculada correctamente.')
  } catch (error) {
    notify(error.message, 'error')
  } finally {
    working.value = false
  }
}

async function sincronizar() {
  working.value = true
  syncResult.value = ''
  try {
    const result = await syncGoogleDeliveryEvents()
    syncResult.value = `${result.total} eventos creados o actualizados en Google Calendar.`
    notify(result.mensaje)
    await cargarEstado()
  } catch (error) {
    notify(error.message, 'error')
  } finally {
    working.value = false
  }
}

async function cargarEventos() {
  if (!status.value.connected) return
  try {
    const data = await getGoogleUpcomingEvents()
    events.value = data.events || []
  } catch (error) {
    notify(error.message, 'error')
  }
}

async function cargarUsuariosGoogle() {
  if (!esAdmin.value) return
  try {
    const data = await getGoogleConnectedUsers()
    connectedUsers.value = data.users || []
  } catch (error) {
    notify(error.message, 'error')
  }
}

function formatDate(value) {
  if (!value) return 'Sin sincronizar'
  return new Date(value).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })
}

function formatEventDate(start) {
  const value = start?.dateTime || start?.date
  if (!value) return '—'
  return new Date(value).toLocaleDateString('es-CO', { month: 'short', day: '2-digit' })
}

onMounted(async () => {
  await cargarEstado()
  await cargarUsuariosGoogle()
})
</script>

<style scoped>
.calendar-page { min-height: 100vh; display: flex; background: #eef3f8; color: #102033; }
.calendar-main { flex: 1; padding: 30px; margin-left: 0; position: relative; overflow: hidden; }
.hero-card { display: flex; justify-content: space-between; gap: 26px; align-items: center; padding: 30px; border-radius: 28px; color: white; background: radial-gradient(circle at 85% 20%, rgba(66,133,244,.38), transparent 32%), linear-gradient(135deg, #0f172a, #1f3a52 52%, #2563eb); box-shadow: 0 24px 70px rgba(15, 23, 42, .22); margin-bottom: 22px; overflow: hidden; position: relative; }
.eyebrow { text-transform: uppercase; letter-spacing: .16em; font-size: 11px; color: #bfdbfe; font-weight: 800; }
h1 { margin: 8px 0; font-size: clamp(28px, 4vw, 46px); line-height: 1; }
p { line-height: 1.6; }
.hero-card p { max-width: 760px; color: rgba(255,255,255,.82); }
.hero-orbit { width: 150px; height: 150px; border: 1px solid rgba(255,255,255,.24); border-radius: 50%; display: grid; place-items: center; flex: 0 0 auto; animation: float 4s ease-in-out infinite alternate; }
.calendar-glyph { width: 76px; height: 76px; border-radius: 22px; background: #fff; color: #4285f4; display: grid; place-items: center; font-size: 44px; font-weight: 900; box-shadow: 0 18px 40px rgba(0,0,0,.22); }
.orbit-dot { position: absolute; width: 14px; height: 14px; border-radius: 50%; background: #34a853; }
.dot-1 { transform: translate(70px, -45px); background:#ea4335; } .dot-2 { transform: translate(-62px, 50px); background:#fbbc05; } .dot-3 { transform: translate(36px, 70px); }
@keyframes float { to { transform: translateY(-12px) rotate(3deg); } }
.grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(340px, .85fr); gap: 20px; }
.lower { margin-top: 20px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.panel { background: rgba(255,255,255,.92); border: 1px solid rgba(148,163,184,.24); border-radius: 22px; padding: 22px; box-shadow: 0 16px 44px rgba(15, 23, 42, .08); backdrop-filter: blur(14px); }
.panel h2 { margin: 0 0 6px; font-size: 20px; color: #0f172a; }
.panel-head { display: flex; justify-content: space-between; gap: 12px; align-items: flex-start; margin-bottom: 18px; }
.muted, .panel-head p { color: #64748b; margin: 0; font-size: 13px; }
.status-pill, .mini-pill { border-radius: 999px; padding: 7px 11px; font-size: 12px; font-weight: 800; white-space: nowrap; }
.ok { background: #dcfce7; color: #166534; } .pending { background: #fef3c7; color: #92400e; }
.connected-box, .empty-box { display: flex; gap: 14px; align-items: center; padding: 18px; border-radius: 18px; background: #f8fafc; border: 1px dashed #cbd5e1; }
.connected-box div:last-child, .empty-box { display: flex; flex-direction: column; gap: 4px; }
.google-avatar { width: 48px; height: 48px; border-radius: 15px; background: linear-gradient(135deg,#4285f4,#34a853); color: white; display: grid; place-items: center; font-size: 28px; font-weight: 900; }
.actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
button { border: 0; border-radius: 12px; padding: 12px 16px; cursor: pointer; font-weight: 800; transition: .18s ease; }
button:disabled { opacity: .55; cursor: not-allowed; }
.primary, .sync-btn { background: linear-gradient(135deg, #2563eb, #1f3a52); color: white; box-shadow: 0 10px 24px rgba(37,99,235,.24); }
.danger { background: #fee2e2; color: #991b1b; }
.ghost { background: #e0f2fe; color: #075985; }
.feature-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin: 18px 0; }
.feature { padding: 14px; border-radius: 16px; background: #f8fafc; display: grid; gap: 4px; border: 1px solid #e2e8f0; }
.feature span { font-size: 22px; } .feature small { color: #64748b; }
.sync-btn { width: 100%; }
.result { margin: 12px 0 0; color: #166534; font-weight: 700; }
.event-list, .user-table { display: grid; gap: 10px; max-height: 420px; overflow: auto; }
.event-card, .user-row { display: flex; justify-content: space-between; gap: 14px; align-items: center; padding: 14px; border-radius: 16px; background: #f8fafc; border: 1px solid #e2e8f0; text-decoration: none; color: inherit; }
.event-card:hover { border-color: #60a5fa; transform: translateY(-1px); }
.event-date { color: #2563eb; font-weight: 900; text-transform: uppercase; }
.user-row div { display: flex; flex-direction: column; gap: 3px; } .user-row span { color: #64748b; font-size: 12px; }
.user-row .mini-pill { color: inherit; }
.config-panel ol { margin: 12px 0 0; padding-left: 20px; color: #475569; line-height: 1.75; }
code { background: #e2e8f0; padding: 2px 6px; border-radius: 6px; color: #0f172a; }
.skeleton { padding: 24px; border-radius: 16px; background: linear-gradient(90deg,#f8fafc,#e2e8f0,#f8fafc); background-size: 220%; animation: shimmer 1.5s infinite; }
@keyframes shimmer { to { background-position: -220%; } }
.compact { padding: 16px; }
.toast { position: fixed; right: 28px; bottom: 28px; color: white; padding: 14px 18px; border-radius: 14px; box-shadow: 0 18px 40px rgba(15,23,42,.22); background: #166534; z-index: 80; }
.toast.error { background: #b91c1c; }
.toast-enter-active,.toast-leave-active { transition: .25s; } .toast-enter-from,.toast-leave-to { opacity: 0; transform: translateY(10px); }
@media (max-width: 1100px) { .grid, .lower { grid-template-columns: 1fr; } .hero-orbit { display: none; } }
</style>
