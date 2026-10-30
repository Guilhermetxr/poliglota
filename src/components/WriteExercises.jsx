import { useEffect, useRef, useState } from 'react'
import { LANGS } from '../data/content.js'
import { checkWritten, displayWords, normSentence, wordKey, stripAccents } from '../lib/text.js'
import { speak } from '../lib/speech.js'
import { SpeakButtons, Icon } from './ui.jsx'

function AccentBar({ lang, inputRef, setValue }) {
  const chars = LANGS[lang].accents
  if (!chars.length) return null
  const insert = (ch) => {
    const el = inputRef.current
    if (!el) return
    const s = el.selectionStart ?? el.value.length
    const e = el.selectionEnd ?? el.value.length
    const v = el.value.slice(0, s) + ch + el.value.slice(e)
    setValue(v)
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(s + ch.length, s + ch.length) })
  }
  return (
    <div className="accents" aria-label="Acentos">
      {chars.map((c) => (
        <button type="button" key={c} onMouseDown={(e) => e.preventDefault()} onClick={() => insert(c)}>{c}</button>
      ))}
    </div>
  )
}

// Digitar: tradução (com ou sem dica) e ditado
export function TypeAnswer({ item, ex, lang, locked, onAnswer }) {
  const [value, setValue] = useState('')
  const ref = useRef(null)
  const dictation = ex.type === 'dictation'
  const hint = ex.type === 'type-hint'

  useEffect(() => {
    ref.current?.focus()
    if (dictation) speak(item.text, LANGS[lang].speech)
  }, [])

  const submit = (e) => {
    e.preventDefault()
    if (locked || !value.trim()) return
    const r = checkWritten(value, item)
    onAnswer(r.ok, { note: r.note, typed: value })
  }

  return (
    <form className="ex" onSubmit={submit}>
      <p className="ex-kind">{dictation ? 'Escreva o que você ouviu' : `Escreva em ${LANGS[lang].name.toLowerCase()}`}</p>
      <div className="prompt">
        {dictation ? (
          <div className="dictation">
            <button type="button" className="big-play" onClick={() => speak(item.text, LANGS[lang].speech)} aria-label="Ouvir de novo">
              <Icon name="speaker" size={32} />
            </button>
            <button type="button" className="icon-btn" onClick={() => speak(item.text, LANGS[lang].speech, { rate: 0.55 })} aria-label="Ouvir devagar" title="Ouvir devagar">
              <Icon name="slow" />
            </button>
          </div>
        ) : <h2 className="prompt-text">{item.pt}</h2>}
      </div>
      {hint && <p className="hint mono" lang={lang}>{hintMask(item.text)}</p>}
      <input ref={ref} className="answer-input" lang={lang} value={value} onChange={(e) => setValue(e.target.value)}
        disabled={locked} autoComplete="off" autoCapitalize="off" spellCheck={false} placeholder="Digite aqui…"
        aria-label="Sua resposta" />
      <AccentBar lang={lang} inputRef={ref} setValue={setValue} />
      <div className="ex-actions">
        <button type="button" className="ghost" disabled={locked} onClick={() => onAnswer(false, { typed: '' })}>Não sei</button>
        <button className="primary" disabled={locked || !value.trim()}>Verificar</button>
      </div>
    </form>
  )
}

function hintMask(text) {
  return displayWords(text).map((w) => w[0] + w.slice(1).replace(/\p{L}/gu, '_')).join('  ')
}

// Banco de palavras: montar a frase
export function Bank({ item, ex, lang, locked, onAnswer }) {
  const [picked, setPicked] = useState([]) // índices dos tiles
  const byI = Object.fromEntries(ex.tiles.map((t) => [t.i, t.w]))
  const sentence = picked.map((i) => byI[i]).join(' ')

  const check = () => {
    if (locked || !picked.length) return
    const ok = normSentence(sentence) === normSentence(item.text)
    onAnswer(ok, { typed: sentence })
  }

  return (
    <div className="ex">
      <p className="ex-kind">Monte a frase</p>
      <div className="prompt"><h2 className="prompt-text">{item.pt}</h2></div>
      <div className="bank-answer" lang={lang}>
        {picked.length === 0 && <span className="hint">Toque nas palavras abaixo na ordem certa</span>}
        {picked.map((i) => (
          <button key={i} className="tile" disabled={locked} onClick={() => setPicked(picked.filter((x) => x !== i))}>{byI[i]}</button>
        ))}
      </div>
      <div className="bank-tiles" lang={lang}>
        {ex.tiles.map((t) => (
          <button key={t.i} className={`tile ${picked.includes(t.i) ? 'used' : ''}`} disabled={locked || picked.includes(t.i)}
            onClick={() => { setPicked([...picked, t.i]); speak(t.w.replace(/[¿¡?!.,]/g, ''), LANGS[lang].speech, { rate: 0.9 }) }}>{t.w}</button>
        ))}
      </div>
      <div className="ex-actions">
        <button type="button" className="ghost" disabled={locked || !picked.length} onClick={() => setPicked([])}>Limpar</button>
        <button className="primary" disabled={locked || !picked.length} onClick={check}>Verificar</button>
      </div>
    </div>
  )
}

// Completar a palavra que falta
export function Complete({ item, ex, lang, locked, onAnswer }) {
  const [value, setValue] = useState('')
  const ref = useRef(null)
  const words = displayWords(item.text)
  useEffect(() => { ref.current?.focus() }, [])

  const submit = (e) => {
    e.preventDefault()
    if (locked || !value.trim()) return
    const a = wordKey(value, { accents: true }), b = wordKey(ex.answer, { accents: true })
    if (a === b) return onAnswer(true, { typed: value })
    if (stripAccents(a) === stripAccents(b)) return onAnswer(true, { typed: value, note: 'Certo, mas cuidado com os acentos.' })
    onAnswer(false, { typed: value })
  }

  return (
    <form className="ex" onSubmit={submit}>
      <p className="ex-kind">Complete a frase</p>
      <div className="prompt column">
        <h2 className="prompt-text complete" lang={lang}>
          {words.map((w, i) => i === ex.blank
            ? <span key={i} className="blank">{locked ? ex.answer : (value || '    ')}</span>
            : <span key={i}>{w}</span>)}
        </h2>
        <p className="sub">“{item.pt}”</p>
      </div>
      <input ref={ref} className="answer-input" lang={lang} value={value} onChange={(e) => setValue(e.target.value)}
        disabled={locked} autoComplete="off" autoCapitalize="off" spellCheck={false} placeholder="Palavra que falta…" aria-label="Palavra que falta" />
      <AccentBar lang={lang} inputRef={ref} setValue={setValue} />
      <div className="ex-actions">
        <button type="button" className="ghost" disabled={locked} onClick={() => onAnswer(false, { typed: '' })}>Não sei</button>
        <button className="primary" disabled={locked || !value.trim()}>Verificar</button>
      </div>
      {locked && <SpeakButtons text={item.text} lang={lang} />}
    </form>
  )
}
