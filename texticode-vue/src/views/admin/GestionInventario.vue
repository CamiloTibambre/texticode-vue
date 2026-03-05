<template>
  <div class="layout">
    <AppSidebar rol="admin" />

    <main class="content">
      <div class="main-content">
        <h1>Gestión de Inventario</h1>

        <div class="top-bar">
          <input v-model="busqueda" type="text" placeholder="Buscar productos..." class="search-input">
          <select v-model="categoriaFiltro" class="category-select">
            <option value="">Todas las categorías</option>
            <option>Telas</option>
            <option>Hilos</option>
            <option>Accesorios</option>
          </select>
          <button class="btn-primary" @click="abrirModal(null)">+ Agregar Material</button>
        </div>

        <!-- CARDS RESUMEN -->
        <div class="summary-cards">
          <div class="card">
            <h4>Total Materiales</h4>
            <p class="number">{{ materiales.length }}</p>
          </div>
          <div class="card">
            <h4>Alertas de Stock</h4>
            <p class="number danger">{{ alertas.length }}</p>
          </div>
          <div class="card">
            <h4>Categorías</h4>
            <p class="number primary">{{ categorias.length }}</p>
          </div>
        </div>

        <!-- ALERTAS -->
        <div class="alert-box" v-if="alertas.length">
          <h3>⚠ Alertas de Inventario</h3>
          <div v-for="a in alertas" :key="a.id" class="alert-item">
            <span>{{ a.nombre }}</span>
            <span class="badge" :class="a.estadoClass">{{ a.estado }}</span>
          </div>
        </div>

        <!-- TABLA -->
        <div class="table-container">
          <h3>Inventario de Materiales</h3>
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
                <td>{{ m.nombre }}</td>
                <td>{{ m.categoria }}</td>
                <td>{{ m.stock }} {{ m.unidad }}</td>
                <td>{{ m.minimo }} / {{ m.maximo }}</td>
                <td>{{ m.cliente }}</td>
                <td><span class="badge" :class="m.estadoClass">{{ m.estado }}</span></td>
                <td class="fecha">{{ m.fecha }}</td>
                <td>
                  <div class="acciones">
                    <svg @click="abrirModal(m)" class="btn-editar" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z"/>
                    </svg>
                    <svg @click="eliminar(m.id)" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width:20px;height:20px;cursor:pointer;color:#6b7280">
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

const busqueda      = ref('')
const categoriaFiltro = ref('')
const modalVisible  = ref(false)
const editando      = ref(false)
const form = ref({ id: null, nombre: '', categoria: '', stock: 0, unidad: '', minimo: 0, maximo: 0, cliente: '' })

const categorias = ['Telas', 'Hilos', 'Accesorios', 'Otros']

function calcularEstado(m) {
  if (m.stock === 0) return { estado: 'Agotado', estadoClass: 'danger' }
  if (m.stock < m.minimo) return { estado: 'Stock Bajo', estadoClass: 'warning' }
  return { estado: 'En Stock', estadoClass: 'success' }
}

const materiales = ref([
  { id: 1, nombre: 'Tela de Algodón Blanca', categoria: 'Telas',      stock: 150, unidad: 'metros',    minimo: 50,  maximo: 500,  cliente: 'María González', fecha: '2024-02-15' },
  { id: 2, nombre: 'Hilo de Poliéster Negro', categoria: 'Hilos',      stock: 25,  unidad: 'rollos',    minimo: 30,  maximo: 200,  cliente: 'Juan Pérez',     fecha: '2024-02-14' },
  { id: 3, nombre: 'Botones Metálicos 15mm',  categoria: 'Accesorios', stock: 0,   unidad: 'unidades',  minimo: 100, maximo: 1000, cliente: 'María González', fecha: '2024-02-10' },
  { id: 4, nombre: 'Tela Denim Azul',         categoria: 'Telas',      stock: 80,  unidad: 'metros',    minimo: 40,  maximo: 300,  cliente: 'Juan Pérez',     fecha: '2024-02-12' },
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
.layout { display: flex; min-height: 100vh; }
.content { flex: 1; padding: 30px; }
.main-content { background-color: #f5f7fa; min-height: 100vh; }
h1 { margin-bottom: 25px; font-size: 26px; font-weight: 600; }
.top-bar { display: flex; gap: 15px; align-items: center; margin-bottom: 25px; }
.search-input, .category-select { padding: 10px; border-radius: 8px; border: 1px solid #ccc; outline: none; }
.search-input { width: 250px; }
.btn-primary { margin-left: auto; padding: 10px 18px; background-color: #1f3c4d; color: white; border: none; border-radius: 8px; cursor: pointer; }
.btn-primary:hover { background-color: #162b36; }
.summary-cards { display: flex; gap: 20px; margin-bottom: 25px; }
.card { background: white; padding: 20px; border-radius: 12px; flex: 1; box-shadow: 0 2px 6px rgba(0,0,0,0.05); }
.number { font-size: 28px; font-weight: bold; }
.number.danger { color: #a71d2a; }
.number.primary { color: #1f3c4d; }
.alert-box { background: #eef3f6; padding: 20px; border-radius: 12px; margin-bottom: 25px; }
.alert-item { display: flex; justify-content: space-between; margin-top: 10px; }
.badge { padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
.success { background-color: #d4edda; color: #2e7d32; }
.warning { background-color: #fff3cd; color: #856404; }
.danger { background-color: #f8d7da; color: #a71d2a; }
.table-container { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); }
table { width: 100%; border-collapse: collapse; margin-top: 15px; }
thead { background-color: #f1f1f1; }
th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
tbody tr:hover { background-color: #f9f9f9; }
.acciones { display: flex; gap: 12px; }
.btn-editar { width: 20px; height: 20px; cursor: pointer; color: #6b7280; }
.btn-editar:hover { color: #2563eb; }
.fecha { white-space: nowrap; }
.modal { position: fixed; inset: 0; background: rgba(0,0,0,0.4); justify-content: center; align-items: center; z-index: 1000; }
.modal-content { background: #fff; width: 500px; max-width: 95%; border-radius: 12px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.modal-header h2 { margin: 0; font-size: 20px; }
.close { cursor: pointer; font-size: 20px; }
.form-group { display: flex; flex-direction: column; margin-bottom: 15px; }
.form-group label { font-size: 13px; font-weight: 500; margin-bottom: 5px; }
.form-row { display: flex; gap: 15px; }
.form-row .form-group { flex: 1; }
.modal-body input, .modal-body select { padding: 10px; border-radius: 8px; border: 1px solid #ddd; background: #f5f6f8; font-family: inherit; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
.btn-secondary { padding: 10px 18px; background-color: #f3f4f6; color: #374151; border: 1px solid #d1d5db; border-radius: 10px; cursor: pointer; }
</style>
