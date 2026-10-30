import { useEffect, useState } from 'react'
import { LANGS } from '../data/content.js'
import { autoSpeak } from '../lib/speech.js'
import { SpeakButtons } from './ui.jsx'

// Escolher uma opção e depois confirmar. Evita acertar/errar por toque sem querer
// e dá tempo de mudar de ideia.
function useConfirm(locked, onAnswer, isRight) {
  const [sel, setSel] = useState(null)
  const confirm = () => {
    if (locked || sel === null) return
    onAnswer(isRight(sel))
  }
  return { sel, setSel: (v) => !locked && setSel(v), confirm }
}

function Keys({ count, locked, onPick, onConfirm }) {
  useEffect(() => {
    const h = (e) => {
      if (locked || e.target.tagName === 'INPUT') return
      if (e.key === 'Enter') { e.preventDefault(); return onConfirm() }
      const n = parseInt(e.key, 10)
      if (n >= 1 && n <= count) onPick(n - 1)
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  })
  return null
}

function ConfirmBar({ locked, disabled, onConfirm }) {
  return (
    <div className="ex-actions">
      <button type="button" className="primary" disabled={locked || disabled} onClick={onConfirm}>Verificar</button>
    </div>
  )
}

export function Choice({ item, ex, lang, locked, onAnswer }) {
  const reverse = ex.type === 'reverse'
  const { sel, setSel, confirm } = useConfirm(locked, onAnswer, (opt) => opt === ex.answer)

  // quando a frase em outro idioma está na tela, ela já é falada
  useEffect(() => { if (!reverse) autoSpeak(item.text, LANGS[lang].speech) }, [])

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
      <div className="options" role="radiogroup" aria-label="Opções">
        {ex.options.map((opt, i) => {
          let cls = ''
          if (locked && opt === ex.answer) cls = 'right'
          else if (locked && opt === sel) cls = 'wrong'
          else if (!locked && opt === sel) cls = 'selected'
          return (
            <button key={opt} role="radio" aria-checked={opt === sel} className={`option ${cls}`}
              onClick={() => setSel(opt)} disabled={locked} lang={reverse ? lang : undefined}>
              <kbd>{i + 1}</kbd>{opt}
            </button>
          )
        })}
      </div>
      <ConfirmBar locked={locked} disabled={sel === null} onConfirm={confirm} />
      <Keys count={ex.options.length} locked={locked} onPick={(i) => setSel(ex.options[i])} onConfirm={confirm} />
    </div>
  )
}

export function TrueFalse({ item, ex, lang, locked, onAnswer }) {
  const { sel, setSel, confirm } = useConfirm(locked, onAnswer, (v) => v === ex.isTrue)
  useEffect(() => { autoSpeak(item.text, LANGS[lang].speech) }, [])

  const btn = (v, label, n) => {
    let cls = ''
    if (locked && v === ex.isTrue) cls = 'right'
    else if (locked && v === sel) cls = 'wrong'
    else if (!locked && v === sel) cls = 'selected'
    return (
      <button role="radio" aria-checked={sel === v} className={`option ${cls}`} onClick={() => setSel(v)} disabled={locked}>
        <kbd>{n}</kbd>{label}
      </button>
    )
  }
  return (
    <div className="ex">
      <p className="ex-kind">A tradução está certa?</p>
      <div className="prompt">
        <h2 className="prompt-text" lang={lang}>{item.text}</h2>
        <SpeakButtons text={item.text} lang={lang} />
      </div>
      <p className="tf-shown">= “{ex.shown}”</p>
      <div className="options two" role="radiogroup" aria-label="A tradução está certa?">
        {btn(true, 'Certa', 1)}
        {btn(false, 'Errada', 2)}
      </div>
      <ConfirmBar locked={locked} disabled={sel === null} onConfirm={confirm} />
      <Keys count={2} locked={locked} onPick={(i) => setSel(i === 0)} onConfirm={confirm} />
    </div>
  )
}

export function Match({ item, ex, lang, locked, onAnswer }) {
  const [sel, setSel] = useState(null) // id selecionado à esquerda
  const [done, setDone] = useState(new Set())
  const [flash, setFlash] = useState(null)
  const [mainMissed, setMainMissed] = useState(false)

  const pickLeft = (l) => {
    setSel(l.id)
    autoSpeak(l.label, LANGS[lang].speech)
  }

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
              onClick={() => pickLeft(l)}>{l.label}</button>
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
