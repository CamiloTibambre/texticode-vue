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
                      <span>🔵 {{ mes.pendientes }} pendientes</span>
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
import { computed, onMounted, reactive, ref } from 'vue'
import AppSidebar from '../../components/AppSidebar.vue'
import { getMateriales, getOrdenes, getUsuarios } from '../../services/api.js'

const animVisible = ref(false)
const toast = ref({ visible: false, msg: '', type: 'success' })
const tipoFiltro = ref('')
const hoveredBar = ref(null)
const meses = ref([])
const barHeights = ref([])
const pendingHeights = ref([])
const ordenesData = ref([])
const usuariosData = ref([])
const materialesData = ref([])
const statsDisplay = reactive({ total: 0, completados: 0, tasa: 0, pendientes: 0 })

onMounted(async () => {
  await cargarDatos()
  setTimeout(() => animVisible.value = true, 50)
  setTimeout(() => animateBars(), 250)
})

function mostrarToast(msg, type = 'success') {
  toast.value = { visible: true, msg, type }
  setTimeout(() => { toast.value.visible = false }, 2800)
}

function animateCount(key, target, isDecimal = false) {
  let val = 0
  const steps = 36
  const step = target / steps
  let count = 0
  const iv = setInterval(() => {
    count += 1
    val += step
    if (count >= steps) {
      statsDisplay[key] = isDecimal ? target : Math.round(target)
      clearInterval(iv)
    } else {
      statsDisplay[key] = isDecimal ? parseFloat(val.toFixed(1)) : Math.round(val)
    }
  }, 22)
}

function animateStats(total, completados, pendientes) {
  const tasa = total > 0 ? parseFloat(((completados / total) * 100).toFixed(1)) : 0
  animateCount('total', total)
  animateCount('completados', completados)
  animateCount('tasa', tasa, true)
  animateCount('pendientes', pendientes)
}

async function cargarDatos() {
  try {
    const [dataOrdenes, dataUsuarios, dataMateriales] = await Promise.all([
      getOrdenes(),
      getUsuarios(),
      getMateriales(),
    ])

    ordenesData.value = Array.isArray(dataOrdenes) ? dataOrdenes : []
    usuariosData.value = Array.isArray(dataUsuarios) ? dataUsuarios : []
    materialesData.value = Array.isArray(dataMateriales) ? dataMateriales : []

    const total = ordenesData.value.length
    const completados = ordenesData.value.filter(o => o.Estado === 'Completada').length
    const pendientes = ordenesData.value.filter(o => o.Estado === 'En Proceso').length
    animateStats(total, completados, pendientes)

    const porMes = {}
    ordenesData.value.forEach((o) => {
      const fecha = o.Fecha_Limite || o.Fecha
      if (!fecha) return

      const d = new Date(fecha)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const nombre = d.toLocaleDateString('es-CO', { month: 'short' }).replace('.', '').replace(/^\w/, c => c.toUpperCase())
      if (!porMes[key]) porMes[key] = { nombre, completadas: 0, pendientes: 0 }

      if (o.Estado === 'Completada') porMes[key].completadas += 1
      else porMes[key].pendientes += 1
    })

    meses.value = Object.entries(porMes)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([, value]) => value)

    if (meses.value.length === 0) {
      meses.value = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'].map((nombre) => ({
        nombre,
        completadas: 0,
        pendientes: 0,
      }))
    }

    const clientes = usuariosData.value.filter(u => (u.Nombre_Rol || u.Rol || '').toLowerCase() === 'cliente').length
    const stockBajo = materialesData.value.filter(m => Number(m.Stock_Actual) <= Number(m.Stock_Minimo)).length

    reportesData[0].subtitulo = `${completados} órdenes completadas de ${total}`
    reportesData[1].subtitulo = `${stockBajo} material(es) con stock bajo`
    reportesData[2].subtitulo = `${clientes} cliente(s) registrado(s)`
    reportesData[3].subtitulo = `${total} órdenes totales registradas`
  } catch (error) {
    mostrarToast('No fue posible cargar los reportes.', 'danger')
  }
}

function animateBars() {
  barHeights.value = meses.value.map(() => 0)
  pendingHeights.value = meses.value.map(() => 0)

  const totals = meses.value.map((mes) => mes.completadas + mes.pendientes)
  const maxTotal = Math.max(...totals, 1)

  meses.value.forEach((mes, index) => {
    const totalMes = mes.completadas + mes.pendientes
    const totalTarget = totalMes === 0 ? 18 : Math.max(42, (totalMes / maxTotal) * 170)
    const pendingTarget = totalMes === 0 ? 0 : Math.max(8, totalTarget * (mes.pendientes / totalMes))
    let val = 0
    const steps = 30
    const step = totalTarget / steps
    let count = 0

    setTimeout(() => {
      const iv = setInterval(() => {
        count += 1
        val += step
        if (count >= steps) {
          barHeights.value[index] = totalTarget
          pendingHeights.value[index] = Math.min(pendingTarget, totalTarget)
          clearInterval(iv)
        } else {
          const current = Math.min(val, totalTarget)
          barHeights.value[index] = current
          pendingHeights.value[index] = totalTarget === 0 ? 0 : Math.min((current / totalTarget) * pendingTarget, pendingTarget)
        }
      }, 18)
    }, index * 55)
  })
}

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

async function descargar(r) {
  r.downloading = true
  try {
    // Cargar jsPDF + autoTable
    if (!window.jspdf) {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script')
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
        s.onload = resolve; s.onerror = reject
        document.head.appendChild(s)
      })
    }
    if (!window.jspdf?.jsPDF?.API?.autoTable) {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script')
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js'
        s.onload = resolve; s.onerror = reject
        document.head.appendChild(s)
      })
    }

    const { jsPDF } = window.jspdf
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

    const rows     = obtenerFilasReporte(r)
    const headers  = rows.length ? Object.keys(rows[0]) : []
    const mesesN   = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
    const hoy      = new Date()
    const fechaHoy = `${hoy.getDate()} de ${mesesN[hoy.getMonth()]} de ${hoy.getFullYear()}`

    const AZUL    = [31, 60, 77]
    const BLANCO  = [255, 255, 255]
    const GRIS_BG = [240, 244, 247]
    const GRIS_LN = [248, 250, 252]
    const NEGRO   = [17, 24, 39]
    const GRIS_T  = [75, 85, 99]
    const GRIS_M  = [156, 163, 175]
    const AZUL_CL = [180, 200, 215]

    const W  = 210
    const ML = 14
    const MR = W - 14

    // ── CABECERA AZUL ─────────────────────────────────────────────
    doc.setFillColor(...AZUL)
    doc.rect(0, 0, W, 32, 'F')

    // ── LOGO TEXTICODE (imagen real en base64, blanco sobre azul) ──
    const logoB64 = 'data:image/png;base64,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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgmv8B+li1nZsXMj4AAAAASUVORK5CYII='
    doc.addImage(logoB64, 'PNG', ML, 4, 22, 22)

    // ── TEXTOS CABECERA ───────────────────────────────────────────
    const textX = ML + 26

    doc.setTextColor(...BLANCO)
    doc.setFontSize(17)
    doc.setFont('helvetica', 'bold')
    doc.text('TEXTICODE', textX, 14)

    doc.setFontSize(8)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(...AZUL_CL)
    doc.text('Gestión Textil Profesional', textX, 20)

    // Contacto derecha
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...AZUL_CL)
    doc.text('Bogotá, Colombia', MR, 11, { align: 'right' })
    doc.text('texticode@correo.com', MR, 17, { align: 'right' })
    doc.text('+57 300 000 0000', MR, 23, { align: 'right' })

    // ── BANDA TÍTULO REPORTE ──────────────────────────────────────
    doc.setFillColor(...GRIS_BG)
    doc.rect(0, 32, W, 14, 'F')
    doc.setDrawColor(...AZUL)
    doc.setLineWidth(0.4)
    doc.line(0, 46, W, 46)

    doc.setTextColor(...AZUL)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(r.titulo.toUpperCase(), W / 2, 41, { align: 'center' })

    // ── META INFO ─────────────────────────────────────────────────
    let y = 52
    const metaW  = MR - ML
    const colW3  = metaW / 3
    const boxH   = 15

    doc.setFillColor(...GRIS_BG)
    doc.roundedRect(ML, y, metaW, boxH, 2, 2, 'F')

    const metaItems = [
      { label: 'PERÍODO',            value: r.periodo },
      { label: 'FECHA DE GENERACIÓN', value: fechaHoy },
      { label: 'TOTAL DE REGISTROS', value: String(rows.length) },
    ]
    metaItems.forEach((item, i) => {
      const mx = ML + colW3 * i + 4
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(7)
      doc.setTextColor(...GRIS_T)
      doc.text(item.label, mx, y + 5.5)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.setTextColor(...NEGRO)
      doc.text(item.value, mx, y + 11.5)
    })

    y += boxH + 7

    // ── TABLA CON AUTOFIT DE COLUMNAS ────────────────────────────
    const estadoColor = {
      'Completada': { bg: [209, 250, 229], fg: [6, 95, 70] },
      'En Proceso':  { bg: [254, 243, 199], fg: [146, 64, 14] },
      'Pendiente':   { bg: [254, 226, 226], fg: [153, 27, 27] },
    }

    // Calcular ancho máximo real de cada columna según contenido
    const tableW = MR - ML
    const PX_PER_CHAR = 1.9   // aproximación mm por carácter a font 8

    // Peso relativo por clave (columnas de texto largo reciben más espacio)
    const weightMap = {
      descripcion: 3.5, cliente: 2, correo: 2.2, material: 2,
      orden: 0.8, prioridad: 1, fecha_limite: 1.4, estado: 1.3,
      stock_actual: 1, stock_minimo: 1, categoria: 1.4,
      telefono: 1.3,
    }
    const totalWeight = headers.reduce((s, h) => s + (weightMap[h] || 1), 0)
    const colWidths   = headers.map(h => (weightMap[h] || 1) / totalWeight * tableW)

    const headH = 9
    const rowH  = 8
    const pageHmax = 277

    function drawTableHeader(yPos) {
      doc.setFillColor(...AZUL)
      doc.rect(ML, yPos, tableW, headH, 'F')
      doc.setTextColor(...BLANCO)
      doc.setFontSize(7.5)
      doc.setFont('helvetica', 'bold')
      let cx = ML
      headers.forEach((h, i) => {
        const label = h.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        doc.text(label, cx + 2, yPos + 6, { maxWidth: colWidths[i] - 3 })
        cx += colWidths[i]
      })
      return yPos + headH
    }

    if (headers.length && rows.length) {
      y = drawTableHeader(y)

      rows.forEach((row, ri) => {
        if (y + rowH > pageHmax) {
          doc.addPage()
          y = 16
          y = drawTableHeader(y)
        }

        const bgColor = ri % 2 === 0 ? BLANCO : GRIS_LN
        doc.setFillColor(...bgColor)
        doc.rect(ML, y, tableW, rowH, 'F')
        doc.setDrawColor(226, 232, 240)
        doc.setLineWidth(0.15)
        doc.line(ML, y + rowH, MR, y + rowH)

        doc.setFontSize(7.5)
        let cx = ML
        headers.forEach((key, i) => {
          const val    = String(row[key] ?? '')
          const esEst  = key === 'estado' || key === 'Estado'
          const colores = esEst ? estadoColor[val] : null
          const avail  = colWidths[i] - 4

          if (colores) {
            const bW = Math.min(avail, 28)
            doc.setFillColor(...colores.bg)
            doc.roundedRect(cx + 2, y + 1.8, bW, 4.5, 1, 1, 'F')
            doc.setTextColor(...colores.fg)
            doc.setFont('helvetica', 'bold')
            doc.setFontSize(6.8)
            doc.text(val, cx + 2 + bW / 2, y + 5.1, { align: 'center' })
            doc.setFontSize(7.5)
          } else {
            doc.setTextColor(...(i === 0 ? NEGRO : GRIS_T))
            doc.setFont('helvetica', i === 0 ? 'bold' : 'normal')
            // Usar splitTextToSize para no truncar sino ajustar
            const lines = doc.splitTextToSize(val, avail)
            doc.text(lines[0], cx + 2, y + 5.5)  // solo primera línea (rowH fijo)
          }
          cx += colWidths[i]
        })
        y += rowH
      })
    } else {
      doc.setTextColor(...GRIS_M)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'italic')
      doc.text('Sin datos para este reporte.', W / 2, y + 10, { align: 'center' })
    }

    // ── PIE DE PÁGINA (todas las páginas) ─────────────────────────
    const totalPages = doc.internal.getNumberOfPages()
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p)
      const pH = doc.internal.pageSize.height
      doc.setFillColor(...AZUL)
      doc.rect(0, pH - 12, W, 12, 'F')
      doc.setFontSize(7)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...AZUL_CL)
      doc.text('Documento de uso interno · TEXTICODE S.A.S.', ML, pH - 5)
      doc.text(`Página ${p} de ${totalPages}`, MR, pH - 5, { align: 'right' })
    }

    doc.save(`${slugify(r.titulo)}.pdf`)
    mostrarToast(`"${r.titulo}" descargado como PDF`, 'success')
  } catch (err) {
    console.error(err)
    mostrarToast('Error al generar el PDF', 'danger')
  } finally {
    r.downloading = false
  }
}

async function exportarExcel(r) {
  r.exporting = true
  try {
    // Cargar ExcelJS (soporta estilos reales a diferencia de SheetJS gratuito)
    if (!window.ExcelJS) {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script')
        s.src = 'https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js'
        s.onload = resolve; s.onerror = reject
        document.head.appendChild(s)
      })
    }

    const rows = obtenerFilasReporte(r)
    const mesesNombres = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
    const hoy = new Date()
    const fechaHoy = `${hoy.getDate()} de ${mesesNombres[hoy.getMonth()]} de ${hoy.getFullYear()}`

    const AZUL   = 'FF1F3C4D'
    const AZUL2  = 'FF2D5570'
    const GRIS_BG= 'FFF0F4F7'
    const GRIS_LN= 'FFF8FAFC'
    const BLANCO = 'FFFFFFFF'
    const NEGRO  = 'FF111827'
    const GRIS_T = 'FF4B5563'
    const GRIS_M = 'FF9CA3AF'

    const headers = rows.length ? Object.keys(rows[0]) : []
    const colCount = Math.max(headers.length, 6)

    const wb = new window.ExcelJS.Workbook()
    wb.creator = 'TEXTICODE'
    wb.created = new Date()
    const ws = wb.addWorksheet(r.titulo.slice(0, 31), {
      views: [{ showGridLines: false }]
    })

    // -- Anchos de columna dinamicos segun clave --
    const colWidthMap = {
      descripcion: 42, cliente: 24, correo: 28, material: 26,
      orden: 10, prioridad: 14, fecha_limite: 18, estado: 16,
      stock_actual: 14, stock_minimo: 14, categoria: 18, telefono: 16,
    }
    for (let i = 0; i < colCount; i++) {
      const key = headers[i] || ""
      ws.getColumn(i + 1).width = colWidthMap[key] || 16
    }

    // Helpers
    const fillSolid = (argb) => ({ type: 'pattern', pattern: 'solid', fgColor: { argb } })
    const font = (bold, size, argb, italic) => ({ name: 'Calibri', bold: !!bold, size: size || 10, color: { argb: argb || NEGRO }, italic: !!italic })
    const align = (horizontal, vertical, wrap) => ({ horizontal: horizontal || 'left', vertical: vertical || 'middle', wrapText: !!wrap })
    const borderThin = (argb) => ({ style: 'thin', color: { argb: argb || 'FFE2E8ED' } })

    function styleRow(rowObj, height, fillArgb, applyFn) {
      rowObj.height = height
      if (fillArgb) {
        rowObj.eachCell({ includeEmpty: true }, cell => {
          cell.fill = fillSolid(fillArgb)
          if (applyFn) applyFn(cell)
        })
      } else if (applyFn) {
        rowObj.eachCell({ includeEmpty: true }, applyFn)
      }
    }

    // ── LOGO Excel (incrustado en celda A1:B3) ──
    const excelLogoId = wb.addImage({
      base64: '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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgmv8B+li1nZsXMj4AAAAASUVORK5CYII=',
      extension: 'png',
    })
    ws.addImage(excelLogoId, {
      tl: { col: 0, row: 0 },
      br: { col: 2, row: 4 },
      editAs: 'oneCell',
    })

    // ── FILA 1-3: Cabecera empresa (fondo blanco) ──
    const r1 = ws.addRow(['', '', 'TEXTICODE', ...Array(colCount - 3).fill('')])
    r1.height = 40
    ws.mergeCells(1, 3, 1, colCount)
    const cTitulo = ws.getCell(1, 3)
    cTitulo.value = 'TEXTICODE'
    cTitulo.font = font(true, 20, AZUL)
    cTitulo.fill = fillSolid(BLANCO)
    cTitulo.alignment = align('left', 'middle')
    r1.eachCell({ includeEmpty: true }, (c, colNum) => { if (colNum > 2) c.fill = fillSolid(BLANCO) })

    const r2 = ws.addRow(Array(colCount).fill(''))
    r2.height = 20
    ws.mergeCells(2, 3, 2, colCount)
    const cSub = ws.getCell(2, 3)
    cSub.value = 'Gestión Textil Profesional'
    cSub.font = font(false, 9, GRIS_T, true)
    cSub.fill = fillSolid(BLANCO)
    cSub.alignment = align('left', 'middle')
    r2.eachCell({ includeEmpty: true }, (c, colNum) => { if (colNum > 2) c.fill = fillSolid(BLANCO) })

    const r3 = ws.addRow(Array(colCount).fill(''))
    r3.height = 16
    ws.mergeCells(3, 3, 3, colCount)
    const cInfo = ws.getCell(3, 3)
    cInfo.value = 'Bogotá, Colombia  ·  texticode@correo.com  ·  +57 300 000 0000'
    cInfo.font = font(false, 8, GRIS_M)
    cInfo.fill = fillSolid(BLANCO)
    cInfo.alignment = align('left', 'middle')
    r3.eachCell({ includeEmpty: true }, (c, colNum) => { if (colNum > 2) c.fill = fillSolid(BLANCO) })

    // ── FILA 4: Línea azul separadora ──
    const r4 = ws.addRow(Array(colCount).fill(''))
    r4.height = 5
    ws.mergeCells(4, 1, 4, colCount)
    ws.getCell(4, 1).fill = fillSolid(AZUL)
    r4.eachCell({ includeEmpty: true }, c => { c.fill = fillSolid(AZUL) })

    // ── FILA 5: Espacio ──
    const r5 = ws.addRow(Array(colCount).fill(''))
    r5.height = 8
    r5.eachCell({ includeEmpty: true }, c => { c.fill = fillSolid(BLANCO) })

    // ── FILA 6: Título del reporte ──
    const r6 = ws.addRow(Array(colCount).fill(''))
    r6.height = 26
    ws.mergeCells(6, 1, 6, colCount)
    const cTitRep = ws.getCell(6, 1)
    cTitRep.value = r.titulo.toUpperCase()
    cTitRep.font = font(true, 14, AZUL)
    cTitRep.fill = fillSolid(GRIS_BG)
    cTitRep.alignment = align('center', 'middle')
    r6.eachCell({ includeEmpty: true }, c => { c.fill = fillSolid(GRIS_BG) })

    // ── FILA 7: Meta información ──
    const r7 = ws.addRow(Array(colCount).fill(''))
    r7.height = 17
    ws.getCell(7, 1).value = 'Período:'
    ws.getCell(7, 1).font = font(true, 9, GRIS_T)
    ws.getCell(7, 2).value = r.periodo
    ws.getCell(7, 2).font = font(false, 9, GRIS_T)
    ws.getCell(7, 3).value = 'Generado:'
    ws.getCell(7, 3).font = font(true, 9, GRIS_T)
    ws.getCell(7, 4).value = fechaHoy
    ws.getCell(7, 4).font = font(false, 9, GRIS_T)
    ws.getCell(7, colCount).value = 'TEXTICODE S.A.S.'
    ws.getCell(7, colCount).font = font(true, 9, AZUL)
    ws.getCell(7, colCount).alignment = align('right', 'middle')
    r7.eachCell({ includeEmpty: true }, c => {
      c.fill = fillSolid(BLANCO)
      c.alignment = align('left', 'middle')
    })

    // ── FILA 8: Espacio ──
    const r8 = ws.addRow(Array(colCount).fill(''))
    r8.height = 6
    r8.eachCell({ includeEmpty: true }, c => { c.fill = fillSolid(BLANCO) })

    // ── FILA 9: Cabeceras de tabla ──
    const headerLabels = headers.map(h => h.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))
    const r9 = ws.addRow([...headerLabels, ...Array(colCount - headerLabels.length).fill('')])
    r9.height = 20
    r9.eachCell({ includeEmpty: true }, (cell, colNum) => {
      cell.fill = fillSolid(AZUL)
      cell.font = font(true, 10, BLANCO)
      cell.alignment = align('center', 'middle')
      cell.border = { bottom: borderThin('FFFFFFFF') }
    })

    // ── FILAS DE DATOS ──
    const estadoColores = {
      'Completada': { bg: 'FFD1FAE5', fg: 'FF065F46' },
      'En Proceso':  { bg: 'FFFEF3C7', fg: 'FF92400E' },
      'Pendiente':   { bg: 'FFFEE2E2', fg: 'FF991B1B' },
    }

    rows.forEach((row, ri) => {
      const bgArgb = ri % 2 === 0 ? BLANCO : GRIS_LN
      const values = headers.map(h => String(row[h] ?? ''))
      const dataRow = ws.addRow([...values, ...Array(colCount - values.length).fill('')])
      dataRow.height = 28
      headers.forEach((key, ci) => {
        const cell = dataRow.getCell(ci + 1)
        const strVal = String(row[key] ?? '')
        const esEstado = key === 'estado' || key === 'Estado'
        const colores = esEstado ? estadoColores[strVal] : null

        cell.fill = fillSolid(colores ? colores.bg : bgArgb)
        cell.font = font(esEstado, esEstado ? 9 : 10, colores ? colores.fg : (ci === 0 ? NEGRO : GRIS_T))
        cell.alignment = align('left', 'middle', true)
        cell.border = { bottom: borderThin() }
      })
      // rellenar celdas extra
      for (let ci = headers.length; ci < colCount; ci++) {
        dataRow.getCell(ci + 1).fill = fillSolid(bgArgb)
      }
    })

    // ── FILA espacio ──
    const rEsp = ws.addRow(Array(colCount).fill(''))
    rEsp.height = 6
    rEsp.eachCell({ includeEmpty: true }, c => { c.fill = fillSolid(GRIS_BG) })

    // ── FILA TOTALES ──
    const rTot = ws.addRow(Array(colCount).fill(''))
    rTot.height = 19
    const totRowIdx = ws.rowCount
    ws.mergeCells(totRowIdx, 1, totRowIdx, 2)
    ws.mergeCells(totRowIdx, 3, totRowIdx, colCount)
    ws.getCell(totRowIdx, 1).value = `Total de registros: ${rows.length}`
    ws.getCell(totRowIdx, 1).font = font(true, 10, AZUL)
    ws.getCell(totRowIdx, 1).alignment = align('left', 'middle')
    ws.getCell(totRowIdx, 3).value = r.subtitulo
    ws.getCell(totRowIdx, 3).font = font(false, 9, GRIS_T)
    ws.getCell(totRowIdx, 3).alignment = align('right', 'middle')
    rTot.eachCell({ includeEmpty: true }, c => { c.fill = fillSolid(GRIS_BG) })

    // ── FILA espacio ──
    const rEsp2 = ws.addRow(Array(colCount).fill(''))
    rEsp2.height = 6
    rEsp2.eachCell({ includeEmpty: true }, c => { c.fill = fillSolid(AZUL) })

    // ── FILA PIE ──
    const rPie = ws.addRow(Array(colCount).fill(''))
    rPie.height = 15
    const pieRowIdx = ws.rowCount
    ws.mergeCells(pieRowIdx, 1, pieRowIdx, colCount)
    ws.getCell(pieRowIdx, 1).value = `Este documento es de uso interno de TEXTICODE S.A.S.  ·  Generado el ${fechaHoy}`
    ws.getCell(pieRowIdx, 1).font = font(false, 8, BLANCO, true)
    ws.getCell(pieRowIdx, 1).fill = fillSolid(AZUL)
    ws.getCell(pieRowIdx, 1).alignment = align('center', 'middle')
    rPie.eachCell({ includeEmpty: true }, c => { c.fill = fillSolid(AZUL) })

    // ── Generar y descargar ──
    const buffer = await wb.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    descargarArchivo(blob, `${slugify(r.titulo)}.xlsx`)
    mostrarToast(`"${r.titulo}" exportado a Excel`, 'excel')
  } catch (err) {
    console.error(err)
    mostrarToast('Error al exportar', 'danger')
  } finally {
    r.exporting = false
  }
}

function crearReporteTexto(reporte) {
  const rows = obtenerFilasReporte(reporte)
  return [
    reporte.titulo,
    `Período: ${reporte.periodo}`,
    `Generado: ${reporte.generado}`,
    '',
    ...rows.map((row) => Object.entries(row).map(([k, v]) => `${k}: ${v}`).join(' | ')),
  ].join('\n')
}

function crearReporteCsv(reporte) {
  const rows = obtenerFilasReporte(reporte)
  if (!rows.length) return 'sin_datos\n'
  const headers = Object.keys(rows[0])
  const lines = rows.map((row) => headers.map((key) => JSON.stringify(row[key] ?? '')).join(','))
  return `${headers.join(',')}\n${lines.join('\n')}\n`
}

function formatearFecha(val) {
  if (!val) return ''
  try {
    const d = new Date(val)
    if (isNaN(d)) return String(val)
    return d.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch (e) { return String(val) }
}

function obtenerFilasReporte(reporte) {
  if (reporte.tipo === 'Producción' || reporte.tipo === 'Ventas') {
    return ordenesData.value.map((o) => ({
      orden: o.Id_Orden,
      cliente: o.Cliente,
      descripcion: o.Descripcion,
      estado: o.Estado,
      prioridad: o.Prioridad,
      fecha_limite: formatearFecha(o.Fecha_Limite),
    }))
  }

  if (reporte.tipo === 'Inventario') {
    return materialesData.value
      .filter(m => Number(m.Stock_Actual) <= Number(m.Stock_Minimo))
      .map((m) => ({
        material: m.Nombre_Material,
        stock_actual: m.Stock_Actual,
        stock_minimo: m.Stock_Minimo,
        categoria: m.Categoria || '',
      }))
  }

  return usuariosData.value
    .filter(u => (u.Nombre_Rol || u.Rol || '').toLowerCase() === 'cliente')
    .map((u) => ({
      cliente: u.Nombre_Completo || u.Nombre_Usuario,
      correo: u.Correo,
      telefono: u.Telefono,
      estado: u.Estado,
    }))
}

function descargarArchivo(blob, nombre) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = nombre
  link.click()
  URL.revokeObjectURL(url)
}

function slugify(value) {
  return value.toLowerCase().replace(/\s+/g, '-')
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
.stat-icon.orange { color: #94a3b8; }
.stat-label { font-size: 14px; font-weight: 500; color: #6b7280; }
.stat-value { font-size: 26px; font-weight: 600; color: #111827; margin-top: 10px; margin-bottom: 8px; }
.stat-change { display: flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 500; }
.stat-change.positive { color: #16a34a; }
.stat-change.warning  { color: #94a3b8; }
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
.bar-pending-strip { width: 100%; background: #94a3b8; border-radius: 0 0 6px 6px; min-height: 0; }
.bar-label  { font-size: 13px; font-weight: 600; color: #374151; margin-top: 8px; }
.bar-sub    { font-size: 11px; color: #9ca3af; margin-top: 2px; }
.bar-counts { display: flex; gap: 6px; font-size: 12px; font-weight: 600; margin-top: 2px; }
.c-dark   { color: #1f3c4d; }
.c-orange { color: #94a3b8; }

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
.dot-orange { background: #94a3b8; }

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