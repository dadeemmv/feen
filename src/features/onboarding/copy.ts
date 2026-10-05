/**
 * Italian copy of the first-run flow (spec §5: welcome → nome → test di personalità → obiettivo →
 * livello → ritmo → tutto pronto). The test's own copy lives in `@/features/mascots/copy`.
 */
export const ONBOARDING_COPY = {
  back: 'Indietro',
  next: 'Continua',
  stepOf: (step: number, total: number) => `${step}/${total}`,
  stepLabel: (step: number, total: number) => `Passo ${step} di ${total}`,

  welcome: {
    headlineStart: 'La finanza, finalmente ',
    headlineAccent: 'semplice.',
    subtitle: 'Lezioni da 5 minuti, quiz e sfide per imparare a risparmiare e investire.',
    perks: ['5 min al giorno', 'Quiz e sfide', 'Premi in Kiwi'] as const,
    start: 'Inizia',
    returning: 'Ho già un account',
    artLabel: 'Un libro aperto illuminato, con monete e scintille',
  },

  name: {
    title: 'Come ti chiami?',
    subtitle: 'Useremo il tuo nome per rendere il percorso più tuo.',
    label: 'Il tuo nome',
    placeholder: 'Es. Giulia',
    greeting: (name: string) => `Piacere di conoscerti, ${name}! 👋`,
    privacy: 'Resta sul tuo dispositivo: non lo condividiamo con nessuno.',
  },

  interests: {
    title: 'Cosa vuoi imparare?',
    subtitle: 'Scegli uno o più argomenti. Potrai cambiarli quando vuoi dall’Account.',
    selected: (n: number) => (n === 1 ? '1 argomento selezionato' : `${n} argomenti selezionati`),
    minHint: 'Scegline almeno uno per continuare',
  },

  level: {
    title: 'Quanto ne sai di finanza?',
    subtitle: 'Nessun giudizio: serve solo a scegliere gli esempi giusti per te.',
    note: 'Si parte comunque dalle basi: ogni lezione dura meno di 5 minuti.',
  },

  pace: {
    title: 'Qual è il tuo ritmo?',
    subtitle: 'Bastano pochi minuti al giorno per creare un’abitudine che dura.',
    minutes: 'min',
    perDay: (minutes: number) => `${minutes} minuti al giorno`,
    recommended: 'Consigliato',
    reminderTitle: 'Attiva promemoria',
    reminderSubtitle: 'Un avviso gentile per non perdere la serie',
    reminderTime: 'A che ora preferisci?',
    demoNote: 'Versione demo: il promemoria viene salvato ma non invia notifiche reali.',
  },

  ready: {
    overline: 'Tutto pronto',
    titleStart: 'Ciao ',
    titleEnd: ', il tuo percorso è pronto',
    subtitle: 'Abbiamo preparato tutto per te. Si parte dalle basi, una lezione alla volta.',
    returningTitle: (name: string) => `Bentornato, ${name}!`,
    returningSubtitle: 'I tuoi progressi e i tuoi Kiwi ti stanno aspettando.',
    pathOverline: 'Il tuo primo percorso',
    pathMeta: (chapters: number, firstChapter: string) => `${chapters} capitoli · Si parte da ${firstChapter}`,
    companion: (name: string) => `Con ${name}`,
    interestsCount: (n: number) => (n === 1 ? '1 interesse' : `${n} interessi`),
    reminderAt: (time: string) => `Promemoria alle ${time}`,
    cta: 'Inizia il percorso',
    returningCta: 'Vai alla Home',
  },
} as const;
