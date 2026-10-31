// Cliente do chat: histórico no navegador e chamada autenticada a /api/chat.
import { getIdToken } from './sync.js'

const MAX_SAVED = 40   // mensagens guardadas por chat
const MAX_SENT = 12    // últimas mensagens enviadas ao tutor (contexto)
export const MAX_CHARS = 500

const key = (chat) => `idiomas:chat:v1:${chat}`

export function loadHistory(chat) {
  try {
    const v = JSON.parse(localStorage.getItem(key(chat)))
    return Array.isArray(v) ? v.filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string') : []
  } catch { return [] }
}

export function saveHistory(chat, messages) {
  try { localStorage.setItem(key(chat), JSON.stringify(messages.slice(-MAX_SAVED))) } catch { /* sem storage */ }
}

export function clearHistory(chat) {
  try { localStorage.removeItem(key(chat)) } catch { /* nada */ }
}

export class ChatError extends Error {
  constructor(code, message, extra = {}) { super(message); this.code = code; Object.assign(this, extra) }
}

// messages: [{ role, content, ... }]  ->  { reply, reply_pt, pron, correction, usage }
export async function sendChat({ chat, mode, scenario, level, messages }) {
  const token = await getIdToken()
  if (!token) throw new ChatError('sem_login', 'Entre na sua conta pra usar o chat.')

  const body = {
    chat, mode, level,
    ...(mode === 'conversa' && scenario ? { scenario } : {}),
    messages: messages.slice(-MAX_SENT).map((m) => ({ role: m.role, content: m.content.slice(0, 800) })),
  }

  let res
  try {
    res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    })
  } catch {
    throw new ChatError('rede', 'Sem conexão. Confira a internet e tente de novo.')
  }

  let data = null
  try { data = await res.json() } catch { /* corpo vazio ou não-JSON */ }

  if (!res.ok || data?.error) {
    const e = data?.error
    throw new ChatError(e?.code || 'erro', e?.message || 'Não consegui responder agora. Tente de novo.', { used: e?.used, limit: e?.limit })
  }
  return data
}
