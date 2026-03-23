<template>
  <div class="layout">
    <AppSidebar rol="admin" />
 
    <main class="main">
      <!-- HEADER -->
      <div class="top-bar surface-panel" :class="{ visible: mounted }">
        <div class="top-left">
          <h1 class="page-title">Gestión de Producción</h1>
          <p class="page-sub">{{ ordenes.length }} órdenes registradas</p>
        </div>
        <button class="btn-nueva" @click="abrirModal(null)">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
          </svg>
          Nueva Orden
        </button>
      </div>
 
      <!-- STATS -->
      <div class="stats-grid" :class="{ visible: mounted }">
        <div v-for="(s, i) in stats" :key="i" class="stat-card">
          <div class="stat-lbl">{{ s.label }}</div>
          <div class="stat-num" :class="s.color">{{ s.display }}</div>
        </div>
      </div>
 
      <!-- CARGANDO -->
      <div v-if="cargando" class="loading-wrap">
        <div class="spinner"></div>
        <p>Cargando órdenes...</p>
      </div>
 
      <!-- TABLA -->
      <div v-else class="table-wrap" :class="{ visible: mounted }">
        <div v-if="ordenesFiltradas.length === 0" class="empty-state">
          <svg width="44" height="44" fill="none" viewBox="0 0 24 24" stroke-width="1.2" stroke="#d1d5db">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"/>
          </svg>
          <p>No hay órdenes registradas aún.</p>
        </div>
 
        <table v-else>
          <thead>
            <tr>
              <th @click="doSort('Id_Orden')" class="th-sort"># <span>{{ sIcon('Id_Orden') }}</span></th>
              <th>Cliente</th>
              <th>Producto</th>
              <th>Descripción</th>
              <th @click="doSort('Estado')" class="th-sort">Estado <span>{{ sIcon('Estado') }}</span></th>
              <th @click="doSort('Prioridad')" class="th-sort">Prioridad <span>{{ sIcon('Prioridad') }}</span></th>
              <th @click="doSort('Fecha_Limite')" class="th-sort">Fecha Límite <span>{{ sIcon('Fecha_Limite') }}</span></th>
              <th>Cantidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <TransitionGroup name="row">
              <tr v-for="o in ordenesFiltradas" :key="o.Id_Orden" :class="{ 'row-eliminando': o._eliminando }">
                <td class="td-id">#{{ o.Id_Orden }}</td>
                <td>{{ o.Cliente || '—' }}</td>
                <td>{{ o.Producto || '—' }}</td>
                <td class="td-desc">{{ o.Descripcion }}</td>
                <td><span class="badge-estado" :class="claseEstado(o.Estado)">{{ o.Estado }}</span></td>
                <td><span class="badge-prioridad" :class="clasePrioridad(o.Prioridad)">{{ o.Prioridad }}</span></td>
                <td :class="{ 'fecha-vencida': estaVencida(o.Fecha_Limite) }">{{ formatFecha(o.Fecha_Limite) }}</td>
                <td>{{ o.Cantidad }}</td>
                <td>
                  <div class="acciones">
                    <button class="btn-accion btn-ver"      @click="verDetalle(o)"        title="Ver detalle">
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg>
                    </button>
                    <button class="btn-accion btn-editar"   @click="abrirModal(o)"        title="Editar">
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z"/></svg>
                    </button>
                    <button class="btn-accion btn-eliminar" @click="solicitarEliminar(o)" title="Eliminar">
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </TransitionGroup>
          </tbody>
        </table>
      </div>
    </main>
 
    <!-- MODAL CREAR / EDITAR -->
    <Transition name="modal">
      <div v-if="modalVisible" class="modal-overlay" @click.self="cerrarModal">
        <div class="modal-container">
          <div class="modal-header">
            <span class="modal-title">{{ editando ? 'Editar Orden' : 'Nueva Orden de Producción' }}</span>
            <button class="modal-close" @click="cerrarModal">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="modal-body">
 
            <!-- Fila 1: Cliente + Material -->
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Cliente <span class="req">*</span></label>
                <select v-model="form.Id_Cliente" class="form-input" :class="{ 'input-error': tocado && !form.Id_Cliente }">
                  <option value="">Selecciona un cliente</option>
                  <option v-for="c in clientes" :key="c.Id_Usuario" :value="c.Id_Usuario">
                    {{ c.Nombre_Completo }}
                  </option>
                </select>
                <span v-if="tocado && !form.Id_Cliente" class="error-msg">El cliente es requerido</span>
              </div>
              <div class="form-group">
                <label class="form-label">Material <span class="req">*</span></label>
                <select v-model="form.Id_Material" class="form-input" :class="{ 'input-error': tocado && !form.Id_Material }">
                  <option value="">Selecciona un material</option>
                  <option v-for="m in materiales" :key="m.Id_Material" :value="m.Id_Material">
                    {{ m.Nombre_Material }}
                  </option>
                </select>
                <span v-if="tocado && !form.Id_Material" class="error-msg">El material es requerido</span>
              </div>
            </div>
 
            <!-- Fila 2: Operario -->
            <div class="form-group">
              <label class="form-label">Operario</label>
              <select v-model="form.Id_Operario" class="form-input">
                <option value="">Sin asignar</option>
                <option v-for="op in operarios" :key="op.Id_Usuario" :value="op.Id_Usuario">
                  {{ op.Nombre_Completo }}
                </option>
              </select>
            </div>
 
            <!-- Fila 3: Producto -->
            <div class="form-group">
              <label class="form-label">Producto</label>
              <input v-model="form.Producto" class="form-input" type="text" placeholder="Ej: Camiseta Polo Azul">
            </div>
 
            <!-- Fila 3: Descripción -->
            <div class="form-group">
              <label class="form-label">Descripción <span class="req">*</span></label>
              <input v-model="form.Descripcion" class="form-input" :class="{ 'input-error': tocado && !form.Descripcion }" type="text" placeholder="Ej: Camisetas Polo Azules x 50">
              <span v-if="tocado && !form.Descripcion" class="error-msg">La descripción es requerida</span>
            </div>
 
            <!-- Fila 4: Cantidad + Prioridad -->
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Cantidad <span class="req">*</span></label>
                <input v-model.number="form.Cantidad" class="form-input" type="number" min="1" placeholder="0">
              </div>
              <div class="form-group">
                <label class="form-label">Prioridad</label>
                <select v-model="form.Prioridad" class="form-input">
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </select>
              </div>
            </div>
 
            <!-- Fila 5: Fecha Límite -->
            <div class="form-group">
              <label class="form-label">Fecha Límite <span class="req">*</span></label>
              <input v-model="form.Fecha_Limite" class="form-input" type="date">
            </div>
 
 
 
          </div>
          <div v-if="errorGuardar" class="error-inline">{{ errorGuardar }}</div>
          <div class="modal-footer">
            <button class="btn-cancelar" @click="cerrarModal">Cancelar</button>
            <button class="btn-guardar" @click="guardar" :disabled="guardando">
              {{ guardando ? 'Guardando...' : editando ? 'Guardar Cambios' : 'Crear Orden' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
 
    <!-- MODAL DETALLE -->
    <Transition name="modal">
      <div v-if="detalleOrden" class="modal-overlay" @click.self="detalleOrden = null">
        <div class="modal-container">
          <div class="modal-header">
            <span class="modal-title">Orden #{{ detalleOrden.Id_Orden }}</span>
            <button class="modal-close" @click="detalleOrden = null">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="modal-body detalle-grid">
            <div class="detalle-item"><span class="detalle-label">Cliente</span><span>{{ detalleOrden.Cliente || '—' }}</span></div>
            <div class="detalle-item"><span class="detalle-label">Material</span><span>{{ detalleOrden.NombreMaterial || '—' }}</span></div>
            <div class="detalle-item"><span class="detalle-label">Producto</span><span>{{ detalleOrden.Producto || '—' }}</span></div>
            <div class="detalle-item"><span class="detalle-label">Descripción</span><span>{{ detalleOrden.Descripcion }}</span></div>
            <div class="detalle-item"><span class="detalle-label">Cantidad</span><span>{{ detalleOrden.Cantidad }}</span></div>
            <div class="detalle-item">
              <span class="detalle-label">Estado</span>
              <span class="badge-estado" :class="claseEstado(detalleOrden.Estado)">{{ detalleOrden.Estado }}</span>
            </div>
            <div class="detalle-item">
              <span class="detalle-label">Prioridad</span>
              <span class="badge-prioridad" :class="clasePrioridad(detalleOrden.Prioridad)">{{ detalleOrden.Prioridad }}</span>
            </div>
            <div class="detalle-item">
              <span class="detalle-label">Fecha Límite</span>
              <span :class="{ 'fecha-vencida': estaVencida(detalleOrden.Fecha_Limite) }">{{ formatFecha(detalleOrden.Fecha_Limite) }}</span>
            </div>
            <div class="detalle-item"><span class="detalle-label">Unidades</span><span>{{ detalleOrden.Unidades ?? '—' }}</span></div>
            <div class="detalle-item"><span class="detalle-label">Unidades Realizadas</span><span>{{ detalleOrden.Unidades_Realizadas ?? '—' }}</span></div>
          </div>
          <div class="modal-footer">
            <button class="btn-cancelar" @click="detalleOrden = null">Cerrar</button>
            <button class="btn-guardar" @click="abrirModal(detalleOrden); detalleOrden = null">Editar</button>
          </div>
        </div>
      </div>
    </Transition>
 
    <!-- CONFIRM ELIMINAR -->
    <Transition name="modal">
      <div v-if="confirmOrden" class="modal-overlay" @click.self="confirmOrden = null">
        <div class="confirm-box">
          <div class="confirm-icon">
            <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#dc2626" width="36" height="36">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/>
            </svg>
          </div>
          <h3>¿Eliminar orden?</h3>
          <p>Se eliminará la orden <strong>#{{ confirmOrden.Id_Orden }}</strong> de <strong>{{ confirmOrden.Cliente }}</strong>. Esta acción no se puede deshacer.</p>
          <div class="confirm-btns">
            <button class="btn-cancelar" @click="confirmOrden = null">Cancelar</button>
            <button class="btn-danger"   @click="confirmarEliminar">Sí, eliminar</button>
          </div>
        </div>
      </div>
    </Transition>
 
    <!-- TOAST -->
    <Transition name="toast">
      <div v-if="toastMsg" class="toast" :class="toastType">
        <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="16" height="16">
          <path v-if="toastType === 'toast-success'" stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
          <path v-else-if="toastType === 'toast-info'" stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
          <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
        {{ toastMsg }}
      </div>
    </Transition>
  </div>
</template>
 
<script setup>
import { ref, computed, onBeforeUnmount, onMounted } from 'vue'
import AppSidebar from '../../components/AppSidebar.vue'
import {
  getOrdenes, crearOrden, actualizarOrden, eliminarOrden,
  getUsuarios, getMateriales
} from '../../services/api'
 
// ── ESTADO ────────────────────────────────────────────────────
const mounted       = ref(false)
const cargando      = ref(true)
const errorMsg      = ref('')
const errorGuardar  = ref('')
const guardando     = ref(false)
const tocado        = ref(false)
const modalVisible  = ref(false)
const editando      = ref(false)
const detalleOrden  = ref(null)
const confirmOrden  = ref(null)
const toastMsg      = ref('')
const toastType     = ref('toast-success')
 
const ordenes     = ref([])
const clientes    = ref([])
const materiales  = ref([])
const operarios   = ref([])
const statsDisplay = ref({
  total: 0,
  proceso: 0,
  completadas: 0,
  pausadas: 0,
})

const busqueda        = ref('')
const filtroEstado    = ref('')
const filtroPrioridad = ref('')
const sortKey         = ref('Id_Orden')
const sortDir         = ref(1)
const statTimers      = new Map()
 
const formVacio = () => ({
  Id_Orden:     null,
  Id_Cliente:   '',
  Id_Material:  '',
  Id_Operario:  '',
  Producto:     '',
  Descripcion:  '',
  Cantidad:     1,
  Prioridad:    'Media',
  Estado:       'En Proceso',
  Fecha_Limite: '',
})
const form = ref(formVacio())
 
// ── CARGA INICIAL ─────────────────────────────────────────────
async function cargarDatos() {
  cargando.value = true
  try {
    const [dataOrdenes, dataUsuarios, dataMateriales] = await Promise.all([
      getOrdenes(),
      getUsuarios(),
      getMateriales(),
    ])
    ordenes.value    = dataOrdenes
    clientes.value   = dataUsuarios.filter(u => (u.Rol || '').toLowerCase() === 'cliente')
    operarios.value  = dataUsuarios.filter(u => (u.Rol || '').toLowerCase() === 'operario')
    materiales.value = dataMateriales
    animateStats()
  } catch (err) {
    errorMsg.value = err.message
    ordenes.value    = []
    clientes.value   = []
    materiales.value = []
    animateStats()
  } finally {
    cargando.value = false
  }
}
 
onMounted(async () => {
  await cargarDatos()
  setTimeout(() => mounted.value = true, 50)
})
 
// ── COMPUTED ──────────────────────────────────────────────────
const stats = computed(() => [
  { label: 'Total Órdenes', display: statsDisplay.value.total,       color: 'stat-orange' },
  { label: 'En Proceso',    display: statsDisplay.value.proceso,     color: 'stat-blue'   },
  { label: 'Completadas',   display: statsDisplay.value.completadas, color: 'stat-green'  },
  { label: 'Pausadas',      display: statsDisplay.value.pausadas,    color: 'stat-gray'   },
])

function animateCount(key, target) {
  clearInterval(statTimers.get(key))
  const initial = statsDisplay.value[key] || 0
  const steps = 28
  const delta = target - initial
  let currentStep = 0

  if (delta === 0) {
    statsDisplay.value[key] = target
    return
  }

  const timer = setInterval(() => {
    currentStep += 1
    const progress = currentStep / steps
    statsDisplay.value[key] = Math.round(initial + (delta * progress))

    if (currentStep >= steps) {
      statsDisplay.value[key] = target
      clearInterval(timer)
      statTimers.delete(key)
    }
  }, 18)

  statTimers.set(key, timer)
}

function animateStats() {
  animateCount('total', ordenes.value.length)
  animateCount('proceso', ordenes.value.filter(o => o.Estado === 'En Proceso').length)
  animateCount('completadas', ordenes.value.filter(o => o.Estado === 'Completada').length)
  animateCount('pausadas', ordenes.value.filter(o => o.Estado === 'Pausado').length)
}

onBeforeUnmount(() => {
  statTimers.forEach(timer => clearInterval(timer))
  statTimers.clear()
})
 
const ordenesFiltradas = computed(() => {
  let lista = [...ordenes.value]
  if (busqueda.value) {
    const q = busqueda.value.toLowerCase()
    lista = lista.filter(o =>
      o.Cliente?.toLowerCase().includes(q) ||
      o.Descripcion?.toLowerCase().includes(q)
    )
  }
  if (filtroEstado.value)    lista = lista.filter(o => o.Estado    === filtroEstado.value)
  if (filtroPrioridad.value) lista = lista.filter(o => o.Prioridad === filtroPrioridad.value)
  lista.sort((a, b) => {
    const va = a[sortKey.value], vb = b[sortKey.value]
    if (va == null) return 1
    if (vb == null) return -1
    return (va > vb ? 1 : va < vb ? -1 : 0) * sortDir.value
  })
  return lista
})
 
// ── HELPERS ───────────────────────────────────────────────────
function formatFecha(fecha) {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })
}
function estaVencida(fecha) {
  if (!fecha) return false
  return new Date(fecha) < new Date()
}
function claseEstado(e) {
  return { 'En Proceso': 'estado-proceso', 'Completada': 'estado-completada', 'Pausado': 'estado-pausado' }[e] || ''
}
function clasePrioridad(p) {
  return { 'Alta': 'prio-alta', 'Media': 'prio-media', 'Baja': 'prio-baja' }[p] || ''
}
function doSort(key) {
  if (sortKey.value === key) sortDir.value *= -1
  else { sortKey.value = key; sortDir.value = 1 }
}
function sIcon(key) {
  if (sortKey.value !== key) return '⇅'
  return sortDir.value === 1 ? '↑' : '↓'
}
 
// ── MODAL ─────────────────────────────────────────────────────
function abrirModal(o) {
  tocado.value       = false
  editando.value     = !!o
  errorGuardar.value = ''
  form.value = o ? {
    Id_Orden:     o.Id_Orden,
    Id_Cliente:   o.Id_Cliente,
    Id_Material:  o.Id_Material,
    Id_Operario:  o.Id_Operario  || '',
    Producto:     o.Producto     || '',
    Descripcion:  o.Descripcion  || '',
    Cantidad:     o.Cantidad,
    Prioridad:    o.Prioridad,
    Estado:       o.Estado,
    Fecha_Limite: o.Fecha_Limite?.split('T')[0] || o.Fecha_Limite || '',
  } : formVacio()
  modalVisible.value = true
}
 
function cerrarModal() {
  modalVisible.value = false
  tocado.value       = false
  errorGuardar.value = ''
}
 
async function guardar() {
  tocado.value = true
 
  // Solo valida los campos realmente obligatorios en la BD
  if (!form.value.Id_Cliente || !form.value.Id_Material || !form.value.Descripcion || !form.value.Fecha_Limite) {
    errorGuardar.value = 'Completa todos los campos obligatorios.'
    return
  }
 
  guardando.value    = true
  errorGuardar.value = ''
 
  const payload = {
    Id_Cliente:   form.value.Id_Cliente,
    Id_Material:  form.value.Id_Material,
    Id_Operario:  form.value.Id_Operario  || null,
    Producto:     form.value.Producto     || null,
    Descripcion:  form.value.Descripcion,
    Cantidad:     form.value.Cantidad,
    Prioridad:    form.value.Prioridad,
    Estado:       form.value.Estado,
    Fecha_Limite: form.value.Fecha_Limite,
  }
 
  try {
    if (editando.value) {
      await actualizarOrden(form.value.Id_Orden, payload)
      showToast('Orden actualizada correctamente', 'toast-success')
    } else {
      await crearOrden(payload)
      showToast('Orden creada correctamente', 'toast-success')
    }
    await cargarDatos()
    cerrarModal()
  } catch (e) {
    errorGuardar.value = e.message || 'Error al guardar la orden.'
  } finally {
    guardando.value = false
  }
}
 
// ── DETALLE ───────────────────────────────────────────────────
function verDetalle(o) { detalleOrden.value = o }
 
// ── ELIMINAR ──────────────────────────────────────────────────
function solicitarEliminar(o) { confirmOrden.value = o }
 
async function confirmarEliminar() {
  const o = confirmOrden.value
  confirmOrden.value = null
  o._eliminando = true
  try {
    await eliminarOrden(o.Id_Orden)
    await new Promise(r => setTimeout(r, 350))
    ordenes.value = ordenes.value.filter(x => x.Id_Orden !== o.Id_Orden)
    showToast(`Orden #${o.Id_Orden} eliminada`, 'toast-danger')
  } catch (e) {
    o._eliminando = false
    showToast('Error al eliminar la orden', 'toast-danger')
  }
}
 
// ── TOAST ─────────────────────────────────────────────────────
function showToast(msg, type = 'toast-success') {
  toastMsg.value  = msg
  toastType.value = type
  setTimeout(() => { toastMsg.value = '' }, 3000)
}
</script>
 
<style scoped>
.layout { display: flex; min-height: 100vh; background: #f3f4f6; }
.main   { flex: 1; padding: 28px 30px; overflow-y: auto; }
.top-bar { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; opacity: 0; transform: translateY(-8px); transition: opacity 0.4s, transform 0.4s; border-radius: 18px; padding: 22px 24px; }
.top-bar.visible { opacity: 1; transform: none; }
.page-title { font-size: 22px; font-weight: 700; color: #111827; }
.page-sub   { font-size: 13px; color: #9ca3af; margin-top: 2px; }
.btn-nueva { display: flex; align-items: center; gap: 6px; background: #1f3a52; color: white; border: none; border-radius: 9px; padding: 10px 18px; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.btn-nueva:hover { background: #162d42; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px; opacity: 0; transform: translateY(-6px); transition: opacity 0.4s 0.1s, transform 0.4s 0.1s; }
.stats-grid.visible { opacity: 1; transform: none; }
.stat-card { background: white; border-radius: 12px; padding: 20px 24px; border: 1px solid #e5e7eb; }
.stat-lbl  { font-size: 13px; color: #6b7280; margin-bottom: 8px; }
.stat-num  { font-size: 32px; font-weight: 700; color: #111827; }
.stat-num.stat-orange { color: #111827; }
.stat-num.stat-blue   { color: #2563eb; }
.stat-num.stat-green  { color: #16a34a; }
.stat-num.stat-gray   { color: #6b7280; }
.loading-wrap { display: flex; flex-direction: column; align-items: center; padding: 60px; gap: 14px; color: #9ca3af; font-size: 14px; }
.spinner { width: 32px; height: 32px; border: 3px solid #e5e7eb; border-top-color: #1f3a52; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.table-wrap { background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden; opacity: 0; transform: translateY(8px); transition: opacity 0.4s 0.2s, transform 0.4s 0.2s; }
.table-wrap.visible { opacity: 1; transform: none; }
table { width: 100%; border-collapse: collapse; }
thead tr { background: #f9fafb; }
th { padding: 11px 14px; font-size: 11px; font-weight: 600; color: #6b7280; text-align: left; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #f3f4f6; white-space: nowrap; }
th.th-sort { cursor: pointer; user-select: none; }
th.th-sort:hover { color: #111827; }
td { padding: 12px 14px; font-size: 13px; color: #374151; border-bottom: 1px solid #f9fafb; }
.td-id { font-weight: 700; color: #1f3a52; }
.td-desc { max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
tr:last-child td { border-bottom: none; }
tr:hover td { background: #fafafa; }
.row-eliminando { opacity: 0.4; pointer-events: none; transition: opacity 0.35s; }
.fecha-vencida { color: #dc2626; font-weight: 600; }
.badge-estado, .badge-prioridad { display: inline-block; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; }
.estado-proceso    { background: #dbeafe; color: #1e40af; }
.estado-completada { background: #dcfce7; color: #166534; }
.estado-pausado    { background: #fef3c7; color: #92400e; }
.prio-alta  { background: #fee2e2; color: #991b1b; }
.prio-media { background: #fef3c7; color: #92400e; }
.prio-baja  { background: #f0fdf4; color: #166534; }
.acciones { display: flex; gap: 4px; }
.btn-accion { border: none; border-radius: 6px; padding: 5px 7px; cursor: pointer; display: flex; align-items: center; transition: background 0.15s; }
.btn-ver.btn-accion           { background: #eff6ff; color: #2563eb; }
.btn-ver.btn-accion:hover     { background: #dbeafe; }
.btn-editar.btn-accion        { background: #f0fdf4; color: #16a34a; }
.btn-editar.btn-accion:hover  { background: #dcfce7; }
.btn-eliminar.btn-accion      { background: #fef2f2; color: #dc2626; }
.btn-eliminar.btn-accion:hover { background: #fee2e2; }
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 60px 24px; gap: 10px; color: #9ca3af; font-size: 14px; }
.modal-overlay   { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 100; }
.modal-container { background: white; border-radius: 16px; width: 540px; max-width: 95vw; max-height: 90vh; overflow-y: auto; box-shadow: 0 24px 60px rgba(0,0,0,0.18); }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px 0; }
.modal-title  { font-size: 16px; font-weight: 700; color: #111827; }
.modal-close  { background: none; border: none; cursor: pointer; color: #6b7280; padding: 4px; border-radius: 6px; }
.modal-close:hover { background: #f3f4f6; }
.modal-body   { padding: 20px 24px; display: flex; flex-direction: column; gap: 14px; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px 20px; border-top: 1px solid #f3f4f6; }
.form-row   { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-group { display: flex; flex-direction: column; gap: 5px; }
.form-label { font-size: 12px; font-weight: 600; color: #374151; }
.req        { color: #dc2626; }
.form-input { border: 1px solid #e5e7eb; border-radius: 8px; padding: 9px 12px; font-size: 13px; color: #111827; outline: none; transition: border-color 0.2s; background: white; }
.form-input:focus { border-color: #1f3a52; }
.input-error  { border-color: #ef4444; }
.error-msg    { font-size: 11px; color: #dc2626; }
.error-inline { color: #dc2626; font-size: 13px; padding: 4px 24px; }
.btn-cancelar { background: white; color: #374151; border: 1px solid #e5e7eb; border-radius: 8px; padding: 9px 18px; font-size: 13px; cursor: pointer; }
.btn-guardar  { background: #1f3a52; color: white; border: none; border-radius: 8px; padding: 9px 20px; font-size: 13px; font-weight: 600; cursor: pointer; }
.btn-guardar:disabled { opacity: 0.6; cursor: not-allowed; }
.detalle-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.detalle-item  { display: flex; flex-direction: column; gap: 4px; }
.detalle-label { font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; }
.confirm-box  { background: white; border-radius: 16px; width: 380px; max-width: 95vw; padding: 28px 24px; text-align: center; box-shadow: 0 24px 60px rgba(0,0,0,0.18); }
.confirm-icon { margin-bottom: 12px; }
.confirm-box h3 { font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 8px; }
.confirm-box p  { font-size: 13px; color: #6b7280; margin-bottom: 20px; }
.confirm-btns   { display: flex; gap: 10px; }
.btn-danger { flex: 1; background: #dc2626; color: white; border: none; border-radius: 8px; padding: 10px; font-size: 13px; font-weight: 600; cursor: pointer; }
.toast { position: fixed; bottom: 24px; right: 24px; display: flex; align-items: center; gap: 8px; padding: 12px 18px; border-radius: 10px; font-size: 13px; font-weight: 500; z-index: 200; }
.toast-success { background: #166534; color: white; }
.toast-info    { background: #1e40af; color: white; }
.toast-danger  { background: #991b1b; color: white; }
.toast-enter-active, .toast-leave-active { transition: opacity 0.3s, transform 0.3s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(8px); }
.modal-enter-active, .modal-leave-active { transition: opacity 0.25s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.row-enter-active, .row-leave-active { transition: opacity 0.3s; }
.row-enter-from, .row-leave-to { opacity: 0; }
</style>
