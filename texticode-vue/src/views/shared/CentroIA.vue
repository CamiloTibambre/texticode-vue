<template>
  <div class="layout">
    <AppSidebar :rol="rolNormalizado" />

    <main class="main">
      <header class="hero">
        <div>
          <p class="eyebrow">Texticode Neural OS</p>
          <h1>Centro de Inteligencia Artificial</h1>
          <p class="subtitle">
            Un copiloto unificado para administración, operación y clientes: predicción de riesgo,
            automatización y recomendaciones en tiempo real.
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
            <span>Contexto: {{ etiquetaRol }}</span>
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
            placeholder="Describe lo que necesitas y la IA propondrá acciones concretas"
          />

          <div class="actions">
            <button class="btn-primary" @click="ejecutarIA">Ejecutar análisis</button>
            <button class="btn-secondary" @click="autollenarDemo">Cargar demo wow</button>
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

      <section class="panel automation">
        <div class="panel-head">
          <h2>Automatizaciones por rol</h2>
          <span>Activación en 1 clic</span>
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
import { computed, ref } from 'vue'
import { useAuthStore } from '../../stores/auth'
import AppSidebar from '../../components/AppSidebar.vue'

const auth = useAuthStore()
const consulta = ref('')
const respuesta = ref(null)
const toast = ref('')

const rolNormalizado = computed(() => {
  const rol = (auth.rol || '').toLowerCase()
  return rol === 'administrador' ? 'admin' : rol
})

const etiquetaRol = computed(() => ({
  admin: 'Administrador IA',
  operario: 'Operario IA',
  cliente: 'Cliente IA',
}[rolNormalizado.value] || 'Usuario IA'))

const promptsPorRol = {
  admin: [
    'Predice retrasos críticos para esta semana',
    'Optimiza personal por carga de trabajo',
    'Detecta riesgo de quiebre de inventario',
  ],
  operario: [
    '¿Qué tareas debo priorizar hoy?',
    'Sugiere secuencia para terminar más rápido',
    'Anticipa bloqueos de materiales',
  ],
  cliente: [
    '¿Cuándo llegará mi pedido con más precisión?',
    'Genera actualización profesional para mi equipo',
    'Recomienda opciones para pedido urgente',
  ],
}

const promptsRol = computed(() => promptsPorRol[rolNormalizado.value] || promptsPorRol.cliente)

const kpis = computed(() => {
  if (rolNormalizado.value === 'admin') {
    return [
      { label: 'Pedidos analizados', value: '1,284', hint: '+18% con IA' },
      { label: 'Riesgo detectado', value: '7 alertas', hint: '3 críticos' },
      { label: 'Ahorro operativo', value: '22.4 h/sem', hint: 'Automatizaciones' },
    ]
  }

  if (rolNormalizado.value === 'operario') {
    return [
      { label: 'Tareas recomendadas', value: '12', hint: 'Orden óptimo' },
      { label: 'Productividad estimada', value: '+16%', hint: 'Con secuencia IA' },
      { label: 'Errores prevenidos', value: '9', hint: 'Últimos 7 días' },
    ]
  }

  return [
    { label: 'Pedidos monitoreados', value: '24/7', hint: 'Seguimiento automático' },
    { label: 'Consultas resueltas', value: '92%', hint: 'Sin espera humana' },
    { label: 'ETA inteligente', value: '±6h', hint: 'Predicción dinámica' },
  ]
})

const alertas = computed(() => {
  if (rolNormalizado.value === 'admin') {
    return [
      { titulo: 'Inventario bajo en tela denim', detalle: 'Proyección de quiebre en 3 días para línea Premium.', nivel: 'alta' },
      { titulo: 'Cuello de botella en corte', detalle: 'La estación 2 superó 92% de carga por tercer día consecutivo.', nivel: 'media' },
      { titulo: 'Cliente VIP en riesgo', detalle: 'Orden #9811 con probabilidad de retraso del 68%.', nivel: 'alta' },
    ]
  }

  if (rolNormalizado.value === 'operario') {
    return [
      { titulo: 'Prioridad dinámica actualizada', detalle: 'La orden OP-229 pasa a prioridad alta por fecha de entrega.', nivel: 'media' },
      { titulo: 'Calidad preventiva', detalle: 'Posible error de tallaje detectado en lote L-42.', nivel: 'alta' },
      { titulo: 'Reabastecimiento recomendado', detalle: 'Solicitar hilo negro para evitar pausa en 2 horas.', nivel: 'media' },
    ]
  }

  return [
    { titulo: 'Entrega adelantada', detalle: 'Tu orden #5012 se entregará 1 día antes del estimado.', nivel: 'baja' },
    { titulo: 'Riesgo climático', detalle: 'Posible demora logística de 4h por lluvias en ruta.', nivel: 'media' },
    { titulo: 'Factura y comprobante listos', detalle: 'IA detectó que ya puedes descargar tus documentos.', nivel: 'baja' },
  ]
})

const automatizaciones = computed(() => {
  if (rolNormalizado.value === 'admin') {
    return [
      { nombre: 'Planificador de turnos IA', descripcion: 'Redistribuye operarios según demanda y habilidades.' },
      { nombre: 'Generador de reportes ejecutivos', descripcion: 'Crea reportes semanales con insights y acciones.' },
      { nombre: 'Alertador de fuga de clientes', descripcion: 'Predice clientes con riesgo de abandono.' },
    ]
  }
  if (rolNormalizado.value === 'operario') {
    return [
      { nombre: 'Asistente de avance por voz', descripcion: 'Transforma notas de voz a reportes estructurados.' },
      { nombre: 'Inspector visual inteligente', descripcion: 'Checklist automático para evitar defectos.' },
      { nombre: 'Reprogramador automático', descripcion: 'Reordena tareas cuando hay bloqueos.' },
    ]
  }
  return [
    { nombre: 'Asistente de pedidos 24/7', descripcion: 'Responde dudas y sugiere próximos pasos del pedido.' },
    { nombre: 'Comunicador proactivo', descripcion: 'Envía actualizaciones claras al detectar cambios.' },
    { nombre: 'Cotizador inteligente', descripcion: 'Simula costos y tiempos para nuevas órdenes.' },
  ]
})

function ejecutarIA() {
  const q = consulta.value.trim()
  if (!q) {
    lanzarToast('Escribe o selecciona una consulta para ejecutar la IA.')
    return
  }

  const baseAcciones = {
    admin: [
      'Reasignar 2 operarios al módulo de corte entre 2:00 PM y 6:00 PM.',
      'Lanzar compra automática de 800 m de denim con proveedor alterno.',
      'Enviar alerta ejecutiva al dashboard de dirección con plan de contingencia.',
    ],
    operario: [
      'Iniciar por OP-229, luego OP-233 y cerrar con OP-224 para minimizar cambios de máquina.',
      'Registrar control de calidad al 40% y al 80% del avance para prevenir reproceso.',
      'Solicitar reposición de hilo negro antes de las 3:30 PM para evitar pausa.',
    ],
    cliente: [
      'Notificar a tu equipo ETA inteligente con ventana 10:00 AM - 2:00 PM.',
      'Activar seguimiento premium con alertas por WhatsApp y correo.',
      'Preparar comprobante y guía en cuanto el pedido pase a despacho.',
    ],
  }

  respuesta.value = {
    resumen: `Analicé tu solicitud: "${q}". Encontré oportunidades inmediatas para mejorar tiempo, costo y experiencia.`,
    acciones: baseAcciones[rolNormalizado.value] || baseAcciones.cliente,
    confianza: Math.floor(Math.random() * 8) + 92,
  }
}

function autollenarDemo() {
  consulta.value = promptsRol.value[0]
  ejecutarIA()
}

function simularAutomatizacion(auto) {
  lanzarToast(`Automatización "${auto.nombre}" ejecutada con éxito.`)
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
.main { margin-left: 260px; width: calc(100% - 260px); padding: 28px; position: relative; z-index: 3; }
.hero { display: flex; justify-content: space-between; gap: 20px; align-items: flex-start; margin-bottom: 20px; }
.eyebrow { color: #2563eb; font-weight: 700; letter-spacing: .06em; font-size: 12px; text-transform: uppercase; }
h1 { font-size: 32px; color: #0f172a; margin: 6px 0 8px; }
.subtitle { color: #475569; max-width: 760px; }
.hero-badge { background: linear-gradient(120deg,#2563eb,#06b6d4); color: white; padding: 10px 14px; border-radius: 999px; font-weight: 600; font-size: 13px; }
.kpi-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 14px; margin-bottom: 18px; }
.kpi-card, .panel { background: rgba(255,255,255,.82); border: 1px solid rgba(148,163,184,.2); border-radius: 16px; box-shadow: 0 14px 32px rgba(15,23,42,.08); backdrop-filter: blur(8px); }
.kpi-card { padding: 16px; display: grid; gap: 6px; }
.kpi-card p { color: #64748b; font-size: 13px; }
.kpi-card strong { font-size: 26px; color: #0f172a; }
.kpi-card span { color: #0ea5e9; font-size: 12px; font-weight: 600; }
.workspace { display: grid; grid-template-columns: 1.2fr .8fr; gap: 14px; margin-bottom: 14px; }
.panel { padding: 16px; }
.panel-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.panel-head h2 { font-size: 18px; color: #111827; }
.panel-head span { color: #64748b; font-size: 13px; }
.quick-prompts { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
.chip { border: 1px solid #bfdbfe; background: #eff6ff; color: #1d4ed8; border-radius: 999px; font-size: 12px; padding: 7px 11px; cursor: pointer; }
.prompt-box { width: 100%; border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px; font-family: inherit; resize: vertical; }
.actions { display: flex; gap: 10px; margin: 10px 0 2px; }
.btn-primary, .btn-secondary { border-radius: 10px; border: 0; padding: 9px 14px; font-weight: 600; cursor: pointer; }
.btn-primary { background: linear-gradient(120deg,#2563eb,#06b6d4); color: #fff; }
.btn-secondary { background: #e2e8f0; color: #0f172a; }
.response-box { margin-top: 12px; border-radius: 12px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; }
.response-box h3 { margin-bottom: 6px; }
.response-box p { color: #334155; font-size: 14px; margin-bottom: 6px; }
.response-box ul { padding-left: 18px; color: #0f172a; display: grid; gap: 4px; font-size: 14px; }
.confidence { margin-top: 8px; font-size: 12px; color: #0ea5e9; font-weight: 700; }
.alerts { display: grid; gap: 8px; }
.alert { border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px; display: flex; justify-content: space-between; gap: 12px; align-items: center; }
.alert h4 { font-size: 14px; color: #0f172a; }
.alert p { font-size: 13px; color: #475569; }
.severity { border-radius: 999px; padding: 5px 10px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
.severity.alta { background: #fee2e2; color: #b91c1c; }
.severity.media { background: #fef3c7; color: #92400e; }
.severity.baja { background: #dcfce7; color: #166534; }
.automation-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 10px; }
.auto-card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; display: grid; gap: 8px; }
.auto-card h4 { color: #0f172a; }
.auto-card p { color: #475569; font-size: 13px; min-height: 34px; }
.toast { position: fixed; right: 26px; bottom: 24px; background: #0f172a; color: white; padding: 10px 14px; border-radius: 10px; font-size: 13px; box-shadow: 0 14px 40px rgba(2,6,23,.35); }
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
@media (max-width: 1100px) {
  .kpi-grid, .automation-grid { grid-template-columns: 1fr; }
  .workspace { grid-template-columns: 1fr; }
}
</style>
