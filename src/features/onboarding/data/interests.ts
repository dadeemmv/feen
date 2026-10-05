/**
 * Interest catalogue shared by onboarding ("Cosa vuoi imparare?") and Account → "I tuoi
 * interessi". The ids are what `profile.interests` stores, so never rename them.
 */
import {
  Bitcoin,
  Briefcase,
  ChartCandlestick,
  House,
  Landmark,
  PiggyBank,
  Receipt,
  ShieldCheck,
  TrendingUp,
  Umbrella,
  Wallet,
  type LucideIcon,
} from 'lucide-react-native';

import type { Tone } from '@/components/ui';

export type InterestId =
  | 'risparmio'
  | 'investimenti'
  | 'budget'
  | 'azioni-etf'
  | 'crypto'
  | 'pensione'
  | 'tasse'
  | 'mutui'
  | 'assicurazioni'
  | 'imprenditoria'
  | 'banche';

export type Interest = {
  id: InterestId;
  label: string;
  /** One-line hint on the onboarding cards. */
  hint: string;
  icon: LucideIcon;
  tone: Tone;
};

export const INTERESTS: readonly Interest[] = [
  { id: 'risparmio', label: 'Risparmio', hint: 'Mettere da parte ogni mese', icon: PiggyBank, tone: 'blush' },
  { id: 'investimenti', label: 'Investimenti', hint: 'Far crescere i tuoi soldi', icon: TrendingUp, tone: 'mint' },
  { id: 'budget', label: 'Budget', hint: 'Sapere dove vanno i soldi', icon: Wallet, tone: 'butter' },
  { id: 'azioni-etf', label: 'Azioni ed ETF', hint: 'Come funziona la Borsa', icon: ChartCandlestick, tone: 'sky' },
  { id: 'crypto', label: 'Crypto', hint: 'Bitcoin e dintorni', icon: Bitcoin, tone: 'warning' },
  { id: 'pensione', label: 'Pensione', hint: 'Pensare al futuro', icon: Umbrella, tone: 'lilac' },
  { id: 'tasse', label: 'Tasse', hint: 'IRPEF, 730 e rendimenti', icon: Receipt, tone: 'neutral' },
  { id: 'mutui', label: 'Mutui e casa', hint: 'Comprare casa senza stress', icon: House, tone: 'info' },
  { id: 'assicurazioni', label: 'Assicurazioni', hint: 'Proteggere ciò che conta', icon: ShieldCheck, tone: 'success' },
  { id: 'imprenditoria', label: 'Imprenditoria', hint: 'Partita IVA e startup', icon: Briefcase, tone: 'pro' },
  { id: 'banche', label: 'Conti e banche', hint: 'Conti, carte e interessi', icon: Landmark, tone: 'brand' },
];

const INTEREST_IDS = new Set<string>(INTERESTS.map((interest) => interest.id));

export const isInterestId = (value: string): value is InterestId => INTEREST_IDS.has(value);

/** Keeps only known ids, in catalogue order (stable UI + no stale ids from older versions). */
export function normalizeInterests(values: readonly string[]): InterestId[] {
  const selected = new Set(values);
  return INTERESTS.filter((interest) => selected.has(interest.id)).map((interest) => interest.id);
}

export function getInterest(id: string): Interest | undefined {
  return INTERESTS.find((interest) => interest.id === id);
}
