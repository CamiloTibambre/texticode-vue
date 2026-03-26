<template>
  <div class="layout">
    <AppSidebar rol="cliente" />

    <main class="main">
      <div class="page-head" :class="{ 'fade-in': mounted }">
        <div>
          <h1>Centro de Soporte</h1>
          <p>Contáctanos y resuelve tus dudas fácilmente.</p>
        </div>
      </div>

      <!-- SOLO CONTACTO -->
      <section class="contact-grid">
        <article class="info-card card" :class="{ 'card-visible': mounted }" style="transition-delay: 1s">
          <div class="section-title">Canales de atención</div>
          <div class="contact-list">

            <a class="contact-link link-anim" :class="{ 'link-in': mounted }" style="transition-delay: 120ms" href="tel:+5744445555">
              <div class="contact-row">
                <span class="icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.79 14.8 16.37 14.67 16.85 14.86C18.06 15.34 19.4 15.6 20.75 15.6C21.44 15.6 22 16.16 22 16.85V20.75C22 21.44 21.44 22 20.75 22C10.92 22 2 13.08 2 3.25C2 2.56 2.56 2 3.25 2H7.15C7.84 2 8.4 2.56 8.4 3.25C8.4 4.6 8.66 5.94 9.14 7.15C9.33 7.63 9.2 8.21 8.82 8.59L6.62 10.79Z" fill="currentColor"/>
                  </svg>
                </span>
                <div>
                  <strong>Teléfono</strong>
                  <span>+57 (4) 444-5555</span>
                </div>
              </div>
            </a>

            <a class="contact-link link-anim" :class="{ 'link-in': mounted }" style="transition-delay: 200ms" href="https://wa.me/573001234567" target="_blank" rel="noreferrer">
              <div class="contact-row">
                <span class="icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 18H17C19.2091 18 21 16.2091 21 14C21 11.7909 19.2091 10 17 10H16.5C15.6716 7.83333 13.6667 6 11 6C8.23858 6 6 8.23858 6 11H5C3.34315 11 2 12.3431 2 14C2 15.6569 3.34315 17 5 17H7Z" fill="currentColor"/>
                  </svg>
                </span>
                <div>
                  <strong>WhatsApp</strong>
                  <span>+57 300 123 4567</span>
                </div>
              </div>
            </a>

            <a class="contact-link link-anim" :class="{ 'link-in': mounted }" style="transition-delay: 280ms" href="mailto:soporte@texticode.com">
              <div class="contact-row">
                <span class="icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 5H21C21.5523 5 22 5.44772 22 6V18C22 18.5523 21.5523 19 21 19H3C2.44772 19 2 18.5523 2 18V6C2 5.44772 2.44772 5 3 5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                <div>
                  <strong>Email</strong>
                  <span>soporte@texticode.com</span>
                </div>
              </div>
            </a>

            <div class="contact-link static link-anim" :class="{ 'link-in': mounted }" style="transition-delay: 360ms">
              <div class="contact-row">
                <span class="icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </span>
                <div>
                  <strong>Horario</strong>
                  <span>Lunes a viernes · 8:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>

          </div>
        </article>

        <article class="info-card card" :class="{ 'card-visible': mounted }" style="transition-delay: 160ms">
          <div class="section-title">Preguntas frecuentes</div>
          <div class="faq-list">
            <TransitionGroup name="row">
              <div v-for="(faq, i) in faqs" :key="faq.id" class="faq-item faq-anim" :class="{ 'faq-in': mounted }" :style="{ transitionDelay: (160 + i * 80) + 'ms' }">
                <div class="faq-question">{{ faq.pregunta }}</div>
                <div class="faq-answer">{{ faq.respuesta }}</div>
              </div>
            </TransitionGroup>
          </div>
        </article>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppSidebar from '../../components/AppSidebar.vue'

const mounted = ref(false)

onMounted(() => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      mounted.value = true
    })
  })
})

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

/* ── HEADER con fade-in ── */
.page-head {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; margin-bottom: 22px;
  opacity: 0; transform: translateY(-10px);
  transition: opacity .4s ease, transform .4s ease;
}
.page-head.fade-in { opacity: 1; transform: translateY(0); }
h1 { font-size: 28px; color: #0f172a; margin-bottom: 6px; }
.page-head p { color: #64748b; }

/* ── CONTACTO con card-visible animado ── */
.contact-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
.info-card {
  padding: 22px; background: white; border: 1px solid #e2e8f0; border-radius: 18px;
  opacity: 0; transform: translateY(16px);
  transition: opacity .4s ease, transform .4s ease, box-shadow .2s;
}
.info-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,.07); }
.info-card.card-visible { opacity: 1; transform: translateY(0); }

.section-title { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
.contact-list, .faq-list { display: grid; gap: 12px; }

.contact-link {
  text-decoration: none; background: #f8fafc; border: 1px solid #e2e8f0;
  border-radius: 14px; padding: 14px 16px; color: #0f172a;
  transition: background .18s, box-shadow .18s, transform .18s;
  display: block;
}
.contact-link:hover:not(.static) {
  background: #f1f5f9; box-shadow: 0 2px 10px rgba(0,0,0,.06); transform: translateY(-1px);
}

.contact-row { display: flex; align-items: center; gap: 12px; }
.icon { font-size: 20px; }
.contact-link span { display: block; color: #475569; }
.contact-link.static { cursor: default; }

.faq-item {
  padding: 14px 16px; border-radius: 14px;
  background: linear-gradient(180deg, #ffffff, #f8fafc); border: 1px solid #e2e8f0;
  transition: box-shadow .18s, transform .18s;
}
.faq-item:hover { box-shadow: 0 2px 10px rgba(0,0,0,.05); transform: translateY(-1px); }
.faq-question { font-weight: 700; color: #0f172a; margin-bottom: 6px; }
.faq-answer   { color: #475569; line-height: 1.5; font-size: 14px; }

/* ── TransitionGroup ── */
.row-enter-active, .row-leave-active { transition: opacity .3s ease, transform .3s ease; }
.row-enter-from, .row-leave-to { opacity: 0; transform: translateY(8px); }

@media (max-width: 960px) {
  .contact-grid { grid-template-columns: 1fr; }
}

/* ── Stagger links ── */
.link-anim {
  opacity: 0; transform: translateX(-16px);
  transition: opacity .38s ease, transform .38s ease, background .18s, box-shadow .18s;
}
.link-anim.link-in { opacity: 1; transform: translateX(0); }

/* ── Stagger FAQ ── */
.faq-anim {
  opacity: 0; transform: translateY(14px);
  transition: opacity .38s ease, transform .38s ease, box-shadow .18s;
}
.faq-anim.faq-in { opacity: 1; transform: translateY(0); }

/* Icon bounce on hover */
.contact-row .icon { transition: transform .2s cubic-bezier(.34,1.56,.64,1); display: flex; align-items: center; }
.contact-link:hover .icon { transform: scale(1.25) rotate(-8deg); }

</style>