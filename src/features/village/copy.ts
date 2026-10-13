/** Italian copy of the village (home), the lessons list and the building pages. */
import type { BuildingState } from '@/store';

export const VILLAGE_COPY = {
  title: (name: string | null) => (name ? `Borgo ${name}` : 'Il tuo borgo'),
  titleWord: (name: string | null) => name ?? 'borgo',
  greeting: (name: string, hour: number) => {
    const salute = hour < 13 ? 'Buongiorno' : hour < 18 ? 'Buon pomeriggio' : 'Buonasera';
    return `${salute}, ${name}`;
  },
  residents: (n: number) => (n === 1 ? 'abitante' : 'abitanti'),
  bricks: 'mattoni',
  pactDays: 'giorni di patto',
  pactDaysValue: (day: number, days: number) => `${day}/${days}`,

  partnerSays: (building: string) => `Oggi tocca ${building}!`,
  /** Today's lesson is done: no push, just where to find the partner if you feel like more. */
  partnerDone: (building: string) => `Per oggi hai fatto la tua parte. Se ti va, ci vediamo ${building}.`,
  partnerIdle: 'Hai finito tutte le tappe che ci sono: goditi il borgo.',
  partnerA11y: (name: string) => `${name}: apri il patto`,
  pin: (done: number, total: number) => `In costruzione · ${done}/${total}`,
  /** The suggested project, not opened yet: still a lot on the ground. */
  pinNext: 'Prossimo cantiere',
  mapLabel: (name: string | null) => `${name ? `Borgo ${name}` : 'Il borgo'}: undici edifici, ognuno dice a che punto è`,
  mapHint: 'Tocca un edificio per vedere a che punto è.',

  nextSite: 'Prossimo cantiere',
  lessonOf: (n: number, total: number) => `Lezione ${n} di ${total}`,
  minutes: (n: number) => `${n} min`,
  bricksReward: (n: number) => `+${n}`,
  build: 'Costruisci',
  review: 'Rifai',

  state: {
    progetto: 'Progetto, arriva col percorso',
    cantiere: 'Cantiere',
    costruito: 'Costruito',
    fiorito: 'Fiorito',
  } satisfies Record<BuildingState, string>,
  stateShort: {
    progetto: 'Progetto',
    cantiere: 'Cantiere',
    costruito: 'Costruito',
    fiorito: 'Fiorito',
  } satisfies Record<BuildingState, string>,
  buildingA11y: (name: string, topic: string, state: string) => `${name}, ${topic}: ${state}`,

  /** The full-screen map's buttons. */
  world: {
    zoomIn: 'Avvicina',
    zoomOut: 'Allontana',
    centre: 'Torna al cantiere di oggi',
  },

  /** "Costruisci con i mattoni": homes for the residents and decorations, where you want. */
  decor: {
    entry: 'Usa i mattoni',
    entryA11y: (bricks: number) => `Usa i mattoni: ne hai ${bricks}`,
    close: 'Chiudi',
    titleStart: 'Costruisci con i ',
    titleWord: 'mattoni',
    subtitle: 'Gli edifici crescono solo con le lezioni. I mattoni danno una casa agli abitanti e decorano il borgo, dove vuoi tu.',
    bricks: (n: number) => (n === 1 ? '1 mattone' : `${n} mattoni`),
    tents: (n: number, perHouse: number) =>
      n === 1
        ? `1 abitante dorme in tenda: una casa ne ospita ${perHouse}.`
        : `${n} abitanti dormono in tenda: una casa ne ospita ${perHouse}.`,
    housed: 'Tutti gli abitanti hanno una casa.',
    catalogA11y: 'Cosa vuoi costruire',
    pickLot: 'Scegli un posto sulla mappa',
    missing: (n: number) => (n === 1 ? 'Ti manca 1 mattone' : `Ti mancano ${n} mattoni`),
    missingHint: 'Ogni lezione finita ne porta altri.',
    cta: (cost: number) => `Costruisci qui · ${cost} mattoni`,
    built: (what: string) => `Hai costruito ${what}.`,
    full: 'Non ci sono più posti liberi nel borgo.',
    lotA11y: (at: string) => `Posto libero vicino ${at}`,
  },

  /** "Percorso" (tab): the second layer, one road of lessons in sequence that raises the village. */
  path: {
    titleStart: 'Il tuo ',
    titleWord: 'percorso',
    subtitle: 'Una tappa dopo l’altra. Ogni lezione fa crescere un edificio del borgo.',
    progress: (done: number, total: number) => `${done} di ${total} tappe`,
    progressA11y: (done: number, total: number) => `Percorso: ${done} tappe fatte su ${total}`,
    sectionMeta: (state: string, done: number, total: number) => `${state} · ${done}/${total}`,
    sectionA11y: (name: string, topic: string, state: string) => `${name}, ${topic}: ${state}. Apri l’edificio`,
    start: 'Inizia',
    meta: (minutes: number, bricks: number) => `${minutes} min · +${bricks} mattoni`,
    stepA11y: (n: number, total: number, title: string, status: 'fatta' | 'oggi' | 'chiusa') =>
      `Tappa ${n} di ${total}: ${title}. ${status === 'fatta' ? 'Fatta, tocca per rifarla' : status === 'oggi' ? 'Da fare adesso' : 'Si apre dopo la tappa prima'}`,
    locked: (title: string) => `Si apre dopo «${title}».`,
    finished: 'Hai finito tutte le tappe che ci sono. Le prossime arrivano presto.',
    soon: (names: string) => `In arrivo le tappe per ${names}.`,
  },

  lessons: {
    title: 'Lezioni',
    titleWord: 'Lezioni',
    subtitle: 'Lo stesso borgo, in forma di lista. Ogni edificio è un argomento.',
    count: (done: number, total: number) => (total === 0 ? 'Lezioni in arrivo' : `${done}/${total} lezioni`),
    see: 'Vedi le lezioni',
  },

  building: {
    back: 'Indietro',
    lessonsTitle: 'Le lezioni',
    soon: 'Le lezioni di questo edificio sono in arrivo.',
    open: 'Apri il cantiere',
    continue: (title: string) => `Continua: ${title}`,
    practise: 'Rifai una lezione',
    done: 'Fatta',
    next: 'Oggi',
    atStep: (n: number) => `Il percorso arriva qui alla tappa ${n}. Le lezioni si aprono una dopo l’altra.`,
    later: 'Le prossime lezioni di questo edificio si aprono più avanti nel percorso.',
    toPath: 'Vai al percorso',
  },
} as const;
