import { LANGS } from '../data/content.js'
import { speak } from '../lib/speech.js'
import { displayWords } from '../lib/text.js'

const PATHS = {
  book: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5',
  pen: 'M15.5 4.5l4 4L8 20H4v-4zM13.5 6.5l4 4',
  mic: 'M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3zM5 11a7 7 0 0 0 14 0M12 18v3',
  speaker: 'M4 9h4l5-4v14l-5-4H4zM16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12',
  slow: 'M4 16c0-4 3.5-7 8-7s7 3 7 6v1H4zM19 13h2a1 1 0 0 0 0-2h-1M7 16v2M15 16v2M9 9l1-3',
  back: 'M15 5l-7 7 7 7',
  close: 'M6 6l12 12M18 6L6 18',
  flame: 'M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-5 1-8.5z',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  shuffle: 'M3 7h4l10 10h4M3 17h4l3-3M14 10l3-3h4M18 4l3 3-3 3M18 14l3 3-3 3',
  repeat: 'M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5M20 12a8 8 0 0 1-14 5.3L4 15M4 20v-5h5',
  stop: 'M7 7h10v10H7z',
  play: 'M8 5v14l11-7z',
  bulb: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z',
}

export function Icon({ name, size = 20, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      <path d={PATHS[name]} />
    </svg>
  )
}

export function SpeakButtons({ text, lang, size = 'md', slow = true }) {
  const tag = LANGS[lang].speech
  return (
    <span className={`speak-btns ${size}`}>
      <button type="button" className="icon-btn" aria-label="Ouvir" title="Ouvir" onClick={() => speak(text, tag)}>
        <Icon name="speaker" />
      </button>
      {slow && (
        <button type="button" className="icon-btn" aria-label="Ouvir devagar" title="Ouvir devagar" onClick={() => speak(text, tag, { rate: 0.55 })}>
          <Icon name="slow" />
        </button>
      )}
    </span>
  )
}

// Mostra cada palavra com a pronúncia "aportuguesada" embaixo.
// status (opcional): array de { ok } vindo da correção de fala.
export function PronLine({ item, lang, status, showPron = true, big = false }) {
  const words = displayWords(item.text)
  const prons = item.pron.split(/\s+/)
  const tag = LANGS[lang].speech
  return (
    <div className={`pron-line ${big ? 'big' : ''}`}>
      {words.map((w, i) => {
        const st = status?.[i]
        const cls = st ? (st.ok ? 'ok' : 'bad') : ''
        return (
          <button type="button" key={i} className={`pron-word ${cls}`} onClick={() => speak(w.replace(/[¿¡?!.,]/g, ''), tag, { rate: 0.7 })}
            title="Clique pra ouvir essa palavra">
            <span className="w">{w}</span>
            {showPron && <span className="p"><Stress text={prons[i]} /></span>}
          </button>
        )
      })}
    </div>
  )
}

// Destaca a sílaba tônica (a que está em MAIÚSCULAS)
export function Stress({ text = '' }) {
  return text.split('-').map((syl, i, arr) => {
    const strong = syl.length > 0 && syl === syl.toUpperCase() && /\p{L}/u.test(syl)
    return (
      <span key={i}>
        {strong ? <strong>{syl.toLowerCase()}</strong> : syl}
        {i < arr.length - 1 && <span className="dash">·</span>}
      </span>
    )
  })
}

export function tipsFor(lang, words) {
  const tips = LANGS[lang].tips
  const out = new Map()
  for (const { w, p } of words)
    for (const [label, text, test] of tips)
      if (test?.(w, p)) out.set(label, text)
  return [...out.entries()]
}

export function ProgressBar({ value, label }) {
  return (
    <div className="bar" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value * 100)}>
      <span style={{ transform: `scaleX(${Math.max(0, Math.min(1, value))})` }} />
    </div>
  )
}
