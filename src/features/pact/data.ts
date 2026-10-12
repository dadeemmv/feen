/**
 * The pact (concept board §03): a short contract in five articles, in plain Italian.
 *   Art. 1 · the reason (chosen by the student: a reason of your own gives the pact something to defend)
 *   Art. 2 · the dose (5 · 10 · 15 minutes a day, for 30 days)
 *   Art. 3 · when (an if-then plan hooked onto something you already do — Gollwitzer)
 *   Art. 4 · the partner's clause (their blind spot, learned the hard way)
 *   Art. 5 · the parachute (a skipped day is not a defeat)
 * The underlined words can be tapped to change them. Examples are written for 14–19 year olds.
 */
import type { ReminderSlot } from '@/store';

export const PACT_DAYS = 30;

export const WHY_OPTIONS = [
  'per comprarmi le mie cose senza dover chiedere',
  'per non farmi fregare da offerte e truffe',
  'per mettere da parte per un obiettivo mio',
  'per sapere cosa fare con i primi guadagni',
] as const;

export const DOSE_OPTIONS = [5, 10, 15] as const;

/** Art. 3: the habit the daily dose hooks onto, and the reminder slot it implies. */
export const WHEN_OPTIONS: readonly { text: string; slot: ReminderSlot }[] = [
  { text: 'Quando salgo sul bus per andare a scuola', slot: 'morning' },
  { text: 'Quando finisco i compiti', slot: 'afternoon' },
  { text: 'Quando faccio merenda', slot: 'afternoon' },
  { text: 'Prima di andare a dormire', slot: 'evening' },
];

export const PARACHUTE = 'Se salto un giorno non mollo: riparto il giorno dopo, senza sensi di colpa.';

/** Cycle to the next option (tapping an underlined word). */
export const nextIndex = (index: number, length: number) => (index + 1) % length;

/** "n. 0001". */
export const pactNumber = (n: number) => `n. ${String(n).padStart(4, '0')}`;

/** "12.10.2026". */
export function pactDate(at: number) {
  const d = new Date(at);
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
}

export const slotForWhen = (when: string): ReminderSlot =>
  WHEN_OPTIONS.find((option) => option.text === when)?.slot ?? 'evening';
