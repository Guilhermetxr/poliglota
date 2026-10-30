import { useEffect, useState } from 'react'
import { CATEGORIES, ITEMS, LANGS, LEVELS, itemsFor } from './data/content.js'
import { clearLocal, getProfile, onChange, stats } from './lib/srs.js'
import { levelProgress, maxLevel, unlockNow } from './lib/levels.js'
import { flush, initSync } from './lib/sync.js'
import { MODES } from './lib/exercises.js'
import { Session } from './components/Session.jsx'
import { Account } from './components/Account.jsx'
import { Icon, ProgressBar } from './components/ui.jsx'

function load(key, fallback) {
  try { return localStorage.getItem(key) || fallback } catch { return fallback }
}
function store(key, v) {
  try { localStorage.setItem(key, v) } catch { /* nada */ }
}

export default function App() {
  const [lang, setLang] = useState(() => load('idiomas:lang', null))
  const [mode, setMode] = useState(() => load('idiomas:mode', 'leitura'))
  const [session, setSession] = useState(null) // categoria em estudo
  const [, refresh] = useState(0)

  // login (se o Firebase estiver configurado) + atualiza a tela quando o progresso muda,
  // por exemplo quando chega o que estava salvo na nuvem
  useEffect(() => {
    initSync()
    return onChange(() => refresh((x) => x + 1))
  }, [])

  const chooseLang = (l) => { setLang(l); if (l) store('idiomas:lang', l) }
  const chooseMode = (m) => { setMode(m); store('idiomas:mode', m) }

  return (
    <div className="app" data-lang={lang || 'none'}>
      {session ? (
        <Session lang={lang} mode={mode} cat={session} onExit={() => { setSession(null); refresh((x) => x + 1) }} />
      ) : lang ? (
        <LangHub lang={lang} mode={mode} setMode={chooseMode} onBack={() => chooseLang(null)} onStart={setSession} />
      ) : (
        <Home onPick={chooseLang} />
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

function Home({ onPick }) {
  const p = getProfile()
  return (
    <div className="page">
      <TopBar><span className="logo">poliglota</span></TopBar>
      <section className="hero">
        <h1>Qual idioma hoje?</h1>
        <p>Leitura, escrita e fala separadas. O que você erra volta mais vezes, o que você acerta volta mais tarde.</p>
      </section>
      <div className="lang-grid">
        {Object.values(LANGS).map((l) => {
          const prog = Object.keys(MODES).reduce((s, m) => s + stats(l.id, m, itemsFor(l.id, 'geral', maxLevel(l.id, m))).progress, 0) / 3
          return (
            <button key={l.id} className="lang-card" data-lang={l.id} onClick={() => onPick(l.id)}>
              <span className="lang-code">{l.code}</span>
              <span className="lang-name">{l.name}</span>
              <span className="lang-native" lang={l.id}>{l.native}</span>
              <ProgressBar value={prog} label={`Progresso em ${l.name}`} />
              <span className="lang-pct">{Math.round(prog * 100)}% dominado</span>
            </button>
          )
        })}
      </div>
      <footer className="foot">
        <span>{p.xp} XP no total</span>
        <button className="link" onClick={async () => {
          if (confirm('Apagar todo o progresso de todos os idiomas? Se você estiver logado, apaga da conta também. Isso não tem volta.')) { clearLocal(); await flush() }
        }}>Apagar progresso</button>
      </footer>
    </div>
  )
}

function LangHub({ lang, mode, setMode, onBack, onStart }) {
  const L = LANGS[lang]
  const ml = maxLevel(lang, mode)
  const all = itemsFor(lang, 'geral', ml)
  const s = stats(lang, mode, all)
  return (
    <div className="page">
      <TopBar>
        <button className="icon-btn" onClick={onBack} aria-label="Trocar idioma"><Icon name="back" /></button>
        <span className="hub-title"><span className="lang-code sm">{L.code}</span> {L.name}</span>
      </TopBar>

      <nav className="modes" role="tablist" aria-label="Modo de estudo">
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

      <div className="quick">
        <button className="quick-card primary-card" onClick={() => onStart('geral')}>
          <Icon name="shuffle" size={22} />
          <span>
            <b>Perguntas gerais</b>
            <small>Mistura de todas as categorias em {MODES[mode].name.toLowerCase()}</small>
          </span>
        </button>
        <button className="quick-card" onClick={() => onStart('revisao')} disabled={s.due === 0 && s.seen === 0}>
          <Icon name="repeat" size={22} />
          <span>
            <b>Revisar {s.due > 0 && <em className="due-inline">{s.due}</em>}</b>
            <small>{s.due > 0 ? 'O que está na hora de rever e o que você mais erra' : s.seen ? 'Nada vencido, treina seus erros' : 'Estude algo primeiro'}</small>
          </span>
        </button>
      </div>

      <LevelStrip lang={lang} mode={mode} ml={ml} />

      <h2 className="section-title">Categorias</h2>
      <div className="cat-grid">
        {CATEGORIES.map((c) => {
          const items = itemsFor(lang, c.id, ml)
          const cs = stats(lang, mode, items)
          if (items.length === 0) {
            const need = Math.min(...ITEMS[lang].filter((i) => i.cat === c.id).map((i) => i.level))
            return (
              <button key={c.id} className="cat-card locked" disabled aria-label={`${c.name}, libera no nível ${need}`}>
                <span className="cat-icon" aria-hidden="true">{c.icon}</span>
                <span className="cat-body">
                  <b>{c.name}</b>
                  <small>{c.desc}</small>
                  <small className="cat-count">Libera no nível {need} · {LEVELS[need - 1].name}</small>
                </span>
              </button>
            )
          }
          return (
            <button key={c.id} className="cat-card" onClick={() => onStart(c.id)}>
              <span className="cat-icon" aria-hidden="true">{c.icon}</span>
              <span className="cat-body">
                <b>{c.name}</b>
                <small>{c.desc}</small>
                <ProgressBar value={cs.progress} label={`Progresso em ${c.name}`} />
                <small className="cat-count">
                  {cs.mastered}/{cs.total} dominados{cs.due > 0 && <> · <em>{cs.due} pra revisar</em></>}
                </small>
              </span>
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
              <span className="level-num" aria-hidden="true">{open ? lv.id : '🔒'}</span>
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
