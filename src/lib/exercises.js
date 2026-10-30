// Escolhe qual exercício mostrar para um item, conforme o modo e o nível dele.
import { displayWords, wordKey, shuffle, pick } from './text.js'

const ARTICLES = new Set(['the', 'a', 'an', 'le', 'la', 'les', 'l', 'un', 'une', 'el', 'los', 'las', 'il', 'lo', 'i', 'gli'])

function distractors(item, pool, n, field) {
  const same = shuffle(pool.filter((p) => p.id !== item.id && p.cat === item.cat && p[field] !== item[field]))
  const other = shuffle(pool.filter((p) => p.id !== item.id && p.cat !== item.cat && p[field] !== item[field]))
  const seen = new Set([item[field]])
  const out = []
  for (const p of [...same, ...other]) {
    if (out.length >= n) break
    if (seen.has(p[field])) continue
    // evita alternativa "errada" que também seria certa
    if (p.alts?.includes(item.text) || item.alts?.includes(p.text)) continue
    seen.add(p[field])
    out.push(p)
  }
  return out
}

function readEx(item, box, pool) {
  const types = box === 0 ? ['choice'] : box < 3 ? ['choice', 'reverse', 'truefalse', 'match'] : ['reverse', 'truefalse', 'match', 'choice']
  const type = pick(types)
  if (type === 'choice' || type === 'reverse') {
    const field = type === 'choice' ? 'pt' : 'text'
    const options = shuffle([item, ...distractors(item, pool, 3, field)]).map((p) => p[field])
    return { type, options, answer: item[field] }
  }
  if (type === 'truefalse') {
    const isTrue = Math.random() < 0.5
    const shown = isTrue ? item.pt : distractors(item, pool, 1, 'pt')[0]?.pt ?? item.pt
    return { type, shown, isTrue: shown === item.pt }
  }
  const others = distractors(item, pool, 4, 'pt')
  const pairs = shuffle([item, ...others])
  return { type: 'match', left: pairs.map((p) => ({ id: p.id, label: p.text })), right: shuffle(pairs).map((p) => ({ id: p.id, label: p.pt })) }
}

function writeEx(item, box, pool) {
  const words = displayWords(item.text)
  const multi = words.length >= 2
  let type
  if (box === 0) type = multi ? 'bank' : 'type-hint'
  else if (box < 3) type = pick(multi ? ['bank', 'complete', 'type', 'dictation'] : ['type-hint', 'type', 'dictation'])
  else type = pick(multi ? ['type', 'dictation', 'complete'] : ['type', 'dictation'])

  if (type === 'bank') {
    const extra = shuffle(distractors(item, pool, 6, 'text').flatMap((p) => displayWords(p.text)))
      .filter((w) => !words.some((x) => wordKey(x) === wordKey(w)))
      .slice(0, Math.min(4, Math.max(2, words.length)))
    return { type, tiles: shuffle([...words, ...extra]).map((w, i) => ({ i, w })) }
  }
  if (type === 'complete') {
    // esconde a palavra mais "importante" (a maior que não seja artigo)
    const candidates = words.map((w, i) => ({ w, i })).filter(({ w }) => !ARTICLES.has(wordKey(w)))
    const target = candidates.sort((a, b) => wordKey(b.w).length - wordKey(a.w).length)[0] ?? { w: words[0], i: 0 }
    return { type, blank: target.i, answer: target.w }
  }
  return { type }
}

function speakEx(item, box) {
  const type = box <= 1 ? 'repeat' : box < 4 ? pick(['repeat', 'listen']) : pick(['translate', 'listen', 'translate'])
  return { type }
}

export function makeExercise(item, mode, box, pool) {
  if (mode === 'leitura') return readEx(item, box, pool)
  if (mode === 'escrita') return writeEx(item, box, pool)
  return speakEx(item, box)
}

export const MODES = {
  leitura: { id: 'leitura', name: 'Leitura', verb: 'Ler', desc: 'Entender o que está escrito', icon: 'book' },
  escrita: { id: 'escrita', name: 'Escrita', verb: 'Escrever', desc: 'Montar e digitar frases', icon: 'pen' },
  fala: { id: 'fala', name: 'Fala', verb: 'Falar', desc: 'Pronunciar com correção', icon: 'mic' },
}
