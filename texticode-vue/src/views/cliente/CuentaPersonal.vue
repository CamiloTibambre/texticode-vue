<template>
  <div style="display:flex;min-height:100vh;background:#f3f4f6">
    <AppSidebar rol="cliente" />
 
    <main class="main">
      <div class="title">Cuenta Personal</div>
 
      <!-- CARGANDO -->
      <div v-if="cargando" class="loading-wrap">
        <div class="spinner"></div>
        <p class="loading-text">Cargando perfil...</p>
      </div>
 
      <!-- ERROR -->
      <div v-else-if="error" class="error-banner">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/>
        </svg>
        {{ error }}
        <button class="btn-retry" @click="cargarDatos">Reintentar</button>
      </div>
 
      <template v-else>
        <!-- SIN SESIÓN REAL (login demo) -->
        <div v-if="!auth.idUsuario" class="empty-session">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke-width="1.2" stroke="#d1d5db">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>
          </svg>
          <p class="empty-title">Ingresa con tu cuenta</p>
          <p class="empty-sub">Inicia sesión con tus credenciales reales para ver tu perfil y pedidos.</p>
        </div>
 
        <!-- CON SESIÓN REAL — datos de la BD -->
        <template v-else>
        <!-- BANNER -->
        <div class="profile-banner">
          <div class="avatar-initials">{{ iniciales }}</div>
          <div class="profile-info">
            <div class="profile-name">{{ perfil.Nombre_Completo }}</div>
            <div class="profile-role">Cliente Texticode</div>
            <span class="badge-active" :class="perfil.Estado === 'activo' ? 'badge-green' : 'badge-red'">
              {{ perfil.Estado === 'activo' ? 'Activo' : 'Inactivo' }}
            </span>
          </div>
          <button class="btn-edit" @click="abrirModal">Editar Perfil</button>
        </div>
 
        <div class="card">
          <div class="card-header">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0"/>
            </svg>
            Información de Contacto
          </div>
          <div class="contact-grid">
            <div class="contact-item">
              <div class="contact-label">Email</div>
              <div class="contact-value">{{ perfil.Correo || '—' }}</div>
            </div>
            <div class="contact-item">
              <div class="contact-label">Teléfono</div>
              <div class="contact-value">{{ perfil.Telefono || '—' }}</div>
            </div>
            <div class="contact-item">
              <div class="contact-label">Usuario</div>
              <div class="contact-value">{{ perfil.Nombre_Usuario || '—' }}</div>
            </div>
            <div class="contact-item">
              <div class="contact-label">Dirección</div>
              <div class="contact-value">{{ perfil.Direccion || '—' }}</div>
            </div>
          </div>
        </div>

        <div class="card stats-row">
          <div class="stat-box">
            <div class="stat-number">{{ pedidos.length }}</div>
            <div class="stat-label">Pedidos totales</div>
          </div>
          <div class="stat-box">
            <div class="stat-number">{{ pedidosEnProceso }}</div>
            <div class="stat-label">En proceso</div>
          </div>
          <div class="stat-box">
            <div class="stat-number">{{ pedidosCompletados }}</div>
            <div class="stat-label">Completados</div>
          </div>
        </div>

        <section class="pedidos-section">
          <div class="card-header pedidos-header">
            <span>Mis pedidos</span>
            <span class="pedido-total">{{ pedidos.length }}</span>
          </div>
          <div v-if="cargandoPedidos" class="loading-inline">Cargando pedidos...</div>
 
          <div v-else-if="pedidos.length === 0" class="empty-card">
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke-width="1.2" stroke="#d1d5db">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/>
            </svg>
            <p>No tienes pedidos registrados aún.</p>
          </div>
 
          <div v-else>
            <div v-for="p in pedidos" :key="p.Id_Orden" class="pedido-card">
              <div class="pedido-header">
                <span class="pedido-num">Orden #{{ p.Id_Orden }}</span>
                <span class="badge-pedido" :class="estadoClass(p.Estado)">{{ p.Estado }}</span>
              </div>
              <div class="pedido-nombre">{{ p.Descripcion }}</div>
              <div class="pedido-meta">
                <div class="pedido-meta-item">
                  <span class="pedido-meta-label">Cantidad</span>
                  <span class="pedido-meta-value">{{ p.Cantidad }} uds.</span>
                </div>
                <div class="pedido-meta-item">
                  <span class="pedido-meta-label">Prioridad</span>
                  <span class="pedido-meta-value">{{ p.Prioridad }}</span>
                </div>
                <div class="pedido-meta-item">
                  <span class="pedido-meta-label">Fecha límite</span>
                  <span class="pedido-meta-value">{{ formatFecha(p.Fecha_Limite) }}</span>
                </div>
              </div>
              <!-- Barra de progreso visual según estado -->
              <div class="progreso-wrap">
                <div class="progreso-bar">
                  <div class="progreso-fill" :class="'fill-' + estadoClass(p.Estado)" :style="{ width: progresoEstado(p.Estado) + '%' }"></div>
                </div>
                <span class="progreso-pct">{{ progresoEstado(p.Estado) }}%</span>
              </div>
            </div>
          </div>
        </section>
        </template><!-- fin v-else sesión real -->
      </template>
    </main>
 
    <!-- MODAL EDITAR PERFIL -->
    <div v-if="modalVisible" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">Editar Perfil</h3>
          <button class="modal-close" @click="cerrarModal">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
 
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Nombre Completo</label>
            <input v-model="formEdicion.Nombre_Completo" type="text" class="form-input">
          </div>
          <div class="form-group">
            <label class="form-label">Correo Electrónico</label>
            <input v-model="formEdicion.Correo" type="email" class="form-input">
          </div>
          <div class="form-group">
            <label class="form-label">Teléfono</label>
            <input v-model="formEdicion.Telefono" type="tel" class="form-input">
          </div>
          <div class="form-group">
            <label class="form-label">Dirección</label>
            <input v-model="formEdicion.Direccion" type="text" class="form-input">
          </div>
        </div>
 
        <div v-if="errorGuardar" class="error-inline">{{ errorGuardar }}</div>
 
        <div class="modal-footer">
          <button class="btn-cancelar" @click="cerrarModal">Cancelar</button>
          <button class="btn-guardar" :disabled="guardando" @click="guardarCambios">
            {{ guardando ? 'Guardando...' : 'Guardar Cambios' }}
          </button>
        </div>
      </div>
    </div>
 
    <!-- TOAST -->
    <Transition name="toast">
      <div v-if="toast.visible" class="toast" :class="'toast-' + toast.type">{{ toast.msg }}</div>
    </Transition>
  </div>
</template>
 
<script setup>
import { ref, computed, onMounted } from 'vue'
import AppSidebar from '../../components/AppSidebar.vue'
import { useAuthStore } from '../../stores/auth'
import { getUsuario, actualizarUsuario, getOrdenesDeCliente } from '../../services/api'
 
const auth = useAuthStore()
 
// ── ESTADO ────────────────────────────────────────────────────
const cargando        = ref(true)
const cargandoPedidos = ref(false)
const error           = ref('')
const errorGuardar    = ref('')
const guardando       = ref(false)
const modalVisible    = ref(false)
const toast           = ref({ visible: false, msg: '', type: 'success' })

const perfil      = ref({})
const pedidos     = ref([])
const formEdicion = ref({})
 
// ── COMPUTED ──────────────────────────────────────────────────
const iniciales = computed(() =>
  (perfil.value.Nombre_Completo || '')
    .split(' ')
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
)
 
const pedidosEnProceso  = computed(() => pedidos.value.filter(p => p.Estado === 'En Proceso').length)
const pedidosCompletados = computed(() => pedidos.value.filter(p => p.Estado === 'Completada').length)
 
// ── CARGA DE DATOS ────────────────────────────────────────────
async function cargarDatos() {
  cargando.value = true
  error.value    = ''
 
  try {
    // Sin Id_Usuario real (login demo) → no llamamos a la API
    if (!auth.idUsuario) {
      perfil.value  = {}
      pedidos.value = []
      return
    }
 
    perfil.value = await getUsuario(auth.idUsuario)

    cargandoPedidos.value = true
    try {
      const data = await getOrdenesDeCliente(auth.idUsuario)
      pedidos.value = Array.isArray(data) ? data : []
    } catch {
      pedidos.value = []
    } finally {
      cargandoPedidos.value = false
    }
 
  } catch (e) {
    error.value = e.message || 'Error al cargar el perfil.'
  } finally {
    cargando.value = false
  }
}
 
onMounted(cargarDatos)
 
// ── HELPERS ───────────────────────────────────────────────────
function formatFecha(fecha) {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })
}
 
function estadoClass(estado) {
  return {
    'En Proceso': 'en-proceso',
    'Completada': 'completada',
    'Cancelada':  'cancelada',
  }[estado] || 'en-proceso'
}
 
function progresoEstado(estado) {
  return { 'En Proceso': 50, 'Completada': 100, 'Cancelada': 0 }[estado] ?? 0
}
 
// ── MODAL ─────────────────────────────────────────────────────
function abrirModal() {
  formEdicion.value  = { ...perfil.value }
  errorGuardar.value = ''
  modalVisible.value = true
}
 
function cerrarModal() {
  modalVisible.value = false
  errorGuardar.value = ''
}
 
async function guardarCambios() {
  if (!formEdicion.value.Nombre_Completo?.trim() || !formEdicion.value.Correo?.trim()) {
    errorGuardar.value = 'Nombre y correo son obligatorios.'
    return
  }
 
  guardando.value    = true
  errorGuardar.value = ''
 
  try {
    const payload = {
      Nombre_Completo: formEdicion.value.Nombre_Completo,
      Correo:          formEdicion.value.Correo,
      Telefono:        formEdicion.value.Telefono  || null,
      Direccion:       formEdicion.value.Direccion || null,
    }
 
    await actualizarUsuario(auth.idUsuario, payload)
 
    perfil.value = { ...perfil.value, ...payload }
    if (auth.usuario) auth.usuario.Nombre_Completo = formEdicion.value.Nombre_Completo
 
    cerrarModal()
    mostrarToast('Perfil actualizado correctamente', 'success')
  } catch (e) {
    errorGuardar.value = e.message || 'Error al guardar los cambios.'
  } finally {
    guardando.value = false
  }
}
 
// ── TOAST ─────────────────────────────────────────────────────
function mostrarToast(msg, type = 'success') {
  toast.value = { visible: true, msg, type }
  setTimeout(() => { toast.value.visible = false }, 2800)
}
</script>
 
<style scoped>
.main { flex: 1; padding: 28px 30px; overflow-y: auto; }
.title { font-size: 20px; font-weight: 600; margin-bottom: 20px; color: #111827; }
 
/* LOADING / ERROR */
.loading-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 0; gap: 16px; }
.spinner { width: 36px; height: 36px; border: 3px solid #e5e7eb; border-top-color: #1f3a52; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.loading-text  { color: #6b7280; font-size: 14px; }
.loading-inline { color: #9ca3af; font-size: 13px; padding: 16px 0; }
.error-banner { display: flex; align-items: center; gap: 10px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 14px 18px; color: #991b1b; font-size: 14px; margin-bottom: 20px; }
.btn-retry { margin-left: auto; background: #991b1b; color: white; border: none; border-radius: 6px; padding: 5px 12px; font-size: 13px; cursor: pointer; }
.error-inline { color: #dc2626; font-size: 13px; padding: 6px 4px; }
 
/* BANNER */
.profile-banner { background: #1f3a52; border-radius: 14px; padding: 26px 28px; display: flex; align-items: center; gap: 20px; margin-bottom: 18px; }
.avatar-initials { width: 64px; height: 64px; border-radius: 50%; background: #2d5f8a; color: white; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 600; flex-shrink: 0; }
.profile-info { flex: 1; }
.profile-name { font-size: 18px; font-weight: 600; color: white; }
.profile-role { font-size: 13px; color: #93c5fd; margin: 2px 0 8px; }
.badge-active { display: inline-block; font-size: 11px; font-weight: 600; padding: 2px 10px; border-radius: 20px; }
.badge-green { background: #dcfce7; color: #166534; }
.badge-red   { background: #fee2e2; color: #991b1b; }
.btn-edit { background: white; color: #1f3a52; border: none; border-radius: 8px; padding: 8px 18px; font-size: 13px; font-weight: 600; cursor: pointer; }
.btn-edit:hover { background: #f1f5f9; }
 
/* CARDS */
.card { background: white; border-radius: 12px; padding: 20px 24px; margin-bottom: 16px; border: 1px solid #e5e7eb; }
.card-header { font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
.pedidos-section { margin-top: 8px; }
.pedidos-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.pedido-total { background: #1f3a52; color: white; font-size: 11px; font-weight: 700; border-radius: 999px; padding: 4px 10px; }
 
/* CONTACTO */
.contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.contact-label { font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
.contact-value { font-size: 14px; color: #111827; }
 
/* STATS */
.stats-row { display: flex; }
.stat-box { flex: 1; text-align: center; padding: 8px 0; border-right: 1px solid #f3f4f6; }
.stat-box:last-child { border-right: none; }
.stat-number { font-size: 30px; font-weight: 700; color: #1f3a52; }
.stat-label  { font-size: 12px; color: #6b7280; margin-top: 4px; }
 
/* PEDIDOS */
.pedido-card { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px 22px; margin-bottom: 14px; }
.pedido-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.pedido-num { font-size: 13px; font-weight: 700; color: #374151; }
.badge-pedido { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; }
.badge-pedido.en-proceso { background: #dbeafe; color: #1e40af; }
.badge-pedido.completada { background: #dcfce7; color: #166534; }
.badge-pedido.cancelada  { background: #fee2e2; color: #991b1b; }
.pedido-nombre { font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 12px; }
.pedido-meta { display: flex; gap: 24px; margin-bottom: 14px; }
.pedido-meta-item { display: flex; flex-direction: column; gap: 2px; }
.pedido-meta-label { font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.4px; }
.pedido-meta-value { font-size: 13px; color: #374151; font-weight: 500; }
.progreso-wrap { display: flex; align-items: center; gap: 10px; }
.progreso-bar  { flex: 1; height: 6px; background: #f3f4f6; border-radius: 99px; overflow: hidden; }
.progreso-fill { height: 100%; border-radius: 99px; transition: width 0.6s ease; }
.fill-en-proceso { background: #3b82f6; }
.fill-completada { background: #22c55e; }
.fill-cancelada  { background: #e5e7eb; }
.progreso-pct { font-size: 12px; font-weight: 600; color: #6b7280; min-width: 34px; text-align: right; }
 
/* EMPTY */
.empty-card { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 48px 24px; text-align: center; color: #9ca3af; font-size: 14px; display: flex; flex-direction: column; align-items: center; gap: 12px; }
 
/* MODAL */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 100; }
.modal-container { background: white; border-radius: 16px; width: 460px; max-width: 95vw; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px 0; }
.modal-title { font-size: 17px; font-weight: 600; color: #111827; }
.modal-close { background: none; border: none; cursor: pointer; color: #6b7280; padding: 4px; border-radius: 6px; }
.modal-close:hover { background: #f3f4f6; }
.modal-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 14px; }
.form-group { display: flex; flex-direction: column; gap: 5px; }
.form-label { font-size: 12px; font-weight: 600; color: #374151; }
.form-input { border: 1px solid #e5e7eb; border-radius: 8px; padding: 9px 12px; font-size: 14px; color: #111827; outline: none; transition: border-color 0.2s; }
.form-input:focus { border-color: #1f3a52; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px 20px; border-top: 1px solid #f3f4f6; }
.btn-cancelar { background: white; color: #374151; border: 1px solid #e5e7eb; border-radius: 8px; padding: 9px 18px; font-size: 13px; cursor: pointer; }
.btn-guardar  { background: #1f3a52; color: white; border: none; border-radius: 8px; padding: 9px 20px; font-size: 13px; font-weight: 600; cursor: pointer; }
.btn-guardar:disabled { opacity: 0.6; cursor: not-allowed; }
 
/* EMPTY SESSION */
.empty-session { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 24px; gap: 12px; text-align: center; }
.empty-title { font-size: 16px; font-weight: 600; color: #374151; }
.empty-sub   { font-size: 13px; color: #9ca3af; max-width: 320px; line-height: 1.6; }
 
/* TOAST */
.toast { position: fixed; bottom: 24px; right: 24px; padding: 12px 20px; border-radius: 10px; font-size: 13px; font-weight: 500; z-index: 200; }
.toast-success { background: #166534; color: white; }
.toast-danger  { background: #991b1b; color: white; }
.toast-enter-active, .toast-leave-active { transition: opacity 0.3s, transform 0.3s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(8px); }
</style>
