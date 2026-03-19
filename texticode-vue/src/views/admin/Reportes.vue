<template>
  <div class="layout">
    <AppSidebar rol="admin" />

    <main class="content">
      <div class="main-content">

        <!-- TOAST -->
        <Transition name="toast">
          <div v-if="toast.visible" class="toast" :class="toast.type">
            <svg v-if="toast.type === 'success'" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
            </svg>
            <svg v-else width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/>
            </svg>
            {{ toast.msg }}
          </div>
        </Transition>

        <!-- TÍTULO -->
        <h1 :class="{ visible: animVisible }">Reportes</h1>

        <!-- FILTRO -->
        <div class="filter-bar" :class="{ visible: animVisible }">
          <div class="select-wrapper">
            <select v-model="tipoFiltro" class="type-select">
              <option value="">Todos los tipos</option>
              <option>Ventas</option>
              <option>Inventario</option>
              <option>Clientes</option>
              <option>Producción</option>
            </select>
            <svg class="select-arrow" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
            </svg>
          </div>
        </div>

        <!-- CARDS ESTADÍSTICAS -->
        <div class="stats-grid" :class="{ visible: animVisible }">

          <div class="stat-card" style="transition-delay: 0ms">
            <div class="stat-header">
              <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="stat-icon blue">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"/>
              </svg>
              <span class="stat-label">Pedidos Totales</span>
            </div>
            <div class="stat-value">{{ statsDisplay.total }}</div>
            <div class="stat-change blue-change">
              <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="trend-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"/>
              </svg>
              +8.3%
            </div>
          </div>

          <div class="stat-card" style="transition-delay: 70ms">
            <div class="stat-header">
              <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="stat-icon green">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
              </svg>
              <span class="stat-label">Pedidos Completados</span>
            </div>
            <div class="stat-value">{{ statsDisplay.completados }}</div>
            <div class="stat-change positive">
              <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="trend-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"/>
              </svg>
              +12.5%
            </div>
          </div>

          <div class="stat-card" style="transition-delay: 140ms">
            <div class="stat-header">
              <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="stat-icon purple">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
              </svg>
              <span class="stat-label">Tasa Completación</span>
            </div>
            <div class="stat-value">{{ statsDisplay.tasa }}%</div>
            <div class="stat-change purple-change">
              <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="trend-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"/>
              </svg>
              +2.3%
            </div>
          </div>

          <div class="stat-card" style="transition-delay: 210ms">
            <div class="stat-header">
              <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="stat-icon orange">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"/>
              </svg>
              <span class="stat-label">Pedidos Pendientes</span>
            </div>
            <div class="stat-value">{{ statsDisplay.pendientes }}</div>
            <div class="stat-change warning">5% del total</div>
          </div>

        </div>

        <!-- GRÁFICO DE BARRAS -->
        <div class="panel" :class="{ visible: animVisible }">
          <h3>Pedidos por Mes (Últimos 6 meses)</h3>
          <div class="chart">
            <div v-for="(mes, idx) in meses" :key="mes.nombre" class="bar-col"
              @mouseenter="hoveredBar = idx"
              @mouseleave="hoveredBar = null"
            >
              <div class="bar-wrapper">
                <div
                  class="bar-total"
                  :class="{ 'bar-hovered': hoveredBar === idx }"
                  :style="{ height: barHeights[idx] + 'px' }"
                >
                  <div class="bar-pending-strip"
                    :style="{ height: pendingHeights[idx] + 'px' }">
                  </div>
                  <!-- Tooltip al hover -->
                  <Transition name="tip">
                    <div v-if="hoveredBar === idx" class="bar-tooltip">
                      <strong>{{ mes.nombre }}</strong>
                      <span>📦 {{ mes.completadas + mes.pendientes }} pedidos totales</span>
                      <span>✅ {{ mes.completadas }} completados</span>
                      <span>🟠 {{ mes.pendientes }} pendientes</span>
                      <span>📊 Tasa: {{ mes.completadas + mes.pendientes > 0 ? Math.round((mes.completadas / (mes.completadas + mes.pendientes)) * 100) : 0 }}%</span>
                    </div>
                  </Transition>
                </div>
              </div>
              <div class="bar-label">{{ mes.nombre }}</div>
              <div class="bar-sub">{{ mes.completadas + mes.pendientes }} pedidos</div>
              <div class="bar-counts">
                <span class="c-dark">{{ mes.completadas }}</span>
                <span class="c-orange">{{ mes.pendientes }}</span>
              </div>
            </div>
          </div>
          <div class="legend">
            <span class="legend-item"><span class="dot dot-dark"></span> Completados</span>
            <span class="legend-item"><span class="dot dot-orange"></span> Pendientes</span>
          </div>
        </div>

        <!-- REPORTES DISPONIBLES -->
        <div class="panel" :class="{ visible: animVisible }" style="transition-delay: 80ms">
          <div class="panel-header">
            <h3>Reportes Disponibles</h3>
            <span class="report-count">{{ reportes.length }} reporte{{ reportes.length !== 1 ? 's' : '' }}</span>
          </div>

          <TransitionGroup name="report" tag="div" class="report-list">
            <div v-for="r in reportes" :key="r.titulo" class="report-row"
              :class="{ 'report-downloading': r.downloading, 'report-exporting': r.exporting }"
            >
              <div class="report-left">
                <div class="report-icon-wrap">
                  <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="report-svg">
                    <path stroke-linecap="round" stroke-linejoin="round" :d="r.iconPath"/>
                  </svg>
                </div>
                <div class="report-info">
                  <div class="report-title">{{ r.titulo }}</div>
                  <div class="report-meta">
                    <span>Período: {{ r.periodo }}</span>
                    <span>Generado: {{ r.generado }}</span>
                    <span v-if="r.subtitulo" class="meta-subtitulo">{{ r.subtitulo }}</span>
                  </div>
                </div>
              </div>
              <div class="report-right">
                <span class="badge-generado">Generado</span>
                <button class="btn-descargar" @click="descargar(r)" :disabled="r.downloading">
                  <svg v-if="!r.downloading" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:18px;height:18px;">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                  </svg>
                  <svg v-else class="spinner" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:18px;height:18px;">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"/>
                  </svg>
                  {{ r.downloading ? 'Descargando...' : 'Descargar' }}
                </button>
                <button class="btn-excel" @click="exportarExcel(r)" :disabled="r.exporting">
                  <svg v-if="!r.exporting" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:18px;height:18px;">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/>
                  </svg>
                  <svg v-else class="spinner" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:18px;height:18px;">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"/>
                  </svg>
                  {{ r.exporting ? 'Exportando...' : 'Exportar a Excel' }}
                </button>
              </div>
            </div>
          </TransitionGroup>

          <!-- Estado vacío -->
          <div v-if="reportes.length === 0" class="empty-state">
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/>
            </svg>
            <p>No hay reportes para este tipo</p>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import AppSidebar from '../../components/AppSidebar.vue'
import { getOrdenes, getUsuarios, getMateriales } from '../../services/api.js'

// ── ANIMACIONES DE ENTRADA ──
const animVisible = ref(false)
onMounted(async () => {
  await cargarDatos()
  setTimeout(() => animVisible.value = true, 50)
  setTimeout(() => animateBars(), 300)
})

// ── TOAST ──
const toast = ref({ visible: false, msg: '', type: 'success' })
function mostrarToast(msg, type = 'success') {
  toast.value = { visible: true, msg, type }
  setTimeout(() => toast.value.visible = false, 2800)
}

// ── CONTADORES ANIMADOS ──
const statsDisplay = reactive({ total: 0, completados: 0, tasa: 0, pendientes: 0 })
function animateCount(key, target, isDecimal = false) {
  let val = 0
  const steps = 40, step = target / steps
  let count = 0
  const iv = setInterval(() => {
    count++; val += step
    if (count >= steps) { statsDisplay[key] = isDecimal ? target : Math.round(target); clearInterval(iv) }
    else statsDisplay[key] = isDecimal ? parseFloat(val.toFixed(1)) : Math.round(val)
  }, 25)
}
function animateStats(total, completados, pendientes) {
  const tasa = total > 0 ? parseFloat(((completados / total) * 100).toFixed(1)) : 0
  animateCount('total',       total)
  animateCount('completados', completados)
  animateCount('tasa',        tasa, true)
  animateCount('pendientes',  pendientes)
}

// ── DATOS ──
const tipoFiltro = ref('')
const hoveredBar = ref(null)
const meses      = ref([])   // se llena desde la BD

// ── CARGA DESDE LA BD ──
async function cargarDatos() {
  try {
    const [dataOrdenes, dataUsuarios, dataMateriales] = await Promise.all([
      getOrdenes(),
      getUsuarios(),
      getMateriales(),
    ])

    // ── Stats generales ──
    const total      = dataOrdenes.length
    const completados= dataOrdenes.filter(o => o.Estado === 'Completada').length
    const pendientes = dataOrdenes.filter(o => o.Estado === 'En Proceso').length
    animateStats(total, completados, pendientes)

    // ── Gráfico de barras por mes (últimos 6 meses con datos) ──
    const porMes = {}
    dataOrdenes.forEach(o => {
      const fecha = o.Fecha_Limite || o.Fecha
      if (!fecha) return
      const d   = new Date(fecha)
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
      const nom = d.toLocaleDateString('es-CO', { month: 'short' })
        .replace('.','').replace(/^\w/, c => c.toUpperCase())
      if (!porMes[key]) porMes[key] = { nombre: nom, completadas: 0, pendientes: 0 }
      if (o.Estado === 'Completada') porMes[key].completadas++
      else porMes[key].pendientes++
    })
    // Tomar los últimos 6 meses con datos
    meses.value = Object.entries(porMes)
      .sort(([a],[b]) => a.localeCompare(b))
      .slice(-6)
      .map(([, v]) => v)

    // Si no hay datos suficientes, mostrar meses vacíos como placeholder
    if (meses.value.length === 0) {
      meses.value = ['Ene','Feb','Mar','Abr','May','Jun']
        .map(n => ({ nombre: n, completadas: 0, pendientes: 0 }))
    }

    // ── Actualizar los reportes con datos reales ──
    const clientes   = dataUsuarios.filter(u => (u.Nombre_Rol||u.Rol||'').toLowerCase() === 'cliente').length
    const stockBajo  = dataMateriales.filter(m => m.Stock_Actual <= m.Stock_Minimo).length

    reportesData[0].subtitulo = `${completados} órdenes completadas de ${total}`
    reportesData[1].subtitulo = `${stockBajo} material(es) con stock bajo`
    reportesData[2].subtitulo = `${clientes} cliente(s) registrado(s)`
    reportesData[3].subtitulo = `${total} órdenes totales registradas`

  } catch (e) {
    console.error('Error cargando reportes:', e)
  }
}

// ── BARRAS ANIMADAS ──
const barHeights     = ref([])
const pendingHeights = ref([])

function animateBars() {
  barHeights.value     = meses.value.map(() => 0)
  pendingHeights.value = meses.value.map(() => 0)

  meses.value.forEach((mes, i) => {
    const totalTarget   = (mes.completadas + mes.pendientes) * 2.8
    const pendingTarget = mes.pendientes * 2.8
    let val = 0
    const steps = 35, step = Math.max(totalTarget / steps, 0.1)
    let count = 0
    setTimeout(() => {
      const iv = setInterval(() => {
        count++; val += step
        if (count >= steps) {
          barHeights.value[i]     = totalTarget
          pendingHeights.value[i] = pendingTarget
          clearInterval(iv)
        } else {
          barHeights.value[i]     = Math.min(val, totalTarget)
          pendingHeights.value[i] = Math.min((val/totalTarget)*pendingTarget, pendingTarget)
        }
      }, 18)
    }, i * 60)
  })
}

// ── REPORTES ──
const reportesData = reactive([
  {
    titulo: 'Reporte de Producción', tipo: 'Producción',
    periodo: new Date().toLocaleDateString('es-CO', { month: 'long', year: 'numeric' }),
    generado: new Date().toISOString().split('T')[0],
    subtitulo: 'Cargando...',
    downloading: false, exporting: false,
    iconPath: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z'
  },
  {
    titulo: 'Inventario Stock Bajo', tipo: 'Inventario',
    periodo: new Date().toLocaleDateString('es-CO', { month: 'long', year: 'numeric' }),
    generado: new Date().toISOString().split('T')[0],
    subtitulo: 'Cargando...',
    downloading: false, exporting: false,
    iconPath: 'm21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9'
  },
  {
    titulo: 'Análisis de Clientes', tipo: 'Clientes',
    periodo: new Date().toLocaleDateString('es-CO', { month: 'long', year: 'numeric' }),
    generado: new Date().toISOString().split('T')[0],
    subtitulo: 'Cargando...',
    downloading: false, exporting: false,
    iconPath: 'M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z'
  },
  {
    titulo: 'Resumen de Órdenes', tipo: 'Ventas',
    periodo: new Date().toLocaleDateString('es-CO', { month: 'long', year: 'numeric' }),
    generado: new Date().toISOString().split('T')[0],
    subtitulo: 'Cargando...',
    downloading: false, exporting: false,
    iconPath: 'M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
  },
])

const reportes = computed(() =>
  tipoFiltro.value === '' ? reportesData : reportesData.filter(r => r.tipo === tipoFiltro.value)
)

// ── DESCARGAR CON SPINNER ──
async function descargar(r) {
  r.downloading = true
  await new Promise(res => setTimeout(res, 1600))
  r.downloading = false
  mostrarToast(`"${r.titulo}" descargado correctamente`, 'success')
}

async function exportarExcel(r) {
  r.exporting = true
  await new Promise(res => setTimeout(res, 1800))
  r.exporting = false
  mostrarToast(`"${r.titulo}" exportado a Excel`, 'excel')
}
</script>

<style scoped>
.layout      { display: flex; min-height: 100vh; }
.content     { flex: 1; padding: 28px 30px; min-height: 100vh; }
.main-content { max-width: 100%; }

/* ── ANIMACIONES DE ENTRADA ── */
h1, .filter-bar, .stats-grid, .panel {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}
h1.visible         { opacity: 1; transform: none; transition-delay: 0ms; }
.filter-bar.visible { opacity: 1; transform: none; transition-delay: 60ms; }
.stats-grid.visible { opacity: 1; transform: none; transition-delay: 120ms; }
.panel.visible      { opacity: 1; transform: none; transition-delay: 200ms; }

h1 { font-size: 26px; font-weight: 600; color: #111827; padding-bottom: 16px; margin-bottom: 20px; border-bottom: 1px solid #e5e7eb; }

/* ── FILTER ── */
.filter-bar { margin-bottom: 25px; }
.select-wrapper { position: relative; display: inline-flex; align-items: center; }
.type-select {
  padding: 9px 36px 9px 14px; border-radius: 8px; border: 1px solid #d1d5db;
  background: white; font-size: 14px; color: #374151;
  appearance: none; -webkit-appearance: none; cursor: pointer; min-width: 170px; outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.type-select:focus { border-color: #1f3c4d; box-shadow: 0 0 0 3px rgba(31,60,77,0.1); }
.select-arrow { position: absolute; right: 10px; width: 14px; height: 14px; color: #6b7280; pointer-events: none; }

/* ── STAT CARDS ── */
.stats-grid { display: flex; gap: 20px; margin-bottom: 30px; }
.stat-card {
  background: white; flex: 1; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px;
  opacity: 0; transform: translateY(12px);
  transition: opacity 0.4s ease, transform 0.4s ease, box-shadow 0.2s;
}
.stats-grid.visible .stat-card { opacity: 1; transform: none; }
.stat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); transform: translateY(-2px); }
.stat-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.stat-icon { width: 18px; height: 18px; flex-shrink: 0; }
.stat-icon.blue   { color: #2563eb; }
.stat-icon.green  { color: #16a34a; }
.stat-icon.purple { color: #7c3aed; }
.stat-icon.orange { color: #f97316; }
.stat-label { font-size: 14px; font-weight: 500; color: #6b7280; }
.stat-value { font-size: 26px; font-weight: 600; color: #111827; margin-top: 10px; margin-bottom: 8px; }
.stat-change { display: flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 500; }
.stat-change.positive { color: #16a34a; }
.stat-change.warning  { color: #f97316; }
.trend-icon { width: 14px; height: 14px; }
.blue-change   { display: flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 500; color: #2563eb; }
.purple-change { display: flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 500; color: #7c3aed; }

/* ── PANEL ── */
.panel {
  background: white; border: 1px solid #e5e7eb; border-radius: 12px;
  padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.panel h3 { font-size: 15px; font-weight: 600; color: #111827; margin: 0 0 24px 0; }
.panel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.panel-header h3 { margin: 0; }
.report-count { font-size: 12px; color: #9ca3af; font-weight: 500; background: #f3f4f6; padding: 3px 10px; border-radius: 20px; }

/* ── CHART ── */
.chart { display: flex; align-items: flex-end; gap: 16px; height: 220px; margin-bottom: 16px; }
.bar-col { display: flex; flex-direction: column; align-items: center; flex: 1; cursor: pointer; }
.bar-wrapper { display: flex; align-items: flex-end; width: 100%; justify-content: center; position: relative; }
.bar-total {
  width: 80%; background: #1f3c4d; border-radius: 6px 6px 0 0;
  position: relative; display: flex; flex-direction: column; justify-content: flex-end;
  min-height: 4px; transition: background 0.2s, transform 0.15s;
}
.bar-total.bar-hovered { background: #2d5570; transform: scaleX(1.05); }
.bar-pending-strip { width: 100%; background: #f97316; border-radius: 0 0 6px 6px; min-height: 0; }
.bar-label  { font-size: 13px; font-weight: 600; color: #374151; margin-top: 8px; }
.bar-sub    { font-size: 11px; color: #9ca3af; margin-top: 2px; }
.bar-counts { display: flex; gap: 6px; font-size: 12px; font-weight: 600; margin-top: 2px; }
.c-dark   { color: #1f3c4d; }
.c-orange { color: #f97316; }

/* ── TOOLTIP BARRA ── */
.bar-tooltip {
  position: absolute; bottom: calc(100% + 8px); left: 50%;
  transform: translateX(-50%);
  background: #1f2937; color: white; border-radius: 8px;
  padding: 8px 12px; font-size: 12px; white-space: nowrap;
  display: flex; flex-direction: column; gap: 3px; z-index: 10;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  pointer-events: none;
}
.bar-tooltip::after {
  content: ''; position: absolute; top: 100%; left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent; border-top-color: #1f2937;
}
.bar-tooltip strong { font-size: 13px; margin-bottom: 2px; }

.legend { display: flex; gap: 20px; font-size: 13px; color: #374151; justify-content: center; margin-top: 8px; }
.legend-item { display: flex; align-items: center; gap: 6px; }
.dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
.dot-dark   { background: #1f3c4d; }
.dot-orange { background: #f97316; }

/* ── REPORT LIST ── */
.report-list { display: flex; flex-direction: column; gap: 12px; }
.report-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px 16px; border: 1px solid #e5e7eb; border-radius: 10px;
  background: white; transition: border-color 0.2s, box-shadow 0.2s;
}
.report-row:hover { border-color: #d1d5db; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
.report-downloading { border-color: #bfdbfe !important; background: #eff6ff !important; }
.report-exporting   { border-color: #bbf7d0 !important; background: #f0fdf4 !important; }

.report-left { display: flex; align-items: center; gap: 14px; }
.report-icon-wrap {
  width: 38px; height: 38px; background: #f3f4f6; border-radius: 8px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  transition: background 0.2s;
}
.report-row:hover .report-icon-wrap { background: #e5e7eb; }
.report-svg { width: 20px; height: 20px; color: #6b7280; }
.report-title { font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 4px; }
.report-meta { font-size: 12px; color: #9ca3af; display: flex; gap: 16px; }
.report-right { display: flex; align-items: center; gap: 10px; }

.badge-generado {
  background: #dcfce7; color: #16a34a; font-size: 12px; font-weight: 600;
  padding: 4px 12px; border-radius: 20px;
}
.btn-descargar {
  display: flex; align-items: center; gap: 6px; padding: 8px 14px;
  background: white; border: 1px solid #d1d5db; border-radius: 8px;
  font-size: 13px; color: #374151; cursor: pointer; white-space: nowrap;
  transition: background 0.15s, border-color 0.15s;
}
.btn-descargar:hover:not(:disabled) { background: #eff6ff; border-color: #bfdbfe; color: #2563eb; }
.btn-descargar:disabled { opacity: 0.7; cursor: not-allowed; }

.btn-excel {
  display: flex; align-items: center; gap: 6px; padding: 8px 14px;
  background: white; border: 1px solid #d1d5db; border-radius: 8px;
  font-size: 13px; color: #374151; cursor: pointer; white-space: nowrap;
  transition: background 0.15s, border-color 0.15s;
}
.btn-excel:hover:not(:disabled) { background: #f0fdf4; border-color: #bbf7d0; color: #16a34a; }
.btn-excel:disabled { opacity: 0.7; cursor: not-allowed; }

/* ── SPINNER ── */
@keyframes spin { to { transform: rotate(360deg); } }
.spinner { animation: spin 0.8s linear infinite; }

/* ── ESTADO VACÍO ── */
.empty-state { text-align: center; padding: 40px 20px; color: #9ca3af; }
.empty-state svg { margin: 0 auto 12px; display: block; opacity: 0.4; }
.empty-state p { font-size: 14px; margin: 0; }

/* ── TOAST ── */
.toast {
  position: fixed; bottom: 24px; right: 24px; z-index: 2000;
  display: flex; align-items: center; gap: 8px;
  padding: 12px 18px; border-radius: 10px; font-size: 14px; font-weight: 500;
  color: white; box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}
.toast.success { background: #16a34a; }
.toast.excel   { background: #15803d; }
.toast.danger  { background: #dc2626; }

/* ── TRANSICIONES ── */
.toast-enter-active { transition: all 0.3s ease; }
.toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }

.tip-enter-active { transition: all 0.15s ease; }
.tip-leave-active { transition: all 0.1s ease; }
.tip-enter-from, .tip-leave-to { opacity: 0; transform: translateX(-50%) translateY(4px); }

.report-enter-active { transition: all 0.3s ease; }
.report-leave-active { transition: all 0.25s ease; }
.report-enter-from   { opacity: 0; transform: translateY(-8px); }
.report-leave-to     { opacity: 0; transform: translateY(-8px); }
</style>