// Níveis: o próximo destrava quando você já aprendeu boa parte do anterior.
// "Aprendeu" = o item chegou na caixa 3 (já voltou depois de várias horas) NAQUELE modo.
// Dá também pra destravar na mão se você já sabe o básico.
import { ITEMS, LEVELS } from '../data/content.js'
import { getCard, isUnlocked, setUnlocked } from './srs.js'

export const LEARNED_BOX = 3
export const UNLOCK_RATIO = 0.6

export function levelProgress(lang, mode, level) {
  const items = ITEMS[lang].filter((i) => i.level === level)
  const learned = items.filter((i) => getCard(lang, mode, i.id).box >= LEARNED_BOX).length
  const total = items.length
  return { learned, total, ratio: total ? learned / total : 0, need: Math.ceil(total * UNLOCK_RATIO) }
}

// Maior nível liberado (1, 2 ou 3), sempre em sequência
export function maxLevel(lang, mode) {
  let max = 1
  for (let n = 1; n < LEVELS.length; n++) {
    if (isUnlocked(lang, mode, n + 1) || levelProgress(lang, mode, n).ratio >= UNLOCK_RATIO) max = n + 1
    else break
  }
  return max
}

export const unlockNow = (lang, mode, level) => setUnlocked(lang, mode, level)
