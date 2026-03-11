<template>
  <div class="layout">
    <AppSidebar rol="admin" />

    <main class="main">
      <div class="title">Gestión de Usuarios</div>

      <!-- TOP BAR -->
      <div class="top-bar">
        <div class="filters">
          <input v-model="busqueda" class="search" type="text" placeholder="Buscar usuarios...">
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
          <div class="select-wrapper">
            <select v-model="filtroEstado" class="select">
              <option value="">Todos los estados</option>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
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
      <div class="stats">
        <div class="stat-card">
          <h3>Total Usuarios</h3>
          <p>{{ usuarios.length }}</p>
        </div>
        <div class="stat-card">
          <h3>Activos</h3>
          <p class="green">{{ usuarios.filter(u => u.estado === 'active').length }}</p>
        </div>
        <div class="stat-card">
          <h3>Operarios</h3>
          <p class="blue">{{ usuarios.filter(u => u.rol === 'operador').length }}</p>
        </div>
        <div class="stat-card">
          <h3>Clientes</h3>
          <p>{{ usuarios.filter(u => u.rol === 'cliente').length }}</p>
        </div>
      </div>

      <!-- TABLA -->
      <div class="table-box">
        <div class="table-header">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"/>
          </svg>
          Lista de Usuarios ({{ usuariosFiltrados.length }})
        </div>
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Teléfono</th>
              <th>Fecha Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in usuariosFiltrados" :key="u.id">
              <td>
                <div class="user">
                  <div class="avatar" :class="u.avatarClass">{{ u.iniciales }}</div>
                  <div class="user-info">
                    <span class="user-name">{{ u.nombre }}</span>
                    <span class="user-handle">{{ u.email }}</span>
                  </div>
                </div>
              </td>
              <td><span class="badge-role" :class="u.rol">{{ u.rolLabel }}</span></td>
              <td><span class="badge-status" :class="u.estado">{{ u.estado === 'active' ? 'Activo' : 'Inactivo' }}</span></td>
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
                  <svg @click="abrirModal(u)" class="icon edit-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z"/>
                  </svg>
                  <svg @click="eliminarUsuario(u.id)" class="icon delete-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                  </svg>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <!-- MODAL -->
    <div v-if="modalVisible" class="modal" @click.self="cerrarModal">
      <div class="modal-content">
        <h2>{{ editando ? 'Editar Usuario' : 'Nuevo Usuario' }}</h2>
        <span class="close" @click="cerrarModal">×</span>

        <label>Nombre Completo</label>
        <input v-model="form.nombre" type="text" placeholder="Nombre completo">

        <label>Correo Electrónico</label>
        <input v-model="form.email" type="email" placeholder="correo@ejemplo.com">

        <label>Teléfono</label>
        <input v-model="form.telefono" type="tel" placeholder="+57 300 000 0000">

        <label>Rol</label>
        <select v-model="form.rol">
          <option value="administrador">Administrador</option>
          <option value="operador">Operario</option>
          <option value="cliente">Cliente</option>
        </select>

        <div class="modal-buttons">
          <button class="btn-cancel" @click="cerrarModal">Cancelar</button>
          <button class="btn-submit" @click="guardarUsuario">
            {{ editando ? 'Guardar Cambios' : 'Crear Usuario' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppSidebar from '../../components/AppSidebar.vue'

const busqueda    = ref('')
const filtroRol   = ref('')
const filtroEstado = ref('')
const modalVisible = ref(false)
const editando    = ref(false)

const form = ref({ id: null, nombre: '', email: '', telefono: '', rol: 'operador', estado: 'active' })

const usuarios = ref([
  { id: 1, nombre: 'Admin Texticode', email: 'admin@texticode.com', telefono: '+57 300 000 0001', rol: 'administrador', rolLabel: 'Administrador', estado: 'active', iniciales: 'AT', avatarClass: '', fechaRegistro: '2024-01-01' },
  { id: 2, nombre: 'Carlos Mendoza',  email: 'carlos@texticode.com', telefono: '+57 300 123 4567', rol: 'operador', rolLabel: 'Operario', estado: 'active', iniciales: 'CM', avatarClass: 'avatar-blue', fechaRegistro: '2024-01-15' },
  { id: 3, nombre: 'María González',  email: 'maria@empresa.com',   telefono: '+57 300 987 6543', rol: 'cliente',  rolLabel: 'Cliente',  estado: 'active', iniciales: 'MG', avatarClass: 'avatar-pink', fechaRegistro: '2024-02-01' },
  { id: 4, nombre: 'Juan Pérez',      email: 'juan@comercial.com',  telefono: '+57 300 555 7890', rol: 'cliente',  rolLabel: 'Cliente',  estado: 'active', iniciales: 'JP', avatarClass: '', fechaRegistro: '2024-02-05' },
])

const usuariosFiltrados = computed(() =>
  usuarios.value.filter(u => {
    const matchBusqueda = u.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
                          u.email.toLowerCase().includes(busqueda.value.toLowerCase())
    const matchRol    = !filtroRol.value    || u.rol    === filtroRol.value
    const matchEstado = !filtroEstado.value || u.estado === filtroEstado.value
    return matchBusqueda && matchRol && matchEstado
  })
)

function abrirModal(usuario) {
  if (usuario) {
    editando.value = true
    form.value = { ...usuario }
  } else {
    editando.value = false
    form.value = { id: null, nombre: '', email: '', telefono: '', rol: 'operador', estado: 'active' }
  }
  modalVisible.value = true
}

function cerrarModal() { modalVisible.value = false }

function guardarUsuario() {
  if (!form.value.nombre || !form.value.email) return
  const rolLabels = { administrador: 'Administrador', operador: 'Operario', cliente: 'Cliente' }
  if (editando.value) {
    const idx = usuarios.value.findIndex(u => u.id === form.value.id)
    if (idx !== -1) usuarios.value[idx] = { ...form.value, rolLabel: rolLabels[form.value.rol], iniciales: form.value.nombre.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase(), avatarClass: '' }
  } else {
    usuarios.value.push({
      ...form.value,
      id: Date.now(),
      rolLabel: rolLabels[form.value.rol],
      iniciales: form.value.nombre.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase(),
      avatarClass: '',
      fechaRegistro: new Date().toISOString().split('T')[0]
    })
  }
  cerrarModal()
}

function eliminarUsuario(id) {
  if (confirm('¿Eliminar este usuario?')) {
    usuarios.value = usuarios.value.filter(u => u.id !== id)
  }
}
</script>

<style scoped>
.layout { display: flex; min-height: 100vh; }
.main { flex: 1; padding: 28px 30px; }
.title { font-size: 26px; font-weight: 600; color: #111827; padding-bottom: 16px; margin-bottom: 20px; border-bottom: 1px solid #e5e7eb; }
.top-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; gap: 16px; flex-wrap: wrap; }
.filters { display: flex; gap: 12px; flex-wrap: wrap; }
.search { padding: 9px 12px 9px 36px; border-radius: 8px; border: 1px solid #e5e7eb; font-size: 14px; background: white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 24 24' stroke='%239ca3af' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z'/%3E%3C/svg%3E") no-repeat 10px center; width: 220px; outline: none; }
.select { padding: 9px 32px 9px 12px; border-radius: 8px; border: 1px solid #e5e7eb; font-size: 14px; background: white; appearance: none; -webkit-appearance: none; outline: none; cursor: pointer; }
.select-wrapper { position: relative; display: inline-flex; align-items: center; }
.select-arrow { position: absolute; right: 10px; width: 14px; height: 14px; color: #6b7280; pointer-events: none; }
.btn { display: flex; align-items: center; gap: 8px; background: #1f3a52; color: white; border: none; padding: 10px 16px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; white-space: nowrap; }
.btn:hover { background: #162b3c; }
.btn-icon { width: 18px; height: 18px; }
.stats { display: flex; gap: 20px; margin-bottom: 30px; }
.stat-card { background: white; flex: 1; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb; }
.stat-card h3 { font-size: 14px; color: #6b7280; font-weight: 500; margin: 0; }
.stat-card p { font-size: 26px; font-weight: 600; margin: 10px 0 0 0; }
.green { color: #16a34a; } .blue { color: #2563eb; }
.table-box { background: white; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
.table-header { padding: 16px 18px; border-bottom: 1px solid #e5e7eb; font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 8px; }
table { width: 100%; border-collapse: collapse; }
thead { background: #f9fafb; }
th { font-size: 12px; font-weight: 600; color: #6b7280; padding: 14px 18px; text-align: left; }
td { padding: 14px 18px; font-size: 14px; border-top: 1px solid #f1f5f9; }
.user { display: flex; align-items: center; gap: 10px; }
.user-info { display: flex; flex-direction: column; }
.user-name { font-weight: 500; font-size: 14px; }
.user-handle { font-size: 12px; color: #6b7280; }
.avatar { width: 34px; height: 34px; border-radius: 50%; background: #e5e7eb; color: #374151; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; flex-shrink: 0; }
.avatar-blue { background: #dbeafe; color: #1d4ed8; }
.avatar-pink { background: #fce7f3; color: #be185d; }
.badge-role { padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
.badge-role.administrador { background: #f3f4f6; color: #374151; }
.badge-role.operador { background: #e0ecff; color: #2563eb; }
.badge-role.cliente { background: #fef9c3; color: #92400e; }
.badge-status { padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
.badge-status.active { background: #dcfce7; color: #15803d; }
.badge-status.inactive { background: #e5e7eb; color: #374151; }
.phone-cell { display: flex; align-items: center; gap: 6px; color: #374151; }
.actions { display: flex; gap: 16px; align-items: center; }
.icon { width: 18px; height: 18px; cursor: pointer; transition: color 0.15s; }
.edit-icon { color: #6b7280; } .edit-icon:hover { color: #1f3a52; }
.delete-icon { color: #6b7280; } .delete-icon:hover { color: #dc2626; }
.modal { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 20px; }
.modal-content { background: white; width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; padding: 30px; border-radius: 14px; position: relative; animation: fadeIn 0.2s ease; box-shadow: 0 20px 40px rgba(0,0,0,0.15); }
.modal-content h2 { font-size: 18px; font-weight: 600; margin-bottom: 20px; }
.close { position: absolute; top: 16px; right: 20px; font-size: 22px; cursor: pointer; color: #9ca3af; }
.modal-content label { display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 6px; margin-top: 14px; }
.modal-content input, .modal-content select { width: 100%; padding: 10px 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none; }
.modal-buttons { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
.btn-cancel { padding: 10px 20px; border-radius: 8px; border: 1px solid #e5e7eb; background: white; font-size: 14px; cursor: pointer; }
.btn-submit { padding: 10px 20px; border-radius: 8px; border: none; background: #1f3a52; font-size: 14px; font-weight: 500; color: white; cursor: pointer; }
@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
</style>