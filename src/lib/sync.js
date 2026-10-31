// Login + espelho do progresso no Firestore.
//
// Fluxo: ao entrar, baixa o que está na nuvem, junta com o que tem neste navegador
// (nada se perde), e daí pra frente cada mudança é enviada com um pequeno atraso.
// Ao sair, envia o que faltar e limpa o progresso local, pra outra pessoa que usar o
// mesmo navegador não herdar os dados.
import { firebaseEnabled, getFirebase } from './firebase.js'
import { clearLocal, hasProgress, mergeRemote, onChange, snapshot } from './srs.js'

const DOC_VERSION = 1
const DEBOUNCE_MS = 2500

let state = { enabled: firebaseEnabled, ready: !firebaseEnabled, user: null, status: 'idle' } // status: idle | syncing | ok | error
const subs = new Set()
const set = (patch) => { state = { ...state, ...patch }; subs.forEach((f) => f(state)) }

export function subscribe(fn) {
  subs.add(fn)
  fn(state)
  return () => subs.delete(fn)
}

let fb = null
let timer = null
let stopWatching = null
let started = false

const ref = (uid) => fb.f.doc(fb.db, 'users', uid)

async function pull(uid) {
  const snap = await fb.f.getDoc(ref(uid))
  if (!snap.exists()) return
  try { mergeRemote(JSON.parse(snap.data().data)) } catch { /* documento corrompido: o envio seguinte sobrescreve */ }
}

async function push() {
  if (!fb || !state.user) return
  clearTimeout(timer)
  timer = null
  set({ status: 'syncing' })
  try {
    await fb.f.setDoc(ref(state.user.uid), {
      v: DOC_VERSION,
      data: JSON.stringify(snapshot()),
      updatedAt: fb.f.serverTimestamp(),
    })
    set({ status: 'ok' })
  } catch (e) {
    console.warn('[sync] falhou', e)
    set({ status: 'error' })
  }
}

function schedule() {
  if (!state.user) return
  clearTimeout(timer)
  timer = setTimeout(push, DEBOUNCE_MS)
}

async function onSignedIn(user) {
  set({ status: 'syncing' })
  try {
    await pull(user.uid)
    await push()
  } catch (e) {
    console.warn('[sync] falhou ao entrar', e)
    set({ status: 'error' })
  }
  stopWatching?.()
  stopWatching = onChange(schedule)
}

export async function initSync() {
  if (!firebaseEnabled || started) return
  started = true
  fb = await getFirebase()
  // não perde o que falta enviar se a aba for fechada
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && timer) push() })
  fb.a.onAuthStateChanged(fb.auth, async (u) => {
    const user = u ? { uid: u.uid, email: u.email, name: u.displayName, photo: u.photoURL, verified: u.emailVerified } : null
    set({ user, ready: true, status: user ? 'syncing' : 'idle' })
    if (user) await onSignedIn(user)
    else { stopWatching?.(); stopWatching = null }
  })
}

// ── ações de conta ──
export async function signInGoogle() {
  const { a, auth } = await getFirebase()
  await a.signInWithPopup(auth, new a.GoogleAuthProvider())
}
export async function signInEmail(email, password) {
  const { a, auth } = await getFirebase()
  await a.signInWithEmailAndPassword(auth, email, password)
}
export async function signUpEmail(email, password) {
  const { a, auth } = await getFirebase()
  const cred = await a.createUserWithEmailAndPassword(auth, email, password)
  // confirma que o e-mail é da pessoa; se falhar, a conta já existe e dá pra reenviar depois
  try { await a.sendEmailVerification(cred.user) } catch (e) { console.warn('[auth] e-mail de confirmação não saiu', e) }
}

export async function resendVerification() {
  const { a, auth } = await getFirebase()
  if (auth.currentUser) await a.sendEmailVerification(auth.currentUser)
}

// Depois de clicar no link do e-mail, o Firebase só sabe se a gente perguntar de novo
export async function refreshVerified() {
  const { a, auth } = await getFirebase()
  if (!auth.currentUser) return
  await a.reload(auth.currentUser)
  set({ user: { ...state.user, verified: auth.currentUser.emailVerified } })
}
export async function resetPassword(email) {
  const { a, auth } = await getFirebase()
  await a.sendPasswordResetEmail(auth, email)
}

export async function logout() {
  if (timer) await push()
  // se o envio final falhou, não apaga: melhor manter os dados aqui do que perder
  if (state.status === 'error') throw new Error('sync-pending')
  const { a, auth } = await getFirebase()
  await a.signOut(auth)
  clearLocal()
}

export const flush = push

// Token de login que o servidor confere em /api/chat (renovado sozinho pelo Firebase quando vence)
export async function getIdToken() {
  if (import.meta.env.DEV && window.__syncDebug?.token) return window.__syncDebug.token // teste local
  if (!firebaseEnabled || !state.user) return null
  const { auth } = await getFirebase()
  return auth.currentUser ? auth.currentUser.getIdToken() : null
}

// só em desenvolvimento: deixa o teste simular o estado de login sem conta real
if (import.meta.env.DEV) window.__syncDebug = { set }
export { hasProgress }

// Tradução dos erros do Firebase Auth pra algo que a pessoa entende e pode resolver
export function authMessage(err) {
  const code = err?.code || ''
  const map = {
    'auth/invalid-credential': 'E-mail ou senha incorretos. Confira e tente de novo.',
    'auth/user-not-found': 'E-mail ou senha incorretos. Confira e tente de novo.',
    'auth/wrong-password': 'E-mail ou senha incorretos. Confira e tente de novo.',
    'auth/email-already-in-use': 'Já existe uma conta com esse e-mail. Tente entrar.',
    'auth/weak-password': 'Use uma senha com pelo menos 6 caracteres.',
    'auth/invalid-email': 'Esse e-mail parece incompleto. Confira se tem @ e o domínio.',
    'auth/missing-password': 'Digite a senha.',
    'auth/too-many-requests': 'Muitas tentativas seguidas. Espere um pouco e tente de novo.',
    'auth/network-request-failed': 'Sem conexão. Confira a internet e tente de novo.',
    'auth/operation-not-allowed': 'Esse tipo de login ainda não foi ativado no Firebase (Authentication > Sign-in method).',
    'auth/unauthorized-domain': 'Este endereço não está autorizado no Firebase (Authentication > Settings > Authorized domains).',
    'auth/weak-password-policy': 'Essa senha não atende às regras de segurança. Use letras, números e pelo menos 8 caracteres.',
    'auth/popup-blocked': 'O navegador bloqueou a janela do Google. Libere pop-ups pra este site e tente de novo.',
  }
  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return null
  return map[code] || 'Não deu pra entrar agora. Tente de novo em instantes.'
}
