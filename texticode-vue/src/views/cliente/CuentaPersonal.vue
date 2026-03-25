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
          <p class="empty-sub">Inicia sesión con tus credenciales reales para ver tu perfil y comprobantes.</p>
        </div>
 
        <!-- CON SESIÓN REAL -->
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
            </div>
          </div>

          <!-- COMPROBANTES -->
          <section class="table-container">
            <h2 class="section-title">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="section-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="m9 14.25 6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185Z"/>
              </svg>
              Mis Comprobantes de Entrega
            </h2>

            <div v-if="cargandoComprobantes" class="loading-inline">Cargando comprobantes...</div>

            <template v-else>
              <table>
                <thead>
                  <tr>
                    <th class="sortable" @click="sortOrdenes('numero')">
                      Número de Orden <span class="sort-icon">{{ sortIcon('numero') }}</span>
                    </th>
                    <th class="sortable" @click="sortOrdenes('fecha')">
                      Fecha de Entrega <span class="sort-icon">{{ sortIcon('fecha') }}</span>
                    </th>
                    <th>Productos</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="o in ordenesOrdenadas" :key="o.id" class="table-row" :class="{ 'row-flash': o.flash }">
                    <td>{{ o.numero }}</td>
                    <td>{{ o.fecha }}</td>
                    <td>{{ o.productos }}</td>
                    <td><span class="badge" :class="o.estadoClass">{{ o.estado }}</span></td>
                    <td class="actions">
                      <button class="icon-btn" title="Ver detalle" @click="verDetalle(o)">
                        <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0Z"/>
                        </svg>
                      </button>
                      <button class="icon-btn" title="Descargar" @click="descargar(o)">
                        <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div v-if="ordenesOrdenadas.length === 0" class="empty-state">
                <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#9ca3af" width="40" height="40">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75s.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"/>
                </svg>
                <p>No tienes comprobantes registrados.</p>
              </div>
            </template>
          </section>
        </template>
      </template>
    </main>

    <!-- MODAL DETALLE COMPROBANTE PROFESIONAL -->
    <Transition name="modal">
      <div v-if="ordenSeleccionada" class="modal" @click.self="ordenSeleccionada = null">
        <div class="cp-wrap">

          <!-- ENCABEZADO EMPRESA -->
          <div class="cp-head">
            <div class="cp-head-left">
              <div class="cp-logo">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAAAAAQACAYAAAB/HSuDAAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAABKl0lEQVR4nO3d65KcuLIG0OoJv/8r9/nhU9u0GiouQpfMtSIm7LFnukBcSvlJiK/v7+8XAAAAENt/vTcAAAAAeJ4AAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAgAQEAAAAAJCAAAAAAAASEAAAAABAAgIAAAAASEAAAAAAAAkIAAAAACABAQAAAAAkIAAAAACABAQAAAAAkIAAAAAAABIQAAAAAEACAgAAAABIQAAAAAAACQgAAAAAIAEBAAAAACQgAAAAAIAEBAAAAACQgAAAAAAAEhAAAAAAQAICAAAAAEhAAAAAAAAJCAAAAAAggT+9NwAAOO37xH/79fBnXP35AEBjAgAAGMde0f218funnPmMT2GBkAAABiAAAIC2torlr1fdovtpZwOJvf0GABoQAADAc9aK3k8Fb+/C/qizjwjs7Xf5s4QCAPCAr+/vWfoZADC0M0WsL9/zQYhQAABuEgAAwHmK/Wdttef3gf8GANjgEQAA+OxIwa/Qr2fr0Ymy3QUCAHCCAAAA1n0qLhX8ba2FMAIBADjBIwAA8JeCf27CAAD4wAwAADJT9Mfx6TENgQAA6QkAAMhmrxBU8MdRHuevlb8TBACQigAAgCy2ij5Ff3zCAAB4CQAAiG1rtF/Rn9dWGOARAQDCEwAAENHaqK6in9LyPDErAIDwBAAARGG0n6vMCgAgBQEAADNT9FPbkXNKGADAlAQAAMzIFH9a+BQGCAIAmIoAAICZKPzpZW29AEEAAFMRAAAwA4U/oxAEADAtAQAAIysLK0U/oxAEADAdAQAAI9ob8f96CQIYhyAAgGl8fX/rQwEwDCP+zM5igQAMywwAAEag8CeKtTcHCAIAGIIAAIIQAozrVlbHQ6ADu7nQALhIAHMDgBABATRMdgYAHjDAIM1BhMAABeXf+6dN9GAzSzGkGCHPwBiGpUPYxjdIBjSSt88BmjdGSuG8LjcxDpb7D26oOJkHqKBnw5Nx9iVAAANt7k3A/ZJQoOJlpvUAuRgAMBzA/WtQAAABF1JREFU..." alt="Texticode" style="height:60px;width:60px;object-fit:contain;" />
              </div>
              <div>
                <div class="cp-empresa-nombre">TEXTICODE</div>
                <div class="cp-empresa-datos">Bogotá, Colombia &nbsp;|&nbsp; texticode@correo.com &nbsp;|&nbsp; +57 300 000 0000</div>
              </div>
            </div>
            <div class="cp-head-right">
              <div class="cp-doc-titulo">COMPROBANTE DE ENTREGA</div>
              <div class="cp-doc-numero">N.° {{ ordenSeleccionada.numero }}</div>
            </div>
          </div>

          <div class="cp-linea-doble"></div>

          <!-- BLOQUE CLIENTE + FECHAS -->
          <div class="cp-info-row">
            <div class="cp-info-bloque">
              <div class="cp-label">CLIENTE</div>
              <div class="cp-valor-grande">{{ ordenSeleccionada.cliente }}</div>
              <div class="cp-valor-sub" v-if="ordenSeleccionada.clienteEmail !== '—'">{{ ordenSeleccionada.clienteEmail }}</div>
              <div class="cp-valor-sub" v-if="ordenSeleccionada.clienteTel !== '—'">Tel: {{ ordenSeleccionada.clienteTel }}</div>
            </div>
            <div class="cp-info-bloque cp-info-bloque--center">
              <div class="cp-label">FECHA DE EMISIÓN</div>
              <div class="cp-valor-grande">{{ fechaHoy }}</div>
              <div class="cp-label" style="margin-top:14px">FECHA DE ENTREGA</div>
              <div class="cp-valor-grande">{{ ordenSeleccionada.fecha }}</div>
            </div>
            <div class="cp-info-bloque cp-info-bloque--right">
              <div class="cp-label">ESTADO DEL PEDIDO</div>
              <div class="cp-estado-caja" :class="ordenSeleccionada.estadoClass">
                {{ ordenSeleccionada.estado }}
              </div>
              <div class="cp-label" style="margin-top:14px">ORDEN DE REFERENCIA</div>
              <div class="cp-valor-grande">#{{ ordenSeleccionada.numero }}</div>
            </div>
          </div>

          <div class="cp-linea-simple"></div>

          <!-- TABLA DE PRODUCTOS -->
          <table class="cp-tabla">
            <thead>
              <tr>
                <th class="cp-th cp-th--num">#</th>
                <th class="cp-th">Descripción del producto / servicio</th>
                <th class="cp-th cp-th--centro">Cantidad</th>
                <th class="cp-th cp-th--centro">Unidad</th>
                <th class="cp-th cp-th--right">Estado entrega</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(p, i) in ordenSeleccionada.productosList" :key="i" class="cp-tr">
                <td class="cp-td cp-td--num">{{ String(i + 1).padStart(2, '0') }}</td>
                <td class="cp-td">
                  <div class="cp-prod-nombre">{{ p }}</div>
                  <div class="cp-prod-desc" v-if="ordenSeleccionada.descripcion && ordenSeleccionada.descripcion !== p">
                    {{ ordenSeleccionada.descripcion }}
                  </div>
                </td>
                <td class="cp-td cp-td--centro">{{ ordenSeleccionada.cantidad }}</td>
                <td class="cp-td cp-td--centro">{{ ordenSeleccionada.unidad }}</td>
                <td class="cp-td cp-td--right">
                  <span class="cp-entrega-badge" :class="ordenSeleccionada.estadoClass">
                    {{ ordenSeleccionada.estado === 'Entregado' ? '✓ Entregado' : '⏳ Pendiente' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="cp-linea-simple"></div>

          <!-- OBSERVACIONES + FIRMAS -->
          <div class="cp-bottom">
            <div class="cp-observaciones">
              <div class="cp-label">OBSERVACIONES</div>
              <div class="cp-obs-caja">
                {{ ordenSeleccionada.observaciones || 'Ninguna observación registrada para este pedido.' }}
              </div>
            </div>
            <div class="cp-firmas">
              <div class="cp-firma-bloque">
                <div class="cp-firma-linea"></div>
                <div class="cp-firma-nombre">Entregado por</div>
                <div class="cp-firma-cargo">TEXTICODE S.A.S.</div>
              </div>
              <div class="cp-firma-bloque">
                <div class="cp-firma-linea"></div>
                <div class="cp-firma-nombre">Recibido por</div>
                <div class="cp-firma-cargo">{{ ordenSeleccionada.cliente }}</div>
              </div>
            </div>
          </div>

          <!-- PIE DE PÁGINA -->
          <div class="cp-pie">
            <span>Este documento es un comprobante oficial de entrega emitido por TEXTICODE.</span>
            <span>Generado el {{ fechaHoy }}</span>
          </div>

          <!-- ACCIONES -->
          <div class="cp-acciones">
            <button class="btn-secondary" @click="ordenSeleccionada = null">Cerrar</button>
            <button class="btn-primary btn-icon" @click="descargar(ordenSeleccionada)">
              <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/>
              </svg>
              Descargar PDF
            </button>
          </div>

        </div>
      </div>
    </Transition>

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
            <label class="form-label">Contraseña</label>
            <div class="input-wrap">
              <input v-model="formEdicion.Contrasena" :type="mostrarPassword ? 'text' : 'password'" class="form-input" placeholder="••••••••">
              <button class="toggle-pass" @click="mostrarPassword = !mostrarPassword" type="button">
                <svg v-if="!mostrarPassword" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                </svg>
                <svg v-else fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"/>
                </svg>
              </button>
            </div>
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
import { getUsuario, actualizarUsuario, getOrdenesDeCliente, getComprobantes } from '../../services/api'

const auth = useAuthStore()

// ── ESTADO ────────────────────────────────────────────────────
const cargando            = ref(true)
const cargandoComprobantes = ref(false)
const error               = ref('')
const errorGuardar        = ref('')
const guardando           = ref(false)
const modalVisible        = ref(false)
const mostrarPassword     = ref(false)
const toast               = ref({ visible: false, msg: '', type: 'success' })
const ordenSeleccionada   = ref(null)
const fechaHoy            = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })

const perfil      = ref({})
const ordenes     = ref([])
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

// ── ORDENAMIENTO COMPROBANTES ──────────────────────────────────
const sortKeyOrdenes = ref('numero')
const sortDirOrdenes = ref(1)

function sortOrdenes(key) {
  sortKeyOrdenes.value === key
    ? (sortDirOrdenes.value *= -1)
    : (sortKeyOrdenes.value = key, sortDirOrdenes.value = 1)
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

// ── CARGA DE DATOS ────────────────────────────────────────────
async function cargarDatos() {
  cargando.value = true
  error.value    = ''

  try {
    if (!auth.idUsuario) {
      perfil.value  = {}
      ordenes.value = []
      return
    }

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
        const comp        = mapaComp[o.Id_Orden]
        const estadoComp  = comp?.Estado || o.Estado
        const esEntregado = estadoComp === 'Entregado' || o.Estado === 'Completada'
        return {
          id:            o.Id_Orden,
          numero:        String(o.Id_Orden).padStart(4, '0'),
          cliente:       perfil.value.Nombre_Completo || '',
          clienteEmail:  perfil.value.Correo    || '—',
          clienteTel:    perfil.value.Telefono  || '—',
          fecha:         o.Fecha_Limite?.split('T')[0] || o.Fecha_Limite || '—',
          productos:     o.Producto      || o.Descripcion || '—',
          descripcion:   o.Descripcion   || o.Producto    || '—',
          cantidad:      o.Cantidad      || 1,
          unidad:        o.Unidad        || 'unidad(es)',
          observaciones: o.Observaciones || o.Notas || '',
          estado:        esEntregado ? 'Entregado' : 'Pendiente',
          estadoClass:   esEntregado ? 'success'   : 'danger',
          productosList: [o.Producto || o.Descripcion || '—'],
          flash:         false,
        }
      })
    } catch {
      ordenes.value = []
    } finally {
      cargandoComprobantes.value = false
    }

  } catch (e) {
    error.value = e.message || 'Error al cargar el perfil.'
  } finally {
    cargando.value = false
  }
}

onMounted(cargarDatos)

// ── ACCIONES COMPROBANTE ───────────────────────────────────────
function verDetalle(orden) { ordenSeleccionada.value = orden }

function descargar(orden) {
  orden.flash = true
  setTimeout(() => { orden.flash = false }, 1200)
  mostrarToast(`Descargando comprobante ${orden.numero}...`)
}

// ── MODAL EDITAR PERFIL ────────────────────────────────────────
function abrirModal() {
  formEdicion.value  = { ...perfil.value, Contrasena: '' }
  mostrarPassword.value = false
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
      Id_Rol:          perfil.value.Id_Rol,
      Nombre_Completo: formEdicion.value.Nombre_Completo,
      Nombre_Usuario:  perfil.value.Nombre_Usuario,
      Correo:          formEdicion.value.Correo,
      Telefono:        formEdicion.value.Telefono || null,
      Estado:          perfil.value.Estado,
      Contrasena:      formEdicion.value.Contrasena || null,
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
.loading-text   { color: #6b7280; font-size: 14px; }
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

/* CARD CONTACTO */
.card { background: white; border-radius: 12px; padding: 20px 24px; margin-bottom: 16px; border: 1px solid #e5e7eb; }
.card-header { font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
.contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.contact-label { font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
.contact-value { font-size: 14px; color: #111827; }

/* TABLA COMPROBANTES */
.table-container { background: white; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb; margin-bottom: 30px; }
.section-title { display: flex; align-items: center; gap: 8px; font-size: 16px; margin-bottom: 10px; }
.section-icon  { width: 20px; height: 20px; }

table { width: 100%; border-collapse: collapse; }
th    { text-align: left; font-size: 13px; font-weight: 500; color: #6b7280; padding: 12px 0; user-select: none; }
td    { padding: 14px 0; border-top: 1px solid #f3f4f6; font-size: 14px; color: #374151; }
.sortable       { cursor: pointer; }
.sortable:hover { color: #374151; }
.sort-icon      { font-size: 11px; margin-left: 4px; opacity: .6; }
.table-row            { transition: background .18s; }
.table-row:hover      { background: #f9fafb; }
@keyframes rowFlash { 0% { background: #d1fae5; } 100% { background: transparent; } }
.row-flash { animation: rowFlash 1.2s ease; }

.badge   { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 500; }
.success { background: #dcfce7; color: #15803d; }
.danger  { background: #fee2e2; color: #b91c1c; }

.actions  { display: flex; align-items: center; gap: 8px; }
.icon-btn { display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; transition: background .15s, transform .15s; }
.icon-btn svg   { width: 18px; height: 18px; }
.icon-btn:hover { background: #f3f4f6; transform: scale(1.08); }
.icon-btn:active { transform: scale(.95); }

.empty-state { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 36px 0; color: #9ca3af; font-size: 14px; }

/* MODAL COMPROBANTE */
.modal { position: fixed; inset: 0; background: rgba(0,0,0,.45); backdrop-filter: blur(2px); display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 20px; }
.cp-wrap { background: #fff; width: 740px; max-width: 100%; max-height: 90vh; overflow-y: auto; border-radius: 4px; box-shadow: 0 8px 40px rgba(0,0,0,.18); font-family: 'Georgia', 'Times New Roman', serif; }
.cp-head { display: flex; justify-content: space-between; align-items: flex-start; padding: 22px 32px; background: #0f2236; }
.cp-head-left { display: flex; align-items: center; gap: 14px; }
.cp-logo { flex-shrink: 0; }
.cp-empresa-nombre { font-size: 20px; font-weight: 700; letter-spacing: 3px; color: #fff; font-family: Arial, sans-serif; }
.cp-empresa-datos  { font-size: 11px; color: #93c5fd; margin-top: 3px; font-family: Arial, sans-serif; }
.cp-head-right     { text-align: right; }
.cp-doc-titulo { font-size: 13px; font-weight: 600; letter-spacing: 2px; color: #93c5fd; font-family: Arial, sans-serif; text-transform: uppercase; }
.cp-doc-numero { font-size: 26px; font-weight: 700; color: #fff; font-family: Arial, sans-serif; margin-top: 4px; }
.cp-linea-doble  { border: none; border-top: 3px double #1f3b57; margin: 0 32px; }
.cp-linea-simple { border: none; border-top: 1px solid #d1d5db; margin: 0 32px; }
.cp-info-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0; padding: 22px 32px; border-bottom: 1px solid #e5e7eb; }
.cp-info-bloque { padding-right: 20px; }
.cp-info-bloque--center { border-left: 1px solid #e5e7eb; padding-left: 20px; border-right: 1px solid #e5e7eb; padding-right: 20px; }
.cp-info-bloque--right  { padding-left: 20px; padding-right: 0; }
.cp-label        { font-size: 9px; font-weight: 700; letter-spacing: 2px; color: #9ca3af; text-transform: uppercase; font-family: Arial, sans-serif; margin-bottom: 5px; }
.cp-valor-grande { font-size: 14px; color: #111827; line-height: 1.4; }
.cp-valor-sub    { font-size: 12px; color: #6b7280; margin-top: 2px; font-family: Arial, sans-serif; }
.cp-estado-caja { display: inline-block; padding: 5px 14px; border-radius: 2px; font-size: 12px; font-weight: 700; font-family: Arial, sans-serif; letter-spacing: .5px; margin-top: 4px; }
.cp-estado-caja.success { background: #f0fdf4; color: #15803d; border: 1px solid #86efac; }
.cp-estado-caja.danger  { background: #fffbeb; color: #92400e; border: 1px solid #fcd34d; }
.cp-tabla { width: 100%; border-collapse: collapse; margin: 0; }
.cp-th { padding: 10px 12px 10px 32px; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; color: #fff; background: #1f3b57; text-transform: uppercase; font-family: Arial, sans-serif; text-align: left; }
.cp-th--num    { width: 44px; padding-left: 32px; }
.cp-th--centro { text-align: center; }
.cp-th--right  { text-align: right; padding-right: 32px; }
.cp-tr { border-bottom: 1px solid #f3f4f6; }
.cp-tr:nth-child(even) { background: #f9fafb; }
.cp-td { padding: 13px 12px 13px 32px; font-size: 13px; color: #374151; vertical-align: top; }
.cp-td--num    { color: #9ca3af; font-size: 12px; width: 44px; font-family: Arial, sans-serif; }
.cp-td--centro { text-align: center; font-family: Arial, sans-serif; }
.cp-td--right  { text-align: right; padding-right: 32px; }
.cp-prod-nombre { font-weight: 600; color: #111827; }
.cp-prod-desc   { font-size: 12px; color: #6b7280; margin-top: 3px; font-family: Arial, sans-serif; }
.cp-entrega-badge { font-size: 11px; font-weight: 600; font-family: Arial, sans-serif; padding: 3px 10px; border-radius: 2px; }
.cp-entrega-badge.success { background: #f0fdf4; color: #15803d; border: 1px solid #86efac; }
.cp-entrega-badge.danger  { background: #fffbeb; color: #92400e; border: 1px solid #fcd34d; }
.cp-bottom { display: flex; gap: 32px; padding: 22px 32px 28px; }
.cp-observaciones { flex: 1; }
.cp-obs-caja { margin-top: 8px; padding: 12px; border: 1px solid #e5e7eb; font-size: 12px; color: #374151; line-height: 1.6; min-height: 64px; font-family: Arial, sans-serif; }
.cp-firmas { display: flex; gap: 28px; align-items: flex-end; flex-shrink: 0; }
.cp-firma-bloque { text-align: center; }
.cp-firma-linea  { width: 130px; border-top: 1px solid #374151; margin-bottom: 6px; }
.cp-firma-nombre { font-size: 11px; color: #374151; font-family: Arial, sans-serif; }
.cp-firma-cargo  { font-size: 11px; font-weight: 600; color: #1f3b57; font-family: Arial, sans-serif; }
.cp-pie { background: #1f3b57; padding: 10px 32px; display: flex; justify-content: space-between; font-size: 10px; color: #93c5fd; font-family: Arial, sans-serif; letter-spacing: .3px; }
.cp-acciones { display: flex; justify-content: flex-end; gap: 12px; padding: 16px 32px; border-top: 1px solid #e5e7eb; background: #f9fafb; }
.btn-primary       { background: #1f3b57; color: white; padding: 8px 14px; border-radius: 8px; border: none; cursor: pointer; transition: background .2s; }
.btn-primary:hover { background: #2d5580; }
.btn-secondary       { background: #f3f4f6; color: #374151; padding: 8px 14px; border-radius: 8px; border: 1px solid #e5e7eb; cursor: pointer; transition: background .2s; }
.btn-secondary:hover { background: #e5e7eb; }
.btn-icon { display: flex; align-items: center; gap: 8px; }
.modal-enter-active, .modal-leave-active { transition: opacity .25s ease; }
.modal-enter-from,  .modal-leave-to      { opacity: 0; }

/* MODAL EDITAR PERFIL */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 100; }
.modal-container { background: white; border-radius: 16px; width: 460px; max-width: 95vw; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px 0; }
.modal-title  { font-size: 17px; font-weight: 600; color: #111827; }
.modal-close  { background: none; border: none; cursor: pointer; color: #6b7280; padding: 4px; border-radius: 6px; }
.modal-close:hover { background: #f3f4f6; }
.modal-body   { padding: 20px 24px; display: flex; flex-direction: column; gap: 14px; }
.form-group   { display: flex; flex-direction: column; gap: 5px; }
.form-label   { font-size: 12px; font-weight: 600; color: #374151; }
.form-input   { border: 1px solid #e5e7eb; border-radius: 8px; padding: 9px 12px; font-size: 14px; color: #111827; outline: none; transition: border-color 0.2s; }
.form-input:focus { border-color: #1f3a52; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px 20px; border-top: 1px solid #f3f4f6; }
.btn-cancelar { background: white; color: #374151; border: 1px solid #e5e7eb; border-radius: 8px; padding: 9px 18px; font-size: 13px; cursor: pointer; }
.btn-guardar  { background: #1f3a52; color: white; border: none; border-radius: 8px; padding: 9px 20px; font-size: 13px; font-weight: 600; cursor: pointer; }
.btn-guardar:disabled { opacity: 0.6; cursor: not-allowed; }

/* EMPTY SESSION */
.empty-session { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 24px; gap: 12px; text-align: center; }
.empty-title { font-size: 16px; font-weight: 600; color: #374151; }
.empty-sub   { font-size: 13px; color: #9ca3af; max-width: 320px; line-height: 1.6; }

/* INPUT PASSWORD */
.input-wrap { display: flex; align-items: center; border: 1px solid #e5e7eb; border-radius: 8px; background: #fff; }
.input-wrap .form-input { flex: 1; border: none; outline: none; padding: 9px 12px; }
.toggle-pass { background: none; border: none; cursor: pointer; padding: 0 10px; color: #9ca3af; }
.toggle-pass:hover { color: #374151; }

/* TOAST */
.toast { position: fixed; bottom: 24px; right: 24px; padding: 12px 20px; border-radius: 10px; font-size: 13px; font-weight: 500; z-index: 2000; }
.toast-success { background: #166534; color: white; }
.toast-danger  { background: #991b1b; color: white; }
.toast-enter-active, .toast-leave-active { transition: opacity 0.3s, transform 0.3s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(8px); }
</style>  