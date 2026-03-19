<template>
  <div class="layout">
    <AppSidebar rol="operario" />
 
    <main class="main">
      <h1 class="title">Tareas Asignadas</h1>
 
      <!-- FILTROS -->
      <div class="filters-bar">
        <div class="search-wrap">
          <svg class="search-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/>
          </svg>
          <input class="search" v-model="busqueda" placeholder="Buscar tareas...">
        </div>
        <select class="select" v-model="filtroEstado">
          <option value="">Todos</option>
          <option value="en-proceso">En Proceso</option>
          <option value="completado">Completado</option>
          <option value="pausado">Pausado</option>
        </select>
        <select class="select" v-model="filtroPrioridad">
          <option value="">Todas</option>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
      </div>
 
      <!-- STATS -->
      <div class="stats">
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-icon blue">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <circle cx="12" cy="12" r="9"/><path stroke-linecap="round" d="M8 12h8M12 8v8"/>
              </svg>
            </span>
            <span class="stat-title">En Proceso</span>
          </div>
          <div class="stat-number blue">{{ contarPor('en-proceso') }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-icon green">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <circle cx="12" cy="12" r="9"/><path stroke-linecap="round" stroke-linejoin="round" d="M8.5 12.5l2.5 2.5 4.5-4.5"/>
              </svg>
            </span>
            <span class="stat-title">Completadas</span>
          </div>
          <div class="stat-number green">{{ contarPor('completado') }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-icon orange">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <circle cx="12" cy="12" r="9"/><path stroke-linecap="round" d="M12 7v5l3 3"/>
              </svg>
            </span>
            <span class="stat-title">Pausadas</span>
          </div>
          <div class="stat-number orange">{{ contarPor('pausado') }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-icon gray">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <circle cx="12" cy="12" r="9"/><path stroke-linecap="round" d="M12 8v4M12 16h.01"/>
              </svg>
            </span>
            <span class="stat-title">Total</span>
          </div>
          <div class="stat-number gray">{{ tareas.length }}</div>
        </div>
      </div>
 
      <!-- CARGANDO -->
      <div v-if="cargando" class="loading-wrap">
        <div class="spinner"></div>
        <p>Cargando tareas...</p>
      </div>
 
      <!-- SIN SESIÓN -->
      <div v-else-if="!auth.idUsuario" class="empty-state">
        <p>Inicia sesión con tu cuenta de operario para ver tus tareas asignadas.</p>
      </div>
 
      <!-- TAREAS -->
      <div v-else class="tasks-list">
        <div class="task-card" v-for="tarea in tareasFiltradas" :key="tarea.id">
          <div class="task-top">
            <div class="task-badges">
              <span class="task-id">OP-{{ String(tarea.id).padStart(3, '0') }}</span>
              <span class="badge" :class="tarea.estado">
                <svg v-if="tarea.estado === 'en-proceso'" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <circle cx="12" cy="12" r="9"/><path stroke-linecap="round" d="M8 12h8M12 8v8"/>
                </svg>
                <svg v-else-if="tarea.estado === 'completado'" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <circle cx="12" cy="12" r="9"/><path stroke-linecap="round" stroke-linejoin="round" d="M8.5 12.5l2.5 2.5 4.5-4.5"/>
                </svg>
                <svg v-else width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <circle cx="12" cy="12" r="9"/><path stroke-linecap="round" d="M12 7v5l3 3"/>
                </svg>
                {{ estadoLabel(tarea.estado) }}
              </span>
              <span class="badge prioridad" :class="tarea.prioridad">
                {{ tarea.prioridad.charAt(0).toUpperCase() + tarea.prioridad.slice(1) }}
              </span>
            </div>
          </div>
 
          <h2 class="task-name">{{ tarea.producto || tarea.nombre }}</h2>
          <p class="task-desc">{{ tarea.descripcion }}</p>
 
          <div class="task-meta">
            <div class="meta-item">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
              </svg>
              <div>
                <div class="meta-label">Cliente</div>
                <div class="meta-value">{{ tarea.cliente }}</div>
              </div>
            </div>
            <div class="meta-item">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"/>
              </svg>
              <div>
                <div class="meta-label">Material</div>
                <div class="meta-value">{{ tarea.material }}</div>
              </div>
            </div>
            <div class="meta-item">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/>
              </svg>
              <div>
                <div class="meta-label">Fecha Límite</div>
                <div class="meta-value" :class="{ 'fecha-vencida': tarea.vencida }">{{ tarea.entrega }}</div>
              </div>
            </div>
            <div class="meta-item">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"/>
              </svg>
              <div>
                <div class="meta-label">Cantidad</div>
                <div class="meta-value">{{ tarea.cantidad }}</div>
              </div>
            </div>
          </div>
 
          <div class="progress-section">
            <div class="progress-label">
              <span>Progreso</span>
              <span class="progress-pct">{{ tarea.progreso }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :class="{ 'fill-completo': tarea.progreso === 100 }" :style="{ width: tarea.progreso + '%' }"></div>
            </div>
          </div>
        </div>
 
        <div v-if="tareasFiltradas.length === 0" class="empty-state">
          <svg width="44" height="44" fill="none" viewBox="0 0 24 24" stroke-width="1.2" stroke="#d1d5db">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <p>No tienes tareas asignadas.</p>
        </div>
      </div>
    </main>
  </div>
</template>
 
<script setup>
import { ref, computed, onMounted } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'
import { useAuthStore } from '../../stores/auth'
 
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
 
const auth           = useAuthStore()
const busqueda       = ref('')
const filtroEstado   = ref('')
const filtroPrioridad = ref('')
const tareas         = ref([])
const cargando       = ref(true)
 
onMounted(async () => {
  if (!auth.idUsuario) {
    cargando.value = false
    return
  }
 
  try {
    // Consulta las órdenes donde Id_Operario = usuario logueado
    const res  = await fetch(`${BASE}/ordenes/operario/${auth.idUsuario}`)
    const data = await res.json()
 
    tareas.value = data.map(o => ({
      id:          o.Id_Orden,
      nombre:      o.Descripcion,
      producto:    o.Producto     || o.Descripcion,
      descripcion: o.Descripcion,
      cliente:     o.Cliente      || '—',
      material:    o.NombreMaterial || '—',
      entrega:     o.Fecha_Limite?.split('T')[0] || '—',
      cantidad:    o.Cantidad,
      estado:      mapearEstado(o.Estado),
      prioridad:   (o.Prioridad || 'Media').toLowerCase(),
      progreso:    o.Estado === 'Completada' ? 100 : o.Estado === 'En Proceso' ? 50 : 0,
      vencida:     o.Fecha_Limite && new Date(o.Fecha_Limite) < new Date(),
    }))
  } catch (err) {
    console.error('Error cargando tareas:', err)
  } finally {
    cargando.value = false
  }
})
 
function mapearEstado(estado) {
  return {
    'En Proceso': 'en-proceso',
    'Completada': 'completado',
    'Pausado':    'pausado',
  }[estado] || 'en-proceso'
}
 
const estadoLabel = (estado) => ({
  'en-proceso': 'En Proceso',
  'completado': 'Completado',
  'pausado':    'Pausado',
})[estado] || estado
 
const contarPor = (estado) => tareas.value.filter(t => t.estado === estado).length
 
const tareasFiltradas = computed(() =>
  tareas.value.filter(t => {
    const q = busqueda.value.toLowerCase()
    const b = !q || t.nombre.toLowerCase().includes(q) || t.descripcion.toLowerCase().includes(q)
    const e = !filtroEstado.value    || t.estado    === filtroEstado.value
    const p = !filtroPrioridad.value || t.prioridad === filtroPrioridad.value
    return b && e && p
  })
)
</script>
 
<style scoped>
.layout { display: flex; min-height: 100vh; background: #f3f4f6; color: #111827; font-family: Inter, "Segoe UI", sans-serif; }
.main { flex: 1; padding: 28px 30px; overflow-y: auto; }
.title { font-size: 22px; font-weight: 700; margin-bottom: 20px; color: #111827; }
 
/* FILTROS */
.filters-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.search-wrap { position: relative; flex: 1; max-width: 340px; }
.search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #9ca3af; pointer-events: none; }
.search { width: 100%; padding: 9px 14px 9px 36px; border-radius: 8px; border: 1px solid #e5e7eb; background: white; font-size: 14px; color: #111827; outline: none; }
.search:focus { border-color: #1f3a52; }
.search::placeholder { color: #9ca3af; }
.select { padding: 9px 12px; border-radius: 8px; border: 1px solid #e5e7eb; background: white; font-size: 14px; color: #374151; cursor: pointer; outline: none; }
.select:focus { border-color: #1f3a52; }
 
/* STATS */
.stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 22px; }
.stat-card { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 18px 20px; }
.stat-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.stat-title { font-size: 13px; color: #6b7280; font-weight: 500; }
.stat-icon { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-icon.orange { background: #fff7ed; color: #ea580c; }
.stat-icon.blue   { background: #eff6ff; color: #2563eb; }
.stat-icon.green  { background: #f0fdf4; color: #16a34a; }
.stat-icon.gray   { background: #f3f4f6; color: #6b7280; }
.stat-number { font-size: 26px; font-weight: 700; }
.stat-number.orange { color: #ea580c; }
.stat-number.blue   { color: #2563eb; }
.stat-number.green  { color: #16a34a; }
.stat-number.gray   { color: #374151; }
 
/* LOADING */
.loading-wrap { display: flex; flex-direction: column; align-items: center; padding: 60px; gap: 14px; color: #9ca3af; font-size: 14px; }
.spinner { width: 32px; height: 32px; border: 3px solid #e5e7eb; border-top-color: #1f3a52; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
 
/* TASKS */
.tasks-list { display: flex; flex-direction: column; gap: 16px; }
 
.task-card { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px 24px; }
.task-top { margin-bottom: 12px; }
.task-badges { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.task-id { font-size: 13px; font-weight: 700; color: #1f3a52; }
 
.badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; }
.badge.en-proceso { background: #dbeafe; color: #2563eb; }
.badge.completado  { background: #dcfce7; color: #15803d; }
.badge.pausado     { background: #fef3c7; color: #b45309; }
.badge.prioridad.alta  { background: #fee2e2; color: #991b1b; }
.badge.prioridad.media { background: #fef3c7; color: #92400e; }
.badge.prioridad.baja  { background: #f0fdf4; color: #166534; }
 
.task-name { font-size: 17px; font-weight: 700; color: #111827; margin-bottom: 4px; }
.task-desc { font-size: 14px; color: #6b7280; margin-bottom: 18px; }
 
.task-meta { display: flex; gap: 28px; margin-bottom: 18px; flex-wrap: wrap; }
.meta-item { display: flex; align-items: flex-start; gap: 8px; color: #6b7280; }
.meta-item svg { flex-shrink: 0; margin-top: 2px; }
.meta-label { font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 2px; }
.meta-value { font-size: 14px; font-weight: 600; color: #111827; }
.fecha-vencida { color: #dc2626 !important; }
 
.progress-section { }
.progress-label { display: flex; justify-content: space-between; font-size: 13px; color: #6b7280; margin-bottom: 6px; }
.progress-pct { font-weight: 600; color: #374151; }
.progress-bar { width: 100%; height: 8px; background: #e5e7eb; border-radius: 999px; overflow: hidden; }
.progress-fill { height: 100%; background: #1f3a52; border-radius: 999px; transition: width 0.3s ease; }
.progress-fill.fill-completo { background: #16a34a; }
 
.empty-state { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 60px 24px; color: #9ca3af; font-size: 14px; text-align: center; }
 
@media (max-width: 1100px) {
  .stats { grid-template-columns: repeat(2, 1fr); }
  .task-meta { gap: 16px; }
}
@media (max-width: 800px) {
  .main { padding: 20px 16px; }
  .stats { grid-template-columns: repeat(2, 1fr); }
}
</style>
 