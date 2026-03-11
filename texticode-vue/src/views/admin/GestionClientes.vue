<template>
  <div class="layout">
    <AppSidebar rol="admin" />
    <main class="content">
      <h1 :class="{ 'fade-in': mounted }">Gestión de Clientes</h1>
      <input v-model="busqueda" type="text" class="search" placeholder="Buscar clientes...">

      <!-- STATS CARDS con contadores animados -->
      <div class="cards">
        <div class="card" :class="{ 'card-visible': mounted }" style="transition-delay: 0ms">
          <h3>Total Clientes</h3>
          <p>{{ displayTotalClientes }}</p>
        </div>
        <div class="card" :class="{ 'card-visible': mounted }" style="transition-delay: 80ms">
          <h3>Clientes Activos</h3>
          <p class="green">{{ displayActivos }}</p>
        </div>
        <div class="card" :class="{ 'card-visible': mounted }" style="transition-delay: 160ms">
          <h3>Órdenes Totales</h3>
          <p class="blue">{{ displayOrdenes }}</p>
        </div>
      </div>

      <!-- LISTA CLIENTES -->
      <section class="table-container" :class="{ 'section-visible': mounted }" style="transition-delay: 200ms">
        <h2>Lista de Clientes</h2>
        <table>
          <thead>
            <tr>
              <th class="sortable" @click="sortClientes('nombre')">
                Nombre <span class="sort-icon">{{ sortIcon('clientes', 'nombre') }}</span>
              </th>
              <th class="sortable" @click="sortClientes('email')">
                Email <span class="sort-icon">{{ sortIcon('clientes', 'email') }}</span>
              </th>
              <th>Teléfono</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <TransitionGroup name="row">
              <tr v-for="c in clientesFiltradosOrdenados" :key="c.id" class="table-row">
                <td class="user-cell">
                  <div class="avatar" :style="{ background: avatarColor(c.iniciales) }">{{ c.iniciales }}</div>
                  {{ c.nombre }}
                </td>
                <td>{{ c.email }}</td>
                <td>{{ c.telefono }}</td>
                <td><span class="badge success">{{ c.estado }}</span></td>
              </tr>
            </TransitionGroup>
          </tbody>
        </table>
        <div v-if="clientesFiltradosOrdenados.length === 0" class="empty-state">
          <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#9ca3af" width="40" height="40">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75s.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"/>
          </svg>
          <p>No se encontraron clientes</p>
        </div>
      </section>

      <!-- COMPROBANTES -->
      <section class="table-container" :class="{ 'section-visible': mounted }" style="transition-delay: 300ms">
        <h2 class="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="section-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="m9 14.25 6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185Z"/>
          </svg>
          Comprobantes de Entrega
        </h2>
        <table>
          <thead>
            <tr>
              <th class="sortable" @click="sortOrdenes('numero')">
                Número de Orden <span class="sort-icon">{{ sortIcon('ordenes', 'numero') }}</span>
              </th>
              <th class="sortable" @click="sortOrdenes('cliente')">
                Cliente <span class="sort-icon">{{ sortIcon('ordenes', 'cliente') }}</span>
              </th>
              <th class="sortable" @click="sortOrdenes('fecha')">
                Fecha de Entrega <span class="sort-icon">{{ sortIcon('ordenes', 'fecha') }}</span>
              </th>
              <th>Productos</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="o in ordenesOrdenadas" :key="o.id" class="table-row" :class="{ 'row-flash': o.flash }">
              <td>{{ o.numero }}</td>
              <td>{{ o.cliente }}</td>
              <td>{{ o.fecha }}</td>
              <td>{{ o.productos }}</td>
              <td><span class="badge" :class="o.estadoClass">{{ o.estado }}</span></td>
              <td class="actions">
                <button class="icon-btn" title="Ver detalle" @click="verDetalle(o)">
                  <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0Z"/>
                  </svg>
                </button>
                <button class="icon-btn" title="Descargar" @click="descargar(o)">
                  <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>

    <!-- MODAL DETALLE -->
    <Transition name="modal">
      <div v-if="ordenSeleccionada" class="modal" @click.self="ordenSeleccionada = null">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Detalle del Comprobante de Entrega</h2>
            <span class="close-btn" @click="ordenSeleccionada = null">&times;</span>
          </div>
          <div class="modal-body">
            <div class="modal-grid">
              <div><p><strong>Número de Orden:</strong></p><p>{{ ordenSeleccionada.numero }}</p></div>
              <div><p><strong>Cliente:</strong></p><p>{{ ordenSeleccionada.cliente }}</p></div>
              <div><p><strong>Fecha de Entrega:</strong></p><p>{{ ordenSeleccionada.fecha }}</p></div>
              <div><p><strong>Estado:</strong></p><span class="badge" :class="ordenSeleccionada.estadoClass">{{ ordenSeleccionada.estado }}</span></div>
            </div>
            <div class="modal-section">
              <p><strong>Productos Entregados:</strong></p>
              <ul><li v-for="p in ordenSeleccionada.productosList" :key="p">{{ p }}</li></ul>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" @click="ordenSeleccionada = null">Cerrar</button>
            <button class="btn-primary btn-icon" @click="descargar(ordenSeleccionada)">
              <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon-download">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/>
              </svg>
              Descargar PDF
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- TOAST -->
    <Transition name="toast">
      <div v-if="toastMsg" class="toast">
        <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="18" height="18">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
        </svg>
        {{ toastMsg }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppSidebar from '../../components/AppSidebar.vue'

const busqueda         = ref('')
const ordenSeleccionada = ref(null)
const mounted          = ref(false)
const toastMsg         = ref('')

// ── Contadores animados ─────────────────────────────────────
const displayTotalClientes = ref(0)
const displayActivos       = ref(0)
const displayOrdenes       = ref(0)

function animateCount(targetRef, target) {
  let val = 0
  const step = Math.max(1, Math.ceil(target / 40))
  const id = setInterval(() => {
    val += step
    if (val >= target) { targetRef.value = target; clearInterval(id) }
    else targetRef.value = val
  }, 20)
}

// ── Datos ───────────────────────────────────────────────────
const clientes = ref([
  { id: 1, nombre: 'María González', email: 'maria.gonzalez@empresa.com', telefono: '+57 300 987 6543', estado: 'Activo', iniciales: 'MG' },
  { id: 2, nombre: 'Juan Pérez',     email: 'juan.perez@comercial.com',   telefono: '+57 300 555 7890', estado: 'Activo', iniciales: 'JP' },
])

const ordenes = ref([
  { id: 1, numero: '001', cliente: 'María González', fecha: '2024-02-15', productos: 'Camisetas Polo x 50, Pantalones x 30', estado: 'Entregado', estadoClass: 'success', productosList: ['Camisetas Polo x 50', 'Pantalones x 30'], flash: false },
  { id: 2, numero: '002', cliente: 'Juan Pérez',     fecha: '2024-02-20', productos: 'Vestidos x 25, Blusas x 40',           estado: 'Pendiente', estadoClass: 'danger',  productosList: ['Vestidos x 25', 'Blusas x 40'],         flash: false },
])

// ── Ordenamiento ────────────────────────────────────────────
const sortKeyClientes = ref('nombre')
const sortDirClientes = ref(1)
const sortKeyOrdenes  = ref('numero')
const sortDirOrdenes  = ref(1)

function sortClientes(key) {
  if (sortKeyClientes.value === key) sortDirClientes.value *= -1
  else { sortKeyClientes.value = key; sortDirClientes.value = 1 }
}
function sortOrdenes(key) {
  if (sortKeyOrdenes.value === key) sortDirOrdenes.value *= -1
  else { sortKeyOrdenes.value = key; sortDirOrdenes.value = 1 }
}
function sortIcon(tabla, key) {
  const k = tabla === 'clientes' ? sortKeyClientes.value : sortKeyOrdenes.value
  const d = tabla === 'clientes' ? sortDirClientes.value : sortDirOrdenes.value
  if (k !== key) return '⇅'
  return d === 1 ? '↑' : '↓'
}

// ── Computed ────────────────────────────────────────────────
const clientesFiltradosOrdenados = computed(() => {
  const lista = clientes.value.filter(c =>
    c.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
    c.email.toLowerCase().includes(busqueda.value.toLowerCase())
  )
  return [...lista].sort((a, b) => {
    const k = sortKeyClientes.value
    return a[k] > b[k] ? sortDirClientes.value : -sortDirClientes.value
  })
})

const ordenesOrdenadas = computed(() =>
  [...ordenes.value].sort((a, b) => {
    const k = sortKeyOrdenes.value
    return a[k] > b[k] ? sortDirOrdenes.value : -sortDirOrdenes.value
  })
)

// ── Colores avatar ──────────────────────────────────────────
const avatarPalette = ['#dbeafe', '#fce7f3', '#d1fae5', '#fef3c7', '#ede9fe']
function avatarColor(iniciales) {
  return avatarPalette[iniciales.charCodeAt(0) % avatarPalette.length]
}

// ── Acciones ────────────────────────────────────────────────
function verDetalle(orden) { ordenSeleccionada.value = orden }

function descargar(orden) {
  orden.flash = true
  setTimeout(() => { orden.flash = false }, 1200)
  showToast(`Descargando comprobante ${orden.numero}...`)
}

function showToast(msg) {
  toastMsg.value = msg
  setTimeout(() => { toastMsg.value = '' }, 3000)
}

// ── onMounted ───────────────────────────────────────────────
onMounted(() => {
  setTimeout(() => {
    mounted.value = true
    animateCount(displayTotalClientes, clientes.value.length)
    animateCount(displayActivos, clientes.value.filter(c => c.estado === 'Activo').length)
    animateCount(displayOrdenes, ordenes.value.length)
  }, 80)
})
</script>

<style scoped>
.layout  { display: flex; min-height: 100vh; }
.content { flex: 1; padding: 28px 30px; }

h1 {
  font-size: 26px; font-weight: 600; color: #111827;
  padding-bottom: 16px; margin-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
  opacity: 0; transform: translateY(-10px);
  transition: opacity .4s ease, transform .4s ease;
}
h1.fade-in { opacity: 1; transform: translateY(0); }

.search {
  width: 300px; padding: 9px 12px 9px 36px;
  border-radius: 8px; border: 1px solid #e5e7eb;
  margin-bottom: 20px; font-size: 14px; outline: none;
  background: white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 24 24' stroke='%239ca3af' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z'/%3E%3C/svg%3E") no-repeat 10px center;
  transition: border-color .2s, box-shadow .2s;
}
.search:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.15); }

.cards { display: flex; gap: 20px; margin-bottom: 30px; }
.card {
  background: white; flex: 1; padding: 20px;
  border-radius: 12px; border: 1px solid #e5e7eb;
  opacity: 0; transform: translateY(16px);
  transition: opacity .4s ease, transform .4s ease, box-shadow .2s;
}
.card:hover { box-shadow: 0 4px 16px rgba(0,0,0,.08); transform: translateY(-2px) !important; }
.card-visible { opacity: 1; transform: translateY(0); }
.card h3 { font-size: 14px; color: #6b7280; font-weight: 500; margin: 0; }
.card p  { font-size: 26px; font-weight: 700; margin: 10px 0 0 0; }
.green { color: #16a34a; }
.blue  { color: #2563eb; }

.table-container {
  background: white; padding: 20px;
  border-radius: 12px; border: 1px solid #e5e7eb;
  margin-bottom: 30px;
  opacity: 0; transform: translateY(12px);
  transition: opacity .45s ease, transform .45s ease;
}
.section-visible { opacity: 1; transform: translateY(0); }
.table-container h2 { font-size: 16px; margin-bottom: 10px; }

table { width: 100%; border-collapse: collapse; }
th    { text-align: left; font-size: 13px; font-weight: 500; color: #6b7280; padding: 12px 0; user-select: none; }
td    { padding: 14px 0; border-top: 1px solid #f3f4f6; font-size: 14px; color: #374151; }

.sortable       { cursor: pointer; }
.sortable:hover { color: #374151; }
.sort-icon      { font-size: 11px; margin-left: 4px; opacity: .6; }

.table-row            { transition: background .18s; }
.table-row:hover      { background: #f9fafb; }

@keyframes rowFlash { 0% { background: #d1fae5; } 100% { background: transparent; } }
.row-flash { animation: rowFlash 1.2s ease; }

.user-cell { display: flex; align-items: center; gap: 10px; }
.avatar    { width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; color: #374151; }

.badge   { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 500; }
.success { background: #dcfce7; color: #15803d; }
.danger  { background: #fee2e2; color: #b91c1c; }

.section-title { display: flex; align-items: center; gap: 8px; font-size: 16px; }
.section-icon  { width: 20px; height: 20px; }

.actions  { display: flex; align-items: center; gap: 8px; }
.icon-btn {
  display: flex; align-items: center; justify-content: center;
  width: 34px; height: 34px; border: 1px solid #e5e7eb;
  border-radius: 8px; background: white; cursor: pointer;
  transition: background .15s, transform .15s;
}
.icon-btn svg    { width: 18px; height: 18px; }
.icon-btn:hover  { background: #f3f4f6; transform: scale(1.08); }
.icon-btn:active { transform: scale(.95); }

.empty-state { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 36px 0; color: #9ca3af; font-size: 14px; }

.modal {
  position: fixed; inset: 0; background: rgba(0,0,0,.4);
  backdrop-filter: blur(3px);
  display: flex; justify-content: center; align-items: center; z-index: 1000;
}
.modal-content { background: #fff; width: 650px; max-width: 95%; border-radius: 12px; padding: 25px 30px; box-shadow: 0 10px 30px rgba(0,0,0,.15); }
.modal-header   { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.modal-header h2{ font-size: 20px; font-weight: 600; }
.close-btn      { font-size: 22px; cursor: pointer; line-height: 1; }
.close-btn:hover{ color: #ef4444; }
.modal-grid     { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
.modal-section  { margin-bottom: 18px; }
.modal-section ul { margin: 8px 0 0 18px; }
.modal-footer   { display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; }

.btn-primary        { background: #1f3b57; color: white; padding: 8px 14px; border-radius: 8px; border: none; cursor: pointer; transition: background .2s; }
.btn-primary:hover  { background: #2d5580; }
.btn-secondary      { background: #f3f4f6; color: #374151; padding: 8px 14px; border-radius: 8px; border: 1px solid #e5e7eb; cursor: pointer; transition: background .2s; }
.btn-secondary:hover{ background: #e5e7eb; }
.btn-icon      { display: flex; align-items: center; gap: 8px; }
.icon-download { width: 18px; height: 18px; }

.modal-enter-active, .modal-leave-active { transition: opacity .25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

.toast {
  position: fixed; bottom: 28px; right: 28px;
  background: #111827; color: white;
  padding: 12px 18px; border-radius: 10px;
  font-size: 14px; display: flex; align-items: center; gap: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,.2); z-index: 2000;
}
.toast-enter-active, .toast-leave-active { transition: opacity .3s ease, transform .3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }

.row-enter-active, .row-leave-active { transition: opacity .3s ease; }
.row-enter-from, .row-leave-to       { opacity: 0; }
</style>