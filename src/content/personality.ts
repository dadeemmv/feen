/**
 * "Che tipo sei con i soldi?" — the money compass of onboarding and the four companion characters
 * it assigns. Two axes, political-compass style, measured with 16Personalities-like agree ↔
 * disagree statements:
 *   goal (horizontal): left = money for the dream home, a calm life, the people you love
 *                      right = money to grow more money, status, the yacht
 *   risk (vertical):   unrisk ↔ risk
 * Each quadrant is one character (inspired by investor archetypes, not portraits):
 *              left              right
 *   risk     Vera, Visionaria   Max, Squalo
 *   unrisk   Teo, Filantropo    Bruno, Cassettista
 */

export type MascotId = 'value' | 'shark' | 'giver' | 'visionary';
export type PersonalityAxis = 'goal' | 'risk';
export type GoalPole = 'left' | 'right';
export type RiskPole = 'unrisk' | 'risk';

export type Mascot = {
  id: MascotId;
  /** The character's own name. */
  name: string;
  /** Archetype title ("Il Cassettista"). */
  title: string;
  /** Compass quadrant ("Unrisk Right"). */
  quadrant: string;
  goal: GoalPole;
  risk: RiskPole;
  tagline: string;
  description: string;
  strengths: readonly [string, string, string];
  /** What to train ("Da allenare"). */
  watchOut: string;
  /** The character's catchphrase, shown as a speech line. */
  motto: string;
};

export const MASCOTS: Record<MascotId, Mascot> = {
  value: {
    id: 'value',
    name: 'Bruno',
    title: 'Il Cassettista',
    quadrant: 'Unrisk Right',
    goal: 'right',
    risk: 'unrisk',
    tagline: 'Compra aziende solide e le tiene nel cassetto per decenni.',
    description:
      'Per te i soldi sono un patrimonio da far crescere con pazienza: strumenti tradizionali, aziende che capisci, niente mode. Come Bruno ragioni sul lungo periodo e lasci lavorare l’interesse composto.',
    strengths: ['Pazienza', 'Interesse composto', 'Sangue freddo'],
    watchOut: 'Restare fermo anche quando il mondo cambia davvero.',
    motto: 'Compro solo quello che capisco. Poi aspetto.',
  },
  shark: {
    id: 'shark',
    name: 'Max',
    title: 'Lo Squalo',
    quadrant: 'Risk Right',
    goal: 'right',
    risk: 'risk',
    tagline: 'Punta in alto, va veloce e sogna lo yacht.',
    description:
      'Ti piacciono i soldi, l’adrenalina dei mercati e i risultati che si vedono. Hai fame e coraggio: con Max imparerai a usarli senza bruciarti, perché la leva funziona in tutti e due i sensi.',
    strengths: ['Ambizione', 'Rapidità', 'Grinta'],
    watchOut: 'Il trading compulsivo e le promesse di guadagni facili.',
    motto: 'Chi non rischia non beve champagne. Chi rischia male non beve proprio.',
  },
  giver: {
    id: 'giver',
    name: 'Teo',
    title: 'Il Filantropo',
    quadrant: 'Unrisk Left',
    goal: 'left',
    risk: 'unrisk',
    tagline: 'Costruisce con calma una vita serena, e ne condivide un pezzo.',
    description:
      'Per te i soldi servono a stare bene, a proteggere chi ami e a restituire qualcosa. Niente azzardi: con Teo costruirai basi solide, dalla casetta dei sogni a un piano che dura nel tempo.',
    strengths: ['Visione sociale', 'Prudenza', 'Generosità'],
    watchOut: 'Essere così prudente da lasciare che l’inflazione si mangi i risparmi.',
    motto: 'Prima le fondamenta, poi tutto il resto.',
  },
  visionary: {
    id: 'visionary',
    name: 'Vera',
    title: 'La Visionaria',
    quadrant: 'Risk Left',
    goal: 'left',
    risk: 'risk',
    tagline: 'Scommette sulle tecnologie che cambieranno il mondo.',
    description:
      'Investi in ciò in cui credi: innovazione, idee nuove, futuro. Accetti gli alti e bassi se la direzione è giusta. Con Vera imparerai a dare forma alle tue convinzioni senza mettere tutte le uova nello stesso razzo.',
    strengths: ['Convinzione', 'Visione', 'Coraggio'],
    watchOut: 'Innamorarsi di una storia e dimenticare la diversificazione.',
    motto: 'Il futuro arriva prima a chi lo sa immaginare.',
  },
};

/** Compass reading order: top row (risk) left → right, then bottom row (unrisk). */
export const MASCOT_IDS: readonly MascotId[] = ['visionary', 'shark', 'giver', 'value'];

export const isMascotId = (value: unknown): value is MascotId =>
  typeof value === 'string' && (MASCOT_IDS as readonly string[]).includes(value);

export const getMascot = (id: MascotId) => MASCOTS[id];

export const AXIS_POLES = {
  goal: { negative: 'Left', positive: 'Right', negativeHint: 'la casetta dei sogni', positiveHint: 'lo yacht' },
  risk: { negative: 'Unrisk', positive: 'Risk', negativeHint: 'sicurezza prima di tutto', positiveHint: 'nessun rischio, nessun premio' },
} as const satisfies Record<PersonalityAxis, { negative: string; positive: string; negativeHint: string; positiveHint: string }>;

export type PersonalityStatement = {
  id: string;
  text: string;
  axis: PersonalityAxis;
  /** +1: agreeing points to the positive pole (right / risk); −1: to the negative one. */
  direction: 1 | -1;
};

/** Twelve statements, six per axis, half of each keyed the other way; axes alternate. */
export const PERSONALITY_STATEMENTS: readonly PersonalityStatement[] = [
  {
    id: 'enough',
    text: 'Mi basta avere abbastanza per vivere in serenità: diventare ricco non è il mio obiettivo.',
    axis: 'goal',
    direction: -1,
  },
  {
    id: 'double',
    text: 'Investirei una parte dei risparmi in qualcosa che può raddoppiare, anche se potrebbe dimezzarsi.',
    axis: 'risk',
    direction: 1,
  },
  {
    id: 'yacht',
    text: 'Un giorno vorrei potermi permettere una barca, un’auto sportiva o un orologio importante.',
    axis: 'goal',
    direction: 1,
  },
  {
    id: 'sure-gain',
    text: 'Preferisco un guadagno piccolo ma sicuro a uno grande ma incerto.',
    axis: 'risk',
    direction: -1,
  },
  {
    id: 'home',
    text: 'Meglio una casa accogliente con le persone che amo che un attico di lusso tutto per me.',
    axis: 'goal',
    direction: -1,
  },
  {
    id: 'new-things',
    text: 'Mi incuriosiscono le opportunità nuove, come startup o criptovalute.',
    axis: 'risk',
    direction: 1,
  },
  {
    id: 'grow',
    text: 'Più soldi guadagno, più ho voglia di farli crescere ancora.',
    axis: 'goal',
    direction: 1,
  },
  {
    id: 'drop',
    text: 'Se i miei risparmi perdessero il 10% in un mese, non dormirei la notte.',
    axis: 'risk',
    direction: -1,
  },
  {
    id: 'give',
    text: 'Se avessi molti soldi, una buona parte la darei a cause in cui credo.',
    axis: 'goal',
    direction: -1,
  },
  {
    id: 'change',
    text: 'Cambiare lavoro o città per un’occasione migliore mi entusiasma più che spaventarmi.',
    axis: 'risk',
    direction: 1,
  },
  {
    id: 'success',
    text: 'Il successo, per me, si misura anche con il conto in banca.',
    axis: 'goal',
    direction: 1,
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
