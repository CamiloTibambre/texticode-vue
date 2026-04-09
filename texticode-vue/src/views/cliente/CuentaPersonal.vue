<template>
  <div style="display:flex;min-height:100vh;background:#f1f5f9;position:relative;overflow:hidden">
    <AppSidebar rol="cliente" />

    <!-- FONDO DECORATIVO -->
    <div class="bg-orbs" aria-hidden="true">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
      <div class="bg-grid"></div>
    </div>

    <main class="main">

      <!-- HERO HEADER -->
      <div class="page-hero" :class="{ 'hero-visible': mounted }">
        <div class="hero-left">
          <div class="hero-icon-wrap">
            <svg class="hero-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>
            </svg>
            <div class="hero-icon-ring ring-1"></div>
            <div class="hero-icon-ring ring-2"></div>
          </div>
          <div class="hero-text">
            <h1 class="hero-title">
              <span
                v-for="(ch, i) in 'Cuenta Personal'"
                :key="i"
                class="title-char"
                :style="{ animationDelay: mounted ? `${i * 35}ms` : '9999s' }"
              >{{ ch === ' ' ? '\u00A0' : ch }}</span>
            </h1>
            <p class="hero-sub">Tu perfil y comprobantes de entrega</p>
          </div>
        </div>
        <button v-if="auth.idUsuario && !cargando && !error" class="btn-edit-hero" @click="abrirModal">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z"/>
          </svg>
          Editar Perfil
        </button>
      </div>

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

        <!-- SIN SESIÓN -->
        <div v-if="!auth.idUsuario" class="empty-session">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke-width="1.2" stroke="#d1d5db">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>
          </svg>
          <p class="empty-title">Ingresa con tu cuenta</p>
          <p class="empty-sub">Inicia sesión con tus credenciales reales para ver tu perfil y comprobantes.</p>
        </div>

        <!-- CON SESIÓN -->
        <template v-else>
          
            
          <!-- BANNER PERFIL -->
          <div class="profile-banner" :class="{ 'banner-in': mounted }">
            <div class="avatar-circle" :class="{ 'avatar-in': mounted }">{{ iniciales }}</div>
            <div class="profile-info">
              <div class="profile-name">{{ perfil.Nombre_Completo }}</div>
              <div class="profile-role">Cliente · Texticode</div>
              <span class="status-pill" :class="perfil.Estado === 'activo' ? 'status-active' : 'status-inactive'">
                <span class="status-dot"></span>
                {{ perfil.Estado === 'activo' ? 'Activo' : 'Inactivo' }}
              </span>
            </div>
          </div>
          

          <!-- STATS CARDS -->
          <div class="stats-grid" :class="{ 'stats-visible': mounted }">
            <div
              v-for="(s, i) in statsCards"
              :key="s.label"
              class="stat-card"
              :style="{ transitionDelay: mounted ? `${i * 80}ms` : '0ms' }"
            >
              <div class="stat-accent" :style="{ background: s.accent }"></div>
              <div class="stat-icon-bg" :style="{ color: s.accent }">
                <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" :d="s.icon"/>
                </svg>
              </div>
              <h3>{{ s.label }}</h3>
              <p :style="{ color: s.accent }">{{ s.display }}</p>
            </div>
          </div>

          <!-- CONTACTO -->
          <div class="table-box" :class="{ 'box-visible': mounted }" style="transition-delay: 160ms; padding: 20px 24px; margin-bottom: 20px;">
            <div class="table-header-bar" style="margin: -20px -24px 18px; border-radius: 14px 14px 0 0;">
              <div class="table-header-left">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0"/>
                </svg>
                Información de Contacto
              </div>
            </div>
            <div class="contact-grid">
              <div class="contact-item" v-for="(item, i) in contactItems" :key="item.label"
                :class="{ 'contact-reveal': mounted }"
                :style="{ animationDelay: mounted ? `${220 + i * 65}ms` : '0ms' }">
                <div class="contact-icon-wrap" :style="{ background: item.bg, color: item.color }">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" style="display:block">
                    <path stroke-linecap="round" stroke-linejoin="round" :d="item.icon"/>
                  </svg>
                </div>
                <div>
                  <div class="c-label">{{ item.label }}</div>
                  <div class="c-val">{{ item.value }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- TABLA COMPROBANTES -->
          <section class="table-box" :class="{ 'box-visible': mounted }" style="transition-delay: 280ms;">
            <div class="table-header-bar">
              <div class="table-header-left">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m9 14.25 6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185Z"/>
                </svg>
                Mis Comprobantes de Entrega
                <span class="count-badge">{{ ordenesOrdenadas.length }}</span>
              </div>
            </div>

            <div v-if="cargandoComprobantes" class="loading-inline-wrap">
              <div class="skeleton-row" v-for="i in 3" :key="i"></div>
            </div>

            <template v-else>
              <table>
                <thead>
                  <tr>
                    <th class="th-sort" @click="sortOrdenes('numero')">N.° Orden <span class="sort-icon">{{ sortIcon('numero') }}</span></th>
                    <th class="th-sort" @click="sortOrdenes('fecha')">Fecha de Entrega <span class="sort-icon">{{ sortIcon('fecha') }}</span></th>
                    <th>Producto</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <TransitionGroup name="row">
                    <tr
                      v-for="(o, idx) in ordenesOrdenadas"
                      :key="o.id"
                      class="table-row"
                      :class="{ 'row-flash': o.flash }"
                      :style="{ animationDelay: `${idx * 45}ms` }"
                    >
                      <td><span class="order-num-pill">#{{ o.numero }}</span></td>
                      <td>{{ o.fecha }}</td>
                      <td>{{ o.productos }}</td>
                      <td><span class="badge" :class="o.estadoClass">{{ o.estado }}</span></td>
                      <td>
                        <div class="actions">
                          <button class="action-btn view-btn" title="Ver detalle" @click="verDetalle(o)">
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" shape-rendering="geometricPrecision" style="display:block">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>
                              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                            </svg>
                          </button>
                          <button class="action-btn download-btn" title="Descargar" @click="descargar(o)">
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" shape-rendering="geometricPrecision" style="display:block">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </TransitionGroup>
                </tbody>
              </table>

              <div v-if="ordenesOrdenadas.length === 0" class="empty-state">
                <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#9ca3af" width="40" height="40">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p>No tienes comprobantes registrados.</p>
              </div>
            </template>
          </section>

        </template>
      </template>
    </main>

    <!-- MODAL DETALLE -->
    <Transition name="modal">
      <div v-if="ordenSeleccionada" class="modal" @click.self="ordenSeleccionada = null">
        <div class="modal-container">
          <div class="modal-header">
            <span class="modal-title">Orden #{{ ordenSeleccionada.numero }}</span>
            <button class="modal-close" @click="ordenSeleccionada = null">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="modal-body detalle-grid">
            <div class="detalle-item"><span class="detalle-label">Cliente</span><span>{{ ordenSeleccionada.cliente }}</span></div>
            <div class="detalle-item"><span class="detalle-label">Producto</span><span>{{ ordenSeleccionada.productos }}</span></div>
            <div class="detalle-item"><span class="detalle-label">Fecha de entrega</span><span>{{ ordenSeleccionada.fecha }}</span></div>
            <div class="detalle-item">
              <span class="detalle-label">Estado</span>
              <span class="badge" :class="ordenSeleccionada.estadoClass">{{ ordenSeleccionada.estado }}</span>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-cancelar" @click="ordenSeleccionada = null">Cerrar</button>
            <button class="btn-guardar" @click="descargar(ordenSeleccionada)">Descargar</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- MODAL EDITAR PERFIL -->
    <Transition name="modal">
      <div v-if="modalVisible" class="modal" @click.self="cerrarModal">
        <div class="modal-container">
          <div class="modal-header">
            <span class="modal-title">Editar Perfil</span>
            <button class="modal-close" @click="cerrarModal">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group"><label class="form-label">Nombre Completo</label><input v-model="formEdicion.Nombre_Completo" type="text" class="form-input"></div>
            <div class="form-group"><label class="form-label">Correo Electrónico</label><input v-model="formEdicion.Correo" type="email" class="form-input"></div>
            <div class="form-group"><label class="form-label">Teléfono</label><input v-model="formEdicion.Telefono" type="tel" class="form-input"></div>
            <div class="form-group">
              <label class="form-label">Contraseña</label>
              <div class="input-wrap">
                <input v-model="formEdicion.Contrasena" :type="mostrarPassword ? 'text' : 'password'" class="form-input" placeholder="••••••••">
                <button class="toggle-pass" @click="mostrarPassword = !mostrarPassword" type="button">
                  <svg v-if="!mostrarPassword" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg>
                  <svg v-else fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"/></svg>
                </button>
              </div>
            </div>
          </div>
          <div v-if="errorGuardar" class="error-inline">{{ errorGuardar }}</div>
          <div class="modal-footer">
            <button class="btn-cancelar" @click="cerrarModal">Cancelar</button>
            <button class="btn-guardar" :disabled="guardando" @click="guardarCambios">{{ guardando ? 'Guardando...' : 'Guardar Cambios' }}</button>
          </div>
        </div>
      </div>
    </Transition>

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
import { getUsuario, actualizarUsuario, getOrdenesDeCliente, getComprobantes } from '../../services/api'

const auth = useAuthStore()

const mounted             = ref(false)
const cargando            = ref(true)
const cargandoComprobantes = ref(false)
const error               = ref('')
const errorGuardar        = ref('')
const guardando           = ref(false)
const modalVisible        = ref(false)
const mostrarPassword     = ref(false)
const toast               = ref({ visible: false, msg: '', type: 'success' })
const ordenSeleccionada   = ref(null)

const perfil      = ref({})
const ordenes     = ref([])
const formEdicion = ref({})

// Contadores animados
const displayOrdenes    = ref(0)
const displayEntregadas = ref(0)
const displayPendientes = ref(0)

function animateCount(targetRef, target) {
  let val = 0
  const step = Math.max(1, Math.ceil(target / 40))
  const id = setInterval(() => {
    val += step
    if (val >= target) { targetRef.value = target; clearInterval(id) }
    else targetRef.value = val
  }, 20)
}

const iniciales = computed(() =>
  (perfil.value.Nombre_Completo || '').split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
)

const ICON_ORDERS  = 'm9 14.25 6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185Z'
const ICON_CHECK   = 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
const ICON_CLOCK   = 'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'

const statsCards = computed(() => [
  { label: 'Órdenes totales',  display: displayOrdenes.value,    accent: '#1f3a52', icon: ICON_ORDERS },
  { label: 'Entregadas',       display: displayEntregadas.value, accent: '#16a34a', icon: ICON_CHECK  },
  { label: 'Pendientes',       display: displayPendientes.value, accent: '#d97706', icon: ICON_CLOCK  },
])

const contactItems = computed(() => [
  { label: 'Email',    value: perfil.value.Correo         || '—', color: '#2563eb', bg: '#eff6ff', icon: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75' },
  { label: 'Teléfono', value: perfil.value.Telefono       || '—', color: '#16a34a', bg: '#f0fdf4', icon: 'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25Z' },
  { label: 'Usuario',  value: perfil.value.Nombre_Usuario || '—', color: '#7c3aed', bg: '#ede9fe', icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0' },
])

// Ordenamiento comprobantes
const sortKeyOrdenes = ref('numero')
const sortDirOrdenes = ref(1)
function sortOrdenes(key) {
  sortKeyOrdenes.value === key ? (sortDirOrdenes.value *= -1) : (sortKeyOrdenes.value = key, sortDirOrdenes.value = 1)
}
function sortIcon(key) {
  if (sortKeyOrdenes.value !== key) return '⇅'
  return sortDirOrdenes.value === 1 ? '↑' : '↓'
}
const ordenesOrdenadas = computed(() =>
  [...ordenes.value].sort((a, b) => {
    const k = sortKeyOrdenes.value
    return (a[k] > b[k] ? 1 : a[k] < b[k] ? -1 : 0) * sortDirOrdenes.value
  })
)

async function cargarDatos() {
  cargando.value = true; error.value = ''
  try {
    if (!auth.idUsuario) { perfil.value = {}; ordenes.value = []; return }
    perfil.value = await getUsuario(auth.idUsuario)
    cargandoComprobantes.value = true
    try {
      const [dataOrdenes, dataComprobantes] = await Promise.all([
        getOrdenesDeCliente(auth.idUsuario),
        getComprobantes(),
      ])
      const mapaComp = {}
      dataComprobantes.forEach(c => { mapaComp[c.Id_Orden] = c })
      ordenes.value = (Array.isArray(dataOrdenes) ? dataOrdenes : []).map(o => {
        const comp = mapaComp[o.Id_Orden]
        const estadoComp = comp?.Estado || o.Estado
        const esEntregado = estadoComp === 'Entregado' || o.Estado === 'Completada'
        return {
          id: o.Id_Orden,
          numero: String(o.Id_Orden).padStart(4, '0'),
          cliente: perfil.value.Nombre_Completo || '',
          fecha: o.Fecha_Limite?.split('T')[0] || '—',
          productos: o.Producto || o.Descripcion || '—',
          estado: esEntregado ? 'Entregado' : 'Pendiente',
          estadoClass: esEntregado ? 'success' : 'danger',
          flash: false,
        }
      })
    } catch { ordenes.value = [] }
    finally { cargandoComprobantes.value = false }
  } catch (e) {
    error.value = e.message || 'Error al cargar el perfil.'
  } finally {
    cargando.value = false
  }
}

onMounted(async () => {
  await cargarDatos()
  requestAnimationFrame(() => requestAnimationFrame(() => {
    mounted.value = true
    animateCount(displayOrdenes,    ordenes.value.length)
    animateCount(displayEntregadas, ordenes.value.filter(o => o.estadoClass === 'success').length)
    animateCount(displayPendientes, ordenes.value.filter(o => o.estadoClass === 'danger').length)
  }))
})

function verDetalle(o) { ordenSeleccionada.value = o }
function descargar(o) {
  o.flash = true; setTimeout(() => { o.flash = false }, 1200)
  mostrarToast(`Descargando comprobante ${o.numero}...`)
}
function abrirModal() { formEdicion.value = { ...perfil.value, Contrasena: '' }; mostrarPassword.value = false; errorGuardar.value = ''; modalVisible.value = true }
function cerrarModal() { modalVisible.value = false; errorGuardar.value = '' }
async function guardarCambios() {
  if (!formEdicion.value.Nombre_Completo?.trim() || !formEdicion.value.Correo?.trim()) { errorGuardar.value = 'Nombre y correo son obligatorios.'; return }
  guardando.value = true; errorGuardar.value = ''
  try {
    const payload = { Id_Rol: perfil.value.Id_Rol, Nombre_Completo: formEdicion.value.Nombre_Completo, Nombre_Usuario: perfil.value.Nombre_Usuario, Correo: formEdicion.value.Correo, Telefono: formEdicion.value.Telefono || null, Estado: perfil.value.Estado, Contrasena: formEdicion.value.Contrasena || null }
    await actualizarUsuario(auth.idUsuario, payload)
    perfil.value = { ...perfil.value, ...payload }
    if (auth.usuario) auth.usuario.Nombre_Completo = formEdicion.value.Nombre_Completo
    cerrarModal(); mostrarToast('Perfil actualizado correctamente', 'success')
  } catch (e) { errorGuardar.value = e.message || 'Error al guardar.' }
  finally { guardando.value = false }
}
function mostrarToast(msg, type = 'success') { toast.value = { visible: true, msg, type }; setTimeout(() => { toast.value.visible = false }, 2800) }
</script>

<style scoped>
/* ── FONDO DECORATIVO ── */
.bg-orbs { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
.orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.07; }
.orb-1 { width: 600px; height: 600px; background: #1f3a52; top: -200px; right: -100px; animation: orbDrift1 18s ease-in-out infinite alternate; }
.orb-2 { width: 400px; height: 400px; background: #2563eb; bottom: -100px; left: 10%; animation: orbDrift2 22s ease-in-out infinite alternate; }
.orb-3 { width: 300px; height: 300px; background: #16a34a; top: 40%; right: 5%; animation: orbDrift3 15s ease-in-out infinite alternate; }
@keyframes orbDrift1 { from { transform: translate(0,0) scale(1); } to { transform: translate(-60px,40px) scale(1.1); } }
@keyframes orbDrift2 { from { transform: translate(0,0) scale(1); } to { transform: translate(40px,-50px) scale(1.15); } }
@keyframes orbDrift3 { from { transform: translate(0,0) scale(1); } to { transform: translate(-30px,30px) scale(0.9); } }
.bg-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(31,58,82,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(31,58,82,0.04) 1px, transparent 1px); background-size: 40px 40px; }

.main { flex: 1; padding: 28px 30px; overflow-y: auto; position: relative; z-index: 1; }

/* ── HERO HEADER ── */
.page-hero { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 16px; opacity: 0; transform: translateY(-16px); transition: opacity 0.5s ease, transform 0.5s ease; }
.page-hero.hero-visible { opacity: 1; transform: translateY(0); }
.hero-left { display: flex; align-items: center; gap: 16px; }
.hero-text { display: flex; flex-direction: column; }
.hero-icon-wrap { position: relative; width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; background: #1f3a52; border-radius: 14px; flex-shrink: 0; }
.hero-icon { width: 26px; height: 26px; color: white; }
.hero-icon-ring { position: absolute; border-radius: 50%; border: 1.5px solid #1f3a52; opacity: 0; animation: iconPulse 3s ease-out infinite; }
.ring-1 { width: 68px; height: 68px; animation-delay: 0s; }
.ring-2 { width: 86px; height: 86px; animation-delay: 0.8s; }
@keyframes iconPulse { 0% { transform: scale(0.7); opacity: 0.5; } 100% { transform: scale(1.4); opacity: 0; } }
.hero-title { font-size: 24px; font-weight: 700; color: #111827; margin: 0; display: flex; flex-wrap: wrap; }
.title-char { display: inline-block; opacity: 0; transform: translateY(12px); animation: charReveal 0.4s ease forwards; }
@keyframes charReveal { to { opacity: 1; transform: translateY(0); } }
.hero-sub { font-size: 13px; color: #6b7280; margin: 4px 0 0 0; }
.btn-edit-hero { display: flex; align-items: center; gap: 6px; background: #1f3a52; color: white; border: none; border-radius: 10px; padding: 10px 16px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s, transform 0.1s; flex-shrink: 0; }
.btn-edit-hero:hover { background: #162b3c; transform: translateY(-1px); }

/* ── BANNER PERFIL ── */
.profile-banner { background: linear-gradient(135deg, #111827 0%, #1f3a52 55%, #0f2236 100%); border-radius: 16px; padding: 26px 28px; display: flex; align-items: center; gap: 20px; margin-bottom: 20px; opacity: 0; transform: translateY(22px) scale(0.97); transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.34,1.56,0.64,1); }
.profile-banner.banner-in { opacity: 1; transform: none; }
.avatar-circle { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, #2d5f8a, #4a90c8); color: white; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 700; flex-shrink: 0; box-shadow: 0 0 0 3px rgba(255,255,255,0.1); opacity: 0; transform: scale(0.4); transition: opacity 0.6s ease 0.1s, transform 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.1s; }
.avatar-circle.avatar-in { opacity: 1; transform: scale(1); }
.profile-info { flex: 1; }
.profile-name { font-size: 20px; font-weight: 700; color: white; margin-bottom: 4px; }
.profile-role { font-size: 13px; color: rgba(255,255,255,0.55); margin-bottom: 8px; }
.status-pill { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; }
.status-active { background: #dcfce7; color: #166534; }
.status-inactive { background: #fee2e2; color: #991b1b; }
.status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; animation: blink 2s ease-in-out infinite; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

/* Engranajes */
.gear-deco { position: absolute; pointer-events: none; }
.gear-big  { width: 160px; height: 160px; right: -20px; top: -30px; }
.gear-small { width: 80px; height: 80px; right: 110px; bottom: -20px; }
.gear-big svg, .gear-small svg { width: 100%; height: 100%; }
.gear-spin     { animation: gearTurn 20s linear infinite; }
.gear-spin-rev { animation: gearTurn 14s linear infinite reverse; }
.gear-big.gear-spin     { transform-origin: 80px 80px; }
.gear-small.gear-spin-rev { transform-origin: 40px 40px; }
@keyframes gearTurn { to { transform: rotate(360deg); } }

/* ── STATS ── */
.stats-grid { display: flex; gap: 18px; margin-bottom: 20px; }
.stat-card { background: white; flex: 1; padding: 20px 20px 20px 24px; border-radius: 14px; border: 1px solid #e5e7eb; position: relative; overflow: hidden; opacity: 0; transform: translateY(20px); transition: opacity 0.45s ease, transform 0.45s ease, box-shadow 0.2s; }
.stats-visible .stat-card { opacity: 1; transform: translateY(0); }
.stat-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.09); transform: translateY(-3px) !important; }
.stat-accent { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; border-radius: 4px 0 0 4px; }
.stat-icon-bg { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); opacity: 0.07; }
.stat-icon-bg svg { width: 52px; height: 52px; }
.stat-card h3 { font-size: 13px; color: #6b7280; font-weight: 500; margin: 0 0 10px 0; }
.stat-card p { font-size: 30px; font-weight: 800; margin: 0; line-height: 1; }

/* ── CONTACTO ── */
.contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.contact-item { display: flex; align-items: center; gap: 10px; padding: 11px 13px; border-radius: 10px; border: 1px solid #f3f4f6; background: #fafbfc; opacity: 0; transform: translateY(8px); animation: contactReveal 0.4s ease both; transition: background 0.2s, border-color 0.2s, transform 0.2s; }
.contact-item:hover { background: white; border-color: #e0eaf2; transform: translateY(-1px); }
@keyframes contactReveal { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.contact-icon-wrap { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.c-label { font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 2px; }
.c-val   { font-size: 13px; font-weight: 600; color: #111827; }

/* ── TABLE BOX ── */
.table-box { background: white; border-radius: 14px; border: 1px solid #e5e7eb; margin-bottom: 20px; overflow: hidden; opacity: 0; transform: translateY(16px); transition: opacity 0.45s ease, transform 0.45s ease; }
.box-visible { opacity: 1; transform: translateY(0); }
.table-header-bar { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f1f5f9; background: #f9fafb; }
.table-header-left { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: #374151; }
.table-header-left svg { color: #1f3a52; }
.count-badge { background: #1f3a52; color: white; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 999px; line-height: 1.6; }

/* ── TABLA ── */
table { width: 100%; border-collapse: collapse; }
thead { background: #f9fafb; }
th { text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; padding: 13px 18px; white-space: nowrap; }
.th-sort { cursor: pointer; user-select: none; transition: color 0.15s; }
.th-sort:hover { color: #1f3a52; }
.sort-icon { font-size: 11px; margin-left: 4px; opacity: 0.6; }
td { padding: 14px 18px; font-size: 14px; color: #374151; border-top: 1px solid #f1f5f9; }
.table-row { transition: background 0.18s; animation: rowSlideIn 0.35s ease both; }
.table-row:hover td { background: #f8fafc; }
@keyframes rowSlideIn { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: translateX(0); } }
@keyframes rowFlash { 0% { background: #d1fae5; } 100% { background: transparent; } }
.row-flash { animation: rowFlash 1.2s ease !important; }
.order-num-pill { display: inline-block; background: #f1f5f9; color: #1f3a52; font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 6px; font-family: 'Courier New', monospace; }
tr:hover .order-num-pill { background: #e0ecff; color: #2563eb; }
.badge { padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
.success { background: #dcfce7; color: #15803d; }
.danger  { background: #fee2e2; color: #b91c1c; }
.actions { display: flex; gap: 8px; align-items: center; }
.action-btn { width: 32px; height: 32px; border-radius: 7px; border: none; background: #1f3a52; display: flex; align-items: center; justify-content: center; cursor: pointer; color: white; transition: all 0.15s; -webkit-font-smoothing: antialiased; }
.action-btn svg { pointer-events: none; filter: drop-shadow(0 0 0.3px rgba(255,255,255,0.4)); }
.view-btn:hover { background: #2d5580; transform: scale(1.07); }
.download-btn:hover { background: #1d4ed8; transform: scale(1.07); }

/* ── SKELETON ── */
.loading-inline-wrap { padding: 16px 20px; display: flex; flex-direction: column; gap: 10px; }
.skeleton-row { height: 48px; border-radius: 8px; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

/* ── EMPTY / LOADING ── */
.empty-state { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 44px 0; color: #9ca3af; font-size: 14px; }
.loading-wrap { display: flex; flex-direction: column; align-items: center; padding: 80px 0; gap: 16px; position: relative; z-index: 1; }
.spinner { width: 32px; height: 32px; border: 3px solid #e5e7eb; border-top-color: #1f3a52; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.loading-text { font-size: 14px; color: #9ca3af; }
.error-banner { display: flex; align-items: center; gap: 10px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 14px 18px; color: #991b1b; font-size: 14px; margin-bottom: 20px; position: relative; z-index: 1; }
.btn-retry { margin-left: auto; background: #991b1b; color: white; border: none; border-radius: 6px; padding: 5px 12px; font-size: 13px; cursor: pointer; }
.empty-session { display: flex; flex-direction: column; align-items: center; padding: 80px 24px; gap: 12px; text-align: center; position: relative; z-index: 1; }
.empty-title { font-size: 16px; font-weight: 600; color: #374151; }
.empty-sub   { font-size: 13px; color: #9ca3af; max-width: 320px; line-height: 1.6; }

/* ── MODAL ── */
.modal { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.modal-container { background: white; border-radius: 16px; width: 480px; max-width: 95vw; max-height: 90vh; overflow-y: auto; box-shadow: 0 24px 60px rgba(0,0,0,0.18); }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px 0; }
.modal-title { font-size: 16px; font-weight: 700; color: #111827; }
.modal-close { background: none; border: none; cursor: pointer; color: #6b7280; padding: 4px; border-radius: 6px; }
.modal-close:hover { background: #f3f4f6; }
.modal-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 14px; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px 20px; border-top: 1px solid #f3f4f6; }
.form-group { display: flex; flex-direction: column; gap: 5px; }
.form-label { font-size: 12px; font-weight: 600; color: #374151; }
.form-input { border: 1.5px solid #e5e7eb; border-radius: 8px; padding: 10px 12px; font-size: 14px; color: #111827; outline: none; transition: border-color 0.2s; }
.form-input:focus { border-color: #1f3a52; box-shadow: 0 0 0 3px rgba(31,58,82,0.1); }
.input-wrap { display: flex; align-items: center; border: 1.5px solid #e5e7eb; border-radius: 8px; }
.input-wrap:focus-within { border-color: #1f3a52; }
.input-wrap .form-input { flex: 1; border: none; outline: none; box-shadow: none !important; }
.toggle-pass { background: none; border: none; cursor: pointer; padding: 0 10px; color: #9ca3af; }
.toggle-pass:hover { color: #374151; }
.btn-cancelar { background: white; color: #374151; border: 1px solid #e5e7eb; border-radius: 8px; padding: 9px 18px; font-size: 13px; cursor: pointer; }
.btn-cancelar:hover { background: #f3f4f6; }
.btn-guardar { background: #1f3a52; color: white; border: none; border-radius: 8px; padding: 9px 20px; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.btn-guardar:hover:not(:disabled) { background: #162b3c; }
.btn-guardar:disabled { opacity: 0.6; cursor: not-allowed; }
.error-inline { color: #dc2626; font-size: 13px; padding: 4px 24px; }

/* Detalle grid */
.detalle-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.detalle-item { display: flex; flex-direction: column; gap: 4px; }
.detalle-label { font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; }

/* ── TOAST ── */
.toast { position: fixed; bottom: 24px; right: 24px; padding: 12px 20px; border-radius: 10px; font-size: 13px; font-weight: 500; z-index: 2000; }
.toast-success { background: #166534; color: white; }
.toast-danger  { background: #991b1b; color: white; }
.toast-enter-active, .toast-leave-active { transition: opacity 0.3s, transform 0.3s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(8px); }
.modal-enter-active, .modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.row-enter-active, .row-leave-active { transition: opacity 0.3s ease; }
.row-enter-from, .row-leave-to { opacity: 0; }

@media (max-width: 960px) {
  .stats-grid { flex-direction: column; }
  .page-hero { flex-direction: column; align-items: flex-start; }
  .contact-grid { grid-template-columns: 1fr; }
}
</style>