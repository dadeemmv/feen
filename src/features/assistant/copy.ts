/**
 * Italian copy of the assistant feature. Greeting, prompts and knowledge base live in
 * `@/content/assistant`; this file holds the chat chrome and the engine's own phrasing.
 */
export const copy = {
  /** Input placeholder (video copy, three dots as typed in the app). */
  inputPlaceholder: 'Chiedi qualcosa...',
  inputLabel: 'Scrivi una domanda al Coach',
  send: 'Invia',
  sendHint: 'Invia la domanda al Coach',
  disclaimer: 'Le risposte hanno scopo educativo, non sono consulenza finanziaria.',

  menu: 'Le tue chat',
  menuHint: 'Apre lo storico delle conversazioni',
  newChat: 'Nuova chat',
  newChatHint: 'Inizia una conversazione da zero',

  assistantName: 'Coach Finanz',
  typing: 'Il Coach sta scrivendo',
  suggestionsLabel: 'Domande suggerite',
  suggestionsTitle: 'Prova a chiedermi',
  suggestionHint: 'Invia questa domanda',
  copyHint: 'Tieni premuto per copiare il messaggio',
  copied: 'Messaggio copiato',
  skipTypingHint: 'Tocca per mostrare subito tutta la risposta',

  reviewChapter: (title: string) => `Ripassa: ${title}`,
  reviewChapterHint: 'Apre il percorso con questo capitolo',
  openCourse: 'Apri il percorso',

  errorReply: 'Ops, non sono riuscito a rispondere. Controlla la connessione e riprova.',
  retry: 'Riprova',

  // Conversations sheet
  sheetTitle: 'Le tue chat',
  sheetNewChat: 'Nuova chat',
  groupToday: 'Oggi',
  groupYesterday: 'Ieri',
  groupWeek: 'Ultimi 7 giorni',
  groupOlder: 'Meno recenti',
  activeTag: 'Aperta',
  deleteChat: 'Elimina chat',
  deleteChatHint: 'Tocca di nuovo per confermare',
  confirmDelete: 'Elimina',
  confirmDeleteLabel: (title: string) => `Conferma: elimina “${title}”`,
  deletedToast: 'Chat eliminata',
  openChatHint: 'Apre la conversazione',
  loadingChats: 'Caricamento delle chat',
  historyCount: (n: number) => (n === 1 ? '1 chat salvata' : `${n} chat salvate`),
  emptyTitle: 'Ancora nessuna chat',
  emptyMessage: 'Fai una domanda al Coach: le conversazioni restano salvate qui, anche offline.',
  emptyAction: 'Inizia a chiedere',
  messagesCount: (n: number) => (n === 1 ? '1 messaggio' : `${n} messaggi`),
  untitled: 'Nuova conversazione',

  // Engine phrasing
  fallbackLead:
    'Bella domanda! 🤔 Su questo non ho ancora una risposta affidabile. Prova a riformulare, oppure parti da uno di questi temi:',
  fallbackTryLabel: 'Prova a chiedermi:',
  /** Lesson follow-up ("fammi un esempio"): the topic card instead of the same explanation. */
  elaborateLead: 'Proviamo da un’altra angolazione 👇',
} as const;
