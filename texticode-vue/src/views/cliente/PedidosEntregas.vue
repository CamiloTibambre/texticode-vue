<template>
  <div style="display:flex; min-height:100vh; background:#f5f6fa">
    <AppSidebar rol="cliente" />
 
    <main class="main">
      <div class="page-title">Pedidos y Entregas</div>
 
      <div class="filters-bar">
        <div class="search-wrap">
          <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/>
          </svg>
          <input v-model="busqueda" placeholder="Buscar orden...">
        </div>
        <select v-model="filtroEstado">
          <option value="">Todos los estados</option>
          <option value="En Proceso">En Proceso</option>
          <option value="Completada">Completada</option>
          <option value="Pausado">Pausado</option>
        </select>
      </div>
 
      <!-- KPI CARDS -->
      <div class="stats-grid">
        <div class="stat-card" v-for="s in stats" :key="s.label">
          <div class="stat-card-head">{{ s.label }}</div>
          <div class="stat-value" :style="{ color: s.color }">{{ s.valor }}</div>
        </div>
      </div>
 
      <div v-if="!auth.idUsuario" class="estado-info">
        Inicia sesión para ver tus pedidos.
      </div>
      <div v-else-if="cargando" class="estado-info">
        <div class="spinner"></div>
        Cargando órdenes...
      </div>
      <div v-else-if="error" class="estado-error">{{ error }}</div>
 
      <div v-else class="orders-list">
        <div v-if="pedidosFiltrados.length === 0" class="estado-info">
          No tienes órdenes registradas aún.
        </div>
 
        <div v-for="o in pedidosFiltrados" :key="o.id" class="order-card">
          <div class="order-head">
            <span class="order-num">Orden #{{ o.id }}</span>
            <span class="badge" :class="o.badgeClass">{{ o.estado }}</span>
            <span class="badge" :class="o.prioridadClass">{{ o.prioridad }}</span>
          </div>
 
          <div class="order-title">{{ o.nombre }}</div>
          <div class="order-desc">{{ o.descripcion }}</div>
 
          <div class="order-meta">
            <div>
              <span class="meta-label">Material</span>
              <span class="meta-value">{{ o.material }}</span>
            </div>
            <div>
              <span class="meta-label">Cantidad pedida</span>
              <span class="meta-value">{{ o.cantidad }} uds.</span>
            </div>
            <div>
              <span class="meta-label">Fecha Límite</span>
              <span class="meta-value" :class="o.fechaClass">{{ o.fechaEntrega }}</span>
            </div>
            <div>
              <span class="meta-label">Prendas realizadas</span>
              <span class="meta-value prendas-value" :class="{ 'prendas-completas': o.unidadesRealizadas >= o.cantidad }">
                {{ o.unidadesRealizadas }}
                <span class="prendas-total">/ {{ o.cantidad }}</span>
              </span>
            </div>
          </div>
 
          <!-- Barra de progreso con detalle -->
          <div class="progress-section">
            <div class="progress-row">
              <span class="progress-label">Progreso de fabricación</span>
              <span class="progress-detail">
                <strong>{{ o.unidadesRealizadas }}</strong> de <strong>{{ o.cantidad }}</strong> prendas
                <span class="progress-pct" :class="{ 'pct-completo': o.progreso === 100 }">· {{ o.progreso }}%</span>
              </span>
            </div>
            <div class="progress-bg">
              <div
                class="progress-fill"
                :class="{
                  green: o.progreso === 100,
                  orange: o.progreso > 0 && o.progreso < 100
                }"
                :style="{ width: o.progreso + '%' }"
              ></div>
            </div>
            <div class="progress-milestones">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>
 
          <!-- Mensaje de estado -->
          <div v-if="o.estado === 'Completada'" class="estado-banner completada">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Orden completada — todas las prendas han sido fabricadas
          </div>
          <div v-else-if="o.estado === 'En Proceso'" class="estado-banner proceso">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            En producción — faltan {{ o.cantidad - o.unidadesRealizadas }} prenda(s) por fabricar
          </div>
          <div v-else-if="o.estado === 'Pausado'" class="estado-banner pausado">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5"/>
            </svg>
            Orden pausada temporalmente
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
 
<script setup>
import { ref, computed, onMounted } from 'vue'
import AppSidebar from '../../components/AppSidebar.vue'
import { useAuthStore } from '../../stores/auth'
 
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
 
const auth         = useAuthStore()
const busqueda     = ref('')
const filtroEstado = ref('')
const pedidos      = ref([])
const cargando     = ref(false)
const error        = ref('')
 
async function cargarOrdenes() {
  if (!auth.idUsuario) return
 
  cargando.value = true
  error.value    = ''
 
  try {
    const res = await fetch(`${BASE}/ordenes/cliente/${auth.idUsuario}`)
    if (!res.ok) throw new Error(`Error del servidor: ${res.status}`)
    const data = await res.json()
 
    pedidos.value = data.map(o => {
      // Prendas realmente realizadas según la BD
      const unidadesRealizadas = o.Unidades_Realizadas ?? 0
      const cantidad           = o.Cantidad ?? 0
 
      // Calcular progreso real: si está completada → 100%, si no → realizadas/cantidad
      let progreso = 0
      if (o.Estado === 'Completada') {
        progreso = 100
      } else if (cantidad > 0 && unidadesRealizadas > 0) {
        progreso = Math.min(100, Math.round((unidadesRealizadas / cantidad) * 100))
      }
 
      return {
        id:               o.Id_Orden,
        nombre:           o.Producto    || o.Descripcion || 'Sin nombre',
        descripcion:      o.Descripcion || '',
        cantidad,
        material:         o.NombreMaterial || '—',
        fechaEntrega:     o.Fecha_Limite
          ? new Date(o.Fecha_Limite).toLocaleDateString('es-CO', {
              year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC'
            })
          : '—',
        estado:           o.Estado,
        prioridad:        o.Prioridad || 'Media',
        unidadesRealizadas,
        progreso,
        badgeClass: {
          'En Proceso': 'badge-process',
          'Completada': 'badge-done',
          'Pausado':    'badge-pending',
        }[o.Estado] || 'badge-pending',
        prioridadClass: {
          'Alta':  'badge-alta',
          'Media': 'badge-media',
          'Baja':  'badge-baja',
        }[o.Prioridad] || 'badge-baja',
        fechaClass: o.Estado === 'Completada' ? 'ok-date' : '',
      }
    })
  } catch (e) {
    error.value = `No se pudieron cargar las órdenes: ${e.message}`
  } finally {
    cargando.value = false
  }
}
 
onMounted(cargarOrdenes)
 
const pedidosFiltrados = computed(() =>
  pedidos.value.filter(p => {
    const q = busqueda.value.toLowerCase()
    return (p.nombre.toLowerCase().includes(q) || String(p.id).includes(q)) &&
           (!filtroEstado.value || p.estado === filtroEstado.value)
  })
)
 
const stats = computed(() => [
  { label: 'Total Órdenes', valor: pedidos.value.length,                                        color: '#111827' },
  { label: 'En Proceso',    valor: pedidos.value.filter(p => p.estado === 'En Proceso').length, color: '#1d4ed8' },
  { label: 'Completadas',   valor: pedidos.value.filter(p => p.estado === 'Completada').length, color: '#15803d' },
  { label: 'Pausadas',      valor: pedidos.value.filter(p => p.estado === 'Pausado').length,    color: '#b45309' },
])
</script>
 
<style scoped>
.main       { flex: 1; padding: 36px 40px; min-height: 100vh; overflow-y: auto; }
.page-title { font-size: 26px; font-weight: 700; color: #111827; margin-bottom: 24px; }
 
.filters-bar  { display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
.search-wrap  { position: relative; flex: 1; max-width: 380px; }
.search-wrap svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #9ca3af; width: 16px; height: 16px; }
.search-wrap input { width: 100%; padding: 10px 14px 10px 38px; border: 1px solid #e0e3ea; border-radius: 8px; font-size: 14px; outline: none; background: #fff; }
.filters-bar select { padding: 10px 14px; border: 1px solid #e0e3ea; border-radius: 8px; font-size: 14px; background: #fff; outline: none; cursor: pointer; min-width: 160px; }
 
.stats-grid     { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 24px; }
.stat-card      { background: #fff; border: 1px solid #e8eaf0; border-radius: 12px; padding: 20px 22px; }
.stat-card-head { font-size: 13px; font-weight: 500; color: #6b7280; margin-bottom: 12px; }
.stat-value     { font-size: 32px; font-weight: 700; }
 
.orders-list { display: flex; flex-direction: column; gap: 16px; }
 
.order-card  {
  background: #fff;
  border: 1px solid #e8eaf0;
  border-radius: 12px;
  padding: 24px 28px;
  transition: box-shadow 0.2s;
}
.order-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.07); }
 
.order-head  { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; flex-wrap: wrap; }
.order-num   { font-size: 14px; font-weight: 700; color: #111827; }
.order-title { font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 4px; }
.order-desc  { font-size: 13px; color: #6b7280; margin-bottom: 18px; }
 
.order-meta  { display: grid; grid-template-columns: repeat(4, auto); gap: 4px 32px; margin-bottom: 20px; }
.meta-label  { font-size: 12px; color: #9ca3af; display: block; margin-bottom: 2px; }
.meta-value  { font-size: 14px; font-weight: 600; color: #111827; }
.ok-date     { color: #15803d; }
 
/* Prendas realizadas destacadas */
.prendas-value {
  font-size: 18px;
  font-weight: 800;
  color: #1d4ed8;
}
.prendas-value.prendas-completas { color: #15803d; }
.prendas-total {
  font-size: 14px;
  font-weight: 500;
  color: #9ca3af;
}
 
.badge         { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; }
.badge-process { background: #dbeafe; color: #1d4ed8; }
.badge-done    { background: #dcfce7; color: #15803d; }
.badge-pending { background: #fef9c3; color: #92400e; }
.badge-alta    { background: #fee2e2; color: #b91c1c; }
.badge-media   { background: #fef9c3; color: #92400e; }
.badge-baja    { background: #f3f4f6; color: #6b7280; }
 
/* Progress section mejorado */
.progress-section { margin-bottom: 16px; }
.progress-row   { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.progress-label { font-size: 13px; color: #6b7280; font-weight: 500; }
.progress-detail { font-size: 13px; color: #374151; }
.progress-pct   { font-weight: 700; color: #374151; }
.pct-completo   { color: #15803d; }
.progress-bg    { width: 100%; height: 10px; background: #f3f4f6; border-radius: 99px; overflow: hidden; }
.progress-fill  {
  height: 100%;
  background: #111827;
  border-radius: 99px;
  transition: width 0.6s ease;
}
.progress-fill.orange { background: #023594; }
.progress-fill.green  { background: #22c55e; }
.progress-milestones {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  font-size: 10px;
  color: #d1d5db;
}
 
/* Banners de estado */
.estado-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  margin-top: 4px;
}
.estado-banner.completada { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
.estado-banner.proceso    { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
.estado-banner.pausado    { background: #fefce8; color: #b45309; border: 1px solid #fde68a; }
 
/* Spinner */
.estado-info  {
  padding: 40px;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e8eaf0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #e5e7eb;
  border-top-color: #1f3a52;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
 
.estado-error { padding: 20px; text-align: center; color: #b91c1c; font-size: 14px; background: #fee2e2; border-radius: 8px; }
</style>