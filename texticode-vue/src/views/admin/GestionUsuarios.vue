<template>
  <div class="layout">
    <AppSidebar rol="admin" />

    <main class="main">

      <!-- TOAST -->
      <Transition name="toast">
        <div v-if="toast.visible" class="toast" :class="toast.type">
          <svg v-if="toast.type === 'success'" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
          </svg>
          <svg v-else-if="toast.type === 'danger'" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
          </svg>
          <svg v-else width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z"/>
          </svg>
          {{ toast.msg }}
        </div>
      </Transition>

      <!-- CONFIRM DIALOG -->
      <Transition name="toast">
        <div v-if="confirmDialog.visible" class="confirm-overlay" @click.self="confirmDialog.visible = false">
          <div class="confirm-box">
            <div class="confirm-icon">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/>
              </svg>
            </div>
            <p class="confirm-title">¿Eliminar usuario?</p>
            <p class="confirm-sub">Esta acción no se puede deshacer.</p>
            <div class="confirm-btns">
              <button class="btn-cancel" @click="confirmDialog.visible = false">Cancelar</button>
              <button class="btn-danger" @click="confirmarEliminar">Eliminar</button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- TÍTULO -->
      <div class="title" :class="{ visible: animVisible }">Gestión de Usuarios</div>

      <!-- TOP BAR -->
      <div class="top-bar" :class="{ visible: animVisible }">
        <div class="filters">
          <input
            v-model="busqueda"
            class="search"
            :class="{ 'search-focus': searchFocus }"
            type="text"
            placeholder="Buscar usuarios..."
            @focus="searchFocus = true"
            @blur="searchFocus = false"
          >
          <div class="select-wrapper">
            <select v-model="filtroRol" class="select">
              <option value="">Todos los roles</option>
              <option value="administrador">Administrador</option>
              <option value="operador">Operario</option>
              <option value="cliente">Cliente</option>
            </select>
            <svg class="select-arrow" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
            </svg>
          </div>
        </div>
        <button class="btn" @click="abrirModal(null)">
          <svg class="btn-icon" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
          </svg>
          Nuevo Usuario
        </button>
      </div>

      <!-- STATS -->
      <div class="stats" :class="{ visible: animVisible }">
        <div
          v-for="(s, i) in statsCards"
          :key="i"
          class="stat-card"
          :style="{ transitionDelay: animVisible ? `${i * 70}ms` : '0ms' }"
        >
          <h3>{{ s.label }}</h3>
          <p :class="s.color">{{ s.display }}</p>
        </div>
      </div>

      <!-- TABLA -->
      <div class="table-box" :class="{ visible: animVisible }">
        <div class="table-header">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"/>
          </svg>
          Lista de Usuarios ({{ usuariosFiltrados.length }})
        </div>
        <table>
          <thead>
            <tr>
              <th class="th-sortable" @click="sortBy('nombre')">
                Usuario <span class="sort-icon">{{ sortIcon('nombre') }}</span>
              </th>
              <th class="th-sortable" @click="sortBy('rol')">
                Rol <span class="sort-icon">{{ sortIcon('rol') }}</span>
              </th>
              <th>Teléfono</th>
              <th class="th-sortable" @click="sortBy('fechaRegistro')">
                Fecha Registro <span class="sort-icon">{{ sortIcon('fechaRegistro') }}</span>
              </th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <TransitionGroup name="row">
              <tr
                v-for="u in usuariosOrdenados"
                :key="u.id"
                :class="{ 'row-flash': u.flash, 'row-eliminating': u.eliminating }"
              >
                <td>
                  <div class="user">
                    <div class="avatar" :style="{ background: avatarBg(u.nombre), color: avatarColor(u.nombre) }">
                      {{ u.iniciales }}
                    </div>
                    <div class="user-info">
                      <span class="user-name">{{ u.nombre }}</span>
                      <span class="user-handle">{{ u.email }}</span>
                    </div>
                  </div>
                </td>
                <td><span class="badge-role" :class="u.rol">{{ u.rolLabel }}</span></td>
                <td>
                  <div class="phone-cell">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"/>
                    </svg>
                    {{ u.telefono }}
                  </div>
                </td>
                <td>{{ u.fechaRegistro }}</td>
                <td>
                  <div class="actions">
                    <button class="action-btn edit-btn" @click="abrirModal(u)" title="Editar">
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z"/>
                      </svg>
                    </button>
                    <button class="action-btn delete-btn" @click="pedirEliminar(u.id)" title="Eliminar">
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </TransitionGroup>
            <!-- Estado vacío -->
            <tr v-if="usuariosOrdenados.length === 0">
              <td colspan="6" class="empty-state">
                <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>
                </svg>
                <p>No se encontraron usuarios</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <!-- MODAL -->
    <Transition name="modal">
      <div v-if="modalVisible" class="modal" @click.self="cerrarModal">
        <div class="modal-content">
          <h2>{{ editando ? 'Editar Usuario' : 'Nuevo Usuario' }}</h2>
          <span class="close" @click="cerrarModal">×</span>

          <label>Nombre Completo</label>
          <input
            v-model="form.nombre"
            type="text"
            placeholder="Nombre completo"
            :class="{ 'input-error': errores.nombre && formTouched }"
            @blur="formTouched = true"
          >
          <span v-if="errores.nombre && formTouched" class="error-msg">{{ errores.nombre }}</span>

          <label>Nombre de Usuario</label>
          <input
            v-model="form.nombreUsuario"
            type="text"
            placeholder="usuario123 (se genera automáticamente si lo dejas vacío)"
          >

          <label>Correo Electrónico</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="correo@ejemplo.com"
            :class="{ 'input-error': errores.email && formTouched }"
            @blur="formTouched = true"
          >
          <span v-if="errores.email && formTouched" class="error-msg">{{ errores.email }}</span>

          <label>Teléfono</label>
          <input
            v-model="form.telefono"
            type="tel"
            placeholder="+57 300 000 0000"
            :class="{ 'input-error': errores.telefono && formTouched }"
            @blur="formTouched = true"
          >
          <span v-if="errores.telefono && formTouched" class="error-msg">{{ errores.telefono }}</span>


          <label>Rol</label>
          <select v-model="form.Id_Rol" :class="{ 'input-error': errores.Id_Rol && formTouched }">
            <option value="" disabled>Selecciona un rol</option>
            <option v-for="r in roles" :key="r.Id_Rol" :value="r.Id_Rol">{{ r.Nombre_Rol }}</option>
          </select>
          <span v-if="errores.Id_Rol && formTouched" class="error-msg">{{ errores.Id_Rol }}</span>

          <label>Contraseña{{ editando ? ' (dejar vacío para no cambiar)' : '' }}</label>
          <input
            v-model="form.contrasena"
            type="password"
            :placeholder="editando ? 'Dejar vacío para mantener la actual' : 'Contraseña del usuario'"
            :class="{ 'input-error': errores.contrasena && formTouched }"
            @blur="formTouched = true"
          >
          <span v-if="errores.contrasena && formTouched" class="error-msg">{{ errores.contrasena }}</span>

          <!-- Preview del usuario -->
          <div v-if="form.nombre" class="user-preview">
            <div class="avatar" :style="{ background: avatarBg(form.nombre), color: avatarColor(form.nombre) }">
              {{ form.nombre.split(' ').map(p => p[0]).slice(0,2).join('').toUpperCase() }}
            </div>
            <div>
              <div class="user-name">{{ form.nombre }}</div>
              <div class="user-handle">{{ form.email || 'correo@ejemplo.com' }}</div>
            </div>
          </div>

          <div class="modal-buttons">
            <button class="btn-cancel" @click="cerrarModal">Cancelar</button>
            <button class="btn-submit" @click="guardarUsuario" :disabled="tieneErrores && formTouched">
              {{ editando ? 'Guardar Cambios' : 'Crear Usuario' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppSidebar from '../../components/AppSidebar.vue'
import {
  getUsuarios, getRoles, crearUsuario, actualizarUsuario
} from '../../services/api.js'

// ── ESTADO ──
const animVisible  = ref(false)
const cargando     = ref(true)
const guardando    = ref(false)
const searchFocus  = ref(false)
const busqueda     = ref('')
const filtroRol    = ref('')
const modalVisible = ref(false)
const editando     = ref(false)
const formTouched  = ref(false)
const roles        = ref([])   // lista de roles de la BD
const usuarios     = ref([])

const confirmDialog = ref({ visible: false, id: null })
const toast         = ref({ visible: false, msg: '', type: 'success' })

// ── ROL HELPERS ──
// Normaliza el nombre de rol de la BD al valor que usan los badges/filtros
const ROL_NORM = { 'administrador': 'administrador', 'admin': 'administrador', 'operario': 'operador', 'operador': 'operador', 'cliente': 'cliente' }
const ROL_LABEL= { administrador: 'Administrador', operador: 'Operario', cliente: 'Cliente' }
function normRol(nombreRol) { return ROL_NORM[(nombreRol || '').toLowerCase()] || 'operador' }

// ── MAPEO BD → vista ──
// usuarios.js devuelve el rol como campo "Rol" (alias del JOIN), no "Nombre_Rol"
// y el SELECT no expone Id_Rol directamente, lo buscamos desde roles[]
function mapear(u) {
  const rolNombreRaw = u.Rol || u.Nombre_Rol || ''
  const rol          = normRol(rolNombreRaw)
  const nombre       = u.Nombre_Completo || u.Nombre_Usuario || ''
  const rolObj       = roles.value.find(r =>
    (r.Nombre_Rol || '').toLowerCase() === rolNombreRaw.toLowerCase()
  )
  return {
    id:            u.Id_Usuario,
    nombre,
    nombreUsuario: u.Nombre_Usuario || '',
    email:         u.Correo         || '',
    telefono:      u.Telefono       || '',
    Id_Rol:        rolObj?.Id_Rol   ?? '',
    rol,
    rolLabel:      ROL_LABEL[rol]   || rolNombreRaw,
    estado:        u.Estado === 'activo' ? 'active' : 'inactive',
    fechaRegistro: u.Fecha_Registro ? new Date(u.Fecha_Registro).toLocaleDateString('es-CO') : '—',
    iniciales:     nombre.split(' ').map(p => p[0]).slice(0,2).join('').toUpperCase(),
    flash:         false,
    eliminating:   false,
  }
}

// ── CARGA INICIAL ──
async function cargarDatos() {
  cargando.value = true
  try {
    const [dataU, dataR] = await Promise.all([getUsuarios(), getRoles()])
    roles.value    = dataR
    // Solo mostrar usuarios activos en la lista
    usuarios.value = dataU.filter(u => u.Estado === 'activo').map(mapear)
  } catch (e) {
    mostrarToast('Error al cargar usuarios', 'danger')
  } finally {
    cargando.value = false
  }
}

onMounted(async () => {
  await cargarDatos()
  setTimeout(() => animVisible.value = true, 50)
  setTimeout(() => animateStats(), 200)
})

// ── TOAST ──
function mostrarToast(msg, type = 'success') {
  toast.value = { visible: true, msg, type }
  setTimeout(() => toast.value.visible = false, 2800)
}

// ── CONFIRM / ELIMINAR ──
function pedirEliminar(id) { confirmDialog.value = { visible: true, id } }

async function confirmarEliminar() {
  const id = confirmDialog.value.id
  confirmDialog.value.visible = false
  const u = usuarios.value.find(u => u.id === id)
  if (!u) return
  u.eliminating = true
  try {
    // Marcar como inactivo en la BD en lugar de eliminar
    await actualizarUsuario(id, {
      Id_Rol:          u.Id_Rol,
      Nombre_Completo: u.nombre,
      Nombre_Usuario:  u.nombreUsuario,
      Correo:          u.email,
      Telefono:        u.telefono || null,
      Estado:          'inactivo',
    })
    setTimeout(() => {
      usuarios.value = usuarios.value.filter(x => x.id !== id)
      animateStats()
      mostrarToast('Usuario desactivado', 'danger')
    }, 350)
  } catch (e) {
    u.eliminating = false
    mostrarToast(e.message || 'Error al desactivar', 'danger')
  }
}

// ── CONTADORES ANIMADOS ──
const statsDisplay = ref({ total: 0, activos: 0, operarios: 0, clientes: 0 })
function animateCount(key, target) {
  let val = 0
  const steps = 80
  const duration = 2000
  const intervalMs = Math.round(duration / steps)
  const step = Math.max(0.1, target / steps)
  const iv = setInterval(() => {
    val += step
    if (val >= target) { statsDisplay.value[key] = target; clearInterval(iv) }
    else statsDisplay.value[key] = Math.floor(val)
  }, intervalMs)
}
function animateStats() {
  animateCount('total',     usuarios.value.length)
  animateCount('activos',   usuarios.value.filter(u => u.estado === 'active').length)
  animateCount('operarios', usuarios.value.filter(u => u.rol === 'operador').length)
  animateCount('clientes',  usuarios.value.filter(u => u.rol === 'cliente').length)
}
const statsCards = computed(() => [
  { label: 'Total Usuarios', display: statsDisplay.value.total,    color: '' },
  { label: 'Activos',        display: statsDisplay.value.activos,   color: 'green' },
  { label: 'Operarios',      display: statsDisplay.value.operarios, color: 'blue' },
  { label: 'Clientes',       display: statsDisplay.value.clientes,  color: '' },
])

// ── AVATAR COLORS ──
const PALETTES = [
  { bg: '#dbeafe', color: '#1d4ed8' }, { bg: '#fce7f3', color: '#be185d' },
  { bg: '#d1fae5', color: '#065f46' }, { bg: '#fef9c3', color: '#92400e' },
  { bg: '#ede9fe', color: '#5b21b6' }, { bg: '#fee2e2', color: '#991b1b' },
]
function avatarBg(n)    { return PALETTES[(n?.charCodeAt(0)||0) % PALETTES.length].bg }
function avatarColor(n) { return PALETTES[(n?.charCodeAt(0)||0) % PALETTES.length].color }

// ── ORDENAMIENTO ──
const sortKey = ref('nombre')
const sortDir = ref(1)
function sortBy(key) { sortKey.value === key ? sortDir.value *= -1 : (sortKey.value = key, sortDir.value = 1) }
function sortIcon(key) { return sortKey.value !== key ? '⇅' : sortDir.value === 1 ? '↑' : '↓' }

// ── FILTRADO ──
const usuariosFiltrados = computed(() =>
  usuarios.value.filter(u => {
    const q = busqueda.value.toLowerCase()
    return (u.nombre.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
           (!filtroRol.value    || u.rol    === filtroRol.value)
  })
)
const usuariosOrdenados = computed(() =>
  [...usuariosFiltrados.value].sort((a, b) => {
    const va = a[sortKey.value] || '', vb = b[sortKey.value] || ''
    return (va > vb ? 1 : va < vb ? -1 : 0) * sortDir.value
  })
)

// ── VALIDACIÓN ──
const form = ref({ id: null, nombre: '', nombreUsuario: '', email: '', telefono: '', Id_Rol: '', estado: 'activo', contrasena: '' })
const errores = computed(() => ({
  nombre:   !form.value.nombre.trim()         ? 'El nombre es requerido'  : '',
  email:    !form.value.email.includes('@')   ? 'Ingresa un email válido' : '',
  Id_Rol:   !form.value.Id_Rol                ? 'Selecciona un rol'       : '',
  contrasena: !editando.value && !form.value.contrasena.trim() ? 'La contraseña es requerida' : '',
  telefono: form.value.telefono && !/^\+?[\d\s]{7,}$/.test(form.value.telefono) ? 'Teléfono inválido' : '',
}))
const tieneErrores = computed(() => Object.values(errores.value).some(e => e !== ''))

// ── MODAL ──
function abrirModal(usuario) {
  formTouched.value = false
  if (usuario) {
    editando.value = true
    form.value = {
      id:            usuario.id,
      nombre:        usuario.nombre,
      nombreUsuario: usuario.nombreUsuario,
      email:         usuario.email,
      telefono:      usuario.telefono,
      Id_Rol:        usuario.Id_Rol,
      estado:        usuario.estado === 'active' ? 'activo' : 'inactivo',
      contrasena:    '',
    }
  } else {
    editando.value = false
    form.value = { id: null, nombre: '', nombreUsuario: '', email: '', telefono: '', Id_Rol: roles.value[0]?.Id_Rol || '', estado: 'activo', contrasena: '' }
  }
  modalVisible.value = true
}
function cerrarModal() { modalVisible.value = false; formTouched.value = false }

async function guardarUsuario() {
  formTouched.value = true
  if (tieneErrores.value) return
  guardando.value = true

  const payload = {
    Nombre_Completo: form.value.nombre,
    Nombre_Usuario:  form.value.nombreUsuario || form.value.nombre.toLowerCase().replace(/\s+/g, '.'),
    Correo:          form.value.email,
    Telefono:        form.value.telefono  || null,
    Id_Rol:          form.value.Id_Rol,
    Estado:          form.value.estado,
    // Contraseña por defecto para usuarios nuevos; el admin deberá cambiarla
    ...(form.value.contrasena.trim() ? { Contrasena: form.value.contrasena.trim() } : {}),
  }

  try {
    if (editando.value) {
      await actualizarUsuario(form.value.id, payload)
      mostrarToast('Usuario actualizado correctamente', 'info')
    } else {
      await crearUsuario(payload)
      mostrarToast('Usuario creado exitosamente', 'success')
    }
    await cargarDatos()
    animateStats()
    cerrarModal()
  } catch (e) {
    mostrarToast(e.message || 'Error al guardar', 'danger')
  } finally {
    guardando.value = false
  }
}
</script>

<style scoped>
.layout { display: flex; min-height: 100vh; }
.main { flex: 1; padding: 28px 30px; }

/* ── ANIMACIONES DE ENTRADA ── */
.title, .top-bar, .stats, .table-box {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.title.visible     { opacity: 1; transform: none; transition-delay: 0ms; }
.top-bar.visible   { opacity: 1; transform: none; transition-delay: 80ms; }
.stats.visible     { opacity: 1; transform: none; transition-delay: 160ms; }
.table-box.visible { opacity: 1; transform: none; transition-delay: 240ms; }

.title { font-size: 26px; font-weight: 600; color: #111827; padding-bottom: 16px; margin-bottom: 20px; border-bottom: 1px solid #e5e7eb; }

/* ── TOP BAR ── */
.top-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; gap: 16px; flex-wrap: wrap; }
.filters { display: flex; gap: 12px; flex-wrap: wrap; }
.search {
  padding: 9px 12px 9px 36px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  font-size: 14px;
  background: white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 24 24' stroke='%239ca3af' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z'/%3E%3C/svg%3E") no-repeat 10px center;
  width: 220px; outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.search-focus { border-color: #1f3a52 !important; box-shadow: 0 0 0 3px rgba(31,58,82,0.1); }
.select { padding: 9px 32px 9px 12px; border-radius: 8px; border: 1px solid #e5e7eb; font-size: 14px; background: white; appearance: none; -webkit-appearance: none; outline: none; cursor: pointer; }
.select-wrapper { position: relative; display: inline-flex; align-items: center; }
.select-arrow { position: absolute; right: 10px; width: 14px; height: 14px; color: #6b7280; pointer-events: none; }
.btn { display: flex; align-items: center; gap: 8px; background: #1f3a52; color: white; border: none; padding: 10px 16px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; white-space: nowrap; transition: background 0.2s, transform 0.1s; }
.btn:hover { background: #162b3c; transform: translateY(-1px); }
.btn:active { transform: translateY(0); }
.btn-icon { width: 18px; height: 18px; }

/* ── STATS ── */
.stats { display: flex; gap: 20px; margin-bottom: 30px; }
.stat-card {
  background: white; flex: 1; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb;
  opacity: 0; transform: translateY(12px);
  transition: opacity 0.4s ease, transform 0.4s ease, box-shadow 0.2s;
}
.stats.visible .stat-card { opacity: 1; transform: none; }
.stat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); transform: translateY(-2px); }
.stat-card h3 { font-size: 14px; color: #6b7280; font-weight: 500; margin: 0; }
.stat-card p { font-size: 26px; font-weight: 600; margin: 10px 0 0 0; }
.green { color: #16a34a; } .blue { color: #2563eb; }

/* ── TABLA ── */
.table-box { background: white; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
.table-header { padding: 16px 18px; border-bottom: 1px solid #e5e7eb; font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 8px; }
table { width: 100%; border-collapse: collapse; }
thead { background: #f9fafb; }
th { font-size: 12px; font-weight: 600; color: #6b7280; padding: 14px 18px; text-align: left; }
.th-sortable { cursor: pointer; user-select: none; white-space: nowrap; transition: color 0.15s; }
.th-sortable:hover { color: #1f3a52; }
.sort-icon { font-size: 11px; margin-left: 4px; opacity: 0.6; }
td { padding: 14px 18px; font-size: 14px; border-top: 1px solid #f1f5f9; transition: background 0.2s; }
tbody tr:hover td { background: #f9fafb; }

/* ── ROW ANIMACIONES ── */
.row-flash td { background: #f0fdf4 !important; }
.row-eliminating { opacity: 0 !important; transform: translateX(20px) !important; transition: all 0.35s ease !important; }
.row-enter-active { transition: all 0.3s ease; }
.row-leave-active { transition: all 0.3s ease; }
.row-enter-from { opacity: 0; transform: translateY(-10px); }
.row-leave-to   { opacity: 0; transform: translateX(20px); }

/* ── USER ── */
.user { display: flex; align-items: center; gap: 10px; }
.user-info { display: flex; flex-direction: column; }
.user-name { font-weight: 500; font-size: 14px; }
.user-handle { font-size: 12px; color: #6b7280; }
.avatar {
  width: 34px; height: 34px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 600; flex-shrink: 0;
  transition: transform 0.2s;
}
.avatar:hover { transform: scale(1.1); }

/* ── BADGES ── */
.badge-role { padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
.badge-role.administrador { background: #f3f4f6; color: #374151; }
.badge-role.operador      { background: #e0ecff; color: #2563eb; }
.badge-role.cliente       { background: #fef9c3; color: #92400e; }
.badge-status { padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
.badge-status.active   { background: #dcfce7; color: #15803d; }
.badge-status.inactive { background: #e5e7eb; color: #374151; }
.phone-cell { display: flex; align-items: center; gap: 6px; color: #374151; }

/* ── ACCIONES ── */
.actions { display: flex; gap: 8px; align-items: center; }
.action-btn {
  width: 30px; height: 30px; border-radius: 6px; border: 1px solid #e5e7eb;
  background: white; display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.15s; color: #6b7280;
}
.edit-btn:hover   { background: #eff6ff; border-color: #bfdbfe; color: #2563eb; }
.delete-btn:hover { background: #fef2f2; border-color: #fecaca; color: #dc2626; }

/* ── ESTADO VACÍO ── */
.empty-state { text-align: center; padding: 48px 20px; color: #9ca3af; }
.empty-state svg { margin: 0 auto 12px; display: block; opacity: 0.4; }
.empty-state p { font-size: 14px; margin: 0; }

/* ── MODAL ── */
.modal { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 20px; }
.modal-content {
  background: white; width: 100%; max-width: 500px; max-height: 90vh;
  overflow-y: auto; padding: 30px; border-radius: 14px; position: relative;
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}
.modal-content h2 { font-size: 18px; font-weight: 600; margin: 0 0 20px 0; }
.close { position: absolute; top: 16px; right: 20px; font-size: 22px; cursor: pointer; color: #9ca3af; transition: color 0.15s; }
.close:hover { color: #374151; }
.modal-content label { display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 6px; margin-top: 14px; }
.modal-content input, .modal-content select {
  width: 100%; padding: 10px 12px; border: 1px solid #e5e7eb;
  border-radius: 8px; font-size: 14px; outline: none; box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.modal-content input:focus, .modal-content select:focus {
  border-color: #1f3a52; box-shadow: 0 0 0 3px rgba(31,58,82,0.1);
}
.input-error { border-color: #f87171 !important; }
.input-error:focus { box-shadow: 0 0 0 3px rgba(248,113,113,0.15) !important; }
.error-msg { font-size: 12px; color: #dc2626; margin-top: 4px; display: block; }

/* ── PREVIEW ── */
.user-preview {
  display: flex; align-items: center; gap: 12px;
  margin-top: 18px; padding: 12px 14px;
  background: #f9fafb; border-radius: 10px; border: 1px solid #e5e7eb;
}

/* ── BOTONES MODAL ── */
.modal-buttons { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
.btn-cancel { padding: 10px 20px; border-radius: 8px; border: 1px solid #e5e7eb; background: white; font-size: 14px; cursor: pointer; transition: background 0.15s; }
.btn-cancel:hover { background: #f3f4f6; }
.btn-submit {
  padding: 10px 20px; border-radius: 8px; border: none;
  background: #1f3a52; font-size: 14px; font-weight: 500; color: white;
  cursor: pointer; transition: background 0.2s, opacity 0.2s;
}
.btn-submit:hover:not(:disabled) { background: #162b3c; }
.btn-submit:disabled { opacity: 0.45; cursor: not-allowed; }

/* ── CONFIRM DIALOG ── */
.confirm-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.45);
  display: flex; justify-content: center; align-items: center; z-index: 1100;
}
.confirm-box {
  background: white; border-radius: 14px; padding: 28px 32px;
  max-width: 360px; width: 90%; text-align: center;
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}
.confirm-icon { color: #f59e0b; margin-bottom: 14px; }
.confirm-title { font-size: 16px; font-weight: 600; color: #111827; margin: 0 0 6px; }
.confirm-sub { font-size: 14px; color: #6b7280; margin: 0 0 20px; }
.confirm-btns { display: flex; gap: 10px; justify-content: center; }
.btn-danger { padding: 10px 20px; border-radius: 8px; border: none; background: #dc2626; color: white; font-size: 14px; font-weight: 500; cursor: pointer; transition: background 0.15s; }
.btn-danger:hover { background: #b91c1c; }

/* ── TOAST ── */
.toast {
  position: fixed; bottom: 24px; right: 24px; z-index: 2000;
  display: flex; align-items: center; gap: 8px;
  padding: 12px 18px; border-radius: 10px;
  font-size: 14px; font-weight: 500; color: white;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}
.toast.success { background: #16a34a; }
.toast.danger  { background: #dc2626; }
.toast.info    { background: #2563eb; }

/* ── TRANSICIONES ── */
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to       { opacity: 0; }

.toast-enter-active { transition: all 0.3s ease; }
.toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from   { opacity: 0; transform: translateY(12px); }
.toast-leave-to     { opacity: 0; transform: translateY(12px); }
</style>