// Voz: falar (síntese) e ouvir (reconhecimento) usando as APIs do navegador.

let voicesReady = null
function getVoices() {
  if (!('speechSynthesis' in window)) return Promise.resolve([])
  if (voicesReady) return voicesReady
  voicesReady = new Promise((resolve) => {
    const v = speechSynthesis.getVoices()
    if (v.length) return resolve(v)
    speechSynthesis.onvoiceschanged = () => resolve(speechSynthesis.getVoices())
    setTimeout(() => resolve(speechSynthesis.getVoices()), 1500)
  })
  return voicesReady
}

export const canSpeak = () => 'speechSynthesis' in window

// Áudio automático: toda frase que aparece é falada. Dá pra silenciar (fica salvo).
const SOUND_KEY = 'idiomas:sound'
const soundSubs = new Set()
export function autoSoundOn() {
  try { return localStorage.getItem(SOUND_KEY) !== 'off' } catch { return true }
}
export function setAutoSound(on) {
  try { localStorage.setItem(SOUND_KEY, on ? 'on' : 'off') } catch { /* nada */ }
  if (!on && canSpeak()) speechSynthesis.cancel()
  soundSubs.forEach((f) => f(on))
}
export function onSoundChange(fn) { soundSubs.add(fn); return () => soundSubs.delete(fn) }
export function autoSpeak(text, langTag, opts) {
  if (autoSoundOn()) speak(text, langTag, opts)
}

export async function speak(text, langTag, { rate = 0.95 } = {}) {
  if (!canSpeak()) return
  const voices = await getVoices()
  speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = langTag
  u.rate = rate
  const base = langTag.slice(0, 2)
  const voice =
    voices.find((v) => v.lang === langTag && /google|natural|premium/i.test(v.name)) ||
    voices.find((v) => v.lang === langTag) ||
    voices.find((v) => v.lang?.startsWith(base))
  if (voice) u.voice = voice
  speechSynthesis.speak(u)
}

const getRecognition = () => typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)
export const canRecognize = () => !!getRecognition()

// Escuta uma frase. Retorna { promise, stop }.
export function listen(langTag) {
  const Recognition = getRecognition()
  const rec = new Recognition()
  rec.lang = langTag
  rec.interimResults = false
  rec.maxAlternatives = 3
  rec.continuous = false
  const promise = new Promise((resolve, reject) => {
    let done = false
    rec.onresult = (e) => {
      done = true
      const alts = Array.from(e.results[0]).map((r) => r.transcript)
      resolve(alts)
    }
    rec.onerror = (e) => { done = true; reject(e.error || 'erro') }
    rec.onend = () => { if (!done) resolve([]) }
  })
  rec.start()
  return { promise, stop: () => rec.stop() }
}

// Fallback: grava o áudio pra pessoa comparar com a voz nativa
export async function record() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  const mr = new MediaRecorder(stream)
  const chunks = []
  mr.ondataavailable = (e) => chunks.push(e.data)
  const promise = new Promise((resolve) => {
    mr.onstop = () => {
      stream.getTracks().forEach((t) => t.stop())
      resolve(URL.createObjectURL(new Blob(chunks, { type: mr.mimeType })))
    }
  })
  mr.start()
  return { promise, stop: () => mr.state !== 'inactive' && mr.stop() }
}

const DIGITS = {
  en: { 1: 'one', 2: 'two', 3: 'three', 10: 'ten' },
  fr: { 1: 'un', 2: 'deux', 3: 'trois', 10: 'dix' },
  es: { 1: 'uno', 2: 'dos', 3: 'tres', 10: 'diez' },
  it: { 1: 'uno', 2: 'due', 3: 'tre', 10: 'dieci' },
}
// O reconhecedor às vezes devolve "10" em vez de "ten"
export function digitsToWords(s, lang) {
  return s.replace(/\b(\d+)\b/g, (m) => DIGITS[lang]?.[m] ?? m)
}
