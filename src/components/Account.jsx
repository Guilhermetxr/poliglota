import { useEffect, useRef, useState } from 'react'
import { authMessage, logout, resetPassword, signInEmail, signInGoogle, signUpEmail, subscribe } from '../lib/sync.js'

const STATUS = {
  idle: '',
  syncing: 'Sincronizando…',
  ok: 'Progresso salvo na nuvem',
  error: 'Não consegui salvar na nuvem. Vou tentar de novo.',
}

export function Account() {
  const [s, setS] = useState({ enabled: false, ready: true, user: null, status: 'idle' })
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState(false)
  useEffect(() => subscribe(setS), [])

  // Em produção sem Firebase configurado o botão some. No dev aparece pra mostrar como configurar.
  if (!s.enabled && !import.meta.env.DEV) return null
  if (!s.ready) return <span className="account-skel" aria-hidden="true" />

  if (s.user) {
    const initial = (s.user.name || s.user.email || '?')[0].toUpperCase()
    return (
      <div className="account">
        <button className="avatar" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-label="Minha conta">
          {s.user.photo ? <img src={s.user.photo} alt="" referrerPolicy="no-referrer" /> : initial}
          <span className={`sync-dot ${s.status}`} aria-hidden="true" />
        </button>
        {menu && <AccountMenu s={s} onClose={() => setMenu(false)} />}
      </div>
    )
  }

  return (
    <>
      <button className="chip" onClick={() => setOpen(true)}>Entrar</button>
      {open && <LoginDialog enabled={s.enabled} onClose={() => setOpen(false)} />}
    </>
  )
}

function AccountMenu({ s, onClose }) {
  const [err, setErr] = useState(null)
  const [busy, setBusy] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const h = (e) => { if (!ref.current?.contains(e.target) && !e.target.closest('.avatar')) onClose() }
    const k = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('mousedown', h)
    document.addEventListener('keydown', k)
    return () => { document.removeEventListener('mousedown', h); document.removeEventListener('keydown', k) }
  }, [])

  const out = async () => {
    setBusy(true)
    setErr(null)
    try { await logout(); onClose() } catch {
      setErr('Ainda não terminei de salvar seu progresso. Espere um instante e tente sair de novo.')
    } finally { setBusy(false) }
  }

  return (
    <div className="menu" ref={ref} role="menu">
      <p className="menu-name">{s.user.name || 'Minha conta'}</p>
      <p className="menu-mail">{s.user.email}</p>
      <p className={`menu-sync ${s.status}`} role="status">{STATUS[s.status]}</p>
      {err && <p className="form-error" role="alert">{err}</p>}
      <button className="ghost" onClick={out} disabled={busy}>{busy ? 'Saindo…' : 'Sair da conta'}</button>
    </div>
  )
}

function LoginDialog({ enabled, onClose }) {
  const ref = useRef(null)
  const [mode, setMode] = useState('login') // login | signup | reset
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [touched, setTouched] = useState({})
  const [error, setError] = useState(null)
  const [info, setInfo] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const d = ref.current
    d?.showModal()
    const close = () => onClose()
    d?.addEventListener('close', close)
    return () => d?.removeEventListener('close', close)
  }, [])

  const emailBad = touched.email && !/^\S+@\S+\.\S+$/.test(email) ? 'Digite um e-mail completo, tipo nome@exemplo.com' : null
  const passBad = mode !== 'reset' && touched.password && password.length < 6 ? 'A senha precisa ter pelo menos 6 caracteres' : null

  const run = async (fn) => {
    setBusy(true)
    setError(null)
    setInfo(null)
    try { await fn() } catch (e) { setError(authMessage(e)) } finally { setBusy(false) }
  }

  const submit = (e) => {
    e.preventDefault()
    setTouched({ email: true, password: true })
    if (!/^\S+@\S+\.\S+$/.test(email)) return
    if (mode !== 'reset' && password.length < 6) return
    run(async () => {
      if (mode === 'login') await signInEmail(email.trim(), password)
      else if (mode === 'signup') await signUpEmail(email.trim(), password)
      else { await resetPassword(email.trim()); setInfo('Se esse e-mail tiver conta, o link de redefinição já está a caminho. Olhe também o spam.'); return }
      ref.current?.close()
    })
  }

  const google = () => run(async () => { await signInGoogle(); ref.current?.close() })
  const go = (m) => { setMode(m); setError(null); setInfo(null) }
  const title = { login: 'Entrar', signup: 'Criar conta', reset: 'Redefinir senha' }[mode]
  const action = { login: 'Entrar', signup: 'Criar conta', reset: 'Enviar link' }[mode]

  return (
    <dialog ref={ref} className="dialog" onClick={(e) => e.target === ref.current && ref.current.close()} aria-labelledby="login-title">
      <div className="dialog-body">
        <header className="dialog-head">
          <h2 id="login-title">{title}</h2>
          <button className="icon-btn" onClick={() => ref.current?.close()} aria-label="Fechar">✕</button>
        </header>

        {!enabled ? (
          <div className="setup">
            <p><b>O Firebase ainda não está configurado.</b> Preencha o arquivo <code>.env.local</code> com as chaves do seu projeto e reinicie o servidor. O passo a passo está no README.</p>
            <p className="hint">Esse aviso só aparece em desenvolvimento.</p>
          </div>
        ) : (
          <>
            {mode !== 'reset' && (
              <>
                <button type="button" className="google" onClick={google} disabled={busy}>
                  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"/><path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 0 1 0-9.4l-7.9-6.1a24 24 0 0 0 0 21.6l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg>
                  Continuar com Google
                </button>
                <p className="or"><span>ou com e-mail</span></p>
              </>
            )}

            <form onSubmit={submit} noValidate className="login-form">
              <div className="field">
                <label htmlFor="acc-email">E-mail</label>
                <input id="acc-email" type="email" autoComplete="email" inputMode="email" value={email}
                  onChange={(e) => setEmail(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  aria-invalid={!!emailBad} aria-describedby={emailBad ? 'acc-email-err' : undefined} placeholder="nome@exemplo.com" />
                {emailBad && <p id="acc-email-err" className="field-error">{emailBad}</p>}
              </div>
              {mode !== 'reset' && (
                <div className="field">
                  <label htmlFor="acc-pass">Senha</label>
                  <input id="acc-pass" type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} value={password}
                    onChange={(e) => setPassword(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                    aria-invalid={!!passBad} aria-describedby={passBad ? 'acc-pass-err' : undefined} />
                  {passBad && <p id="acc-pass-err" className="field-error">{passBad}</p>}
                </div>
              )}
              {error && <p className="form-error" role="alert">{error}</p>}
              {info && <p className="form-info" role="status">{info}</p>}
              <button className="primary" disabled={busy}>{busy ? 'Aguarde…' : action}</button>
            </form>

            <div className="dialog-links">
              {mode === 'login' && (
                <>
                  <button type="button" className="link" onClick={() => go('reset')}>Esqueci minha senha</button>
                  <button type="button" className="link" onClick={() => go('signup')}>Criar uma conta</button>
                </>
              )}
              {mode !== 'login' && <button type="button" className="link" onClick={() => go('login')}>Já tenho conta</button>}
            </div>
            <p className="hint dialog-note">Sua conta guarda seu progresso na nuvem, pra você continuar de onde parou em qualquer aparelho.</p>
          </>
        )}
      </div>
    </dialog>
  )
}
