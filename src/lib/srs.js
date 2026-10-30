// Repetição espaçada (estilo Leitner).
// Cada item tem um progresso separado por idioma E por modo (leitura, escrita, fala).
// Acertou: sobe de nível e o intervalo até voltar aumenta.
// Errou: volta pro nível 1, reaparece em ~1 minuto e ainda volta na mesma sessão.
//
// Tudo fica no localStorage. Se a pessoa estiver logada, sync.js espelha no Firebase
// usando snapshot() / mergeRemote() / onChange() daqui.

const KEY = 'idiomas:srs:v1'
const SKEY = 'idiomas:stats:v1'
const UKEY = 'idiomas:unlock:v1'
const MIN = 60 * 1000, HOUR = 60 * MIN, DAY = 24 * HOUR

// intervalo por nível (índice = nível)
export const INTERVALS = [0, 1 * MIN, 10 * MIN, 8 * HOUR, 1 * DAY, 3 * DAY, 7 * DAY, 16 * DAY, 35 * DAY, 90 * DAY]
export const MAX_BOX = INTERVALS.length - 1
export const MASTERED_BOX = 6

// ── armazenamento ──
const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}
const write = (key, v) => {
  try { localStorage.setItem(key, JSON.stringify(v)) } catch { /* sem storage */ }
}

let cache = null
let unlocks = null
const load = () => (cache ??= read(KEY, {}))
const loadUnlocks = () => (unlocks ??= read(UKEY, {}))

const listeners = new Set()
export function onChange(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
const emit = () => listeners.forEach((f) => f())

function save() { write(KEY, cache); emit() }

// ── cartões ──
const k = (lang, mode, id) => `${lang}|${mode}|${id}`

export function getCard(lang, mode, id) {
  return load()[k(lang, mode, id)] || { box: 0, due: 0, right: 0, wrong: 0, seen: 0 }
}

export function review(lang, mode, id, correct) {
  const db = load()
  const c = { ...getCard(lang, mode, id) }
  const now = Date.now()
  c.seen++
  c.last = now
  if (correct) {
    c.right++
    c.box = Math.min(c.box + 1, MAX_BOX)
  } else {
    c.wrong++
    c.box = 1
  }
  c.due = now + INTERVALS[c.box]
  db[k(lang, mode, id)] = c
  save()
  return c
}

// Peso de "dificuldade": itens com histórico de erro aparecem mais
const difficulty = (c) => (c.wrong + 1) / (c.right + 1)

export function buildSession(lang, mode, items, { size = 12, newMax = 4, onlyDue = false } = {}) {
  const now = Date.now()
  const withCard = items.map((it) => ({ it, c: getCard(lang, mode, it.id) }))

  const due = withCard
    .filter(({ c }) => c.seen > 0 && c.due <= now)
    .sort((a, b) => difficulty(b.c) - difficulty(a.c) || a.c.due - b.c.due)
  const fresh = withCard.filter(({ c }) => c.seen === 0)
  const ahead = withCard
    .filter(({ c }) => c.seen > 0 && c.due > now)
    // os mais difíceis e os que vencem antes primeiro
    .sort((a, b) => difficulty(b.c) - difficulty(a.c) || a.c.due - b.c.due)

  const out = due.slice(0, size)
  if (!onlyDue) {
    const room = size - out.length
    out.push(...fresh.slice(0, Math.min(newMax, room)))
    if (out.length < size) out.push(...ahead.slice(0, size - out.length))
    if (out.length < size) out.push(...fresh.slice(Math.min(newMax, room), Math.min(newMax, room) + size - out.length))
  } else if (out.length < 4) {
    // revisão: completa com os que você mais erra
    out.push(...ahead.filter(({ c }) => c.wrong > 0).slice(0, 8 - out.length))
  }
  // embaralha levemente mantendo os novos espalhados
  return out
    .map((x, i) => ({ x, r: i + Math.random() * 4 }))
    .sort((a, b) => a.r - b.r)
    .map(({ x }) => x.it)
}

export function stats(lang, mode, items) {
  const now = Date.now()
  let seen = 0, mastered = 0, due = 0, sumBox = 0
  for (const it of items) {
    const c = getCard(lang, mode, it.id)
    if (c.seen) seen++
    if (c.box >= MASTERED_BOX) mastered++
    if (c.seen && c.due <= now) due++
    sumBox += Math.min(c.box, MASTERED_BOX)
  }
  return { total: items.length, seen, mastered, due, progress: items.length ? sumBox / (items.length * MASTERED_BOX) : 0 }
}

// ── níveis destravados manualmente ──
export const isUnlocked = (lang, mode, level) => !!loadUnlocks()[`${lang}|${mode}|${level}`]
export function setUnlocked(lang, mode, level) {
  loadUnlocks()[`${lang}|${mode}|${level}`] = true
  write(UKEY, unlocks)
  emit()
}

// ── XP e ofensiva (streak) ──
const today = () => new Date().toISOString().slice(0, 10)

export function getProfile() {
  const p = read(SKEY, null) || { xp: 0, streak: 0, lastDay: null, todayXp: 0, goal: 50 }
  if (p.lastDay !== today()) p.todayXp = 0
  const y = new Date(Date.now() - DAY).toISOString().slice(0, 10)
  if (p.lastDay && p.lastDay !== today() && p.lastDay !== y) p.streak = 0
  return p
}

export function addXp(amount) {
  const p = getProfile()
  if (p.lastDay !== today()) {
    p.streak = (p.streak || 0) + 1
    p.lastDay = today()
    p.todayXp = 0
  }
  p.xp += amount
  p.todayXp += amount
  write(SKEY, p)
  emit()
  return p
}

// ── sincronização ──
export function hasProgress() {
  return Object.keys(load()).length > 0 || getProfile().xp > 0
}

export function snapshot() {
  return { cards: load(), unlocks: loadUnlocks(), profile: read(SKEY, null) }
}

function newerCard(a, b) {
  if (!a) return b
  if (!b) return a
  const la = a.last || 0, lb = b.last || 0
  if (la !== lb) return la > lb ? a : b
  return a.seen >= b.seen ? a : b
}

// Junta o que veio da nuvem com o que existe aqui. Nada se perde:
// cada cartão fica com a versão mais recente, níveis destravados somam, XP fica com o maior.
export function mergeRemote(remote) {
  if (!remote) return
  const cards = load()
  for (const [key, rc] of Object.entries(remote.cards || {})) cards[key] = newerCard(cards[key], rc)
  Object.assign(loadUnlocks(), remote.unlocks || {})

  const l = read(SKEY, null)
  const r = remote.profile
  if (r) {
    if (!l) write(SKEY, r)
    else {
      const later = (r.lastDay || '') > (l.lastDay || '') ? r : l
      const same = (r.lastDay || '') === (l.lastDay || '')
      write(SKEY, {
        ...l,
        xp: Math.max(l.xp || 0, r.xp || 0),
        lastDay: later.lastDay,
        streak: same ? Math.max(l.streak || 0, r.streak || 0) : later.streak,
        todayXp: same ? Math.max(l.todayXp || 0, r.todayXp || 0) : later.todayXp,
        goal: l.goal ?? r.goal,
      })
    }
  }
  write(KEY, cards)
  write(UKEY, unlocks)
  emit()
}

// Apaga o progresso deste navegador (usado ao sair da conta ou em "Apagar progresso")
export function clearLocal() {
  cache = {}
  unlocks = {}
  try {
    localStorage.removeItem(KEY)
    localStorage.removeItem(SKEY)
    localStorage.removeItem(UKEY)
  } catch { /* nada */ }
  emit()
}
export const resetAll = clearLocal
