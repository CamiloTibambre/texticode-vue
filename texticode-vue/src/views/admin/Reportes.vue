<template>
  <div class="layout">
    <AppSidebar rol="admin" />
    <main class="content">

      <!-- FONDO DECORATIVO: orbes + grid dentro del mismo contenedor -->
      <div class="bg-orbs" aria-hidden="true">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
        <div class="bg-grid"></div>
      </div>

      <!-- HERO HEADER -->
      <div class="page-hero" :class="{ 'hero-visible': animVisible }">
        <div class="hero-left">
          <div class="hero-icon-wrap">
            <svg class="hero-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"/>
            </svg>
            <div class="hero-icon-ring ring-1"></div>
            <div class="hero-icon-ring ring-2"></div>
          </div>
          <div class="hero-text">
            <h1 class="hero-title">
              <span
                v-for="(ch, i) in 'Reportes'"
                :key="i"
                class="title-char"
                :style="{ animationDelay: animVisible ? `${i * 35}ms` : '9999s' }"
              >{{ ch === ' ' ? '\u00A0' : ch }}</span>
            </h1>
            <p class="hero-sub">Análisis y exportación de datos de la operación</p>
          </div>
        </div>
        <!-- Filtro integrado en el hero -->
        <div class="hero-filter-wrap">
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
      </div>

      <!-- STATS CARDS -->
      <div class="cards" :class="{ 'cards-visible': animVisible }">
        <div
          v-for="(s, i) in statCards"
          :key="i"
          class="stat-card"
          :style="{ transitionDelay: animVisible ? `${i * 80}ms` : '0ms' }"
        >
          <div class="stat-accent" :style="{ background: s.accent }"></div>
          <div class="stat-icon-bg" :style="{ color: s.accent }">
            <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" :d="s.icon"/>
            </svg>
          </div>
          <h3>{{ s.label }}</h3>
          <p :style="{ color: s.accent }">{{ s.display }}</p>
          <div class="stat-change" :style="{ color: s.changeColor }">
            <svg v-if="s.changeIcon" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="change-icon">
              <path stroke-linecap="round" stroke-linejoin="round" :d="s.changeIcon"/>
            </svg>
            {{ s.change }}
          </div>
        </div>
      </div>

      <!-- GRÁFICO DE BARRAS -->
      <section class="table-box" :class="{ 'box-visible': animVisible }" style="transition-delay: 160ms">
        <div class="table-header-bar">
          <div class="table-header-left">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"/>
            </svg>
            Pedidos por Mes
            <span class="count-badge">Últimos 6 meses</span>
          </div>
        </div>
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
                <div class="bar-pending-strip" :style="{ height: pendingHeights[idx] + 'px' }"></div>
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
      </section>

      <!-- REPORTES DISPONIBLES -->
      <section class="table-box" :class="{ 'box-visible': animVisible }" style="transition-delay: 280ms">
        <div class="table-header-bar">
          <div class="table-header-left">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m9 14.25 6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185Z"/>
            </svg>
            Reportes Disponibles
            <span class="count-badge">{{ reportes.length }} reporte{{ reportes.length !== 1 ? 's' : '' }}</span>
          </div>
        </div>

        <div class="report-list-wrap">
          <TransitionGroup name="report" tag="div" class="report-list">
            <div v-for="(r, idx) in reportes" :key="r.titulo" class="report-row"
              :class="{ 'report-downloading': r.downloading, 'report-exporting': r.exporting }"
              :style="{ animationDelay: `${idx * 45}ms` }"
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
                <button class="action-btn view-btn" @click="descargar(r)" :disabled="r.downloading" :title="r.downloading ? 'Descargando...' : 'Descargar PDF'">
                  <svg v-if="!r.downloading" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="16" height="16" shape-rendering="geometricPrecision" style="display:block">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                  </svg>
                  <svg v-else class="spinner" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="16" height="16" style="display:block">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"/>
                  </svg>
                </button>
                <button class="action-btn download-btn" @click="exportarExcel(r)" :disabled="r.exporting" :title="r.exporting ? 'Exportando...' : 'Exportar a Excel'">
                  <svg v-if="!r.exporting" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="16" height="16" shape-rendering="geometricPrecision" style="display:block">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/>
                  </svg>
                  <svg v-else class="spinner" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="16" height="16" style="display:block">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"/>
                  </svg>
                </button>
              </div>
            </div>
          </TransitionGroup>

          <div v-if="reportes.length === 0" class="empty-state">
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/>
            </svg>
            <p>No hay reportes para este tipo</p>
          </div>
        </div>
      </section>

    </main>

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

// ── Stat cards como computed array — igual que GestionClientes ──
const statCards = computed(() => [
  {
    label:       'Pedidos Totales',
    display:     statsDisplay.total,
    accent:      '#1f3a52',
    changeColor: '#2563eb',
    change:      '+8.3%',
    changeIcon:  'M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941',
    icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z',
  },
  {
    label:       'Pedidos Completados',
    display:     statsDisplay.completados,
    accent:      '#16a34a',
    changeColor: '#16a34a',
    change:      '+12.5%',
    changeIcon:  'M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941',
    icon: 'M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  },
  {
    label:       'Tasa Completación',
    display:     statsDisplay.tasa + '%',
    accent:      '#7c3aed',
    changeColor: '#7c3aed',
    change:      '+2.3%',
    changeIcon:  'M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941',
    icon: 'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  },
  {
    label:       'Pedidos Pendientes',
    display:     statsDisplay.pendientes,
    accent:      '#94a3b8',
    changeColor: '#94a3b8',
    change:      '5% del total',
    changeIcon:  null,
    icon: 'M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941',
  },
])

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
        nombre, completadas: 0, pendientes: 0,
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

    const W  = doc.internal.pageSize.width
    const ML = 14
    const MR = W - 14

    doc.setFillColor(...AZUL)
    doc.rect(0, 0, W, 30, 'F')

    const logoB64 = 'iVBORw0KGgoAAAANSUhEUgAABAAAAAQACAYAAAB/HSuDAAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAABKl0lEQVR4nO3d65KcuLIG0OoJv/8r9/nhU9u0GiouQpfMtSIm7LFnukBcSvlJiK/v7+8XAAAAENt/vTcAAAAAeJ4AAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkMD/AXbk8TXH98fGAAAAAElFTkSuQmCC'
    doc.addImage(logoB64, 'PNG', ML, 4, 22, 22)

    const textX = ML + 26
    doc.setTextColor(...BLANCO)
    doc.setFontSize(17)
    doc.setFont('helvetica', 'bold')
    doc.text('TEXTICODE', textX, 14)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(...AZUL_CL)
    doc.text('Gestión Textil Profesional', textX, 20)
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...AZUL_CL)
    doc.text('Bogotá, Colombia', MR, 11, { align: 'right' })
    doc.text('texticode@correo.com', MR, 17, { align: 'right' })
    doc.text('+57 300 000 0000', MR, 23, { align: 'right' })

    doc.setFillColor(...GRIS_BG)
    doc.rect(0, 32, W, 14, 'F')
    doc.setDrawColor(...AZUL)
    doc.setLineWidth(0.4)
    doc.line(0, 46, W, 46)
    doc.setTextColor(...AZUL)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(r.titulo.toUpperCase(), W / 2, 41, { align: 'center' })

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

    const estadoColor = {
      'Completada': { bg: [209, 250, 229], fg: [6, 95, 70] },
      'En Proceso':  { bg: [254, 243, 199], fg: [146, 64, 14] },
      'Pendiente':   { bg: [254, 226, 226], fg: [153, 27, 27] },
    }
    const tableW = MR - ML
    const weightMap = {
      descripcion: 3.5, cliente: 2, correo: 2.2, material: 2,
      orden: 0.8, prioridad: 1, fecha_limite: 1.4, estado: 1.3,
      stock_actual: 1, stock_minimo: 1, categoria: 1.4, telefono: 1.3,
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
            const lines = doc.splitTextToSize(val, avail)
            doc.text(lines[0], cx + 2, y + 5.5)
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
    const ws = wb.addWorksheet(r.titulo.slice(0, 31), { views: [{ showGridLines: false }] })

    const colWidthMap = {
      descripcion: 42, cliente: 24, correo: 28, material: 26,
      orden: 10, prioridad: 14, fecha_limite: 18, estado: 16,
      stock_actual: 14, stock_minimo: 14, categoria: 18, telefono: 16,
    }
    for (let i = 0; i < colCount; i++) {
      const key = headers[i] || ""
      ws.getColumn(i + 1).width = colWidthMap[key] || 16
    }

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

    const excelLogoId = wb.addImage({
      base64: 'iVBORw0KGgoAAAANSUhEUgAABAAAAAQACAYAAAB/HSuDAAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAABKl0lEQVR4nO3d65KcuLIG0OoJv/8r9/nhU9u0GiouQpfMtSIm7LFnukBcSvlJiK/v7+8XAAAAENt/vTcAAAAAeJ4AAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkMD/AXbk8TXH98fGAAAAAElFTkSuQmCC',
      extension: 'png',
    })
    ws.addImage(excelLogoId, { tl: { col: 0, row: 0 }, br: { col: 2, row: 4 }, editAs: 'oneCell' })

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

    const r4 = ws.addRow(Array(colCount).fill(''))
    r4.height = 5
    ws.mergeCells(4, 1, 4, colCount)
    ws.getCell(4, 1).fill = fillSolid(AZUL)
    r4.eachCell({ includeEmpty: true }, c => { c.fill = fillSolid(AZUL) })

    const r5 = ws.addRow(Array(colCount).fill(''))
    r5.height = 8
    r5.eachCell({ includeEmpty: true }, c => { c.fill = fillSolid(BLANCO) })

    const r6 = ws.addRow(Array(colCount).fill(''))
    r6.height = 26
    ws.mergeCells(6, 1, 6, colCount)
    const cTitRep = ws.getCell(6, 1)
    cTitRep.value = r.titulo.toUpperCase()
    cTitRep.font = font(true, 14, AZUL)
    cTitRep.fill = fillSolid(GRIS_BG)
    cTitRep.alignment = align('center', 'middle')
    r6.eachCell({ includeEmpty: true }, c => { c.fill = fillSolid(GRIS_BG) })

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
    r7.eachCell({ includeEmpty: true }, c => { c.fill = fillSolid(BLANCO); c.alignment = align('left', 'middle') })

    const r8 = ws.addRow(Array(colCount).fill(''))
    r8.height = 6
    r8.eachCell({ includeEmpty: true }, c => { c.fill = fillSolid(BLANCO) })

    const headerLabels = headers.map(h => h.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))
    const r9 = ws.addRow([...headerLabels, ...Array(colCount - headerLabels.length).fill('')])
    r9.height = 20
    r9.eachCell({ includeEmpty: true }, (cell) => {
      cell.fill = fillSolid(AZUL)
      cell.font = font(true, 10, BLANCO)
      cell.alignment = align('center', 'middle')
      cell.border = { bottom: borderThin('FFFFFFFF') }
    })

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
      for (let ci = headers.length; ci < colCount; ci++) {
        dataRow.getCell(ci + 1).fill = fillSolid(bgArgb)
      }
    })

    const rEsp = ws.addRow(Array(colCount).fill(''))
    rEsp.height = 6
    rEsp.eachCell({ includeEmpty: true }, c => { c.fill = fillSolid(GRIS_BG) })

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

    const rEsp2 = ws.addRow(Array(colCount).fill(''))
    rEsp2.height = 6
    rEsp2.eachCell({ includeEmpty: true }, c => { c.fill = fillSolid(AZUL) })

    const rPie = ws.addRow(Array(colCount).fill(''))
    rPie.height = 15
    const pieRowIdx = ws.rowCount
    ws.mergeCells(pieRowIdx, 1, pieRowIdx, colCount)
    ws.getCell(pieRowIdx, 1).value = `Este documento es de uso interno de TEXTICODE S.A.S.  ·  Generado el ${fechaHoy}`
    ws.getCell(pieRowIdx, 1).font = font(false, 8, BLANCO, true)
    ws.getCell(pieRowIdx, 1).fill = fillSolid(AZUL)
    ws.getCell(pieRowIdx, 1).alignment = align('center', 'middle')
    rPie.eachCell({ includeEmpty: true }, c => { c.fill = fillSolid(AZUL) })

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
/* ── LAYOUT ── */
.layout  { display: flex; min-height: 100vh; background: #f1f5f9; position: relative; overflow: hidden; }
.content { flex: 1; padding: 28px 30px; position: relative; z-index: 1; }

/* ── FONDO DECORATIVO — bg-grid dentro de bg-orbs ── */
.bg-orbs { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.07;
}
.orb-1 {
  width: 600px; height: 600px;
  background: #1f3a52;
  top: -200px; right: -100px;
  animation: orbDrift1 18s ease-in-out infinite alternate;
}
.orb-2 {
  width: 400px; height: 400px;
  background: #2563eb;
  bottom: -100px; left: 10%;
  animation: orbDrift2 22s ease-in-out infinite alternate;
}
.orb-3 {
  width: 300px; height: 300px;
  background: #16a34a;
  top: 40%; right: 5%;
  animation: orbDrift3 15s ease-in-out infinite alternate;
}

@keyframes orbDrift1 { from { transform: translate(0,0) scale(1); } to { transform: translate(-60px,40px) scale(1.1); } }
@keyframes orbDrift2 { from { transform: translate(0,0) scale(1); } to { transform: translate(40px,-50px) scale(1.15); } }
@keyframes orbDrift3 { from { transform: translate(0,0) scale(1); } to { transform: translate(-30px,30px) scale(0.9); } }

.bg-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(31,58,82,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(31,58,82,0.04) 1px, transparent 1px);
  background-size: 40px 40px;
}

/* ── HERO HEADER ── */
.page-hero {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 28px;
  opacity: 0; transform: translateY(-16px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.page-hero.hero-visible { opacity: 1; transform: translateY(0); }

.hero-left  { display: flex; align-items: center; gap: 16px; }
.hero-text  { display: flex; flex-direction: column; }

.hero-icon-wrap {
  position: relative;
  width: 52px; height: 52px;
  display: flex; align-items: center; justify-content: center;
  background: #1f3a52;
  border-radius: 14px;
  flex-shrink: 0;
}
.hero-icon { width: 26px; height: 26px; color: white; }

.hero-icon-ring {
  position: absolute;
  border-radius: 50%;
  border: 1.5px solid #1f3a52;
  opacity: 0;
  animation: iconPulse 3s ease-out infinite;
}
.ring-1 { width: 68px; height: 68px; animation-delay: 0s; }
.ring-2 { width: 86px; height: 86px; animation-delay: 0.8s; }

@keyframes iconPulse {
  0%   { transform: scale(0.7); opacity: 0.5; }
  100% { transform: scale(1.4); opacity: 0; }
}

.hero-title {
  font-size: 24px; font-weight: 700; color: #111827;
  margin: 0; display: flex; flex-wrap: wrap;
}
.title-char {
  display: inline-block;
  opacity: 0; transform: translateY(12px);
  animation: charReveal 0.4s ease forwards;
}
@keyframes charReveal {
  to { opacity: 1; transform: translateY(0); }
}

.hero-sub { font-size: 13px; color: #6b7280; margin: 4px 0 0 0; }

/* Filtro en el hero */
.hero-filter-wrap { flex-shrink: 0; }
.select-wrapper  { position: relative; display: inline-flex; align-items: center; }
.type-select {
  padding: 9px 36px 9px 14px; border-radius: 10px;
  border: 1.5px solid #e5e7eb; background: white;
  font-size: 14px; color: #374151;
  appearance: none; -webkit-appearance: none; cursor: pointer;
  min-width: 190px; outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.type-select:focus {
  border-color: #1f3a52;
  box-shadow: 0 0 0 3px rgba(31,58,82,0.1);
}
.select-arrow { position: absolute; right: 10px; width: 14px; height: 14px; color: #6b7280; pointer-events: none; }

/* ── STATS CARDS ── */
.cards {
  display: flex; gap: 18px; margin-bottom: 28px;
}
.stat-card {
  background: white; flex: 1;
  padding: 20px 20px 20px 24px;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  position: relative; overflow: hidden;
  opacity: 0; transform: translateY(20px);
  transition: opacity 0.45s ease, transform 0.45s ease, box-shadow 0.2s;
}
.cards-visible .stat-card { opacity: 1; transform: translateY(0); }
.stat-card:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.09);
  transform: translateY(-3px) !important;
}

.stat-accent {
  position: absolute; left: 0; top: 0; bottom: 0;
  width: 4px; border-radius: 4px 0 0 4px;
}
.stat-icon-bg {
  position: absolute; right: 16px; top: 50%;
  transform: translateY(-50%);
  opacity: 0.07;
}
.stat-icon-bg svg { width: 52px; height: 52px; }

.stat-card h3 { font-size: 13px; color: #6b7280; font-weight: 500; margin: 0 0 10px 0; }
.stat-card p  { font-size: 30px; font-weight: 800; margin: 0 0 8px; line-height: 1; }
.stat-change  { display: flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 500; }
.change-icon  { width: 14px; height: 14px; flex-shrink: 0; }

/* ── TABLE BOX ── */
.table-box {
  background: white;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  margin-bottom: 28px;
  overflow: hidden;
  opacity: 0; transform: translateY(16px);
  transition: opacity 0.45s ease, transform 0.45s ease;
}
.box-visible { opacity: 1; transform: translateY(0); }

.table-header-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  background: #f9fafb;
}
.table-header-left {
  display: flex; align-items: center; gap: 8px;
  font-size: 14px; font-weight: 600; color: #374151;
}
.table-header-left svg { color: #1f3a52; }

.count-badge {
  background: #1f3a52; color: white;
  font-size: 11px; font-weight: 600;
  padding: 2px 8px; border-radius: 999px;
  line-height: 1.6;
}

/* ── CHART ── */
.chart { display: flex; align-items: flex-end; gap: 16px; height: 220px; margin: 20px 20px 16px; }
.bar-col { display: flex; flex-direction: column; align-items: center; flex: 1; cursor: pointer; }
.bar-wrapper { display: flex; align-items: flex-end; width: 100%; justify-content: center; position: relative; }
.bar-total {
  width: 80%; background: #1f3a52; border-radius: 6px 6px 0 0;
  position: relative; display: flex; flex-direction: column; justify-content: flex-end;
  min-height: 4px; transition: background 0.2s, transform 0.15s;
}
.bar-total.bar-hovered { background: #2d5580; transform: scaleX(1.05); }
.bar-pending-strip { width: 100%; background: #94a3b8; border-radius: 0 0 6px 6px; min-height: 0; }
.bar-label  { font-size: 13px; font-weight: 600; color: #374151; margin-top: 8px; }
.bar-sub    { font-size: 11px; color: #9ca3af; margin-top: 2px; }
.bar-counts { display: flex; gap: 6px; font-size: 12px; font-weight: 600; margin-top: 2px; }
.c-dark   { color: #1f3a52; }
.c-orange { color: #94a3b8; }

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

.legend { display: flex; gap: 20px; font-size: 13px; color: #374151; justify-content: center; margin: 0 20px 20px; }
.legend-item { display: flex; align-items: center; gap: 6px; }
.dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
.dot-dark   { background: #1f3a52; }
.dot-orange { background: #94a3b8; }

/* ── REPORT LIST ── */
.report-list-wrap { padding: 16px 20px; }
.report-list { display: flex; flex-direction: column; gap: 12px; }

.report-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px 16px; border: 1px solid #e5e7eb; border-radius: 10px;
  background: white;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  animation: rowSlideIn 0.35s ease both;
}
.report-row:hover { border-color: #d1d5db; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
.report-downloading { border-color: #bfdbfe !important; background: #eff6ff !important; }
.report-exporting   { border-color: #bbf7d0 !important; background: #f0fdf4 !important; }

@keyframes rowSlideIn {
  from { opacity: 0; transform: translateX(-12px); }
  to   { opacity: 1; transform: translateX(0); }
}

.report-left { display: flex; align-items: center; gap: 14px; }
.report-icon-wrap {
  width: 38px; height: 38px; background: #f3f4f6; border-radius: 8px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  transition: background 0.2s, transform 0.2s;
}
.report-row:hover .report-icon-wrap { background: #e5e7eb; transform: scale(1.08); }
.report-svg { width: 20px; height: 20px; color: #1f3a52; }
.report-title { font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 4px; }
.report-meta { font-size: 12px; color: #9ca3af; display: flex; gap: 16px; flex-wrap: wrap; }
.report-right { display: flex; align-items: center; gap: 10px; }

.badge-generado {
  background: #dcfce7; color: #16a34a; font-size: 12px; font-weight: 600;
  padding: 4px 12px; border-radius: 20px;
}

/* Botones de acción — mismo estilo que GestionClientes */
.action-btn {
  width: 32px; height: 32px; border-radius: 7px; border: none;
  background: #1f3a52;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: white;
  transition: all 0.15s;
}
.action-btn svg {
  pointer-events: none;
  filter: drop-shadow(0 0 0.3px rgba(255,255,255,0.4));
}
.action-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.view-btn:hover:not(:disabled)     { background: #2d5580; transform: scale(1.07); }
.download-btn:hover:not(:disabled) { background: #16a34a; transform: scale(1.07); }

/* ── SPINNER ── */
@keyframes spin { to { transform: rotate(360deg); } }
.spinner { animation: spin 0.8s linear infinite; }

/* ── EMPTY STATE ── */
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

/* ── TRANSITIONS ── */
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

@media (max-width: 900px) {
  .page-hero { flex-direction: column; align-items: flex-start; gap: 14px; }
  .cards { flex-direction: column; }
  .type-select { width: 100%; }
}
</style>