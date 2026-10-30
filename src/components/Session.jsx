import { useEffect, useMemo, useState } from 'react'
import { CATEGORIES, LANGS, LEVELS, itemsFor } from '../data/content.js'
import { addXp, buildSession, getCard, review, INTERVALS } from '../lib/srs.js'
import { maxLevel } from '../lib/levels.js'
import { makeExercise, MODES } from '../lib/exercises.js'
import { alignWords } from '../lib/text.js'
import { Choice, Match, TrueFalse } from './ReadExercises.jsx'
import { Bank, Complete, TypeAnswer } from './WriteExercises.jsx'
import { Speak } from './SpeakExercise.jsx'
import { Icon, PronLine, ProgressBar, SpeakButtons } from './ui.jsx'

const COMPONENTS = {
  choice: Choice, reverse: Choice, truefalse: TrueFalse, match: Match,
  type: TypeAnswer, 'type-hint': TypeAnswer, dictation: TypeAnswer, bank: Bank, complete: Complete,
  repeat: Speak, listen: Speak, translate: Speak,
}

const PRAISE = ['Mandou bem!', 'Isso aí!', 'Perfeito!', 'Boa!', 'Certinho!']
const MAX_RETRIES = 2

export function Session({ lang, mode, cat, onExit }) {
  const [startLevel] = useState(() => maxLevel(lang, mode))
  const catItems = useMemo(() => itemsFor(lang, cat, startLevel), [lang, cat, startLevel])
  const pool = catItems.length >= 6 ? catItems : itemsFor(lang, 'geral', startLevel)
  const [queue, setQueue] = useState(() => buildSession(lang, mode, catItems, { onlyDue: cat === 'revisao' }))
  const [idx, setIdx] = useState(0)
  const [ex, setEx] = useState(() => queue[0] && makeExercise(queue[0], mode, getCard(lang, mode, queue[0].id).box, pool))
  const [fb, setFb] = useState(null)
  const [log, setLog] = useState([])
  const [retries, setRetries] = useState({})
  const [xp, setXp] = useState(0)
  const [done, setDone] = useState(false)

  const item = queue[idx]

  const onAnswer = (correct, info = {}) => {
    if (fb) return
    const card = review(lang, mode, item.id, correct)
    setLog((l) => [...l, { item, correct }])
    if (correct) {
      addXp(10)
      setXp((x) => x + 10)
    } else if ((retries[item.id] || 0) < MAX_RETRIES) {
      // errou: a mesma coisa volta daqui a pouco, nesta mesma sessão
      const q = [...queue]
      q.splice(Math.min(idx + 3, q.length), 0, item)
      setQueue(q)
      setRetries({ ...retries, [item.id]: (retries[item.id] || 0) + 1 })
    }
    setFb({ correct, ...info, card })
  }

  const next = () => {
    const n = idx + 1
    setFb(null)
    if (n >= queue.length) return setDone(true)
    setIdx(n)
    setEx(makeExercise(queue[n], mode, getCard(lang, mode, queue[n].id).box, pool))
  }

  useEffect(() => {
    if (!fb) return
    const h = (e) => { if (e.key === 'Enter') { e.preventDefault(); next() } }
    // espera um tique pra o Enter que enviou a resposta não pular direto
    const t = setTimeout(() => window.addEventListener('keydown', h), 50)
    return () => { clearTimeout(t); window.removeEventListener('keydown', h) }
  })

  const catName = cat === 'geral' ? 'Geral' : cat === 'revisao' ? 'Revisão' : CATEGORIES.find((c) => c.id === cat)?.name

  if (!queue.length) {
    return (
      <div className="session empty">
        <h2>Nada pra revisar agora</h2>
        <p>Tudo que você estudou em {MODES[mode].name.toLowerCase()} está em dia. Volta mais tarde ou estude algo novo.</p>
        <button className="primary" onClick={onExit}>Voltar</button>
      </div>
    )
  }

  if (done) return <Summary log={log} xp={xp} lang={lang} mode={mode} startLevel={startLevel} onExit={onExit} />

  const Comp = COMPONENTS[ex.type]
  const firstTime = getCard(lang, mode, item.id).seen === 0 && !fb

  return (
    <div className={`session mode-${mode}`}>
      <header className="session-top">
        <button className="icon-btn" onClick={onExit} aria-label="Sair da lição"><Icon name="close" /></button>
        <ProgressBar value={idx / queue.length} label="Progresso da lição" />
        <span className="xp-pill">+{xp} XP</span>
      </header>
      <p className="session-meta">
        {LANGS[lang].name} · {MODES[mode].name} · {catName}
        {firstTime && <span className="badge-new">novo</span>}
        {retries[item.id] > 0 && !fb && <span className="badge-retry">revendo erro</span>}
      </p>

      <main className="session-body">
        <Comp key={`${idx}-${item.id}`} item={item} ex={ex} lang={lang} locked={!!fb} onAnswer={onAnswer} onSkip={next} />
      </main>

      {fb && <Feedback fb={fb} item={item} lang={lang} mode={mode} onNext={next} />}
    </div>
  )
}

function when(ms) {
  if (ms < 60 * 60 * 1000) return `${Math.max(1, Math.round(ms / 60000))} min`
  if (ms < 24 * 60 * 60 * 1000) return `${Math.round(ms / 3600000)} h`
  const d = Math.round(ms / 86400000)
  return `${d} dia${d > 1 ? 's' : ''}`
}

function Feedback({ fb, item, lang, mode, onNext }) {
  const [praise] = useState(() => PRAISE[Math.floor(Math.random() * PRAISE.length)])
  const showAnswer = !fb.correct || fb.note || mode !== 'fala'
  const status = !fb.correct && fb.typed ? alignWords(item.text, fb.typed).words : undefined
  return (
    <div className={`feedback ${fb.correct ? 'good' : 'bad'}`} role="status">
      <div className="feedback-inner">
        <div className="feedback-text">
          <p className="feedback-title">{fb.correct ? praise : mode === 'fala' ? 'Quase lá' : 'Resposta certa:'}</p>
          {fb.note && <p className="feedback-note">{fb.note}</p>}
          {showAnswer && mode !== 'fala' && (
            <div className="feedback-answer">
              <PronLine item={item} lang={lang} status={status} />
              <p className="sub">“{item.pt}” <SpeakButtons text={item.text} lang={lang} size="sm" slow={false} /></p>
              {!fb.correct && fb.typed && <p className="sub">Você: <s lang={lang}>{fb.typed}</s></p>}
            </div>
          )}
          {item.note && <p className="feedback-note">💡 {item.note}</p>}
          <p className="feedback-when">
            {fb.correct ? `Volta em ${when(INTERVALS[fb.card.box])}` : 'Vai aparecer de novo daqui a pouco'}
          </p>
        </div>
        <button className="primary" onClick={onNext} autoFocus>Continuar</button>
      </div>
    </div>
  )
}

function Summary({ log, xp, lang, mode, startLevel, onExit }) {
  const unlocked = maxLevel(lang, mode)
  const first = new Map()
  for (const l of log) if (!first.has(l.item.id)) first.set(l.item.id, l)
  const total = first.size
  const right = [...first.values()].filter((l) => l.correct).length
  const missed = [...new Map(log.filter((l) => !l.correct).map((l) => [l.item.id, l.item])).values()]
  return (
    <div className="session summary">
      <p className="eyebrow">{LANGS[lang].name} · {MODES[mode].name}</p>
      <h2>Lição concluída</h2>
      {unlocked > startLevel && (
        <p className="level-up" role="status">🎉 Você destravou o nível {unlocked}: {LEVELS[unlocked - 1].name}. Tem frases novas esperando.</p>
      )}
      <div className="summary-stats">
        <div><b>{total ? Math.round((right / total) * 100) : 0}%</b><span>de acerto de primeira</span></div>
        <div><b>+{xp}</b><span>XP</span></div>
        <div><b>{missed.length}</b><span>pra reforçar</span></div>
      </div>
      {missed.length > 0 && (
        <section className="missed">
          <h3>Esses vão voltar com mais frequência</h3>
          <ul>
            {missed.map((it) => (
              <li key={it.id}>
                <PronLine item={it} lang={lang} />
                <span className="sub">{it.pt}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
      <div className="ex-actions">
        <button className="primary" onClick={onExit}>Voltar</button>
      </div>
    </div>
  )
}
