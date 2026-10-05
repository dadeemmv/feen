/**
 * Display-name rules shared by onboarding ("Come ti chiami?") and Account → profile.
 */
export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 24;

/** Letters (any alphabet, accents included), spaces, apostrophes and hyphens. */
const NAME_PATTERN = /^\p{L}[\p{L}\p{M}' ’-]*$/u;

export type NameIssue = 'empty' | 'short' | 'chars';

/** Trims and collapses inner whitespace ("  anna   maria " → "anna maria"). */
export const cleanName = (value: string) => value.trim().replace(/\s+/g, ' ');

export function validateName(value: string): NameIssue | null {
  const name = cleanName(value);
  if (name.length === 0) return 'empty';
  if (name.length < NAME_MIN_LENGTH) return 'short';
  if (!NAME_PATTERN.test(name)) return 'chars';
  return null;
}

export const NAME_ISSUE_MESSAGES: Record<NameIssue, string> = {
  empty: 'Scrivi il tuo nome per continuare',
  short: `Almeno ${NAME_MIN_LENGTH} lettere`,
  chars: 'Usa solo lettere, spazi e apostrofi',
};

const DEMO_EMAIL_DOMAIN = 'finanz.app';
const DEMO_EMAIL_FALLBACK = 'utente';

/**
 * Demo account e-mail for a new profile, derived from the chosen name (the demo has no real
 * sign-up): "Anna Maria" → "anna.maria@finanz.app", accents dropped.
 */
export function demoEmailFor(name: string): string {
  const local = cleanName(name)
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '');
  return `${local || DEMO_EMAIL_FALLBACK}@${DEMO_EMAIL_DOMAIN}`;
}
