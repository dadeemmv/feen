/**
 * Typography in two layers (Expensify `styles/typography.ts` + Ignite `theme/typography.ts`):
 * 1. `fonts` — family names per weight (RN custom fonts need one family name per weight), loaded
 *    from @expo-google-fonts via `customFontsToLoad`.
 * 2. `textVariants` — semantic roles (Material 3 naming) sized against Apple HIG iOS defaults
 *    (Large Title 34, Title1 28, Title2 22, Headline 17, Body 17, Subhead 15, Footnote 13, Caption 12).
 *
 * Gallery system (see docs/design/DESIGN.md):
 * - Instrument Sans for everything structural. Headlines are REGULAR: hierarchy comes from size,
 *   never from weight. Bold is always 600; 700 is not loaded.
 * - Instrument Serif for big numbers (`displayXl`) and, in italic, the one word of a headline
 *   that carries the meaning (`fonts.serif.italic`).
 * - Fragment Mono only for real codes (invite code, contract numbers, dates, specs).
 */
import {
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
  InstrumentSans_600SemiBold,
} from '@expo-google-fonts/instrument-sans';
import { InstrumentSerif_400Regular, InstrumentSerif_400Regular_Italic } from '@expo-google-fonts/instrument-serif';
import { FragmentMono_400Regular } from '@expo-google-fonts/fragment-mono';
import type { TextStyle } from 'react-native';

export const customFontsToLoad = {
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
  InstrumentSans_600SemiBold,
  InstrumentSerif_400Regular,
  InstrumentSerif_400Regular_Italic,
  FragmentMono_400Regular,
};

const SANS_REGULAR = 'InstrumentSans_400Regular';
const SANS_MEDIUM = 'InstrumentSans_500Medium';
const SANS_SEMIBOLD = 'InstrumentSans_600SemiBold';

export const fonts = {
  /** Headlines share the text face: same family, regular weight, tighter tracking. */
  display: {
    regular: SANS_REGULAR,
    medium: SANS_MEDIUM,
    semiBold: SANS_SEMIBOLD,
  },
  /** `bold` and `extraBold` stay as names for existing call sites; both resolve to 600. */
  text: {
    regular: SANS_REGULAR,
    medium: SANS_MEDIUM,
    semiBold: SANS_SEMIBOLD,
    bold: SANS_SEMIBOLD,
    extraBold: SANS_SEMIBOLD,
  },
  serif: {
    regular: 'InstrumentSerif_400Regular',
    italic: 'InstrumentSerif_400Regular_Italic',
  },
  mono: {
    regular: 'FragmentMono_400Regular',
  },
} as const;

type Variant = Pick<
  TextStyle,
  'fontFamily' | 'fontSize' | 'lineHeight' | 'letterSpacing' | 'textTransform' | 'fontVariant'
>;

export const textVariants = {
  /** Giant numbers: streak count, reward amounts. Serif, like the numbers of the village. */
  displayXl: { fontFamily: fonts.serif.regular, fontSize: 72, lineHeight: 72, letterSpacing: -1 },
  /** Hero headlines: "Il tuo codice", "Traguardo raggiunto", story titles. */
  displayLg: { fontFamily: fonts.display.regular, fontSize: 40, lineHeight: 40, letterSpacing: -1.8 },
  /** Screen titles: "Account", "Shop", "Academy". */
  displayMd: { fontFamily: fonts.display.regular, fontSize: 34, lineHeight: 36, letterSpacing: -1.4 },
  /** Lesson step titles, big card headlines. */
  displaySm: { fontFamily: fonts.display.regular, fontSize: 26, lineHeight: 30, letterSpacing: -0.8 },
  /** Block titles (24/500 in the board). */
  titleLg: { fontFamily: fonts.text.medium, fontSize: 22, lineHeight: 28, letterSpacing: -0.4 },
  /** Card titles (20/500 in the board, one step smaller on the phone). */
  titleMd: { fontFamily: fonts.text.medium, fontSize: 18, lineHeight: 23, letterSpacing: -0.3 },
  titleSm: { fontFamily: fonts.text.medium, fontSize: 16, lineHeight: 21, letterSpacing: -0.2 },
  bodyLg: { fontFamily: fonts.text.regular, fontSize: 17, lineHeight: 25 },
  bodyMd: { fontFamily: fonts.text.regular, fontSize: 15, lineHeight: 22 },
  bodySm: { fontFamily: fonts.text.regular, fontSize: 13, lineHeight: 18 },
  /** Buttons and strong labels. */
  labelLg: { fontFamily: fonts.text.semiBold, fontSize: 16, lineHeight: 20, letterSpacing: -0.1 },
  labelMd: { fontFamily: fonts.text.semiBold, fontSize: 14, lineHeight: 18 },
  labelSm: { fontFamily: fonts.text.medium, fontSize: 12, lineHeight: 16 },
  /**
   * Card and section labels. Sentence case, sans, 13/500: the copy is already written in
   * sentence case, so no uppercase transform (uppercase mono is reserved for codes).
   */
  overline: {
    fontFamily: fonts.text.medium,
    fontSize: 13,
    lineHeight: 17,
    letterSpacing: 0,
    textTransform: 'none',
  },
  /** Counters in chips, prices, stats (tabular so values don't jitter while animating). */
  numeric: {
    fontFamily: fonts.text.semiBold,
    fontSize: 15,
    lineHeight: 18,
    fontVariant: ['tabular-nums'],
  },
  /** Real codes only: invite code, contract number and articles, dates, specs. */
  code: {
    fontFamily: fonts.mono.regular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
} as const satisfies Record<string, Variant>;

export type TextVariant = keyof typeof textVariants;
export type FontWeight = keyof typeof fonts.text;
