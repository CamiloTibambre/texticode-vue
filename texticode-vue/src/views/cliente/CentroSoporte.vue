<template>
  <div class="layout">
    <AppSidebar rol="cliente" />

    <main class="main">
      <div class="page-head">
        <div>
          <h1>Centro de Soporte</h1>
          <p>Consulta tus comprobantes de entrega, contáctanos y resuelve dudas.</p>
        </div>
        <button class="help-btn" @click="abrirContactoRapido">Ayuda rápida</button>
      </div>

      <div class="tabs">
        <button class="tab" :class="{ active: tab === 'comprobantes' }" @click="tab = 'comprobantes'">
          Mis Comprobantes
          <span v-if="comprobantes.length > 0" class="tab-badge">{{ comprobantes.length }}</span>
        </button>
        <button class="tab" :class="{ active: tab === 'contacto' }" @click="tab = 'contacto'">Contacto</button>
      </div>

      <!-- ── TAB COMPROBANTES ── -->
      <section v-if="tab === 'comprobantes'">
        <div class="toolbar">
          <div class="search-bar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input v-model="busqueda" type="text" placeholder="Buscar por orden, estado o descripción…">
          </div>
          <span class="results-pill">{{ comprobantesFiltrados.length }} resultado{{ comprobantesFiltrados.length === 1 ? '' : 's' }}</span>
        </div>

        <!-- Cargando -->
        <div v-if="cargando" class="state-card loading-card">
          <div class="spinner"></div>
          Cargando comprobantes...
        </div>

        <!-- Sin comprobantes -->
        <div v-else-if="!auth.idUsuario" class="state-card">
          Inicia sesión para ver tus comprobantes.
        </div>
        <div v-else-if="comprobantesFiltrados.length === 0" class="state-card empty-card-full">
          <svg viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.2" width="48" height="48">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="8" y1="13" x2="16" y2="13"/>
            <line x1="8" y1="17" x2="16" y2="17"/>
          </svg>
          <p>No tienes comprobantes registrados aún.</p>
          <p class="empty-sub">Los comprobantes aparecen cuando el administrador marca una orden como completada.</p>
        </div>

        <!-- Lista de comprobantes -->
        <div v-else class="comprobantes-list">
          <article v-for="c in comprobantesFiltrados" :key="c.id" class="card comprobante-card">
            <div class="card-main">
              <div class="doc-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="8" y1="13" x2="16" y2="13"/>
                  <line x1="8" y1="17" x2="16" y2="17"/>
                </svg>
              </div>

              <div class="doc-content">
                <div class="doc-top">
                  <div>
                    <div class="doc-num">Comprobante #{{ c.id }}</div>
                    <div class="doc-title">{{ c.descripcion }}</div>
                  </div>
                  <span class="badge" :class="estadoBadge(c.estado)">{{ c.estado }}</span>
                </div>

                <div class="doc-meta">
                  <div><label>Orden</label><span>#{{ c.idOrden }}</span></div>
                  <div><label>Fecha entrega</label><span>{{ c.fecha }}</span></div>
                  <div><label>Cliente</label><span>{{ c.cliente }}</span></div>
                </div>
              </div>
            </div>

            <div class="card-actions">
              <button class="btn-secondary" @click="verComprobante(c)">Ver detalle</button>
              <button class="btn-primary"   @click="descargarComprobante(c)">Descargar</button>
            </div>
          </article>
        </div>
      </section>

      <!-- ── TAB CONTACTO ── -->
      <section v-else class="contact-grid">
        <article class="info-card card">
          <div class="section-title">Canales de atención</div>
          <div class="contact-list">
            <a class="contact-link" href="tel:+5744445555">
              <strong>Teléfono</strong>
              <span>+57 (4) 444-5555</span>
            </a>
            <a class="contact-link" href="https://wa.me/573001234567" target="_blank" rel="noreferrer">
              <strong>WhatsApp</strong>
              <span>+57 300 123 4567</span>
            </a>
            <a class="contact-link" href="mailto:soporte@texticode.com">
              <strong>Email</strong>
              <span>soporte@texticode.com</span>
            </a>
            <div class="contact-link static">
              <strong>Horario</strong>
              <span>Lunes a viernes · 8:00 AM - 6:00 PM</span>
            </div>
          </div>
        </article>

        <article class="info-card card">
          <div class="section-title">Preguntas frecuentes</div>
          <div class="faq-list">
            <div v-for="faq in faqs" :key="faq.id" class="faq-item">
              <div class="faq-question">{{ faq.pregunta }}</div>
              <div class="faq-answer">{{ faq.respuesta }}</div>
            </div>
          </div>
        </article>
      </section>
    </main>

    <!-- MODAL DETALLE COMPROBANTE -->
    <Transition name="fade">
      <div v-if="previewDoc" class="modal-overlay" @click.self="previewDoc = null">
        <div class="modal-card">
          <div class="modal-head">
            <h3>Comprobante #{{ previewDoc.id }}</h3>
            <button class="close-btn" @click="previewDoc = null">×</button>
          </div>
          <div class="modal-body">
            <div class="modal-row">
              <span class="modal-label">Número de Orden</span>
              <span class="modal-value">#{{ previewDoc.idOrden }}</span>
            </div>
            <div class="modal-row">
              <span class="modal-label">Estado</span>
              <span class="badge" :class="estadoBadge(previewDoc.estado)">{{ previewDoc.estado }}</span>
            </div>
            <div class="modal-row">
              <span class="modal-label">Descripción</span>
              <span class="modal-value">{{ previewDoc.descripcion }}</span>
            </div>
            <div class="modal-row">
              <span class="modal-label">Fecha de entrega</span>
              <span class="modal-value">{{ previewDoc.fecha }}</span>
            </div>
            <div class="modal-row">
              <span class="modal-label">Cliente</span>
              <span class="modal-value">{{ previewDoc.cliente }}</span>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn-secondary" @click="previewDoc = null">Cerrar</button>
            <button class="btn-primary"   @click="descargarComprobante(previewDoc)">Descargar</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- TOAST -->
    <Transition name="fade">
      <div v-if="toastVisible" class="toast">{{ toastMsg }}</div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import AppSidebar from '../../components/AppSidebar.vue'
import { useAuthStore } from '../../stores/auth'
import { getComprobantesPorCliente, getOrdenesDeCliente } from '../../services/api'

const auth = useAuthStore()

const tab          = ref('comprobantes')
const busqueda     = ref('')
const cargando     = ref(true)
const previewDoc   = ref(null)
const toastVisible = ref(false)
const toastMsg     = ref('')
const comprobantes = ref([])

const faqs = [
  { id: 1, pregunta: '¿Cómo puedo rastrear mi pedido?',      respuesta: 'Ve a tu cuenta personal o a la sección de pedidos para revisar el estado actualizado.' },
  { id: 2, pregunta: '¿Dónde descargo mis comprobantes?',    respuesta: 'En esta misma vista, en la pestaña "Mis Comprobantes", aparecen cuando el administrador marca tu orden como completada.' },
  { id: 3, pregunta: '¿Qué hago si necesito un cambio?',     respuesta: 'Contáctanos por WhatsApp o correo y menciona tu número de orden para ayudarte más rápido.' },
  { id: 4, pregunta: '¿Por qué no veo comprobantes todavía?', respuesta: 'Los comprobantes se generan automáticamente cuando el administrador marca tu orden de producción como "Completada".' },
]

// ── FILTRO ─────────────────────────────────────────────────────
const comprobantesFiltrados = computed(() => {
  const q = busqueda.value.trim().toLowerCase()
  if (!q) return comprobantes.value
  return comprobantes.value.filter(c =>
    String(c.id).includes(q) ||
    String(c.idOrden).includes(q) ||
    c.estado.toLowerCase().includes(q) ||
    c.descripcion.toLowerCase().includes(q),
  )
})

// ── CARGA DE DATOS ─────────────────────────────────────────────
onMounted(cargarDatos)

async function cargarDatos() {
  cargando.value = true

  try {
    if (!auth.idUsuario) {
      comprobantes.value = []
      return
    }

    // Usamos el endpoint dedicado que filtra por Id_Cliente en la orden
    const [dataComprobantes, dataOrdenes] = await Promise.all([
      getComprobantesPorCliente(auth.idUsuario),
      getOrdenesDeCliente(auth.idUsuario),
    ])

    const ordenesMap = new Map(
      (Array.isArray(dataOrdenes) ? dataOrdenes : []).map(o => [o.Id_Orden, o])
    )

    comprobantes.value = (Array.isArray(dataComprobantes) ? dataComprobantes : []).map(c => ({
      id:          c.Id_Comprobante,
      idOrden:     c.Id_Orden,
      estado:      c.Estado || 'Pendiente',
      fecha:       formatFecha(c.Fecha_Limite),
      descripcion: ordenesMap.get(c.Id_Orden)?.Descripcion || c.Orden_Descripcion || 'Sin descripción',
      cliente:     auth.usuario?.Nombre_Completo || c.Usuario || 'Cliente',
    }))

  } catch (err) {
    comprobantes.value = []
    mostrarToast('No fue posible cargar los comprobantes.')
  } finally {
    cargando.value = false
  }
}

// ── HELPERS ────────────────────────────────────────────────────
function formatFecha(fecha) {
  if (!fecha) return 'Pendiente'
  return new Date(fecha).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })
}

function estadoBadge(estado) {
  return {
    'Entregado':  'badge-ok',
    'Completada': 'badge-ok',
    'Pendiente':  'badge-warn',
    'En Proceso': 'badge-info',
  }[estado] || 'badge-info'
}

function verComprobante(item) {
  previewDoc.value = item
}

function descargarComprobante(item) {
  const contenido = [
    `===========================`,
    `COMPROBANTE DE ENTREGA #${item.id}`,
    `===========================`,
    `Orden:           #${item.idOrden}`,
    `Estado:          ${item.estado}`,
    `Descripción:     ${item.descripcion}`,
    `Fecha de entrega: ${item.fecha}`,
    `Cliente:         ${item.cliente}`,
    ``,
    `Generado por Texticode — Sistema de Gestión Textil`,
  ].join('\n')

  const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' })
  const url  = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href     = url
  link.download = `comprobante-${item.id}.txt`
  link.click()
  URL.revokeObjectURL(url)
  mostrarToast(`Comprobante #${item.id} descargado correctamente.`)
}

function abrirContactoRapido() {
  tab.value = 'contacto'
  mostrarToast('Te llevamos a los canales de atención.')
}

function mostrarToast(msg) {
  toastMsg.value     = msg
  toastVisible.value = true
  setTimeout(() => { toastVisible.value = false }, 2600)
}
</script>

<style scoped>
.layout { display: flex; min-height: 100vh; background: #f5f7fb; }
.main   { flex: 1; padding: 30px; }

.page-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; margin-bottom: 22px; }
h1 { font-size: 28px; color: #0f172a; margin-bottom: 6px; }
.page-head p { color: #64748b; }

/* TABS */
.tabs { display: flex; gap: 8px; margin-bottom: 22px; }
.tab { border: none; background: #e2e8f0; color: #475569; border-radius: 999px; padding: 10px 18px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: background 0.2s; }
.tab.active { background: #1f3a52; color: white; }
.tab-badge { background: white; color: #1f3a52; border-radius: 999px; font-size: 11px; font-weight: 800; padding: 1px 7px; }
.tab.active .tab-badge { background: rgba(255,255,255,0.25); color: white; }

/* TOOLBAR */
.toolbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
.search-bar { display: flex; align-items: center; gap: 10px; background: white; border: 1px solid #dbe2ea; border-radius: 12px; padding: 12px 14px; flex: 1; max-width: 460px; }
.search-bar svg { width: 18px; height: 18px; color: #94a3b8; flex-shrink: 0; }
.search-bar input { border: none; outline: none; width: 100%; font-size: 14px; background: transparent; }
.results-pill { background: #e0f2fe; color: #0f766e; padding: 8px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; white-space: nowrap; }

/* STATE CARDS */
.state-card { background: white; border: 1px solid #e2e8f0; border-radius: 18px; padding: 26px; color: #64748b; text-align: center; }
.loading-card { display: flex; align-items: center; justify-content: center; gap: 12px; }
.empty-card-full { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 50px 24px; }
.empty-sub { font-size: 13px; color: #94a3b8; max-width: 340px; line-height: 1.6; }

.spinner { width: 26px; height: 26px; border: 3px solid #e2e8f0; border-top-color: #1f3a52; border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }
@keyframes spin { to { transform: rotate(360deg); } }

/* COMPROBANTES LIST */
.comprobantes-list { display: grid; gap: 14px; }
.card { background: white; border: 1px solid #e2e8f0; border-radius: 18px; }
.comprobante-card { padding: 18px 20px; display: flex; align-items: center; justify-content: space-between; gap: 18px; transition: box-shadow 0.2s; }
.comprobante-card:hover { box-shadow: 0 4px 18px rgba(0,0,0,0.07); }
.card-main { display: flex; align-items: flex-start; gap: 16px; flex: 1; min-width: 0; }
.doc-icon { width: 46px; height: 46px; border-radius: 14px; display: flex; align-items: center; justify-content: center; background: #eff6ff; color: #2563eb; flex-shrink: 0; }
.doc-icon svg { width: 22px; height: 22px; }
.doc-content { flex: 1; min-width: 0; }
.doc-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 10px; }
.doc-num   { font-size: 12px; font-weight: 800; color: #2563eb; text-transform: uppercase; letter-spacing: .06em; }
.doc-title { font-size: 16px; font-weight: 700; color: #0f172a; margin-top: 4px; }
.doc-meta  { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.doc-meta label { display: block; font-size: 11px; color: #94a3b8; margin-bottom: 4px; text-transform: uppercase; letter-spacing: .05em; }
.doc-meta span  { color: #334155; font-weight: 600; font-size: 13px; }
.card-actions { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

/* BADGES */
.badge { font-size: 11px; font-weight: 800; border-radius: 999px; padding: 5px 10px; white-space: nowrap; }
.badge-ok   { background: #dcfce7; color: #166534; }
.badge-info { background: #dbeafe; color: #1d4ed8; }
.badge-warn { background: #fef3c7; color: #a16207; }

/* BUTTONS */
.btn-primary, .btn-secondary, .help-btn { border-radius: 10px; padding: 10px 16px; font-weight: 700; cursor: pointer; border: none; font-size: 13px; }
.btn-primary   { background: #1f3a52; color: white; }
.btn-secondary { background: white; color: #334155; border: 1px solid #cbd5e1; }
.help-btn      { background: #0f172a; color: white; }

/* CONTACTO */
.contact-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
.info-card { padding: 22px; }
.section-title { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
.contact-list, .faq-list { display: grid; gap: 12px; }
.contact-link { display: flex; flex-direction: column; gap: 4px; padding: 14px 16px; border-radius: 14px; text-decoration: none; background: #f8fafc; color: #0f172a; border: 1px solid #e2e8f0; }
.contact-link span { color: #475569; }
.contact-link.static { cursor: default; }
.faq-item { padding: 14px 16px; border-radius: 14px; background: linear-gradient(180deg, #ffffff, #f8fafc); border: 1px solid #e2e8f0; }
.faq-question { font-weight: 700; color: #0f172a; margin-bottom: 6px; }
.faq-answer   { color: #475569; line-height: 1.5; font-size: 14px; }

/* MODAL */
.modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,.45); display: flex; align-items: center; justify-content: center; padding: 20px; z-index: 120; }
.modal-card { width: 100%; max-width: 520px; background: white; border-radius: 20px; padding: 24px; box-shadow: 0 24px 70px rgba(15,23,42,.24); }
.modal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
.modal-head h3 { font-size: 18px; font-weight: 700; color: #0f172a; }
.modal-body { display: grid; gap: 14px; }
.modal-row { display: flex; flex-direction: column; gap: 4px; }
.modal-label { font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
.modal-value { font-size: 14px; color: #334155; font-weight: 500; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
.close-btn { border: none; background: #f1f5f9; width: 34px; height: 34px; border-radius: 50%; font-size: 20px; cursor: pointer; color: #64748b; }

/* TOAST */
.toast { position: fixed; right: 24px; bottom: 24px; background: #0f766e; color: white; padding: 12px 18px; border-radius: 12px; z-index: 130; box-shadow: 0 16px 40px rgba(15,118,110,.25); font-size: 13px; font-weight: 500; }
.fade-enter-active, .fade-leave-active { transition: opacity .25s ease, transform .25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(8px); }

@media (max-width: 960px) {
  .page-head, .toolbar, .comprobante-card { flex-direction: column; align-items: stretch; }
  .contact-grid, .doc-meta { grid-template-columns: 1fr; }
  .card-actions { justify-content: flex-end; }
}
</style>