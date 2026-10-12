import type { Lesson } from '../types';

/**
 * Il Faro · Le truffe online. The Fox's first site: her superpower (seeing opportunities first)
 * covers her blind spot (FOMO and hype). Draft written for 14–19 year olds: to be reviewed with
 * the same fact-check as the other lessons before release.
 */
export const truffeLesson: Lesson = {
  id: 'truffe',
  steps: [
    {
      id: 'truffe-pacco',
      type: 'choice',
      tag: 'indovina',
      emoji: '📦',
      prompt:
        'Ti arriva un SMS: «Il tuo pacco è fermo in deposito. Paga 1,99€ di spedizione qui» e un link. Non aspetti nessun pacco. Cosa fai?',
      options: [
        { id: 'pay', label: 'Pago, sono solo 1,99€' },
        { id: 'look', label: 'Apro il link per capire di che pacco si tratta' },
        { id: 'delete', label: 'Non apro il link e cancello il messaggio' },
      ],
      correctOptionId: 'delete',
      explanation:
        'È una truffa: i 1,99€ sono l’esca, il vero obiettivo sono i dati della tua carta, che inseriresti su un sito falso. Un corriere vero non ti chiede di pagare con un link in un SMS. Se hai un dubbio, controlla dall’app o dal sito ufficiale, scrivendo tu l’indirizzo.',
    },
    {
      id: 'truffe-faro',
      type: 'definition',
      emoji: '🚨',
      title: 'Il Faro',
      lead: 'Avvisa degli scogli prima che tu li veda.',
      term: 'Phishing',
      definition:
        'Un messaggio che finge di arrivare da qualcuno di cui ti fidi (la banca, un corriere, un social, un amico) per farti aprire un link, darti un codice o mandare soldi. Se arriva via SMS si chiama anche smishing.',
      explanation:
        'Il nome viene da «fishing», pescare: chi truffa lancia l’amo a migliaia di persone e aspetta che qualcuno abbocchi.',
    },
    {
      id: 'truffe-segnali',
      type: 'info',
      emoji: '🔦',
      title: 'I tre segnali',
      lead: 'Quasi ogni truffa ne ha almeno uno.',
      rows: [
        { text: 'Fretta: «entro un’ora», «ultimi posti», «il tuo account verrà bloccato».', tone: 'blush' },
        { text: 'Troppo bello: guadagni sicuri, premi che non hai chiesto, regali da uno sconosciuto.', tone: 'butter' },
        { text: 'Una richiesta strana: un codice, una password, un pagamento con un link o una ricarica.', tone: 'sky' },
      ],
      explanation:
        'La fretta serve a non farti pensare. Quando un messaggio ti mette fretta, è proprio il momento di fermarti.',
    },
    {
      id: 'truffe-amico',
      type: 'true-false',
      tag: 'mettiti-alla-prova',
      statement: 'Se un messaggio arriva dal profilo di un amico, puoi fidarti anche quando ti chiede soldi o un codice.',
      answer: false,
      explanation:
        'Gli account si possono rubare e i profili si possono copiare. Se un amico ti chiede all’improvviso soldi o un codice, chiamalo o chiediglielo di persona prima di fare qualsiasi cosa.',
    },
    {
      id: 'truffe-garantito',
      type: 'choice',
      tag: 'mettiti-alla-prova',
      emoji: '📈',
      prompt: 'Un influencer promette: «Metti 100€ nella mia app e in un mese diventano 1.000€, garantito». Qual è il problema?',
      options: [
        { id: 'none', label: 'Nessuno, se lo dice lui funziona' },
        { id: 'guarantee', label: 'Nessun investimento vero può garantire guadagni così' },
        { id: 'small', label: '100€ sono pochi per iniziare' },
      ],
      correctOptionId: 'guarantee',
      explanation:
        'Guadagni alti e garantiti non esistono: più il guadagno promesso è alto, più è alto il rischio, oppure è una truffa. Spesso è uno schema Ponzi: i soldi di chi arriva dopo pagano chi è arrivato prima, finché tutto crolla. In Italia la Consob avvisa e fa oscurare i siti di investimento abusivi.',
    },
    {
      id: 'truffe-ordine',
      type: 'order',
      tag: 'ripasso',
      prompt: 'Metti in ordine: un messaggio ti mette fretta',
      items: [
        { id: 'stop', label: 'Fermati: la fretta è il primo segnale' },
        { id: 'noclick', label: 'Non aprire il link del messaggio' },
        { id: 'check', label: 'Controlla dall’app ufficiale o scrivendo tu l’indirizzo del sito' },
        { id: 'report', label: 'Se era una truffa, segnala il messaggio e cancellalo' },
      ],
      explanation:
        'Prima ti fermi, poi non tocchi il link, poi controlli da una strada che scegli tu. Se era una truffa la segnali, così il Faro avvisa anche gli altri.',
    },
    {
      id: 'truffe-codice',
      type: 'fill',
      tag: 'ripasso',
      prompt: 'Completa la frase',
      sentence: 'Chi ti chiede il codice che ti è arrivato via SMS «per verificare il tuo account» vuole ___.',
      options: [
        { id: 'steal', label: 'entrare al posto tuo' },
        { id: 'protect', label: 'proteggerti' },
        { id: 'gift', label: 'mandarti un premio' },
      ],
      correctOptionId: 'steal',
      explanation:
        'I codici che ricevi servono solo a te, per entrare o per confermare un pagamento. Banche e app non te li chiedono mai: chi li chiede vuole usarli al posto tuo.',
    },
    {
      id: 'truffe-24-ore',
      type: 'info',
      emoji: '⏳',
      title: 'La regola delle 24 ore',
      lead: 'Prima di inseguire un’occasione, aspetta un giorno.',
      rows: [
        { text: 'Un’occasione vera c’è anche domani.', tone: 'mint' },
        { text: 'Una truffa invece ha fretta: aspettare la smonta.', tone: 'blush' },
        { text: 'Nel dubbio, chiedi a qualcuno di cui ti fidi.', tone: 'sky' },
      ],
      explanation:
        'Le truffe funzionano perché decidiamo d’impulso. Un giorno di pausa basta a far sparire la fretta, e con lei quasi tutte le trappole.',
    },
  ],
};
