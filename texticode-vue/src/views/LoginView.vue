<template>
  <div class="login-page">
    <div class="login-card">
      <div class="logo-wrap">
        <img src="/img/LogoTexticode.png" alt="Texticode" class="logo-img">
      </div>
      <h1>Bienvenido a Texticode</h1>
      <p class="subtitle">Inicia sesión para acceder a tu panel</p>

      <div class="form">
        <div class="form-group">
          <label>Correo electrónico</label>
          <input v-model="email" type="email" placeholder="tu@correo.com" @keyup.enter="iniciarSesion">
        </div>
        <div class="form-group">
          <label>Contraseña</label>
          <input v-model="password" type="password" placeholder="••••••••" @keyup.enter="iniciarSesion">
        </div>

        <p v-if="error" class="error-msg">{{ error }}</p>

        <button class="btn-login" @click="iniciarSesion">Iniciar Sesión</button>
      </div>

      <!-- Demo: botones de acceso rápido por rol -->
      <div class="demo-access">
        <p class="demo-label">Acceso rápido (demo)</p>
        <div class="demo-btns">
          <button @click="loginDemo('admin')"    class="demo-btn admin">Admin</button>
          <button @click="loginDemo('operario')" class="demo-btn operario">Operario</button>
          <button @click="loginDemo('cliente')"  class="demo-btn cliente">Cliente</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const email    = ref('')
const password = ref('')
const error    = ref('')
const router   = useRouter()
const auth     = useAuthStore()

// Login real (aquí conectarás Supabase)
function iniciarSesion() {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Por favor completa todos los campos.'
    return
  }
  // TODO: conectar con Supabase Auth
  error.value = 'Credenciales incorrectas. Usa los botones demo por ahora.'
}

// Login demo para probar los paneles
function loginDemo(rol) {
  const usuarios = {
    admin:    { nombre: 'Admin Texticode', rol: 'admin',    email: 'admin@texticode.com' },
    operario: { nombre: 'Carlos Mendoza',  rol: 'operario', email: 'carlos@texticode.com' },
    cliente:  { nombre: 'María González',  rol: 'cliente',  email: 'maria@empresa.com' },
  }
  auth.login(usuarios[rol])

  if (rol === 'admin')    router.push('/admin/usuarios')
  if (rol === 'operario') router.push('/operario/cuenta')
  if (rol === 'cliente')  router.push('/cliente/cuenta')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.login-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  text-align: center;
}
.logo-wrap { margin-bottom: 20px; }
.logo-img { width: 140px; }
h1 { font-size: 22px; font-weight: 700; color: #111827; margin-bottom: 6px; }
.subtitle { font-size: 14px; color: #6b7280; margin-bottom: 28px; }
.form { text-align: left; }
.form-group { display: flex; flex-direction: column; gap: 5px; margin-bottom: 16px; }
.form-group label { font-size: 13px; font-weight: 600; color: #374151; }
.form-group input {
  border: 1px solid #e5e7eb; border-radius: 8px;
  padding: 10px 14px; font-size: 14px; outline: none;
  transition: border-color 0.2s;
}
.form-group input:focus { border-color: #1f3a52; }
.error-msg { color: #dc2626; font-size: 13px; margin-bottom: 12px; }
.btn-login {
  width: 100%; padding: 12px; background: #1f3a52;
  color: white; border: none; border-radius: 8px;
  font-size: 15px; font-weight: 600; cursor: pointer;
  transition: background 0.2s;
}
.btn-login:hover { background: #2d5070; }
.demo-access { margin-top: 28px; }
.demo-label { font-size: 12px; color: #9ca3af; margin-bottom: 10px; }
.demo-btns { display: flex; gap: 8px; justify-content: center; }
.demo-btn {
  padding: 8px 18px; border: none; border-radius: 8px;
  font-size: 13px; font-weight: 600; cursor: pointer;
}
.demo-btn.admin    { background: #1f3a52; color: white; }
.demo-btn.operario { background: #2563eb; color: white; }
.demo-btn.cliente  { background: #16a34a; color: white; }
</style>
