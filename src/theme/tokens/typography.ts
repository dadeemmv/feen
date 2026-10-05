/**
 * Typography in two layers (Expensify `styles/typography.ts` + Ignite `theme/typography.ts`):
 * 1. `fonts` — family names per weight (RN custom fonts need one family name per weight), loaded
 *    from @expo-google-fonts via `customFontsToLoad`.
 * 2. `textVariants` — semantic roles (Material 3 naming) sized against Apple HIG iOS defaults
 *    (Large Title 34, Title1 28, Title2 22, Headline 17, Body 17, Subhead 15, Footnote 13, Caption 12).
 *
 * Display face: Bricolage Grotesque (brand personality: heroes, big numbers, screen titles).
 * Text face: Plus Jakarta Sans (UI, body, buttons) with tabular figures for money/counters.
 */
import {
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
} from '@expo-google-fonts/bricolage-grotesque';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import type { TextStyle } from 'react-native';

export const customFontsToLoad = {
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
};

export const fonts = {
  display: {
    semiBold: 'BricolageGrotesque_600SemiBold',
    bold: 'BricolageGrotesque_700Bold',
    extraBold: 'BricolageGrotesque_800ExtraBold',
  },
  text: {
    regular: 'PlusJakartaSans_400Regular',
    medium: 'PlusJakartaSans_500Medium',
    semiBold: 'PlusJakartaSans_600SemiBold',
    bold: 'PlusJakartaSans_700Bold',
    extraBold: 'PlusJakartaSans_800ExtraBold',
  },
} as const;

type Variant = Pick<
  TextStyle,
  'fontFamily' | 'fontSize' | 'lineHeight' | 'letterSpacing' | 'textTransform' | 'fontVariant'
>;

export const textVariants = {
  /** Giant numbers: streak count, reward amounts. */
  displayXl: { fontFamily: fonts.display.extraBold, fontSize: 64, lineHeight: 64, letterSpacing: -2 },
  /** Hero headlines: "IL TUO CODICE", "TRAGUARDO RAGGIUNTO", story titles. */
  displayLg: { fontFamily: fonts.display.extraBold, fontSize: 40, lineHeight: 42, letterSpacing: -1 },
  /** Screen titles: "Account", "Shop", "Academy". */
  displayMd: { fontFamily: fonts.display.bold, fontSize: 32, lineHeight: 36, letterSpacing: -0.8 },
  /** Lesson step titles, big card headlines. */
  displaySm: { fontFamily: fonts.display.bold, fontSize: 26, lineHeight: 30, letterSpacing: -0.5 },
  titleLg: { fontFamily: fonts.text.bold, fontSize: 22, lineHeight: 28, letterSpacing: -0.3 },
  titleMd: { fontFamily: fonts.text.bold, fontSize: 18, lineHeight: 24, letterSpacing: -0.2 },
  titleSm: { fontFamily: fonts.text.bold, fontSize: 16, lineHeight: 22, letterSpacing: -0.1 },
  bodyLg: { fontFamily: fonts.text.medium, fontSize: 17, lineHeight: 25, letterSpacing: -0.1 },
  bodyMd: { fontFamily: fonts.text.medium, fontSize: 15, lineHeight: 22 },
  bodySm: { fontFamily: fonts.text.medium, fontSize: 13, lineHeight: 18 },
  labelLg: { fontFamily: fonts.text.bold, fontSize: 16, lineHeight: 20, letterSpacing: -0.1 },
  labelMd: { fontFamily: fonts.text.bold, fontSize: 14, lineHeight: 18 },
  labelSm: { fontFamily: fonts.text.bold, fontSize: 12, lineHeight: 16 },
  overline: {
    fontFamily: fonts.text.extraBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  /** Counters in chips, prices, stats (tabular so values don't jitter while animating). */
  numeric: {
    fontFamily: fonts.text.extraBold,
    fontSize: 15,
    lineHeight: 18,
    fontVariant: ['tabular-nums'],
  },
} as const satisfies Record<string, Variant>;

export type TextVariant = keyof typeof textVariants;
export type FontWeight = keyof typeof fonts.text;
