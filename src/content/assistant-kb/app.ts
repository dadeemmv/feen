import type { AssistantKbEntry } from '../extra-types';

/** Questions about Finanz itself, plus small talk (low priority: topics always win). */
export const APP_KB: AssistantKbEntry[] = [
  {
    id: 'finanz-pro',
    topic: 'Finanz Pro',
    keywords: ['finanz pro', 'abbonament', 'premium', 'vite illimitate'],
    answer:
      'Finanz Pro ti dà vite illimitate, spiegazioni AI senza limiti e nessuna pubblicità. 💎 Puoi anche ottenerlo gratis per 30 giorni invitando 3 amici con il tuo codice. In questa versione demo l’attivazione è simulata: non viene addebitato nulla.',
  },
  {
    id: 'app-economy',
    topic: 'Vite, Kiwi e streak',
    keywords: [
      'vite',
      'vita ',
      'cuori',
      'kiwi',
      'monete',
      'streak',
      'giorni di fila',
      'scud',
      'shop',
    ],
    answer:
      'Ecco come funziona Finanz: 🥝\n• Vite: ne hai 3 e ne perdi una quando sbagli, poi si ricaricano col tempo\n• Kiwi: la moneta dell’app, li guadagni studiando e li spendi nello Shop\n• Streak: i giorni di fila in cui completi almeno una lezione\n• Scudi: proteggono la streak se salti un giorno\nCon Finanz Pro le vite sono illimitate.',
  },
  {
    id: 'about-assistant',
    topic: 'Chi è l’assistente',
    priority: -1,
    keywords: ['chi sei', 'cosa sei', 'cosa sai fare', 'cosa puoi fare', 'assistente', 'finanz '],
    answer:
      'Sono l’assistente di Finanz 🦊: ti aiuto a capire risparmio, investimenti e i concetti del percorso. Rispondo con una base di conoscenze curata e funziono anche offline. Le mie risposte hanno scopo educativo: non sono consulenza finanziaria personalizzata. Prova a chiedermi, per esempio, cos’è un ETF o come funziona l’interesse composto.',
  },
  {
    id: 'greeting',
    topic: 'Saluto',
    priority: -1,
    keywords: ['ciao', 'salve', 'buongiorno', 'buonasera', 'hey ', 'ehi '],
    answer:
      'Ciao! 👋 Che cosa ti piacerebbe capire oggi? Posso spiegarti inflazione, interesse composto, ETF, obbligazioni, tasse e molto altro.',
  },
  {
    id: 'thanks',
    topic: 'Ringraziamento',
    priority: -1,
    keywords: ['grazie', 'perfetto', 'gentilissim', 'ottimo '],
    answer:
      'Figurati, è un piacere! 💚 Se ti viene in mente un altro dubbio, chiedi pure. E ricordati di completare la lezione di oggi per non perdere la streak 🔥',
  },
];
