/**
 * Italian copy of the Account feature (menu labels follow the reference video, spec §3.8).
 */
export const ACCOUNT_COPY = {
  title: 'Account',
  profileHint: 'Modifica nome e avatar',
  levelLabel: (level: number, title: string) => `Livello ${level} · ${title}`,
  levelXp: (current: number, next: number) => `${current}/${next} XP`,
  levelMax: (totalXp: string) => `${totalXp} · livello massimo`,
  stats: {
    streak: 'Giorni di fila',
    lessons: 'Lezioni completate',
    coins: 'Kiwi',
  },
  referral: {
    friendsProgress: (count: number, total: number) => `${count}/${total} amici invitati`,
  },
  menuTitle: 'Menu',
  otherTitle: 'Altro',
  proActive: 'Attivo',
  logout: 'Logout',
  logoutDialog: {
    title: 'Vuoi uscire?',
    message: 'Progressi, Kiwi e impostazioni salvati su questo dispositivo verranno cancellati.',
    confirm: 'Esci e cancella',
    cancel: 'Annulla',
  },
  version: (version: string) => `Finanz ${version} · versione demo`,
  madeIn: 'Fatto con 💚 in Italia',
} as const;

export const MENU_COPY = {
  settings: { title: 'Impostazioni', subtitle: 'Modifica le impostazioni' },
  mascot: { title: 'Il tuo personaggio', subtitle: 'La tua bussola dei soldi' },
  language: { title: 'Lingua e Paese', subtitle: 'Cambia lingua e Paese del tuo account' },
  purchases: { title: 'I tuoi acquisti', subtitle: 'Visualizza i tuoi acquisti' },
  pro: { title: 'Finanz PRO', subtitle: 'Dettagli abbonamento' },
  invite: { title: 'Invita un amico', subtitle: 'Genera codice' },
  interests: { title: 'I tuoi interessi', subtitle: 'Cambia i tuoi interessi' },
  redeem: { title: 'Utilizza codice', subtitle: 'Inserisci il codice' },
  rate: { title: 'Valuta app', subtitle: 'Che voto ci daresti?' },
  support: { title: 'Supporto', subtitle: 'Hai bisogno di aiuto?' },
  legal: { title: 'Informazioni legali', subtitle: 'Termini, condizioni e privacy' },
} as const;

export const SETTINGS_COPY = {
  subtitle: 'Personalizza la tua esperienza su Finanz.',
  general: 'Generale',
  haptics: { title: 'Vibrazione', subtitle: 'Feedback tattile a ogni tocco' },
  sound: { title: 'Suoni', subtitle: 'Effetti sonori nelle lezioni' },
  reduceMotion: { title: 'Riduci animazioni', subtitle: 'Transizioni più semplici' },
  reminders: 'Promemoria',
  notifications: { title: 'Notifiche promemoria', subtitle: 'Non perdere la tua serie' },
  reminderTime: 'Quando vuoi il promemoria?',
  demoNote: 'Versione demo: i promemoria vengono salvati ma non inviano notifiche reali.',
  saved: 'Impostazione salvata',
} as const;

export const REMINDER_SLOTS = [
  { id: 'morning', label: 'Mattina', time: '9:00' },
  { id: 'afternoon', label: 'Pomeriggio', time: '14:00' },
  { id: 'evening', label: 'Sera', time: '20:30' },
] as const;

export const LANGUAGE_COPY = {
  subtitle: 'Scegli la lingua dell’app e il Paese del tuo account.',
  language: 'Lingua',
  country: 'Paese',
  italian: { label: 'Italiano', description: 'Lingua attuale' },
  english: { label: 'English', description: 'Presto disponibile' },
  soon: 'Presto',
  italy: { label: 'Italia', description: 'Prezzi in euro e fisco italiano' },
  countryNote: 'Lezioni, esempi e tasse sono pensati per chi vive in Italia. Altri Paesi arriveranno in futuro.',
} as const;

export const PURCHASES_COPY = {
  subtitle: 'Tutto quello che hai sbloccato con i tuoi Kiwi.',
  total: 'Kiwi spesi in totale',
  countLabel: 'Acquisti',
  free: 'Gratis',
  priceLabel: (price: string) => `${price} Kiwi`,
  emptyTitle: 'Nessun acquisto ancora',
  emptyMessage: 'Scudi, vite extra e vite illimitate che compri nello Shop compariranno qui.',
  emptyCta: 'Vai allo Shop',
} as const;

export const INTERESTS_COPY = {
  subtitle: 'Scegli gli argomenti che ti stanno a cuore: li useremo per consigliarti nuovi percorsi.',
  selected: (n: number) => (n === 1 ? '1 argomento selezionato' : `${n} argomenti selezionati`),
  minHint: 'Scegline almeno uno',
  save: 'Salva interessi',
  saved: 'Interessi salvati',
} as const;

export const SUPPORT_COPY = {
  subtitle: 'Le risposte alle domande più frequenti. Se non trovi quello che cerchi, scrivici.',
  faqTitle: 'Domande frequenti',
  contactTitle: 'Serve ancora aiuto?',
  contactMessage: 'Il nostro team risponde entro 24 ore, dal lunedì al venerdì.',
  write: 'Scrivici',
  email: 'supporto@finanz.app',
  mailSubject: 'Richiesta di supporto Finanz',
  mailFallback: 'Indirizzo email copiato negli appunti',
} as const;

export const LEGAL_COPY = {
  subtitle: 'Termini di servizio, privacy e cookie.',
  sampleTag: 'Testo di esempio',
  sampleNote: 'Versione demo: questi testi sono segnaposto e non hanno valore legale.',
  updated: 'Ultimo aggiornamento: 30 settembre 2026',
} as const;

export const PROFILE_COPY = {
  title: 'Il tuo profilo',
  subtitle: 'Scegli come ti vedono gli altri in Finanz.',
  name: 'Nome',
  namePlaceholder: 'Il tuo nome',
  email: 'Email',
  emailHelper: 'L’email non si può modificare nella versione demo.',
  avatar: 'Avatar',
  save: 'Salva modifiche',
  saved: 'Profilo aggiornato',
} as const;

export const REDEEM_COPY = {
  title: 'Utilizza codice',
  message: 'Hai un codice promozionale? Inseriscilo qui per ricevere subito il tuo premio.',
  label: 'Codice',
  placeholder: 'ES. FINANZ100',
  demoHint: 'Versione demo: prova FINANZ100 o STREAK',
  cta: 'Riscatta',
  invalid: 'Codice non valido',
  alreadyUsed: 'Hai già usato questo codice',
  done: 'Fantastico!',
} as const;

export const RATE_COPY = {
  title: 'Valuta app',
  question: 'Che voto ci daresti?',
  hint: 'Tocca una stella per votare',
  labels: ['Pessima', 'Così così', 'Carina', 'Molto bella', 'Fantastica!'] as const,
  starLabel: (n: number) => (n === 1 ? '1 stella' : `${n} stelle`),
  thanksTitle: 'Grazie! 💚',
  thanksMessage: 'Una recensione sullo store aiuta tantissimo altre persone a scoprire Finanz.',
  review: 'Lascia una recensione',
  reviewToast: 'Grazie per il tuo supporto!',
  later: 'Magari più tardi',
  feedbackTitle: 'Cosa possiamo migliorare?',
  feedbackPlaceholder: 'Raccontaci cosa non ti è piaciuto…',
  send: 'Invia',
  sentTitle: 'Feedback ricevuto',
  sentMessage: 'Grazie per la sincerità: leggiamo ogni messaggio.',
  close: 'Chiudi',
} as const;
