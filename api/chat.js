// POST /api/chat  (função da Vercel)
// Variáveis de ambiente no servidor:
//   AI_API_KEY          (obrigatória)  chave do serviço de IA. Nunca vai pro navegador.
//   AI_BASE_URL / AI_MODEL / AI_JSON_MODE  (opcionais, ver _lib/ai.js). Padrão: Groq + openai/gpt-oss-120b
//   CHAT_DAILY_LIMIT    (opcional)     mensagens por pessoa por dia. Padrão: 40
//   FIREBASE_PROJECT_ID (opcional)     usa VITE_FIREBASE_PROJECT_ID se faltar
import { createRemoteJWKSet, jwtVerify } from 'jose'
import { ask } from './_lib/ai.js'
import { createHandler } from './_lib/core.js'
import { bump as bumpUsage } from './_lib/usage.js'

const env = (k) => process.env[k]
const projectId = () => env('FIREBASE_PROJECT_ID') || env('VITE_FIREBASE_PROJECT_ID')

// ── login: confere o token do Firebase sem precisar de chave de servidor ──
const JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'))

async function verify(token) {
  const pid = projectId()
  if (!pid) throw new Error('FIREBASE_PROJECT_ID ausente')
  const { payload } = await jwtVerify(token, JWKS, { issuer: `https://securetoken.google.com/${pid}`, audience: pid })
  if (!payload.sub) throw new Error('token sem sub')
  return { uid: payload.sub, emailVerified: payload.email_verified === true }
}

// ── contador diário (ver _lib/usage.js) ──
const bump = (token, uid, limit) => bumpUsage(token, uid, limit, { projectId: projectId() })

const handler = createHandler({
  verify, bump, ask,
  get limit() { return Number(env('CHAT_DAILY_LIMIT')) || 40 },
})

export async function POST(request) {
  if (!env('AI_API_KEY')) {
    return Response.json({ error: { code: 'nao_configurado', message: 'O chat ainda não foi configurado.' } }, { status: 503 })
  }
  return handler(request)
}

export function GET() {
  return Response.json({ error: { code: 'metodo', message: 'Use POST.' } }, { status: 405, headers: { Allow: 'POST' } })
}
