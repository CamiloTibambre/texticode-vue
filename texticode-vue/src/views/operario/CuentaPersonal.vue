<template>
  <div style="display:flex;min-height:100vh;background:#f3f4f6">
    <AppSidebar rol="operario" />

    <main class="main">
      <div class="title">Cuenta Personal</div>

      <!-- BANNER -->
      <div class="profile-banner">
        <div class="profile-avatar-wrap">
          <div v-if="!fotoUrl" class="avatar-initials">{{ iniciales }}</div>
          <img v-else :src="fotoUrl" class="avatar-img" alt="Foto perfil">
        </div>
        <div class="profile-info">
          <div class="profile-name">{{ perfil.nombre }}</div>
          <div class="profile-role">{{ perfil.especialidad }}</div>
          <span class="badge-active">Activo</span>
        </div>
        <button class="btn-edit" @click="abrirModal">Editar Perfil</button>
      </div>

      <!-- CONTACTO -->
      <div class="card">
        <div class="activity-title">Información de Contacto</div>
        <div class="contact-grid">
          <div class="contact-item">
            <div class="contact-label">Email</div>
            <div class="contact-value">{{ perfil.email }}</div>
          </div>
          <div class="contact-item">
            <div class="contact-label">Teléfono</div>
            <div class="contact-value">{{ perfil.telefono }}</div>
          </div>
          <div class="contact-item">
            <div class="contact-label">Dirección</div>
            <div class="contact-value">{{ perfil.direccion }}</div>
          </div>
        </div>
      </div>

      <!-- TAREAS COMPLETADAS -->
      <div class="card">
        <div class="activity-title">Tareas Completadas</div>
        <div class="tasks-number">156</div>
        <div class="tasks-label">Total hasta hoy</div>
      </div>

      <!-- ACTIVIDAD RECIENTE -->
      <div class="card">
        <div class="activity-title">Actividad Reciente</div>
        <div class="activity-list">
          <div v-for="a in actividades" :key="a.id" class="activity-item">
            <div class="activity-dot" :class="a.color"></div>
            <div>
              <div class="activity-name">{{ a.titulo }}</div>
              <div class="activity-sub">{{ a.subtitulo }}</div>
              <div class="activity-sub">{{ a.tiempo }}</div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- MODAL EDITAR PERFIL -->
    <div v-if="modalVisible" class="modal-overlay active" @click.self="cerrarModal">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">Editar Perfil</h3>
          <button class="modal-close" @click="cerrarModal">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Foto -->
        <div class="modal-foto-wrap">
          <div class="modal-avatar">
            <span v-if="!fotoPreview">{{ iniciales }}</span>
            <img v-else :src="fotoPreview" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%">
          </div>
          <div class="modal-foto-btns">
            <input type="file" ref="inputFoto" accept="image/*" style="display:none" @change="previsualizarFoto">
            <button class="btn-subir-foto" @click="$refs.inputFoto.click()">Subir Foto</button>
            <button class="btn-remover-foto" @click="removerFoto">Remover</button>
          </div>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Nombre Completo</label>
            <input v-model="formEdicion.nombre" type="text" class="form-input">
          </div>
          <div class="form-group">
            <label class="form-label">Correo Electrónico</label>
            <input v-model="formEdicion.email" type="email" class="form-input">
          </div>
          <div class="form-group">
            <label class="form-label">Teléfono</label>
            <input v-model="formEdicion.telefono" type="tel" class="form-input">
          </div>
          <div class="form-group">
            <label class="form-label">Dirección</label>
            <input v-model="formEdicion.direccion" type="text" class="form-input">
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-cancelar" @click="cerrarModal">Cancelar</button>
          <button class="btn-guardar" @click="guardarCambios">Guardar Cambios</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppSidebar from '../../components/AppSidebar.vue'

const modalVisible = ref(false)
const fotoUrl      = ref(null)
const fotoPreview  = ref(null)
const inputFoto    = ref(null)

const perfil = ref({
  nombre:      'Carlos Mendoza',
  especialidad:'Confección de Camisas',
  email:       'carlos.mendoza@texticode.com',
  telefono:    '+57 300 123 4567',
  direccion:   'Calle 45 #12-34, Medellín, Colombia',
})

const formEdicion = ref({ ...perfil.value })

const iniciales = computed(() =>
  perfil.value.nombre.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
)

const actividades = [
  { id: 1, titulo: 'Tarea completada',         subtitulo: 'Orden #001 - Camisas polo azules',   tiempo: 'Hace 2 horas', color: 'dot-green' },
  { id: 2, titulo: 'Nueva tarea asignada',     subtitulo: 'Orden #002 - Camisetas estampadas',  tiempo: 'Hace 4 horas', color: 'dot-blue' },
  { id: 3, titulo: 'Actualización de progreso',subtitulo: 'Orden #003 - 75% Completado',        tiempo: 'Hace 6 horas', color: 'dot-yellow' },
]

function abrirModal() {
  formEdicion.value = { ...perfil.value }
  fotoPreview.value = fotoUrl.value
  modalVisible.value = true
}

function cerrarModal() { modalVisible.value = false }

function previsualizarFoto(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => { fotoPreview.value = ev.target.result }
  reader.readAsDataURL(file)
}

function removerFoto() {
  fotoPreview.value = null
  if (inputFoto.value) inputFoto.value.value = ''
}

function guardarCambios() {
  if (!formEdicion.value.nombre || !formEdicion.value.email) return
  perfil.value = { ...formEdicion.value }
  fotoUrl.value = fotoPreview.value
  cerrarModal()
}
</script>

<style scoped>
.main { flex: 1; padding: 28px 30px; overflow-y: auto; }
.title { font-size: 20px; font-weight: 600; margin-bottom: 20px; color: #111827; }
.profile-banner { background: #1f3a52; border-radius: 14px; padding: 24px 28px; display: flex; align-items: center; gap: 18px; margin-bottom: 20px; }
.profile-avatar-wrap { flex-shrink: 0; }
.avatar-initials { width: 72px; height: 72px; border-radius: 50%; background: #3a5a74; border: 3px solid rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 700; color: white; }
.avatar-img { width: 72px; height: 72px; border-radius: 50%; border: 3px solid rgba(255,255,255,0.3); object-fit: cover; }
.profile-name { font-size: 22px; font-weight: 700; color: white; margin-bottom: 4px; }
.profile-role { font-size: 14px; color: #a8bfcc; margin-bottom: 8px; }
.badge-active { display: inline-block; background: #16a34a; color: white; font-size: 11px; font-weight: 600; padding: 3px 12px; border-radius: 999px; }
.btn-edit { background: white; color: #1f3a52; border: none; padding: 10px 18px; border-radius: 8px; font-size: 14px; cursor: pointer; margin-left: auto; }
.card { background: white; border: 1px solid #e5e7eb; border-radius: 14px; padding: 24px 28px; margin-bottom: 20px; }
.activity-title { font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 14px; }
.contact-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
.contact-label { font-size: 11px; color: #9ca3af; margin-bottom: 2px; }
.contact-value { font-size: 14px; color: #111827; font-weight: 500; }
.tasks-number { font-size: 32px; font-weight: 700; color: #2563eb; margin-bottom: 4px; }
.tasks-label { font-size: 13px; color: #6b7280; }
.activity-list { display: flex; flex-direction: column; gap: 10px; }
.activity-item { border: 2px solid #e5e7eb; border-radius: 10px; padding: 14px 16px; display: flex; align-items: flex-start; gap: 12px; }
.activity-dot { width: 10px; height: 10px; border-radius: 50%; margin-top: 4px; flex-shrink: 0; }
.dot-green { background: #16a34a; } .dot-blue { background: #2563eb; } .dot-yellow { background: #d97706; }
.activity-name { font-size: 14px; font-weight: 500; margin-bottom: 2px; }
.activity-sub { font-size: 12px; color: #6b7280; }
.modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.45); backdrop-filter: blur(2px); z-index: 1000; align-items: center; justify-content: center; }
.modal-overlay.active { display: flex; }
.modal-container { background: white; border-radius: 16px; width: 520px; max-width: 95vw; max-height: 92vh; overflow-y: auto; box-shadow: 0 24px 60px rgba(0,0,0,0.18); }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px 16px; border-bottom: 1px solid #e5e7eb; }
.modal-title { font-size: 17px; font-weight: 700; color: #111827; }
.modal-close { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px; border: none; background: none; color: #9ca3af; cursor: pointer; }
.modal-foto-wrap { display: flex; flex-direction: column; align-items: center; padding: 24px 24px 8px; gap: 14px; }
.modal-avatar { width: 90px; height: 90px; border-radius: 50%; background: #3a5a74; display: flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 700; color: white; overflow: hidden; }
.modal-foto-btns { display: flex; gap: 10px; }
.btn-subir-foto, .btn-remover-foto { padding: 8px 16px; border-radius: 8px; border: 1px solid #d1d5db; background: white; font-size: 13px; cursor: pointer; }
.modal-body { padding: 16px 24px 8px; display: flex; flex-direction: column; gap: 14px; }
.form-group { display: flex; flex-direction: column; gap: 5px; }
.form-label { font-size: 13px; font-weight: 600; color: #111827; }
.form-input { border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 14px; font-size: 14px; outline: none; background: #f9fafb; width: 100%; font-family: inherit; }
.form-input:focus { border-color: #1f3a52; background: white; }
.modal-footer { display: flex; align-items: center; justify-content: flex-end; gap: 10px; padding: 16px 24px 22px; }
.btn-cancelar { padding: 10px 20px; border-radius: 8px; border: 1px solid #d1d5db; background: white; font-size: 14px; cursor: pointer; }
.btn-guardar { padding: 10px 22px; border-radius: 8px; border: none; background: #1f3a52; font-size: 14px; font-weight: 600; color: white; cursor: pointer; }
</style>
