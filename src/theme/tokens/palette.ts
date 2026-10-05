/**
 * Reference palette — PRIVATE. Components never import this file: they use the semantic
 * tokens in `colors.ts` through `useTheme()`.
 *
 * Structure follows Radix Colors (radix-ui/colors): every hue is a 12-step scale where
 * 1–2 = app backgrounds, 3–5 = component backgrounds (normal/hover/pressed), 6–8 = borders,
 * 9–10 = solid fills, 11 = low-contrast text, 12 = high-contrast text.
 * Radix advises adding brand scales next to its own instead of editing them, so the Finanz
 * evergreen lives in the custom `forest` scale below.
 */
import {
  amber,
  blackA,
  blue,
  green,
  lime,
  mint,
  olive,
  orange,
  pink,
  red,
  sky,
  violet,
  whiteA,
} from '@radix-ui/colors';

/** Custom brand scale (Radix step semantics) centred on the Finanz evergreen. */
const forest = {
  forest1: '#FAFDFB',
  forest2: '#F2F8F4',
  forest3: '#E3F1E8',
  forest4: '#D2E8DA',
  forest5: '#BEDDCA',
  forest6: '#A5CEB5',
  forest7: '#84BA9A',
  forest8: '#579D77',
  forest9: '#145C3C',
  forest10: '#0F4D32',
  forest11: '#1C6A46',
  forest12: '#0B2E20',
} as const;

/** Deep tones used only for inverted "brand" surfaces (hero cards, streak header, sheets). */
const forestDeep = {
  deep1: '#061A11',
  deep2: '#082317',
  deep3: '#0B2E20',
  deep4: '#0F3A28',
  deep5: '#134731',
  deep6: '#18573C',
} as const;

/** The four companion characters (features/mascots): skin, hair and outfit pairs. */
const characters = {
  skinFrom: '#FFE0CC',
  skinTo: '#F2B48F',
  tanFrom: '#F6C9A3',
  tanTo: '#D48E62',
  skinShade: '#E39A74',
  hairSilverFrom: '#FFFFFF',
  hairSilverTo: '#C9CDD0',
  hairAshFrom: '#D9D3CB',
  hairAshTo: '#9C9389',
  hairDarkFrom: '#5A4334',
  hairDarkTo: '#2A1D15',
  hairHoneyFrom: '#E8C48F',
  hairHoneyTo: '#A9784A',
  suitNavyFrom: '#34466E',
  suitNavyTo: '#1B2540',
  suitRoyalFrom: '#4C6EE6',
  suitRoyalTo: '#2A44AA',
  sweaterFrom: '#9DB4F2',
  sweaterTo: '#5F7BD0',
  khakiFrom: '#D9C29A',
  khakiTo: '#B3955F',
  trouserDark: '#363E55',
  shirt: '#F7F8FA',
  shirtShade: '#DDE2EA',
  tieRed: '#C8303F',
  tieGold: '#E9B23C',
  suspenders: '#B8263A',
  shoe: '#2A211C',
  glassesGold: '#C9A14A',
  glassesBlack: '#1D1F24',
  canRed: '#D93A3A',
  banknoteFrom: '#C9F07A',
  banknoteTo: '#7FBF3B',
  roofFrom: '#F07A5A',
  roofTo: '#C8492F',
  wallCream: '#FFF4E0',
  cheek: '#FF8FA3',
} as const;

/** Economy "jewellery" colours — each item has a gradient pair plus a highlight. */
const economy = {
  flameFrom: '#FFB23F',
  flameTo: '#FF5A1F',
  flameCore: '#FFE07A',
  heartFrom: '#FF6B86',
  heartTo: '#E5294E',
  goldFrom: '#FFD66B',
  goldTo: '#E9A21F',
  kiwiRim: '#C98F2A',
  kiwiRimLight: '#F2C75C',
  kiwiFlesh: '#8BD345',
  kiwiFleshDark: '#5FAE2E',
  kiwiSeed: '#1E2A12',
  kiwiCore: '#F4F1D0',
  shieldFrom: '#6CC4FF',
  shieldTo: '#1E7FE0',
  gemFrom: '#A48BFF',
  gemTo: '#6A4DF4',
} as const;

export const palette = {
  ...olive,
  ...lime,
  ...forest,
  ...forestDeep,
  ...green,
  ...red,
  ...orange,
  ...amber,
  ...mint,
  ...sky,
  ...pink,
  ...violet,
  ...blue,
  ...blackA,
  ...whiteA,
  ...economy,
  ...characters,
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type PaletteKey = keyof typeof palette;
