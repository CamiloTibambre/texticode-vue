<template>
  <div style="display:flex;min-height:100vh;background:#f3f4f6">
    <AppSidebar rol="cliente" />

    <main class="main">
      <div class="title">Cuenta Personal</div>

      <!-- BANNER -->
      <div class="profile-banner">
        <div class="avatar-initials">{{ iniciales }}</div>
        <div class="profile-info">
          <div class="profile-name">{{ perfil.nombre }}</div>
          <div class="profile-role">Cliente Texticode</div>
          <span class="badge-active">Activo</span>
        </div>
        <button class="btn-edit" @click="modalVisible = true">Editar Perfil</button>
      </div>

      <!-- TABS -->
      <div class="tabs-bar">
        <button v-for="tab in tabs" :key="tab.id" class="tab-btn" :class="{ active: tabActivo === tab.id }" @click="tabActivo = tab.id">{{ tab.label }}</button>
      </div>

      <!-- INFO PERSONAL -->
      <div v-if="tabActivo === 'info'" class="tab-content active">
        <div class="card">
          <div class="card-header">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0"/></svg>
            Información de Contacto
          </div>
          <div class="contact-grid">
            <div class="contact-item"><div class="contact-label">Email</div><div class="contact-value">{{ perfil.email }}</div></div>
            <div class="contact-item"><div class="contact-label">Teléfono</div><div class="contact-value">{{ perfil.telefono }}</div></div>
            <div class="contact-item"><div class="contact-label">Empresa</div><div class="contact-value">{{ perfil.empresa }}</div></div>
            <div class="contact-item"><div class="contact-label">Dirección</div><div class="contact-value">{{ perfil.direccion }}</div></div>
          </div>
        </div>
        <div class="card">
          <div class="card-header">Mis Pedidos</div>
          <div class="stat-mini-card">
            <div class="stat-number">{{ pedidos.length }}</div>
            <div class="stat-label">Pedidos totales</div>
          </div>
        </div>
      </div>

      <!-- MIS PEDIDOS -->
      <div v-if="tabActivo === 'pedidos'" class="tab-content active">
        <div v-for="p in pedidos" :key="p.id" class="pedido-card">
          <div class="pedido-header">
            <span class="pedido-num">{{ p.id }}</span>
            <span class="badge-pedido" :class="p.estadoClass">{{ p.estado }}</span>
          </div>
          <div class="pedido-nombre">{{ p.nombre }}</div>
          <div class="pedido-meta">
            <div class="pedido-meta-item"><span class="pedido-meta-label">Cantidad</span><span class="pedido-meta-value">{{ p.cantidad }}</span></div>
            <div class="pedido-meta-item"><span class="pedido-meta-label">Fecha Entrega</span><span class="pedido-meta-value">{{ p.fechaEntrega }}</span></div>
            <div class="pedido-meta-item"><span class="pedido-meta-label">Progreso</span><span class="pedido-meta-value">{{ p.progreso }}%</span></div>
          </div>
        </div>
      </div>
    </main>

    <!-- MODAL EDITAR -->
    <div v-if="modalVisible" class="modal-overlay active" @click.self="modalVisible = false">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">Editar Perfil</h3>
          <button class="modal-close" @click="modalVisible = false">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group"><label class="form-label">Nombre Completo</label><input v-model="perfil.nombre" type="text" class="form-input"></div>
          <div class="form-group"><label class="form-label">Correo Electrónico</label><input v-model="perfil.email" type="email" class="form-input"></div>
          <div class="form-group"><label class="form-label">Teléfono</label><input v-model="perfil.telefono" type="tel" class="form-input"></div>
          <div class="form-group"><label class="form-label">Empresa</label><input v-model="perfil.empresa" type="text" class="form-input"></div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancelar" @click="modalVisible = false">Cancelar</button>
          <button class="btn-guardar" @click="modalVisible = false">Guardar Cambios</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppSidebar from '../../components/AppSidebar.vue'

const tabActivo    = ref('info')
const modalVisible = ref(false)
const tabs = [{ id: 'info', label: 'Información' }, { id: 'pedidos', label: 'Mis Pedidos' }]

const perfil = ref({ nombre: 'María González', email: 'maria.gonzalez@empresa.com', telefono: '+57 300 987 6543', empresa: 'Empresa Textil S.A.', direccion: 'Calle 80 #45-20, Bogotá' })

const iniciales = computed(() => perfil.value.nombre.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase())

const pedidos = ref([
  { id: 'Orden #001', nombre: 'Camisetas Polo Azules', cantidad: '50 unidades', fechaEntrega: '2024-03-15', progreso: 75,  estado: 'En Proceso', estadoClass: 'en-proceso' },
  { id: 'Orden #002', nombre: 'Pantalones Denim',      cantidad: '30 unidades', fechaEntrega: '2024-03-20', progreso: 100, estado: 'Completado', estadoClass: 'completado' },
])
</script>

<style scoped>
.main { flex: 1; padding: 28px 30px; overflow-y: auto; }
.title { font-size: 18px; font-weight: 600; margin-bottom: 14px; }
.profile-banner { background: #1f3a52; border-radius: 14px; padding: 26px 28px; display: flex; align-items: center; gap: 20px; margin-bottom: 18px; }
.avatar-initials { width: 68px; height: 68px; border-radius: 50%; background: #4a6a84; border: 2px solid rgba(255,255,255,0.35); display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 700; color: white; flex-shrink: 0; }
.profile-info { flex: 1; }
.profile-name { font-size: 20px; font-weight: 700; color: white; margin-bottom: 4px; }
.profile-role { font-size: 14px; color: #a8bfcc; margin-bottom: 8px; }
.badge-active { display: inline-block; background: #16a34a; color: white; font-size: 11px; font-weight: 600; padding: 3px 12px; border-radius: 999px; }
.btn-edit { background: white; color: #1f3a52; border: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; margin-left: auto; }
.tabs-bar { display: flex; background: white; border: 1px solid #e5e7eb; border-radius: 10px; padding: 4px; margin-bottom: 20px; gap: 4px; }
.tab-btn { flex: 1; padding: 10px 16px; border: none; border-radius: 7px; background: transparent; font-size: 14px; font-weight: 500; color: #6b7280; cursor: pointer; }
.tab-btn.active { background: #1f3a52; color: white; }
.card { background: white; border: 1px solid #e5e7eb; border-radius: 14px; padding: 22px 26px; margin-bottom: 18px; }
.card-header { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; margin-bottom: 18px; }
.contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px 30px; }
.contact-label { font-size: 11px; color: #9ca3af; margin-bottom: 2px; }
.contact-value { font-size: 14px; font-weight: 500; }
.stat-number { font-size: 34px; font-weight: 700; color: #2563eb; }
.stat-label { font-size: 13px; color: #6b7280; }
.pedido-card { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px 24px; margin-bottom: 12px; }
.pedido-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.pedido-num { font-size: 13px; font-weight: 600; color: #6b7280; }
.badge-pedido { display: inline-block; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 999px; }
.badge-pedido.completado { background: #dcfce7; color: #15803d; }
.badge-pedido.en-proceso { background: #dbeafe; color: #1d4ed8; }
.pedido-nombre { font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 14px; }
.pedido-meta { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
.pedido-meta-label { font-size: 12px; color: #6b7280; }
.pedido-meta-value { font-size: 14px; font-weight: 600; }
.modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.45); backdrop-filter: blur(2px); z-index: 1000; align-items: center; justify-content: center; }
.modal-overlay.active { display: flex; }
.modal-container { background: white; border-radius: 16px; width: 520px; max-width: 95vw; overflow-y: auto; box-shadow: 0 24px 60px rgba(0,0,0,0.18); }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px 16px; border-bottom: 1px solid #e5e7eb; }
.modal-title { font-size: 17px; font-weight: 700; }
.modal-close { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: none; background: none; color: #9ca3af; cursor: pointer; }
.modal-body { padding: 16px 24px 8px; display: flex; flex-direction: column; gap: 14px; }
.form-group { display: flex; flex-direction: column; gap: 5px; }
.form-label { font-size: 13px; font-weight: 600; }
.form-input { border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 14px; font-size: 14px; outline: none; background: #f9fafb; width: 100%; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px 22px; }
.btn-cancelar { padding: 10px 20px; border-radius: 8px; border: 1px solid #d1d5db; background: white; cursor: pointer; }
.btn-guardar { padding: 10px 22px; border-radius: 8px; border: none; background: #1f3a52; font-size: 14px; font-weight: 600; color: white; cursor: pointer; }
</style>
