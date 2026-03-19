import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loginUsuario } from '../services/api'

export const useAuthStore = defineStore('auth', () => {

  const token   = ref(localStorage.getItem('jwt_token') || null)
  const usuario = ref(JSON.parse(localStorage.getItem('usuario') || 'null'))

  const rol = computed(() => {
    if (!usuario.value) return null
    const r = usuario.value.Rol || usuario.value.rol || ''
    return r.toLowerCase()
  })

  const idUsuario    = computed(() => usuario.value?.Id_Usuario ?? null)
  const estaLogueado = computed(() => !!usuario.value)

  async function loginConCredenciales(correo, contrasena) {
    const data = await loginUsuario({ correo, contrasena })

    // El backend devuelve { mensaje, usuario } — token es opcional por ahora
    const user = data.usuario

    // Guardar token si existe, si no guardar un placeholder
    token.value   = data.token || 'session_activa'
    usuario.value = {
      ...user,
      rol: (user.Rol || '').toLowerCase(),
    }

    localStorage.setItem('jwt_token', token.value)
    localStorage.setItem('usuario',   JSON.stringify(usuario.value))

    return usuario.value
  }

  function logout() {
    token.value   = null
    usuario.value = null
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('usuario')
  }

  function authHeader() {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {}
  }

  return {
    token,
    usuario,
    rol,
    idUsuario,
    estaLogueado,
    loginConCredenciales,
    logout,
    authHeader,
  }
})
