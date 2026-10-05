/**
 * Italian number / money / plural formatting.
 *
 * Implemented by hand (not `Intl.NumberFormat`) so output is identical on Hermes iOS/Android,
 * web and Node tests regardless of the ICU data shipped with the engine.
 * Italian conventions: '.' thousands separator, ',' decimal separator, '€' after the amount
 * with a non-breaking space, '%' glued to the number.
 */
import { formatCountdown } from './dates';

const NBSP = ' ';

type NumberOptions = {
  /** Fixed number of decimals (default 0). */
  decimals?: number;
  /** Drop ",00" when the value is an integer (default false). */
  trimIntegers?: boolean;
};

/** 1234567.5 → '1.234.568' · with `{ decimals: 2 }` → '1.234.567,50'. */
export function formatNumber(value: number, { decimals = 0, trimIntegers = false }: NumberOptions = {}): string {
  if (!Number.isFinite(value)) return '–';
  const places = trimIntegers && Number.isInteger(value) ? 0 : decimals;
  const negative = value < 0;
  const fixed = Math.abs(value).toFixed(places);
  const [intPart, decPart] = fixed.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${negative ? '-' : ''}${grouped}${decPart ? `,${decPart}` : ''}`;
}

/** Kiwi coins (integers): 1000 → '1.000'. */
export function formatCoins(value: number): string {
  return formatNumber(Math.round(value));
}

/** Signed delta for rewards: 100 → '+100', -500 → '-500'. */
export function formatSignedCoins(value: number): string {
  const rounded = Math.round(value);
  return `${rounded > 0 ? '+' : ''}${formatCoins(rounded)}`;
}

/** Euro amounts: 1000 → '1.000 €' · 12.5 → '12,50 €' · `{ decimals: 2 }` forces cents. */
export function formatEuro(value: number, options: { decimals?: number } = {}): string {
  const decimals = options.decimals ?? (Number.isInteger(value) ? 0 : 2);
  return `${formatNumber(value, { decimals })}${NBSP}€`;
}

/** Ratio 0…1 → '85%' · `formatPercent(0.125, 1)` → '12,5%'. Values are clamped to 0…1. */
export function formatPercent(ratio: number, decimals = 0): string {
  const clamped = Number.isFinite(ratio) ? Math.min(1, Math.max(0, ratio)) : 0;
  return `${formatNumber(clamped * 100, { decimals, trimIntegers: true })}%`;
}

/** 120 → '120 XP'. */
export function formatXp(value: number): string {
  return `${formatNumber(Math.round(value))}${NBSP}XP`;
}

/* ------------------------------------------------------------------------------------------ */
/* Plurals                                                                                     */
/* ------------------------------------------------------------------------------------------ */

/** Word only: `plural(2, 'lezione', 'lezioni')` → 'lezioni'. Italian: 1 is singular, 0 plural. */
export function plural(count: number, singular: string, pluralForm: string): string {
  return Math.abs(count) === 1 ? singular : pluralForm;
}

/** Count + word: `pluralize(1, 'lezione', 'lezioni')` → '1 lezione'; thousands grouped. */
export function pluralize(count: number, singular: string, pluralForm: string): string {
  return `${formatNumber(count)} ${plural(count, singular, pluralForm)}`;
}

/** Nouns used across the app, so every screen spells them the same way. */
export const NOUNS = {
  lesson: ['lezione', 'lezioni'],
  chapter: ['capitolo', 'capitoli'],
  day: ['giorno', 'giorni'],
  life: ['vita', 'vite'],
  shield: ['scudo', 'scudi'],
  friend: ['amico', 'amici'],
  minute: ['minuto', 'minuti'],
  hour: ['ora', 'ore'],
  level: ['livello', 'livelli'],
  question: ['domanda', 'domande'],
} as const satisfies Record<string, readonly [string, string]>;

export type Noun = keyof typeof NOUNS;

/** `countOf(13, 'chapter')` → '13 capitoli'. */
export function countOf(count: number, noun: Noun): string {
  const [singular, pluralForm] = NOUNS[noun];
  return pluralize(count, singular, pluralForm);
}

export const formatLessons = (count: number) => countOf(count, 'lesson');
export const formatChapters = (count: number) => countOf(count, 'chapter');
export const formatDays = (count: number) => countOf(count, 'day');
export const formatLives = (count: number) => countOf(count, 'life');
export const formatShields = (count: number) => countOf(count, 'shield');
export const formatFriends = (count: number) => countOf(count, 'friend');

/** Progress fraction label: `formatFraction(0, 3)` → '0/3'. */
export function formatFraction(value: number, total: number): string {
  return `${formatNumber(Math.min(value, total))}/${formatNumber(total)}`;
}

/* ------------------------------------------------------------------------------------------ */
/* Relative time                                                                               */
/* ------------------------------------------------------------------------------------------ */

/** 'tra 2h 26min' · 'tra 45s' · 'ora' when the deadline has passed. */
export function formatRelativeCountdown(ms: number): string {
  return ms <= 0 ? 'ora' : `tra ${formatCountdown(ms)}`;
}

/** Remaining time of an expiring perk: 'Ancora 42min' / 'Scaduto'. */
export function formatTimeLeft(ms: number): string {
  return ms <= 0 ? 'Scaduto' : `Ancora ${formatCountdown(ms)}`;
}

export { formatCountdown };
