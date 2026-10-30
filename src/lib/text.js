// Normalização, tokenização e comparação de respostas.

const PUNCT = /[.,!?¿¡;:"«»()…“”]/g

export function stripAccents(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/œ/g, 'oe')
}

// Palavras "de exibição" do texto (mantém pontuação colada na palavra)
export function displayWords(text) {
  return text.split(/\s+/).filter((w) => w.replace(PUNCT, '').length > 0)
}

// Chave de comparação de uma palavra
export function wordKey(w, { accents = false } = {}) {
  let s = w.toLowerCase().replace(/[’`]/g, "'").replace(PUNCT, '').replace(/['-]/g, '')
  if (!accents) s = stripAccents(s)
  return s
}

export function normSentence(s, opts) {
  return displayWords(s).map((w) => wordKey(w, opts)).filter(Boolean).join(' ')
}

export function levenshtein(a, b) {
  if (a === b) return 0
  const dp = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0]
    dp[0] = i
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j]
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1))
      prev = tmp
    }
  }
  return dp[b.length]
}

// Tolerância pequena só pra palavras longas e com o mesmo começo
// (senão "padre" passaria por "madre")
const close = (a, b) => a === b || (a.length >= 6 && b.length >= 6 && a.slice(0, 2) === b.slice(0, 2) && levenshtein(a, b) <= 1)

// Alinha as palavras do alvo com o que foi dito/escrito (LCS).
// Retorna, para cada palavra do alvo, se ela apareceu e o que foi dito no lugar.
export function alignWords(targetText, saidText) {
  const target = displayWords(targetText)
  const tk = target.map((w) => wordKey(w))
  const said = displayWords(saidText)
  const sk = said.map((w) => wordKey(w))
  const n = tk.length, m = sk.length
  const L = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      L[i][j] = close(tk[i], sk[j]) ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1])

  const result = target.map((w) => ({ word: w, ok: false, heard: null }))
  let i = 0, j = 0
  const extra = []
  while (i < n && j < m) {
    if (close(tk[i], sk[j])) { result[i].ok = true; i++; j++ }
    else if (L[i + 1][j] >= L[i][j + 1]) { result[i].heard = result[i].heard ?? null; i++ }
    else { extra.push(said[j]); j++ }
  }
  while (j < m) extra.push(said[j++])
  // tenta atribuir palavras "erradas" ditas à palavra-alvo perdida mais próxima
  let e = 0
  for (const r of result) if (!r.ok && e < extra.length) r.heard = extra[e++]
  const hits = result.filter((r) => r.ok).length
  return { words: result, score: n ? hits / n : 0 }
}

// Confere uma resposta escrita contra o texto e as alternativas
export function checkWritten(input, item) {
  const candidates = [item.text, ...(item.alts || [])]
  const typed = input.trim()
  if (!typed) return { ok: false }
  for (const c of candidates) {
    if (normSentence(typed, { accents: true }) === normSentence(c, { accents: true }))
      return { ok: true, matched: c }
  }
  for (const c of candidates) {
    if (normSentence(typed) === normSentence(c))
      return { ok: true, matched: c, note: 'Certo, mas cuidado com os acentos.' }
  }
  for (const c of candidates) {
    const a = normSentence(typed), b = normSentence(c)
    const tol = b.length > 10 ? 2 : b.length > 4 ? 1 : 0
    if (tol && levenshtein(a, b) <= tol)
      return { ok: true, matched: c, note: 'Quase perfeito, tem um errinho de digitação.' }
  }
  return { ok: false }
}

export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
