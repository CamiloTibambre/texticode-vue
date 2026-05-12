import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  // LANDING — primera vista
  { path: '/',      name: 'Landing', component: () => import('../views/LandingView.vue') },

  // LOGIN
  { path: '/login', name: 'Login',   component: () => import('../views/LoginView.vue') },

  // CAMBIAR CONTRASEÑA (recuperación por correo)
  { path: '/cambiar-contrasena', name: 'CambiarContrasena', component: () => import('../views/CambiarContrasena.vue') },

  // ADMINISTRADOR
  { path: '/admin/usuarios',   name: 'AdminUsuarios',   component: () => import('../views/admin/GestionUsuarios.vue'),   meta: { rol: 'admin' } },
  { path: '/admin/clientes',   name: 'AdminClientes',   component: () => import('../views/admin/GestionClientes.vue'),   meta: { rol: 'admin' } },
  { path: '/admin/inventario', name: 'AdminInventario', component: () => import('../views/admin/GestionInventario.vue'), meta: { rol: 'admin' } },
  { path: '/admin/reportes',   name: 'AdminReportes',   component: () => import('../views/admin/Reportes.vue'),          meta: { rol: 'admin' } },
  { path: '/admin/produccion', name: 'AdminProduccion', component: () => import('../views/admin/GestionProduccion.vue'), meta: { rol: 'admin' } },
  { path: '/admin/calendario', name: 'AdminCalendario', component: () => import('../views/CalendarioGoogle.vue'), meta: { rol: 'admin' } },

  // OPERARIO
  { path: '/operario/cuenta',  name: 'OperarioCuenta',  component: () => import('../views/operario/CuentaPersonal.vue'),  meta: { rol: 'operario' } },
  { path: '/operario/tareas',  name: 'OperarioTareas',  component: () => import('../views/operario/TareasAsignadas.vue'), meta: { rol: 'operario' } },
  { path: '/operario/avances', name: 'OperarioAvances', component: () => import('../views/operario/ReportarAvances.vue'), meta: { rol: 'operario' } },
  { path: '/operario/calendario', name: 'OperarioCalendario', component: () => import('../views/CalendarioGoogle.vue'), meta: { rol: 'operario' } },

  // CLIENTE
  { path: '/cliente/cuenta',   name: 'ClienteCuenta',   component: () => import('../views/cliente/CuentaPersonal.vue'),   meta: { rol: 'cliente' } },
  { path: '/cliente/pedidos',  name: 'ClientePedidos',  component: () => import('../views/cliente/PedidosEntregas.vue'),  meta: { rol: 'cliente' } },
  { path: '/cliente/soporte',  name: 'ClienteSoporte',  component: () => import('../views/cliente/CentroSoporte.vue'),    meta: { rol: 'cliente' } },
  { path: '/cliente/calendario', name: 'ClienteCalendario', component: () => import('../views/CalendarioGoogle.vue'), meta: { rol: 'cliente' } },

  // 404
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  },
})

function normalizarRol(rol) {
  if (!rol) return null
  const r = rol.toLowerCase()
  if (r === 'administrador') return 'admin'
  return r
}

router.beforeEach((to) => {
  const auth = useAuthStore()
  const rol  = normalizarRol(auth.rol)

  if (to.meta.rol) {
    if (!auth.estaLogueado) return { name: 'Login' }
    if (rol !== to.meta.rol) return { name: 'Login' }
  }

  if ((to.name === 'Login' || to.name === 'Landing') && auth.estaLogueado) {
    if (rol === 'admin')    return { name: 'AdminUsuarios' }
    if (rol === 'operario') return { name: 'OperarioCuenta' }
    if (rol === 'cliente')  return { name: 'ClienteCuenta' }
  }
})

export default router