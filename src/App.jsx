import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { CATEGORIES, ITEMS, LANGS, LEVELS, itemsFor } from './data/content.js'
import { clearLocal, getProfile, onChange, stats } from './lib/srs.js'
import { levelProgress, maxLevel, unlockNow } from './lib/levels.js'
import { flush, initSync } from './lib/sync.js'
import { MODES } from './lib/exercises.js'
import { Session } from './components/Session.jsx'
import { Chat } from './components/Chat.jsx'
import { Account } from './components/Account.jsx'
import { Icon, ProgressBar } from './components/ui.jsx'

function load(key, fallback) {
  try { return localStorage.getItem(key) || fallback } catch { return fallback }
}
function store(key, v) {
  try { localStorage.setItem(key, v) } catch { /* nada */ }
}

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Troca de tela com transição nativa (quando o navegador suporta): a saudação do idioma
// "viaja" do cartão da tela inicial até o painel do idioma, e volta.
function withTransition(update) {
  if (!document.startViewTransition || reduceMotion()) return update()
  document.startViewTransition(() => flushSync(update))
}

export default function App() {
  const [lang, setLang] = useState(() => load('idiomas:lang', null))
  const [mode, setMode] = useState(() => load('idiomas:mode', 'leitura'))
  const [session, setSession] = useState(null) // categoria em estudo
  const [chat, setChat] = useState(null) // 'general' ou o id de um idioma
  const [, refresh] = useState(0)

  // login (se o Firebase estiver configurado) + atualiza a tela quando o progresso muda,
  // por exemplo quando chega o que estava salvo na nuvem
  useEffect(() => {
    initSync()
    return onChange(() => refresh((x) => x + 1))
  }, [])

  const [vtLang, setVtLang] = useState(null) // idioma de onde viemos (a saudação dele volta pro cartão)
  useEffect(() => {
    if (!vtLang) return
    const t = setTimeout(() => setVtLang(null), 900)
    return () => clearTimeout(t)
  }, [vtLang])

  const pickLang = (l, el) => {
    document.querySelectorAll('.lang-hello').forEach((e) => { e.style.viewTransitionName = '' })
    if (el) el.style.viewTransitionName = 'lang-hello'
    withTransition(() => { setLang(l); store('idiomas:lang', l) })
  }
  const backHome = () => withTransition(() => { setVtLang(lang); setLang(null) })
  const chooseMode = (m) => { setMode(m); store('idiomas:mode', m) }

  return (
    <div className="app" data-lang={lang || 'none'}>
      {chat ? (
        <Chat key={chat} chat={chat} onExit={() => setChat(null)} />
      ) : session ? (
        <Session lang={lang} mode={mode} cat={session} onExit={() => { setSession(null); refresh((x) => x + 1) }} />
      ) : lang ? (
        <LangHub lang={lang} mode={mode} setMode={chooseMode} onBack={backHome} onStart={setSession} onChat={setChat} />
      ) : (
        <Home onPick={pickLang} onChat={setChat} vtLang={vtLang} />
      )}
    </div>
  )
}

function TopBar({ children }) {
  const p = getProfile()
  return (
    <header className="topbar">
      <div className="topbar-left">{children}</div>
      <div className="topbar-stats">
        <span className="stat" title="Dias seguidos estudando"><Icon name="flame" size={18} /> {p.streak}</span>
        <span className="stat" title="Meta diária">
          <span className="goal"><span style={{ transform: `scaleX(${Math.min(1, p.todayXp / p.goal)})` }} /></span>
          {p.todayXp}/{p.goal} XP
        </span>
        <Account />
      </div>
    </header>
  )
}

// Saudação gigante que troca de idioma, e leva a cor da página junto
function GreetingCycle({ onColor }) {
  const order = Object.values(LANGS)
  const [i, setI] = useState(0)
  const [prev, setPrev] = useState(null)

  useEffect(() => {
    if (reduceMotion()) return
    const id = setInterval(() => {
      if (document.hidden) return
      setI((cur) => { setPrev(cur); return (cur + 1) % order.length })
    }, 2800)
    return () => clearInterval(id)
  }, [])
  useEffect(() => { onColor(order[i].id) }, [i])
  useEffect(() => {
    if (prev === null) return
    const t = setTimeout(() => setPrev(null), 500)
    return () => clearTimeout(t)
  }, [prev])

  const cur = order[i]
  return (
    <span className="hero-cycle" aria-hidden="true">
      {prev !== null && <span key={`o${prev}`} className="hero-word out" lang={order[prev].id} data-lang={order[prev].id}>{order[prev].hello}</span>}
      <span key={`i${i}`} className="hero-word in" lang={cur.id} data-lang={cur.id}>{cur.hello}</span>
    </span>
  )
}

function Home({ onPick, onChat, vtLang }) {
  const p = getProfile()
  const [heroLang, setHeroLang] = useState('en')
  return (
    <div className="page home">
      <TopBar><span className="logo">poliglota</span></TopBar>

      <section className="hero" style={{ '--hc': `var(--${heroLang}-solid)` }}>
        <div className="hero-field" aria-hidden="true" />
        <GreetingCycle onColor={setHeroLang} />
        <h1 className="hero-ask">Qual idioma hoje?</h1>
        <p className="hero-sub">Leitura, escrita e fala separadas. O que você erra volta mais vezes, o que você acerta volta mais tarde.</p>
      </section>

      <div className="lang-grid">
        {Object.values(LANGS).map((l, idx) => {
          const prog = Object.keys(MODES).reduce((s, m) => s + stats(l.id, m, itemsFor(l.id, 'geral', maxLevel(l.id, m))).progress, 0) / 3
          return (
            <button key={l.id} className="lang-card" data-lang={l.id} style={{ '--i': idx }}
              onClick={(e) => onPick(l.id, e.currentTarget.querySelector('.lang-hello'))}>
              <span className="lang-hello" lang={l.id} style={vtLang === l.id ? { viewTransitionName: 'lang-hello' } : undefined}>{l.hello}</span>
              <span className="lang-name">{l.name}</span>
              <span className="lang-native" lang={l.id}>{l.native}</span>
              <span className="lang-foot">
                <ProgressBar value={prog} label={`Progresso em ${l.name}`} />
                <span className="lang-pct">{Math.round(prog * 100)}% dominado</span>
              </span>
            </button>
          )
        })}
      </div>

      <button className="tutor-card reveal" style={{ '--i': 5 }} onClick={() => onChat('general')}>
        <span className="tutor-ico"><Icon name="chat" size={22} /></span>
        <span className="tutor-text">
          <b>Tutor geral</b>
          <small>Tire dúvidas sobre qualquer um dos idiomas, em português</small>
        </span>
        <Icon name="arrow" size={20} className="tutor-go" />
      </button>

      <footer className="foot">
        <span>{p.xp} XP no total</span>
        <button className="link" onClick={async () => {
          if (confirm('Apagar todo o progresso de todos os idiomas? Se você estiver logado, apaga da conta também. Isso não tem volta.')) { clearLocal(); await flush() }
        }}>Apagar progresso</button>
      </footer>
    </div>
  )
}

function LangHub({ lang, mode, setMode, onBack, onStart, onChat }) {
  const L = LANGS[lang]
  const ml = maxLevel(lang, mode)
  const all = itemsFor(lang, 'geral', ml)
  const s = stats(lang, mode, all)
  const modeIdx = Object.keys(MODES).indexOf(mode)
  return (
    <div className="page hub">
      <TopBar>
        <button className="icon-btn" onClick={onBack} aria-label="Trocar idioma"><Icon name="back" /></button>
        <span className="logo">poliglota</span>
      </TopBar>

      <section className="hub-hero">
        <div className="hub-hero-text">
          <span className="hub-hello" lang={lang}>{L.hello}</span>
          <h1>{L.name}</h1>
          <p>{s.seen} de {s.total} frases vistas &middot; {s.mastered} dominadas</p>
        </div>
        <div className="hub-hero-actions">
          <button className="cta" onClick={() => onStart('geral')}>
            <Icon name="shuffle" size={20} /> Praticar agora
          </button>
          <button className="cta alt" onClick={() => onStart('revisao')} disabled={s.due === 0 && s.seen === 0}>
            <Icon name="repeat" size={20} /> Revisar {s.due > 0 && <em className="due-inline">{s.due}</em>}
          </button>
        </div>
        <i className="blob b1" aria-hidden="true" /><i className="blob b2" aria-hidden="true" />
      </section>

      <nav className="modes" role="tablist" aria-label="Modo de estudo" style={{ '--i': modeIdx }}>
        <span className="modes-pill" aria-hidden="true" />
        {Object.values(MODES).map((m) => {
          const ms = stats(lang, m.id, all)
          return (
            <button key={m.id} role="tab" aria-selected={mode === m.id} className={`mode-tab ${mode === m.id ? 'on' : ''}`} onClick={() => setMode(m.id)}>
              <Icon name={m.icon} size={22} />
              <span className="mode-name">{m.name}</span>
              <span className="mode-desc">{m.desc}</span>
              {ms.due > 0 && <span className="due-dot" title="Para revisar">{ms.due}</span>}
            </button>
          )
        })}
      </nav>
      <p className="mode-hint reveal" style={{ '--i': 0 }}>
        {mode === 'leitura' ? 'Entenda o que está escrito.' : mode === 'escrita' ? 'Monte e digite as frases.' : 'Pronuncie e receba correção palavra por palavra.'}
        {' '}Cada modo tem o seu próprio progresso.
      </p>

      <button className="tutor-card in-hub reveal" style={{ '--i': 1 }} onClick={() => onChat(lang)}>
        <span className="tutor-ico"><Icon name="chat" size={22} /></span>
        <span className="tutor-text">
          <b>Conversar com o tutor de {L.name.toLowerCase()}</b>
          <small>Converse, tire dúvidas e receba correções com explicação</small>
        </span>
        <Icon name="arrow" size={20} className="tutor-go" />
      </button>

      <LevelStrip lang={lang} mode={mode} ml={ml} />

      <h2 className="section-title">Categorias</h2>
      <div className="cat-grid">
        {CATEGORIES.map((c, idx) => {
          const items = itemsFor(lang, c.id, ml)
          const cs = stats(lang, mode, items)
          if (items.length === 0) {
            const need = Math.min(...ITEMS[lang].filter((i) => i.cat === c.id).map((i) => i.level))
            return (
              <button key={c.id} className="cat-card locked" disabled style={{ '--i': idx }} aria-label={`${c.name}, libera no nível ${need}`}>
                <span className="cat-icon" aria-hidden="true"><Icon name="lock" size={20} /></span>
                <span className="cat-body">
                  <b>{c.name}</b>
                  <small className="cat-count">Libera no nível {need} &middot; {LEVELS[need - 1].name}</small>
                </span>
              </button>
            )
          }
          return (
            <button key={c.id} className="cat-card" style={{ '--i': idx }} onClick={() => onStart(c.id)}>
              <span className="cat-icon" aria-hidden="true"><Icon name={c.icon} size={22} /></span>
              <span className="cat-body">
                <b>{c.name}</b>
                <small>{c.desc}</small>
                <small className="cat-count">
                  {cs.mastered}/{cs.total} dominados{cs.due > 0 && <> &middot; <em>{cs.due} pra revisar</em></>}
                </small>
              </span>
              <ProgressBar value={cs.progress} label={`Progresso em ${c.name}`} />
            </button>
          )
        })}
      </div>

      {mode === 'fala' && (
        <section className="tips-box">
          <h3>Como ler a pronúncia</h3>
          <p>Embaixo de cada palavra tem como ela soa escrita do jeito do português. A sílaba em <b>negrito</b> é a mais forte.</p>
          <ul className="tips">
            {L.tips.map(([label, text]) => <li key={label}><b>{label}</b> {text}</li>)}
          </ul>
        </section>
      )}
    </div>
  )
}

function LevelStrip({ lang, mode, ml }) {
  return (
    <section className="levels" aria-label="Níveis">
      <h2 className="section-title">Níveis</h2>
      <ol className="level-list">
        {LEVELS.map((lv) => {
          const open = lv.id <= ml
          const p = levelProgress(lang, mode, lv.id)
          const prev = lv.id > 1 ? levelProgress(lang, mode, lv.id - 1) : null
          return (
            <li key={lv.id} className={`level ${open ? 'open' : 'closed'}`}>
              <span className="level-num" aria-hidden="true">{open ? lv.id : <Icon name="lock" size={18} />}</span>
              <div className="level-body">
                <b>{lv.name}</b>
                <small>{lv.desc}</small>
                {open ? (
                  <>
                    <ProgressBar value={p.ratio} label={`Progresso do nível ${lv.id}`} />
                    <small className="cat-count">{p.learned}/{p.total} aprendidos</small>
                  </>
                ) : (
                  <small className="cat-count">
                    Aprenda {prev.need} de {prev.total} frases do nível {lv.id - 1} em {MODES[mode].name.toLowerCase()} ({prev.learned} até agora)
                  </small>
                )}
              </div>
              {!open && lv.id === ml + 1 && (
                <button className="ghost small" onClick={() => unlockNow(lang, mode, lv.id)}>Já sei, liberar</button>
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
