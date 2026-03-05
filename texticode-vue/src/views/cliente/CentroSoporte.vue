<template>
  <div style="display:flex;min-height:100vh;background:#f5f6fa">
    <AppSidebar rol="cliente" />

    <main class="main">
      <h1>Centro de Soporte</h1>

      <!-- TABS -->
      <div class="tabs">
        <div class="tab" :class="{ active: tab === 'comprobantes' }" @click="tab = 'comprobantes'">Comprobantes</div>
        <div class="tab" :class="{ active: tab === 'contacto' }" @click="tab = 'contacto'">Contacto</div>
      </div>

      <!-- COMPROBANTES -->
      <div v-if="tab === 'comprobantes'">
        <div class="search-bar">
          <svg viewBox="0 0 24 24" fill="#aaa"><path d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/></svg>
          <input v-model="busqueda" placeholder="Buscar comprobante...">
        </div>

        <div v-for="c in comprobantes" :key="c.id" class="card">
          <div class="card-left">
            <div class="doc-icon"><svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#4a90d9"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z"/></svg></div>
            <div>
              <div class="doc-num">{{ c.numero }}</div>
              <span class="badge-available">Disponible</span>
            </div>
          </div>
          <div class="card-info">
            <div class="info-block"><label>Fecha</label><span>{{ c.fecha }}</span></div>
            <div class="info-block"><label>Productos</label><span>{{ c.productos }}</span></div>
            <div class="info-block"><label>Estado</label><span>{{ c.estado }}</span></div>
          </div>
          <div class="card-actions">
            <button class="btn-ver">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0Z"/></svg>
              Ver
            </button>
            <button class="btn-descargar">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>
              Descargar
            </button>
          </div>
        </div>
      </div>

      <!-- CONTACTO -->
      <div v-if="tab === 'contacto'" id="tab-contacto" style="display:block">
        <div class="contact-grid">
          <div class="contact-card">
            <div class="contact-card-icon"><svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg></div>
            <div class="contact-card-body"><h3>Teléfono</h3><p>Lunes a Viernes, 8am - 6pm</p><span>+57 (1) 234-5678</span></div>
          </div>
          <div class="contact-card">
            <div class="contact-card-icon"><svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg></div>
            <div class="contact-card-body"><h3>Email</h3><p>Respuesta en 24 horas</p><a href="mailto:soporte@texticode.com">soporte@texticode.com</a></div>
          </div>
        </div>

        <div class="contact-form-card">
          <h2>Enviar Mensaje</h2>
          <p>Completa el formulario y te contactaremos pronto.</p>
          <div class="form-row">
            <div class="form-group"><label>Nombre</label><input v-model="contactForm.nombre" type="text" placeholder="Tu nombre"></div>
            <div class="form-group"><label>Email</label><input v-model="contactForm.email" type="email" placeholder="tu@email.com"></div>
          </div>
          <div class="form-group"><label>Asunto</label><input v-model="contactForm.asunto" type="text" placeholder="¿En qué podemos ayudarte?"></div>
          <div class="form-group"><label>Mensaje</label><textarea v-model="contactForm.mensaje" rows="4" placeholder="Describe tu consulta..."></textarea></div>
          <button class="btn-enviar" @click="enviarMensaje">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/></svg>
            Enviar Mensaje
          </button>
        </div>

        <!-- TOAST -->
        <div v-if="toastVisible" class="toast show">✓ Mensaje enviado correctamente</div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppSidebar from '../../components/AppSidebar.vue'

const tab     = ref('comprobantes')
const busqueda = ref('')
const toastVisible = ref(false)
const contactForm = ref({ nombre: '', email: '', asunto: '', mensaje: '' })

const comprobantes = ref([
  { id: 1, numero: 'Comprobante #001', fecha: '2024-02-15', productos: 'Camisetas Polo x 50', estado: 'Entregado' },
  { id: 2, numero: 'Comprobante #002', fecha: '2024-03-01', productos: 'Pantalones x 30',     estado: 'Entregado' },
])

function enviarMensaje() {
  if (!contactForm.value.nombre || !contactForm.value.mensaje) return
  toastVisible.value = true
  contactForm.value = { nombre: '', email: '', asunto: '', mensaje: '' }
  setTimeout(() => { toastVisible.value = false }, 3000)
}
</script>

<style scoped>
.main { flex: 1; padding: 32px; overflow-y: auto; }
h1 { font-size: 28px; font-weight: 700; color: #1a1a2e; margin-bottom: 24px; }
.tabs { display: flex; background: #ebebeb; border-radius: 12px; padding: 4px; margin-bottom: 20px; max-width: 860px; }
.tab { flex: 1; padding: 10px; text-align: center; border-radius: 10px; cursor: pointer; font-size: 14px; font-weight: 500; color: #555; }
.tab.active { background: white; color: #1a1a2e; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
.search-bar { display: flex; align-items: center; background: #f0f2f5; border-radius: 10px; padding: 10px 16px; gap: 8px; max-width: 320px; margin-bottom: 24px; }
.search-bar input { border: none; background: transparent; outline: none; font-size: 14px; color: #555; width: 100%; }
.search-bar svg { width: 16px; height: 16px; }
.card { background: white; border-radius: 14px; padding: 20px 24px; margin-bottom: 16px; max-width: 860px; display: flex; align-items: center; gap: 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
.card-left { display: flex; align-items: center; gap: 12px; min-width: 120px; }
.doc-num { font-size: 16px; font-weight: 600; color: #1a1a2e; }
.badge-available { background: #e6f9f0; color: #27ae60; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; }
.card-info { display: flex; gap: 40px; flex: 1; }
.info-block label { font-size: 12px; color: #888; display: block; margin-bottom: 2px; }
.info-block span { font-size: 14px; font-weight: 600; color: #1a1a2e; }
.card-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
.btn-ver { display: flex; align-items: center; gap: 6px; border: 1px solid #ddd; background: white; border-radius: 8px; padding: 6px 14px; font-size: 13px; cursor: pointer; }
.btn-descargar { display: flex; align-items: center; gap: 6px; background: #1a3a4a; color: white; border: none; border-radius: 8px; padding: 8px 18px; font-size: 13px; cursor: pointer; font-weight: 600; }
.contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; max-width: 860px; }
.contact-card { background: white; border-radius: 14px; padding: 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); display: flex; align-items: flex-start; gap: 16px; }
.contact-card-icon { width: 44px; height: 44px; border-radius: 10px; background: #f0f4f8; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.contact-card-body h3 { font-size: 14px; font-weight: 700; margin-bottom: 4px; }
.contact-card-body p { font-size: 13px; color: #888; margin-bottom: 8px; }
.contact-card-body a, .contact-card-body span { font-size: 14px; font-weight: 600; color: #1a3a4a; text-decoration: none; }
.contact-form-card { background: white; border-radius: 14px; padding: 28px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); max-width: 860px; }
.contact-form-card h2 { font-size: 18px; font-weight: 700; margin-bottom: 6px; }
.contact-form-card p { font-size: 13px; color: #888; margin-bottom: 24px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
.form-group label { font-size: 12px; font-weight: 600; color: #444; }
.form-group input, .form-group textarea { border: 1px solid #e0e3e8; border-radius: 8px; padding: 10px 14px; font-size: 14px; outline: none; font-family: inherit; background: #fafbfc; }
.form-group textarea { resize: vertical; min-height: 110px; }
.btn-enviar { background: #1a3a4a; color: white; border: none; border-radius: 8px; padding: 12px 28px; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; }
.toast { position: fixed; top: 24px; right: 24px; background: #27ae60; color: white; padding: 14px 20px; border-radius: 10px; font-size: 14px; font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 999; }
</style>
