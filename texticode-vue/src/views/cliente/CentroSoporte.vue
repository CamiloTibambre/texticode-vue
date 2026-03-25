<template>
  <div class="layout">
    <AppSidebar rol="cliente" />

    <main class="main">
      <div class="page-head">
        <div>
          <h1>Centro de Soporte</h1>
          <p>Contáctanos y resuelve tus dudas fácilmente.</p>
        </div>
      </div>

      <!-- ── SOLO CONTACTO ── -->
      <section class="contact-grid">
        <article class="info-card card">
          <div class="section-title">Canales de atención</div>
          <div class="contact-list">

            <a class="contact-link" href="tel:+5744445555">
              <div class="contact-row">
                <span class="icon">📞</span>
                <div>
                  <strong>Teléfono</strong>
                  <span>+57 (4) 444-5555</span>
                </div>
              </div>
            </a>

            <a class="contact-link" href="https://wa.me/573001234567" target="_blank" rel="noreferrer">
              <div class="contact-row">
                <span class="icon">💬</span>
                <div>
                  <strong>WhatsApp</strong>
                  <span>+57 300 123 4567</span>
                </div>
              </div>
            </a>

            <a class="contact-link" href="mailto:soporte@texticode.com">
              <div class="contact-row">
                <span class="icon">📧</span>
                <div>
                  <strong>Email</strong>
                  <span>soporte@texticode.com</span>
                </div>
              </div>
            </a>

            <div class="contact-link static">
              <div class="contact-row">
                <span class="icon">🕒</span>
                <div>
                  <strong>Horario</strong>
                  <span>Lunes a viernes · 8:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>

          </div>
        </article>

        <article class="info-card card">
          <div class="section-title">Preguntas frecuentes</div>
          <div class="faq-list">
            <div v-for="faq in faqs" :key="faq.id" class="faq-item">
              <div class="faq-question">{{ faq.pregunta }}</div>
              <div class="faq-answer">{{ faq.respuesta }}</div>
            </div>
          </div>
        </article>
      </section>
    </main>
  </div>
</template>

<script setup>
import AppSidebar from '../../components/AppSidebar.vue'

const faqs = [
  { id: 1, pregunta: '¿Cómo puedo rastrear mi pedido?',      respuesta: 'Ve a tu cuenta personal o a la sección de pedidos para revisar el estado actualizado.' },
  { id: 2, pregunta: '¿Dónde descargo mis comprobantes?',    respuesta: 'Los comprobantes aparecen cuando el administrador marca tu orden como completada.' },
  { id: 3, pregunta: '¿Qué hago si necesito un cambio?',     respuesta: 'Contáctanos por WhatsApp o correo y menciona tu número de orden para ayudarte más rápido.' },
  { id: 4, pregunta: '¿Por qué no veo comprobantes todavía?', respuesta: 'Los comprobantes se generan automáticamente cuando el administrador marca tu orden como completada.' },
]
</script>

<style scoped>
.layout { display: flex; min-height: 100vh; background: #f5f7fb; }
.main   { flex: 1; padding: 30px; }

.page-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; margin-bottom: 22px; }
h1 { font-size: 28px; color: #0f172a; margin-bottom: 6px; }
.page-head p { color: #64748b; }

/* CONTACTO */
.contact-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
.info-card { padding: 22px; background: white; border: 1px solid #e2e8f0; border-radius: 18px; }
.section-title { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
.contact-list, .faq-list { display: grid; gap: 12px; }

.contact-link { text-decoration: none; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 14px 16px; color: #0f172a; }

.contact-row { display: flex; align-items: center; gap: 12px; }

.icon { font-size: 20px; }

.contact-link span { display: block; color: #475569; }
.contact-link.static { cursor: default; }

.faq-item { padding: 14px 16px; border-radius: 14px; background: linear-gradient(180deg, #ffffff, #f8fafc); border: 1px solid #e2e8f0; }
.faq-question { font-weight: 700; color: #0f172a; margin-bottom: 6px; }
.faq-answer   { color: #475569; line-height: 1.5; font-size: 14px; }

@media (max-width: 960px) {
  .contact-grid { grid-template-columns: 1fr; }
}
</style>