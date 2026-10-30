import { useEffect, useRef, useState } from 'react'
import { LANGS } from '../data/content.js'
import { alignWords, displayWords } from '../lib/text.js'
import { canRecognize, digitsToWords, listen, record, speak } from '../lib/speech.js'
import { Icon, PronLine, Stress, tipsFor } from './ui.jsx'

const PASS = 0.8

function grade(item, alts, lang) {
  let best = null
  for (const said of alts) {
    const fixed = digitsToWords(said, lang)
    for (const target of [item.text, ...(item.alts || [])]) {
      const r = alignWords(target, fixed)
      // só usamos alinhamento palavra a palavra contra o texto principal (é ele que tem pronúncia)
      const main = target === item.text ? r : alignWords(item.text, fixed)
      const score = r.score
      if (!best || score > best.score) best = { score, words: main.words, said, perfectAlt: target !== item.text && score === 1 }
    }
  }
  return best
}

export function Speak({ item, ex, lang, locked, onAnswer, onSkip }) {
  const tag = LANGS[lang].speech
  const [fallback, setFallback] = useState(!canRecognize())
  const [phase, setPhase] = useState('idle') // idle | listening | result
  const [result, setResult] = useState(null)
  const [attempts, setAttempts] = useState(0)
  const [reveal, setReveal] = useState(ex.type === 'repeat')
  const [msg, setMsg] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const handle = useRef(null)

  useEffect(() => {
    if (ex.type !== 'translate') speak(item.text, tag)
    return () => handle.current?.stop?.()
  }, [])

  const start = async () => {
    setMsg(null)
    if (fallback) return startRecording()
    try {
      setPhase('listening')
      handle.current = listen(tag)
      const alts = await handle.current.promise
      if (!alts.length) {
        setPhase(result ? 'result' : 'idle')
        setMsg('Não ouvi nada. Aperta o microfone e fala pertinho.')
        return
      }
      const r = grade(item, alts, lang)
      const n = attempts + 1
      setAttempts(n)
      setResult(r)
      setReveal(true)
      setPhase('result')
      if (r.score >= PASS) {
        onAnswer(n === 1, {
          note: n === 1 ? (r.score < 1 ? 'Passou! Olha as palavras em vermelho pra deixar perfeito.' : null)
            : 'Agora foi! Como errou antes, essa frase vai voltar mais cedo pra fixar.',
        })
      }
    } catch (err) {
      setPhase(result ? 'result' : 'idle')
      if (err === 'not-allowed' || err === 'service-not-allowed') {
        setMsg('O navegador bloqueou o microfone. Libera a permissão no cadeado da barra de endereço.')
      } else if (err === 'network') {
        setMsg('O reconhecimento de voz deste navegador não está disponível (no Linux, use o Google Chrome). Mudei pro modo gravar e comparar.')
        setFallback(true)
      } else if (err === 'no-speech') {
        setMsg('Não ouvi nada. Tenta de novo.')
      } else {
        setMsg(`Erro no microfone (${err}).`)
      }
    }
  }

  const startRecording = async () => {
    try {
      setPhase('listening')
      handle.current = await record()
      const url = await handle.current.promise
      setAudioUrl(url)
      setReveal(true)
      setPhase('result')
    } catch {
      setPhase('idle')
      setMsg('Não consegui acessar o microfone.')
    }
  }

  const stop = () => handle.current?.stop?.()

  const prons = item.pron.split(/\s+/)
  const words = displayWords(item.text)
  const failed = result && result.score < PASS
  const wrongWords = result ? result.words.map((r, i) => ({ ...r, w: words[i], p: prons[i] })).filter((r) => !r.ok) : []
  const tips = tipsFor(lang, wrongWords)

  const kind = { repeat: 'Leia em voz alta', listen: 'Ouça e repita', translate: `Fale em ${LANGS[lang].name.toLowerCase()}` }[ex.type]

  return (
    <div className="ex">
      <p className="ex-kind">{kind}</p>

      <div className="prompt column">
        {ex.type === 'translate' && <h2 className="prompt-text">{item.pt}</h2>}
        {ex.type === 'listen' && !reveal && (
          <div className="dictation">
            <button type="button" className="big-play" onClick={() => speak(item.text, tag)} aria-label="Ouvir"><Icon name="speaker" size={32} /></button>
            <button type="button" className="icon-btn" onClick={() => speak(item.text, tag, { rate: 0.55 })} aria-label="Ouvir devagar" title="Ouvir devagar"><Icon name="slow" /></button>
          </div>
        )}
        {reveal ? (
          <>
            <PronLine item={item} lang={lang} status={result?.words} big />
            <div className="row-center">
              <button type="button" className="chip" onClick={() => speak(item.text, tag)}><Icon name="speaker" size={16} /> Ouvir</button>
              <button type="button" className="chip" onClick={() => speak(item.text, tag, { rate: 0.55 })}><Icon name="slow" size={16} /> Devagar</button>
            </div>
            {ex.type !== 'translate' && <p className="sub">“{item.pt}”</p>}
          </>
        ) : (
          <button type="button" className="chip" onClick={() => setReveal(true)}><Icon name="bulb" size={16} /> Mostrar como se fala</button>
        )}
      </div>

      {failed && (
        <div className="correction">
          <p className="correction-title">
            Você disse: <em lang={lang}>“{result.said}”</em>
          </p>
          {wrongWords.length > 0 && (
            <ul className="fix-list">
              {wrongWords.map((r, i) => (
                <li key={i}>
                  <button type="button" className="fix" onClick={() => speak(r.w.replace(/[¿¡?!.,]/g, ''), tag, { rate: 0.6 })}>
                    <span className="fix-word" lang={lang}>{r.w.replace(/[¿¡?!.,]/g, '')}</span>
                    <span className="fix-arrow">fala assim</span>
                    <span className="fix-pron"><Stress text={r.p} /></span>
                    <Icon name="speaker" size={16} />
                  </button>
                  {r.heard && <span className="heard">você falou “{r.heard}”</span>}
                </li>
              ))}
            </ul>
          )}
          {tips.length > 0 && (
            <ul className="tips">
              {tips.map(([label, text]) => <li key={label}><b>{label}</b> {text}</li>)}
            </ul>
          )}
          <p className="hint">A sílaba em <b>negrito</b> é a mais forte. Clique numa palavra pra ouvir ela sozinha.</p>
        </div>
      )}

      {fallback && audioUrl && !locked && (
        <div className="compare">
          <div className="compare-row">
            <span>Sua voz</span>
            <audio src={audioUrl} controls />
          </div>
          <div className="compare-row">
            <span>Nativo</span>
            <button type="button" className="chip" onClick={() => speak(item.text, tag)}><Icon name="speaker" size={16} /> Ouvir</button>
          </div>
          <p className="hint">Compare as duas. Ficou parecido?</p>
          <div className="ex-actions">
            <button type="button" className="ghost" onClick={() => onAnswer(false)}>Preciso treinar</button>
            <button type="button" className="primary" onClick={() => onAnswer(true)}>Ficou parecido</button>
          </div>
        </div>
      )}

      {msg && <p className="msg" role="status">{msg}</p>}

      {!locked && (
        <div className="mic-area">
          {phase === 'listening' ? (
            <button type="button" className="mic listening" onClick={stop} aria-label="Parar">
              <Icon name="stop" size={30} />
            </button>
          ) : (
            <button type="button" className="mic" onClick={start} aria-label={failed ? 'Tentar de novo' : 'Falar'}>
              <Icon name="mic" size={30} />
            </button>
          )}
          <span className="mic-label">
            {phase === 'listening' ? (fallback ? 'Gravando… toque pra parar' : 'Ouvindo…') : failed ? 'Tentar de novo' : fallback && audioUrl ? 'Gravar de novo' : 'Toque e fale'}
          </span>
          <div className="ex-actions">
            <button type="button" className="ghost" onClick={onSkip}>Não posso falar agora</button>
            {failed && <button type="button" className="ghost" onClick={() => onAnswer(false)}>Continuar</button>}
          </div>
          {fallback && !canRecognize() && attempts === 0 && !audioUrl && (
            <p className="hint">Seu navegador não reconhece voz (Firefox não tem). Aqui você grava e compara com a voz nativa. No Chrome a correção é automática.</p>
          )}
        </div>
      )}
    </div>
  )
}
