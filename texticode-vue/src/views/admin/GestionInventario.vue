<template>
  <div class="layout">
    <AppSidebar rol="admin" />

    <main class="content">
      <div class="main-content">
        <h1>Gestión de Inventario</h1>
        <hr class="title-divider">

        <!-- TOP BAR -->
        <div class="top-bar">
          <div class="search-wrapper">
            <svg class="search-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
            </svg>
            <input v-model="busqueda" type="text" placeholder="Buscar productos..." class="search-input">
          </div>

          <div class="select-wrapper">
            <select v-model="categoriaFiltro" class="category-select">
              <option value="">Todas las categorías</option>
              <option>Telas</option>
              <option>Hilos</option>
              <option>Accesorios</option>
            </select>
            <svg class="select-arrow" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
            </svg>
          </div>

          <button class="btn-primary" @click="abrirModal(null)">
            <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:18px;height:18px;">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>
            Agregar Material
          </button>
        </div>

        <!-- CARDS RESUMEN -->
        <div class="summary-cards">
          <div class="card">
            <h4>Total Materiales</h4>
            <p class="number">{{ materiales.length }}</p>
          </div>
          <div class="card">
            <h4>Alertas de Stock</h4>
            <p class="number number-danger">{{ alertas.length }}</p>
          </div>
          <div class="card">
            <h4>Categorías</h4>
            <p class="number number-primary">{{ categorias.length }}</p>
          </div>
        </div>

        <!-- ALERTAS -->
        <div class="alert-box" v-if="alertas.length">
          <h3>
            <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width:20px;height:20px;display:inline;vertical-align:middle;margin-right:6px;">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/>
            </svg>
            Alertas de Inventario
          </h3>
          <div v-for="a in alertas" :key="a.id" class="alert-item">
            <span>{{ a.nombre }}</span>
            <span class="badge" :class="a.estadoClass">{{ a.estado }}</span>
          </div>
        </div>

        <!-- TABLA -->
        <div class="table-container">
          <h3>
            <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width:20px;height:20px;display:inline;vertical-align:middle;margin-right:6px;">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"/>
            </svg>
            Inventario de Materiales
          </h3>
          <table>
            <thead>
              <tr>
                <th>Material</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Min/Max</th>
                <th>Cliente</th>
                <th>Estado</th>
                <th>Última Act.</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in materialesFiltrados" :key="m.id">
                <td><strong>{{ m.nombre }}</strong></td>
                <td>{{ m.categoria }}</td>
                <td>
                  <span class="stock-cell">
                    <svg v-if="m.estadoClass === 'success'" class="trend-icon trend-up" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"/>
                    </svg>
                    <svg v-else-if="m.estadoClass === 'warning'" class="trend-icon trend-warning" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/>
                    </svg>
                    <svg v-else class="trend-icon trend-down" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181"/>
                    </svg>
                    {{ m.stock }} {{ m.unidad }}
                  </span>
                </td>
                <td>{{ m.minimo }} / {{ m.maximo }}</td>
                <td>{{ m.cliente }}</td>
                <td><span class="badge" :class="m.estadoClass">{{ m.estado }}</span></td>
                <td class="fecha">{{ m.fecha }}</td>
                <td>
                  <div class="acciones">
                    <svg @click="abrirModal(m)" class="btn-editar" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z"/>
                    </svg>
                    <svg @click="eliminar(m.id)" class="btn-eliminar" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                    </svg>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- MODAL -->
    <div v-if="modalVisible" class="modal" style="display:flex" @click.self="cerrarModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ editando ? 'Editar Material' : 'Agregar Nuevo Material' }}</h2>
          <span class="close" @click="cerrarModal">×</span>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Nombre del Material</label>
            <input v-model="form.nombre" type="text" placeholder="Ej: Tela de Algodón">
          </div>
          <div class="form-group">
            <label>Categoría</label>
            <select v-model="form.categoria">
              <option disabled value="">Selecciona categoría</option>
              <option>Telas</option><option>Hilos</option><option>Accesorios</option>
            </select>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Stock Actual</label>
              <input v-model.number="form.stock" type="number" min="0">
            </div>
            <div class="form-group">
              <label>Unidad</label>
              <input v-model="form.unidad" type="text" placeholder="metros, unidades...">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Stock Mínimo</label>
              <input v-model.number="form.minimo" type="number" min="0">
            </div>
            <div class="form-group">
              <label>Stock Máximo</label>
              <input v-model.number="form.maximo" type="number" min="0">
            </div>
          </div>
          <div class="form-group">
            <label>Cliente</label>
            <select v-model="form.cliente">
              <option disabled value="">Selecciona cliente</option>
              <option>María González</option><option>Juan Pérez</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="cerrarModal">Cancelar</button>
          <button class="btn-primary" @click="guardar">{{ editando ? 'Guardar Cambios' : 'Agregar Material' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppSidebar from '../../components/AppSidebar.vue'

const busqueda        = ref('')
const categoriaFiltro = ref('')
const modalVisible    = ref(false)
const editando        = ref(false)
const form = ref({ id: null, nombre: '', categoria: '', stock: 0, unidad: '', minimo: 0, maximo: 0, cliente: '' })

const categorias = ['Telas', 'Hilos', 'Accesorios', 'Otros']

function calcularEstado(m) {
  if (m.stock === 0)          return { estado: 'Agotado',    estadoClass: 'danger' }
  if (m.stock < m.minimo)     return { estado: 'Stock Bajo', estadoClass: 'warning' }
  return                             { estado: 'En Stock',   estadoClass: 'success' }
}

const materiales = ref([
  { id: 1, nombre: 'Tela de Algodón Blanca',  categoria: 'Telas',      stock: 150, unidad: 'metros',   minimo: 50,  maximo: 500,  cliente: 'María González', fecha: '2024-02-15' },
  { id: 2, nombre: 'Hilo de Poliéster Negro', categoria: 'Hilos',      stock: 25,  unidad: 'rollos',   minimo: 30,  maximo: 200,  cliente: 'Juan Pérez',     fecha: '2024-02-14' },
  { id: 3, nombre: 'Botones Metálicos 15mm',  categoria: 'Accesorios', stock: 0,   unidad: 'unidades', minimo: 100, maximo: 1000, cliente: 'María González', fecha: '2024-02-10' },
  { id: 4, nombre: 'Tela Denim Azul',         categoria: 'Telas',      stock: 80,  unidad: 'metros',   minimo: 40,  maximo: 300,  cliente: 'Juan Pérez',     fecha: '2024-02-12' },
].map(m => ({ ...m, ...calcularEstado(m) })))

const alertas = computed(() => materiales.value.filter(m => m.estadoClass !== 'success'))

const materialesFiltrados = computed(() =>
  materiales.value.filter(m => {
    const b = m.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
    const c = !categoriaFiltro.value || m.categoria === categoriaFiltro.value
    return b && c
  })
)

function abrirModal(m) {
  editando.value = !!m
  form.value = m ? { ...m } : { id: null, nombre: '', categoria: '', stock: 0, unidad: '', minimo: 0, maximo: 0, cliente: '' }
  modalVisible.value = true
}

function cerrarModal() { modalVisible.value = false }

function guardar() {
  const estadoData = calcularEstado(form.value)
  if (editando.value) {
    const idx = materiales.value.findIndex(m => m.id === form.value.id)
    if (idx !== -1) materiales.value[idx] = { ...form.value, ...estadoData, fecha: new Date().toISOString().split('T')[0] }
  } else {
    materiales.value.push({ ...form.value, id: Date.now(), ...estadoData, fecha: new Date().toISOString().split('T')[0] })
  }
  cerrarModal()
}

function eliminar(id) {
  if (confirm('¿Eliminar este material?')) materiales.value = materiales.value.filter(m => m.id !== id)
}
</script>

<style scoped>
.layout       { display: flex; min-height: 100vh; }
.content      { flex: 1; padding: 30px; background-color: #f5f7fa; min-height: 100vh; }
.main-content { max-width: 100%; }

h1 { margin-bottom: 25px; font-size: 26px; font-weight: 600; color: #1a1a2e; }

/* ── TOP BAR ── */
.top-bar { display: flex; gap: 12px; align-items: center; margin-bottom: 25px; }

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.search-icon {
  position: absolute;
  left: 10px;
  width: 16px;
  height: 16px;
  color: #9ca3af;
  pointer-events: none;
}
.search-input {
  padding: 10px 10px 10px 34px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  outline: none;
  width: 260px;
  background: white;
  font-size: 14px;
  color: #374151;
}
.search-input:focus { border-color: #1f3c4d; }

.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.category-select {
  padding: 10px 36px 10px 14px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  outline: none;
  background: white;
  font-size: 14px;
  color: #374151;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  min-width: 180px;
}
.category-select:focus { border-color: #1f3c4d; }
.select-arrow {
  position: absolute;
  right: 10px;
  width: 14px;
  height: 14px;
  color: #6b7280;
  pointer-events: none;
}

.btn-primary {
  margin-left: auto;
  padding: 10px 18px;
  background-color: #1f3c4d;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}
.btn-primary:hover { background-color: #162b36; }

/* ── CARDS ── */
.summary-cards { display: flex; gap: 20px; margin-bottom: 25px; }
.card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  flex: 1;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  border: 1px solid #e5e7eb;
}
.card h4 { font-size: 14px; color: #6b7280; font-weight: 500; margin-bottom: 10px; }
.title-divider { border: none; border-top: 1px solid #e5e7eb; margin-bottom: 25px; margin-top: -10px; }
.number { font-size: 32px; font-weight: 700; color: #111827; }
.number-danger  { color: #dc2626; }
.number-primary { color: #1f3c4d; }

/* ── ALERT BOX ── */
.alert-box {
  background: #f3f4f6;
  padding: 20px 24px;
  border-radius: 12px;
  margin-bottom: 25px;
  border: 1px solid #e5e7eb;
}
.alert-box h3 {
  font-size: 15px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.alert-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  font-size: 14px;
  color: #4b5563;
}
.alert-item + .alert-item { border-top: 1px solid #e5e7eb; }

/* ── BADGES ── */
.badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.success { background-color: #dcfce7; color: #166534; }
.warning { background-color: #fef9c3; color: #854d0e; }
.danger  { background-color: #fee2e2; color: #991b1b; }

/* ── TABLE ── */
.table-container {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  border: 1px solid #e5e7eb;
}
.table-container h3 {
  font-size: 15px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
}
table { width: 100%; border-collapse: collapse; }
thead { background-color: #f9fafb; }
th {
  padding: 12px 14px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
}
td {
  padding: 13px 14px;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #f3f4f6;
}
tbody tr:hover { background-color: #f9fafb; }
tbody tr:last-child td { border-bottom: none; }

/* ── STOCK CELL ── */
.stock-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}
.trend-icon { width: 16px; height: 16px; flex-shrink: 0; }
.trend-up      { color: #16a34a; }
.trend-warning { color: #ca8a04; }
.trend-down    { color: #dc2626; }

/* ── ACCIONES ── */
.acciones { display: flex; gap: 12px; align-items: center; }
.btn-editar, .btn-eliminar { width: 20px; height: 20px; cursor: pointer; color: #9ca3af; }
.btn-editar:hover  { color: #2563eb; }
.btn-eliminar:hover { color: #dc2626; }
.fecha { white-space: nowrap; color: #9ca3af; font-size: 13px; }

/* ── MODAL ── */
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  width: 500px;
  max-width: 95%;
  border-radius: 14px;
  padding: 28px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.2);
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
}
.modal-header h2 { margin: 0; font-size: 18px; font-weight: 600; color: #111827; }
.close { cursor: pointer; font-size: 22px; color: #9ca3af; line-height: 1; }
.close:hover { color: #374151; }

.form-group { display: flex; flex-direction: column; margin-bottom: 15px; }
.form-group label { font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 6px; }
.form-row { display: flex; gap: 15px; }
.form-row .form-group { flex: 1; }
.modal-body input,
.modal-body select {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: #f9fafb;
  font-family: inherit;
  font-size: 14px;
  color: #374151;
  outline: none;
}
.modal-body input:focus,
.modal-body select:focus { border-color: #1f3c4d; background: white; }

.modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; }
.btn-secondary {
  padding: 10px 18px;
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}
.btn-secondary:hover { background-color: #e5e7eb; }
</style>