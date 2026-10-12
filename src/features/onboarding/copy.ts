/**
 * Italian copy of the first-run flow: welcome → nome → livello → test → il tuo animale → il patto →
 * prima pietra → nome del borgo. The test's own copy lives in `@/features/mascots/copy`.
 */
export const ONBOARDING_COPY = {
  back: 'Indietro',
  next: 'Continua',
  stepOf: (step: number, total: number) => `${step}/${total}`,
  stepLabel: (step: number, total: number) => `Passo ${step} di ${total}`,

  welcome: {
    headlineStart: 'Ogni lezione, un ',
    headlineAccent: 'mattone.',
    subtitle: 'Impari a gestire i soldi e, lezione dopo lezione, costruisci il tuo borgo.',
    perks: ['5 minuti al giorno', 'Un patto da firmare', 'Il tuo borgo'] as const,
    start: 'Inizia',
    returning: 'Ho già un account',
    artLabel: 'I quattro animali: Volpe, Castoro, Lontra e Scoiattolo',
  },

  name: {
    title: 'Come ti chiami?',
    subtitle: 'Useremo il tuo nome per rendere il percorso più tuo.',
    label: 'Il tuo nome',
    placeholder: 'Es. Giulia',
    greeting: (name: string) => `Piacere di conoscerti, ${name}! 👋`,
    privacy: 'Resta sul tuo dispositivo: non lo condividiamo con nessuno.',
  },

  level: {
    title: 'Quanto ne sai di soldi?',
    subtitle: 'Nessun giudizio: serve solo a scegliere gli esempi giusti per te.',
    note: 'Si parte comunque dalle basi: ogni lezione dura pochi minuti.',
  },

  reveal: {
    sign: (partner: string) => `Firma il patto con ${partner}`,
  },

  pact: {
    intro: (partner: string) => `${partner} ti propone un patto. È breve, e firmarlo è un piccolo rito.`,
    next: 'Posa la prima pietra',
  },

  stone: {
    code: (number: string) => `Patto ${number} · firmato`,
    titleStart: 'Prima pietra ',
    titleWord: 'posata.',
    body: (partner: string, building: string) =>
      `Il Municipio è in piedi e custodisce il patto. Domani ${partner} ti aspetta ${building}.`,
    cta: 'Dai un nome al borgo',
    artLabel: 'Il Municipio, costruito',
  },

  village: {
    title: 'Come si chiama il tuo borgo?',
    subtitle: (partner: string) => `Lo scegli tu, come in FIFA City. ${partner} te ne propone tre.`,
    label: 'Nome del borgo',
    placeholder: 'Es. Ginestra',
    preview: (name: string) => `Borgo ${name}`,
    cta: 'Entra nel borgo',
  },

  returningCta: 'Entra nel borgo',
} as const;
