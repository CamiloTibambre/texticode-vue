<template>
  <div class="layout">
    <AppSidebar rol="admin" />

    <main class="main">
      <!-- HEADER -->
      <div class="page-head">
        <div class="head-left">
          <div class="ai-badge">
            <span class="ai-dot"></span>
            IA activa
          </div>
          <h1>Asistente de Producción</h1>
          <p class="head-sub">Analiza órdenes, inventario y operarios en tiempo real con inteligencia artificial.</p>
        </div>
        <button class="btn-nuevo" @click="nuevaConversacion">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
          </svg>
          Nueva conversación
        </button>
      </div>

      <div class="workspace">
        <!-- PANEL IZQUIERDO: sugerencias rápidas + contexto -->
        <aside class="sidebar-ai">
          <div class="context-card">
            <div class="context-title">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605"/>
              </svg>
              Contexto actual
            </div>
            <div v-if="cargandoContexto" class="ctx-loading">
              <div class="mini-spinner"></div>
              Cargando datos...
            </div>
            <div v-else class="ctx-items">
              <div class="ctx-item">
                <span class="ctx-label">Órdenes activas</span>
                <span class="ctx-val blue">{{ contexto.ordenesActivas }}</span>
              </div>
              <div class="ctx-item">
                <span class="ctx-label">Stock bajo</span>
                <span class="ctx-val orange">{{ contexto.stockBajo }}</span>
              </div>
              <div class="ctx-item">
                <span class="ctx-label">Órdenes vencidas</span>
                <span class="ctx-val red">{{ contexto.ordenesVencidas }}</span>
              </div>
              <div class="ctx-item">
                <span class="ctx-label">Completadas hoy</span>
                <span class="ctx-val green">{{ contexto.completadasHoy }}</span>
              </div>
            </div>
          </div>

          <div class="sugerencias">
            <div class="sug-title">Preguntas sugeridas</div>
            <button
              v-for="s in sugerencias"
              :key="s"
              class="sug-btn"
              @click="usarSugerencia(s)"
              :disabled="enviando"
            >
              {{ s }}
            </button>
          </div>

          <div class="modelos-card">
            <div class="sug-title">Capacidades</div>
            <div class="cap-list">
              <div class="cap-item" v-for="c in capacidades" :key="c.texto">
                <span class="cap-icon">{{ c.emoji }}</span>
                <span>{{ c.texto }}</span>
              </div>
            </div>
          </div>
        </aside>

        <!-- PANEL DERECHO: chat -->
        <section class="chat-panel">
          <div class="chat-messages" ref="chatEl">
            <!-- Estado vacío -->
            <div v-if="mensajes.length === 0" class="chat-empty">
              <div class="empty-orb">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z"/>
                </svg>
              </div>
              <h3>¿En qué te ayudo hoy?</h3>
              <p>Puedo analizar tus órdenes de producción, inventario, detectar riesgos y sugerirte acciones concretas.</p>
            </div>

            <!-- Mensajes -->
            <TransitionGroup name="msg" tag="div" class="msg-list">
              <div
                v-for="m in mensajes"
                :key="m.id"
                class="msg"
                :class="m.rol === 'user' ? 'msg-user' : 'msg-ai'"
              >
                <div v-if="m.rol === 'assistant'" class="msg-avatar">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"/>
                  </svg>
                </div>

                <div class="msg-bubble">
                  <!-- Typing indicator -->
                  <div v-if="m.escribiendo" class="typing">
                    <span></span><span></span><span></span>
                  </div>
                  <!-- Contenido con markdown básico -->
                  <div v-else class="msg-content" v-html="renderMarkdown(m.contenido)"></div>
                  <div class="msg-time">{{ m.hora }}</div>
                </div>

                <div v-if="m.rol === 'user'" class="msg-avatar user-avatar">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0"/>
                  </svg>
                </div>
              </div>
            </TransitionGroup>
          </div>

          <!-- Input -->
          <div class="chat-input-wrap">
            <div class="input-bar" :class="{ 'input-active': inputFocus }">
              <textarea
                v-model="inputTexto"
                ref="inputEl"
                placeholder="Escribe una pregunta sobre tu producción, inventario u órdenes..."
                rows="1"
                @keydown.enter.prevent="enviar"
                @focus="inputFocus = true"
                @blur="inputFocus = false"
                @input="autoResize"
              ></textarea>
              <button
                class="btn-enviar"
                :class="{ 'btn-activo': inputTexto.trim() && !enviando }"
                @click="enviar"
                :disabled="!inputTexto.trim() || enviando"
              >
                <svg v-if="!enviando" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"/>
                </svg>
                <div v-else class="mini-spinner-dark"></div>
              </button>
            </div>
            <div class="input-hint">
              <kbd>Enter</kbd> para enviar · Los datos son de tu base de datos en tiempo real
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import AppSidebar from '../../components/AppSidebar.vue'
import { getOrdenes, getMateriales, getUsuarios, chatIA } from '../../services/api.js'

// ── ESTADO ──
const mensajes = ref([])
const inputTexto = ref('')
const enviando = ref(false)
const inputFocus = ref(false)
const cargandoContexto = ref(true)
const chatEl = ref(null)
const inputEl = ref(null)

const contexto = ref({
  ordenesActivas: 0,
  stockBajo: 0,
  ordenesVencidas: 0,
  completadasHoy: 0
})

// Datos crudos de la BD para pasarle a la IA como contexto
const datosBD = ref({
  ordenes: [],
  materiales: [],
  usuarios: []
})

// ── SUGERENCIAS ──
const sugerencias = [
  '¿Qué órdenes están en riesgo de vencerse esta semana?',
  '¿Cuáles materiales necesitan reabastecimiento urgente?',
  '¿Cómo está el rendimiento de producción este mes?',
  '¿Qué órdenes tienen mayor prioridad ahora mismo?',
  'Dame un resumen del estado general de la fábrica',
  '¿Hay órdenes con stock insuficiente para completarlas?'
]

const capacidades = [
  { emoji: '📦', texto: 'Analiza órdenes y fechas de entrega' },
  { emoji: '🧵', texto: 'Detecta materiales con stock bajo' },
  { emoji: '⚠️', texto: 'Identifica cuellos de botella' },
  { emoji: '📊', texto: 'Genera resúmenes de producción' },
  { emoji: '💡', texto: 'Sugiere acciones correctivas' }
]

// ── CARGA DE DATOS ──
onMounted(async () => {
  try {
    const [ordenes, materiales, usuarios] = await Promise.all([
      getOrdenes(),
      getMateriales(),
      getUsuarios()
    ])

    datosBD.value = { ordenes, materiales, usuarios }

    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)

    contexto.value = {
      ordenesActivas: ordenes.filter(o => o.Estado === 'En Proceso').length,
      stockBajo: materiales.filter(m => Number(m.Stock_Actual) <= Number(m.Stock_Minimo)).length,
      ordenesVencidas: ordenes.filter(o => {
        if (!o.Fecha_Limite) return false
        return new Date(o.Fecha_Limite) < hoy && o.Estado !== 'Completada'
      }).length,
      completadasHoy: ordenes.filter(o => o.Estado === 'Completada').length
    }
  } catch (e) {
    console.error('Error cargando contexto:', e)
  } finally {
    cargandoContexto.value = false
  }
})

// ── HELPERS ──
function hora() {
  return new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
}

function scrollAbajo() {
  nextTick(() => {
    if (chatEl.value) {
      chatEl.value.scrollTop = chatEl.value.scrollHeight
    }
  })
}

function autoResize(e) {
  const el = e.target
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 140) + 'px'
}

function renderMarkdown(texto) {
  if (!texto) return ''
  return texto
    // Negrita
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Cursiva
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Código inline
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Encabezados
    .replace(/^### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^## (.+)$/gm, '<h3>$1</h3>')
    // Listas
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    // Saltos de línea
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    // Wrap en párrafo si no empieza con bloque
    .replace(/^(?!<)/, '<p>')
    .replace(/(?<!>)$/, '</p>')
}

function nuevaConversacion() {
  mensajes.value = []
  inputTexto.value = ''
}

function usarSugerencia(texto) {
  inputTexto.value = texto
  nextTick(() => {
    inputEl.value?.focus()
  })
  enviar()
}

// ── CONSTRUIR SISTEMA PROMPT CON DATOS REALES ──
function construirSistemaPrompt() {
  const { ordenes, materiales, usuarios } = datosBD.value
  const hoy = new Date().toLocaleDateString('es-CO')

  const ordenesResumen = ordenes.map(o => ({
    id: o.Id_Orden,
    descripcion: o.Descripcion,
    producto: o.Producto,
    cliente: o.Cliente,
    estado: o.Estado,
    prioridad: o.Prioridad,
    cantidad: o.Cantidad,
    unidades_realizadas: o.Unidades_Realizadas ?? 0,
    fecha_limite: o.Fecha_Limite?.split('T')[0],
    material: o.NombreMaterial
  }))

  const materialesResumen = materiales.map(m => ({
    id: m.Id_Material,
    nombre: m.Nombre_Material,
    categoria: m.Categoria,
    stock_actual: m.Stock_Actual,
    stock_minimo: m.Stock_Minimo,
    stock_maximo: m.Stock_Maximo,
    unidad: m.Unidad,
    alerta: Number(m.Stock_Actual) <= Number(m.Stock_Minimo)
  }))

  const operarios = usuarios
    .filter(u => (u.Rol || '').toLowerCase() === 'operario' && u.Estado === 'activo')
    .map(u => ({ id: u.Id_Usuario, nombre: u.Nombre_Completo }))

  return `Eres el Asistente de Producción de Texticode, una empresa textil colombiana. Tu rol es analizar datos reales del sistema y dar respuestas concretas, accionables y en español.

FECHA HOY: ${hoy}

=== ÓRDENES DE PRODUCCIÓN (${ordenes.length} total) ===
${JSON.stringify(ordenesResumen, null, 2)}

=== INVENTARIO DE MATERIALES (${materiales.length} materiales) ===
${JSON.stringify(materialesResumen, null, 2)}

=== OPERARIOS ACTIVOS (${operarios.length}) ===
${JSON.stringify(operarios, null, 2)}

INSTRUCCIONES:
- Responde SIEMPRE en español, de forma directa y profesional
- Usa los datos reales de arriba para responder; nunca inventes datos
- Cuando hay problemas urgentes (stock bajo, órdenes vencidas), destácalos con **negrita**
- Organiza respuestas largas con listas y encabezados
- Sé conciso pero completo; máximo 300 palabras salvo que se pida un reporte detallado
- Calcula porcentajes de progreso cuando sea útil: (unidades_realizadas / cantidad) * 100
- Una orden está en riesgo si su fecha_limite es en los próximos 3 días y no está Completada`
}

// ── ENVIAR MENSAJE ──
async function enviar() {
  const texto = inputTexto.value.trim()
  if (!texto || enviando.value) return

  // Agregar mensaje del usuario
  mensajes.value.push({
    id: Date.now(),
    rol: 'user',
    contenido: texto,
    hora: hora()
  })

  inputTexto.value = ''
  if (inputEl.value) {
    inputEl.value.style.height = 'auto'
  }
  scrollAbajo()

  // Mensaje de "escribiendo..."
  const idTyping = Date.now() + 1
  mensajes.value.push({
    id: idTyping,
    rol: 'assistant',
    contenido: '',
    escribiendo: true,
    hora: hora()
  })
  scrollAbajo()

  enviando.value = true

  try {
    // Construir historial para la API (excluir el indicador de typing)
    const historial = mensajes.value
      .filter(m => !m.escribiendo)
      .map(m => ({
        role: m.rol,
        content: m.contenido
      }))

    const data = await chatIA({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: construirSistemaPrompt(),
      messages: historial
    })

    // Quitar typing indicator
    const idx = mensajes.value.findIndex(m => m.id === idTyping)
    if (idx !== -1) mensajes.value.splice(idx, 1)

    const respuesta = data?.text || 'No pude obtener una respuesta. Intenta de nuevo.'

    mensajes.value.push({
      id: Date.now(),
      rol: 'assistant',
      contenido: respuesta,
      hora: hora()
    })

    scrollAbajo()
  } catch (err) {
    // Quitar typing indicator en caso de error
    const idx = mensajes.value.findIndex(m => m.id === idTyping)
    if (idx !== -1) mensajes.value.splice(idx, 1)

    mensajes.value.push({
      id: Date.now(),
      rol: 'assistant',
      contenido: `**Error de IA.** ${err?.message || 'No pude comunicarme con Anthropic.'}`,
      hora: hora()
    })
    scrollAbajo()
  } finally {
    enviando.value = false
  }
}
</script>

<style scoped>
.layout { display: flex; min-height: 100vh; background: #f3f4f6; }
.main   { flex: 1; padding: 24px 28px; display: flex; flex-direction: column; overflow: hidden; max-height: 100vh; }

/* ── HEADER ── */
.page-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; flex-shrink: 0; }
.head-left { display: flex; flex-direction: column; gap: 6px; }
.ai-badge {
  display: inline-flex; align-items: center; gap: 7px;
  background: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46;
  font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 999px;
  letter-spacing: 0.04em; width: fit-content;
}
.ai-dot {
  width: 7px; height: 7px; border-radius: 50%; background: #10b981;
  animation: pulse-dot 2s ease-in-out infinite;
}
@keyframes pulse-dot {
  0%,100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
  50%     { box-shadow: 0 0 0 5px rgba(16,185,129,0); }
}
.page-head h1  { font-size: 22px; font-weight: 700; color: #111827; margin: 0; }
.head-sub { font-size: 13px; color: #6b7280; margin: 0; }
.btn-nuevo {
  display: flex; align-items: center; gap: 7px;
  background: #1f3a52; color: white; border: none;
  padding: 9px 16px; border-radius: 8px; font-size: 13px; font-weight: 600;
  cursor: pointer; white-space: nowrap; transition: background 0.2s;
  flex-shrink: 0;
}
.btn-nuevo:hover { background: #162e42; }

/* ── WORKSPACE ── */
.workspace {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 16px;
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

/* ── SIDEBAR IA ── */
.sidebar-ai {
  display: flex; flex-direction: column; gap: 12px;
  overflow-y: auto;
  padding-right: 4px;
}
.sidebar-ai::-webkit-scrollbar { width: 4px; }
.sidebar-ai::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 2px; }

.context-card, .sugerencias, .modelos-card {
  background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 14px 16px;
}
.context-title, .sug-title {
  font-size: 11px; font-weight: 700; color: #6b7280;
  text-transform: uppercase; letter-spacing: 0.06em;
  display: flex; align-items: center; gap: 6px; margin-bottom: 12px;
}
.ctx-items { display: flex; flex-direction: column; gap: 8px; }
.ctx-item  { display: flex; justify-content: space-between; align-items: center; }
.ctx-label { font-size: 12px; color: #6b7280; }
.ctx-val   { font-size: 16px; font-weight: 700; }
.ctx-val.blue   { color: #2563eb; }
.ctx-val.orange { color: #ea580c; }
.ctx-val.red    { color: #dc2626; }
.ctx-val.green  { color: #16a34a; }
.ctx-loading { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #9ca3af; }

.sug-btn {
  display: block; width: 100%; text-align: left;
  background: #f9fafb; border: 1px solid #e5e7eb;
  border-radius: 8px; padding: 8px 10px;
  font-size: 12px; color: #374151; cursor: pointer;
  margin-bottom: 6px; line-height: 1.4;
  transition: background 0.15s, border-color 0.15s;
}
.sug-btn:last-child { margin-bottom: 0; }
.sug-btn:hover:not(:disabled) { background: #eff6ff; border-color: #bfdbfe; color: #1d4ed8; }
.sug-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.cap-list { display: flex; flex-direction: column; gap: 6px; }
.cap-item { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #374151; }
.cap-icon { font-size: 14px; }

/* ── CHAT PANEL ── */
.chat-panel {
  display: flex; flex-direction: column;
  background: white; border: 1px solid #e5e7eb; border-radius: 12px;
  overflow: hidden;
}

.chat-messages {
  flex: 1; overflow-y: auto; padding: 20px;
  display: flex; flex-direction: column;
  min-height: 0;
}
.chat-messages::-webkit-scrollbar { width: 6px; }
.chat-messages::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 3px; }

/* Empty state */
.chat-empty {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  text-align: center; padding: 40px 20px; color: #9ca3af;
  gap: 12px;
}
.empty-orb {
  width: 60px; height: 60px; border-radius: 50%;
  background: linear-gradient(135deg, #dbeafe, #ede9fe);
  display: flex; align-items: center; justify-content: center;
  color: #6366f1;
}
.chat-empty h3 { font-size: 16px; font-weight: 600; color: #374151; margin: 0; }
.chat-empty p  { font-size: 13px; max-width: 280px; line-height: 1.6; margin: 0; }

/* Mensajes */
.msg-list { display: flex; flex-direction: column; gap: 16px; }
.msg { display: flex; align-items: flex-start; gap: 10px; }
.msg-user { flex-direction: row-reverse; }

.msg-avatar {
  width: 30px; height: 30px; border-radius: 50%;
  background: linear-gradient(135deg, #1f3a52, #2d5578);
  color: white; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.user-avatar { background: linear-gradient(135deg, #374151, #6b7280); }

.msg-bubble { max-width: 78%; }
.msg-user .msg-bubble { align-items: flex-end; display: flex; flex-direction: column; }

.msg-content {
  padding: 10px 14px; border-radius: 12px;
  font-size: 13.5px; line-height: 1.6; color: #111827;
}
.msg-ai .msg-content {
  background: #f8fafc; border: 1px solid #e2e8f0;
  border-radius: 4px 12px 12px 12px;
}
.msg-user .msg-content {
  background: #1f3a52; color: white;
  border-radius: 12px 4px 12px 12px;
}

/* Estilos del HTML renderizado dentro de msg-content */
.msg-content :deep(strong)  { font-weight: 700; }
.msg-content :deep(em)      { font-style: italic; }
.msg-content :deep(code)    { background: #f1f5f9; padding: 1px 5px; border-radius: 4px; font-size: 12px; font-family: monospace; }
.msg-content :deep(h3)      { font-size: 14px; font-weight: 700; margin: 10px 0 4px; }
.msg-content :deep(h4)      { font-size: 13px; font-weight: 700; margin: 8px 0 4px; }
.msg-content :deep(ul)      { margin: 4px 0; padding-left: 16px; }
.msg-content :deep(li)      { margin-bottom: 3px; }
.msg-content :deep(p)       { margin: 0 0 6px; }
.msg-content :deep(p:last-child) { margin-bottom: 0; }
.msg-user .msg-content :deep(code) { background: rgba(255,255,255,0.15); }

.msg-time { font-size: 10px; color: #9ca3af; margin-top: 4px; padding: 0 4px; }
.msg-user .msg-time { text-align: right; }

/* Typing indicator */
.typing {
  padding: 12px 16px;
  background: #f8fafc; border: 1px solid #e2e8f0;
  border-radius: 4px 12px 12px 12px;
  display: flex; gap: 4px; align-items: center;
}
.typing span {
  width: 7px; height: 7px; border-radius: 50%;
  background: #94a3b8; animation: typing-bounce 1.2s ease infinite;
}
.typing span:nth-child(2) { animation-delay: 0.2s; }
.typing span:nth-child(3) { animation-delay: 0.4s; }
@keyframes typing-bounce {
  0%,60%,100% { transform: translateY(0); opacity: 0.6; }
  30%          { transform: translateY(-5px); opacity: 1; }
}

/* ── INPUT ── */
.chat-input-wrap {
  border-top: 1px solid #f1f5f9; padding: 14px 16px;
  flex-shrink: 0;
}
.input-bar {
  display: flex; align-items: flex-end; gap: 10px;
  background: #f8fafc; border: 1.5px solid #e2e8f0;
  border-radius: 12px; padding: 10px 12px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.input-bar.input-active {
  border-color: #1f3a52;
  box-shadow: 0 0 0 3px rgba(31,58,82,0.08);
}
.input-bar textarea {
  flex: 1; border: none; background: transparent;
  resize: none; outline: none; font-size: 14px;
  color: #111827; line-height: 1.5; max-height: 140px;
  font-family: inherit;
}
.input-bar textarea::placeholder { color: #9ca3af; }

.btn-enviar {
  width: 36px; height: 36px; border-radius: 8px;
  border: none; background: #e5e7eb; color: #9ca3af;
  cursor: not-allowed; display: flex; align-items: center;
  justify-content: center; flex-shrink: 0;
  transition: background 0.2s, color 0.2s;
}
.btn-activo {
  background: #1f3a52; color: white; cursor: pointer;
}
.btn-activo:hover { background: #162e42; }

.input-hint {
  font-size: 11px; color: #9ca3af; margin-top: 8px;
  display: flex; align-items: center; gap: 4px;
}
kbd {
  background: #f1f5f9; border: 1px solid #e2e8f0;
  border-radius: 4px; padding: 1px 5px; font-size: 10px;
  font-family: monospace; color: #374151;
}

/* ── SPINNERS ── */
.mini-spinner {
  width: 14px; height: 14px;
  border: 2px solid #e5e7eb; border-top-color: #1f3a52;
  border-radius: 50%; animation: spin 0.7s linear infinite;
}
.mini-spinner-dark {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
  border-radius: 50%; animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── TRANSICIONES ── */
.msg-enter-active { transition: all 0.3s cubic-bezier(0.22,1,0.36,1); }
.msg-enter-from   { opacity: 0; transform: translateY(10px); }

/* ── RESPONSIVE ── */
@media (max-width: 900px) {
  .workspace { grid-template-columns: 1fr; }
  .sidebar-ai { display: none; }
}
</style>
