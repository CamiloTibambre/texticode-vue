import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // Estado del usuario logueado
  const usuario = ref(null)

  // Getter: rol del usuario actual
  const rol = computed(() => usuario.value?.rol || null)
  const estaLogueado = computed(() => !!usuario.value)

  // Simular login (aquí conectarás con Supabase después)
  function login(datos) {
    usuario.value = datos
  }

  function logout() {
    usuario.value = null
  }

  return { usuario, rol, estaLogueado, login, logout }
})
