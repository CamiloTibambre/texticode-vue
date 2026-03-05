import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  // ── LOGIN ──────────────────────────────────────────────────
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/LoginView.vue')
  },

  // ── ADMINISTRADOR ──────────────────────────────────────────
  {
    path: '/admin/usuarios',
    name: 'AdminUsuarios',
    component: () => import('../views/admin/GestionUsuarios.vue'),
    meta: { rol: 'admin' }
  },
  {
    path: '/admin/clientes',
    name: 'AdminClientes',
    component: () => import('../views/admin/GestionClientes.vue'),
    meta: { rol: 'admin' }
  },
  {
    path: '/admin/inventario',
    name: 'AdminInventario',
    component: () => import('../views/admin/GestionInventario.vue'),
    meta: { rol: 'admin' }
  },
  {
    path: '/admin/reportes',
    name: 'AdminReportes',
    component: () => import('../views/admin/Reportes.vue'),
    meta: { rol: 'admin' }
  },
  {
    path: '/admin/produccion',
    name: 'AdminProduccion',
    component: () => import('../views/admin/GestionProduccion.vue'),
    meta: { rol: 'admin' }
  },

  // ── OPERARIO ───────────────────────────────────────────────
  {
    path: '/operario/cuenta',
    name: 'OperarioCuenta',
    component: () => import('../views/operario/CuentaPersonal.vue'),
    meta: { rol: 'operario' }
  },
  {
    path: '/operario/tareas',
    name: 'OperarioTareas',
    component: () => import('../views/operario/TareasAsignadas.vue'),
    meta: { rol: 'operario' }
  },
  {
    path: '/operario/avances',
    name: 'OperarioAvances',
    component: () => import('../views/operario/ReportarAvances.vue'),
    meta: { rol: 'operario' }
  },

  // ── CLIENTE ────────────────────────────────────────────────
  {
    path: '/cliente/cuenta',
    name: 'ClienteCuenta',
    component: () => import('../views/cliente/CuentaPersonal.vue'),
    meta: { rol: 'cliente' }
  },
  {
    path: '/cliente/pedidos',
    name: 'ClientePedidos',
    component: () => import('../views/cliente/PedidosEntregas.vue'),
    meta: { rol: 'cliente' }
  },
  {
    path: '/cliente/soporte',
    name: 'ClienteSoporte',
    component: () => import('../views/cliente/CentroSoporte.vue'),
    meta: { rol: 'cliente' }
  },

  // ── 404 ────────────────────────────────────────────────────
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 🔒 Guard de navegación: protege rutas por rol
router.beforeEach((to) => {
  const auth = useAuthStore()

  // Si la ruta requiere un rol
  if (to.meta.rol) {
    // Si no está logueado → redirige al login
    if (!auth.estaLogueado) return { name: 'Login' }

    // Si no tiene el rol correcto → redirige al login
    if (auth.rol !== to.meta.rol) return { name: 'Login' }
  }

  // Si ya está logueado y trata de ir al login → redirige a su panel
  if (to.name === 'Login' && auth.estaLogueado) {
    if (auth.rol === 'admin')    return { name: 'AdminUsuarios' }
    if (auth.rol === 'operario') return { name: 'OperarioCuenta' }
    if (auth.rol === 'cliente')  return { name: 'ClienteCuenta' }
  }
})

export default router
