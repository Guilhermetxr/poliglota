import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Em desenvolvimento, serve a função /api/chat (na Vercel ela roda como função de servidor).
// As variáveis (AI_API_KEY etc.) vêm do .env.local.
function apiDev(mode) {
  return {
    name: 'api-dev',
    configureServer(server) {
      const env = loadEnv(mode, process.cwd(), '')
      for (const [k, v] of Object.entries(env)) if (process.env[k] === undefined) process.env[k] = v

      server.middlewares.use('/api/chat', async (req, res) => {
        try {
          const mod = await server.ssrLoadModule('/api/chat.js')
          const handle = mod[req.method]
          if (!handle) { res.statusCode = 405; return res.end() }
          const chunks = []
          for await (const c of req) chunks.push(c)
          const request = new Request(`http://localhost${req.originalUrl}`, {
            method: req.method,
            headers: req.headers,
            body: req.method === 'GET' || req.method === 'HEAD' ? undefined : Buffer.concat(chunks),
          })
          const response = await handle(request)
          res.statusCode = response.status
          response.headers.forEach((v, k) => res.setHeader(k, v))
          res.end(Buffer.from(await response.arrayBuffer()))
        } catch (e) {
          console.error('[api-dev]', e)
          res.statusCode = 500
          res.end(JSON.stringify({ error: { code: 'erro', message: 'Erro no servidor local.' } }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), apiDev(mode)],
}))
