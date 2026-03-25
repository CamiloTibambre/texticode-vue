<template>
  <div class="layout">
    <AppSidebar rol="admin" />
 
    <main class="content">
      <div class="main-content">
        <h1 :class="{ 'fade-in': mounted }">Gestión de Inventario</h1>
 
      
        <!-- TOP BAR -->
        <div class="top-bar surface-panel" :class="{ 'topbar-visible': mounted }">
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
 
        <!-- CARDS con contadores animados -->
        <div v-if="cargandoVista" class="summary-cards">
          <div v-for="i in 3" :key="i" class="card card-visible surface-panel skeleton-card">
            <div class="data-skeleton skeleton-line skeleton-sm"></div>
            <div class="data-skeleton skeleton-line skeleton-xl"></div>
          </div>
        </div>
        <div v-else class="summary-cards">
          <div class="card" :class="{ 'card-visible': mounted }" style="transition-delay:0ms">
            <h3>Total Materiales</h3>
            <p class="number">{{ displayTotal }}</p>
          </div>
          <div class="card" :class="{ 'card-visible': mounted }" style="transition-delay:80ms">
            <h3>Alertas de Stock</h3>
            <p class="number number-danger">{{ displayAlertas }}</p>
          </div>
          <div class="card" :class="{ 'card-visible': mounted }" style="transition-delay:160ms">
            <h3>Categorías</h3>
            <p class="number number-primary">{{ displayCategorias }}</p>
          </div>
        </div>
 
        <!-- ALERTAS con ícono pulsante -->
        <Transition name="slide-down">
          <div class="alert-box" v-if="alertas.length">
            <h3>
              <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="alert-icon pulse">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/>
              </svg>
              Alertas de Inventario
              <span class="alert-count">{{ alertas.length }}</span>
            </h3>
            <TransitionGroup name="row">
              <div v-for="a in alertas" :key="a.id" class="alert-item">
                <div class="alert-item-left">
                  <div class="alert-dot" :class="a.estadoClass"></div>
                  <span>{{ a.nombre }}</span>
                </div>
                <div class="alert-item-right">
                  <span class="alert-stock">{{ a.stock }} {{ a.unidad }}</span>
                  <span class="badge" :class="a.estadoClass">{{ a.estado }}</span>
                </div>
              </div>
            </TransitionGroup>
          </div>
        </Transition>
 
        <!-- TABLA -->
        <div class="table-container surface-panel" :class="{ 'section-visible': mounted }" style="transition-delay:250ms">
          <div class="table-header-row">
            <h3>
              <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width:20px;height:20px;display:inline;vertical-align:middle;margin-right:6px;">
                <path stroke-linecap="round" stroke-linejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"/>
              </svg>
              Inventario de Materiales
            </h3>
            <span class="result-count">{{ materialesFiltrados.length }} resultado(s)</span>
          </div>
 
          <div v-if="cargandoVista" class="table-skeleton">
            <div v-for="i in 6" :key="i" class="table-skeleton-row">
              <span class="data-skeleton skeleton-line skeleton-user"></span>
              <span class="data-skeleton skeleton-line skeleton-tag"></span>
              <span class="data-skeleton skeleton-line skeleton-stock"></span>
              <span class="data-skeleton skeleton-line skeleton-date"></span>
            </div>
          </div>
          <table v-else>
            <thead>
              <tr>
                <th class="sortable" @click="doSort('nombre')">Material <span class="sort-icon">{{ sIcon('nombre') }}</span></th>
                <th class="sortable" @click="doSort('categoria')">Categoría <span class="sort-icon">{{ sIcon('categoria') }}</span></th>
                <th class="sortable" @click="doSort('stock')">Stock <span class="sort-icon">{{ sIcon('stock') }}</span></th>
                <th>Min/Max</th>
                <th>Nivel</th>
                <th>Cliente</th>
                <th class="sortable" @click="doSort('estado')">Estado <span class="sort-icon">{{ sIcon('estado') }}</span></th>
                <th class="sortable" @click="doSort('fecha')">Última Act. <span class="sort-icon">{{ sIcon('fecha') }}</span></th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <TransitionGroup name="row">
                <tr v-for="m in materialesFiltrados" :key="m.id" class="table-row" :class="{ 'row-eliminating': m.eliminando }">
                  <td><strong>{{ m.nombre }}</strong></td>
                  <td><span class="cat-pill">{{ m.categoria }}</span></td>
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
                      <strong>{{ m.stock }}</strong>&nbsp;{{ m.unidad }}
                    </span>
                  </td>
                  <td class="minmax">{{ m.minimo }} / {{ m.maximo }}</td>
                  <!-- Barra visual de nivel -->
                  <td class="nivel-td">
                    <div class="nivel-bar-wrap" :title="`${stockPct(m)}% del máximo`">
                      <div class="nivel-bar">
                        <div class="nivel-fill" :class="m.estadoClass" :style="{ width: stockPct(m) + '%' }"></div>
                      </div>
                      <span class="nivel-pct">{{ stockPct(m) }}%</span>
                    </div>
                  </td>
                  <td>{{ m.cliente || '—' }}</td>
                  <td><span class="badge" :class="m.estadoClass">{{ m.estado }}</span></td>
                  <td class="fecha">{{ m.fecha }}</td>
                  <td>
                    <div class="acciones">
                      <button class="action-btn edit-btn" title="Editar" @click="abrirModal(m)">
                        <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z"/>
                        </svg>
                      </button>
                      <button class="action-btn delete-btn" title="Eliminar" @click="eliminar(m)">
                        <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </TransitionGroup>
            </tbody>
          </table>
 
          <div v-if="materialesFiltrados.length === 0" class="empty-state">
            <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#9ca3af" width="42" height="42">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"/>
            </svg>
            <p>No se encontraron materiales</p>
          </div>
        </div>
      </div>
    </main>
 
    <!-- MODAL AGREGAR / EDITAR -->
    <Transition name="modal">
      <div v-if="modalVisible" class="modal" @click.self="cerrarModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>{{ editando ? 'Editar Material' : 'Agregar Nuevo Material' }}</h2>
            <button class="close" @click="cerrarModal">×</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Nombre del Material</label>
              <input v-model="form.nombre" type="text" placeholder="Ej: Tela de Algodón" :class="{ 'input-error': errores.nombre }">
              <span v-if="errores.nombre" class="error-msg">{{ errores.nombre }}</span>
            </div>
            <div class="form-group">
              <label>Categoría</label>
              <select v-model="form.categoria" :class="{ 'input-error': errores.categoria }">
                <option disabled value="">Selecciona categoría</option>
                <option>Telas</option><option>Hilos</option><option>Accesorios</option>
              </select>
              <span v-if="errores.categoria" class="error-msg">{{ errores.categoria }}</span>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Stock Actual</label>
                <input v-model.number="form.stock" type="number" min="0">
              </div>
              <div class="form-group">
                <label>Unidad</label>
                <select v-model="form.unidad" :class="{ 'input-error': errores.unidad }">
                  <option disabled value="">Selecciona unidad</option>
                  <option>Metros</option>
                  <option>Centímetros</option>
                  <option>Unidades</option>
                  <option>Rollos</option>
                  <option>Kilos</option>
                  <option>Gramos</option>
                  <option>Piezas</option>
                </select>
                <span v-if="errores.unidad" class="error-msg">{{ errores.unidad }}</span>
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
 
            <!-- Preview barra de nivel en modal -->
            <div class="form-group" v-if="form.maximo > 0">
              <label>Vista previa del nivel</label>
              <div class="nivel-bar modal-preview-bar">
                <div
                  class="nivel-fill"
                  :class="calcularEstado(form).estadoClass"
                  :style="{ width: Math.min(100, Math.round((form.stock / form.maximo) * 100)) + '%', transition: 'width .4s ease' }"
                ></div>
              </div>
              <span style="font-size:12px;color:#6b7280;margin-top:5px;display:block;">
                {{ Math.min(100, Math.round((form.stock / form.maximo) * 100)) }}% del máximo —
                <strong :style="{ color: estadoColor(calcularEstado(form).estadoClass) }">{{ calcularEstado(form).estado }}</strong>
              </span>
            </div>
 
            <!-- v-model apunta a Id_Cliente y :value usa c.id (el número) -->
            <div class="form-group">
              <label>Cliente</label>
              <select v-model="form.Id_Cliente">
                <option value="">Sin cliente</option>
                <option v-for="c in clientes" :key="c.id" :value="c.id">{{ c.nombre }}</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" @click="cerrarModal">Cancelar</button>
            <button class="btn-primary" @click="guardar" :disabled="guardando">
              <span v-if="guardando">Guardando...</span>
              <span v-else>{{ editando ? 'Guardar Cambios' : 'Agregar Material' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
 
    <!-- CONFIRM ELIMINAR -->
    <Transition name="modal">
      <div v-if="confirmItem" class="modal" @click.self="confirmItem = null">
        <div class="confirm-box">
          <div class="confirm-icon">
            <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#dc2626" width="36" height="36">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/>
            </svg>
          </div>
          <h3>¿Eliminar material?</h3>
          <p>Se eliminará <strong>{{ confirmItem.nombre }}</strong>. Esta acción no se puede deshacer.</p>
          <div class="confirm-btns">
            <button class="btn-secondary" @click="confirmItem = null">Cancelar</button>
            <button class="btn-danger" @click="confirmarEliminar">Sí, eliminar</button>
          </div>
        </div>
      </div>
    </Transition>
 
    <!-- TOAST -->
    <Transition name="toast">
      <div v-if="toastMsg" class="toast" :class="toastType">
        <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="18" height="18">
          <path v-if="toastType === 'toast-success'" stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
          <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
        </svg>
        {{ toastMsg }}
      </div>
    </Transition>
  </div>
</template>
 
<script setup>
import { getMateriales, crearMaterial, actualizarMaterial, eliminarMaterial, getUsuarios } from '../../services/api.js'
import { ref, computed, onMounted } from 'vue'
import AppSidebar from '../../components/AppSidebar.vue'
 
// ── Datos ────────────────────────────────────────────────────
const materiales = ref([])
const clientes   = ref([])
 
const busqueda        = ref('')
const categoriaFiltro = ref('')
const modalVisible    = ref(false)
const editando        = ref(false)
const guardando       = ref(false)
const mounted         = ref(false)
const cargandoVista   = ref(true)
const toastMsg        = ref('')
const toastType       = ref('toast-success')
const confirmItem     = ref(null)
 
// El form ahora incluye Id_Cliente además de cliente
const form = ref({
  id: null, nombre: '', categoria: '', stock: 0,
  unidad: '', minimo: 0, maximo: 0, cliente: '', Id_Cliente: null
})
 
// ── Contadores animados ──────────────────────────────────────
const displayTotal      = ref(0)
const displayAlertas    = ref(0)
const displayCategorias = ref(0)
 
function animateCount(targetRef, target) {
  let val = 0
  const step = Math.max(1, Math.ceil(target / 40))
  const id = setInterval(() => {
    val += step
    if (val >= target) { targetRef.value = target; clearInterval(id) }
    else targetRef.value = val
  }, 20)
}
 
// ── Helpers ──────────────────────────────────────────────────
const categorias = ['Telas', 'Hilos', 'Accesorios', 'Otros']
 
function calcularEstado(m) {
  if (m.stock === 0)      return { estado: 'Agotado',    estadoClass: 'danger' }
  if (m.stock < m.minimo) return { estado: 'Stock Bajo', estadoClass: 'warning' }
  return                         { estado: 'En Stock',   estadoClass: 'success' }
}
 
function estadoColor(cls) {
  return cls === 'success' ? '#16a34a' : cls === 'warning' ? '#ca8a04' : '#dc2626'
}
 
function stockPct(m) {
  if (!m.maximo) return 0
  return Math.min(100, Math.round((m.stock / m.maximo) * 100))
}
 
// ── Ordenamiento ─────────────────────────────────────────────
const sortKey = ref('nombre')
const sortDir = ref(1)
 
function doSort(key) {
  if (sortKey.value === key) sortDir.value *= -1
  else { sortKey.value = key; sortDir.value = 1 }
}
function sIcon(key) {
  if (sortKey.value !== key) return '⇅'
  return sortDir.value === 1 ? '↑' : '↓'
}
 
// ── Computed ─────────────────────────────────────────────────
const alertas = computed(() => materiales.value.filter(m => m.estadoClass !== 'success'))
 
const materialesFiltrados = computed(() => {
  const lista = materiales.value.filter(m => {
    const b = m.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
    const c = !categoriaFiltro.value || m.categoria === categoriaFiltro.value
    return b && c
  })
  return [...lista].sort((a, b) => {
    const va = a[sortKey.value], vb = b[sortKey.value]
    if (typeof va === 'number') return (va - vb) * sortDir.value
    return va > vb ? sortDir.value : -sortDir.value
  })
})
 
const errores = computed(() => ({
  nombre:    !form.value.nombre.trim() ? 'El nombre es requerido' : '',
  categoria: !form.value.categoria     ? 'Selecciona una categoría' : '',
  unidad:    !form.value.unidad        ? 'Selecciona una unidad' : '',
}))
const formValido = computed(() => !errores.value.nombre && !errores.value.categoria && !errores.value.unidad)
 
// ── Helper para mapear un material de la BD al formato de la vista ──
function mapearMaterial(m) {
  return {
    id:         m.Id_Material,
    nombre:     m.Nombre_Material,
    categoria:  m.Categoria,
    stock:      m.Stock_Actual,
    unidad:     m.Unidad,
    minimo:     m.Stock_Minimo,
    maximo:     m.Stock_Maximo,
    fecha:      m.Fecha ? m.Fecha.split('T')[0] : '',
    cliente:    m.Nombre_Cliente || '',   // viene del JOIN en el backend
    Id_Cliente: m.Id_Cliente     || null,
    eliminando: false,
    ...calcularEstado({ stock: m.Stock_Actual, minimo: m.Stock_Minimo }),
  }
}
 
// ── Acciones ─────────────────────────────────────────────────
function abrirModal(m) {
  editando.value = !!m
  form.value = m
    ? { ...m, Id_Cliente: m.Id_Cliente || null }
    : { id: null, nombre: '', categoria: '', stock: 0, unidad: '', minimo: 0, maximo: 0, cliente: '', Id_Cliente: null }
  modalVisible.value = true
}
function cerrarModal() { modalVisible.value = false }
 
async function guardar() {
  if (!formValido.value) return
  guardando.value = true
 
  try {
    if (editando.value) {
      await actualizarMaterial(form.value.id, {
        Nombre_Material: form.value.nombre,
        Categoria:       form.value.categoria,
        Stock_Actual:    form.value.stock,
        Unidad:          form.value.unidad,
        Stock_Minimo:    form.value.minimo,
        Stock_Maximo:    form.value.maximo,
        Id_Cliente:      form.value.Id_Cliente || null,
      })
      showToast('Material actualizado correctamente', 'toast-success')
    } else {
      await crearMaterial({
        Nombre_Material: form.value.nombre,
        Categoria:       form.value.categoria,
        Stock_Actual:    form.value.stock,
        Unidad:          form.value.unidad,
        Stock_Minimo:    form.value.minimo,
        Stock_Maximo:    form.value.maximo,
        Id_Cliente:      form.value.Id_Cliente || null,
      })
      showToast('Material agregado correctamente', 'toast-success')
    }
 
    // Recargar lista desde MySQL
    const data = await getMateriales()
    materiales.value = data.map(mapearMaterial)
 
  } catch (err) {
    showToast(err.message || 'Error al guardar', 'toast-danger')
  }
 
  guardando.value = false
  cerrarModal()
}
 
async function confirmarEliminar() {
  const m = confirmItem.value
  confirmItem.value = null
  m.eliminando = true
 
  try {
    await eliminarMaterial(m.id)
    setTimeout(() => {
      materiales.value = materiales.value.filter(x => x.id !== m.id)
      showToast(`"${m.nombre}" eliminado`, 'toast-danger')
    }, 400)
  } catch (err) {
    m.eliminando = false
    showToast(err.message || 'Error al eliminar', 'toast-danger')
  }
}
 
function showToast(msg, type = 'toast-success') {
  toastMsg.value = msg
  toastType.value = type
  setTimeout(() => { toastMsg.value = '' }, 3000)
}
 
// ── onMounted ──────────────────────────────────────────────
onMounted(async () => {
  try {
    const data = await getMateriales()
    materiales.value = data.map(mapearMaterial)
  } catch (err) {
    console.error('Error cargando materiales:', err)
  }
 
  try {
    const usuarios = await getUsuarios()
    clientes.value = usuarios
      .filter(u => (u.Rol || u.Nombre_Rol || '').toLowerCase() === 'cliente' && u.Estado === 'activo')
      .map(u => ({ id: u.Id_Usuario, nombre: u.Nombre_Completo }))
  } catch (err) {
    console.error('Error cargando clientes:', err)
  } finally {
    cargandoVista.value = false
  }
 
  setTimeout(() => {
    mounted.value = true
    animateCount(displayTotal,      materiales.value.length)
    animateCount(displayAlertas,    alertas.value.length)
    animateCount(displayCategorias, categorias.length)
  }, 80)
})
</script>
 
<style scoped>
.layout       { display: flex; min-height: 100vh; }
.content      { flex: 1; padding: 28px 30px; }
.main-content { max-width: 100%; }
 
h1 {
  font-size: 26px; font-weight: 600; color: #111827;
  padding-bottom: 16px; margin-bottom: 20px; border-bottom: 1px solid #e5e7eb;
  opacity: 0; transform: translateY(-10px);
  transition: opacity .4s ease, transform .4s ease;
}
h1.fade-in { opacity: 1; transform: translateY(0); }
 
.hero-banner {
  display: flex; justify-content: space-between; gap: 18px;
  padding: 22px 24px; border-radius: 22px; margin-bottom: 18px;
  opacity: 0; transform: translateY(10px);
  transition: opacity .4s ease, transform .4s ease;
}
.hero-banner.hero-visible { opacity: 1; transform: translateY(0); }
.hero-kicker {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 12px; font-weight: 700; color: #0f766e;
  text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px;
}
.hero-banner h2 { margin: 0 0 8px; font-size: 24px; line-height: 1.15; color: #0f172a; }
.hero-banner p  { margin: 0; color: #475569; line-height: 1.55; max-width: 680px; }
.hero-actions   { display: flex; gap: 12px; flex-wrap: wrap; align-self: flex-start; justify-content: flex-end; }
.hero-chip      { min-width: 138px; justify-content: space-between; }
 
/* ── TOP BAR ─────────────────────────────────────────────── */
.top-bar {
  display: flex; gap: 12px; align-items: center; margin-bottom: 25px;
  opacity: 0; transform: translateY(8px);
  transition: opacity .4s ease .1s, transform .4s ease .1s;
  padding: 14px; border-radius: 18px;
}
.top-bar.topbar-visible { opacity: 1; transform: translateY(0); }
 
.search-wrapper { position: relative; display: flex; align-items: center; }
.search-icon    { position: absolute; left: 10px; width: 16px; height: 16px; color: #9ca3af; pointer-events: none; }
.search-input   {
  padding: 10px 10px 10px 34px; border-radius: 8px; border: 1px solid #d1d5db;
  outline: none; width: 260px; background: white; font-size: 14px; color: #374151;
  transition: border-color .2s, box-shadow .2s;
}
.search-input:focus { border-color: #1f3c4d; box-shadow: 0 0 0 3px rgba(31,60,77,.12); }
 
.select-wrapper  { position: relative; display: flex; align-items: center; }
.category-select {
  padding: 10px 36px 10px 14px; border-radius: 8px; border: 1px solid #d1d5db;
  outline: none; background: white; font-size: 14px; color: #374151;
  appearance: none; cursor: pointer; min-width: 180px; transition: border-color .2s;
}
.category-select:focus { border-color: #1f3c4d; }
.select-arrow { position: absolute; right: 10px; width: 14px; height: 14px; color: #6b7280; pointer-events: none; }
 
.btn-primary {
  margin-left: auto; padding: 10px 18px; background: #1f3c4d; color: white;
  border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500;
  display: flex; align-items: center; gap: 8px; white-space: nowrap;
  transition: background .2s, transform .15s;
}
.btn-primary:hover    { background: #162b36; }
.btn-primary:active   { transform: scale(.97); }
.btn-primary:disabled { opacity: .6; cursor: not-allowed; }
 
/* ── CARDS ───────────────────────────────────────────────── */
.summary-cards { display: flex; gap: 20px; margin-bottom: 30px; }
.card {
  background: white; flex: 1; padding: 20px;
  border-radius: 12px; border: 1px solid #e5e7eb;
  opacity: 0; transform: translateY(16px);
  transition: opacity .4s ease, transform .4s ease, box-shadow .2s;
}
.card-visible  { opacity: 1; transform: translateY(0); }
.card:hover    { box-shadow: 0 4px 16px rgba(0,0,0,.08); transform: translateY(-2px) !important; }
.card > h3     { font-size: 14px; color: #6b7280; font-weight: 500; margin: 0; }
.number        { font-size: 26px; font-weight: 700; color: #111827; margin: 10px 0 0 0; }
.number-danger  { color: #dc2626; }
.number-primary { color: #1f3c4d; }
.skeleton-card { min-height: 108px; pointer-events: none; }
.skeleton-line { display: block; border-radius: 999px; }
.skeleton-sm   { width: 46%; height: 12px; margin-bottom: 16px; }
.skeleton-xl   { width: 72%; height: 30px; }
 
/* ── ALERTAS ─────────────────────────────────────────────── */
.alert-box {
  background: #fff7ed; padding: 20px 24px; border-radius: 12px;
  margin-bottom: 25px; border: 1px solid #fed7aa;
}
.alert-box h3 { font-size: 15px; font-weight: 600; color: #9a3412; margin: 0 0 14px 0; display: flex; align-items: center; gap: 8px; }
.alert-icon   { width: 20px; height: 20px; color: #ea580c; }
.alert-count  { background: #dc2626; color: white; font-size: 11px; font-weight: 700; padding: 1px 7px; border-radius: 20px; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
.pulse { animation: pulse 2s ease infinite; }
 
.alert-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; font-size: 14px; color: #4b5563; }
.alert-item + .alert-item { border-top: 1px solid #fed7aa; }
.alert-item-left  { display: flex; align-items: center; gap: 8px; }
.alert-item-right { display: flex; align-items: center; gap: 10px; }
.alert-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.alert-dot.warning { background: #ca8a04; }
.alert-dot.danger  { background: #dc2626; }
.alert-stock { font-size: 12px; color: #9ca3af; }
 
/* ── TABLE ───────────────────────────────────────────────── */
.table-container {
  padding: 20px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.82);
  opacity: 0; transform: translateY(12px);
  transition: opacity .45s ease, transform .45s ease;
}
.section-visible { opacity: 1; transform: translateY(0); }
.table-header-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.table-header-row h3 { font-size: 15px; font-weight: 600; color: #374151; margin: 0; display: flex; align-items: center; }
.result-count { font-size: 13px; color: #9ca3af; }
 
table  { width: 100%; border-collapse: collapse; }
thead  { background: #f9fafb; }
th     { padding: 11px 12px; text-align: left; font-size: 13px; font-weight: 600; color: #6b7280; border-bottom: 1px solid #e5e7eb; user-select: none; }
td     { padding: 12px; font-size: 14px; color: #374151; border-bottom: 1px solid #f3f4f6; }
tbody tr:last-child td { border-bottom: none; }
.table-skeleton { display: grid; gap: 12px; }
.table-skeleton-row {
  display: grid; grid-template-columns: 1.4fr 0.8fr 0.8fr 0.6fr;
  gap: 14px; padding: 14px 12px; border-radius: 16px;
  background: rgba(255,255,255,0.72);
}
.skeleton-user  { width: 72%; height: 16px; }
.skeleton-tag   { width: 88px; height: 14px; }
.skeleton-stock { width: 84px; height: 14px; }
.skeleton-date  { width: 70px; height: 14px; }
 
.sortable       { cursor: pointer; }
.sortable:hover { color: #374151; }
.sort-icon      { font-size: 11px; margin-left: 4px; opacity: .6; }
 
.table-row { transition: background .18s, opacity .35s; }
.table-row:hover { background: #f9fafb; }
.table-row.row-eliminating { opacity: 0; background: #fee2e2; }
 
.stock-cell    { display: flex; align-items: center; gap: 6px; }
.trend-icon    { width: 15px; height: 15px; flex-shrink: 0; }
.trend-up      { color: #16a34a; }
.trend-warning { color: #ca8a04; }
.trend-down    { color: #dc2626; }
.minmax        { color: #9ca3af; font-size: 13px; }
 
/* ── BARRA DE NIVEL ──────────────────────────────────────── */
.nivel-td       { min-width: 110px; }
.nivel-bar-wrap { display: flex; align-items: center; gap: 6px; }
.nivel-bar      { flex: 1; height: 6px; background: #f3f4f6; border-radius: 99px; overflow: hidden; }
.nivel-fill     { height: 100%; border-radius: 99px; transition: width .7s ease; }
.nivel-fill.success { background: #16a34a; }
.nivel-fill.warning { background: #ca8a04; }
.nivel-fill.danger  { background: #dc2626; }
.nivel-pct      { font-size: 11px; color: #9ca3af; white-space: nowrap; }
.modal-preview-bar { height: 10px; border-radius: 99px; background: #f3f4f6; overflow: hidden; margin-top: 6px; }
 
/* ── BADGE ───────────────────────────────────────────────── */
.badge   { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.success { background: #dcfce7; color: #166534; }
.warning { background: #fef9c3; color: #854d0e; }
.danger  { background: #fee2e2; color: #991b1b; }
.cat-pill { background: #eff6ff; color: #1d4ed8; font-size: 12px; padding: 3px 9px; border-radius: 20px; font-weight: 500; }
 
/* ── ACCIONES ────────────────────────────────────────────── */
.acciones   { display: flex; gap: 8px; }
.action-btn {
  width: 32px; height: 32px; border-radius: 8px; border: 1px solid #e5e7eb;
  background: white; display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: background .15s, transform .15s;
}
.action-btn svg    { width: 16px; height: 16px; }
.action-btn:hover  { transform: scale(1.08); }
.action-btn:active { transform: scale(.93); }
.edit-btn:hover    { background: #eff6ff; border-color: #bfdbfe; }
.edit-btn svg      { color: #2563eb; }
.delete-btn:hover  { background: #fee2e2; border-color: #fca5a5; }
.delete-btn svg    { color: #dc2626; }
.fecha { white-space: nowrap; color: #9ca3af; font-size: 13px; }
 
/* ── EMPTY STATE ─────────────────────────────────────────── */
.empty-state { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 40px 0; color: #9ca3af; font-size: 14px; }
 
/* ── MODAL ───────────────────────────────────────────────── */
.modal {
  position: fixed; inset: 0; background: rgba(0,0,0,.45);
  display: flex; justify-content: center; align-items: center; z-index: 1000;
}
.modal-content {
  background: #fff; width: 500px; max-width: 95%;
  border-radius: 14px; padding: 28px; box-shadow: 0 20px 50px rgba(0,0,0,.2);
}
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 22px; }
.modal-header h2 { margin: 0; font-size: 18px; font-weight: 600; color: #111827; }
.close { cursor: pointer; font-size: 24px; color: #9ca3af; background: none; border: none; line-height: 1; }
.close:hover { color: #374151; }
 
.form-group       { display: flex; flex-direction: column; margin-bottom: 15px; }
.form-group label { font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 6px; }
.form-row         { display: flex; gap: 15px; }
.form-row .form-group { flex: 1; }
 
.modal-body input,
.modal-body select {
  padding: 10px 12px; border-radius: 8px; border: 1px solid #d1d5db;
  background: #f9fafb; font-family: inherit; font-size: 14px; color: #374151; outline: none;
  transition: border-color .2s, background .2s;
}
.modal-body input:focus,
.modal-body select:focus { border-color: #1f3c4d; background: white; }
.input-error { border-color: #dc2626 !important; }
.error-msg   { font-size: 12px; color: #dc2626; margin-top: 4px; }
 
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; }
.btn-secondary {
  padding: 10px 18px; background: #f3f4f6; color: #374151;
  border: 1px solid #d1d5db; border-radius: 8px; cursor: pointer; font-size: 14px;
  transition: background .2s;
}
.btn-secondary:hover { background: #e5e7eb; }
 
/* ── CONFIRM ─────────────────────────────────────────────── */
.confirm-box {
  background: white; border-radius: 14px; padding: 32px 28px;
  width: 380px; max-width: 95%; box-shadow: 0 20px 50px rgba(0,0,0,.2); text-align: center;
}
.confirm-icon   { margin-bottom: 12px; }
.confirm-box h3 { font-size: 18px; font-weight: 600; color: #111827; margin: 0 0 8px; }
.confirm-box p  { font-size: 14px; color: #6b7280; margin: 0 0 24px; }
.confirm-btns   { display: flex; gap: 10px; justify-content: center; }
.btn-danger     { padding: 10px 18px; background: #dc2626; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; transition: background .2s; }
.btn-danger:hover { background: #b91c1c; }
 
/* ── TOAST ───────────────────────────────────────────────── */
.toast {
  position: fixed; bottom: 28px; right: 28px; color: white;
  padding: 12px 18px; border-radius: 10px; font-size: 14px;
  display: flex; align-items: center; gap: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,.2); z-index: 2000;
}
.toast-success { background: #111827; }
.toast-danger  { background: #dc2626; }
 
/* ── TRANSITIONS ─────────────────────────────────────────── */
.modal-enter-active, .modal-leave-active { transition: opacity .25s ease; }
.modal-enter-from, .modal-leave-to       { opacity: 0; }
 
.toast-enter-active, .toast-leave-active { transition: opacity .3s ease, transform .3s ease; }
.toast-enter-from, .toast-leave-to       { opacity: 0; transform: translateY(12px); }
 
.slide-down-enter-active, .slide-down-leave-active { transition: opacity .3s ease, transform .3s ease; }
.slide-down-enter-from, .slide-down-leave-to       { opacity: 0; transform: translateY(-8px); }
 
.row-enter-active, .row-leave-active { transition: opacity .3s ease; }
.row-enter-from, .row-leave-to       { opacity: 0; }
 
@media (max-width: 900px) {
  .hero-banner { flex-direction: column; }
  .hero-actions { justify-content: flex-start; }
  .table-skeleton-row { grid-template-columns: 1fr 0.8fr; }
  .skeleton-stock, .skeleton-date { display: none; }
}
</style>