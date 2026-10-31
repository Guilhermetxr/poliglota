// Contador diário de mensagens, no Firestore, gravado COMO a própria pessoa (token dela).
// As regras do banco (firestore.rules) só deixam o número subir de 1 em 1 e nunca descer,
// então ninguém consegue zerar o próprio uso.
export async function bump(token, uid, limit, { projectId, fetch: f = globalThis.fetch } = {}) {
  const base = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/usage`
  const day = new Date(Date.now() - 3 * 3600_000).toISOString().slice(0, 10) // dia em horário de Brasília
  const id = `${uid}_${day}`
  const h = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  for (let attempt = 0; attempt < 3; attempt++) {
    const r = await f(`${base}/${id}`, { headers: h })
    if (r.status === 404) {
      const c = await f(`${base}?documentId=${id}`, { method: 'POST', headers: h, body: JSON.stringify({ fields: { count: { integerValue: '1' } } }) })
      if (c.ok) return { used: 1 }
      continue // alguém criou ao mesmo tempo: lê de novo
    }
    if (!r.ok) throw new Error(`firestore get ${r.status}`)
    const doc = await r.json()
    const used = Number(doc.fields?.count?.integerValue ?? 0)
    if (used >= limit) return { blocked: true, used }
    const u = await f(`${base}/${id}?updateMask.fieldPaths=count&currentDocument.updateTime=${encodeURIComponent(doc.updateTime)}`, {
      method: 'PATCH', headers: h, body: JSON.stringify({ fields: { count: { integerValue: String(used + 1) } } }),
    })
    if (u.ok) return { used: used + 1 }
    if (u.status !== 409 && u.status !== 400) throw new Error(`firestore patch ${u.status}`)
    // o documento mudou no meio (duas mensagens ao mesmo tempo): lê de novo e tenta outra vez
  }
  throw new Error('contador em disputa')
}
