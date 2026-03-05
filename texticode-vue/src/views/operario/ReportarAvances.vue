<template>
  <div style="display:flex;min-height:100vh;background:#f3f4f6">
    <AppSidebar rol="operario" />

    <main class="main">
      <div class="title">Reportar Avances</div>

      <!-- TABS -->
      <div class="tabs-wrapper">
        <button class="tab-btn" :class="{ active: tabActivo === 'activas' }" @click="tabActivo = 'activas'">Órdenes Activas</button>
        <button class="tab-btn" :class="{ active: tabActivo === 'historial' }" @click="tabActivo = 'historial'">Historial</button>
      </div>

      <!-- ÓRDENES ACTIVAS -->
      <div v-if="tabActivo === 'activas'" class="tab-content">
        <div v-for="o in ordenesActivas" :key="o.id" class="order-card" :class="{ 'card-completada': o.estado === 'completado', 'card-pausada': o.estado === 'pausado' }">
          <div class="card-top">
            <div class="card-icon">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            </div>
            <div class="card-info">
              <div class="card-orden">{{ o.id }}</div>
              <div class="card-nombre">{{ o.nombre }}</div>
            </div>
            <span class="badge-estado" :class="o.estado">{{ o.estadoLabel }}</span>
          </div>

          <div class="card-progreso-row">
            <span class="card-progreso-label">Progreso actual</span>
            <span class="card-progreso-pct">{{ o.progreso }}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: o.progreso + '%' }"></div>
          </div>

          <div class="card-meta">
            <div class="meta-item">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z"/></svg>
              <div><span class="meta-label">Unidades</span><span class="meta-value">{{ o.unidadesHechas }} / {{ o.unidadesTotales }}</span></div>
            </div>
            <div class="meta-item">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg>
              <div><span class="meta-label">Fecha Límite</span><span class="meta-value">{{ o.fechaLimite }}</span></div>
            </div>
          </div>

          <div class="card-actions">
            <button class="btn-reportar-progreso" :disabled="o.estado === 'completado'" @click="abrirModal(o)">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
              Reportar Progreso
            </button>
            <button class="btn-pausar" :disabled="o.estado === 'completado'" @click="togglePausa(o)">
              {{ o.estado === 'pausado' ? '▶ Reanudar' : '⏸ Pausar' }}
            </button>
          </div>
        </div>
      </div>

      <!-- HISTORIAL -->
      <div v-if="tabActivo === 'historial'" class="tab-content">
        <div v-if="historial.length === 0" class="historial-empty">No hay reportes en el historial aún.</div>
        <div v-for="h in historial" :key="h.id" class="historial-card">
          <div class="hist-header">
            <div>
              <div class="hist-orden">{{ h.orden }}</div>
              <div class="hist-unidades">+{{ h.nuevas }} unidades nuevas</div>
            </div>
            <div>
              <div class="hist-pct">{{ h.progreso }}%</div>
              <div class="hist-fecha">{{ h.fecha }}</div>
            </div>
          </div>
          <div v-if="h.nota" class="desc-block"><span class="desc-label">Nota:</span><span class="desc-text">{{ h.nota }}</span></div>
        </div>
      </div>
    </main>

    <!-- MODAL REPORTAR PROGRESO -->
    <div v-if="modalVisible" class="modal-overlay visible" @click.self="cerrarModal">
      <div class="modal">
        <div class="modal-header">
          <div><div class="modal-title">Reportar Progreso</div><div class="modal-subtitle">{{ ordenActual?.id }} — {{ ordenActual?.nombre }}</div></div>
          <button class="modal-close" @click="cerrarModal">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Unidades completadas en esta sesión <span class="req">*</span></label>
            <input v-model.number="reporte.nuevas" type="number" min="1" class="form-input" placeholder="Ej: 10">
          </div>
          <div class="form-group">
            <label class="form-label">Nota <span class="opt">(opcional)</span></label>
            <textarea v-model="reporte.nota" class="form-textarea" rows="3" placeholder="Describe el avance..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancelar" @click="cerrarModal">Cancelar</button>
          <button class="btn-enviar" @click="enviarReporte">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/></svg>
            Enviar Reporte
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppSidebar from '../../components/AppSidebar.vue'

const tabActivo    = ref('activas')
const modalVisible = ref(false)
const ordenActual  = ref(null)
const reporte      = ref({ nuevas: 0, nota: '' })

const estadoLabels = { 'proceso': 'En Proceso', 'pausado': 'Pausado', 'completado': 'Completado' }

const ordenesActivas = ref([
  { id: 'Orden #001', nombre: 'Camisas Polo Azules x 50', progreso: 75, unidadesHechas: 37, unidadesTotales: 50, fechaLimite: '2024-03-15', estado: 'proceso' },
  { id: 'Orden #002', nombre: 'Camisetas Estampadas x 30', progreso: 20, unidadesHechas: 6,  unidadesTotales: 30, fechaLimite: '2024-03-20', estado: 'proceso' },
].map(o => ({ ...o, estadoLabel: estadoLabels[o.estado] || 'En Proceso' })))

const historial = ref([])

function abrirModal(o) {
  ordenActual.value  = o
  reporte.value      = { nuevas: 0, nota: '' }
  modalVisible.value = true
}

function cerrarModal() { modalVisible.value = false }

function enviarReporte() {
  if (!reporte.value.nuevas || reporte.value.nuevas <= 0) return
  const o   = ordenesActivas.value.find(x => x.id === ordenActual.value.id)
  if (!o) return
  o.unidadesHechas = Math.min(o.unidadesHechas + reporte.value.nuevas, o.unidadesTotales)
  o.progreso = Math.round((o.unidadesHechas / o.unidadesTotales) * 100)
  if (o.progreso >= 100) { o.estado = 'completado'; o.estadoLabel = 'Completado' }

  historial.value.unshift({
    id:       Date.now(),
    orden:    o.id,
    nuevas:   reporte.value.nuevas,
    progreso: o.progreso,
    nota:     reporte.value.nota,
    fecha:    new Date().toLocaleDateString('es-CO'),
  })
  cerrarModal()
}

function togglePausa(o) {
  if (o.estado === 'pausado') { o.estado = 'proceso'; o.estadoLabel = 'En Proceso' }
  else { o.estado = 'pausado'; o.estadoLabel = 'Pausado' }
}
</script>

<style scoped>
.main { flex: 1; padding: 28px 30px; overflow-y: auto; }
.title { font-size: 22px; font-weight: 700; margin-bottom: 20px; color: #111827; }
.tabs-wrapper { display: flex; background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 10px; padding: 4px; margin-bottom: 20px; gap: 4px; }
.tab-btn { flex: 1; padding: 10px; border: none; background: transparent; border-radius: 8px; font-size: 14px; font-weight: 500; color: #6b7280; cursor: pointer; }
.tab-btn.active { background: white; color: #111827; font-weight: 600; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
.tab-content { display: flex; flex-direction: column; gap: 16px; }
.order-card { background: white; border: 1px solid #e5e7eb; border-radius: 14px; padding: 20px 22px; }
.order-card.card-pausada { opacity: 0.6; }
.order-card.card-completada { border-color: #bbf7d0; background: #f0fdf4; }
.card-top { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
.card-icon { width: 46px; height: 46px; background: #f3f4f6; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.card-info { flex: 1; }
.card-orden { font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 2px; }
.card-nombre { font-size: 13px; color: #6b7280; }
.badge-estado { padding: 5px 14px; border-radius: 999px; font-size: 12px; font-weight: 700; }
.badge-estado.proceso    { background: #2563eb; color: white; }
.badge-estado.pausado    { background: #fef3c7; color: #b45309; }
.badge-estado.completado { background: #dcfce7; color: #15803d; }
.card-progreso-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
.card-progreso-label { font-size: 13px; color: #6b7280; }
.card-progreso-pct { font-size: 14px; font-weight: 700; }
.progress-bar { width: 100%; height: 8px; background: #e5e7eb; border-radius: 999px; overflow: hidden; margin-bottom: 16px; }
.progress-fill { height: 100%; background: #111827; border-radius: 999px; transition: width 0.4s ease; }
.order-card.card-completada .progress-fill { background: #16a34a; }
.card-meta { display: flex; gap: 40px; margin-bottom: 16px; }
.meta-item { display: flex; align-items: flex-start; gap: 7px; }
.meta-label { display: block; font-size: 11px; color: #9ca3af; margin-bottom: 2px; }
.meta-value { display: block; font-size: 14px; font-weight: 700; }
.card-actions { display: flex; gap: 10px; }
.btn-reportar-progreso { flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: #1f3a52; color: white; border: none; padding: 11px 20px; border-radius: 9px; font-size: 14px; font-weight: 600; cursor: pointer; }
.btn-reportar-progreso:disabled { background: #9ca3af; cursor: not-allowed; }
.btn-pausar { display: inline-flex; align-items: center; gap: 7px; background: white; color: #374151; border: 1px solid #e5e7eb; padding: 10px 16px; border-radius: 9px; font-size: 14px; cursor: pointer; }
.historial-empty { text-align: center; padding: 52px; background: white; border: 1px solid #e5e7eb; border-radius: 12px; color: #9ca3af; }
.historial-card { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 18px 20px; margin-bottom: 12px; }
.hist-header { display: flex; justify-content: space-between; margin-bottom: 4px; }
.hist-orden { font-size: 14px; font-weight: 600; }
.hist-unidades { font-size: 12px; color: #9ca3af; }
.hist-pct { font-size: 13px; font-weight: 700; }
.hist-fecha { font-size: 12px; color: #9ca3af; }
.desc-block { background: #f9fafb; border-radius: 8px; padding: 10px 14px; font-size: 13px; margin-top: 10px; }
.desc-label { font-weight: 600; color: #374151; margin-right: 5px; }
.modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 1000; align-items: center; justify-content: center; }
.modal-overlay.visible { display: flex; }
.modal { background: white; border-radius: 14px; width: 100%; max-width: 500px; margin: 0 16px; box-shadow: 0 24px 64px rgba(0,0,0,0.18); }
.modal-header { display: flex; justify-content: space-between; padding: 22px 24px 18px; border-bottom: 1px solid #f1f5f9; }
.modal-title { font-size: 17px; font-weight: 700; }
.modal-subtitle { font-size: 13px; color: #6b7280; }
.modal-close { background: none; border: none; color: #9ca3af; cursor: pointer; }
.modal-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 18px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: 13px; font-weight: 600; }
.req { color: #dc2626; } .opt { color: #9ca3af; font-weight: 400; font-size: 12px; }
.form-input { padding: 10px 14px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none; }
.form-textarea { padding: 10px 14px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none; resize: vertical; font-family: inherit; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px 22px; border-top: 1px solid #f1f5f9; }
.btn-cancelar { padding: 10px 20px; border: 1px solid #e5e7eb; background: white; border-radius: 8px; font-size: 14px; cursor: pointer; }
.btn-enviar { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; background: #1f3a52; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; }
</style>
