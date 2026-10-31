import Anthropic from '@anthropic-ai/sdk'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
import { Out } from './core.js'

let shared
// Formato JSON que o modelo é obrigado a seguir (sem a função de parse do helper, que não vai na rede)
const { parse: _unused, ...format } = zodOutputFormat(Out)

// Chama o Claude e devolve { reply, reply_pt, pron, correction }, { refused: true } ou null.
// Usa create (e valida aqui) em vez de parse: numa recusa o texto vem vazio e o parse do SDK
// lançaria erro antes de podermos olhar o motivo da parada.
export async function ask({ system, messages }, { client, model } = {}) {
  const c = client ?? (shared ??= new Anthropic()) // lê ANTHROPIC_API_KEY
  const response = await c.messages.create({
    model: model || process.env.CHAT_MODEL || 'claude-opus-5-5',
    max_tokens: 4000, // o raciocínio interno também conta aqui
    system,
    messages,
    output_config: { effort: 'low', format },
  })
  if (response.stop_reason === 'refusal') return { refused: true }
  if (response.stop_reason === 'max_tokens') return null // cortou no meio: JSON incompleto
  const text = response.content.filter((b) => b.type === 'text').map((b) => b.text).join('')
  return Out.parse(JSON.parse(text)) // lança se não bater com o schema
}
