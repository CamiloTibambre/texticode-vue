<template>
  <div class="layout">
    <AppSidebar rol="cliente" />

    <main class="main">

      <!-- FONDO DECORATIVO -->
      <div class="bg-orbs" aria-hidden="true">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
        <div class="bg-grid"></div>
      </div>

      <!-- HERO HEADER -->
      <div class="page-hero" :class="{ 'hero-visible': mounted }">
        <div class="hero-left">
          <div class="hero-icon-wrap">
            <svg class="hero-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"/>
            </svg>
            <div class="hero-icon-ring ring-1"></div>
            <div class="hero-icon-ring ring-2"></div>
          </div>
          <div class="hero-text">
            <h1 class="hero-title">
              <span
                v-for="(ch, i) in 'Centro de Soporte'"
                :key="i"
                class="title-char"
                :style="{ animationDelay: mounted ? `${i * 35}ms` : '9999s' }"
              >{{ ch === ' ' ? '\u00A0' : ch }}</span>
            </h1>
            <p class="hero-sub">Contáctanos y resuelve tus dudas fácilmente.</p>
          </div>
        </div>
      </div>

      <!-- SOLO CONTACTO -->
      <section class="contact-grid">
        <article class="info-card" :class="{ 'card-visible': mounted }" style="transition-delay: 80ms">
          <div class="section-title">Canales de atención</div>
          <div class="contact-list">

            <a class="contact-link link-anim" :class="{ 'link-in': mounted }" style="transition-delay: 120ms" href="tel:+5744445555">
              <div class="contact-row">
                <span class="icon">
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"/>
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
                  <!-- Icono oficial de WhatsApp -->
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
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
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"/>
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
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
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

        <article class="info-card" :class="{ 'card-visible': mounted }" style="transition-delay: 160ms">
          <div class="section-title">Preguntas frecuentes</div>
          <div class="faq-list">
            <TransitionGroup name="row">
              <div
                v-for="(faq, i) in faqs"
                :key="faq.id"
                class="faq-item faq-anim"
                :class="{ 'faq-in': mounted }"
                :style="{ transitionDelay: (160 + i * 80) + 'ms' }"
              >
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
  { id: 1, pregunta: '¿Cómo puedo rastrear mi pedido?',       respuesta: 'Ve a tu cuenta personal o a la sección de pedidos para revisar el estado actualizado.' },
  { id: 2, pregunta: '¿Dónde descargo mis comprobantes?',     respuesta: 'Los comprobantes aparecen cuando el administrador marca tu orden como completada.' },
  { id: 3, pregunta: '¿Qué hago si necesito un cambio?',      respuesta: 'Contáctanos por WhatsApp o correo y menciona tu número de orden para ayudarte más rápido.' },
  { id: 4, pregunta: '¿Por qué no veo comprobantes todavía?', respuesta: 'Los comprobantes se generan automáticamente cuando el administrador marca tu orden como completada.' },
]
</script>

<style scoped>
/* ── LAYOUT ── */
.layout { display: flex; min-height: 100vh; background: #f1f5f9; position: relative; overflow: hidden; }
.main   { flex: 1; padding: 28px 30px; position: relative; z-index: 1; }

/* ── FONDO DECORATIVO ── */
.bg-orbs { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
.orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.07; }
.orb-1 { width: 600px; height: 600px; background: #1f3a52; top: -200px; right: -100px; animation: orbDrift1 18s ease-in-out infinite alternate; }
.orb-2 { width: 400px; height: 400px; background: #2563eb; bottom: -100px; left: 10%; animation: orbDrift2 22s ease-in-out infinite alternate; }
.orb-3 { width: 300px; height: 300px; background: #16a34a; top: 40%; right: 5%; animation: orbDrift3 15s ease-in-out infinite alternate; }
@keyframes orbDrift1 { from { transform: translate(0,0) scale(1); } to { transform: translate(-60px,40px) scale(1.1); } }
@keyframes orbDrift2 { from { transform: translate(0,0) scale(1); } to { transform: translate(40px,-50px) scale(1.15); } }
@keyframes orbDrift3 { from { transform: translate(0,0) scale(1); } to { transform: translate(-30px,30px) scale(0.9); } }
.bg-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(31,58,82,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(31,58,82,0.04) 1px, transparent 1px); background-size: 40px 40px; }

/* ── HERO HEADER ── */
.page-hero {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 28px;
  opacity: 0; transform: translateY(-16px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.page-hero.hero-visible { opacity: 1; transform: translateY(0); }
.hero-left { display: flex; align-items: center; gap: 16px; }
.hero-text { display: flex; flex-direction: column; }

.hero-icon-wrap {
  position: relative; width: 52px; height: 52px;
  display: flex; align-items: center; justify-content: center;
  background: #1f3a52; border-radius: 14px; flex-shrink: 0;
}
.hero-icon { width: 26px; height: 26px; color: white; }
.hero-icon-ring {
  position: absolute; border-radius: 50%;
  border: 1.5px solid #1f3a52; opacity: 0;
  animation: iconPulse 3s ease-out infinite;
}
.ring-1 { width: 68px; height: 68px; animation-delay: 0s; }
.ring-2 { width: 86px; height: 86px; animation-delay: 0.8s; }
@keyframes iconPulse {
  0%   { transform: scale(0.7); opacity: 0.5; }
  100% { transform: scale(1.4); opacity: 0; }
}

.hero-title {
  font-size: 24px; font-weight: 700; color: #111827;
  margin: 0; display: flex; flex-wrap: wrap;
}
.title-char {
  display: inline-block; opacity: 0; transform: translateY(12px);
  animation: charReveal 0.4s ease forwards;
}
@keyframes charReveal { to { opacity: 1; transform: translateY(0); } }
.hero-sub { font-size: 13px; color: #6b7280; margin: 4px 0 0 0; }

/* ── CONTACT GRID ── */
.contact-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }

.info-card {
  padding: 22px; background: white;
  border: 1px solid #e5e7eb; border-radius: 14px;
  opacity: 0; transform: translateY(16px);
  transition: opacity 0.45s ease, transform 0.45s ease, box-shadow 0.2s;
}
.info-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.09); }
.info-card.card-visible { opacity: 1; transform: translateY(0); }

.section-title { font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 16px; }
.contact-list, .faq-list { display: grid; gap: 12px; }

.contact-link {
  text-decoration: none; background: #f9fafb;
  border: 1px solid #e5e7eb; border-radius: 10px;
  padding: 14px 16px; color: #0f172a;
  transition: background 0.18s, box-shadow 0.18s, transform 0.18s;
  display: block;
}
.contact-link:hover:not(.static) {
  background: #f1f5f9; box-shadow: 0 2px 10px rgba(0,0,0,0.06); transform: translateY(-1px);
}
.contact-link.static { cursor: default; }

.contact-row { display: flex; align-items: center; gap: 12px; }
.icon { display: flex; align-items: center; color: #1f3a52; }
.contact-link strong { display: block; font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 2px; }
.contact-link span   { display: block; font-size: 13px; color: #6b7280; }

.faq-item {
  padding: 14px 16px; border-radius: 10px;
  background: #f9fafb; border: 1px solid #e5e7eb;
  transition: box-shadow 0.18s, transform 0.18s;
}
.faq-item:hover { box-shadow: 0 2px 10px rgba(0,0,0,0.05); transform: translateY(-1px); }
.faq-question { font-weight: 600; color: #111827; margin-bottom: 6px; font-size: 14px; }
.faq-answer   { color: #6b7280; line-height: 1.5; font-size: 13px; }

/* ── TransitionGroup ── */
.row-enter-active, .row-leave-active { transition: opacity .3s ease, transform .3s ease; }
.row-enter-from, .row-leave-to { opacity: 0; transform: translateY(8px); }

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

/* ── Icon bounce on hover ── */
.contact-row .icon { transition: transform .2s cubic-bezier(.34,1.56,.64,1); }
.contact-link:hover .icon { transform: scale(1.2) rotate(-6deg); }

@media (max-width: 960px) {
  .contact-grid { grid-template-columns: 1fr; }
}
</style>