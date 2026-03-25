<template>
  <div class="layout">
    <AppSidebar :rol="rolNormalizado" />

    <main class="main">
      <header class="hero panel">
        <div>
          <p class="eyebrow">Texticode Neural OS</p>
          <h1>Centro de Inteligencia Artificial</h1>
          <p class="subtitle">
            IA conectada al backend para análisis reales de órdenes, riesgos y recomendaciones por perfil.
          </p>
        </div>
        <div class="hero-badge">{{ etiquetaRol }}</div>
      </header>

      <section class="kpi-grid">
        <article class="kpi-card" v-for="kpi in kpis" :key="kpi.label">
          <p>{{ kpi.label }}</p>
          <strong>{{ kpi.value }}</strong>
          <span>{{ kpi.hint }}</span>
        </article>
      </section>

      <section class="workspace">
        <article class="panel copiloto">
          <div class="panel-head">
            <h2>Copiloto IA</h2>
            <span>{{ estadoAnalisis }}</span>
          </div>

          <div class="quick-prompts">
            <button
              v-for="prompt in promptsRol"
              :key="prompt"
              class="chip"
              @click="consulta = prompt"
            >
              {{ prompt }}
            </button>
          </div>

          <textarea
            v-model="consulta"
            class="prompt-box"
            rows="4"
            placeholder="Ejemplo: Detecta riesgos de retraso para mis órdenes de esta semana"
          />

          <div class="actions">
            <button class="btn-primary" :disabled="loading" @click="ejecutarIA">
              {{ loading ? 'Analizando...' : 'Ejecutar análisis' }}
            </button>
            <button class="btn-secondary" :disabled="loading" @click="autollenarDemo">Demo rápida</button>
          </div>

          <Transition name="fade">
            <div v-if="respuesta" class="response-box">
              <h3>Respuesta de IA</h3>
              <p>{{ respuesta.resumen }}</p>
              <ul>
                <li v-for="accion in respuesta.acciones" :key="accion">{{ accion }}</li>
              </ul>
              <div class="confidence">Precisión estimada: {{ respuesta.confianza }}%</div>
            </div>
          </Transition>

          <p v-if="error" class="error">{{ error }}</p>
        </article>

        <article class="panel insights">
          <div class="panel-head">
            <h2>Alertas inteligentes</h2>
            <span>{{ alertas.length }} activas</span>
          </div>

          <div class="alerts">
            <div class="alert" v-for="alerta in alertas" :key="alerta.titulo">
              <div>
                <h4>{{ alerta.titulo }}</h4>
                <p>{{ alerta.detalle }}</p>
              </div>
              <span class="severity" :class="alerta.nivel">{{ alerta.nivel }}</span>
            </div>
          </div>
        </article>
      </section>



      <section class="panel execution">
        <div class="panel-head">
          <h2>Plan de ejecución IA</h2>
          <span>Lo que sí puedes hacer hoy</span>
        </div>

        <div class="execution-grid">
          <article class="mini-panel">
            <h3>Top prioridades</h3>
            <div v-if="prioridades.length === 0" class="empty">Sin prioridades críticas por ahora.</div>
            <ul v-else class="priority-list">
              <li v-for="item in prioridades" :key="item.idOrden">
                <div>
                  <strong>#{{ item.idOrden }} · {{ item.titulo }}</strong>
                  <p>{{ item.razon }}</p>
                </div>
                <span class="score">{{ item.score }}</span>
              </li>
            </ul>
          </article>

          <article class="mini-panel">
            <h3>Playbook recomendado</h3>
            <ul class="playbook">
              <li><strong>Ahora:</strong> {{ playbook.inmediato || '—' }}</li>
              <li><strong>Esta semana:</strong> {{ playbook.estaSemana || '—' }}</li>
              <li><strong>Comunicación:</strong> {{ playbook.comunicacion || '—' }}</li>
            </ul>
          </article>
        </div>
      </section>

      <section class="panel automation">
        <div class="panel-head">
          <h2>Automatizaciones recomendadas</h2>
          <span>Basadas en tu rol y datos actuales</span>
        </div>
        <div class="automation-grid">
          <article v-for="auto in automatizaciones" :key="auto.nombre" class="auto-card">
            <h4>{{ auto.nombre }}</h4>
            <p>{{ auto.descripcion }}</p>
            <button class="btn-secondary" @click="simularAutomatizacion(auto)">Simular</button>
          </article>
        </div>
      </section>

      <Transition name="fade">
        <div v-if="toast" class="toast">{{ toast }}</div>
      </Transition>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '../../stores/auth'
import AppSidebar from '../../components/AppSidebar.vue'
import { analizarConIA } from '../../services/api'

const auth = useAuthStore()
const consulta = ref('')
const respuesta = ref(null)
const toast = ref('')
const loading = ref(false)
const error = ref('')
const kpis = ref([])
const alertas = ref([])
const automatizaciones = ref([])
const prioridades = ref([])
const playbook = ref({})

const rolNormalizado = computed(() => {
  const rol = (auth.rol || '').toLowerCase()
  return rol === 'administrador' ? 'admin' : rol
})

const etiquetaRol = computed(() => ({
  admin: 'Administrador IA',
  operario: 'Operario IA',
  cliente: 'Cliente IA',
}[rolNormalizado.value] || 'Usuario IA'))

const estadoAnalisis = computed(() => {
  if (loading.value) return 'Consultando backend IA...'
  return 'Conectado a /api/ia/analizar'
})

const promptsPorRol = {
  admin: [
    'Prioriza órdenes atrasadas y sugiere plan de contingencia.',
    'Detecta riesgo de quiebre de inventario para esta semana.',
    'Genera acciones para subir el cumplimiento de entregas.',
  ],
  operario: [
    '¿Qué tareas debo resolver primero para evitar atrasos?',
    'Sugiere secuencia óptima de trabajo para hoy.',
    'Detecta bloqueos por material faltante en mis órdenes.',
  ],
  cliente: [
    'Dame estimación realista de entrega de mis pedidos.',
    'Resume estado de mis órdenes y próximos hitos.',
    'Recomienda cómo reducir riesgo de retrasos.',
  ],
}

const promptsRol = computed(() => promptsPorRol[rolNormalizado.value] || promptsPorRol.cliente)

onMounted(async () => {
  consulta.value = promptsRol.value[0]
  await ejecutarIA()
})

async function ejecutarIA() {
  if (!consulta.value.trim()) {
    lanzarToast('Selecciona o escribe una consulta para analizar.')
    return
  }

  loading.value = true
  error.value = ''

  try {
    const data = await analizarConIA({
      rol: rolNormalizado.value,
      idUsuario: auth.idUsuario,
      consulta: consulta.value,
    })

    kpis.value = Array.isArray(data.kpis) ? data.kpis : []
    alertas.value = Array.isArray(data.alertas) ? data.alertas : []
    automatizaciones.value = Array.isArray(data.automatizaciones) ? data.automatizaciones : []
    prioridades.value = Array.isArray(data.prioridades) ? data.prioridades : []
    playbook.value = data.playbook || {}
    respuesta.value = data.respuesta || null
  } catch (e) {
    error.value = e.message || 'No se pudo conectar con el backend de IA.'
    lanzarToast('Error conectando IA. Verifica backend.')
  } finally {
    loading.value = false
  }
}

function autollenarDemo() {
  consulta.value = promptsRol.value[1] || promptsRol.value[0]
  ejecutarIA()
}

function simularAutomatizacion(auto) {
  lanzarToast(`Automatización "${auto.nombre}" simulada correctamente.`)
}

function lanzarToast(mensaje) {
  toast.value = mensaje
  setTimeout(() => {
    toast.value = ''
  }, 2200)
}
</script>

<style scoped>
.layout { display: flex; min-height: 100vh; }
.main {
  margin-left: 260px;
  width: calc(100% - 260px);
  padding: 24px;
  position: relative;
  z-index: 3;
  display: grid;
  gap: 14px;
}
.panel {
  background: linear-gradient(145deg, rgba(255,255,255,.95), rgba(248,250,252,.85));
  border: 1px solid rgba(148,163,184,.24);
  border-radius: 18px;
  box-shadow: 0 12px 30px rgba(15,23,42,.08);
}
.hero {
  padding: 18px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}
.eyebrow { color: #2563eb; font-weight: 700; letter-spacing: .06em; font-size: 12px; text-transform: uppercase; }
h1 { font-size: clamp(24px, 3vw, 34px); color: #0f172a; margin: 5px 0 8px; line-height: 1.15; }
.subtitle { color: #475569; max-width: 760px; }
.hero-badge {
  background: linear-gradient(120deg,#1d4ed8,#06b6d4);
  color: #fff;
  border-radius: 999px;
  padding: 10px 14px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}
.kpi-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 12px; }
.kpi-card { padding: 14px; background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; display: grid; gap: 4px; }
.kpi-card p { color: #64748b; font-size: 13px; }
.kpi-card strong { font-size: 26px; color: #0f172a; line-height: 1.1; }
.kpi-card span { color: #0284c7; font-size: 12px; font-weight: 600; }
.workspace { display: grid; grid-template-columns: 1.2fr .8fr; gap: 12px; }
.panel-head { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 10px; }
.panel-head h2 { font-size: 18px; color: #111827; }
.panel-head span { color: #64748b; font-size: 12px; }
.copiloto, .insights, .automation { padding: 16px; }
.quick-prompts { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
.chip { border: 1px solid #bfdbfe; background: #eff6ff; color: #1e40af; border-radius: 999px; font-size: 12px; padding: 7px 12px; cursor: pointer; }
.chip:hover { background: #dbeafe; }
.prompt-box { width: 100%; border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px; font-family: inherit; resize: vertical; min-height: 90px; }
.actions { display: flex; gap: 10px; margin: 10px 0 0; }
.btn-primary, .btn-secondary { border-radius: 10px; border: none; padding: 9px 14px; font-weight: 600; cursor: pointer; }
.btn-primary { background: linear-gradient(120deg,#2563eb,#06b6d4); color: white; }
.btn-primary:disabled { opacity: .6; cursor: not-allowed; }
.btn-secondary { background: #e2e8f0; color: #0f172a; }
.response-box { margin-top: 12px; border-radius: 12px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; }
.response-box h3 { margin-bottom: 6px; color: #111827; }
.response-box p { color: #334155; font-size: 14px; margin-bottom: 6px; }
.response-box ul { padding-left: 18px; display: grid; gap: 4px; color: #0f172a; font-size: 14px; }
.confidence { margin-top: 8px; font-size: 12px; color: #0284c7; font-weight: 700; }
.alerts { display: grid; gap: 8px; }
.alert { border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px; display: flex; justify-content: space-between; gap: 10px; align-items: center; background: #fff; }
.alert h4 { font-size: 14px; color: #0f172a; }
.alert p { font-size: 13px; color: #475569; }
.severity { border-radius: 999px; padding: 5px 9px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
.severity.alta { background: #fee2e2; color: #b91c1c; }
.severity.media { background: #fef3c7; color: #92400e; }
.severity.baja { background: #dcfce7; color: #166534; }
.automation-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 10px; }
.auto-card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; background: #fff; display: grid; gap: 8px; }
.auto-card h4 { color: #0f172a; font-size: 15px; }
.auto-card p { color: #475569; font-size: 13px; min-height: 36px; }
.error { color: #b91c1c; font-size: 13px; margin-top: 8px; }
.toast { position: fixed; right: 24px; bottom: 22px; background: #0f172a; color: #fff; padding: 10px 14px; border-radius: 10px; font-size: 13px; box-shadow: 0 14px 40px rgba(2,6,23,.35); }

.execution { padding: 16px; }
.execution-grid { display: grid; grid-template-columns: 1.1fr .9fr; gap: 10px; }
.mini-panel { border: 1px solid #e2e8f0; border-radius: 12px; background: #fff; padding: 12px; }
.mini-panel h3 { font-size: 15px; color: #0f172a; margin-bottom: 8px; }
.empty { color: #64748b; font-size: 13px; }
.priority-list { list-style: none; display: grid; gap: 8px; }
.priority-list li { display: flex; justify-content: space-between; gap: 10px; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; }
.priority-list p { font-size: 12px; color: #475569; margin-top: 2px; }
.score { background: #dbeafe; color: #1d4ed8; border-radius: 999px; font-weight: 700; font-size: 12px; height: fit-content; padding: 5px 8px; }
.playbook { list-style: none; display: grid; gap: 8px; font-size: 13px; color: #334155; }

.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 1200px) {
  .kpi-grid, .automation-grid { grid-template-columns: 1fr 1fr; }
  .workspace { grid-template-columns: 1fr; }
  .execution-grid { grid-template-columns: 1fr; }
}

@media (max-width: 900px) {
  .main {
    margin-left: 0;
    width: 100%;
    padding: 16px;
  }
  .hero { flex-direction: column; }
  .kpi-grid, .automation-grid { grid-template-columns: 1fr; }
}
</style>
