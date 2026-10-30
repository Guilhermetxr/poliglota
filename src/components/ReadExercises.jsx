import { useState, useEffect } from 'react'
import { SpeakButtons } from './ui.jsx'

export function Choice({ item, ex, lang, locked, onAnswer }) {
  const [chosen, setChosen] = useState(null)
  const reverse = ex.type === 'reverse'
  const choose = (opt) => {
    if (locked) return
    setChosen(opt)
    onAnswer(opt === ex.answer)
  }
  return (
    <div className="ex">
      <p className="ex-kind">{reverse ? 'Como se diz isso?' : 'O que significa?'}</p>
      <div className="prompt">
        {reverse ? <h2 className="prompt-text">{item.pt}</h2> : (
          <>
            <h2 className="prompt-text" lang={lang}>{item.text}</h2>
            <SpeakButtons text={item.text} lang={lang} />
          </>
        )}
      </div>
      <div className="options">
        {ex.options.map((opt, i) => {
          let cls = ''
          if (locked && opt === ex.answer) cls = 'right'
          else if (locked && opt === chosen) cls = 'wrong'
          return (
            <button key={opt} className={`option ${cls}`} onClick={() => choose(opt)} disabled={locked} lang={reverse ? lang : undefined}>
              <kbd>{i + 1}</kbd>{opt}
            </button>
          )
        })}
      </div>
      <NumberKeys count={ex.options.length} onPick={(i) => choose(ex.options[i])} />
    </div>
  )
}

export function TrueFalse({ item, ex, lang, locked, onAnswer }) {
  const [chosen, setChosen] = useState(null)
  const choose = (v) => {
    if (locked) return
    setChosen(v)
    onAnswer(v === ex.isTrue)
  }
  const btn = (v, label, n) => {
    let cls = ''
    if (locked && v === ex.isTrue) cls = 'right'
    else if (locked && v === chosen) cls = 'wrong'
    return <button className={`option ${cls}`} onClick={() => choose(v)} disabled={locked}><kbd>{n}</kbd>{label}</button>
  }
  return (
    <div className="ex">
      <p className="ex-kind">A tradução está certa?</p>
      <div className="prompt">
        <h2 className="prompt-text" lang={lang}>{item.text}</h2>
        <SpeakButtons text={item.text} lang={lang} />
      </div>
      <p className="tf-shown">= “{ex.shown}”</p>
      <div className="options two">
        {btn(true, 'Certa', 1)}
        {btn(false, 'Errada', 2)}
      </div>
      <NumberKeys count={2} onPick={(i) => choose(i === 0)} />
    </div>
  )
}

export function Match({ item, ex, lang, locked, onAnswer }) {
  const [sel, setSel] = useState(null) // id selecionado à esquerda
  const [done, setDone] = useState(new Set())
  const [flash, setFlash] = useState(null)
  const [mainMissed, setMainMissed] = useState(false)

  const tryPair = (leftId, rightId) => {
    if (leftId === rightId) {
      const next = new Set(done).add(leftId)
      setDone(next)
      setSel(null)
      if (next.size === ex.left.length) onAnswer(!mainMissed)
    } else {
      if (leftId === item.id || rightId === item.id) setMainMissed(true)
      setFlash(rightId)
      setTimeout(() => setFlash(null), 350)
      setSel(null)
    }
  }

  return (
    <div className="ex">
      <p className="ex-kind">Ligue os pares</p>
      <div className="match">
        <div className="col">
          {ex.left.map((l) => (
            <button key={l.id} lang={lang} disabled={locked || done.has(l.id)}
              className={`option ${done.has(l.id) ? 'matched' : ''} ${sel === l.id ? 'selected' : ''}`}
              onClick={() => setSel(l.id)}>{l.label}</button>
          ))}
        </div>
        <div className="col">
          {ex.right.map((r) => (
            <button key={r.id} disabled={locked || done.has(r.id)}
              className={`option ${done.has(r.id) ? 'matched' : ''} ${flash === r.id ? 'shake' : ''}`}
              onClick={() => sel && tryPair(sel, r.id)}>{r.label}</button>
          ))}
        </div>
      </div>
      {!sel && done.size === 0 && <p className="hint">Escolha uma palavra na esquerda e depois o significado.</p>}
    </div>
  )
}

function NumberKeys({ count, onPick }) {
  useEffect(() => {
    const h = (e) => {
      if (e.target.tagName === 'INPUT') return
      const n = parseInt(e.key, 10)
      if (n >= 1 && n <= count) onPick(n - 1)
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  })
  return null
}
