// Validação do cadastro/login. Roda no navegador pra dar resposta rápida;
// a barreira de verdade é o Firebase (e as regras do Firestore).

export const PASSWORD_MIN = 8
export const PASSWORD_MAX = 128

const COMMON = new Set([
  '12345678', '123456789', '1234567890', '87654321', '11111111', '00000000', 'password', 'password1',
  'senha123', 'senha1234', 'senhasenha', 'qwertyui', 'qwertyuiop', 'abc12345', 'iloveyou', 'admin123',
  'brasil123', 'mudar123', 'teste123',
])

// Typos comuns de provedor. Sugerimos, mas quem decide é a pessoa.
const DOMAIN_TYPOS = {
  'gmial.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gamil.com': 'gmail.com', 'gmal.com': 'gmail.com',
  'gmail.con': 'gmail.com', 'gmail.co': 'gmail.com', 'gmail.com.br': 'gmail.com', 'gnail.com': 'gmail.com',
  'hotmial.com': 'hotmail.com', 'hotmai.com': 'hotmail.com', 'hotmail.con': 'hotmail.com',
  'outlok.com': 'outlook.com', 'outlook.con': 'outlook.com',
  'yahoo.con': 'yahoo.com', 'yaho.com': 'yahoo.com', 'icloud.con': 'icloud.com',
}

// E-mail sem espaços e em minúsculas (o Firebase trata as duas formas como a mesma conta)
export const normEmail = (s) => s.trim().toLowerCase()

export function checkEmail(raw) {
  const e = normEmail(raw)
  if (!e) return 'Digite seu e-mail.'
  if (/\s/.test(e)) return 'O e-mail não pode ter espaços no meio.'
  if (e.length > 254) return 'Esse e-mail é longo demais.'
  const m = /^([^@]+)@([^@]+)$/.exec(e)
  if (!m) return 'Digite um e-mail completo, tipo nome@exemplo.com'
  const [, local, domain] = m
  if (local.length > 64 || !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local) || /^\.|\.$|\.\./.test(local)) {
    return 'A parte antes do @ tem algum caractere que e-mails não aceitam.'
  }
  const parts = domain.split('.')
  if (parts.length < 2 || parts.some((p) => !/^[a-z0-9-]+$/.test(p) || p.startsWith('-') || p.endsWith('-')) || parts.at(-1).length < 2) {
    return 'O endereço depois do @ parece incompleto, tipo gmail.com'
  }
  return null
}

// "joao@gmial.com" -> "joao@gmail.com" (ou null se não achar erro conhecido)
export function suggestEmail(raw) {
  const e = normEmail(raw)
  const at = e.lastIndexOf('@')
  if (at < 1) return null
  const fix = DOMAIN_TYPOS[e.slice(at + 1)]
  return fix ? `${e.slice(0, at + 1)}${fix}` : null
}

// Senha de uma conta nova
export function checkNewPassword(pw, email = '') {
  if (!pw) return 'Crie uma senha.'
  if (pw.length < PASSWORD_MIN) return `Use pelo menos ${PASSWORD_MIN} caracteres.`
  if (pw.length > PASSWORD_MAX) return `A senha pode ter no máximo ${PASSWORD_MAX} caracteres.`
  if (COMMON.has(pw.toLowerCase()) || /^(.)\1+$/.test(pw)) return 'Essa senha é fácil de adivinhar. Misture letras e números.'
  const local = normEmail(email).split('@')[0]
  if (local.length >= 4 && pw.toLowerCase().includes(local)) return 'A senha não deve conter o seu e-mail.'
  if (!(/\d/.test(pw) && /[a-z]/i.test(pw)) && pw.length < 12) return 'Misture letras e números, ou use 12 caracteres ou mais.'
  return null
}

// Ao entrar não impomos regra de formato (contas antigas podem ter outra regra): só não pode ficar vazia
export const checkLoginPassword = (pw) => (pw ? null : 'Digite a sua senha.')
