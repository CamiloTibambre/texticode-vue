<template>
  <div class="layout">
    <AppSidebar rol="admin" />

    <main class="content">
      <div class="main-content">

        <h1>Reportes</h1>
        <!-- FILTRO -->
        <div class="filter-bar">
          <div class="select-wrapper">
            <select v-model="tipoFiltro" class="type-select">
              <option value="">Todos los tipos</option>
              <option>Ventas</option>
              <option>Inventario</option>
              <option>Clientes</option>
              <option>Producción</option>
            </select>
            <svg class="select-arrow" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
            </svg>
          </div>
        </div>

        <!-- CARDS ESTADÍSTICAS -->
        <div class="stats-grid">

          <div class="stat-card">
            <div class="stat-header">
              <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="stat-icon blue">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"/>
              </svg>
              <span class="stat-label">Pedidos Totales</span>
            </div>
            <div class="stat-value">330</div>
            <div class="stat-change blue-change">
              <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="trend-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"/>
              </svg>
              +8.3%
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="stat-icon green">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
              </svg>
              <span class="stat-label">Pedidos Completados</span>
            </div>
            <div class="stat-value">312</div>
            <div class="stat-change positive">
              <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="trend-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"/>
              </svg>
              +12.5%
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="stat-icon purple">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
              </svg>
              <span class="stat-label">Tasa Completación</span>
            </div>
            <div class="stat-value">94.5%</div>
            <div class="stat-change purple-change">
              <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="trend-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"/>
              </svg>
              +2.3%
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="stat-icon orange">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"/>
              </svg>
              <span class="stat-label">Pedidos Pendientes</span>
            </div>
            <div class="stat-value">18</div>
            <div class="stat-change warning">5% del total</div>
          </div>

        </div>

        <!-- GRÁFICO DE BARRAS -->
        <div class="panel">
          <h3>Pedidos por Mes (Últimos 6 meses)</h3>
          <div class="chart">
            <div v-for="mes in meses" :key="mes.nombre" class="bar-col">
              <div class="bar-wrapper">
                <div class="bar-total" :style="{ height: (mes.completadas + mes.pendientes) * 2.8 + 'px' }">
                  <div class="bar-pending-strip" :style="{ height: mes.pendientes * 2.8 + 'px' }"></div>
                </div>
              </div>
              <div class="bar-label">{{ mes.nombre }}</div>
              <div class="bar-sub">{{ mes.completadas + mes.pendientes }} pedidos</div>
              <div class="bar-counts">
                <span class="c-dark">{{ mes.completadas }}</span>
                <span class="c-orange">{{ mes.pendientes }}</span>
              </div>
            </div>
          </div>
          <div class="legend">
            <span class="legend-item">
              <span class="dot dot-dark"></span> Completados
            </span>
            <span class="legend-item">
              <span class="dot dot-orange"></span> Pendientes
            </span>
          </div>
        </div>

        <!-- REPORTES DISPONIBLES -->
        <div class="panel">
          <h3>Reportes Disponibles</h3>
          <div class="report-list">
            <div v-for="r in reportes" :key="r.titulo" class="report-row">
              <div class="report-left">
                <div class="report-icon-wrap">
                  <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="report-svg">
                    <path stroke-linecap="round" stroke-linejoin="round" :d="r.iconPath"/>
                  </svg>
                </div>
                <div class="report-info">
                  <div class="report-title">{{ r.titulo }}</div>
                  <div class="report-meta">
                    <span>Período: {{ r.periodo }}</span>
                    <span>Generado: {{ r.generado }}</span>
                    <span>Tamaño: {{ r.tamano }}</span>
                  </div>
                </div>
              </div>
              <div class="report-right">
                <span class="badge-generado">Generado</span>
                <button class="btn-descargar">
                  <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:18px;height:18px;">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                  </svg>
                  Descargar
                </button>
                <button class="btn-excel">
                  <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:18px;height:18px;">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/>
                  </svg>
                  Exportar a Excel
                </button>
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

const tipoFiltro = ref('')

const meses = [
  { nombre: 'Sep', completadas: 42, pendientes: 3 },
  { nombre: 'Oct', completadas: 50, pendientes: 2 },
  { nombre: 'Nov', completadas: 45, pendientes: 3 },
  { nombre: 'Dic', completadas: 58, pendientes: 4 },
  { nombre: 'Ene', completadas: 65, pendientes: 3 },
  { nombre: 'Feb', completadas: 52, pendientes: 3 },
]

const reportesData = [
  {
    titulo: 'Reporte de Ventas Mensual',
    tipo: 'Ventas',
    periodo: 'Febrero 2026',
    generado: '2026-02-28',
    tamano: '2.1 MB',
    iconPath: 'M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
  },
  {
    titulo: 'Inventario Stock Bajo',
    tipo: 'Inventario',
    periodo: 'Marzo 2026',
    generado: '2026-03-01',
    tamano: '856 KB',
    iconPath: 'm21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9'
  },
  {
    titulo: 'Análisis de Clientes',
    tipo: 'Clientes',
    periodo: 'Q1 2026',
    generado: '2026-02-05',
    tamano: '1.2 MB',
    iconPath: 'M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z'
  },
  {
    titulo: 'Productividad Operadores',
    tipo: 'Producción',
    periodo: 'Febrero 2026',
    generado: '2026-02-29',
    tamano: '1.3 MB',
    iconPath: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z'
  },
]

const reportes = computed(() =>
  tipoFiltro.value === ''
    ? reportesData
    : reportesData.filter(r => r.tipo === tipoFiltro.value)
)
</script>

<style scoped>
.layout      { display: flex; min-height: 100vh; }
.content     { flex: 1; padding: 28px 30px; min-height: 100vh; }
.main-content { max-width: 100%; }

h1 { font-size: 26px; font-weight: 600; color: #111827; padding-bottom: 16px; margin-bottom: 20px; border-bottom: 1px solid #e5e7eb; }
.title-divider { border: none; border-top: 1px solid #e5e7eb; margin-bottom: 25px; }

/* ── FILTER ── */
.filter-bar { margin-bottom: 25px; }
.select-wrapper { position: relative; display: inline-flex; align-items: center; }
.type-select {
  padding: 9px 36px 9px 14px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: white;
  font-size: 14px;
  color: #374151;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  min-width: 170px;
  outline: none;
}
.type-select:focus { border-color: #1f3c4d; }
.select-arrow { position: absolute; right: 10px; width: 14px; height: 14px; color: #6b7280; pointer-events: none; }

/* ── STAT CARDS ── */
.stats-grid { display: flex; gap: 20px; margin-bottom: 30px; }
.stat-card {
  background: white;
  flex: 1;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
}
.stat-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.stat-icon { width: 18px; height: 18px; flex-shrink: 0; }
.stat-icon.blue   { color: #2563eb; }
.stat-icon.green  { color: #16a34a; }
.stat-icon.purple { color: #7c3aed; }
.stat-icon.orange { color: #f97316; }
.stat-label { font-size: 14px; font-weight: 500; color: #6b7280; }
.stat-value { font-size: 26px; font-weight: 600; color: #111827; margin-top: 10px; margin-bottom: 8px; }
.stat-change { display: flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 500; }
.stat-change.positive { color: #16a34a; }
.stat-change.warning  { color: #f97316; }
.trend-icon { width: 14px; height: 14px; }

/* ── PANEL ── */
.panel {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.panel h3 { font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 24px; }

/* ── CHART ── */
.chart { display: flex; align-items: flex-end; gap: 16px; height: 220px; margin-bottom: 16px; padding-bottom: 0; }
.bar-col { display: flex; flex-direction: column; align-items: center; flex: 1; }
.bar-wrapper { display: flex; align-items: flex-end; width: 100%; justify-content: center; }
.bar-total {
  width: 80%;
  background: #1f3c4d;
  border-radius: 6px 6px 0 0;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 20px;
}
.bar-pending-strip {
  width: 100%;
  background: #f97316;
  border-radius: 0 0 6px 6px;
  min-height: 6px;
}
.bar-label  { font-size: 13px; font-weight: 600; color: #374151; margin-top: 8px; }
.bar-sub    { font-size: 11px; color: #9ca3af; margin-top: 2px; }
.bar-counts { display: flex; gap: 6px; font-size: 12px; font-weight: 600; margin-top: 2px; }
.c-dark   { color: #1f3c4d; }
.c-orange { color: #f97316; }

.legend { display: flex; gap: 20px; font-size: 13px; color: #374151; justify-content: center; margin-top: 8px; }
.legend-item { display: flex; align-items: center; gap: 6px; }
.dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
.dot-dark   { background: #1f3c4d; }
.dot-orange { background: #f97316; }

/* ── REPORT LIST ── */
.report-list { display: flex; flex-direction: column; gap: 12px; }
.report-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: white;
}
.report-left { display: flex; align-items: center; gap: 14px; }
.report-icon-wrap {
  width: 38px; height: 38px;
  background: #f3f4f6;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.report-svg { width: 20px; height: 20px; color: #6b7280; }
.report-title { font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 4px; }
.report-meta { font-size: 12px; color: #9ca3af; display: flex; gap: 16px; }
.report-right { display: flex; align-items: center; gap: 10px; }

.badge-generado {
  background: #dcfce7;
  color: #16a34a;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
}
.btn-descargar {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 14px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  white-space: nowrap;
}
.btn-descargar:hover { background: #f9fafb; }
.btn-excel {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 14px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  white-space: nowrap;
}
.btn-excel:hover { background: #f9fafb; }
.blue-change   { display: flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 500; color: #2563eb; }
.purple-change { display: flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 500; color: #7c3aed; }
</style>