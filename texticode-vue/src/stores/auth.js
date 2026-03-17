import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loginUsuario } from '../services/api'
 
export const useAuthStore = defineStore('auth', () => {
  const usuario = ref(null)
 
  // Rol normalizado: demo guarda { rol: 'operario' }, API real devuelve { Rol: 'Operario' }
  const rol = computed(() => {
    if (!usuario.value) return null
    if (usuario.value.rol) return usuario.value.rol
    if (usuario.value.Rol) return usuario.value.Rol.toLowerCase()
    return null
  })
 
  // ID real de BD — null si es demo
  const idUsuario = computed(() => usuario.value?.Id_Usuario ?? null)
 
  const estaLogueado = computed(() => !!usuario.value)
 
  // Login demo (botones de acceso rápido — no toca la BD)
  function login(datos) {
    usuario.value = datos
  }
 
  // Login real contra la BD
  async function loginConCredenciales(correo, contrasena) {
    const data = await loginUsuario({ correo, contrasena })
    usuario.value = {
      ...data.usuario,
      rol: data.usuario.Rol?.toLowerCase(),
    }
    return usuario.value
  }
 
  function logout() {
    usuario.value = null
  }
 
  return { usuario, rol, idUsuario, estaLogueado, login, loginConCredenciales, logout }
})
 