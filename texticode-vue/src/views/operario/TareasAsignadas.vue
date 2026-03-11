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
          <option value="pendiente">Pendiente</option>
          <option value="en-proceso">En Proceso</option>
          <option value="pausado">Pausado</option>
          <option value="completado">Completado</option>
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
            <span class="stat-icon orange">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <circle cx="12" cy="12" r="9"/><path stroke-linecap="round" d="M12 7v5l3 3"/>
              </svg>
            </span>
            <span class="stat-title">Pendientes</span>
          </div>
          <div class="stat-number orange">{{ contarPor('pendiente') }}</div>
        </div>
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
            <span class="stat-icon gray">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <circle cx="12" cy="12" r="9"/><path stroke-linecap="round" d="M12 8v4M12 16h.01"/>
              </svg>
            </span>
            <span class="stat-title">Atrasadas</span>
          </div>
          <div class="stat-number gray">{{ contarPor('atrasado') }}</div>
        </div>
      </div>

      <!-- TAREAS -->
      <div class="tasks-list">
        <div class="task-card" v-for="tarea in tareasFiltradas" :key="tarea.id">
          <div class="task-top">
            <div class="task-badges">
              <span class="task-id">{{ String(tarea.id).padStart(3, '0') }}</span>
              <span class="badge" :class="tarea.estado">
                <svg v-if="tarea.estado === 'en-proceso'" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <circle cx="12" cy="12" r="9"/><path stroke-linecap="round" d="M8 12h8M12 8v8"/>
                </svg>
                <svg v-else-if="tarea.estado === 'pendiente'" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <circle cx="12" cy="12" r="9"/><path stroke-linecap="round" d="M12 7v5l3 3"/>
                </svg>
                <svg v-else-if="tarea.estado === 'completado'" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <circle cx="12" cy="12" r="9"/><path stroke-linecap="round" stroke-linejoin="round" d="M8.5 12.5l2.5 2.5 4.5-4.5"/>
                </svg>
                {{ estadoLabel(tarea.estado) }}
              </span>
              <span class="badge prioridad" :class="tarea.prioridad">{{ tarea.prioridad.charAt(0).toUpperCase() + tarea.prioridad.slice(1) }}</span>
            </div>
          </div>

          <h2 class="task-name">{{ tarea.nombre }}</h2>
          <p class="task-desc">{{ tarea.descripcion }}</p>

          <div class="task-meta">
            <div class="meta-item">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
              </svg>
              <div>
                <div class="meta-label">Cliente:</div>
                <div class="meta-value">{{ tarea.cliente }}</div>
              </div>
            </div>
            <div class="meta-item">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/>
              </svg>
              <div>
                <div class="meta-label">Entrega:</div>
                <div class="meta-value">{{ tarea.entrega }}</div>
              </div>
            </div>
            <div class="meta-item">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div>
                <div class="meta-label">Tiempo estimado:</div>
                <div class="meta-value">{{ tarea.tiempoEstimado }}</div>
              </div>
            </div>
          </div>

          <div class="progress-section" v-if="tarea.progreso !== undefined">
            <div class="progress-label">
              <span>Progreso:</span>
              <span class="progress-pct">{{ tarea.progreso }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: tarea.progreso + '%' }"></div>
            </div>
          </div>

          <div class="materiales-section">
            <div class="meta-label" style="margin-bottom:8px">Materiales:</div>
            <div class="tags">
              <span class="tag" v-for="mat in tarea.materiales" :key="mat">{{ mat }}</span>
            </div>
          </div>

          <div class="instrucciones-section">
            <div class="instrucciones-title">Instrucciones:</div>
            <p class="instrucciones-text">{{ tarea.instrucciones }}</p>
          </div>
        </div>

        <p v-if="tareasFiltradas.length === 0" style="color:#6b7280; text-align:center; padding:40px 0;">
          No se encontraron tareas con los filtros aplicados.
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'

const busqueda = ref('')
const filtroEstado = ref('')
const filtroPrioridad = ref('')

const tareas = ref([
  {
    id: 1,
    estado: 'en-proceso',
    prioridad: 'alta',
    nombre: 'Camisas Polo Azules',
    descripcion: 'Confección de 50 camisas polo en color azul marino, talla M',
    cliente: 'Textiles del Norte',
    entrega: '19/01/2024',
    tiempoEstimado: '3 días',
    progreso: 75,
    materiales: ['Tela Polo Azul', 'Hilo Azul', 'Botones Blancos'],
    instrucciones: 'Seguir patrón estándar para polo. Atención especial en costuras del cuello.'
  },
  {
    id: 2,
    estado: 'pendiente',
    prioridad: 'media',
    nombre: 'Camisetas Estampadas',
    descripcion: 'Aplicación de estampado en 30 camisetas blancas',
    cliente: 'Moda & Estilo',
    entrega: '21/01/2024',
    tiempoEstimado: '2 días',
    progreso: undefined,
    materiales: ['Camisetas Blancas', 'Tinta Serigrafía', 'Plantillas'],
    instrucciones: 'Verificar alineación del estampado antes de aplicar.'
  }
])

const estadoLabel = (estado) => {
  const labels = {
    'en-proceso': 'En Proceso',
    'pendiente': 'Pendiente',
    'completado': 'Completado',
    'atrasado': 'Atrasado',
    'pausado': 'Pausado'
  }
  return labels[estado] || estado
}

const contarPor = (estado) => tareas.value.filter(t => t.estado === estado).length

const tareasFiltradas = computed(() => {
  return tareas.value.filter(t => {
    const coincideBusqueda = t.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      t.descripcion.toLowerCase().includes(busqueda.value.toLowerCase())
    const coincideEstado = filtroEstado.value === '' || t.estado === filtroEstado.value
    const coincidePrioridad = filtroPrioridad.value === '' || t.prioridad === filtroPrioridad.value
    return coincideBusqueda && coincideEstado && coincidePrioridad
  })
})
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background: #f3f4f6;
  color: #111827;
  font-family: Inter, "Segoe UI", sans-serif;
}

.main {
  flex: 1;
  padding: 28px 30px;
  overflow-y: auto;
}

.title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #111827;
}

/* FILTROS */
.filters-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.search-wrap {
  position: relative;
  flex: 1;
  max-width: 340px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
}

.search {
  width: 100%;
  padding: 9px 14px 9px 36px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: white;
  font-size: 14px;
  color: #111827;
  outline: none;
}

.search:focus { border-color: #1f3a52; }
.search::placeholder { color: #9ca3af; }

.select {
  padding: 9px 12px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: white;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  outline: none;
}

.select:focus { border-color: #1f3a52; }

/* STATS */
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 22px;
}

.stat-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 18px 20px;
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.stat-title {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.stat-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon.orange { background: #fff7ed; color: #ea580c; }
.stat-icon.blue   { background: #eff6ff; color: #2563eb; }
.stat-icon.green  { background: #f0fdf4; color: #16a34a; }
.stat-icon.gray   { background: #f3f4f6; color: #6b7280; }

.stat-number { font-size: 26px; font-weight: 700; }
.stat-number.orange { color: #ea580c; }
.stat-number.blue   { color: #2563eb; }
.stat-number.green  { color: #16a34a; }
.stat-number.gray   { color: #374151; }

/* TASK CARDS */
.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.task-card {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px 24px;
}

.task-top { margin-bottom: 10px; }

.task-badges {
  display: flex;
  align-items: center;
  gap: 8px;
}

.task-id {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
}

.badge.en-proceso  { background: #dbeafe; color: #2563eb; }
.badge.pendiente   { background: #fef3c7; color: #b45309; }
.badge.completado  { background: #dcfce7; color: #15803d; }
.badge.atrasado    { background: #fee2e2; color: #b91c1c; }

.badge.prioridad { border-radius: 999px; }
.badge.alta  { background: #f3f4f6; color: #374151; }
.badge.media { background: #fef3c7; color: #92400e; }
.badge.baja  { background: #f0fdf4; color: #166534; }

.task-name {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
}

.task-desc {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 16px;
}

.task-meta {
  display: flex;
  gap: 36px;
  margin-bottom: 16px;
  justify-content: space-between;
}

.meta-item {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  color: #6b7280;
}

.meta-item svg { flex-shrink: 0; margin-top: 2px; }

.meta-label { font-size: 14px; color: #6b7280; }
.meta-value { font-size: 14px; font-weight: 600; color: #111827; }

.progress-section { margin-bottom: 16px; }

.progress-label {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 6px;
}

.progress-pct { font-weight: 600; color: #374151; }

.progress-bar {
  width: 100%;
  height: 8px;
  background: #d1d5db;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #1f3a52;
  border-radius: 999px;
  transition: width 0.3s ease;
}

.materiales-section { margin-bottom: 14px; }

.tags { display: flex; flex-wrap: wrap; gap: 8px; }

.tag {
  background: white;
  border: 1px solid #d1d5db;
  color: #374151;
  font-size: 14px;
  padding: 4px 12px;
  border-radius: 999px;
}

.instrucciones-section {
  background: #eff6ff;
  border-radius: 8px;
  padding: 12px 14px;
}

.instrucciones-title {
  font-size: 15px;
  font-weight: 600;
  color: #2563eb;
  margin-bottom: 4px;
}

.instrucciones-text {
  font-size: 14px;
  color: #2563eb;
}

@media (max-width: 1100px) {
  .stats { grid-template-columns: repeat(2, 1fr); }
  .task-meta { flex-wrap: wrap; gap: 16px; }
}

@media (max-width: 800px) {
  .main { padding: 20px 16px; }
  .stats { grid-template-columns: repeat(2, 1fr); }
}
</style>
