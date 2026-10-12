/**
 * "Che animale sei con i soldi?" — the onboarding test and the four animals it assigns
 * (docs/design/DESIGN.md, concept board §02). Two axes from behavioural finance:
 *   horizon (horizontal): oggi ↔ domani   (time preference)
 *   risk    (vertical):   prudenza ↔ audacia (risk propensity)
 *
 *              oggi                   domani
 *   audacia    Volpe Esploratrice     Castoro Ingegnere
 *   prudenza   Lontra Conviviale      Scoiattolo Custode
 *
 * The test says "sei una Volpe" (the identity you share) and introduces a partner of the same
 * species: one like you who already got past your blind spot. The partner countersigns the pact
 * and speaks in the app. Animals have no gender or age, so the test works for anyone; adjectives
 * agree with the animal, not with the player.
 */
import type { BuildingId } from './village';

export type MascotId = 'volpe' | 'castoro' | 'lontra' | 'scoiattolo';
export type PersonalityAxis = 'horizon' | 'risk';
export type HorizonPole = 'oggi' | 'domani';
export type RiskPole = 'prudenza' | 'audacia';

export type Partner = {
  /** The partner's own name: a common word, not a person's name. */
  name: string;
  /** "la tua socia" / "il tuo socio". */
  role: string;
  /** How they got past the blind spot. */
  story: string;
  /** Article 4 of the pact: a small gesture they learned the hard way. */
  clause: string;
};

export type Mascot = {
  id: MascotId;
  /** "Volpe". */
  species: string;
  /** "Volpe Esploratrice". */
  title: string;
  /** Indefinite article for "Sei una Volpe…" ("una" · "un" · "uno"). */
  article: 'una' | 'un' | 'uno';
  /** Two-letter code (horizon + risk): OA · DA · OP · DP. */
  code: string;
  /** "Oggi · Audacia". */
  quadrant: string;
  horizon: HorizonPole;
  risk: RiskPole;
  /** One line under the name. */
  motto: string;
  /** Reveal copy, second person. */
  description: string;
  superpower: string;
  blindSpot: string;
  /** Where the partner suggests to start: the blind spot, covered with the superpower. */
  startBuildings: readonly [BuildingId, BuildingId];
  partner: Partner;
};

export const MASCOTS: Record<MascotId, Mascot> = {
  volpe: {
    id: 'volpe',
    species: 'Volpe',
    title: 'Volpe Esploratrice',
    article: 'una',
    code: 'OA',
    quadrant: 'Oggi · Audacia',
    horizon: 'oggi',
    risk: 'audacia',
    motto: 'Fiuta le occasioni. A volte anche le trappole.',
    description: 'Fiuti le occasioni prima degli altri, a volte anche le trappole.',
    superpower: 'Intraprendenza: vede le opportunità prima degli altri.',
    blindSpot: 'FOMO e hype: decide d’impulso e segue le mode.',
    startBuildings: ['faro', 'granaio'],
    partner: {
      name: 'Brace',
      role: 'la tua socia',
      story:
        'Ha inseguito un affare che sembrava d’oro, ed era una trappola. Da allora, prima di saltare, aspetta un giorno.',
      clause: 'Prima di inseguire un’occasione, aspetto 24 ore.',
    },
  },
  castoro: {
    id: 'castoro',
    species: 'Castoro',
    title: 'Castoro Ingegnere',
    article: 'un',
    code: 'DA',
    quadrant: 'Domani · Audacia',
    horizon: 'domani',
    risk: 'audacia',
    motto: 'Costruisce oggi la diga di domani.',
    description: 'Pianifichi in grande e guardi lontano, a volte senza una riserva per gli imprevisti.',
    superpower: 'Visione: pianifica e investe sul lungo periodo.',
    blindSpot: 'Troppa sicurezza: dimentica il cuscinetto per gli imprevisti.',
    startBuildings: ['pozzo', 'mura'],
    partner: {
      name: 'Ciocco',
      role: 'il tuo socio',
      story:
        'Aveva la diga più alta del fiume e nessuna riserva. Poi è arrivata la piena. Da allora scava prima il pozzo.',
      clause: 'Prima di costruire in grande, metto acqua nel Pozzo.',
    },
  },
  lontra: {
    id: 'lontra',
    species: 'Lontra',
    title: 'Lontra Conviviale',
    article: 'una',
    code: 'OP',
    quadrant: 'Oggi · Prudenza',
    horizon: 'oggi',
    risk: 'prudenza',
    motto: 'Si gode il presente, senza azzardi.',
    description: 'Ti godi i soldi e li condividi senza rischi inutili, ma le piccole spese ti sfuggono.',
    superpower: 'Serenità: si gode i soldi e li condivide, senza rischi inutili.',
    blindSpot: 'Spese invisibili: abbonamenti, piccole uscite, «ci penso dopo». E nessun piano per il domani.',
    startBuildings: ['mercato', 'pozzo'],
    partner: {
      name: 'Onda',
      role: 'la tua socia',
      story:
        'Pagava tre abbonamenti che non usava più, e non lo sapeva. Ora una volta a settimana guarda dove vanno i suoi soldi.',
      clause: 'Una volta a settimana guardo dove sono andati i miei soldi.',
    },
  },
  scoiattolo: {
    id: 'scoiattolo',
    species: 'Scoiattolo',
    title: 'Scoiattolo Custode',
    article: 'uno',
    code: 'DP',
    quadrant: 'Domani · Prudenza',
    horizon: 'domani',
    risk: 'prudenza',
    motto: 'Mette da parte per l’inverno.',
    description: 'Metti da parte senza fatica, ma i soldi fermi non crescono e investire ti fa paura.',
    superpower: 'Costanza: risparmia senza fatica.',
    blindSpot: 'Soldi fermi: l’inflazione se li mangia, e investire gli fa paura.',
    startBuildings: ['frutteto', 'torre'],
    partner: {
      name: 'Ghianda',
      role: 'il tuo socio',
      story:
        'Ha nascosto noci per anni. Quando le ha ritrovate valevano meno, e quelle dimenticate erano diventate querce.',
      clause: 'Quando metto da parte, mi chiedo se quei soldi crescono o stanno fermi.',
    },
  },
};

/** Grid reading order: top row (audacia) oggi → domani, then bottom row (prudenza). */
export const MASCOT_IDS: readonly MascotId[] = ['volpe', 'castoro', 'lontra', 'scoiattolo'];

export const isMascotId = (value: unknown): value is MascotId =>
  typeof value === 'string' && (MASCOT_IDS as readonly string[]).includes(value);

export const getMascot = (id: MascotId) => MASCOTS[id];

/** "Sei una Volpe Esploratrice". */
export const youAre = (m: Mascot) => `Sei ${m.article} ${m.title}`;

export const AXIS_POLES = {
  horizon: { negative: 'Oggi', positive: 'Domani' },
  risk: { negative: 'Prudenza', positive: 'Audacia' },
} as const satisfies Record<PersonalityAxis, { negative: string; positive: string }>;

/**
 * One scenario of the test. It asks what you DID, not what you would do, and offers two
 * equally good answers: `negative` points to oggi / prudenza, `positive` to domani / audacia.
 * `positiveFirst` puts the positive answer on the left, so the poles do not always sit on the
 * same side of the scale.
 */
export type Scenario = {
  id: string;
  text: string;
  axis: PersonalityAxis;
  negative: string;
  positive: string;
  positiveFirst?: boolean;
};

/**
 * Twelve scenarios, six per axis, alternating. Draft copy for 14–19 year olds: the thresholds and
 * the wording are to be calibrated on a pilot, so that the four animals come out in similar
 * proportions (and the Squirrel does not always win).
 */
export const SCENARIOS: readonly Scenario[] = [
  {
    id: 'extra-money',
    text: 'L’ultima volta che ti sono arrivati soldi in più, cosa ne hai fatto?',
    axis: 'horizon',
    negative: 'Qualcosa di bello, subito',
    positive: 'Li ho tenuti per dopo',
  },
  {
    id: 'new-thing',
    text: 'L’ultima volta che hai iniziato qualcosa di nuovo (uno sport, un corso, un lavoretto), come hai fatto?',
    axis: 'risk',
    negative: 'Ho chiesto e letto parecchio prima',
    positive: 'Ho iniziato subito, imparando strada facendo',
    positiveFirst: true,
  },
  {
    id: 'too-expensive',
    text: 'Quando hai voluto una cosa che costava più di quello che avevi, cosa hai fatto?',
    axis: 'horizon',
    negative: 'Ho trovato un’alternativa da prendere subito',
    positive: 'Ho messo da parte un po’ alla volta',
    positiveFirst: true,
  },
  {
    id: 'own-money',
    text: 'Finora, con i soldi che avevi, cosa hai fatto?',
    axis: 'risk',
    negative: 'Li ho tenuti dove so che sono al sicuro',
    positive: 'Ho provato a farli fruttare: rivendere, scambiare, un lavoretto',
  },
  {
    id: 'night-out',
    text: 'L’ultima uscita con gli amici, con un po’ di soldi in tasca, com’è andata?',
    axis: 'horizon',
    negative: 'Ho speso quello che serviva per divertirmi',
    positive: 'Ho fatto in modo che ne avanzasse un po’',
  },
  {
    id: 'crazy-idea',
    text: 'Quando un amico ti ha proposto un’idea un po’ folle (un viaggio, un progetto), cosa hai risposto?',
    axis: 'risk',
    negative: 'Ho chiesto tempo e dettagli',
    positive: 'Ho detto sì quasi subito',
    positiveFirst: true,
  },
  {
    id: 'now-or-later',
    text: 'Ti è capitato di scegliere tra una cosa piccola adesso e una più grande più avanti. Cosa hai scelto?',
    axis: 'horizon',
    negative: 'Quella di adesso',
    positive: 'Quella più avanti',
  },
  {
    id: 'school-choice',
    text: 'L’ultima volta che hai scelto una scuola, un corso o un’attività, quale hai preso?',
    axis: 'risk',
    negative: 'La strada più sicura',
    positive: 'Quella più nuova o difficile, anche se incerta',
  },
  {
    id: 'big-purchase',
    text: 'Il tuo ultimo acquisto sopra i 30 euro: quando l’hai deciso?',
    axis: 'horizon',
    negative: 'In giornata',
    positive: 'Dopo averci pensato qualche giorno',
    positiveFirst: true,
  },
  {
    id: 'swap',
    text: 'Davanti a uno scambio che poteva andarti bene o male (carte, vestiti, un oggetto usato), cosa hai fatto?',
    axis: 'risk',
    negative: 'Ho lasciato perdere',
    positive: 'Ho provato, mi piaceva la sfida',
    positiveFirst: true,
  },
  {
    id: 'saving-goal',
    text: 'L’ultima volta che hai messo da parte dei soldi, com’è andata?',
    axis: 'horizon',
    negative: 'Li ho usati quando è capitata l’occasione giusta',
    positive: 'Avevo un obiettivo preciso e l’ho raggiunto piano piano',
  },
  {
    id: 'small-loss',
    text: 'L’ultima volta che hai perso un po’ di soldi (una cosa rotta, una spesa sbagliata), come l’hai presa?',
    axis: 'risk',
    negative: 'Dopo ho fatto più attenzione',
    positive: 'Ci ho riso su e ho tirato dritto',
  },
];

/**
 * The seven circles between the two answers, left → right: −3 is fully the left answer, +3 fully
 * the right one, 0 is "a bit of both".
 */
export const CHOICE_SCALE = [-3, -2, -1, 0, 1, 2, 3] as const;
export type ChoiceValue = (typeof CHOICE_SCALE)[number];

/** Spoken label of a circle, for screen readers. */
export function choiceLabel(value: ChoiceValue, left: string, right: string) {
  if (value === 0) return 'Un po’ tutte e due';
  const answer = value < 0 ? left : right;
  const strength = Math.abs(value);
  return strength === 3 ? `Decisamente: ${answer}` : strength === 2 ? `Più: ${answer}` : `Un po’: ${answer}`;
}
