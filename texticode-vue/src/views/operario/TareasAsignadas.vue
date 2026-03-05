<template>
  <div style="display:flex;min-height:100vh;background:#f3f4f6">
    <AppSidebar rol="operario" />

    <main class="main">
      <div class="title">Tareas Asignadas</div>

      <!-- FILTROS -->
      <div class="filters-bar">
        <div class="search-wrap">
          <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/></svg>
          <input v-model="busqueda" placeholder="Buscar tareas..." class="search-input">
        </div>
        <select v-model="filtroEstado" class="filter-select">
          <option value="">Todos los estados</option>
          <option value="en-proceso">En Proceso</option>
          <option value="pendiente">Pendiente</option>
          <option value="completado">Completado</option>
        </select>
      </div>

      <!-- STATS -->
      <div class="stats-row">
        <div class="stat-mini" v-for="s in stats" :key="s.label">
          <div class="stat-mini-label">{{ s.label }}</div>
          <div class="stat-mini-num" :class="s.color">{{ s.valor }}</div>
        </div>
      </div>

      <!-- TAREAS -->
      <div class="tareas-list">
        <div v-for="t in tareasFiltradas" :key="t.id" class="tarea-card">
          <div class="tarea-top">
            <div class="tarea-left">
              <div class="tarea-head">
                <span class="tarea-num">{{ t.id }}</span>
                <span class="badge-estado" :class="t.estado">{{ t.estadoLabel }}</span>
              </div>
              <div class="tarea-titulo">{{ t.titulo }}</div>
              <div class="tarea-desc">{{ t.descripcion }}</div>
            </div>
            <div class="tarea-right">
              <div class="meta-item"><span class="meta-label">Unidades</span><span class="meta-value">{{ t.unidades }}</span></div>
              <div class="meta-item"><span class="meta-label">Fecha Límite</span><span class="meta-value">{{ t.fechaLimite }}</span></div>
            </div>
          </div>
          <!-- PROGRESO -->
          <div class="progress-row">
            <span class="progress-label">Progreso</span>
            <div class="progress-bg"><div class="progress-fill" :class="{ green: t.progreso === 100 }" :style="{ width: t.progreso + '%' }"></div></div>
            <span class="progress-pct">{{ t.progreso }}%</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppSidebar from '../../components/AppSidebar.vue'

const busqueda    = ref('')
const filtroEstado = ref('')

const estadoLabels = { 'en-proceso': 'En Proceso', pendiente: 'Pendiente', completado: 'Completado' }

const tareas = ref([
  { id: '#001', titulo: 'Camisas Polo Azules x 50',   descripcion: 'Confección de camisas polo para pedido María González', unidades: 50, fechaLimite: '2024-03-15', progreso: 75, estado: 'en-proceso' },
  { id: '#002', titulo: 'Camisetas Estampadas x 30',  descripcion: 'Diseño estampado floral para cliente Juan Pérez',        unidades: 30, fechaLimite: '2024-03-20', progreso: 0,  estado: 'pendiente' },
  { id: '#003', titulo: 'Pantalones Denim x 20',      descripcion: 'Pantalones denim corte recto, talla variada',            unidades: 20, fechaLimite: '2024-03-10', progreso: 100, estado: 'completado' },
].map(t => ({ ...t, estadoLabel: estadoLabels[t.estado] })))

const stats = computed(() => [
  { label: 'Total',       valor: tareas.value.length, color: '' },
  { label: 'En Proceso',  valor: tareas.value.filter(t=>t.estado==='en-proceso').length, color: 'blue' },
  { label: 'Pendientes',  valor: tareas.value.filter(t=>t.estado==='pendiente').length, color: 'orange' },
  { label: 'Completadas', valor: tareas.value.filter(t=>t.estado==='completado').length, color: 'green' },
])

const tareasFiltradas = computed(() =>
  tareas.value.filter(t => {
    const b = t.titulo.toLowerCase().includes(busqueda.value.toLowerCase())
    const e = !filtroEstado.value || t.estado === filtroEstado.value
    return b && e
  })
)
</script>

<style scoped>
.main { flex: 1; padding: 28px 30px; overflow-y: auto; }
.title { font-size: 22px; font-weight: 700; margin-bottom: 20px; }
.filters-bar { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
.search-wrap { position: relative; flex: 1; max-width: 380px; }
.search-wrap svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #9ca3af; width: 16px; height: 16px; }
.search-input { width: 100%; padding: 10px 14px 10px 38px; border: 1px solid #e0e3ea; border-radius: 8px; font-size: 14px; outline: none; background: #fff; }
.filter-select { padding: 10px 14px; border: 1px solid #e0e3ea; border-radius: 8px; font-size: 14px; background: #fff; outline: none; cursor: pointer; }
.stats-row { display: flex; gap: 16px; margin-bottom: 20px; }
.stat-mini { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px 20px; flex: 1; }
.stat-mini-label { font-size: 12px; color: #6b7280; margin-bottom: 6px; }
.stat-mini-num { font-size: 24px; font-weight: 700; }
.green { color: #16a34a; } .blue { color: #2563eb; } .orange { color: #d97706; }
.tareas-list { display: flex; flex-direction: column; gap: 16px; }
.tarea-card { background: white; border: 1px solid #e5e7eb; border-radius: 14px; padding: 22px 24px; }
.tarea-top { display: flex; justify-content: space-between; gap: 20px; margin-bottom: 16px; }
.tarea-left { flex: 1; }
.tarea-head { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.tarea-num { font-size: 13px; font-weight: 600; color: #6b7280; }
.badge-estado { padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; }
.badge-estado.en-proceso { background: #dbeafe; color: #1d4ed8; }
.badge-estado.pendiente  { background: #fef3c7; color: #b45309; }
.badge-estado.completado { background: #dcfce7; color: #15803d; }
.tarea-titulo { font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 4px; }
.tarea-desc { font-size: 13px; color: #6b7280; }
.tarea-right { display: flex; gap: 30px; flex-shrink: 0; }
.meta-item { display: flex; flex-direction: column; gap: 2px; }
.meta-label { font-size: 11px; color: #9ca3af; }
.meta-value { font-size: 14px; font-weight: 600; }
.progress-row { display: flex; align-items: center; gap: 14px; }
.progress-label { font-size: 13px; color: #6b7280; white-space: nowrap; }
.progress-pct { font-size: 13px; font-weight: 600; color: #111827; white-space: nowrap; }
.progress-bg { flex: 1; height: 8px; background: #e5e7eb; border-radius: 99px; overflow: hidden; }
.progress-fill { height: 100%; background: #111827; border-radius: 99px; transition: width 0.5s ease; }
.progress-fill.green { background: #22c55e; }
</style>
