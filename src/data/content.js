import { SHARED_2, SLANG_2 } from './level2.js'
import { SHARED_3, SLANG_3 } from './level3.js'

// Conteúdo de estudo.
// Cada frase tem: texto no idioma, pronúncia "aportuguesada" e (opcional) respostas alternativas.
// A pronúncia tem UMA palavra para cada palavra do texto (separadas por espaço),
// sílabas separadas por "-" e a sílaba tônica em MAIÚSCULAS. Rode `npm run check-data` para validar.

export const LANGS = {
  en: {
    id: 'en', name: 'Inglês', native: 'English', hello: 'Hello', speech: 'en-US',
    accents: [],
    // [som, dica, quando mostrar (palavra, pronúncia) => bool]
    tips: [
      ['th', 'língua entre os dentes, soprando (como um "f" com a língua)', (w, p) => /th/i.test(p)],
      ['dh', '"th" com voz, língua entre os dentes vibrando (this, the)', (w, p) => /dh/i.test(p)],
      ['r', 'r "caipira", com a língua enrolada pra trás', (w) => /r/i.test(w)],
      ['ii / uu', 'vogal longa, segura um pouco mais', (w, p) => /ii|uu/i.test(p)],
    ],
  },
  fr: {
    id: 'fr', name: 'Francês', native: 'Français', hello: 'Bonjour', speech: 'fr-FR',
    accents: ['é', 'è', 'ê', 'à', 'â', 'ç', 'ô', 'î', 'ù', 'û', 'ë', 'œ'],
    tips: [
      ['rr', 'r arranhado na garganta, como o "r" de "carro" no Rio', (w, p) => /rr/i.test(p)],
      ['ü', 'fala "i" com a boca de bico, como se fosse assobiar', (w, p) => /ü/i.test(p)],
      ['ö', 'fala "ê" com a boca de bico', (w, p) => /ö/i.test(p)],
      ['õ / ã / ẽ', 'som nasal, sai pelo nariz e não fecha com "n"', (w, p) => /[õãẽ]/i.test(p)],
      ['tônica', 'em francês a força quase sempre cai na última sílaba', () => false],
    ],
  },
  es: {
    id: 'es', name: 'Espanhol', native: 'Español', hello: 'Hola', speech: 'es-ES',
    accents: ['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü', '¿', '¡'],
    tips: [
      ['j / g', 'o "j" é um r aspirado de garganta: "Hijo" = Í-rro', (w) => /j|g[ei]/i.test(w)],
      ['b / v', 'b e v soam iguais, quase um "b" suave', (w) => /v/i.test(w)],
      ['ll / y', 'soa como "i" (ou "j" na Argentina)', (w) => /ll|y/i.test(w)],
      ['o final', '"o" final é fechado, não vira "u" como no português', (w) => /o[?!.,]*$/i.test(w)],
    ],
  },
  it: {
    id: 'it', name: 'Italiano', native: 'Italiano', hello: 'Ciao', speech: 'it-IT',
    accents: ['à', 'è', 'é', 'ì', 'ò', 'ù'],
    tips: [
      ['letras dobradas', 'segura a consoante: "letto" = LÉT-to, com pausinha', (w) => /([bcdfglmnprstvz])\1/i.test(w)],
      ['ci / ce', 'soa "tchi / tché": "cucina" = ku-TCHI-na', (w) => /c[ieèì]/i.test(w)],
      ['gli', 'soa como "lh": "famiglia" = fa-MÍ-lha', (w) => /gli/i.test(w)],
      ['vogal final', 'nunca engole a vogal final, fala ela inteira', () => false],
    ],
  },
}

export const CATEGORIES = [
  { id: 'cumprimentos', name: 'Cumprimentos', icon: 'chat', desc: 'Oi, tchau, obrigado e o básico pra começar' },
  { id: 'casa', name: 'Coisas de casa', icon: 'home', desc: 'Cômodos, móveis e objetos' },
  { id: 'comida', name: 'Comida e bebida', icon: 'food', desc: 'Restaurante, mercado e fome' },
  { id: 'viagem', name: 'Viagem', icon: 'suitcase', desc: 'Aeroporto, direções e perguntas úteis' },
  { id: 'tempo', name: 'Números e tempo', icon: 'clock', desc: 'Contar, dias e horas' },
  { id: 'familia', name: 'Família e pessoas', icon: 'people', desc: 'Parentes, amigos e carinho' },
  { id: 'diadia', name: 'Dia a dia', icon: 'coffee', desc: 'Frases que salvam numa conversa' },
  { id: 'trabalho', name: 'Trabalho', icon: 'laptop', desc: 'Reunião, prazo, chefe e e-mail' },
  { id: 'saude', name: 'Saúde', icon: 'heartplus', desc: 'Médico, remédio e o que você sente' },
  { id: 'sentimentos', name: 'Sentimentos', icon: 'smile', desc: 'Como você está se sentindo' },
  { id: 'girias', name: 'Gírias', icon: 'flame', desc: 'Como o povo fala de verdade' },
]

// [categoria, id, português, { en: [texto, pronúncia, alternativas?], fr, es, it }]
const SHARED_1 = [
  // ── Cumprimentos ──
  ['cumprimentos', 'oi', 'Oi', {
    en: ['Hi', 'RÁI', ['Hello']], fr: ['Salut', 'sa-LÜ'], es: ['Hola', 'Ô-la'], it: ['Ciao', 'TCHÁU'],
  }],
  ['cumprimentos', 'bomdia', 'Bom dia', {
    en: ['Good morning', 'gud MÓR-nin'], fr: ['Bonjour', 'bõ-JURR'], es: ['Buenos días', 'BUÊ-nos DI-as'], it: ['Buongiorno', 'buon-DJÔR-no'],
  }],
  ['cumprimentos', 'boanoite', 'Boa noite (ao se despedir)', {
    en: ['Good night', 'gud NÁIT'], fr: ['Bonne nuit', 'bón NÜÍ'], es: ['Buenas noches', 'BUÊ-nas NÔ-tches'], it: ['Buonanotte', 'buo-na-NÓT-te'],
  }],
  ['cumprimentos', 'tudobem', 'Tudo bem?', {
    en: ['How are you?', 'ráu ar IÚ'], fr: ['Ça va?', 'sa VA'], es: ['¿Qué tal?', 'kê TAL', ['¿Cómo estás?']], it: ['Come stai?', 'KÔ-me STÁI'],
  }],
  ['cumprimentos', 'obrigado', 'Obrigado', {
    en: ['Thank you', 'THÊNK iu', ['Thanks']], fr: ['Merci', 'mérr-SI'], es: ['Gracias', 'GRA-ssias'], it: ['Grazie', 'GRÁ-tsie'],
  }],
  ['cumprimentos', 'porfavor', 'Por favor', {
    en: ['Please', 'PLIIZ'], fr: ['S\'il vous plaît', 'sil vu PLÉ'], es: ['Por favor', 'por fa-BÔR'], it: ['Per favore', 'per fa-VÔ-re'],
  }],
  ['cumprimentos', 'tchau', 'Tchau', {
    en: ['Goodbye', 'gud-BÁI', ['Bye']], fr: ['Au revoir', 'ô rrö-VUÁRR'], es: ['Adiós', 'a-DIÔS', ['Chao']], it: ['Arrivederci', 'ar-ri-ve-DÉR-tchi'],
  }],
  ['cumprimentos', 'prazer', 'Prazer em te conhecer', {
    en: ['Nice to meet you', 'NÁIS tu MIIT iu'], fr: ['Enchanté', 'ã-shã-TÊ'], es: ['Mucho gusto', 'MU-tcho GUS-to', ['Encantado']], it: ['Piacere', 'pia-TCHÊ-re'],
  }],
  ['cumprimentos', 'meunome', 'Meu nome é Ana', {
    en: ['My name is Ana', 'mái NÊIM iz Á-na'], fr: ['Je m\'appelle Ana', 'jö ma-PÉL a-NA'], es: ['Me llamo Ana', 'me IÁ-mo Á-na'], it: ['Mi chiamo Ana', 'mi KIÁ-mo Á-na'],
  }],
  ['cumprimentos', 'desculpa', 'Desculpa', {
    en: ['Sorry', 'SÓ-ri', ['I\'m sorry']], fr: ['Pardon', 'parr-DÕ', ['Désolé']], es: ['Perdón', 'per-DÔN', ['Lo siento']], it: ['Scusa', 'SKU-za', ['Scusi']],
  }],
  ['cumprimentos', 'atelogo', 'Até logo', {
    en: ['See you later', 'SII iu LÊI-ter'], fr: ['À plus tard', 'a plü TARR', ['À plus']], es: ['Hasta luego', 'AS-ta LUÊ-go'], it: ['A dopo', 'a DÔ-po'],
  }],

  // ── Coisas de casa ──
  ['casa', 'casa', 'A casa', {
    en: ['The house', 'dhâ RÁUS', ['The home']], fr: ['La maison', 'la mé-ZÕ'], es: ['La casa', 'la KA-sa'], it: ['La casa', 'la KÁ-za'],
  }],
  ['casa', 'cozinha', 'A cozinha', {
    en: ['The kitchen', 'dhâ KI-tchen'], fr: ['La cuisine', 'la küi-ZIN'], es: ['La cocina', 'la ko-SSI-na'], it: ['La cucina', 'la ku-TCHI-na'],
  }],
  ['casa', 'quarto', 'O quarto', {
    en: ['The bedroom', 'dhâ BÉD-rum'], fr: ['La chambre', 'la SHÃ-brrö'], es: ['La habitación', 'la a-bi-ta-SSIÔN', ['El dormitorio', 'El cuarto']], it: ['La camera', 'la KÁ-me-ra', ['La camera da letto']],
  }],
  ['casa', 'banheiro', 'O banheiro', {
    en: ['The bathroom', 'dhâ BÉTH-rum'], fr: ['La salle de bain', 'la sal dö BẼ'], es: ['El baño', 'el BA-nho'], it: ['Il bagno', 'il BÁ-nho'],
  }],
  ['casa', 'cama', 'A cama', {
    en: ['The bed', 'dhâ BÉD'], fr: ['Le lit', 'lö LI'], es: ['La cama', 'la KA-ma'], it: ['Il letto', 'il LÉT-to'],
  }],
  ['casa', 'mesa', 'A mesa', {
    en: ['The table', 'dhâ TÊI-bol'], fr: ['La table', 'la TA-blö'], es: ['La mesa', 'la MÊ-sa'], it: ['Il tavolo', 'il TÁ-vo-lo'],
  }],
  ['casa', 'cadeira', 'A cadeira', {
    en: ['The chair', 'dhâ TCHÉR'], fr: ['La chaise', 'la SHÉZ'], es: ['La silla', 'la SI-ia'], it: ['La sedia', 'la SÉ-dia'],
  }],
  ['casa', 'porta', 'A porta', {
    en: ['The door', 'dhâ DÓR'], fr: ['La porte', 'la PÓRRT'], es: ['La puerta', 'la PUÉR-ta'], it: ['La porta', 'la PÓR-ta'],
  }],
  ['casa', 'janela', 'A janela', {
    en: ['The window', 'dhâ UÍN-dou'], fr: ['La fenêtre', 'la fö-NÉ-trrö'], es: ['La ventana', 'la ben-TA-na'], it: ['La finestra', 'la fi-NÉS-tra'],
  }],
  ['casa', 'geladeira', 'A geladeira', {
    en: ['The fridge', 'dhâ FRÍDJ', ['The refrigerator']], fr: ['Le frigo', 'lö frri-GÔ', ['Le réfrigérateur']], es: ['La nevera', 'la ne-BÊ-ra', ['El refrigerador']], it: ['Il frigorifero', 'il fri-go-RÍ-fe-ro', ['Il frigo']],
  }],
  ['casa', 'sofa', 'O sofá', {
    en: ['The couch', 'dhâ KÁUTCH', ['The sofa']], fr: ['Le canapé', 'lö ka-na-PÊ'], es: ['El sofá', 'el so-FÁ'], it: ['Il divano', 'il di-VÁ-no'],
  }],
  ['casa', 'ondebanheiro', 'Onde fica o banheiro?', {
    en: ['Where is the bathroom?', 'uér iz dhâ BÉTH-rum', ['Where\'s the bathroom?']], fr: ['Où sont les toilettes?', 'u sõ lê tua-LÉT'], es: ['¿Dónde está el baño?', 'DÔN-de es-TÁ el BA-nho'], it: ['Dov\'è il bagno?', 'do-VÉ il BÁ-nho'],
  }],

  // ── Comida e bebida ──
  ['comida', 'agua', 'Água', {
    en: ['Water', 'UÓ-ter'], fr: ['L\'eau', 'LÔ', ['Eau']], es: ['Agua', 'Á-gua'], it: ['Acqua', 'ÁK-kua'],
  }],
  ['comida', 'pao', 'O pão', {
    en: ['The bread', 'dhâ BRÉD'], fr: ['Le pain', 'lö PẼ'], es: ['El pan', 'el PAN'], it: ['Il pane', 'il PÁ-ne'],
  }],
  ['comida', 'cafe', 'O café', {
    en: ['The coffee', 'dhâ KÓ-fi'], fr: ['Le café', 'lö ka-FÊ'], es: ['El café', 'el ka-FÊ'], it: ['Il caffè', 'il kaf-FÉ'],
  }],
  ['comida', 'queijo', 'O queijo', {
    en: ['The cheese', 'dhâ TCHIIZ'], fr: ['Le fromage', 'lö frro-MAJ'], es: ['El queso', 'el KÊ-so'], it: ['Il formaggio', 'il for-MÁ-djo'],
  }],
  ['comida', 'maca', 'A maçã', {
    en: ['The apple', 'dhi É-pol'], fr: ['La pomme', 'la PÓM'], es: ['La manzana', 'la man-SSA-na'], it: ['La mela', 'la MÊ-la'],
  }],
  ['comida', 'carne', 'A carne', {
    en: ['The meat', 'dhâ MIIT'], fr: ['La viande', 'la VIÃD'], es: ['La carne', 'la KAR-ne'], it: ['La carne', 'la KÁR-ne'],
  }],
  ['comida', 'fome', 'Estou com fome', {
    en: ['I\'m hungry', 'áim RÂN-gri', ['I am hungry']], fr: ['J\'ai faim', 'jé FẼ'], es: ['Tengo hambre', 'TÊN-go ÂM-bre'], it: ['Ho fame', 'ó FÁ-me'],
  }],
  ['comida', 'conta', 'A conta, por favor', {
    en: ['The check, please', 'dhâ TCHÉK PLIIZ', ['The bill, please']], fr: ['L\'addition, s\'il vous plaît', 'la-di-SSIÕ sil vu PLÉ'], es: ['La cuenta, por favor', 'la KUÊN-ta por fa-BÔR'], it: ['Il conto, per favore', 'il KÔN-to per fa-VÔ-re'],
  }],
  ['comida', 'delicioso', 'Está delicioso', {
    en: ['It\'s delicious', 'its di-LÍ-shâs', ['It is delicious']], fr: ['C\'est délicieux', 'sé dê-li-SSIÖ'], es: ['Está delicioso', 'es-TÁ de-li-SSIÔ-so', ['Está rico']], it: ['È delizioso', 'É de-li-TSIÔ-zo', ['È buonissimo']],
  }],
  ['comida', 'queroumcafe', 'Eu gostaria de um café', {
    en: ['I would like a coffee', 'ái uud LÁIK â KÓ-fi', ['I\'d like a coffee']], fr: ['Je voudrais un café', 'jö vu-DRRÉ ẽ ka-FÊ'], es: ['Quisiera un café', 'ki-SSIÊ-ra un ka-FÊ', ['Me gustaría un café']], it: ['Vorrei un caffè', 'vor-RÉI un kaf-FÉ'],
  }],

  // ── Viagem ──
  ['viagem', 'aeroporto', 'O aeroporto', {
    en: ['The airport', 'dhi ÉR-port'], fr: ['L\'aéroport', 'la-ê-rro-PÓRR'], es: ['El aeropuerto', 'el a-e-ro-PUÉR-to'], it: ['L\'aeroporto', 'la-e-ro-PÓR-to'],
  }],
  ['viagem', 'hotel', 'O hotel', {
    en: ['The hotel', 'dhâ rou-TÉL'], fr: ['L\'hôtel', 'lô-TÉL'], es: ['El hotel', 'el o-TÉL'], it: ['L\'albergo', 'lal-BÉR-go', ['L\'hotel']],
  }],
  ['viagem', 'passagem', 'A passagem', {
    en: ['The ticket', 'dhâ TÍ-ket'], fr: ['Le billet', 'lö bi-IÉ'], es: ['El billete', 'el bi-IÊ-te', ['El boleto', 'El pasaje']], it: ['Il biglietto', 'il bi-LHÉT-to'],
  }],
  ['viagem', 'estacao', 'Onde fica a estação?', {
    en: ['Where is the station?', 'uér iz dhâ STÊI-shan', ['Where\'s the station?']], fr: ['Où est la gare?', 'u é la GARR'], es: ['¿Dónde está la estación?', 'DÔN-de es-TÁ la es-ta-SSIÔN'], it: ['Dov\'è la stazione?', 'do-VÉ la sta-TSIÔ-ne'],
  }],
  ['viagem', 'quantocusta', 'Quanto custa?', {
    en: ['How much is it?', 'ráu MÂTCH iz it', ['How much does it cost?', 'How much?']], fr: ['Combien ça coûte?', 'kõ-BIẼ sa KUT', ['C\'est combien?']], es: ['¿Cuánto cuesta?', 'KUÂN-to KUÊS-ta'], it: ['Quanto costa?', 'KUÁN-to KÓS-ta'],
  }],
  ['viagem', 'perdido', 'Eu estou perdido', {
    en: ['I\'m lost', 'áim LÓST', ['I am lost']], fr: ['Je suis perdu', 'jö süí pérr-DÜ'], es: ['Estoy perdido', 'es-TÓI per-DI-do'], it: ['Mi sono perso', 'mi SÔ-no PÉR-so', ['Sono perso']],
  }],
  ['viagem', 'esquerda', 'À esquerda', {
    en: ['On the left', 'ón dhâ LÉFT', ['To the left', 'Left']], fr: ['À gauche', 'a GÔSH'], es: ['A la izquierda', 'a la is-KIÉR-da'], it: ['A sinistra', 'a si-NÍS-tra'],
  }],
  ['viagem', 'direita', 'À direita', {
    en: ['On the right', 'ón dhâ RÁIT', ['To the right', 'Right']], fr: ['À droite', 'a DRRUÁT'], es: ['A la derecha', 'a la de-RÊ-tcha'], it: ['A destra', 'a DÉS-tra'],
  }],
  ['viagem', 'naoentendo', 'Eu não entendo', {
    en: ['I don\'t understand', 'ái DÔUNT ân-der-STÉND', ['I do not understand']], fr: ['Je ne comprends pas', 'jö nö kõ-PRRÃ PA', ['Je comprends pas']], es: ['No entiendo', 'no en-TIÊN-do'], it: ['Non capisco', 'non ka-PÍS-ko'],
  }],
  ['viagem', 'falaportugues', 'Você fala português?', {
    en: ['Do you speak Portuguese?', 'du iu SPIIK pór-tchu-GUIIZ'], fr: ['Vous parlez portugais?', 'vu parr-LÊ porr-tü-GUÉ', ['Tu parles portugais?']], es: ['¿Hablas portugués?', 'Á-blas por-tu-GUÊS', ['¿Habla portugués?']], it: ['Parli portoghese?', 'PÁR-li por-to-GUÊ-ze', ['Parla portoghese?']],
  }],

  // ── Números e tempo ──
  ['tempo', 'um', 'Um (1)', {
    en: ['One', 'UÂN'], fr: ['Un', 'Ẽ'], es: ['Uno', 'U-no'], it: ['Uno', 'U-no'],
  }],
  ['tempo', 'dois', 'Dois (2)', {
    en: ['Two', 'TUU'], fr: ['Deux', 'DÖ'], es: ['Dos', 'DÔS'], it: ['Due', 'DU-e'],
  }],
  ['tempo', 'tres', 'Três (3)', {
    en: ['Three', 'THRII'], fr: ['Trois', 'TRRUÁ'], es: ['Tres', 'TRÊS'], it: ['Tre', 'TRÊ'],
  }],
  ['tempo', 'dez', 'Dez (10)', {
    en: ['Ten', 'TÉN'], fr: ['Dix', 'DIS'], es: ['Diez', 'DIÊS'], it: ['Dieci', 'DIÉ-tchi'],
  }],
  ['tempo', 'hoje', 'Hoje', {
    en: ['Today', 'tu-DÊI'], fr: ['Aujourd\'hui', 'ô-jurr-DÜÍ'], es: ['Hoy', 'ÓI'], it: ['Oggi', 'ÓD-dji'],
  }],
  ['tempo', 'amanha', 'Amanhã', {
    en: ['Tomorrow', 'tu-MÓ-rou'], fr: ['Demain', 'dö-MẼ'], es: ['Mañana', 'ma-NHA-na'], it: ['Domani', 'do-MÁ-ni'],
  }],
  ['tempo', 'ontem', 'Ontem', {
    en: ['Yesterday', 'IÉS-ter-dei'], fr: ['Hier', 'IÉRR'], es: ['Ayer', 'a-IÉR'], it: ['Ieri', 'IÉ-ri'],
  }],
  ['tempo', 'horas', 'Que horas são?', {
    en: ['What time is it?', 'uót TÁIM iz it'], fr: ['Quelle heure est-il?', 'kél ÖRR é-TIL'], es: ['¿Qué hora es?', 'kê Ô-ra ÊS'], it: ['Che ore sono?', 'ke Ô-re SÔ-no', ['Che ora è?']],
  }],
  ['tempo', 'segunda', 'Segunda-feira', {
    en: ['Monday', 'MÂN-dei'], fr: ['Lundi', 'lẽ-DI'], es: ['Lunes', 'LU-nes'], it: ['Lunedì', 'lu-ne-DÍ'],
  }],
  ['tempo', 'fimdesemana', 'O fim de semana', {
    en: ['The weekend', 'dhâ UIIK-end'], fr: ['Le week-end', 'lö ui-KÉND'], es: ['El fin de semana', 'el FIN de se-MA-na'], it: ['Il fine settimana', 'il FÍ-ne set-ti-MÁ-na', ['Il weekend']],
  }],

  // ── Família e pessoas ──
  ['familia', 'mae', 'A mãe', {
    en: ['The mother', 'dhâ MÂ-dher', ['The mom']], fr: ['La mère', 'la MÉRR'], es: ['La madre', 'la MA-dre'], it: ['La madre', 'la MÁ-dre'],
  }],
  ['familia', 'pai', 'O pai', {
    en: ['The father', 'dhâ FÁ-dher', ['The dad']], fr: ['Le père', 'lö PÉRR'], es: ['El padre', 'el PA-dre'], it: ['Il padre', 'il PÁ-dre'],
  }],
  ['familia', 'irmao', 'O irmão', {
    en: ['The brother', 'dhâ BRÂ-dher'], fr: ['Le frère', 'lö FRRÉRR'], es: ['El hermano', 'el er-MA-no'], it: ['Il fratello', 'il fra-TÉL-lo'],
  }],
  ['familia', 'irma', 'A irmã', {
    en: ['The sister', 'dhâ SÍS-ter'], fr: ['La sœur', 'la SÖRR'], es: ['La hermana', 'la er-MA-na'], it: ['La sorella', 'la so-RÉL-la'],
  }],
  ['familia', 'amigo', 'O amigo', {
    en: ['The friend', 'dhâ FRÉND'], fr: ['L\'ami', 'la-MI'], es: ['El amigo', 'el a-MI-go'], it: ['L\'amico', 'la-MÍ-ko'],
  }],
  ['familia', 'filho', 'O filho', {
    en: ['The son', 'dhâ SÂN'], fr: ['Le fils', 'lö FIS'], es: ['El hijo', 'el Í-rro'], it: ['Il figlio', 'il FÍ-lho'],
  }],
  ['familia', 'teamo', 'Eu te amo', {
    en: ['I love you', 'ái LÂV iu'], fr: ['Je t\'aime', 'jö TÉM'], es: ['Te quiero', 'te KIÊ-ro', ['Te amo']], it: ['Ti amo', 'ti Á-mo', ['Ti voglio bene']],
  }],
  ['familia', 'minhafamilia', 'Esta é minha família', {
    en: ['This is my family', 'DHIS iz mái FÉ-mi-li'], fr: ['C\'est ma famille', 'sé ma fa-MI-iö', ['Voici ma famille']], es: ['Esta es mi familia', 'ÊS-ta es mi fa-MI-lia'], it: ['Questa è la mia famiglia', 'KUÊS-ta é la MÍ-a fa-MÍ-lha'],
  }],

  // ── Dia a dia ──
  ['diadia', 'sim', 'Sim', {
    en: ['Yes', 'IÉS'], fr: ['Oui', 'UÍ'], es: ['Sí', 'SÍ'], it: ['Sì', 'SÍ'],
  }],
  ['diadia', 'nao', 'Não', {
    en: ['No', 'NÔU'], fr: ['Non', 'NÕ'], es: ['No', 'NÔ'], it: ['No', 'NÓ'],
  }],
  ['diadia', 'naosei', 'Eu não sei', {
    en: ['I don\'t know', 'ái DÔUNT NÔU', ['I do not know']], fr: ['Je ne sais pas', 'jö nö SSÉ PA', ['Je sais pas']], es: ['No sé', 'no SÊ', ['No lo sé']], it: ['Non lo so', 'non lo SÓ'],
  }],
  ['diadia', 'ajuda', 'Eu preciso de ajuda', {
    en: ['I need help', 'ái NIID RÉLP'], fr: ['J\'ai besoin d\'aide', 'jé bö-ZUẼ DÉD'], es: ['Necesito ayuda', 'ne-sse-SSI-to a-IU-da'], it: ['Ho bisogno di aiuto', 'ó bi-ZÔ-nho di a-IÚ-to'],
  }],
  ['diadia', 'repetir', 'Pode repetir?', {
    en: ['Can you repeat?', 'kén iu ri-PIIT', ['Can you repeat that?']], fr: ['Vous pouvez répéter?', 'vu pu-VÊ rrê-pê-TÊ', ['Tu peux répéter?']], es: ['¿Puedes repetir?', 'PUÊ-des re-pe-TIR', ['¿Puede repetir?']], it: ['Puoi ripetere?', 'PUÓI ri-PÉ-te-re', ['Può ripetere?']],
  }],
  ['diadia', 'devagar', 'Mais devagar, por favor', {
    en: ['Slower, please', 'SLÔU-er PLIIZ'], fr: ['Plus lentement, s\'il vous plaît', 'plü lãt-MÃ sil vu PLÉ'], es: ['Más despacio, por favor', 'MÁS des-PA-ssio por fa-BÔR'], it: ['Più piano, per favore', 'PIÚ PIÁ-no per fa-VÔ-re', ['Più lentamente, per favore']],
  }],
  ['diadia', 'cansado', 'Estou cansado', {
    en: ['I\'m tired', 'áim TÁI-erd', ['I am tired']], fr: ['Je suis fatigué', 'jö süí fa-ti-GUÊ'], es: ['Estoy cansado', 'es-TÓI kan-SSA-do'], it: ['Sono stanco', 'SÔ-no STÁN-ko'],
  }],
  ['diadia', 'dialindo', 'Que dia lindo', {
    en: ['What a beautiful day', 'uót â BIÚ-ti-ful DÊI'], fr: ['Quelle belle journée', 'kél bél jurr-NÊ'], es: ['Qué día tan bonito', 'kê DI-a tan bo-NI-to'], it: ['Che bella giornata', 'ke BÉL-la djor-NÁ-ta'],
  }],
  ['diadia', 'claro', 'Com certeza', {
    en: ['Of course', 'óv KÓRS', ['Sure']], fr: ['Bien sûr', 'biẽ SÜRR'], es: ['Claro', 'KLA-ro', ['Por supuesto']], it: ['Certo', 'TCHÉR-to', ['Certamente']],
  }],
]

// Gírias não se traduzem 1 pra 1, então cada idioma tem as suas.
// [id, texto, pronúncia, significado em português, explicação]
const SLANG_1 = {
  en: [
    ['whatsup', 'What\'s up?', 'uóts ÂP', 'E aí? / Qual é?', 'Cumprimento informal. Responde com "Not much" (nada demais).'],
    ['noway', 'No way!', 'nôu UÊI', 'Não acredito! / Nem a pau!', 'Serve pra surpresa ou pra recusar algo.'],
    ['broke', 'I\'m broke', 'áim BRÔUK', 'Tô liso / sem grana', '"Broke" = quebrado. Tô quebrado de grana.'],
    ['cool', 'That\'s cool', 'dhéts KUUL', 'Que massa / Que legal', 'Coringa pra tudo que é bom.'],
    ['chill', 'Chill out', 'TCHIL áut', 'Relaxa / fica de boa', '"Chill" sozinho também vale: "Just chill".'],
    ['hangout', 'Let\'s hang out', 'léts RÉNG áut', 'Bora dar um rolê', '"Hang out" = passar tempo junto, sem compromisso.'],
    ['mybad', 'My bad', 'mái BÉD', 'Foi mal', 'Pedido de desculpas rápido e informal.'],
    ['gonna', 'I\'m gonna sleep', 'áim GÓ-na SLIIP', 'Vou dormir', '"Gonna" = "going to" falado rápido.'],
  ],
  fr: [
    ['caroule', 'Ça roule?', 'sa RRUL', 'Beleza? / Tá rolando?', 'Literalmente "tá rodando?". Responde "Ça roule!".'],
    ['tropbien', 'Trop bien!', 'trrô BIẼ', 'Muito massa!', '"Trop" = demais. Usado o tempo todo.'],
    ['creve', 'Je suis crevé', 'jö süí krrö-VÊ', 'Tô morto (de cansado)', '"Crevé" = furado, como pneu furado.'],
    ['ouf', 'C\'est ouf!', 'sé UF', 'É doideira!', '"Ouf" é "fou" (louco) de trás pra frente, o famoso verlan.'],
    ['laisse', 'Laisse tomber', 'lés tõ-BÊ', 'Deixa pra lá', 'Literalmente "deixa cair".'],
    ['bouffer', 'On va bouffer', 'õ va bu-FÊ', 'Bora rangar', '"Bouffer" = comer, bem informal.'],
    ['mec', 'Salut mec', 'sa-LÜ MÉK', 'E aí, mano', '"Mec" = cara, mano.'],
    ['kiffer', 'Je kiffe', 'jö KIF', 'Eu curto demais', '"Kiffer" vem do árabe, quer dizer amar/curtir.'],
  ],
  es: [
    ['queonda', '¿Qué onda?', 'kê ÔN-da', 'E aí? / Qual é a boa?', 'Muito usado no México e na Argentina.'],
    ['guay', '¡Qué guay!', 'kê GUÁI', 'Que massa!', 'Gíria da Espanha.'],
    ['tio', 'Oye, tío', 'Ô-ie TI-o', 'Ô, mano', 'Na Espanha "tío/tía" é tipo "mano/mana", não é parente.'],
    ['vale', 'Vale', 'BA-le', 'Beleza / Fechou', 'Concordar com algo, bem da Espanha.'],
    ['chevere', 'Qué chévere', 'kê TCHÊ-be-re', 'Que massa', 'Venezuela, Colômbia e Caribe.'],
    ['nopasanada', 'No pasa nada', 'no PA-sa NA-da', 'Tranquilo / sem problema', 'Literalmente "não acontece nada".'],
    ['memola', 'Me mola', 'me MÔ-la', 'Eu curto / gosto muito', 'Espanha. "Mola mucho" = é muito massa.'],
    ['nubes', 'Estar en las nubes', 'es-TAR en las NU-bes', 'Estar viajando / distraído', 'Literalmente "estar nas nuvens".'],
  ],
  it: [
    ['figata', 'Che figata!', 'ke fi-GÁ-ta', 'Que massa!', 'Uma das gírias mais comuns na Itália.'],
    ['boh', 'Boh', 'BÓ', 'Sei lá', 'Com um dar de ombros, é a resposta mais italiana que existe.'],
    ['dai', 'Dai!', 'DÁI', 'Vai! / Para com isso!', 'Depende do tom: incentivo ou "ah, qual é".'],
    ['magari', 'Magari!', 'ma-GÁ-ri', 'Quem dera!', 'Responde quando algo seria bom demais pra ser verdade.'],
    ['chepalle', 'Che palle!', 'ke PÁL-le', 'Que saco!', 'Informal, pra quando algo é chato.'],
    ['figurati', 'Figurati', 'fi-GÚ-ra-ti', 'Imagina / de nada', 'Resposta a um "grazie".'],
    ['scarpetta', 'Fare la scarpetta', 'FÁ-re la skar-PÉT-ta', 'Limpar o prato com pão', 'Passar o pão no molho no fim da refeição.'],
    ['inbocca', 'In bocca al lupo', 'in BÓK-ka al LÚ-po', 'Boa sorte!', 'Literalmente "na boca do lobo". Responde "Crepi!".'],
  ],
}

export const LEVELS = [
  { id: 1, name: 'Iniciante', desc: 'O básico pra se virar' },
  { id: 2, name: 'Intermediário', desc: 'Conversas do dia a dia' },
  { id: 3, name: 'Avançado', desc: 'Situações reais e mais gírias' },
]

const PACKS = [
  { level: 1, shared: SHARED_1, slang: SLANG_1 },
  { level: 2, shared: SHARED_2, slang: SLANG_2 },
  { level: 3, shared: SHARED_3, slang: SLANG_3 },
]

function build() {
  const out = {}
  for (const lang of Object.keys(LANGS)) {
    const items = []
    for (const { level, shared, slang } of PACKS) {
      for (const [cat, id, pt, langs] of shared) {
        const [text, pron, alts = []] = langs[lang]
        items.push({ id: `${cat}.${id}`, cat, level, pt, text, pron, alts })
      }
      for (const [id, text, pron, pt, note] of slang[lang]) {
        items.push({ id: `girias.${id}`, cat: 'girias', level, pt, text, pron, alts: [], note })
      }
    }
    out[lang] = items
  }
  return out
}

export const ITEMS = build()

// maxLevel: só entram itens até esse nível (os níveis destravam conforme você aprende)
export function itemsFor(lang, cat, maxLevel = LEVELS.length) {
  const all = ITEMS[lang].filter((i) => i.level <= maxLevel)
  if (!cat || cat === 'geral' || cat === 'revisao') return all
  return all.filter((i) => i.cat === cat)
}
