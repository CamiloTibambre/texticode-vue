<template>
  <div style="display:flex;min-height:100vh">
    <AppSidebar rol="admin" />

    <main class="main">
      <h1 class="title" :class="{ 'fade-in': mounted }">Gestión de Producción</h1>

      <div class="ordenes-header" :class="{ 'fade-in': mounted }" style="transition-delay:.08s">
        <h2 style="font-size:15px;margin:0;font-weight:600;color:#374151">Órdenes de Producción</h2>
        <button class="btn-nueva-orden" @click="abrirModal(null)">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
          </svg>
          Nueva Orden
        </button>
      </div>

      <!-- STATS con contadores animados -->
      <div class="stats">
        <div
          class="stat-card"
          v-for="(s, i) in statsOrdenes"
          :key="s.label"
          :class="{ 'card-visible': mounted }"
          :style="{ transitionDelay: i * 70 + 'ms' }"
        >
          <div class="stat-header">
            <span class="stat-title">{{ s.label }}</span>
            <span class="stat-icon" :class="s.color">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <circle cx="12" cy="12" r="9"/><path stroke-linecap="round" d="M12 7v5l3 3"/>
              </svg>
            </span>
          </div>
          <div class="stat-number" :class="s.color">{{ s.display }}</div>
        </div>
      </div>

      <!-- TABLA -->
      <div class="section-card" :class="{ 'section-visible': mounted }" style="transition-delay:320ms">
        <div class="section-header">
          <h2 class="section-title">Órdenes de Producción</h2>
          <span class="result-count">{{ ordenes.length }} orden(es)</span>
        </div>
        <div class="table-wrapper">
          <table class="orders-table">
            <thead>
              <tr>
                <th class="sortable" @click="doSort('id')">Orden <span class="sort-icon">{{ sIcon('id') }}</span></th>
                <th class="sortable" @click="doSort('cliente')">Cliente <span class="sort-icon">{{ sIcon('cliente') }}</span></th>
                <th>Producto</th>
                <th>Operador</th>
                <th>Estado</th>
                <th class="sortable" @click="doSort('prioridad')">Prioridad <span class="sort-icon">{{ sIcon('prioridad') }}</span></th>
                <th class="sortable" @click="doSort('progreso')">Progreso <span class="sort-icon">{{ sIcon('progreso') }}</span></th>
                <th class="sortable" @click="doSort('fechaLimite')">Fecha Límite <span class="sort-icon">{{ sIcon('fechaLimite') }}</span></th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <TransitionGroup name="row">
                <tr
                  v-for="o in ordenesOrdenadas"
                  :key="o.id"
                  class="table-row"
                  :class="{ 'row-flash': o.flash, 'row-eliminating': o.eliminando }"
                >
                  <td class="order-id">{{ o.id }}</td>
                  <td>{{ o.cliente }}</td>
                  <td>{{ o.producto }}</td>
                  <td>
                    <div class="operador-cell">
                      <div class="op-avatar">{{ o.operador.charAt(0) }}</div>
                      {{ o.operador }}
                    </div>
                  </td>
                  <td>
                    <select v-model="o.estado" class="action-select" :class="o.estado + '-select'" @change="onEstadoCambio(o)">
                      <option value="en-proceso">En Proceso</option>
                      <option value="pendiente">Pendiente</option>
                      <option value="completado">Completado</option>
                      <option value="atrasado">Retrasado</option>
                    </select>
                  </td>
                  <td><span class="badge-priority" :class="o.prioridad">{{ o.prioridadLabel }}</span></td>
                  <td>
                    <div class="table-progress">
                      <div class="progress-bar">
                        <div
                          class="progress-fill"
                          :class="{ 'fill-done': o.progreso === 100, 'fill-atrasado': o.estado === 'atrasado' }"
                          :style="{ width: o.progresoDisplay + '%' }"
                        ></div>
                      </div>
                      <span class="progress-pct-small">{{ o.progreso }}%</span>
                    </div>
                  </td>
                  <td :class="{ 'fecha-vencida-cell': estaVencida(o.fechaLimite) && o.estado !== 'completado' }">
                    {{ o.fechaLimite }}
                    <span v-if="estaVencida(o.fechaLimite) && o.estado !== 'completado'" class="vencida-tag">Vencida</span>
                  </td>
                  <td class="acciones-cell">
                    <button class="btn-accion btn-ver" title="Ver" @click="verDetalle(o)">
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    </button>
                    <button class="btn-accion btn-editar" @click="abrirModal(o)" title="Editar">
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/></svg>
                    </button>
                    <button class="btn-accion btn-eliminar" @click="solicitarEliminar(o)" title="Eliminar">
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>
                    </button>
                  </td>
                </tr>
              </TransitionGroup>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- MODAL NUEVA / EDITAR -->
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
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Cliente</label>
                <input v-model="form.cliente" class="form-input" :class="{ 'input-error': errores.cliente }" type="text" placeholder="Nombre del cliente">
                <span v-if="errores.cliente" class="error-msg">{{ errores.cliente }}</span>
              </div>
              <div class="form-group">
                <label class="form-label">Producto</label>
                <input v-model="form.producto" class="form-input" :class="{ 'input-error': errores.producto }" type="text" placeholder="Ej: Camisetas Polo x 50">
                <span v-if="errores.producto" class="error-msg">{{ errores.producto }}</span>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Operador</label>
                <input v-model="form.operador" class="form-input" type="text" placeholder="Nombre del operario">
              </div>
              <div class="form-group">
                <label class="form-label">Prioridad</label>
                <select v-model="form.prioridad" class="form-input">
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Estado</label>
                <select v-model="form.estado" class="form-input">
                  <option value="en-proceso">En Proceso</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="completado">Completado</option>
                  <option value="atrasado">Retrasado</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Fecha Límite</label>
                <input v-model="form.fechaLimite" class="form-input" type="date">
              </div>
            </div>
            <!-- Slider interactivo de progreso -->
            <div class="form-group">
              <label class="form-label">Progreso — <strong style="color:#1f3a52">{{ form.progreso }}%</strong></label>
              <input v-model.number="form.progreso" type="range" min="0" max="100" class="progress-slider">
              <div class="slider-preview-bar">
                <div class="slider-preview-fill" :style="{ width: form.progreso + '%' }" :class="{ 'fill-done': form.progreso === 100 }"></div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-cancelar" @click="cerrarModal">Cancelar</button>
            <button class="btn-guardar" @click="guardar" :disabled="guardando">
              <span v-if="guardando">Guardando...</span>
              <span v-else>{{ editando ? 'Guardar Cambios' : 'Crear Orden' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- MODAL VER DETALLE -->
    <Transition name="modal">
      <div v-if="detalleOrden" class="modal-overlay" @click.self="detalleOrden = null">
        <div class="modal-container">
          <div class="modal-header">
            <span class="modal-title">Detalle — Orden {{ detalleOrden.id }}</span>
            <button class="modal-close" @click="detalleOrden = null">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="detalle-grid">
              <div class="detalle-item"><span class="detalle-label">Cliente</span><span class="detalle-val">{{ detalleOrden.cliente }}</span></div>
              <div class="detalle-item"><span class="detalle-label">Producto</span><span class="detalle-val">{{ detalleOrden.producto }}</span></div>
              <div class="detalle-item"><span class="detalle-label">Operador</span><span class="detalle-val">{{ detalleOrden.operador }}</span></div>
              <div class="detalle-item"><span class="detalle-label">Prioridad</span><span class="badge-priority" :class="detalleOrden.prioridad">{{ detalleOrden.prioridadLabel }}</span></div>
              <div class="detalle-item"><span class="detalle-label">Estado</span><span>{{ estadoLabel(detalleOrden.estado) }}</span></div>
              <div class="detalle-item"><span class="detalle-label">Fecha Límite</span><span class="detalle-val" :class="{ 'fecha-vencida-cell': estaVencida(detalleOrden.fechaLimite) }">{{ detalleOrden.fechaLimite }}</span></div>
            </div>
            <div style="margin-top:16px">
              <span class="detalle-label">Progreso — {{ detalleOrden.progreso }}%</span>
              <div class="slider-preview-bar" style="margin-top:8px">
                <div class="slider-preview-fill" :style="{ width: detalleOrden.progreso + '%' }" :class="{ 'fill-done': detalleOrden.progreso === 100 }"></div>
              </div>
            </div>
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
          <p>Se eliminará la orden <strong>{{ confirmOrden.id }}</strong> de <strong>{{ confirmOrden.cliente }}</strong>.</p>
          <div class="confirm-btns">
            <button class="btn-cancelar" @click="confirmOrden = null">Cancelar</button>
            <button class="btn-danger" @click="confirmarEliminar">Sí, eliminar</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- TOAST -->
    <Transition name="toast">
      <div v-if="toastMsg" class="toast" :class="toastType">
        <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="18" height="18">
          <path v-if="toastType==='toast-success'" stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
          <path v-else-if="toastType==='toast-info'" stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
        {{ toastMsg }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppSidebar from '../../components/AppSidebar.vue'

const modalVisible = ref(false)
const editando     = ref(false)
const guardando    = ref(false)
const mounted      = ref(false)
const detalleOrden = ref(null)
const confirmOrden = ref(null)
const toastMsg     = ref('')
const toastType    = ref('toast-success')

const form = ref({ id: null, cliente: '', producto: '', operador: '', prioridad: 'alta', progreso: 0, fechaLimite: '', estado: 'en-proceso' })
const prioridadLabels = { alta: 'Alta', media: 'Media', baja: 'Baja' }

// Ordenamiento
const sortKey = ref('id')
const sortDir = ref(1)
function doSort(key) {
  if (sortKey.value === key) sortDir.value *= -1
  else { sortKey.value = key; sortDir.value = 1 }
}
function sIcon(key) {
  if (sortKey.value !== key) return '⇅'
  return sortDir.value === 1 ? '↑' : '↓'
}

// Datos
const ordenes = ref([
  { id: '001', cliente: 'Textiles del Norte', producto: 'Camisetas Polo x 50',    operador: 'Carlos Mendoza', estado: 'en-proceso', prioridad: 'alta',  prioridadLabel: 'Alta',  progreso: 75, progresoDisplay: 0, fechaLimite: '2024-03-15', flash: false, eliminando: false },
  { id: '002', cliente: 'María González',     producto: 'Vestidos Elegantes x 25', operador: 'Ana López',    estado: 'pendiente',  prioridad: 'media', prioridadLabel: 'Media', progreso: 0,  progresoDisplay: 0, fechaLimite: '2024-03-20', flash: false, eliminando: false },
  { id: '003', cliente: 'Juan Pérez',         producto: 'Pantalones Denim x 30',   operador: 'Luis Torres',  estado: 'atrasado',   prioridad: 'alta',  prioridadLabel: 'Alta',  progreso: 45, progresoDisplay: 0, fechaLimite: '2024-02-28', flash: false, eliminando: false },
])

const displayStats = ref([0, 0, 0, 0])

const statsOrdenes = computed(() => [
  { label: 'Total Órdenes', valor: ordenes.value.length,                                        display: displayStats.value[0], color: 'orange' },
  { label: 'En Proceso',    valor: ordenes.value.filter(o => o.estado === 'en-proceso').length, display: displayStats.value[1], color: 'blue'   },
  { label: 'Completadas',   valor: ordenes.value.filter(o => o.estado === 'completado').length, display: displayStats.value[2], color: 'green'  },
  { label: 'Retrasadas',    valor: ordenes.value.filter(o => o.estado === 'atrasado').length,   display: displayStats.value[3], color: 'gray'   },
])

const ordenesOrdenadas = computed(() =>
  [...ordenes.value].sort((a, b) => {
    const va = a[sortKey.value], vb = b[sortKey.value]
    if (typeof va === 'number') return (va - vb) * sortDir.value
    return va > vb ? sortDir.value : -sortDir.value
  })
)

// Helpers
function estadoLabel(e) {
  return { 'en-proceso': 'En Proceso', pendiente: 'Pendiente', completado: 'Completado', atrasado: 'Retrasado' }[e] || e
}
function estaVencida(fecha) {
  return fecha && new Date(fecha) < new Date()
}

// Validación
const errores = computed(() => ({
  cliente:  !form.value.cliente.trim()  ? 'El cliente es requerido'  : '',
  producto: !form.value.producto.trim() ? 'El producto es requerido' : '',
}))
const formValido = computed(() => !errores.value.cliente && !errores.value.producto)

// Acciones
function abrirModal(o) {
  editando.value = !!o
  form.value = o ? { ...o } : { id: null, cliente: '', producto: '', operador: '', prioridad: 'alta', progreso: 0, fechaLimite: '', estado: 'en-proceso' }
  modalVisible.value = true
}
function cerrarModal() { modalVisible.value = false }

async function guardar() {
  if (!formValido.value) return
  guardando.value = true
  await new Promise(r => setTimeout(r, 600))
  if (editando.value) {
    const idx = ordenes.value.findIndex(o => o.id === form.value.id)
    if (idx !== -1) ordenes.value[idx] = { ...form.value, prioridadLabel: prioridadLabels[form.value.prioridad], progresoDisplay: form.value.progreso, flash: false, eliminando: false }
    showToast('Orden actualizada correctamente', 'toast-success')
  } else {
    const newOrden = { ...form.value, id: String(ordenes.value.length + 1).padStart(3, '0'), prioridadLabel: prioridadLabels[form.value.prioridad], progresoDisplay: 0, flash: false, eliminando: false }
    ordenes.value.push(newOrden)
    setTimeout(() => animarBarra(newOrden), 200)
    showToast('Orden creada correctamente', 'toast-success')
  }
  guardando.value = false
  cerrarModal()
}

function onEstadoCambio(orden) {
  orden.flash = true
  setTimeout(() => { orden.flash = false }, 1200)
  showToast(`Estado: ${estadoLabel(orden.estado)}`, 'toast-info')
}

function verDetalle(o) { detalleOrden.value = o }
function solicitarEliminar(o) { confirmOrden.value = o }

function confirmarEliminar() {
  const o = confirmOrden.value
  confirmOrden.value = null
  o.eliminando = true
  setTimeout(() => {
    ordenes.value = ordenes.value.filter(x => x.id !== o.id)
    showToast(`Orden ${o.id} eliminada`, 'toast-danger')
  }, 400)
}

function showToast(msg, type = 'toast-success') {
  toastMsg.value = msg
  toastType.value = type
  setTimeout(() => { toastMsg.value = '' }, 3000)
}

// Animación barras de progreso
function animarBarra(orden) {
  const target = orden.progreso
  const id = setInterval(() => {
    if (orden.progresoDisplay >= target) { orden.progresoDisplay = target; clearInterval(id) }
    else orden.progresoDisplay += 2
  }, 16)
}

function animateCount(idx, target) {
  let val = 0
  const step = Math.max(1, Math.ceil(target / 40))
  const id = setInterval(() => {
    val += step
    if (val >= target) { displayStats.value[idx] = target; clearInterval(id) }
    else displayStats.value[idx] = val
  }, 20)
}

onMounted(() => {
  setTimeout(() => {
    mounted.value = true
    ordenes.value.forEach(o => animarBarra(o))
    const vals = [
      ordenes.value.length,
      ordenes.value.filter(o => o.estado === 'en-proceso').length,
      ordenes.value.filter(o => o.estado === 'completado').length,
      ordenes.value.filter(o => o.estado === 'atrasado').length,
    ]
    vals.forEach((v, i) => animateCount(i, v))
  }, 100)
})
</script>

<style scoped>
.main { flex: 1; padding: 28px 30px; overflow-y: auto; display: flex; flex-direction: column; gap: 22px; }

.title {
  font-size: 26px; font-weight: 600; color: #111827;
  padding-bottom: 16px; border-bottom: 1px solid #e5e7eb;
  opacity: 0; transform: translateY(-10px);
  transition: opacity .4s ease, transform .4s ease;
}
.title.fade-in { opacity: 1; transform: translateY(0); }

.ordenes-header {
  display: flex; align-items: center; justify-content: space-between;
  opacity: 0; transform: translateY(8px);
  transition: opacity .4s ease .08s, transform .4s ease .08s;
}
.ordenes-header.fade-in { opacity: 1; transform: translateY(0); }

.btn-nueva-orden {
  display: inline-flex; align-items: center; gap: 7px;
  background: #1f3a52; color: #fff; border: none;
  padding: 10px 18px; border-radius: 8px; font-size: 14px; cursor: pointer;
  transition: background .2s, transform .15s;
}
.btn-nueva-orden:hover { background: #162c3d; }
.btn-nueva-orden:active { transform: scale(.97); }

.stats { display: flex; gap: 20px; }
.stat-card {
  background: white; flex: 1; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb;
  opacity: 0; transform: translateY(16px);
  transition: opacity .4s ease, transform .4s ease, box-shadow .2s;
}
.card-visible { opacity: 1; transform: translateY(0); }
.stat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,.08); transform: translateY(-2px) !important; }
.stat-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.stat-title  { font-size: 14px; color: #6b7280; font-weight: 500; }
.stat-icon   { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.stat-icon.orange { background: #fff7ed; color: #ea580c; }
.stat-icon.blue   { background: #eff6ff; color: #2563eb; }
.stat-icon.green  { background: #f0fdf4; color: #16a34a; }
.stat-icon.gray   { background: #f3f4f6; color: #6b7280; }
.stat-number        { font-size: 28px; font-weight: 700; }
.stat-number.orange { color: #ea580c; }
.stat-number.blue   { color: #2563eb; }
.stat-number.green  { color: #16a34a; }
.stat-number.gray   { color: #374151; }

.section-card {
  background: white; border: 1px solid #e5e7eb; border-radius: 14px; padding: 20px 24px;
  opacity: 0; transform: translateY(12px);
  transition: opacity .45s ease, transform .45s ease;
}
.section-visible { opacity: 1; transform: translateY(0); }
.section-header  { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
.section-title   { font-size: 16px; font-weight: 600; }
.result-count    { font-size: 13px; color: #9ca3af; }

.table-wrapper { overflow-x: auto; }
.orders-table  { width: 100%; border-collapse: collapse; font-size: 14px; }
.orders-table thead tr { border-bottom: 1px solid #e5e7eb; }
.orders-table th { text-align: left; padding: 10px 14px; font-size: 13px; font-weight: 600; color: #6b7280; white-space: nowrap; user-select: none; }
.orders-table tbody tr { border-bottom: 1px solid #f3f4f6; }
.orders-table td { padding: 12px 14px; color: #374151; white-space: nowrap; }

.sortable       { cursor: pointer; }
.sortable:hover { color: #374151; }
.sort-icon      { font-size: 11px; margin-left: 4px; opacity: .6; }

.table-row { transition: background .18s, opacity .35s; }
.table-row:hover { background: #f9fafb; }
.table-row.row-eliminating { opacity: 0; background: #fee2e2; }

@keyframes rowFlash { 0%{background:#dbeafe} 100%{background:transparent} }
.row-flash { animation: rowFlash 1.2s ease; }

.order-id { font-weight: 700; color: #111827; }

.operador-cell { display: flex; align-items: center; gap: 8px; }
.op-avatar { width: 28px; height: 28px; border-radius: 50%; background: #e0e7ff; color: #3730a3; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

.action-select { padding: 6px 10px; border-radius: 8px; border: 1px solid #e5e7eb; font-size: 13px; background: white; cursor: pointer; outline: none; }
.en-proceso-select { background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }
.pendiente-select  { background: #fffbeb; color: #92400e; border-color: #fde68a; }
.completado-select { background: #f0fdf4; color: #15803d; border-color: #bbf7d0; }
.atrasado-select   { background: #fef2f2; color: #b91c1c; border-color: #fca5a5; }

.badge-priority { display: inline-flex; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 500; }
.badge-priority.alta  { background: #fee2e2; color: #b91c1c; }
.badge-priority.media { background: #fef3c7; color: #92400e; }
.badge-priority.baja  { background: #f0fdf4; color: #166534; }

.table-progress { display: flex; align-items: center; gap: 8px; min-width: 130px; }
.progress-bar   { flex: 1; height: 8px; background: #e5e7eb; border-radius: 999px; overflow: hidden; }
.progress-fill  { height: 100%; background: #1f3a52; border-radius: 999px; transition: width .6s ease; }
.progress-fill.fill-done     { background: #16a34a; }
.progress-fill.fill-atrasado { background: #dc2626; }
.progress-pct-small { font-size: 12px; font-weight: 600; color: #6b7280; }

.fecha-vencida-cell { color: #dc2626; font-weight: 600; }
.vencida-tag { display: inline-block; background: #fee2e2; color: #dc2626; font-size: 10px; font-weight: 600; padding: 1px 6px; border-radius: 99px; margin-left: 4px; }

.acciones-cell { display: flex; align-items: center; gap: 4px; }
.btn-accion { display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 6px; border: 1px solid #e5e7eb; background: white; cursor: pointer; transition: background .15s, transform .15s; }
.btn-accion:hover  { transform: scale(1.08); }
.btn-accion:active { transform: scale(.93); }
.btn-ver:hover     { background: #eff6ff; border-color: #bfdbfe; color: #2563eb; }
.btn-editar:hover  { background: #fefce8; border-color: #fef08a; }
.btn-eliminar:hover{ background: #fef2f2; border-color: #fecaca; color: #dc2626; }

.progress-slider { width: 100%; height: 6px; appearance: none; border-radius: 99px; background: #e5e7eb; outline: none; cursor: pointer; margin: 8px 0 6px; }
.progress-slider::-webkit-slider-thumb { appearance: none; width: 18px; height: 18px; border-radius: 50%; background: #1f3a52; cursor: pointer; border: 2px solid white; box-shadow: 0 1px 4px rgba(0,0,0,.2); }
.slider-preview-bar  { height: 8px; background: #e5e7eb; border-radius: 99px; overflow: hidden; margin-top: 4px; }
.slider-preview-fill { height: 100%; background: #1f3a52; border-radius: 99px; transition: width .2s ease; }
.slider-preview-fill.fill-done { background: #16a34a; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.4); backdrop-filter: blur(2px); z-index: 1000; display: flex; align-items: center; justify-content: center; }
.modal-container { background: white; border-radius: 14px; width: 560px; max-width: 95vw; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 50px rgba(0,0,0,.15); }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px 16px; border-bottom: 1px solid #e5e7eb; }
.modal-title  { font-size: 16px; font-weight: 600; }
.modal-close  { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px; border: none; background: none; color: #9ca3af; cursor: pointer; transition: color .15s; }
.modal-close:hover { color: #374151; }
.modal-body   { padding: 20px 24px; display: flex; flex-direction: column; gap: 16px; }
.form-row     { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-group   { display: flex; flex-direction: column; gap: 5px; }
.form-label   { font-size: 13px; font-weight: 600; color: #374151; }
.form-input   { border: 1px solid #d1d5db; border-radius: 8px; padding: 9px 12px; font-size: 14px; outline: none; font-family: inherit; width: 100%; transition: border-color .2s; }
.form-input:focus { border-color: #1f3a52; }
.input-error  { border-color: #dc2626 !important; }
.error-msg    { font-size: 12px; color: #dc2626; }
.modal-footer { display: flex; align-items: center; justify-content: flex-end; gap: 10px; padding: 16px 24px 20px; border-top: 1px solid #e5e7eb; }
.btn-cancelar { padding: 9px 18px; border-radius: 8px; border: 1px solid #d1d5db; background: white; font-size: 14px; cursor: pointer; transition: background .2s; }
.btn-cancelar:hover { background: #f3f4f6; }
.btn-guardar  { padding: 9px 20px; border-radius: 8px; border: none; background: #1f3a52; font-size: 14px; font-weight: 600; color: white; cursor: pointer; transition: background .2s; }
.btn-guardar:hover    { background: #162c3d; }
.btn-guardar:disabled { opacity: .6; cursor: not-allowed; }

.detalle-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.detalle-item { display: flex; flex-direction: column; gap: 4px; }
.detalle-label { font-size: 12px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: .04em; }
.detalle-val   { font-size: 14px; color: #111827; font-weight: 500; }

.confirm-box { background: white; border-radius: 14px; padding: 32px 28px; width: 380px; max-width: 95%; box-shadow: 0 20px 50px rgba(0,0,0,.2); text-align: center; }
.confirm-icon   { margin-bottom: 12px; }
.confirm-box h3 { font-size: 18px; font-weight: 600; color: #111827; margin: 0 0 8px; }
.confirm-box p  { font-size: 14px; color: #6b7280; margin: 0 0 24px; }
.confirm-btns   { display: flex; gap: 10px; justify-content: center; }
.btn-danger     { padding: 9px 18px; background: #dc2626; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; transition: background .2s; }
.btn-danger:hover { background: #b91c1c; }

.toast { position: fixed; bottom: 28px; right: 28px; color: white; padding: 12px 18px; border-radius: 10px; font-size: 14px; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 20px rgba(0,0,0,.2); z-index: 2000; }
.toast-success { background: #111827; }
.toast-info    { background: #1d4ed8; }
.toast-danger  { background: #dc2626; }

.modal-enter-active, .modal-leave-active { transition: opacity .25s ease; }
.modal-enter-from, .modal-leave-to       { opacity: 0; }
.toast-enter-active, .toast-leave-active { transition: opacity .3s ease, transform .3s ease; }
.toast-enter-from, .toast-leave-to       { opacity: 0; transform: translateY(12px); }
.row-enter-active, .row-leave-active { transition: opacity .3s ease; }
.row-enter-from, .row-leave-to       { opacity: 0; }
</style>