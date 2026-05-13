<template>
  <div class="layout">
    <AppSidebar rol="admin" />

    <main class="main">

      <!-- FONDO DECORATIVO -->
      <div class="bg-orbs" aria-hidden="true">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
        <div class="bg-grid"></div>
      </div>

      <!-- TOAST -->
      <Transition name="toast">
        <div v-if="toast.visible" class="toast" :class="toast.type">
          <svg v-if="toast.type === 'success'" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
          </svg>
          <svg v-else width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H4.645c-1.73 0-2.813-1.874-1.948-3.374L10.052 3.378c.866-1.5 3.032-1.5 3.898 0L21.303 16.126Z"/>
          </svg>
          {{ toast.msg }}
        </div>
      </Transition>

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
                v-for="(ch, i) in 'Eficiencia de Operarios'"
                :key="i"
                class="title-char"
                :style="{ animationDelay: animVisible ? `${i * 35}ms` : '9999s' }"
              >{{ ch === ' ' ? '\u00A0' : ch }}</span>
            </h1>
            <p class="hero-sub">Rendimiento, productividad y control de retrasos</p>
          </div>
        </div>
        <div class="hero-actions-wrap">
          <div class="filters">
            <div class="search-box" :class="{ 'search-focus': searchFocus }">
              <svg class="search-ico" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
              </svg>
              <input
                v-model="busqueda"
                type="text"
                placeholder="Buscar operario..."
                @focus="searchFocus = true"
                @blur="searchFocus = false"
              >
            </div>
            <div class="select-wrapper">
              <select v-model="filtroRendimiento" class="select">
                <option value="">Todos los rendimientos</option>
                <option value="Alto">Alto</option>
                <option value="Medio">Medio</option>
                <option value="Bajo">Bajo</option>
              </select>
              <svg class="select-arrow" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
              </svg>
            </div>
          </div>
          <button class="btn btn-refresh" @click="cargarDatos" :disabled="cargando">
            <svg class="btn-icon" :class="{ 'spin': cargando }" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"/>
            </svg>
            Actualizar
          </button>
        </div>
      </div>

      <!-- STATS -->
      <div v-if="cargando" class="stats">
        <div v-for="i in 4" :key="i" class="stat-card skeleton-card">
          <div class="skeleton-line skeleton-sm"></div>
          <div class="skeleton-line skeleton-lg"></div>
        </div>
      </div>
      <div v-else class="stats" :class="{ 'stats-visible': animVisible }">
        <div
          v-for="(s, i) in statsCards"
          :key="i"
          class="stat-card"
          :style="{ transitionDelay: animVisible ? `${i * 80}ms` : '0ms' }"
        >
          <div class="stat-accent" :style="{ background: s.accentColor }"></div>
          <div class="stat-icon-bg" :style="{ color: s.accentColor }">
            <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" :d="s.iconPath"/>
            </svg>
          </div>
          <h3>{{ s.label }}</h3>
          <p :style="{ color: s.accentColor }">{{ s.display }}</p>
        </div>
      </div>

      <!-- MODAL DETALLE OPERARIO -->
      <Transition name="modal">
        <div v-if="modalDetalle" class="modal" @click.self="modalDetalle = false">
          <div class="modal-content modal-detalle">
            <span class="close" @click="modalDetalle = false">×</span>
            <div v-if="operarioActivo" class="detalle-inner">
              <!-- Cabecera -->
              <div class="detalle-header">
                <div class="detalle-avatar" :style="{ background: avatarBg(operarioActivo.Nombre_Completo), color: avatarColor(operarioActivo.Nombre_Completo) }">
                  {{ iniciales(operarioActivo.Nombre_Completo) }}
                </div>
                <div>
                  <div class="detalle-nombre">{{ operarioActivo.Nombre_Completo }}</div>
                  <div class="detalle-usuario">@{{ operarioActivo.Nombre_Usuario }}</div>
                  <span class="badge-rendimiento" :class="operarioActivo.rendimiento?.toLowerCase()">
                    {{ operarioActivo.rendimiento }}
                  </span>
                </div>
              </div>

              <!-- Métricas -->
              <div class="detalle-metricas">
                <div class="metrica-item">
                  <span class="metrica-label">Prendas / día</span>
                  <span class="metrica-valor azul">{{ operarioActivo.prendas_por_dia }}</span>
                </div>
                <div class="metrica-item">
                  <span class="metrica-label">Total producidas</span>
                  <span class="metrica-valor verde">{{ operarioActivo.total_unidades_producidas }}</span>
                </div>
                <div class="metrica-item">
                  <span class="metrica-label">Órdenes en retraso</span>
                  <span class="metrica-valor" :class="operarioActivo.ordenes_en_retraso > 0 ? 'rojo' : 'verde'">
                    {{ operarioActivo.ordenes_en_retraso }}
                  </span>
                </div>
                <div class="metrica-item">
                  <span class="metrica-label">Completadas</span>
                  <span class="metrica-valor verde">{{ operarioActivo.ordenes_completadas }}</span>
                </div>
                <div class="metrica-item">
                  <span class="metrica-label">En proceso</span>
                  <span class="metrica-valor azul">{{ operarioActivo.ordenes_en_proceso }}</span>
                </div>
                <div class="metrica-item">
                  <span class="metrica-label">Pausadas</span>
                  <span class="metrica-valor amarillo">{{ operarioActivo.ordenes_pausadas }}</span>
                </div>
              </div>

              <!-- Tabla de órdenes -->
              <div v-if="operarioActivo.ordenes_detalle?.length" class="detalle-ordenes">
                <div class="detalle-ordenes-titulo">Órdenes asignadas</div>
                <table class="tabla-ordenes">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Producto</th>
                      <th>Estado</th>
                      <th>Prioridad</th>
                      <th>Avance</th>
                      <th>Fecha límite</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="o in operarioActivo.ordenes_detalle"
                      :key="o.Id_Orden"
                      :class="{ 'orden-retraso': o.en_retraso }"
                    >
                      <td>{{ o.Id_Orden }}</td>
                      <td>{{ o.Producto }}</td>
                      <td>
                        <span class="badge-estado" :class="estadoClass(o.Estado)">{{ o.Estado }}</span>
                      </td>
                      <td>
                        <span class="badge-prioridad" :class="o.Prioridad?.toLowerCase()">{{ o.Prioridad }}</span>
                      </td>
                      <td>
                        <div class="avance-wrap">
                          <div class="avance-bar">
                            <div class="avance-fill" :style="{ width: avancePct(o) + '%', background: o.en_retraso ? '#dc2626' : '#16a34a' }"></div>
                          </div>
                          <span class="avance-txt">{{ o.Unidades_Realizadas }}/{{ o.Unidades }}</span>
                        </div>
                      </td>
                      <td :class="{ 'td-retraso': o.en_retraso }">
                        {{ formatFecha(o.Fecha_Limite) }}
                        <span v-if="o.en_retraso" class="retraso-tag">VENCIDA</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="sin-ordenes">Sin órdenes asignadas</div>
            </div>
            <div v-else class="cargando-detalle">
              <div class="spinner"></div>
              Cargando...
            </div>
          </div>
        </div>
      </Transition>

      <!-- TABLA PRINCIPAL -->
      <div class="table-box" :class="{ 'box-visible': animVisible }" style="transition-delay: 240ms">
        <div class="table-header-bar">
          <div class="table-header-left">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"/>
            </svg>
            Ranking de Operarios
            <span class="count-badge">{{ operariosFiltrados.length }}</span>
          </div>
        </div>

        <!-- SKELETON -->
        <div v-if="cargando" class="table-skeleton">
          <div v-for="i in 5" :key="i" class="table-skeleton-row">
            <span class="skeleton-avatar"></span>
            <span class="skeleton-line skeleton-user"></span>
            <span class="skeleton-line skeleton-tag"></span>
            <span class="skeleton-line skeleton-phone"></span>
            <span class="skeleton-line skeleton-date"></span>
            <span class="skeleton-line skeleton-tag"></span>
          </div>
        </div>

        <!-- ERROR -->
        <div v-else-if="error" class="error-state">
          <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H4.645c-1.73 0-2.813-1.874-1.948-3.374L10.052 3.378c.866-1.5 3.032-1.5 3.898 0L21.303 16.126ZM12 15.75h.007v.008H12v-.008Z"/>
          </svg>
          <p>{{ error }}</p>
          <button class="btn" @click="cargarDatos">Reintentar</button>
        </div>

        <!-- TABLA -->
        <table v-else>
          <thead>
            <tr>
              <th class="th-rank">#</th>
              <th class="th-sortable" @click="sortBy('Nombre_Completo')">
                <span class="th-inner">
                  Operario
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="sort-neutral">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4"/>
                  </svg>
                </span>
              </th>
              <th class="th-sortable" @click="sortBy('prendas_por_dia')">
                <span class="th-inner">
                  Prendas / día
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="sort-neutral">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4"/>
                  </svg>
                </span>
              </th>
              <th>Total producidas</th>
              <th>En retraso</th>
              <th>Completadas</th>
              <th>Rendimiento</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            <TransitionGroup name="row">
              <tr
                v-for="(op, idx) in operariosOrdenados"
                :key="op.Id_Usuario"
                class="table-row"
                :style="{ animationDelay: `${idx * 40}ms` }"
              >
                <!-- Posición en ranking -->
                <td class="td-rank">
                  <span class="rank-num" :class="{ 'rank-gold': idx === 0, 'rank-silver': idx === 1, 'rank-bronze': idx === 2 }">
                    {{ idx + 1 }}
                  </span>
                </td>

                <!-- Operario -->
                <td>
                  <div class="user">
                    <div class="avatar" :style="{ background: avatarBg(op.Nombre_Completo), color: avatarColor(op.Nombre_Completo) }">
                      {{ iniciales(op.Nombre_Completo) }}
                    </div>
                    <div class="user-info">
                      <span class="user-name">{{ op.Nombre_Completo }}</span>
                      <span class="user-handle">@{{ op.Nombre_Usuario }}</span>
                    </div>
                  </div>
                </td>

                <!-- Prendas / día -->
                <td>
                  <div class="prendas-cell">
                    <span class="prendas-num">{{ op.prendas_por_dia }}</span>
                    <div class="mini-bar-wrap">
                      <div class="mini-bar">
                        <div class="mini-bar-fill" :style="{ width: miniBarPct(op.prendas_por_dia) + '%', background: rendimientoColor(op.rendimiento) }"></div>
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Total producidas -->
                <td>
                  <span class="num-cell">{{ op.total_unidades_producidas }}</span>
                </td>

                <!-- En retraso -->
                <td>
                  <span class="retraso-cell" :class="{ 'retraso-activo': op.ordenes_en_retraso > 0 }">
                    <svg v-if="op.ordenes_en_retraso > 0" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H4.645c-1.73 0-2.813-1.874-1.948-3.374L10.052 3.378c.866-1.5 3.032-1.5 3.898 0L21.303 16.126Z"/>
                    </svg>
                    {{ op.ordenes_en_retraso }}
                  </span>
                </td>

                <!-- Completadas -->
                <td>
                  <span class="completadas-cell">{{ op.ordenes_completadas }}</span>
                </td>

                <!-- Rendimiento -->
                <td>
                  <span class="badge-rendimiento" :class="op.rendimiento?.toLowerCase()">
                    {{ op.rendimiento }}
                  </span>
                </td>

                <!-- Ver detalle -->
                <td>
                  <button class="action-btn" @click="verDetalle(op.Id_Usuario)" title="Ver detalle">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                    </svg>
                  </button>
                </td>
              </tr>
            </TransitionGroup>

            <tr v-if="operariosOrdenados.length === 0 && !cargando">
              <td colspan="8" class="empty-state">
                <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75Z"/>
                </svg>
                <p>No se encontraron operarios</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppSidebar from '../../components/AppSidebar.vue'
import { getEficienciaOperarios, getEficienciaOperario } from '../../services/api.js'

// ── ESTADO ──
const animVisible      = ref(false)
const cargando         = ref(true)
const error            = ref('')
const searchFocus      = ref(false)
const busqueda         = ref('')
const filtroRendimiento = ref('')
const operarios        = ref([])
const modalDetalle     = ref(false)
const operarioActivo   = ref(null)
const sortKey          = ref('prendas_por_dia')
const sortDir          = ref(-1)  // descendente por defecto (más alto arriba)

const toast = ref({ visible: false, msg: '', type: 'success' })

// ── TOAST ──
function mostrarToast(msg, type = 'success') {
  toast.value = { visible: true, msg, type }
  setTimeout(() => toast.value.visible = false, 2800)
}

// ── CARGA ──
async function cargarDatos() {
  cargando.value = true
  error.value = ''
  try {
    const data = await getEficienciaOperarios()
    operarios.value = data
  } catch (e) {
    error.value = e.message || 'Error al cargar los datos de eficiencia'
    mostrarToast(error.value, 'danger')
  } finally {
    cargando.value = false
  }
}

onMounted(async () => {
  await cargarDatos()
  setTimeout(() => { animVisible.value = true }, 50)
  setTimeout(() => animateStats(), 200)
})

// ── VER DETALLE ──
async function verDetalle(id) {
  operarioActivo.value = null
  modalDetalle.value = true
  try {
    const data = await getEficienciaOperario(id)
    operarioActivo.value = data
  } catch (e) {
    mostrarToast('Error al cargar el detalle', 'danger')
    modalDetalle.value = false
  }
}

// ── ORDENAMIENTO ──
function sortBy(key) {
  if (sortKey.value === key) {
    sortDir.value *= -1
  } else {
    sortKey.value = key
    sortDir.value = -1
  }
}

// ── FILTROS Y ORDEN ──
const operariosFiltrados = computed(() =>
  operarios.value.filter(op => {
    const q = busqueda.value.toLowerCase()
    const matchBusqueda = op.Nombre_Completo?.toLowerCase().includes(q) || op.Nombre_Usuario?.toLowerCase().includes(q)
    const matchRendimiento = !filtroRendimiento.value || op.rendimiento === filtroRendimiento.value
    return matchBusqueda && matchRendimiento
  })
)

const operariosOrdenados = computed(() =>
  [...operariosFiltrados.value].sort((a, b) => {
    const va = a[sortKey.value] ?? 0
    const vb = b[sortKey.value] ?? 0
    return (va > vb ? 1 : va < vb ? -1 : 0) * sortDir.value
  })
)

// ── STATS ANIMADOS ──
const statsDisplay = ref({ total: 0, alto: 0, bajo: 0, retrasos: 0 })

function animateCount(key, target) {
  let val = 0
  const steps = 80
  const step = Math.max(0.1, target / steps)
  const iv = setInterval(() => {
    val += step
    if (val >= target) { statsDisplay.value[key] = target; clearInterval(iv) }
    else statsDisplay.value[key] = Math.floor(val)
  }, 25)
}

function animateStats() {
  const alto  = operarios.value.filter(o => o.rendimiento === 'Alto').length
  const bajo  = operarios.value.filter(o => o.rendimiento === 'Bajo').length
  const retrs = operarios.value.reduce((acc, o) => acc + (o.ordenes_en_retraso || 0), 0)
  animateCount('total',    operarios.value.length)
  animateCount('alto',     alto)
  animateCount('bajo',     bajo)
  animateCount('retrasos', retrs)
}

const ICON_USERS   = 'M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z'
const ICON_TROPHY  = 'M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0'
const ICON_ALERT   = 'M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H4.645c-1.73 0-2.813-1.874-1.948-3.374L10.052 3.378c.866-1.5 3.032-1.5 3.898 0L21.303 16.126ZM12 15.75h.007v.008H12v-.008Z'
const ICON_DOWN    = 'M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181'

const statsCards = computed(() => [
  { label: 'Total Operarios',   display: statsDisplay.value.total,    accentColor: '#1f3a52', iconPath: ICON_USERS  },
  { label: 'Rendimiento Alto',  display: statsDisplay.value.alto,     accentColor: '#16a34a', iconPath: ICON_TROPHY },
  { label: 'Órdenes en Retraso',display: statsDisplay.value.retrasos, accentColor: '#dc2626', iconPath: ICON_ALERT  },
  { label: 'Rendimiento Bajo',  display: statsDisplay.value.bajo,     accentColor: '#d97706', iconPath: ICON_DOWN   },
])

// ── HELPERS VISUALES ──
const PALETTES = [
  { bg: '#dbeafe', color: '#1d4ed8' }, { bg: '#fce7f3', color: '#be185d' },
  { bg: '#d1fae5', color: '#065f46' }, { bg: '#fef9c3', color: '#92400e' },
  { bg: '#ede9fe', color: '#5b21b6' }, { bg: '#fee2e2', color: '#991b1b' },
]
function avatarBg(n)    { return PALETTES[(n?.charCodeAt(0) || 0) % PALETTES.length].bg }
function avatarColor(n) { return PALETTES[(n?.charCodeAt(0) || 0) % PALETTES.length].color }
function iniciales(n)   { return (n || '').split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase() }

const maxPrendas = computed(() => Math.max(...operarios.value.map(o => o.prendas_por_dia || 0), 1))
function miniBarPct(val) { return Math.min(100, (val / maxPrendas.value) * 100) }
function avancePct(o)    { return o.Unidades ? Math.min(100, Math.round((o.Unidades_Realizadas / o.Unidades) * 100)) : 0 }

function rendimientoColor(r) {
  if (r === 'Alto')  return '#16a34a'
  if (r === 'Medio') return '#2563eb'
  return '#dc2626'
}

function estadoClass(estado) {
  const map = { 'Completada': 'completada', 'En Proceso': 'en-proceso', 'Pausado': 'pausado' }
  return map[estado] || ''
}

function formatFecha(f) {
  if (!f) return '—'
  return new Date(f).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
/* ── LAYOUT ── */
.layout { display: flex; min-height: 100vh; background: #f1f5f9; position: relative; overflow: hidden; }
.main { flex: 1; padding: 28px 30px; position: relative; z-index: 1; }

/* ── FONDO ── */
.bg-orbs { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
.orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.07; }
.orb-1 { width: 600px; height: 600px; background: #1f3a52; top: -200px; right: -100px; animation: orbDrift1 18s ease-in-out infinite alternate; }
.orb-2 { width: 400px; height: 400px; background: #16a34a; bottom: -100px; left: 10%; animation: orbDrift2 22s ease-in-out infinite alternate; }
.orb-3 { width: 300px; height: 300px; background: #2563eb; top: 40%; right: 5%; animation: orbDrift3 15s ease-in-out infinite alternate; }
@keyframes orbDrift1 { from { transform: translate(0,0) scale(1); } to { transform: translate(-60px,40px) scale(1.1); } }
@keyframes orbDrift2 { from { transform: translate(0,0) scale(1); } to { transform: translate(40px,-50px) scale(1.15); } }
@keyframes orbDrift3 { from { transform: translate(0,0) scale(1); } to { transform: translate(-30px,30px) scale(0.9); } }
.bg-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(31,58,82,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(31,58,82,0.04) 1px, transparent 1px); background-size: 40px 40px; }

/* ── HERO ── */
.page-hero { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 16px; opacity: 0; transform: translateY(-16px); transition: opacity 0.5s ease, transform 0.5s ease; }
.page-hero.hero-visible { opacity: 1; transform: translateY(0); }
.hero-left { display: flex; align-items: center; gap: 16px; }
.hero-text { display: flex; flex-direction: column; }
.hero-icon-wrap { position: relative; width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; background: #1f3a52; border-radius: 14px; flex-shrink: 0; }
.hero-icon { width: 26px; height: 26px; color: white; }
.hero-icon-ring { position: absolute; border-radius: 50%; border: 1.5px solid #1f3a52; opacity: 0; animation: iconPulse 3s ease-out infinite; }
.ring-1 { width: 68px; height: 68px; animation-delay: 0s; }
.ring-2 { width: 86px; height: 86px; animation-delay: 0.8s; }
@keyframes iconPulse { 0% { transform: scale(0.7); opacity: 0.5; } 100% { transform: scale(1.4); opacity: 0; } }
.hero-title { font-size: 24px; font-weight: 700; color: #111827; margin: 0; display: flex; flex-wrap: wrap; }
.title-char { display: inline-block; opacity: 0; transform: translateY(12px); animation: charReveal 0.4s ease forwards; }
@keyframes charReveal { to { opacity: 1; transform: translateY(0); } }
.hero-sub { font-size: 13px; color: #6b7280; margin: 4px 0 0; }
.hero-actions-wrap { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; flex-shrink: 0; }
.filters { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
.search-box { display: flex; align-items: center; gap: 8px; padding: 9px 14px; background: white; border: 1.5px solid #e5e7eb; border-radius: 10px; transition: border-color 0.2s, box-shadow 0.2s; width: 220px; }
.search-box.search-focus { border-color: #1f3a52; box-shadow: 0 0 0 3px rgba(31,58,82,0.1); }
.search-ico { width: 16px; height: 16px; color: #9ca3af; flex-shrink: 0; }
.search-box input { border: none; outline: none; width: 100%; font-size: 14px; color: #374151; background: transparent; }
.search-box input::placeholder { color: #9ca3af; }
.select-wrapper { position: relative; display: inline-flex; align-items: center; }
.select { padding: 9px 32px 9px 12px; border-radius: 10px; border: 1.5px solid #e5e7eb; font-size: 14px; background: white; appearance: none; -webkit-appearance: none; outline: none; cursor: pointer; transition: border-color 0.2s; }
.select:focus { border-color: #1f3a52; box-shadow: 0 0 0 3px rgba(31,58,82,0.1); }
.select-arrow { position: absolute; right: 10px; width: 14px; height: 14px; color: #6b7280; pointer-events: none; }
.btn { display: flex; align-items: center; gap: 8px; background: #1f3a52; color: white; border: none; padding: 10px 16px; border-radius: 10px; font-size: 14px; font-weight: 500; cursor: pointer; white-space: nowrap; transition: background 0.2s, transform 0.1s; flex-shrink: 0; }
.btn:hover:not(:disabled) { background: #162b3c; transform: translateY(-1px); }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-icon { width: 18px; height: 18px; }
.spin { animation: spinIcon 0.8s linear infinite; }
@keyframes spinIcon { to { transform: rotate(360deg); } }

/* ── STATS ── */
.stats { display: flex; gap: 18px; margin-bottom: 24px; }
.stat-card { background: white; flex: 1; padding: 20px 20px 20px 24px; border-radius: 14px; border: 1px solid #e5e7eb; position: relative; overflow: hidden; opacity: 0; transform: translateY(20px); transition: opacity 0.45s ease, transform 0.45s ease, box-shadow 0.2s; }
.stats-visible .stat-card { opacity: 1; transform: translateY(0); }
.stat-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.09); transform: translateY(-3px) !important; }
.stat-accent { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; border-radius: 4px 0 0 4px; }
.stat-icon-bg { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); opacity: 0.07; }
.stat-icon-bg svg { width: 52px; height: 52px; }
.stat-card h3 { font-size: 13px; color: #6b7280; font-weight: 500; margin: 0 0 10px; }
.stat-card p { font-size: 30px; font-weight: 800; margin: 0; line-height: 1; }
.skeleton-card { pointer-events: none; min-height: 90px; }
.skeleton-line { display: block; border-radius: 999px; background: #e5e7eb; animation: shimmer 1.3s ease-in-out infinite; }
@keyframes shimmer { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
.skeleton-sm { width: 45%; height: 12px; margin-bottom: 16px; }
.skeleton-lg { width: 70%; height: 30px; }

/* ── TABLA BOX ── */
.table-box { background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden; opacity: 0; transform: translateY(16px); transition: opacity 0.45s ease, transform 0.45s ease; }
.box-visible { opacity: 1; transform: translateY(0); }
.table-header-bar { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f1f5f9; background: #f9fafb; }
.table-header-left { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: #374151; }
.table-header-left svg { color: #1f3a52; }
.count-badge { background: #1f3a52; color: white; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 999px; line-height: 1.6; }

/* ── TABLA ── */
table { width: 100%; border-collapse: collapse; }
thead { background: #f9fafb; }
th { text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; padding: 13px 18px; white-space: nowrap; }
.th-rank { width: 48px; text-align: center; }
.th-sortable { cursor: pointer; user-select: none; }
.th-sortable:hover { color: #1f3a52; }
.th-inner { display: inline-flex; align-items: center; gap: 6px; }
.sort-neutral { opacity: 0.35; }
td { padding: 14px 18px; font-size: 14px; border-top: 1px solid #f1f5f9; }
.table-row { transition: background 0.18s; animation: rowSlideIn 0.35s ease both; }
.table-row:hover td { background: #f8fafc; }
@keyframes rowSlideIn { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: translateX(0); } }
.row-enter-active { transition: all 0.3s ease; }
.row-leave-active { transition: all 0.3s ease; }
.row-enter-from { opacity: 0; transform: translateY(-10px); }
.row-leave-to   { opacity: 0; transform: translateX(20px); }

/* ── RANKING ── */
.td-rank { text-align: center; }
.rank-num { display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 50%; font-size: 12px; font-weight: 700; background: #f1f5f9; color: #6b7280; }
.rank-gold   { background: #fef3c7; color: #92400e; }
.rank-silver { background: #f1f5f9; color: #475569; }
.rank-bronze { background: #fde8d4; color: #9a3412; }

/* ── USER ── */
.user { display: flex; align-items: center; gap: 10px; }
.avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
.user-info { display: flex; flex-direction: column; }
.user-name { font-weight: 600; font-size: 14px; color: #111827; }
.user-handle { font-size: 12px; color: #6b7280; }

/* ── CELDAS ── */
.prendas-cell { display: flex; flex-direction: column; gap: 4px; }
.prendas-num { font-size: 15px; font-weight: 700; color: #111827; }
.mini-bar-wrap { width: 80px; }
.mini-bar { height: 4px; background: #e5e7eb; border-radius: 999px; overflow: hidden; }
.mini-bar-fill { height: 100%; border-radius: 999px; transition: width 0.6s ease; }
.num-cell { font-size: 14px; font-weight: 600; color: #374151; }
.retraso-cell { display: inline-flex; align-items: center; gap: 4px; font-weight: 600; color: #6b7280; }
.retraso-activo { color: #dc2626; }
.completadas-cell { font-weight: 600; color: #16a34a; }

/* ── BADGE RENDIMIENTO ── */
.badge-rendimiento { padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; }
.badge-rendimiento.alto  { background: #dcfce7; color: #15803d; }
.badge-rendimiento.medio { background: #dbeafe; color: #1d4ed8; }
.badge-rendimiento.bajo  { background: #fee2e2; color: #b91c1c; }

/* ── ACCIONES ── */
.action-btn { width: 32px; height: 32px; border-radius: 7px; border: none; background: #1f3a52; display: flex; align-items: center; justify-content: center; cursor: pointer; color: white; transition: all 0.15s; }
.action-btn:hover { background: #2d5580; transform: scale(1.07); }

/* ── SKELETON TABLA ── */
.table-skeleton { padding: 18px; display: grid; gap: 12px; }
.table-skeleton-row { display: grid; grid-template-columns: 34px 1.6fr 1fr 0.8fr 0.8fr 0.8fr 0.8fr; align-items: center; gap: 16px; padding: 14px 10px; }
.skeleton-avatar { display: block; width: 34px; height: 34px; border-radius: 999px; background: #e5e7eb; animation: shimmer 1.3s ease-in-out infinite; }
.skeleton-user  { width: 72%; height: 16px; }
.skeleton-tag   { width: 90px; height: 14px; }
.skeleton-phone { width: 70px; height: 14px; }
.skeleton-date  { width: 80px; height: 14px; }

/* ── EMPTY / ERROR ── */
.empty-state, .error-state { text-align: center; padding: 48px 20px; color: #9ca3af; }
.empty-state svg, .error-state svg { margin: 0 auto 12px; display: block; opacity: 0.4; }
.empty-state p, .error-state p { font-size: 14px; margin: 0 0 12px; }
.error-state { color: #dc2626; }

/* ── MODAL DETALLE ── */
.modal { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 20px; }
.modal-content { background: white; width: 100%; max-width: 680px; max-height: 90vh; overflow-y: auto; padding: 30px; border-radius: 16px; position: relative; box-shadow: 0 20px 40px rgba(0,0,0,0.15); }
.close { position: absolute; top: 16px; right: 20px; font-size: 22px; cursor: pointer; color: #9ca3af; background: none; border: none; transition: color 0.15s; }
.close:hover { color: #374151; }

/* Detalle operario */
.detalle-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
.detalle-avatar { width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 800; flex-shrink: 0; }
.detalle-nombre { font-size: 18px; font-weight: 700; color: #111827; }
.detalle-usuario { font-size: 13px; color: #6b7280; margin-bottom: 6px; }

.detalle-metricas { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
.metrica-item { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px 16px; display: flex; flex-direction: column; gap: 4px; }
.metrica-label { font-size: 11px; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; }
.metrica-valor { font-size: 22px; font-weight: 800; }
.metrica-valor.azul  { color: #2563eb; }
.metrica-valor.verde { color: #16a34a; }
.metrica-valor.rojo  { color: #dc2626; }
.metrica-valor.amarillo { color: #d97706; }

/* Tabla de órdenes */
.detalle-ordenes-titulo { font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 12px; }
.tabla-ordenes { width: 100%; border-collapse: collapse; font-size: 13px; }
.tabla-ordenes th { text-align: left; padding: 9px 12px; background: #f9fafb; font-size: 11px; font-weight: 600; color: #6b7280; border-bottom: 1px solid #e5e7eb; }
.tabla-ordenes td { padding: 10px 12px; border-top: 1px solid #f1f5f9; vertical-align: middle; }
.orden-retraso td { background: #fff5f5; }
.td-retraso { color: #dc2626; font-weight: 600; }
.retraso-tag { display: inline-block; background: #dc2626; color: white; font-size: 9px; font-weight: 700; padding: 1px 6px; border-radius: 4px; margin-left: 4px; vertical-align: middle; }

/* Badges órdenes */
.badge-estado { padding: 3px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; }
.badge-estado.completada  { background: #dcfce7; color: #15803d; }
.badge-estado.en-proceso  { background: #dbeafe; color: #1d4ed8; }
.badge-estado.pausado     { background: #fef9c3; color: #92400e; }
.badge-prioridad { padding: 3px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; }
.badge-prioridad.alta   { background: #fee2e2; color: #b91c1c; }
.badge-prioridad.media  { background: #fef9c3; color: #92400e; }
.badge-prioridad.baja   { background: #f3f4f6; color: #374151; }

/* Barra de avance */
.avance-wrap { display: flex; align-items: center; gap: 6px; }
.avance-bar  { flex: 1; height: 5px; background: #e5e7eb; border-radius: 999px; overflow: hidden; min-width: 50px; }
.avance-fill { height: 100%; border-radius: 999px; transition: width 0.5s ease; }
.avance-txt  { font-size: 11px; color: #6b7280; white-space: nowrap; }

.sin-ordenes { text-align: center; padding: 30px; color: #9ca3af; font-size: 14px; }
.cargando-detalle { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 60px; color: #6b7280; }
.spinner { width: 20px; height: 20px; border: 2px solid #e5e7eb; border-top-color: #1f3a52; border-radius: 50%; animation: spinIcon 0.7s linear infinite; }

/* ── TOAST ── */
.toast { position: fixed; bottom: 24px; right: 24px; z-index: 2000; display: flex; align-items: center; gap: 8px; padding: 12px 18px; border-radius: 10px; font-size: 14px; font-weight: 500; color: white; box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
.toast.success { background: #16a34a; }
.toast.danger  { background: #dc2626; }

/* ── TRANSICIONES ── */
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.toast-enter-active { transition: all 0.3s ease; }
.toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from { opacity: 0; transform: translateY(12px); }
.toast-leave-to   { opacity: 0; transform: translateY(12px); }

@media (max-width: 960px) {
  .page-hero { flex-direction: column; align-items: flex-start; }
  .hero-actions-wrap { width: 100%; }
  .stats { flex-wrap: wrap; }
  .stat-card { min-width: calc(50% - 9px); }
  .detalle-metricas { grid-template-columns: repeat(2, 1fr); }
}
</style>