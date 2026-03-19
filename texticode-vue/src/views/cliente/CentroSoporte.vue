<template>
  <div style="display:flex; min-height:100vh; background:#f5f6fa;">
    <AppSidebar rol="cliente" />

    <main class="main">
      <h1>Centro de Soporte</h1>

      <!-- TABS -->
      <div class="tabs">
        <div class="tab" :class="{ active: tab === 'comprobantes' }" @click="tab = 'comprobantes'">Comprobantes</div>
        <div class="tab" :class="{ active: tab === 'contacto' }" @click="tab = 'contacto'">Contacto</div>
      </div>

      <!-- TAB COMPROBANTES -->
      <div v-if="tab === 'comprobantes'" id="tab-comprobantes">
        <div class="search-bar">
          <svg viewBox="0 0 24 24">
            <path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" stroke="#aaa" stroke-width="2" fill="none"/>
          </svg>
          <input v-model="busqueda" type="text" placeholder="Buscar comprobantes...">
        </div>

        <div v-for="c in comprobanteFiltrados" :key="c.id" class="card">
          <div class="card-left">
            <div class="doc-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#4a90d9" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <span class="doc-num">{{ c.numero }}</span>
            <span class="badge-available">Disponible</span>
          </div>
          <div class="card-info">
            <div class="info-block"><label>Tipo:</label><span>{{ c.tipo }}</span></div>
            <div class="info-block"><label>Fecha entrega:</label><span>{{ c.fecha }}</span></div>
            <div class="info-block"><label>Tamaño:</label><span>{{ c.tamano }}</span></div>
            <div class="info-block"><label>Cliente:</label><span>{{ c.cliente }}</span></div>
          </div>
          <div class="card-actions">
            <button class="btn-ver">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              Ver
            </button>
            <button class="btn-descargar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Descargar
            </button>
          </div>
        </div>
      </div>

      <!-- TAB CONTACTO -->
      <div v-if="tab === 'contacto'" id="tab-contacto">
        <div class="contacto-grid">

          <!-- Tarjeta: Información de Contacto -->
          <div class="info-card">
            <div class="info-card-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#444" stroke-width="1.8">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.45 2 2 0 0 1 3.54 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 6 6l1.62-1.62a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <span>Información de Contacto</span>
            </div>

            <!-- Teléfono -->
            <div class="info-row">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="1.8">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.45 2 2 0 0 1 3.54 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 6 6l1.62-1.62a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <div>
                <div class="info-label">Teléfono</div>
                <a href="tel:" class="info-value">+57 (4) 444-5555</a>
              </div>
            </div>

            <!-- WhatsApp -->
            <div class="info-row">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="1.8">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
              <div>
                <div class="info-label">WhatsApp</div>
                <a href="https://wa.me/" class="info-value">+57 300 123 4567</a>
              </div>
            </div>

            <!-- Email -->
            <div class="info-row">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="1.8">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <div>
                <div class="info-label">Email</div>
                <a href="mailto:soporte@texticode.com" class="info-value">soporte@texticode.com</a>
              </div>
            </div>

            <!-- Dirección -->
            <div class="info-row">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="1.8">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <div>
                <div class="info-label">Dirección</div>
                <span class="info-value">Carrera 70 #45-30, Bogotá, Colombia</span>
              </div>
            </div>

            <!-- Horarios -->
            <div class="info-row">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="1.8">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <div>
                <div class="info-label">Horarios de Atención</div>
                <div class="info-value">Lunes a Viernes: 8:00 AM - 6:00 PM</div>
                <div class="info-value">Sábados: 8:00 AM - 12:00 PM</div>
              </div>
            </div>
          </div>

          <!-- Tarjeta: Preguntas Frecuentes -->
          <div class="info-card">
            <div class="info-card-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#444" stroke-width="1.8">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <span>Preguntas Frecuentes</span>
            </div>

            <div v-for="faq in faqs" :key="faq.id" class="faq-row">
              <div class="faq-bar" :style="{ background: faq.color }"></div>
              <div>
                <div class="faq-question">{{ faq.pregunta }}</div>
                <div class="faq-answer">{{ faq.respuesta }}</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>

    <button class="help-btn">?</button>

    <!-- TOAST -->
    <div class="toast" :class="{ show: toastVisible }">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" stroke-width="2">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      ¡Mensaje enviado con éxito! Te responderemos pronto.
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppSidebar from '../../components/AppSidebar.vue'

const tab          = ref('comprobantes')
const busqueda     = ref('')
const toastVisible = ref(false)

const comprobantes = ref([
  { id: 1, numero: '001', tipo: 'Comprobante', fecha: '19/01/2024', tamano: '245 KB', cliente: 'María González' },
  { id: 2, numero: '002', tipo: 'Factura',     fecha: '16/01/2024', tamano: '189 KB', cliente: 'María González' },
  { id: 3, numero: '003', tipo: 'Guía',        fecha: '04/01/2024', tamano: '156 KB', cliente: 'María González' },
])

const faqs = ref([
  { id: 1, color: '#4a90d9', pregunta: '¿Cómo puedo rastrear mi pedido?',    respuesta: 'Puedes rastrear tu pedido en la sección "Pedidos y Entregas" donde encontrarás el estado actualizado y la información de seguimiento.' },
  { id: 2, color: '#27ae60', pregunta: '¿Dónde descargo mis comprobantes?',   respuesta: 'Los comprobantes están disponibles en la pestaña "Comprobantes" de esta sección una vez que tu pedido haya sido entregado.' },
  { id: 3, color: '#9b59b6', pregunta: '¿Cómo modifico un pedido?',           respuesta: 'Para modificar un pedido, crea un ticket de soporte en la categoría "Pedidos" con los detalles del cambio requerido.' },
  { id: 4, color: '#f39c12', pregunta: '¿Qué hacer si hay retrasos?',         respuesta: 'Si tu pedido presenta retrasos, te notificaremos automáticamente. También puedes contactarnos para obtener información detallada.' },
])

const comprobanteFiltrados = computed(() => {
  if (!busqueda.value) return comprobantes.value
  const q = busqueda.value.toLowerCase()
  return comprobantes.value.filter(c =>
    c.numero.includes(q) ||
    c.tipo.toLowerCase().includes(q) ||
    c.cliente.toLowerCase().includes(q)
  )
})
</script>

<style scoped>
.main { flex: 1; padding: 32px; overflow-y: auto; min-width: 0; }
h1 { font-size: 28px; font-weight: 700; color: #1a1a2e; margin-bottom: 24px; }

/* TABS */
.tabs {
  display: flex;
  background: #ebebeb;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 20px;
  width: 100%;
  max-width: none;
  box-sizing: border-box;
}
.tab { flex: 1; padding: 10px; text-align: center; border-radius: 10px; cursor: pointer; font-size: 14px; font-weight: 500; color: #555; transition: background 0.15s; }
.tab.active { background: white; color: #1a1a2e; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }

/* SEARCH */
.search-bar { display: flex; align-items: center; background: #f0f2f5; border-radius: 10px; padding: 10px 16px; gap: 8px; max-width: 320px; margin-bottom: 24px; }
.search-bar input { border: none; background: transparent; outline: none; font-size: 14px; color: #555; width: 100%; }
.search-bar svg { width: 16px; height: 16px; fill: #aaa; }

/* COMPROBANTE CARDS */
.card {
  background: white;
  border-radius: 14px;
  padding: 20px 28px;
  margin-bottom: 16px;
  width: 100%;
  max-width: none;
  display: flex;
  align-items: center;
  gap: 24px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  box-sizing: border-box;
}
.card-left { display: flex; align-items: center; gap: 12px; min-width: 160px; }
.doc-icon { color: #4a90d9; }
.doc-icon svg { width: 28px; height: 28px; }
.doc-num { font-size: 16px; font-weight: 600; color: #1a1a2e; }
.badge-available { background: #e6f9f0; color: #27ae60; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; white-space: nowrap; }
.card-info { display: flex; gap: 0; flex: 1; justify-content: space-between; }
.info-block { flex: 1; }
.info-block label { font-size: 12px; color: #888; display: block; margin-bottom: 2px; }
.info-block span { font-size: 14px; font-weight: 600; color: #1a1a2e; }
.card-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; flex-shrink: 0; }
.btn-ver { display: flex; align-items: center; gap: 6px; border: 1px solid #ddd; background: white; border-radius: 8px; padding: 6px 14px; font-size: 13px; cursor: pointer; color: #444; font-weight: 500; }
.btn-ver:hover { background: #f5f5f5; }
.btn-ver svg { width: 16px; height: 16px; }
.btn-descargar { display: flex; align-items: center; gap: 6px; background: #1a3a4a; color: white; border: none; border-radius: 8px; padding: 8px 18px; font-size: 13px; cursor: pointer; font-weight: 600; }
.btn-descargar:hover { background: #224d62; }
.btn-descargar svg { width: 16px; height: 16px; }

/* CONTACTO */
#tab-contacto {
  width: 100%;
  max-width: none;
}
.contacto-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 100%;
}
.info-card { background: white; border-radius: 14px; padding: 28px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }

.info-card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 24px; }
.info-card-header span { font-size: 16px; font-weight: 600; color: #1a1a2e; }

.info-row { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 22px; }
.info-row:last-child { margin-bottom: 0; }
.info-row svg { margin-top: 2px; flex-shrink: 0; }
.info-label { font-size: 12px; color: #888; margin-bottom: 2px; }
.info-value { font-size: 15px; font-weight: 700; color: #1a1a2e; text-decoration: none; display: block; }
a.info-value:hover { text-decoration: underline; }

/* FAQ */
.faq-row { display: flex; gap: 14px; margin-bottom: 20px; }
.faq-row:last-child { margin-bottom: 0; }
.faq-bar { width: 4px; min-width: 4px; border-radius: 4px; }
.faq-question { font-size: 14px; font-weight: 700; color: #1a1a2e; margin-bottom: 5px; }
.faq-answer { font-size: 13px; color: #666; line-height: 1.5; }

/* HELP BTN */
.help-btn { position: fixed; bottom: 24px; right: 24px; width: 40px; height: 40px; border-radius: 50%; background: #1a3a4a; color: white; border: none; font-size: 18px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }

/* TOAST */
.toast { display: none; position: fixed; top: 24px; right: 24px; background: #27ae60; color: white; padding: 14px 20px; border-radius: 10px; font-size: 14px; font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.15); align-items: center; gap: 10px; z-index: 999; animation: slidein 0.3s ease; }
.toast.show { display: flex; }
@keyframes slidein { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
</style>