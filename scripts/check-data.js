// Confere se cada pronúncia tem uma palavra para cada palavra do texto
import { ITEMS } from '../src/data/content.js'
import { displayWords } from '../src/lib/text.js'

let bad = 0
for (const [lang, items] of Object.entries(ITEMS)) {
  const ids = new Set()
  for (const it of items) {
    if (ids.has(it.id)) { console.log(`[${lang}] id repetido: ${it.id}`); bad++ }
    ids.add(it.id)
    const w = displayWords(it.text).length
    const p = it.pron.split(/\s+/).length
    if (w !== p) { console.log(`[${lang}] ${it.id}: "${it.text}" (${w}) x "${it.pron}" (${p})`); bad++ }
  }
  const byLevel = [1,2,3].map((n) => items.filter((i) => i.level === n).length).join(' / ')
  console.log(`${lang}: ${items.length} itens (níveis ${byLevel})`)
}
if (bad) { console.log(`\n${bad} problema(s)`); process.exit(1) }f
console.log('\nTudo certo.')
