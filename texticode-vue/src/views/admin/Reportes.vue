<template>
  <div class="layout">
    <AppSidebar rol="admin" />
    <main class="main-content">
      <div class="page-title">Reportes</div>

      <!-- CARDS STATS -->
      <div class="stats-cards">
        <div class="card" v-for="s in stats" :key="s.label">
          <div class="card-header">{{ s.label }}</div>
          <div class="card-value" :class="s.color">{{ s.valor }}</div>
          <div class="card-change" :class="s.changeClass">{{ s.cambio }}</div>
        </div>
      </div>

      <!-- GRÁFICO DE BARRAS -->
      <div class="panel">
        <h2>Órdenes por Mes</h2>
        <div class="chart">
          <div v-for="mes in meses" :key="mes.nombre" class="bar-group">
            <div class="bar-wrapper">
              <div class="bar" :style="{ height: mes.completadas * 2 + 'px' }">
                <div class="bar-pending" :style="{ height: mes.pendientes * 2 + 'px' }"></div>
              </div>
            </div>
            <div class="month">{{ mes.nombre }}</div>
            <div class="details">
              <span class="blue-text">{{ mes.completadas }}</span>
              <span class="orange-text">{{ mes.pendientes }}</span>
            </div>
          </div>
        </div>
        <div class="legend">
          <span><span class="legend-dot blue"></span>Completadas</span>
          <span><span class="legend-dot orange"></span>Pendientes</span>
        </div>
      </div>

      <!-- REPORTES DISPONIBLES -->
      <div class="panel">
        <h2>Reportes Disponibles</h2>
        <div class="reports-container">
          <div v-for="r in reportes" :key="r.titulo" class="report-item">
            <div class="report-left">
              <div class="report-icon">{{ r.icono }}</div>
              <div>
                <div class="report-title">{{ r.titulo }}</div>
                <div class="report-meta">{{ r.meta }}</div>
              </div>
            </div>
            <div class="report-right">
              <span class="status">Generado</span>
              <button class="btn">
                <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                </svg>
                Descargar
              </button>
              <button class="btn-outline">Exportar a Excel</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import AppSidebar from '../../components/AppSidebar.vue'

const stats = [
  { label: 'Ingresos Totales', valor: '$45,231', color: 'blue', cambio: '+20.1% vs mes anterior', changeClass: 'positive' },
  { label: 'Órdenes Completadas', valor: '342', color: 'green', cambio: '+15.3% vs mes anterior', changeClass: 'positive' },
  { label: 'Producción Total', valor: '1,284', color: 'purple', cambio: '+8.7% vs mes anterior', changeClass: 'positive' },
  { label: 'Órdenes Pendientes', valor: '23', color: 'orange', cambio: '-5.2% vs mes anterior', changeClass: 'negative' },
]

const meses = [
  { nombre: 'Ene', completadas: 65, pendientes: 12 },
  { nombre: 'Feb', completadas: 78, pendientes: 8  },
  { nombre: 'Mar', completadas: 52, pendientes: 15 },
  { nombre: 'Abr', completadas: 91, pendientes: 6  },
  { nombre: 'May', completadas: 83, pendientes: 10 },
  { nombre: 'Jun', completadas: 70, pendientes: 18 },
]

const reportes = [
  { icono: '📊', titulo: 'Reporte de Ventas Mensual', meta: 'Febrero 2024 • Generado hace 2 horas' },
  { icono: '📦', titulo: 'Reporte de Inventario', meta: 'Actualizado hoy • Stock actual' },
  { icono: '⚙️', titulo: 'Reporte de Producción', meta: 'Semana 8, 2024 • 342 órdenes' },
  { icono: '👥', titulo: 'Reporte de Clientes', meta: 'Febrero 2024 • 2 clientes activos' },
]
</script>

<style scoped>
.layout { display: flex; min-height: 100vh; }
.main-content { flex: 1; padding: 40px 50px; background: #f3f4f6; }
.page-title { font-size: 28px; font-weight: 600; margin-bottom: 30px; }
.stats-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 35px; }
.card { background: #fff; padding: 22px; border-radius: 16px; border: 1px solid #e5e7eb; }
.card-header { font-size: 14px; font-weight: 500; margin-bottom: 14px; }
.card-value { font-size: 30px; font-weight: 600; margin-bottom: 6px; }
.card-change { font-size: 13px; font-weight: 500; }
.positive { color: #16a34a; } .negative { color: #f97316; }
.blue { color: #2563eb; } .green { color: #16a34a; } .purple { color: #7c3aed; } .orange { color: #f97316; }
.panel { background: #fff; padding: 28px; border-radius: 16px; border: 1px solid #e5e7eb; margin-bottom: 35px; }
.panel h2 { font-size: 18px; font-weight: 600; margin-bottom: 25px; }
.chart { display: flex; align-items: flex-end; justify-content: space-between; height: 260px; margin-bottom: 20px; }
.bar-group { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.bar-wrapper { display: flex; align-items: flex-end; }
.bar { width: 75px; background: #1f3a52; border-radius: 8px 8px 0 0; position: relative; display: flex; align-items: flex-end; }
.bar-pending { width: 100%; background: #f97316; }
.month { font-weight: 500; margin-top: 6px; font-size: 13px; }
.details { font-size: 13px; font-weight: 500; display: flex; gap: 6px; }
.blue-text { color: #1f3a52; } .orange-text { color: #f97316; }
.legend { display: flex; gap: 20px; font-size: 13px; margin-top: 10px; }
.legend-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 6px; }
.legend-dot.blue { background: #1f3a52; } .legend-dot.orange { background: #f97316; }
.reports-container { display: flex; flex-direction: column; }
.report-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; margin-bottom: 12px; background-color: #f9f9f9; border-radius: 8px; }
.report-left { display: flex; align-items: center; gap: 12px; }
.report-icon { font-size: 24px; }
.report-title { font-weight: 600; font-size: 16px; margin-bottom: 4px; }
.report-meta { font-size: 13px; color: #666; }
.report-right { display: flex; align-items: center; gap: 8px; }
.status { background: #dcfce7; color: #16a34a; font-size: 12px; padding: 6px 12px; border-radius: 20px; font-weight: 500; }
.btn { background: #1f3a52; color: white; border: none; padding: 9px 16px; border-radius: 8px; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 6px; }
.btn-outline { background: white; border: 1px solid #d1d5db; color: #374151; padding: 9px 16px; border-radius: 8px; font-size: 13px; cursor: pointer; }
.size-6 { width: 18px; height: 18px; }
</style>
