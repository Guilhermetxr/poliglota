# Poliglota

Site pra estudar inglês, francês, espanhol e italiano, com leitura, escrita e fala separadas.

```bash
npm install
npm run dev
```

## Como funciona

- **Modos separados**: cada item tem um progresso diferente em leitura, escrita e fala.
- **Repetição espaçada** (`src/lib/srs.js`): acertou, sobe de nível e volta mais tarde
  (1 min → 10 min → 8 h → 1 dia → 3 → 7 → 16 → 35 → 90 dias). Errou, volta pro nível 1,
  reaparece em ~1 min e ainda volta na mesma lição. Os itens que você mais erra têm prioridade.
- **Exercícios** (`src/lib/exercises.js`) mudam conforme o nível do item:
  - Leitura: o que significa, como se diz, certo ou errado, ligar pares
  - Escrita: digitar com dica, montar frase com palavras, completar a lacuna, ditado
  - Fala: ler em voz alta, ouvir e repetir, traduzir falando
- **Fala**: usa o reconhecimento de voz do navegador (Chrome/Edge). Mostra palavra por palavra o
  que saiu errado, com a pronúncia escrita "em português" e a sílaba forte em negrito.
  Sem reconhecimento (Firefox), grava sua voz pra comparar com a nativa.
- **Perguntas gerais**: mistura todas as categorias no modo escolhido. **Revisar**: só o que venceu
  e o que você mais erra.
- **Níveis**: Iniciante, Intermediário e Avançado. O próximo destrava quando você aprende 60% do
  anterior (item que já voltou depois de várias horas), separado por modo. Dá pra liberar na mão.
- Progresso, XP e ofensiva ficam no `localStorage`. Com login, também vão pro Firebase (abaixo).

## Login e sincronização (Firebase)

Sem configurar nada o site funciona normalmente, só que sem login. Pra ativar:

1. No [console do Firebase](https://console.firebase.google.com), crie um projeto.
2. **Authentication > Sign-in method**: ative **Google** e **E-mail/senha**.
3. **Firestore Database > Criar banco de dados** (modo produção).
4. **Firestore > Regras**: cole o conteúdo de `firestore.rules` e publique.
5. **Configurações do projeto > Seus apps > Web (</>)**: registre um app e copie a config.
6. Copie `.env.example` para `.env.local` e preencha os 4 valores.
7. Reinicie o `npm run dev`. Ao publicar o site, adicione o domínio em
   **Authentication > Settings > Authorized domains** (o `localhost` já vem liberado).

Como funciona: ao entrar, o progresso da nuvem é **juntado** com o do navegador (cada frase fica
com a versão mais recente, nada se perde) e depois cada mudança é salva sozinha. Ao sair, o
progresso local é apagado pra outra pessoa no mesmo navegador não herdar. Fica tudo num único
documento por pessoa (`users/{uid}`), bem abaixo do limite de 1 MB do Firestore.

## Segurança

- **Regras do Firestore** (`firestore.rules`): cada pessoa só lê e grava o próprio documento, só com os
  campos `v`, `data` e `updatedAt`, tamanho limitado e horário vindo do servidor. Sem apagar direto. Tudo
  que não está nas regras é negado. **Publique as regras de novo sempre que esse arquivo mudar.**
- **Cabeçalhos** (`vercel.json`): `nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy` e `Permissions-Policy`
  (microfone só neste site).
- **Cadastro** (`src/lib/validate.js`): e-mail validado e normalizado, sugestão de erro de digitação,
  senha de 8+ caracteres com letras e números, sem senhas óbvias, e e-mail de confirmação no cadastro.
- **Dados vindos da nuvem** são tratados como não confiáveis: só entram chaves no formato esperado e
  números dentro de limites (`mergeRemote` em `src/lib/srs.js`).
- A chave do Firebase (`VITE_FIREBASE_*`) é pública por natureza. No Google Cloud, em
  **APIs e serviços > Credenciais**, restrinja a chave aos seus domínios (`*.vercel.app`, `localhost`).
- No Firebase Authentication, ative **Política de senha** (mínimo 8) e deixe a **proteção contra
  enumeração de e-mails** ligada.

## Adicionar conteúdo

Cada nível tem seu arquivo: `src/data/content.js` (nível 1), `level2.js` e `level3.js`.

Edite `src/data/content.js`. A pronúncia precisa ter uma palavra pra cada palavra do texto,
com a sílaba tônica em MAIÚSCULAS. Depois rode:

```bash
npm run check-data
```
