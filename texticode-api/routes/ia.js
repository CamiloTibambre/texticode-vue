import { Router } from 'express'

const router = Router()

router.post('/chat', async (req, res) => {
  try {
    const { system, messages, model = 'claude-sonnet-4-20250514', max_tokens = 1000 } = req.body || {}

    if (!system || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Solicitud inválida: faltan campos system o messages.' })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return res.status(500).json({
        error: 'Falta ANTHROPIC_API_KEY en el servidor. Configura texticode-api/.env.'
      })
    }

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens,
        system,
        messages
      })
    })

    const data = await anthropicRes.json()

    if (!anthropicRes.ok) {
      const detalle = data?.error?.message || data?.error || 'Error desconocido en Anthropic.'
      return res.status(anthropicRes.status).json({ error: `Anthropic: ${detalle}` })
    }

    return res.json({ text: data?.content?.[0]?.text || '' })
  } catch (error) {
    console.error('Error en /api/ia/chat:', error)
    return res.status(500).json({ error: 'No se pudo procesar la consulta de IA.' })
  }
})

export default router
