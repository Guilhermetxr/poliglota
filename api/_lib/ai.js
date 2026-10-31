// Chamada à IA por qualquer serviço com a API "OpenAI-compatível" (Groq, Gemini, OpenRouter, etc.).
// Variáveis de ambiente (só no servidor):
//   AI_API_KEY    chave do serviço (obrigatória)
//   AI_BASE_URL   padrão https://api.groq.com/openai/v1
//   AI_MODEL      padrão llama-3.3-70b-versatile
//   AI_JSON_MODE  "off" desliga o response_format (se o serviço rejeitar)
import { Out } from './core.js'

const DEFAULT_BASE = 'https://api.groq.com/openai/v1'
const DEFAULT_MODEL = 'llama-3.3-70b-versatile'

// Serviços gratuitos nem sempre garantem JSON válido, então o formato vai no prompt e é validado aqui
const FORMAT = `

Reply with ONLY one JSON object, no markdown and no text outside it, with exactly these keys:
{"reply": string, "reply_pt": string, "pron": string, "correction": null | {"original": string, "corrected": string, "explanation": string, "pron": string}}`

// aceita o JSON puro ou dentro de uma cerca ```json
function extractJson(text) {
  const t = String(text ?? '').trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
  const a = t.indexOf('{'), b = t.lastIndexOf('}')
  return JSON.parse(a >= 0 && b > a ? t.slice(a, b + 1) : t)
}

// Devolve { reply, reply_pt, pron, correction }, { refused: true } ou null.
// Erros de rede/HTTP lançam (com .status). JSON inválido tenta mais uma vez, porque modelos gratuitos falham de vez em quando.
export async function ask({ system, messages }, { fetch: f = globalThis.fetch, env = process.env } = {}) {
  const base = (env.AI_BASE_URL || DEFAULT_BASE).replace(/\/+$/, '')
  const body = {
    model: env.AI_MODEL || DEFAULT_MODEL,
    temperature: 0.4,
    max_tokens: 900,
    messages: [{ role: 'system', content: system + FORMAT }, ...messages],
    ...(env.AI_JSON_MODE === 'off' ? {} : { response_format: { type: 'json_object' } }),
  }

  let lastError
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await f(`${base}/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.AI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(25_000),
    })
    if (!res.ok) throw Object.assign(new Error(`ia http ${res.status}`), { status: res.status })

    const choice = (await res.json()).choices?.[0]
    if (choice?.finish_reason === 'content_filter') return { refused: true }
    if (choice?.finish_reason === 'length') return null // cortou no meio: JSON incompleto
    try {
      return Out.parse(extractJson(choice?.message?.content))
    } catch (e) { lastError = e }
  }
  throw lastError
}
