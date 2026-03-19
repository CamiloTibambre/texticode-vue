<template>
  <div style="display:flex;min-height:100vh;background:#f5f6fa">
    <!-- Barra lateral con rol "cliente": muestra solo las opciones del menú del cliente -->
    <AppSidebar rol="cliente" />

    <main class="main">
      <div class="page-title">Pedidos y Entregas</div>

      <!-- ─────────────────────────────────────────────────────────────
           BARRA DE FILTROS
           busqueda     → busca por campo "Producto" o "Id_Orden"
           filtroEstado → filtra por el ENUM "Estado" de orden_produccion:
                          'En Proceso' | 'Completada' | 'Pausado'
           ───────────────────────────────────────────────────────────── -->
      <div class="filters-bar">
        <div class="search-wrap">
          <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/>
          </svg>
          <!-- v-model vincula el texto a la variable "busqueda" -->
          <input v-model="busqueda" id="searchInput" placeholder="Buscar orden...">
        </div>

        <!-- Los valores deben coincidir exactamente con el ENUM de orden_produccion -->
        <select v-model="filtroEstado" id="statusFilter">
          <option value="">Todos los estados</option>
          <option value="En Proceso">En Proceso</option>
          <option value="Completada">Completada</option>
          <option value="Pausado">Pausado</option>
        </select>
      </div>

      <!-- ─────────────────────────────────────────────────────────────
           INDICADORES KPI
           Se recalculan automáticamente (computed) cada vez que
           cambia el array "pedidos" cargado desde la API.
           ───────────────────────────────────────────────────────────── -->
      <div class="stats-grid">
        <div class="stat-card" v-for="s in stats" :key="s.label">
          <div class="stat-card-head">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" v-html="s.icon"></svg>
            {{ s.label }}
          </div>
          <div class="stat-value" :style="{ color: s.color }">{{ s.valor }}</div>
        </div>
      </div>

      <!-- ─────────────────────────────────────────────────────────────
           ESTADO DE CARGA / ERROR
           cargando → true mientras se espera la respuesta de la API
           error    → se llena si la petición falla
           ───────────────────────────────────────────────────────────── -->
      <div v-if="cargando" class="estado-info">Cargando órdenes...</div>
      <div v-else-if="error" class="estado-error">{{ error }}</div>

      <!-- ─────────────────────────────────────────────────────────────
           LISTA DE ÓRDENES
           "pedidosFiltrados" aplica los filtros de texto y estado
           sobre "pedidos" (datos de orden_produccion).
           ───────────────────────────────────────────────────────────── -->
      <div v-else class="orders-list">
        <!-- Mensaje cuando ninguna orden coincide con los filtros -->
        <div v-if="pedidosFiltrados.length === 0" class="estado-info">
          No se encontraron órdenes con esos filtros.
        </div>

        <!-- Tarjeta individual por cada fila de orden_produccion -->
        <div v-for="o in pedidosFiltrados" :key="o.id" class="order-card">
          <div class="order-top">
            <div class="order-left">

              <!-- ── ENCABEZADO DE LA TARJETA ──────────────────────── -->
              <div class="order-head">
                <!-- Id_Orden de la tabla orden_produccion -->
                <span class="order-num">Orden #{{ o.id }}</span>
                <!-- Badge de Estado: En Proceso | Completada | Pausado -->
                <span class="badge" :class="o.badgeClass">{{ o.estado }}</span>
                <!-- Badge de Prioridad: Alta | Media | Baja -->
                <span class="badge" :class="o.prioridadClass">{{ o.prioridad }}</span>
              </div>

              <!-- Campo "Producto" de orden_produccion -->
              <div class="order-title">{{ o.nombre }}</div>

              <!-- Campo "Descripcion" de orden_produccion -->
              <div class="order-desc">{{ o.descripcion }}</div>

              <!-- ── METADATOS ──────────────────────────────────────── -->
              <div class="order-meta">
                <div>
                  <span class="meta-label">Cantidad</span>
                  <!-- Campo "Cantidad" de orden_produccion -->
                  <span class="meta-value">{{ o.cantidad }}</span>
                </div>
                <div>
                  <span class="meta-label">Entrega Estimada</span>
                  <!-- Campo "Fecha_Limite" de orden_produccion
                       Se resalta en verde si el Estado es 'Completada' -->
                  <span class="meta-value" :class="o.fechaClass">{{ o.fechaEntrega }}</span>
                </div>
                <div>
                  <span class="meta-label">Unidades realizadas</span>
                  <!-- Relación Unidades_Realizadas / Unidades de orden_produccion -->
                  <span class="meta-value">{{ o.unidadesRealizadas }} / {{ o.unidades }}</span>
                </div>
              </div>

              <!-- ── BARRA DE PROGRESO ──────────────────────────────── -->
              <!-- Calculado como: (Unidades_Realizadas / Unidades) * 100
                   Se pone en verde cuando llega al 100% -->
              <div class="progress-row">
                <span class="progress-label">Progreso</span>
                <div class="progress-bg">
                  <div
                    class="progress-fill"
                    :class="{ green: o.progreso === 100 }"
                    :style="{ width: o.progreso + '%' }"
                  ></div>
                </div>
                <span class="progress-pct">{{ o.progreso }}%</span>
              </div>

            </div>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppSidebar from '../../components/AppSidebar.vue'

// ── ESTADO REACTIVO ──────────────────────────────────────────────────────────

/** Texto que el usuario escribe para buscar por Producto o Id_Orden */
const busqueda = ref('')

/** Estado seleccionado en el desplegable (vacío = todos los estados) */
const filtroEstado = ref('')

/**
 * Array principal de órdenes.
 * Fuente: tabla orden_produccion
 * Se filtra opcionalmente por Id_Cliente = usuario logueado (responsabilidad del backend).
 */
const pedidos = ref([])

/** true mientras se espera la respuesta de la API */
const cargando = ref(false)

/** Mensaje de error si la petición al backend falla */
const error = ref('')

// ── FUNCIÓN DE CARGA DESDE LA API ────────────────────────────────────────────

/**
 * Llama al endpoint que consulta la tabla "orden_produccion" y mapea
 * cada fila al formato que usa la plantilla.
 *
 * Campos consumidos de orden_produccion:
 *   Id_Orden            → identificador único (PK)
 *   Producto            → nombre del producto a fabricar
 *   Descripcion         → descripción de la orden
 *   Cantidad            → cantidad total a producir
 *   Fecha_Limite        → fecha de entrega comprometida
 *   Estado              → ENUM: 'En Proceso' | 'Completada' | 'Pausado'
 *   Prioridad           → ENUM: 'Alta' | 'Media' | 'Baja'
 *   Unidades            → unidades totales asignadas al operario
 *   Unidades_Realizadas → unidades completadas hasta el momento
 *
 * Endpoint sugerido: GET /api/ordenes-produccion
 * El backend puede filtrar por Id_Cliente si el usuario logueado es cliente.
 */
async function cargarOrdenes() {
  cargando.value = true
  error.value    = ''
  try {
    const res  = await fetch('/api/ordenes-produccion')
    if (!res.ok) throw new Error(`Error del servidor: ${res.status}`)
    const data = await res.json()   // Array de filas de orden_produccion

    // Convertimos cada fila de la BD al objeto que espera la plantilla
    pedidos.value = data.map(o => {
      // Progreso: porcentaje de avance sobre el total de unidades asignadas
      const unidades           = o.Unidades           ?? 0
      const unidadesRealizadas = o.Unidades_Realizadas ?? 0
      const progreso = unidades > 0
        ? Math.round((unidadesRealizadas / unidades) * 100)
        : 0

      return {
        id:               o.Id_Orden,                    // PK de orden_produccion
        nombre:           o.Producto    || 'Sin nombre', // campo Producto
        descripcion:      o.Descripcion || '',           // campo Descripcion
        cantidad:         `${o.Cantidad} unidades`,      // campo Cantidad
        fechaEntrega:     o.Fecha_Limite,                // campo Fecha_Limite
        estado:           o.Estado,                      // ENUM: En Proceso | Completada | Pausado
        prioridad:        o.Prioridad,                   // ENUM: Alta | Media | Baja
        unidades,
        unidadesRealizadas,
        progreso,

        // Clase CSS del badge de estado (colores según valor del ENUM)
        badgeClass: {
          'En Proceso': 'badge-process',  // azul
          'Completada': 'badge-done',     // verde
          'Pausado':    'badge-pending',  // amarillo
        }[o.Estado] || 'badge-pending',

        // Clase CSS del badge de prioridad
        prioridadClass: {
          'Alta':  'badge-alta',   // rojo
          'Media': 'badge-media',  // amarillo
          'Baja':  'badge-baja',   // gris
        }[o.Prioridad] || 'badge-baja',

        // Colorea la fecha en verde cuando la orden ya está completada
        fechaClass: o.Estado === 'Completada' ? 'ok-date' : '',
      }
    })
  } catch (e) {
    error.value = `No se pudieron cargar las órdenes: ${e.message}`
  } finally {
    cargando.value = false
  }
}

// Se ejecuta automáticamente cuando el componente se monta en pantalla
onMounted(cargarOrdenes)

// ── FILTRADO ─────────────────────────────────────────────────────────────────

/**
 * Devuelve el subconjunto de "pedidos" que coincide con:
 *   - La búsqueda de texto (campo Producto o Id_Orden)
 *   - El estado seleccionado en el filtro desplegable
 * Se recalcula automáticamente al cambiar "busqueda", "filtroEstado" o "pedidos".
 */
const pedidosFiltrados = computed(() =>
  pedidos.value.filter(p => {
    const coincideTexto  = p.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
                        || String(p.id).includes(busqueda.value)
    const coincideEstado = !filtroEstado.value || p.estado === filtroEstado.value
    return coincideTexto && coincideEstado
  })
)

// ── KPIs ─────────────────────────────────────────────────────────────────────

/**
 * Tarjetas de resumen calculadas sobre el array "pedidos".
 * Se recalculan automáticamente cuando llegan nuevos datos de la API.
 * No usan "pedidosFiltrados" a propósito: muestran totales globales.
 */
const stats = computed(() => [
  {
    label: 'Total Órdenes',
    // Cuenta todas las filas de orden_produccion del cliente
    valor: pedidos.value.length,
    color: '#111827',
    icon:  '',
  },
  {
    label: 'En Proceso',
    // Filas con Estado = 'En Proceso'
    valor: pedidos.value.filter(p => p.estado === 'En Proceso').length,
    color: '#1d4ed8',
    icon:  '',
  },
  {
    label: 'Completadas',
    // Filas con Estado = 'Completada'
    valor: pedidos.value.filter(p => p.estado === 'Completada').length,
    color: '#15803d',
    icon:  '',
  },
  {
    label: 'Pausadas',
    // Filas con Estado = 'Pausado'
    valor: pedidos.value.filter(p => p.estado === 'Pausado').length,
    color: '#b45309',
    icon:  '',
  },
])
</script>

<style scoped>
/* ── Layout general ── */
.main { flex: 1; padding: 36px 40px; min-height: 100vh; overflow-y: auto; }
.page-title { font-size: 26px; font-weight: 700; color: #111827; margin-bottom: 24px; }

/* ── Barra de filtros ── */
.filters-bar  { display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
.search-wrap  { position: relative; flex: 1; max-width: 380px; }
.search-wrap svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #9ca3af; width: 16px; height: 16px; }
#searchInput  { width: 100%; padding: 10px 14px 10px 38px; border: 1px solid #e0e3ea; border-radius: 8px; font-size: 14px; outline: none; background: #fff; }
#statusFilter { padding: 10px 14px; border: 1px solid #e0e3ea; border-radius: 8px; font-size: 14px; background: #fff; outline: none; cursor: pointer; min-width: 160px; }

/* ── KPI cards ── */
.stats-grid     { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 24px; }
.stat-card      { background: #fff; border: 1px solid #e8eaf0; border-radius: 12px; padding: 20px 22px; }
.stat-card-head { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; margin-bottom: 12px; }
.stat-value     { font-size: 32px; font-weight: 700; }

/* ── Lista de órdenes ── */
.orders-list { display: flex; flex-direction: column; gap: 16px; }
.order-card  { background: #fff; border: 1px solid #e8eaf0; border-radius: 12px; padding: 24px 28px; }
.order-top   { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
.order-left  { flex: 1; }
.order-head  { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; flex-wrap: wrap; }
.order-num   { font-size: 14px; font-weight: 700; color: #111827; }
.order-title { font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 4px; }
.order-desc  { font-size: 13px; color: #6b7280; margin-bottom: 18px; }
.order-meta  { display: grid; grid-template-columns: repeat(3,auto); gap: 4px 40px; margin-bottom: 18px; }
.meta-label  { font-size: 12px; color: #9ca3af; display: block; margin-bottom: 2px; }
.meta-value  { font-size: 14px; font-weight: 600; color: #111827; }
.ok-date     { color: #15803d; }

/* ── Badges de estado ── */
.badge         { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; }
.badge-process { background: #dbeafe; color: #1d4ed8; }
.badge-done    { background: #dcfce7; color: #15803d; }
.badge-pending { background: #fef9c3; color: #92400e; }

/* ── Badges de prioridad ── */
.badge-alta  { background: #fee2e2; color: #b91c1c; }
.badge-media { background: #fef9c3; color: #92400e; }
.badge-baja  { background: #f3f4f6; color: #6b7280; }

/* ── Barra de progreso ── */
.progress-row   { display: flex; align-items: center; gap: 14px; }
.progress-label { font-size: 13px; color: #6b7280; white-space: nowrap; }
.progress-pct   { font-size: 13px; font-weight: 600; color: #111827; white-space: nowrap; }
.progress-bg    { flex: 1; height: 8px; background: #e5e7eb; border-radius: 99px; overflow: hidden; }
.progress-fill  { height: 100%; background: #111827; border-radius: 99px; transition: width 0.5s ease; }
.progress-fill.green { background: #22c55e; }

/* ── Mensajes de estado de carga ── */
.estado-info  { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
.estado-error { padding: 20px; text-align: center; color: #b91c1c; font-size: 14px; background: #fee2e2; border-radius: 8px; }
</style>