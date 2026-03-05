<template>
  <div style="display:flex;min-height:100vh;background:#f5f6fa">
    <AppSidebar rol="cliente" />

    <main class="main">
      <div class="page-title">Pedidos y Entregas</div>

      <!-- FILTROS -->
      <div class="filters-bar">
        <div class="search-wrap">
          <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/></svg>
          <input v-model="busqueda" id="searchInput" placeholder="Buscar orden...">
        </div>
        <select v-model="filtroEstado" id="statusFilter">
          <option value="">Todos los estados</option>
          <option value="En Proceso">En Proceso</option>
          <option value="Producción">En Producción</option>
          <option value="Completado">Completado</option>
          <option value="Pendiente">Pendiente</option>
        </select>
      </div>

      <!-- STATS KPI -->
      <div class="stats-grid">
        <div class="stat-card" v-for="s in stats" :key="s.label">
          <div class="stat-card-head"><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" v-html="s.icon"></svg>{{ s.label }}</div>
          <div class="stat-value" :style="{ color: s.color }">{{ s.valor }}</div>
        </div>
      </div>

      <!-- LISTA ÓRDENES -->
      <div class="orders-list">
        <div v-for="o in pedidosFiltrados" :key="o.id" class="order-card">
          <div class="order-top">
            <div class="order-left">
              <div class="order-head">
                <span class="order-num">{{ o.id }}</span>
                <span class="badge" :class="o.badgeClass">{{ o.estado }}</span>
              </div>
              <div class="order-title">{{ o.nombre }}</div>
              <div class="order-desc">{{ o.descripcion }}</div>
              <div class="order-meta">
                <div><span class="meta-label">Cantidad</span><span class="meta-value">{{ o.cantidad }}</span></div>
                <div><span class="meta-label">Fecha Pedido</span><span class="meta-value">{{ o.fechaPedido }}</span></div>
                <div><span class="meta-label">Entrega Estimada</span><span class="meta-value" :class="o.fechaClass">{{ o.fechaEntrega }}</span></div>
              </div>
              <div class="progress-row">
                <span class="progress-label">Progreso</span>
                <div class="progress-bg"><div class="progress-fill" :class="{ green: o.progreso === 100 }" :style="{ width: o.progreso + '%' }"></div></div>
                <span class="progress-pct">{{ o.progreso }}%</span>
              </div>
            </div>
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

const pedidos = ref([
  { id: 'Orden #001', nombre: 'Camisetas Polo Azules',   descripcion: 'Camisetas polo 100% algodón, tallas S-XL', cantidad: '50 unidades', fechaPedido: '2024-02-01', fechaEntrega: '2024-03-15', progreso: 75,  estado: 'En Proceso',  badgeClass: 'badge-process', fechaClass: '' },
  { id: 'Orden #002', nombre: 'Pantalones Denim Clasico', descripcion: 'Pantalones denim corte recto, lavado desgastado', cantidad: '30 unidades', fechaPedido: '2024-01-20', fechaEntrega: '2024-03-10', progreso: 100, estado: 'Completado', badgeClass: 'badge-done', fechaClass: 'ok-date' },
  { id: 'Orden #003', nombre: 'Vestidos Floreados',       descripcion: 'Vestidos floreados verano, tela liviana', cantidad: '25 unidades', fechaPedido: '2024-02-10', fechaEntrega: '2024-03-20', progreso: 30,  estado: 'Producción', badgeClass: 'badge-prod', fechaClass: '' },
])

const stats = [
  { label: 'Total Órdenes', valor: '3', color: '#111827', icon: '' },
  { label: 'En Proceso',    valor: '1', color: '#1d4ed8', icon: '' },
  { label: 'Completadas',   valor: '1', color: '#15803d', icon: '' },
  { label: 'Pendientes',    valor: '1', color: '#b45309', icon: '' },
]

const pedidosFiltrados = computed(() =>
  pedidos.value.filter(p => {
    const b = p.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) || p.id.toLowerCase().includes(busqueda.value.toLowerCase())
    const e = !filtroEstado.value || p.estado === filtroEstado.value
    return b && e
  })
)
</script>

<style scoped>
.main { flex: 1; padding: 36px 40px; min-height: 100vh; overflow-y: auto; }
.page-title { font-size: 26px; font-weight: 700; color: #111827; margin-bottom: 24px; }
.filters-bar { display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
.search-wrap { position: relative; flex: 1; max-width: 380px; }
.search-wrap svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #9ca3af; width: 16px; height: 16px; }
#searchInput { width: 100%; padding: 10px 14px 10px 38px; border: 1px solid #e0e3ea; border-radius: 8px; font-size: 14px; outline: none; background: #fff; }
#statusFilter { padding: 10px 14px; border: 1px solid #e0e3ea; border-radius: 8px; font-size: 14px; background: #fff; outline: none; cursor: pointer; min-width: 160px; }
.stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 24px; }
.stat-card { background: #fff; border: 1px solid #e8eaf0; border-radius: 12px; padding: 20px 22px; }
.stat-card-head { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; margin-bottom: 12px; }
.stat-value { font-size: 32px; font-weight: 700; }
.orders-list { display: flex; flex-direction: column; gap: 16px; }
.order-card { background: #fff; border: 1px solid #e8eaf0; border-radius: 12px; padding: 24px 28px; }
.order-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
.order-left { flex: 1; }
.order-head { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; flex-wrap: wrap; }
.order-num { font-size: 14px; font-weight: 700; color: #111827; }
.badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; }
.badge-process { background: #dbeafe; color: #1d4ed8; }
.badge-prod    { background: #ede9fe; color: #6d28d9; }
.badge-done    { background: #dcfce7; color: #15803d; }
.badge-pending { background: #fef9c3; color: #92400e; }
.order-title { font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 4px; }
.order-desc { font-size: 13px; color: #6b7280; margin-bottom: 18px; }
.order-meta { display: grid; grid-template-columns: repeat(3,auto); gap: 4px 40px; margin-bottom: 18px; }
.meta-label { font-size: 12px; color: #9ca3af; display: block; margin-bottom: 2px; }
.meta-value { font-size: 14px; font-weight: 600; color: #111827; }
.ok-date { color: #15803d; }
.progress-row { display: flex; align-items: center; gap: 14px; }
.progress-label { font-size: 13px; color: #6b7280; white-space: nowrap; }
.progress-pct { font-size: 13px; font-weight: 600; color: #111827; white-space: nowrap; }
.progress-bg { flex: 1; height: 8px; background: #e5e7eb; border-radius: 99px; overflow: hidden; }
.progress-fill { height: 100%; background: #111827; border-radius: 99px; transition: width 0.5s ease; }
.progress-fill.green { background: #22c55e; }
</style>
