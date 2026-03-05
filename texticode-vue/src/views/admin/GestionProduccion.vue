<template>
  <div style="display:flex;min-height:100vh">
    <AppSidebar rol="admin" />

    <main class="main">
      <h1 class="title">Gestión de Producción</h1>

      <div class="ordenes-header">
        <h2 class="title" style="font-size:15px;border:none;padding:0;margin:0">Órdenes de Producción</h2>
        <button class="btn-nueva-orden" @click="abrirModal(null)">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
          </svg>
          Nueva Orden
        </button>
      </div>

      <!-- STATS -->
      <div class="stats">
        <div class="stat-card" v-for="s in statsOrdenes" :key="s.label">
          <div class="stat-header">
            <span class="stat-title">{{ s.label }}</span>
            <span class="stat-icon" :class="s.color">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <circle cx="12" cy="12" r="9"/><path stroke-linecap="round" d="M12 7v5l3 3"/>
              </svg>
            </span>
          </div>
          <div class="stat-number" :class="s.color">{{ s.valor }}</div>
        </div>
      </div>

      <!-- TABLA ÓRDENES -->
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">Órdenes de Producción</h2>
        </div>
        <div class="table-wrapper">
          <table class="orders-table">
            <thead>
              <tr>
                <th>Orden</th><th>Cliente</th><th>Producto</th><th>Operador</th>
                <th>Estado</th><th>Prioridad</th><th>Progreso</th><th>Fecha Límite</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="o in ordenes" :key="o.id">
                <td class="order-id">{{ o.id }}</td>
                <td>{{ o.cliente }}</td>
                <td>{{ o.producto }}</td>
                <td>{{ o.operador }}</td>
                <td>
                  <select v-model="o.estado" class="action-select" :class="o.estado + '-select'">
                    <option value="en-proceso">En Proceso</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="completado">Completado</option>
                    <option value="atrasado">Retrasado</option>
                  </select>
                </td>
                <td><span class="badge-priority" :class="o.prioridad">{{ o.prioridadLabel }}</span></td>
                <td>
                  <div class="table-progress">
                    <div class="progress-bar"><div class="progress-fill" :style="{ width: o.progreso + '%' }"></div></div>
                    <span class="progress-pct-small">{{ o.progreso }}%</span>
                  </div>
                </td>
                <td>{{ o.fechaLimite }}</td>
                <td class="acciones-cell">
                  <button class="btn-accion btn-ver" title="Ver"><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg></button>
                  <button class="btn-accion btn-editar" @click="abrirModal(o)" title="Editar"><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/></svg></button>
                  <button class="btn-accion btn-eliminar" @click="eliminar(o.id)" title="Eliminar"><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- MODAL NUEVA / EDITAR ORDEN -->
    <div v-if="modalVisible" class="modal-overlay active" @click.self="cerrarModal">
      <div class="modal-container">
        <div class="modal-header">
          <span class="modal-title">{{ editando ? 'Editar Orden' : 'Nueva Orden de Producción' }}</span>
          <button class="modal-close" @click="cerrarModal">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group"><label class="form-label">Cliente</label><input v-model="form.cliente" class="form-input" type="text" placeholder="Nombre del cliente"></div>
            <div class="form-group"><label class="form-label">Producto</label><input v-model="form.producto" class="form-input" type="text" placeholder="Ej: Camisetas Polo x 50"></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label class="form-label">Operador</label><input v-model="form.operador" class="form-input" type="text" placeholder="Nombre del operario"></div>
            <div class="form-group">
              <label class="form-label">Prioridad</label>
              <select v-model="form.prioridad" class="form-input">
                <option value="alta">Alta</option><option value="media">Media</option><option value="baja">Baja</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group"><label class="form-label">Progreso (%)</label><input v-model.number="form.progreso" class="form-input" type="number" min="0" max="100"></div>
            <div class="form-group"><label class="form-label">Fecha Límite</label><input v-model="form.fechaLimite" class="form-input" type="date"></div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancelar" @click="cerrarModal">Cancelar</button>
          <button class="btn-guardar" @click="guardar">{{ editando ? 'Guardar Cambios' : 'Crear Orden' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppSidebar from '../../components/AppSidebar.vue'

const modalVisible = ref(false)
const editando = ref(false)
const form = ref({ id: null, cliente: '', producto: '', operador: '', prioridad: 'alta', progreso: 0, fechaLimite: '', estado: 'en-proceso' })

const prioridadLabels = { alta: 'Alta', media: 'Media', baja: 'Baja' }

const ordenes = ref([
  { id: '001', cliente: 'Textiles del Norte', producto: 'Camisetas Polo x 50', operador: 'Carlos Mendoza', estado: 'en-proceso', prioridad: 'alta', prioridadLabel: 'Alta', progreso: 75, fechaLimite: '2024-03-15' },
  { id: '002', cliente: 'María González',     producto: 'Vestidos Elegantes x 25', operador: 'Ana López',    estado: 'pendiente',  prioridad: 'media', prioridadLabel: 'Media', progreso: 0, fechaLimite: '2024-03-20' },
  { id: '003', cliente: 'Juan Pérez',         producto: 'Pantalones Denim x 30', operador: 'Luis Torres',   estado: 'atrasado',   prioridad: 'alta', prioridadLabel: 'Alta', progreso: 45, fechaLimite: '2024-02-28' },
])

const statsOrdenes = computed(() => [
  { label: 'Total Órdenes',  valor: ordenes.value.length, color: 'orange' },
  { label: 'En Proceso',     valor: ordenes.value.filter(o=>o.estado==='en-proceso').length, color: 'blue' },
  { label: 'Completadas',    valor: ordenes.value.filter(o=>o.estado==='completado').length, color: 'green' },
  { label: 'Retrasadas',     valor: ordenes.value.filter(o=>o.estado==='atrasado').length, color: 'gray' },
])

function abrirModal(o) {
  editando.value = !!o
  form.value = o ? { ...o } : { id: null, cliente: '', producto: '', operador: '', prioridad: 'alta', progreso: 0, fechaLimite: '', estado: 'en-proceso' }
  modalVisible.value = true
}

function cerrarModal() { modalVisible.value = false }

function guardar() {
  if (editando.value) {
    const idx = ordenes.value.findIndex(o => o.id === form.value.id)
    if (idx !== -1) ordenes.value[idx] = { ...form.value, prioridadLabel: prioridadLabels[form.value.prioridad] }
  } else {
    ordenes.value.push({ ...form.value, id: String(ordenes.value.length + 1).padStart(3, '0'), prioridadLabel: prioridadLabels[form.value.prioridad] })
  }
  cerrarModal()
}

function eliminar(id) {
  if (confirm('¿Eliminar esta orden?')) ordenes.value = ordenes.value.filter(o => o.id !== id)
}
</script>

<style scoped>
.main { flex: 1; padding: 28px 30px; overflow-y: auto; display: flex; flex-direction: column; gap: 22px; }
.title { font-size: 26px; font-weight: 600; padding-bottom: 16px; border-bottom: 1px solid #e5e7eb; }
.ordenes-header { display: flex; align-items: center; justify-content: space-between; }
.btn-nueva-orden { display: inline-flex; align-items: center; gap: 7px; background: #1f3a52; color: #fff; border: none; padding: 10px 18px; border-radius: 8px; font-size: 14px; cursor: pointer; }
.stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.stat-card { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 18px 20px; }
.stat-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.stat-title { font-size: 13px; color: #6b7280; }
.stat-icon { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.stat-icon.orange { background: #fff7ed; color: #ea580c; } .stat-icon.blue { background: #eff6ff; color: #2563eb; }
.stat-icon.green { background: #f0fdf4; color: #16a34a; } .stat-icon.gray { background: #f3f4f6; color: #6b7280; }
.stat-number { font-size: 26px; font-weight: 700; }
.stat-number.orange { color: #ea580c; } .stat-number.blue { color: #2563eb; } .stat-number.green { color: #16a34a; } .stat-number.gray { color: #374151; }
.section-card { background: white; border: 1px solid #e5e7eb; border-radius: 14px; padding: 20px 24px; }
.section-header { display: flex; align-items: center; gap: 8px; margin-bottom: 18px; }
.section-title { font-size: 16px; font-weight: 600; }
.table-wrapper { overflow-x: auto; }
.orders-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.orders-table thead tr { border-bottom: 1px solid #e5e7eb; }
.orders-table th { text-align: left; padding: 10px 14px; font-size: 13px; font-weight: 600; color: #6b7280; white-space: nowrap; }
.orders-table tbody tr { border-bottom: 1px solid #f3f4f6; }
.orders-table td { padding: 12px 14px; color: #374151; white-space: nowrap; }
.order-id { font-weight: 700; color: #111827; }
.badge-priority { display: inline-flex; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 500; }
.badge-priority.alta { background: #fee2e2; color: #b91c1c; }
.badge-priority.media { background: #fef3c7; color: #92400e; }
.badge-priority.baja { background: #f0fdf4; color: #166534; }
.table-progress { display: flex; align-items: center; gap: 8px; min-width: 120px; }
.progress-bar { flex: 1; height: 8px; background: #e5e7eb; border-radius: 999px; overflow: hidden; }
.progress-fill { height: 100%; background: #1f3a52; border-radius: 999px; }
.progress-pct-small { font-size: 12px; font-weight: 600; color: #6b7280; }
.action-select { padding: 6px 10px; border-radius: 8px; border: 1px solid #e5e7eb; font-size: 13px; background: white; cursor: pointer; outline: none; }
.acciones-cell { display: flex; align-items: center; gap: 4px; }
.btn-accion { display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 6px; border: 1px solid #e5e7eb; background: white; cursor: pointer; }
.btn-ver:hover { background: #eff6ff; border-color: #bfdbfe; color: #2563eb; }
.btn-editar:hover { background: #fefce8; border-color: #fef08a; }
.btn-eliminar:hover { background: #fef2f2; border-color: #fecaca; color: #dc2626; }
.modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(2px); z-index: 1000; align-items: center; justify-content: center; }
.modal-overlay.active { display: flex; }
.modal-container { background: white; border-radius: 14px; width: 560px; max-width: 95vw; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 50px rgba(0,0,0,0.15); }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px 16px; border-bottom: 1px solid #e5e7eb; }
.modal-title { font-size: 16px; font-weight: 600; }
.modal-close { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px; border: none; background: none; color: #9ca3af; cursor: pointer; }
.modal-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 16px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-group { display: flex; flex-direction: column; gap: 5px; }
.form-label { font-size: 13px; font-weight: 600; color: #374151; }
.form-input { border: 1px solid #d1d5db; border-radius: 8px; padding: 9px 12px; font-size: 14px; outline: none; font-family: inherit; width: 100%; }
.form-input:focus { border-color: #1f3a52; }
.modal-footer { display: flex; align-items: center; justify-content: flex-end; gap: 10px; padding: 16px 24px 20px; border-top: 1px solid #e5e7eb; }
.btn-cancelar { padding: 9px 18px; border-radius: 8px; border: 1px solid #d1d5db; background: white; font-size: 14px; cursor: pointer; }
.btn-guardar { padding: 9px 20px; border-radius: 8px; border: none; background: #1f3a52; font-size: 14px; font-weight: 600; color: white; cursor: pointer; }
</style>
