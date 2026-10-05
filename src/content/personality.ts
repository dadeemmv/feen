/**
 * "Che tipo sei con i soldi?" — the money-personality test of onboarding and the four companion
 * mascots it assigns. Two axes, 16Personalities-style (agree ↔ disagree statements):
 *   horizon: present ↔ future      risk: safe ↔ bold
 * Each quadrant is one mascot:
 *               safe          bold
 *   future   Scoiattolo     Gufo
 *   present  Koala          Volpe
 */
import type { ContentTone } from './types';

export type MascotId = 'squirrel' | 'owl' | 'fox' | 'koala';
export type PersonalityAxis = 'horizon' | 'risk';
export type HorizonPole = 'present' | 'future';
export type RiskPole = 'safe' | 'bold';

export type Mascot = {
  id: MascotId;
  /** The mascot's own name. */
  name: string;
  /** "Scoiattolo". */
  animal: string;
  /** "Sei uno Scoiattolo" (Italian article included). */
  youAre: string;
  /** Personality type label. */
  type: string;
  horizon: HorizonPole;
  risk: RiskPole;
  tagline: string;
  description: string;
  strengths: readonly [string, string, string];
  /** What to train ("Da allenare"). */
  watchOut: string;
  /** The mascot's catchphrase, shown as a speech line. */
  motto: string;
  tone: ContentTone;
};

export const MASCOTS: Record<MascotId, Mascot> = {
  squirrel: {
    id: 'squirrel',
    name: 'Nocciola',
    animal: 'Scoiattolo',
    youAre: 'Sei uno Scoiattolo',
    type: 'Previdente',
    horizon: 'future',
    risk: 'safe',
    tagline: 'Mette da parte oggi per stare tranquillo domani.',
    description:
      'Pensi al futuro e non ami rischiare: prima di spendere ti chiedi se ne vale la pena, e avere un fondo per gli imprevisti ti fa dormire sereno. Con Nocciola imparerai a far fruttare quei risparmi senza perdere la calma.',
    strengths: ['Costanza', 'Fondo emergenze', 'Spese sotto controllo'],
    watchOut: 'Lasciare tutto fermo sul conto: l’inflazione lo erode piano piano.',
    motto: 'Un Kiwi alla volta si fa una montagna.',
    tone: 'butter',
  },
  owl: {
    id: 'owl',
    name: 'Otto',
    animal: 'Gufo',
    youAre: 'Sei un Gufo',
    type: 'Stratega',
    horizon: 'future',
    risk: 'bold',
    tagline: 'Ha un piano a lungo termine e il coraggio di seguirlo.',
    description:
      'Guardi lontano e accetti un po’ di rischio se i numeri tornano: ti piace capire, confrontare e decidere con la testa. Con Otto passerai dalla teoria a una strategia d’investimento tutta tua.',
    strengths: ['Visione lunga', 'Analisi', 'Interesse composto'],
    watchOut: 'Voler ottimizzare tutto e rimandare la prima mossa.',
    motto: 'Il tempo è il miglior alleato di chi ha un piano.',
    tone: 'lilac',
  },
  fox: {
    id: 'fox',
    name: 'Lampo',
    animal: 'Volpe',
    youAre: 'Sei una Volpe',
    type: 'Intraprendente',
    horizon: 'present',
    risk: 'bold',
    tagline: 'Coglie le occasioni al volo e non ha paura di provarci.',
    description:
      'Ti muovi veloce, le novità ti incuriosiscono e un rischio non ti spaventa: è un’energia preziosa. Con Lampo imparerai a distinguere le occasioni vere da quelle che bruciano i soldi.',
    strengths: ['Curiosità', 'Decisione', 'Spirito d’iniziativa'],
    watchOut: 'Le mode del momento e gli acquisti d’impulso.',
    motto: 'Le occasioni migliori arrivano a chi è preparato.',
    tone: 'blush',
  },
  koala: {
    id: 'koala',
    name: 'Mochi',
    animal: 'Koala',
    youAre: 'Sei un Koala',
    type: 'Zen',
    horizon: 'present',
    risk: 'safe',
    tagline: 'Si gode il presente e tiene lontano lo stress.',
    description:
      'Per te i soldi servono a vivere bene oggi, senza ansie né azzardi, ed è giusto così. Con Mochi costruirai poche abitudini semplici che lavorano da sole, mentre tu continui a goderti la vita.',
    strengths: ['Equilibrio', 'Zero ansia', 'Gusto per la vita'],
    watchOut: 'Rimandare le scelte sui soldi a «un giorno».',
    motto: 'Poche regole semplici, e i soldi lavorano mentre ti rilassi.',
    tone: 'mint',
  },
};

/** Display order (lineups, gallery). */
export const MASCOT_IDS: readonly MascotId[] = ['squirrel', 'owl', 'fox', 'koala'];

export const isMascotId = (value: unknown): value is MascotId =>
  typeof value === 'string' && (MASCOT_IDS as readonly string[]).includes(value);

export const getMascot = (id: MascotId) => MASCOTS[id];

export const AXIS_POLES = {
  horizon: { negative: 'Presente', positive: 'Futuro' },
  risk: { negative: 'Prudenza', positive: 'Audacia' },
} as const satisfies Record<PersonalityAxis, { negative: string; positive: string }>;

export type PersonalityStatement = {
  id: string;
  text: string;
  axis: PersonalityAxis;
  /** +1: agreeing points to the positive pole (future / bold); −1: to the negative one. */
  direction: 1 | -1;
};

/** Twelve statements, six per axis, half of each keyed the other way; axes alternate. */
export const PERSONALITY_STATEMENTS: readonly PersonalityStatement[] = [
  {
    id: 'bonus',
    text: 'Se ricevo un bonus inaspettato, la prima cosa che faccio è metterne da parte una fetta.',
    axis: 'horizon',
    direction: 1,
  },
  {
    id: 'double',
    text: 'Investirei una parte dei risparmi in qualcosa che può raddoppiare, anche se potrebbe dimezzarsi.',
    axis: 'risk',
    direction: 1,
  },
  {
    id: 'dinner',
    text: 'Meglio una bella cena fuori oggi che risparmiare per qualcosa che forse comprerò tra anni.',
    axis: 'horizon',
    direction: -1,
  },
  {
    id: 'sure-gain',
    text: 'Preferisco un guadagno piccolo ma sicuro a uno grande ma incerto.',
    axis: 'risk',
    direction: -1,
  },
  {
    id: 'tracking',
    text: 'So più o meno quanto ho speso questo mese.',
    axis: 'horizon',
    direction: 1,
  },
  {
    id: 'new-things',
    text: 'Mi incuriosiscono le opportunità nuove, come startup o criptovalute.',
    axis: 'risk',
    direction: 1,
  },
  {
    id: 'planning',
    text: 'Pianificare le spese mi toglie il gusto delle cose.',
    axis: 'horizon',
    direction: -1,
  },
  {
    id: 'drop',
    text: 'Se i miei risparmi perdessero il 10% in un mese, non dormirei la notte.',
    axis: 'risk',
    direction: -1,
  },
  {
    id: 'ten-years',
    text: 'Penso spesso a come vorrei vivere tra dieci anni.',
    axis: 'horizon',
    direction: 1,
  },
  {
    id: 'change',
    text: 'Cambiare lavoro o città per un’occasione migliore mi entusiasma più che spaventarmi.',
    axis: 'risk',
    direction: 1,
  },
  {
    id: 'impulse',
    text: 'Se una cosa mi piace davvero la compro subito, anche se non era prevista.',
    axis: 'horizon',
    direction: -1,
  },
  {
    id: 'idle-cash',
    text: 'Tenere i soldi fermi sul conto mi fa sentire tranquillo, anche se rendono poco.',
    axis: 'risk',
    direction: -1,
  },
];

/** The 7-point agreement scale, left (agree) → right (disagree). */
export const AGREEMENT_SCALE = [
  { value: 3, label: 'Molto d’accordo' },
  { value: 2, label: 'D’accordo' },
  { value: 1, label: 'Un po’ d’accordo' },
  { value: 0, label: 'Né d’accordo né in disaccordo' },
  { value: -1, label: 'Un po’ in disaccordo' },
  { value: -2, label: 'In disaccordo' },
  { value: -3, label: 'Molto in disaccordo' },
] as const;

export type AgreementValue = (typeof AGREEMENT_SCALE)[number]['value'];
