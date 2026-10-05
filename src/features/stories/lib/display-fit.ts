/**
 * Picks the largest display variant whose text fits a width, so magazine-style headlines
 * ("ACADEMY", "CHI SIAMO??", "IL TUO CODICE") are as big as possible without breaking a word
 * mid-way on narrow phones. Works everywhere (web has no `adjustsFontSizeToFit`).
 */
import { textVariants, type TextVariant } from '@/theme';

/**
 * Average advance of an uppercase Bricolage Grotesque ExtraBold glyph, in em (measured on the
 * story / invite headlines: "ACADEMY" ≈ 4.5 em, "MIGLIORARE" ≈ 6.9 em).
 */
const UPPERCASE_ADVANCE_EM = 0.68;
/** Emoji render about one em wide plus side bearings. */
const EMOJI_ADVANCE_EM = 1.2;
const EMOJI = /\p{Extended_Pictographic}/u;
/** Joins a word to its emoji so they never wrap apart ("MIGLIORARE 💞"). */
export const NBSP = '\u00A0';

export type DisplayFitMode = 'word' | 'line';

function estimateEm(text: string): number {
  let em = 0;
  for (const char of text) {
    if (EMOJI.test(char)) em += EMOJI_ADVANCE_EM;
    else if (char === '️' || char === '‍') continue;
    else if (char === ' ' || char === NBSP) em += UPPERCASE_ADVANCE_EM / 2;
    else em += UPPERCASE_ADVANCE_EM;
  }
  return em;
}

/**
 * - `word` (default): the longest word must fit on one line (the headline may wrap between words;
 *   words joined by `NBSP` count as one).
 * - `line`: the whole text must fit on one line.
 */
export function fitDisplayVariant(
  text: string,
  availableWidth: number,
  candidates: readonly TextVariant[] = ['displayXl', 'displayLg', 'displayMd'],
  mode: DisplayFitMode = 'word',
): TextVariant {
  const pieces = mode === 'line' ? [text] : text.split(/ +/);
  const widestEm = Math.max(...pieces.map(estimateEm));
  for (const variant of candidates) {
    if (widestEm * textVariants[variant].fontSize <= availableWidth) return variant;
  }
  return candidates[candidates.length - 1];
}
