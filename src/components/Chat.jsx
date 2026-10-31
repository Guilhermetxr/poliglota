import { useEffect, useMemo, useRef, useState } from 'react'
import { LANGS } from '../data/content.js'
import { MODES } from '../lib/exercises.js'
import { maxLevel } from '../lib/levels.js'
import { ChatError, MAX_CHARS, clearHistory, loadHistory, saveHistory, sendChat } from '../lib/chat.js'
import { autoSpeak, canRecognize, listen } from '../lib/speech.js'
import { subscribe } from '../lib/sync.js'
import { displayWords } from '../lib/text.js'
import { Icon, PronLine, SpeakButtons, Stress } from './ui.jsx'

const SCENARIOS = [
  ['livre', 'Conversa livre'], ['restaurante', 'Restaurante'], ['aeroporto', 'Aeroporto'], ['hotel', 'Hotel'],
  ['trabalho', 'Entrevista de emprego'], ['medico', 'Consulta médica'], ['apresentacao', 'Conhecendo alguém'],
]

const STARTERS = {
  general: ['Qual a diferença entre ser e estar?', 'Como peço um café em italiano?', 'Corrija: I am agree with you', 'Quando usar "tu" ou "vous" em francês?'],
  en: ['Hi! Can we practice together?', "Hello, my name is Ana. What's your name?"],
  fr: ["Salut ! On peut pratiquer ensemble ?", "Bonjour, je m'appelle Ana. Et toi ?"],
  es: ['¡Hola! ¿Podemos practicar juntos?', 'Hola, me llamo Ana. ¿Y tú?'],
  it: ['Ciao! Possiamo fare pratica insieme?', 'Ciao, mi chiamo Ana. E tu?'],
}

export function Chat({ chat, onExit }) {
  const isGeneral = chat === 'general'
  const L = LANGS[chat]
  const [sync, setSync] = useState({ enabled: false, ready: false, user: null })
  const [mode, setMode] = useState(isGeneral ? 'duvidas' : 'conversa')
  const [scenario, setScenario] = useState('livre')
  const [messages, setMessages] = useState(() => loadHistory(chat))
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [usage, setUsage] = useState(null)
  const [listening, setListening] = useState(false)
  const endRef = useRef(null)
  const rec = useRef(null)

  useEffect(() => subscribe(setSync), [])
  useEffect(() => { saveHistory(chat, messages) }, [chat, messages])
  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }) }, [messages, busy, error])
  useEffect(() => () => rec.current?.stop?.(), [])

  // o nível do tutor acompanha o seu progresso (o mais alto liberado em qualquer modo)
  const level = useMemo(() => (isGeneral ? 1 : Math.max(...Object.keys(MODES).map((m) => maxLevel(chat, m)))), [chat, isGeneral])
  const title = isGeneral ? 'Tutor geral' : `Tutor de ${L.name}`

  const ask = async (history) => {
    setMessages(history) // a mensagem da pessoa já aparece, e continua lá se o envio falhar
    setBusy(true)
    setError(null)
    try {
      const data = await sendChat({ chat, mode, scenario, level, messages: history })
      const { reply, reply_pt, pron, correction } = data
      setMessages([...history, { role: 'assistant', content: reply, extra: { reply_pt, pron, correction } }])
      setUsage(data.usage)
      if (!isGeneral) autoSpeak(reply, L.speech)
    } catch (e) {
      if (e instanceof ChatError) {
        if (e.code === 'limite_diario') setUsage({ used: e.used ?? e.limit, limit: e.limit })
        setError(e)
      } else setError(new ChatError('erro', 'Algo deu errado. Tente de novo.'))
    } finally { setBusy(false) }
  }

  const send = (text = input) => {
    const t = text.trim()
    if (!t || busy) return
    setInput('')
    ask([...messages, { role: 'user', content: t.slice(0, MAX_CHARS) }])
  }

  const retry = () => ask(messages) // a última mensagem da pessoa já está no histórico

  const mic = async () => {
    if (listening) return rec.current?.stop?.()
    try {
      setListening(true)
      rec.current = listen(isGeneral ? 'pt-BR' : L.speech)
      const alts = await rec.current.promise
      if (alts[0]) setInput((v) => (v ? `${v} ${alts[0]}` : alts[0]).slice(0, MAX_CHARS))
    } catch { /* sem permissão ou sem fala: segue sem preencher */ } finally { setListening(false) }
  }

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const ready = sync.enabled && sync.user && sync.user.verified
  const starters = STARTERS[chat]

  return (
    <div className={`chat ${isGeneral ? '' : `chat-${chat}`}`} data-lang={chat}>
      <header className="chat-top">
        <button className="icon-btn" onClick={onExit} aria-label="Voltar"><Icon name="back" /></button>
        <div className="chat-title">
          <h1>{title}</h1>
          {usage && <small>{usage.used}/{usage.limit} mensagens hoje</small>}
        </div>
        {messages.length > 0 && (
          <button className="link" onClick={() => { if (confirm('Limpar esta conversa?')) { clearHistory(chat); setMessages([]); setError(null) } }}>Limpar</button>
        )}
      </header>

      {!isGeneral && (
        <div className="chat-controls">
          <div className="seg" role="tablist" aria-label="Modo do chat">
            {[['conversa', 'Conversar'], ['corrigir', 'Corrigir meu texto']].map(([id, label]) => (
              <button key={id} role="tab" aria-selected={mode === id} className={mode === id ? 'on' : ''} onClick={() => setMode(id)}>{label}</button>
            ))}
          </div>
          {mode === 'conversa' && (
            <div className="field inline">
              <label htmlFor="chat-scenario">Cenário</label>
              <select id="chat-scenario" value={scenario} onChange={(e) => setScenario(e.target.value)}>
                {SCENARIOS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
              </select>
            </div>
          )}
        </div>
      )}

      <main className="chat-body" aria-live="polite">
        {!ready && <Gate sync={sync} />}

        {ready && messages.length === 0 && (
          <div className="chat-empty">
            <p className="lead">
              {isGeneral
                ? 'Tire dúvidas sobre inglês, francês, espanhol e italiano. Eu respondo em português.'
                : mode === 'corrigir'
                  ? `Escreva um texto em ${L.name.toLowerCase()} e eu corrijo, explicando o erro em português.`
                  : `Vamos conversar em ${L.name.toLowerCase()}. Comece com uma destas ou escreva a sua.`}
            </p>
            <div className="starters">
              {starters.map((s) => <button key={s} className="chip" onClick={() => send(s)}>{s}</button>)}
            </div>
          </div>
        )}

        {messages.map((m, i) => (m.role === 'user'
          ? <div key={i} className="bubble user" lang={isGeneral ? undefined : chat}>{m.content}</div>
          : <Reply key={i} m={m} chat={chat} isGeneral={isGeneral} />))}

        {busy && <div className="bubble bot typing" role="status" aria-label="O tutor está escrevendo"><span /><span /><span /></div>}

        {error && (
          <div className="chat-error" role="alert">
            <p>{error.message}</p>
            <div className="chat-error-actions">
              {error.code === 'sem_login' && <button className="ghost small" onClick={() => window.dispatchEvent(new Event('open-login'))}>Entrar</button>}
              {['rede', 'ia_falhou', 'resposta_invalida', 'ocupado', 'indisponivel', 'erro'].includes(error.code) && <button className="ghost small" onClick={retry}>Tentar de novo</button>}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </main>

      {ready && (
        <form className="chat-input" onSubmit={(e) => { e.preventDefault(); send() }}>
          <label htmlFor="chat-text" className="sr-only">Sua mensagem</label>
          <textarea id="chat-text" rows={2} value={input} maxLength={MAX_CHARS} lang={isGeneral ? 'pt-BR' : chat}
            placeholder={isGeneral ? 'Pergunte alguma coisa…' : mode === 'corrigir' ? `Escreva em ${L.name.toLowerCase()}…` : `Responda em ${L.name.toLowerCase()}…`}
            onChange={(e) => setInput(e.target.value)} onKeyDown={onKey} disabled={busy} />
          <div className="chat-input-actions">
            {canRecognize() && (
              <button type="button" className={`icon-btn mic-sm ${listening ? 'on' : ''}`} onClick={mic} aria-pressed={listening}
                aria-label={listening ? 'Parar de ouvir' : 'Falar em vez de digitar'}><Icon name={listening ? 'stop' : 'mic'} /></button>
            )}
            <span className="count" aria-hidden="true">{input.length}/{MAX_CHARS}</span>
            <button className="primary" disabled={busy || !input.trim()}>Enviar</button>
          </div>
        </form>
      )}
    </div>
  )
}

function Gate({ sync }) {
  if (!sync.ready && sync.enabled) return <p className="hint">Carregando…</p>
  if (!sync.enabled) return <div className="gate"><h2>Chat indisponível</h2><p>O login ainda não foi configurado neste site, e o chat precisa dele.</p></div>
  if (!sync.user) {
    return (
      <div className="gate">
        <h2>Entre pra conversar</h2>
        <p>O tutor usa inteligência artificial, então fica liberado só pra quem tem conta. Leva um minuto.</p>
        <button className="primary" onClick={() => window.dispatchEvent(new Event('open-login'))}>Entrar ou criar conta</button>
      </div>
    )
  }
  return (
    <div className="gate">
      <h2>Confirme seu e-mail</h2>
      <p>Enviamos um link pra {sync.user.email}. Depois de clicar, abra o menu da sua conta (círculo no topo) e toque em <b>Já confirmei</b>.</p>
    </div>
  )
}

function Reply({ m, chat, isGeneral }) {
  const { reply_pt, pron, correction } = m.extra || {}
  const [showPt, setShowPt] = useState(false)
  const aligned = (text, p) => !!p && displayWords(text).length === p.trim().split(/\s+/).length

  return (
    <div className="bubble bot">
      {isGeneral ? (
        <p className="plain">{m.content}</p>
      ) : (
        <>
          <p className="reply-text" lang={chat}>{m.content}</p>
          <SpeakButtons text={m.content} lang={chat} size="sm" />
          {pron && (aligned(m.content, pron)
            ? <PronLine item={{ text: m.content, pron }} lang={chat} />
            : <p className="pron-raw"><Stress text={pron} /></p>)}
          {reply_pt && (
            <button className="link inline" onClick={() => setShowPt(!showPt)} aria-expanded={showPt}>{showPt ? 'Ocultar tradução' : 'Ver em português'}</button>
          )}
          {showPt && <p className="translation">{reply_pt}</p>}
        </>
      )}

      {correction && correction.corrected && (
        <div className="correction-card">
          <p className="cc-label">Correção</p>
          <p className="cc-original" lang={isGeneral ? undefined : chat}><s>{correction.original}</s></p>
          <p className="cc-corrected" lang={isGeneral ? undefined : chat}>{correction.corrected}</p>
          {!isGeneral && <SpeakButtons text={correction.corrected} lang={chat} size="sm" />}
          {correction.pron && !isGeneral && (aligned(correction.corrected, correction.pron)
            ? <PronLine item={{ text: correction.corrected, pron: correction.pron }} lang={chat} />
            : <p className="pron-raw"><Stress text={correction.pron} /></p>)}
          {correction.pron && isGeneral && <p className="pron-raw"><Stress text={correction.pron} /></p>}
          <p className="cc-why">{correction.explanation}</p>
        </div>
      )}
    </div>
  )
}
