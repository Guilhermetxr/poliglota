// Firebase só é carregado se o .env.local estiver preenchido.
// Sem isso o site funciona normalmente, só sem login (progresso fica neste navegador).

const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const firebaseEnabled = Boolean(cfg.apiKey && cfg.authDomain && cfg.projectId && cfg.appId)

let ready = null

// Carrega o SDK sob demanda (fica fora do pacote inicial)
export function getFirebase() {
  ready ??= (async () => {
    const [{ initializeApp }, auth, fs] = await Promise.all([
      import('firebase/app'),
      import('firebase/auth'),
      import('firebase/firestore'),
    ])
    const app = initializeApp(cfg)
    return { auth: auth.getAuth(app), db: fs.getFirestore(app), a: auth, f: fs }
  })()
  return ready
}
