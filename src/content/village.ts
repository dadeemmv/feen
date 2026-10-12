/**
 * The village (borgo): eleven buildings, eleven topics. The home is the village itself — a
 * meta layer in the style of a village builder, with a diegetic hub world like FIFA City
 * (concept board §04). The metaphor of each building already explains its concept: the Well is
 * the emergency fund, the Orchard compound interest.
 *
 * Rules (decided in review, 11/10/2026):
 * - buildings grow only with the lessons of their topic (knowledge cannot be bought);
 * - projects are free: no locks, the partner suggests where to start, at most two open sites;
 *   the only constraint is the Tower (investing) after the Well (emergency fund);
 * - the signed pact is the first stone: the Town Hall stands from day one and keeps the pacts.
 */
import type { BuildingTone } from '@/theme';

export type BuildingId =
  | 'municipio'
  | 'banco'
  | 'bottega'
  | 'mercato'
  | 'granaio'
  | 'pozzo'
  | 'frutteto'
  | 'torre'
  | 'mura'
  | 'ponte'
  | 'faro';

export type Building = {
  id: BuildingId;
  name: string;
  /** "al Pozzo", "alla Torre", "alle Mura". */
  at: string;
  /** Short topic under the name ("Fondo emergenze"). */
  topic: string;
  /** One or two sentences: what you learn there and why the metaphor fits. */
  description: string;
  /** Lessons that raise this building, in order (chapter ids). Empty: lessons coming soon. */
  chapterIds: readonly string[];
  tone: BuildingTone;
  /** Must be built before this one can open (the Tower after the Well). */
  requires?: BuildingId;
};

export const BUILDINGS: Record<BuildingId, Building> = {
  municipio: {
    id: 'municipio',
    name: 'Municipio',
    at: 'al Municipio',
    topic: 'Tasse e Stato',
    description: 'Tasse, ISEE, bonus e documenti. Qui si custodiscono i patti firmati.',
    chapterIds: [],
    tone: 'cobalt',
  },
  banco: {
    id: 'banco',
    name: 'Banco',
    at: 'al Banco',
    topic: 'Conto e pagamenti',
    description: 'Conto corrente, carte, bonifici, IBAN. La parola banca viene dal banco dei cambiavalute.',
    chapterIds: [],
    tone: 'mint',
  },
  bottega: {
    id: 'bottega',
    name: 'Bottega',
    at: 'alla Bottega',
    topic: 'Lavoro e reddito',
    description: 'Busta paga, lordo e netto, contratti. Dove i soldi entrano.',
    chapterIds: [],
    tone: 'coral',
  },
  mercato: {
    id: 'mercato',
    name: 'Mercato',
    at: 'al Mercato',
    topic: 'Spese e budget',
    description: 'Bisogni e desideri, abbonamenti, trucchi del marketing. Dove i soldi escono.',
    chapterIds: ['spese-invisibili'],
    tone: 'honey',
  },
  granaio: {
    id: 'granaio',
    name: 'Granaio',
    at: 'al Granaio',
    topic: 'Risparmio e inflazione',
    description:
      'Obiettivi, pagare prima se stessi. E i topi nel grano: l’inflazione che rosicchia i risparmi.',
    chapterIds: ['inflazione'],
    tone: 'wheat',
  },
  pozzo: {
    id: 'pozzo',
    name: 'Pozzo',
    at: 'al Pozzo',
    topic: 'Fondo emergenze',
    description: 'Imprevisti e liquidità. Quando arriva la siccità, l’acqua c’è.',
    chapterIds: ['fondo-emergenze'],
    tone: 'lagoon',
  },
  frutteto: {
    id: 'frutteto',
    name: 'Frutteto',
    at: 'al Frutteto',
    topic: 'Interesse composto e pensione',
    description: 'Il tempo come alleato: pianti oggi, raccogli per anni. Anche la pensione si semina presto.',
    chapterIds: ['interesse-composto'],
    tone: 'leaf',
  },
  torre: {
    id: 'torre',
    name: 'Torre',
    at: 'alla Torre',
    topic: 'Investire',
    description:
      'Rischio e rendimento, diversificazione, ETF. Si apre dopo il Pozzo: prima l’acqua, poi la vista.',
    chapterIds: [
      'rischi-rendimenti',
      'azioni',
      'dividendi',
      'capital-gain',
      'obbligazioni',
      'cedole',
      'etf',
      'diversifica',
      'broker',
      'scegli-broker',
      'dentro-broker',
    ],
    tone: 'cobalt',
    requires: 'pozzo',
  },
  mura: {
    id: 'mura',
    name: 'Mura',
    at: 'alle Mura',
    topic: 'Protezione',
    description: 'Assicurazioni e prevenzione. Non servono, finché non servono.',
    chapterIds: ['proteggersi'],
    tone: 'stone',
  },
  ponte: {
    id: 'ponte',
    name: 'Ponte',
    at: 'al Ponte',
    topic: 'Credito e debito',
    description: 'Prestiti, TAEG, rate e «compra ora, paga dopo». Il pedaggio si paga.',
    chapterIds: [],
    tone: 'wood',
  },
  faro: {
    id: 'faro',
    name: 'Faro',
    at: 'al Faro',
    topic: 'Truffe e sicurezza',
    description: 'Phishing, schemi Ponzi, hype. Avvisa degli scogli prima che tu li veda.',
    chapterIds: ['truffe'],
    tone: 'coral',
  },
};

/** Order of the "Lezioni" list (the accessible version of the map). */
export const BUILDING_IDS: readonly BuildingId[] = [
  'municipio',
  'banco',
  'bottega',
  'mercato',
  'granaio',
  'pozzo',
  'frutteto',
  'torre',
  'mura',
  'ponte',
  'faro',
];

/** The first stone: stands from the moment the pact is signed. */
export const FIRST_STONE: BuildingId = 'municipio';

/** At most two sites open at the same time. */
export const MAX_OPEN_SITES = 2;

export const getBuilding = (id: BuildingId) => BUILDINGS[id];

export const isBuildingId = (value: unknown): value is BuildingId =>
  typeof value === 'string' && Object.hasOwn(BUILDINGS, value);

/** The first start building that can open on day one (it has lessons and no prerequisite). */
export function firstSiteOf(starts: readonly BuildingId[]): BuildingId | undefined {
  return starts.find((id) => BUILDINGS[id].chapterIds.length > 0 && !BUILDINGS[id].requires);
}

/** The building a lesson belongs to. */
export function buildingOfChapter(chapterId: string): BuildingId | undefined {
  return BUILDING_IDS.find((id) => BUILDINGS[id].chapterIds.includes(chapterId));
}

/** "Ginestra", "Lavanda", …: the partner suggests three names after the first stone. */
export const VILLAGE_NAME_IDEAS = [
  'Ginestra',
  'Lavanda',
  'Rosmarino',
  'Castagno',
  'Fontana',
  'Mirtillo',
  'Corbezzolo',
  'Salvia',
  'Quercia',
] as const;
