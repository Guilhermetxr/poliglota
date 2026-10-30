// Nível 2 (intermediário). Mesmo formato do nível 1 em content.js.
// [categoria, id, português, { en, fr, es, it }]  onde cada idioma é [texto, pronúncia, alternativas?]

export const SHARED_2 = [
  // ── Cumprimentos ──
  ['cumprimentos', 'bemvindo', 'Bem-vindo', {
    en: ["Welcome", "UÉL-kam"], fr: ["Bienvenue", "biẽ-vö-NÜ"], es: ["Bienvenido", "bien-be-NI-do"], it: ["Benvenuto", "ben-ve-NU-to"],
  }],
  ['cumprimentos', 'boatarde', 'Boa tarde', {
    en: ["Good afternoon", "gud ÉF-ter-NUUN"], fr: ["Bon après-midi", "bõ a-prré-mi-DI"], es: ["Buenas tardes", "BUÊ-nas TAR-des"], it: ["Buon pomeriggio", "buon po-me-RÍ-djo"],
  }],
  ['cumprimentos', 'estoubem', 'Estou bem, obrigado', {
    en: ["I'm fine, thank you", "áim FÁIN THÊNK iu", ["I am fine, thank you", "I'm good, thanks"]], fr: ["Je vais bien, merci", "jö vé BIẽ mérr-SI"], es: ["Estoy bien, gracias", "es-TÓI BIÉN GRA-ssias"], it: ["Sto bene, grazie", "sto BÉ-ne GRÁ-tsie"],
  }],
  ['cumprimentos', 'denada', 'De nada', {
    en: ["You're welcome", "iúr UÉL-kam"], fr: ["De rien", "dö RRIẼ"], es: ["De nada", "de NA-da"], it: ["Prego", "PRÉ-go"],
  }],
  ['cumprimentos', 'ondemora', 'Onde você mora?', {
    en: ["Where do you live?", "uér du iu LIV"], fr: ["Où habitez-vous?", "u a-bi-tê-VU", ["Où habites-tu?"]], es: ["¿Dónde vives?", "DÔN-de BI-bes", ["¿Dónde vive?"]], it: ["Dove abiti?", "DÔ-ve Á-bi-ti", ["Dove abita?"]],
  }],
  ['cumprimentos', 'deondee', 'De onde você é?', {
    en: ["Where are you from?", "uér ar iu FRÂM"], fr: ["Tu viens d'où?", "tü VIẼ DU", ["Vous venez d'où?"]], es: ["¿De dónde eres?", "de DÔN-de Ê-res", ["¿De dónde es?"]], it: ["Di dove sei?", "di DÔ-ve SÉI", ["Di dove è?"]],
  }],
  ['cumprimentos', 'brasileiro', 'Eu sou brasileiro', {
    en: ["I'm Brazilian", "áim bra-ZÍL-ian", ["I am Brazilian"]], fr: ["Je suis brésilien", "jö süí brê-zi-LIẼ", ["Je suis brésilienne"]], es: ["Soy brasileño", "sói bra-si-LÊ-nho", ["Soy brasileña"]], it: ["Sono brasiliano", "SÔ-no bra-zi-LIÁ-no", ["Sono brasiliana"]],
  }],

  // ── Coisas de casa ──
  ['casa', 'lavarlouca', 'Eu lavo a louça', {
    en: ["I wash the dishes", "ái UÓSH dhâ DÍ-shiz"], fr: ["Je fais la vaisselle", "jö fé la vé-SSÉL"], es: ["Lavo los platos", "LA-bo los PLA-tos"], it: ["Lavo i piatti", "LÁ-vo i PIÁT-ti"],
  }],
  ['casa', 'luz', 'Acenda a luz', {
    en: ["Turn on the light", "TÉRN ón dhâ LÁIT"], fr: ["Allume la lumière", "a-LÜM la lü-MIÉRR"], es: ["Enciende la luz", "en-SSIÊN-de la LUS"], it: ["Accendi la luce", "at-TCHÉN-di la LU-tche"],
  }],
  ['casa', 'chave', 'Perdi minha chave', {
    en: ["I lost my key", "ái LÓST mái KII"], fr: ["J'ai perdu ma clé", "jé pérr-DÜ ma KLÊ"], es: ["Perdí mi llave", "per-DI mi IA-be"], it: ["Ho perso la chiave", "ó PÉR-so la KIÁ-ve"],
  }],
  ['casa', 'limpar', 'Preciso limpar a casa', {
    en: ["I need to clean the house", "ái NIID tu KLIIN dhâ RÁUS"], fr: ["Je dois nettoyer la maison", "jö DUÁ né-tua-IÊ la mé-ZÕ"], es: ["Tengo que limpiar la casa", "TÊN-go ke lim-PIAR la KA-sa"], it: ["Devo pulire la casa", "DÊ-vo pu-LÍ-re la KÁ-za"],
  }],
  ['casa', 'wifi', 'Qual é a senha do wifi?', {
    en: ["What's the wifi password?", "uóts dhâ UÁI-fai PÉS-uérd"], fr: ["Quel est le mot de passe du wifi?", "kél é lö MÔ dö PAS dü ui-FI"], es: ["¿Cuál es la clave del wifi?", "kuál es la KLA-be del GUI-fi"], it: ["Qual è la password del wifi?", "kual É la PÁS-uord del UI-fi"],
  }],

  // ── Comida e bebida ──
  ['comida', 'cardapio', 'Posso ver o cardápio?', {
    en: ["Can I see the menu?", "kén ái SII dhâ MÉ-niu"], fr: ["Je peux voir le menu?", "jö PÖ vuárr lö mö-NÜ"], es: ["¿Puedo ver el menú?", "PUÊ-do ber el me-NU"], it: ["Posso vedere il menu?", "PÓS-so ve-DÊ-re il me-NU"],
  }],
  ['comida', 'vegetariano', 'Eu sou vegetariano', {
    en: ["I'm vegetarian", "áim vé-dji-TÉ-ri-an", ["I am vegetarian"]], fr: ["Je suis végétarien", "jö süí vê-jê-ta-RIẼ", ["Je suis végétarienne"]], es: ["Soy vegetariano", "sói be-je-ta-RIA-no", ["Soy vegetariana"]], it: ["Sono vegetariano", "SÔ-no ve-dje-ta-RIÁ-no", ["Sono vegetariana"]],
  }],
  ['comida', 'alergia', 'Tenho alergia a amendoim', {
    en: ["I'm allergic to peanuts", "áim a-LÉR-djik tu PII-nâts"], fr: ["Je suis allergique aux cacahuètes", "jö süí a-lérr-JIK ô ka-ka-UÉT"], es: ["Soy alérgico a los cacahuetes", "sói a-LÉR-rri-ko a los ka-ka-UÊ-tes", ["Soy alérgica a los cacahuetes"]], it: ["Sono allergico alle arachidi", "SÔ-no al-LÉR-dji-ko ÁL-le a-RÁ-ki-di", ["Sono allergica alle arachidi"]],
  }],
  ['comida', 'sobremesa', 'Eu quero a sobremesa', {
    en: ["I want dessert", "ái UÓNT di-ZÉRT", ["I want the dessert"]], fr: ["Je veux un dessert", "jö VÖ ẽ dé-SÉRR"], es: ["Quiero postre", "KIÊ-ro PÓS-tre", ["Quiero el postre"]], it: ["Voglio il dolce", "VÓ-lho il DÓL-tche"],
  }],
  ['comida', 'sede', 'Estou com sede', {
    en: ["I'm thirsty", "áim THÉR-sti", ["I am thirsty"]], fr: ["J'ai soif", "jé SUAF"], es: ["Tengo sed", "TÊN-go SÊD"], it: ["Ho sete", "ó SÊ-te"],
  }],
  ['comida', 'picante', 'Esta comida é muito picante', {
    en: ["This food is very spicy", "dhis FUUD iz VÉ-ri SPÁI-si"], fr: ["Ce plat est très épicé", "sö PLA é trré ê-pi-SSÊ"], es: ["Esta comida es muy picante", "ÊS-ta ko-MI-da es MUI pi-KAN-te"], it: ["Questo piatto è molto piccante", "KUÊS-to PIÁT-to É MÓL-to pik-KÁN-te"],
  }],

  // ── Viagem ──
  ['viagem', 'reserva', 'Eu tenho uma reserva', {
    en: ["I have a reservation", "ái RÉV â ré-zer-VÊI-shan"], fr: ["J'ai une réservation", "jé ün rê-zerr-va-SSIÕ"], es: ["Tengo una reserva", "TÊN-go U-na re-SÉR-ba"], it: ["Ho una prenotazione", "ó U-na pre-no-ta-TSIÔ-ne"],
  }],
  ['viagem', 'checkin', 'A que horas é o check-in?', {
    en: ["What time is check-in?", "uót TÁIM iz TCHÉK-in"], fr: ["À quelle heure est l'enregistrement?", "a kél ÖRR é lã-rrö-jis-trö-MÃ"], es: ["¿A qué hora es el check-in?", "a kê Ô-ra es el TCHÉK-in"], it: ["A che ora è il check-in?", "a ke Ô-ra É il TCHÉK-in"],
  }],
  ['viagem', 'taxi', 'Preciso de um táxi', {
    en: ["I need a taxi", "ái NIID â TÉK-si"], fr: ["J'ai besoin d'un taxi", "jé bö-ZUẼ dẽ tak-SI"], es: ["Necesito un taxi", "ne-sse-SSI-to un TÁK-si"], it: ["Mi serve un taxi", "mi SÉR-ve un TÁK-si"],
  }],
  ['viagem', 'pagarcartao', 'Posso pagar com cartão?', {
    en: ["Can I pay by card?", "kén ái PÊI bái KARD", ["Can I pay with a card?"]], fr: ["Je peux payer par carte?", "jö PÖ pê-IÊ parr KART"], es: ["¿Puedo pagar con tarjeta?", "PUÊ-do pa-GAR kon tar-RÊ-ta"], it: ["Posso pagare con la carta?", "PÓS-so pa-GÁ-re kon la KÁR-ta", ["Posso pagare con carta?"]],
  }],
  ['viagem', 'longe', 'Fica longe daqui?', {
    en: ["Is it far from here?", "iz it FAR frâm RÍR"], fr: ["C'est loin d'ici?", "sé LUẼ di-SSI"], es: ["¿Queda lejos de aquí?", "KÊ-da LÊ-rros de a-KI"], it: ["È lontano da qui?", "É lon-TÁ-no da KUI"],
  }],
  ['viagem', 'ajudar', 'Você pode me ajudar?', {
    en: ["Can you help me?", "kén iu RÉLP mi"], fr: ["Pouvez-vous m'aider?", "pu-vê-VU mê-DÊ", ["Tu peux m'aider?"]], es: ["¿Puede ayudarme?", "PUÊ-de a-iu-DAR-me", ["¿Puedes ayudarme?"]], it: ["Può aiutarmi?", "pu-Ó a-iu-TÁR-mi", ["Puoi aiutarmi?"]],
  }],
  ['viagem', 'policia', 'Chame a polícia', {
    en: ["Call the police", "KÓL dhâ pó-LIIS"], fr: ["Appelez la police", "a-pö-LÊ la po-LIS"], es: ["Llame a la policía", "IÁ-me a la po-li-SSI-a", ["Llama a la policía"]], it: ["Chiami la polizia", "KIÁ-mi la po-li-TSI-a", ["Chiama la polizia"]],
  }],
  ['viagem', 'mala', 'Perdi minha mala', {
    en: ["I lost my luggage", "ái LÓST mái LÂ-guidj", ["I lost my bag", "I lost my suitcase"]], fr: ["J'ai perdu ma valise", "jé pérr-DÜ ma va-LIZ"], es: ["Perdí mi maleta", "per-DI mi ma-LÊ-ta"], it: ["Ho perso la valigia", "ó PÉR-so la va-LÍ-dja"],
  }],

  // ── Números e tempo ──
  ['tempo', 'vinte', 'Vinte (20)', {
    en: ["Twenty", "TUÉN-ti"], fr: ["Vingt", "VẼ"], es: ["Veinte", "BÊIN-te"], it: ["Venti", "VÊN-ti"],
  }],
  ['tempo', 'cem', 'Cem (100)', {
    en: ["One hundred", "UÂN RÂN-dred", ["A hundred"]], fr: ["Cent", "SÃ"], es: ["Cien", "SSIÉN"], it: ["Cento", "TCHÉN-to"],
  }],
  ['tempo', 'semana', 'Esta semana', {
    en: ["This week", "DHIS UIIK"], fr: ["Cette semaine", "sét sö-MÉN"], es: ["Esta semana", "ÊS-ta se-MA-na"], it: ["Questa settimana", "KUÊS-ta set-ti-MÁ-na"],
  }],
  ['tempo', 'cedo', 'Ainda é cedo', {
    en: ["It's early", "its ÉR-li", ["It is early"]], fr: ["Il est tôt", "il é TÔ"], es: ["Es temprano", "es tem-PRA-no"], it: ["È presto", "É PRÉS-to"],
  }],
  ['tempo', 'atrasado', 'Estou atrasado', {
    en: ["I'm late", "áim LÊIT", ["I am late"]], fr: ["Je suis en retard", "jö süí ã rrö-TARR"], es: ["Llego tarde", "IÊ-go TAR-de", ["Voy tarde"]], it: ["Sono in ritardo", "SÔ-no in ri-TÁR-do"],
  }],
  ['tempo', 'janeiro', 'Em janeiro', {
    en: ["In January", "in DJÉ-niu-é-ri"], fr: ["En janvier", "ã jã-VIÊ"], es: ["En enero", "en e-NÊ-ro"], it: ["A gennaio", "a djen-NÁ-io", ["In gennaio"]],
  }],
  ['tempo', 'meiodia', 'Ao meio-dia', {
    en: ["At noon", "ét NUUN"], fr: ["À midi", "a mi-DI"], es: ["Al mediodía", "al me-dio-DI-a"], it: ["A mezzogiorno", "a med-dzo-DJÔR-no"],
  }],

  // ── Família e pessoas ──
  ['familia', 'casado', 'Eu sou casado', {
    en: ["I'm married", "áim MÉ-rid", ["I am married"]], fr: ["Je suis marié", "jö süí ma-RIÊ", ["Je suis mariée"]], es: ["Estoy casado", "es-TÓI ka-SA-do", ["Estoy casada"]], it: ["Sono sposato", "SÔ-no spo-ZÁ-to", ["Sono sposata"]],
  }],
  ['familia', 'filhos', 'Tenho dois filhos', {
    en: ["I have two kids", "ái RÉV tuu KIDZ", ["I have two children"]], fr: ["J'ai deux enfants", "jé DÖ zã-FÃ"], es: ["Tengo dos hijos", "TÊN-go dos Í-rros"], it: ["Ho due figli", "ó DU-e FÍ-lhi"],
  }],
  ['familia', 'idade', 'Quantos anos você tem?', {
    en: ["How old are you?", "ráu ÔULD ar IU"], fr: ["Tu as quel âge?", "tü a kél AJ", ["Quel âge as-tu?"]], es: ["¿Cuántos años tienes?", "KUÁN-tos A-nhos TIÊ-nes", ["¿Cuántos años tiene?"]], it: ["Quanti anni hai?", "KUÁN-ti ÁN-ni ÁI", ["Quanti anni ha?"]],
  }],
  ['familia', 'avo', 'Minha avó', {
    en: ["My grandmother", "mái GRÉN-mâ-dher", ["My grandma"]], fr: ["Ma grand-mère", "ma grrã-MÉRR"], es: ["Mi abuela", "mi a-BUÊ-la"], it: ["Mia nonna", "MÍ-a NÔN-na", ["La mia nonna"]],
  }],
  ['familia', 'vizinho', 'Meu vizinho é simpático', {
    en: ["My neighbor is nice", "mái NÊI-bor iz NÁIS", ["My neighbour is nice"]], fr: ["Mon voisin est sympa", "mõ vuá-ZẼ é sẽ-PA", ["Mon voisin est sympathique"]], es: ["Mi vecino es simpático", "mi be-SSI-no es sim-PA-ti-ko"], it: ["Il mio vicino è simpatico", "il MÍ-o vi-TCHI-no É sim-PÁ-ti-ko"],
  }],

  // ── Dia a dia ──
  ['diadia', 'concordo', 'Eu concordo', {
    en: ["I agree", "ái a-GRII"], fr: ["Je suis d'accord", "jö süí da-KÓRR"], es: ["Estoy de acuerdo", "es-TÓI de a-KUÉR-do"], it: ["Sono d'accordo", "SÔ-no dak-KÓR-do"],
  }],
  ['diadia', 'gostomusica', 'Eu gosto de música', {
    en: ["I like music", "ái LÁIK MIÚ-zik"], fr: ["J'aime la musique", "jém la mü-ZIK"], es: ["Me gusta la música", "me GUS-ta la MU-si-ka"], it: ["Mi piace la musica", "mi PIÁ-tche la MU-zi-ka"],
  }],
  ['diadia', 'trabalhocasa', 'Eu trabalho em casa', {
    en: ["I work from home", "ái UÉRK frâm RÔUM", ["I work at home"]], fr: ["Je travaille à la maison", "jö tra-VAI a la mé-ZÕ"], es: ["Trabajo desde casa", "tra-BA-rro DES-de KA-sa", ["Trabajo en casa"]], it: ["Lavoro da casa", "la-VÔ-ro da KÁ-za", ["Lavoro a casa"]],
  }],
  ['diadia', 'chovendo', 'Está chovendo', {
    en: ["It's raining", "its RÊI-nin", ["It is raining"]], fr: ["Il pleut", "il PLÖ"], es: ["Está lloviendo", "es-TÁ io-BIÊN-do", ["Llueve"]], it: ["Sta piovendo", "sta pio-VÉN-do", ["Piove"]],
  }],
  ['diadia', 'calor', 'Está muito calor', {
    en: ["It's very hot", "its VÉ-ri RÓT", ["It is very hot"]], fr: ["Il fait très chaud", "il FÉ trré SHÔ"], es: ["Hace mucho calor", "A-sse MU-tcho ka-LÔR"], it: ["Fa molto caldo", "fa MÓL-to KÁL-do"],
  }],
  ['diadia', 'talvez', 'Talvez', {
    en: ["Maybe", "MÊI-bi", ["Perhaps"]], fr: ["Peut-être", "pö-TÉ-trrö"], es: ["Quizás", "ki-SSAS", ["Tal vez", "Quizá"]], it: ["Forse", "FÓR-se"],
  }],
  ['diadia', 'entendi', 'Entendi', {
    en: ["I got it", "ái GÓT it", ["I understand", "Got it"]], fr: ["J'ai compris", "jé kõ-PRRI"], es: ["Entendido", "en-ten-DI-do", ["Entiendo", "Lo entiendo"]], it: ["Ho capito", "ó ka-PI-to", ["Capisco"]],
  }],

  // ── Trabalho ──
  ['trabalho', 'reuniao', 'Eu tenho uma reunião', {
    en: ["I have a meeting", "ái RÉV â MII-tin"], fr: ["J'ai une réunion", "jé ün rrê-ü-NIÕ"], es: ["Tengo una reunión", "TÊN-go U-na rre-u-NIÔN"], it: ["Ho una riunione", "ó U-na riu-NIÔ-ne"],
  }],
  ['trabalho', 'escritorio', 'Meu escritório', {
    en: ["My office", "mái Ó-fis"], fr: ["Mon bureau", "mõ bü-RRÔ"], es: ["Mi oficina", "mi o-fi-SSI-na", ["Mi despacho"]], it: ["Il mio ufficio", "il MÍ-o uf-FÍ-tcho", ["Mio ufficio"]],
  }],
  ['trabalho', 'email', 'Vou te mandar um e-mail', {
    en: ["I'll send you an email", "áil SÉND iu ân Í-mêil", ["I will send you an email"]], fr: ["Je vais t'envoyer un mail", "jö vé tã-vuá-IÊ ẽ MÉL", ["Je vais t'envoyer un e-mail"]], es: ["Te mando un correo", "te MAN-do un ko-RRÊ-o", ["Te envío un correo"]], it: ["Ti mando una mail", "ti MÁN-do U-na MÊIL", ["Ti mando una email"]],
  }],
  ['trabalho', 'prazo', 'Qual é o prazo?', {
    en: ["What's the deadline?", "uóts dhâ DÉD-láin"], fr: ["Quelle est la date limite?", "kél é la DAT li-MIT"], es: ["¿Cuál es el plazo?", "kuál es el PLA-sso", ["¿Cuál es la fecha límite?"]], it: ["Qual è la scadenza?", "kual É la ska-DÉN-tsa"],
  }],
  ['trabalho', 'chefe', 'Meu chefe', {
    en: ["My boss", "mái BÓS"], fr: ["Mon patron", "mõ pa-TRÕ", ["Mon chef"]], es: ["Mi jefe", "mi RRÊ-fe"], it: ["Il mio capo", "il MÍ-o KÁ-po", ["Il mio capo"]],
  }],
  ['trabalho', 'ferias', 'Estou de férias', {
    en: ["I'm on vacation", "áim ón vei-KÊI-shan", ["I am on vacation", "I'm on holiday"]], fr: ["Je suis en vacances", "jö süí ã va-KÃS"], es: ["Estoy de vacaciones", "es-TÓI de ba-ka-SSIÔ-nes"], it: ["Sono in vacanza", "SÔ-no in va-KÁN-tsa", ["Sono in ferie"]],
  }],

  // ── Saúde ──
  ['saude', 'medico', 'Preciso de um médico', {
    en: ["I need a doctor", "ái NIID â DÓK-ter"], fr: ["J'ai besoin d'un médecin", "jé bö-ZUẼ dẽ mêd-SẼ"], es: ["Necesito un médico", "ne-sse-SSI-to un ME-di-ko"], it: ["Ho bisogno di un medico", "ó bi-ZÔ-nho di un MÉ-di-ko"],
  }],
  ['saude', 'dorcabeca', 'Estou com dor de cabeça', {
    en: ["I have a headache", "ái RÉV â RÉD-êik"], fr: ["J'ai mal à la tête", "jé MAL a la TÉT"], es: ["Me duele la cabeza", "me DUÊ-le la ka-BÊ-ssa", ["Tengo dolor de cabeza"]], it: ["Ho mal di testa", "ó MAL di TÉS-ta"],
  }],
  ['saude', 'doente', 'Estou doente', {
    en: ["I'm sick", "áim SIK", ["I am sick", "I'm ill"]], fr: ["Je suis malade", "jö süí ma-LAD"], es: ["Estoy enfermo", "es-TÓI en-FÉR-mo", ["Estoy enferma"]], it: ["Sono malato", "SÔ-no ma-LÁ-to", ["Sono malata"]],
  }],
  ['saude', 'farmacia', 'Onde tem uma farmácia?', {
    en: ["Where is a pharmacy?", "uér iz â FÁR-ma-si", ["Where is there a pharmacy?"]], fr: ["Où est la pharmacie?", "u é la far-ma-SSI"], es: ["¿Dónde hay una farmacia?", "DÔN-de ÁI U-na far-MA-ssia"], it: ["Dov'è una farmacia?", "do-VÉ U-na far-ma-TCHI-a"],
  }],

  // ── Sentimentos ──
  ['sentimentos', 'feliz', 'Estou feliz', {
    en: ["I'm happy", "áim RÉ-pi", ["I am happy"]], fr: ["Je suis content", "jö süí kõ-TÃ", ["Je suis heureux"]], es: ["Estoy feliz", "es-TÓI fe-LIS", ["Estoy contento"]], it: ["Sono felice", "SÔ-no fe-LI-tche", ["Sono contento"]],
  }],
  ['sentimentos', 'triste', 'Estou triste', {
    en: ["I'm sad", "áim SÉD", ["I am sad"]], fr: ["Je suis triste", "jö süí TRRIST"], es: ["Estoy triste", "es-TÓI TRIS-te"], it: ["Sono triste", "SÔ-no TRÍS-te"],
  }],
  ['sentimentos', 'saudade', 'Eu sinto sua falta', {
    en: ["I miss you", "ái MIS iu"], fr: ["Tu me manques", "tü mö MÃK"], es: ["Te extraño", "te eks-TRA-nho", ["Te echo de menos"]], it: ["Mi manchi", "mi MÁN-ki"],
  }],
  ['sentimentos', 'nervoso', 'Estou nervoso', {
    en: ["I'm nervous", "áim NÉR-vâs", ["I am nervous"]], fr: ["Je suis nerveux", "jö süí nérr-VÖ", ["Je suis stressé"]], es: ["Estoy nervioso", "es-TÓI ner-BIÔ-so", ["Estoy nerviosa"]], it: ["Sono nervoso", "SÔ-no ner-VÔ-zo", ["Sono nervosa"]],
  }],
  ['sentimentos', 'orgulho', 'Tenho orgulho de você', {
    en: ["I'm proud of you", "áim PRÁUD óv iu", ["I am proud of you"]], fr: ["Je suis fier de toi", "jö süí FIÉRR dö TUÁ"], es: ["Estoy orgulloso de ti", "es-TÓI or-gu-IÔ-so de TI", ["Estoy orgullosa de ti"]], it: ["Sono fiero di te", "SÔ-no FIÉ-ro di TÊ", ["Sono orgoglioso di te"]],
  }],
]

// [id, texto, pronúncia, significado, explicação]
export const SLANG_2 = {
  en: [
    ['nobrainer', "It's a no-brainer", "its â nô-BRÊI-ner", 'É óbvio', 'Decisão tão fácil que nem precisa pensar.'],
    ['hitup', 'Hit me up', 'RIT mi ÂP', 'Me chama depois', 'Manda mensagem ou liga quando quiser.'],
    ['bummed', "I'm bummed", 'áim BÂMD', 'Tô chateado', 'Triste ou decepcionado, nada grave.'],
    ['nailedit', 'You nailed it', 'iu NÊILD it', 'Mandou bem demais', 'Literalmente "pregou": acertou em cheio.'],
  ],
  fr: [
    ['bof', 'Bof', 'BÓF', 'Mais ou menos / sei lá', 'Falta de empolgação, sempre com cara de desânimo.'],
    ['chelou', "C'est chelou", 'sé shö-LU', 'É estranho', 'Verlan de "louche" (suspeito).'],
    ['fautpas', 'Faut pas exagérer', 'FÔ pa eg-za-jê-RÊ', 'Também não é pra tanto', 'Pra baixar a bola de alguém.'],
    ['camarche', 'Ça marche', 'sa MARSH', 'Fechado / Combinado', 'Concordar com um plano.'],
  ],
  es: [
    ['pasada', 'Qué pasada', 'kê pa-SA-da', 'Que loucura! (de bom)', 'Espanha: algo incrível.'],
    ['hastanarices', 'Estoy hasta las narices', 'es-TÓI AS-ta las na-RI-sses', 'Tô de saco cheio', 'Literalmente "até o nariz".'],
    ['chaval', 'Ese chaval es majo', 'ê-se tcha-BAL es MA-rro', 'Esse cara é gente boa', 'Chaval é garoto/cara na Espanha, majo é simpático.'],
    ['echarmano', 'Échame una mano', 'Ê-tcha-me U-na MA-no', 'Me dá uma mão', 'Pedir ajuda, o mesmo sentido do português.'],
  ],
  it: [
    ['macche', 'Macché!', 'mak-KÊ', 'Imagina! / De jeito nenhum!', 'Negação enfática.'],
    ['menomale', 'Meno male', 'MÊ-no MÁ-le', 'Ainda bem', 'Alívio.'],
    ['pazzesco', 'È pazzesco', 'É pat-TSÊS-ko', 'É de loucura', 'Pode ser bom ou ruim, depende do tom.'],
    ['abbiocco', 'Che abbiocco', 'ke ab-BIÓK-ko', 'Que moleza (pós almoço)', 'Sonolência depois de comer muito.'],
  ],
}
