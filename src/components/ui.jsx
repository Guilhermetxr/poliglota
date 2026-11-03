import { useEffect, useState } from 'react'
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
  mute: 'M4 9h4l5-4v14l-5-4H4zM17 9.5l4 5M21 9.5l-4 5',
  lock: 'M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z',
  eye: 'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12zM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z',
  eyeoff: 'M4 4l16 16M9.9 6A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a16 16 0 0 1-3 3.8M6.1 7.7A16 16 0 0 0 2.5 12S6 18.5 12 18.5a9.5 9.5 0 0 0 4.2-1',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  // categorias
  chat: 'M4 5h16v10H9l-5 4zM8 9h8M8 12h5',
  home: 'M3 11l9-7 9 7M5 10v10h14V10M10 20v-6h4v6',
  food: 'M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 21V3c-2 1-3.5 4-3.5 8H17',
  suitcase: 'M5 8h14v12H5zM9 8V5h6v3M9.5 12v4M14.5 12v4',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2',
  people: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M17 11a2.5 2.5 0 1 0 0-5M18 14c2 .5 3.5 2.5 3.5 5',
  coffee: 'M5 9h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4zM16 10h2a2 2 0 0 1 0 4h-2M8 3v3M12 3v3',
  laptop: 'M5 6h14v9H5zM3 18.5h18',
  heartplus: 'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10zM12 9v5M9.5 11.5h5',
  smile: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM8 14c1 1.5 2.5 2 4 2s3-.5 4-2M9 9.5v.5M15 9.5v.5',
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

// Número que sobe até o valor final (sem animação se a pessoa pediu menos movimento)
export function CountUp({ to, prefix = '', suffix = '', ms = 800 }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !to) { setV(to); return }
    let raf
    const t0 = performance.now()
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / ms)
      setV(Math.round(to * (1 - Math.pow(1 - k, 3)))) // desacelera no fim
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, ms])
  return <>{prefix}{v}{suffix}</>
}
