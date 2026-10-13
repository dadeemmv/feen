/**
 * Reference palette — PRIVATE. Components never import this file: they use the semantic
 * tokens in `colors.ts` through `useTheme()`.
 *
 * Structure follows Radix Colors (radix-ui/colors): every hue is a 12-step scale where
 * 1–2 = app backgrounds, 3–5 = component backgrounds (normal/hover/pressed), 6–8 = borders,
 * 9–10 = solid fills, 11 = low-contrast text, 12 = high-contrast text.
 * Radix advises adding brand colours next to its scales instead of editing them, so the Feen
 * palette lives in `gallery` below.
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

/**
 * Feen palette (docs/design/DESIGN.md, Harmony): a white canvas, blue (#2B64F4, tokens still named `indigo`) as the brand signature,
 * vivid colours for rewards and states, cool greys on the Harmony background. Each colour has a
 * tint (backgrounds) and a deep tone (text on the tint, AA). The four animals take the palette's
 * hues, except the Volpe, who keeps her coral; building materials stay natural.
 */
export const gallery = {
  // Neutrals (cool, like the Harmony background)
  ink: '#111827',
  ink2: '#374151',
  muted: '#646B78',
  faint: '#9CA3AF',
  paper: '#FFFFFF',
  surface: '#F8F9FB',
  surfaceSunken: '#EEF0F4',
  line: 'rgba(17, 24, 39, 0.08)',
  lineStrong: 'rgba(17, 24, 39, 0.2)',
  veil: 'rgba(17, 24, 39, 0.055)',
  veilHover: 'rgba(17, 24, 39, 0.08)',
  veilPressed: 'rgba(17, 24, 39, 0.11)',
  disabled: '#ECEEF2',
  // Brand: blue #2B64F4 (from 13/10/2026; the tokens keep the name `indigo`). `indigoText` is the indigo for small text (AA on white and on the tint);
  // `indigoNight*` are the cards on indigo surfaces; `paperPressed` is a white pill pressed on indigo.
  indigo: '#2B64F4',
  indigoPressed: '#1752E8',
  indigoTint: '#E7EEFD',
  indigoTintHover: '#DDE6FC',
  indigoTintPressed: '#D2DEFB',
  indigoText: '#184ED8',
  indigoDeep: '#1847BF',
  indigoLight: '#9FB9F9',
  indigoInk: '#1B3474',
  indigoNight: '#1C54E3',
  indigoNight2: '#2050C8',
  paperPressed: '#E9EEFC',
  // Rewards and states (Harmony "uso dei colori"): sun = mattoni and the days of the pact,
  // green = right / positive, rose = wrong / loss, cyan = insight, lilac = achievements.
  sun: '#FFCC4D',
  sunTint: '#FFF6DF',
  sunDeep: '#855D00',
  green: '#22C55E',
  greenTint: '#E0F7E8',
  greenLight: '#BDEECF',
  greenDeep: '#166534',
  rose: '#FF6B8B',
  roseTint: '#FFEAEF',
  roseDeep: '#BE123C',
  roseDeepPressed: '#9C0F31',
  cyan: '#00D1FF',
  cyanTint: '#DBF9FF',
  cyanDeep: '#00708A',
  lilac: '#B794F6',
  lilacTint: '#F5F0FE',
  lilacDeep: '#6D28D9',
  // The world: the Volpe's coral and the natural materials of the buildings.
  coral: '#FF5B3A',
  coralTint: '#FFE0D8',
  coralDeep: '#8A2310',
  leaf: '#6CC04A',
  leafTint: '#E3F4CC',
  leafDeep: '#3A6B1F',
  wheatTint: '#FFEBB8',
  wood: '#C49460',
  woodTint: '#F3E6D3',
  woodDeep: '#6B4A26',
  stone: '#9C9384',
  stoneTint: '#ECE9E3',
  stoneDeep: '#4A443A',
  // The pact: warm paper, the red thread, the signature in deep brand blue.
  contract: '#F6F1E6',
  thread: '#D42B26',
  sign: '#1847BF',
} as const;

/**
 * The four companion characters (features/mascots), cartoon style: flat base colours, one cel
 * shade each, a single ink for every outline.
 */
const characters = {
  charInk: '#1F2328',
  skinBase: '#FFD2B3',
  skinShade: '#F1AE88',
  tanBase: '#F2BE94',
  tanShade: '#D9946A',
  hairWhite: '#F4F5F2',
  hairWhiteShade: '#C9CDD0',
  hairAsh: '#9C8F84',
  hairAshShade: '#7A6E64',
  hairDark: '#4A3426',
  hairDarkShade: '#2E2018',
  hairHoney: '#E4B56E',
  hairHoneyShade: '#C08B47',
  suitNavy: '#2C3A5C',
  suitNavyShade: '#1E2842',
  suitCharcoal: '#27313A',
  suitCharcoalShade: '#1A2128',
  blazerBlue: '#3F63E0',
  blazerBlueShade: '#2C47B0',
  sweater: '#8FA7EE',
  sweaterShade: '#6C86D6',
  khaki: '#D7BE8E',
  khakiShade: '#B89E6C',
  trouser: '#34394A',
  trouserShade: '#262A37',
  shirt: '#FFFFFF',
  shirtShade: '#DCE3EC',
  tieRed: '#E0433F',
  tieRedShade: '#B8302D',
  shoe: '#2B2523',
  shoeBrown: '#6B4A32',
  gold: '#F2BE3A',
  frameGold: '#C9953A',
  frameBlack: '#1F2328',
  lens: '#1F2328',
  canRed: '#E2443C',
  paper: '#FBF8EF',
  paperShade: '#E7E1D0',
  roof: '#EE6B4D',
  roofShade: '#C94F36',
  wallCream: '#FFF3DC',
  rocketBody: '#F4F6FA',
  rocketShade: '#CDD5E1',
  flame: '#FFB23F',
  flameCore: '#FFE07A',
  cheek: '#FF8E8E',
  mouth: '#7A2230',
  tongue: '#FF7A7A',
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
