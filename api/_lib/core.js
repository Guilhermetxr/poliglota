// Regras do /api/chat, com as dependências externas injetadas (verificação de login,
// contador de uso e chamada à IA) pra dar pra testar sem rede e sem gastar nada.
import { z } from 'zod'
import { SCENARIOS, buildSystem } from './prompt.js'

const MAX_BODY_BYTES = 20_000
const MAX_CHARS = 800

const Body = z.object({
  chat: z.enum(['general', 'en', 'fr', 'es', 'it']),
  mode: z.enum(['conversa', 'corrigir', 'duvidas']),
  scenario: z.enum(Object.keys(SCENARIOS)).optional(),
  level: z.number().int().min(1).max(3).default(1),
  messages: z.array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().min(1).max(MAX_CHARS) })).min(1).max(20),
}).refine((b) => (b.chat === 'general') === (b.mode === 'duvidas'), { message: 'modo inválido para este chat' })

// Formato que o modelo é obrigado a devolver
export const Out = z.object({
  reply: z.string(),
  reply_pt: z.string(),
  pron: z.string(),
  correction: z.object({
    original: z.string(), corrected: z.string(), explanation: z.string(), pron: z.string(),
  }).nullable(),
})

const fail = (status, code, message, extra = {}) =>
  Response.json({ error: { code, message, ...extra } }, { status, headers: { 'Cache-Control': 'no-store' } })

export function createHandler({ verify, bump, ask, limit = 40 }) {
  return async function POST(request) {
    // 1) formato e tamanho
    if (!(request.headers.get('content-type') || '').includes('application/json')) return fail(415, 'formato', 'Formato não suportado.')
    const len = Number(request.headers.get('content-length') || 0)
    if (len > MAX_BODY_BYTES) return fail(413, 'grande_demais', 'Mensagem grande demais.')
    let raw
    try { raw = await request.text() } catch { return fail(400, 'invalido', 'Pedido inválido.') }
    if (raw.length > MAX_BODY_BYTES) return fail(413, 'grande_demais', 'Mensagem grande demais.')

    // 2) login obrigatório, com e-mail confirmado (evita abrir várias contas descartáveis)
    const token = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '')
    if (!token) return fail(401, 'sem_login', 'Entre na sua conta pra usar o chat.')
    let user
    try { user = await verify(token) } catch { return fail(401, 'login_invalido', 'Sua sessão expirou. Entre de novo.') }
    if (!user.emailVerified) return fail(403, 'email_nao_confirmado', 'Confirme seu e-mail pra usar o chat.')

    // 3) entrada validada
    let body
    try { body = Body.parse(JSON.parse(raw)) } catch { return fail(400, 'invalido', 'Pedido inválido.') }
    // a conversa precisa começar e terminar com a pessoa
    const messages = [...body.messages]
    while (messages.length && messages[0].role !== 'user') messages.shift()
    if (!messages.length || messages.at(-1).role !== 'user') return fail(400, 'invalido', 'Pedido inválido.')

    // 4) limite diário por pessoa, contado ANTES de chamar a IA (se o contador falhar, não chama)
    let usage
    try { usage = await bump(token, user.uid, limit) } catch (e) {
      console.error('[chat] contador falhou', e?.message)
      return fail(503, 'indisponivel', 'O chat está indisponível agora. Tente de novo em instantes.')
    }
    if (usage.blocked) {
      return fail(429, 'limite_diario', `Você usou as ${limit} mensagens de hoje. Volte amanhã!`, { used: usage.used, limit })
    }

    // 5) IA
    try {
      const out = await ask({ system: buildSystem(body), messages })
      if (!out) return fail(502, 'resposta_invalida', 'Não consegui responder agora. Tente de novo.')
      if (out.refused) return fail(200, 'recusa', 'Não posso ajudar com isso, mas vamos continuar praticando!')
      return Response.json({ ...out, usage: { used: usage.used, limit } }, { headers: { 'Cache-Control': 'no-store' } })
    } catch (e) {
      console.error('[chat] IA falhou', e?.status, e?.message)
      if (e?.status === 429) return fail(503, 'ocupado', 'O tutor está muito requisitado agora. Tente de novo em instantes.')
      return fail(502, 'ia_falhou', 'Não consegui responder agora. Tente de novo.')
    }
  }
}
