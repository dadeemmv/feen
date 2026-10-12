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

/**
 * Gallery palette (docs/design/DESIGN.md, "Il plastico in galleria"): pure black and white for
 * the structure, one sprout green for rewards, a red thread for the pact, and four character
 * families (base · tint · deep text on the tint) that live only in the world.
 */
export const gallery = {
  ink: '#000000',
  ink2: '#444444',
  muted: '#6B6B6B',
  faint: '#A3A3A3',
  paper: '#FFFFFF',
  surface: '#F4F4F4',
  surfaceSunken: '#EBEBEB',
  line: 'rgba(0, 0, 0, 0.08)',
  lineStrong: 'rgba(0, 0, 0, 0.2)',
  veil: 'rgba(0, 0, 0, 0.055)',
  veilHover: 'rgba(0, 0, 0, 0.08)',
  veilPressed: 'rgba(0, 0, 0, 0.11)',
  inkPressed: '#262626',
  paperPressed: '#E6E6E6',
  night: '#000000',
  night2: '#161616',
  night3: '#222222',
  disabled: '#E8E8E8',
  contract: '#F6F1E6',
  sprout: '#CFF56A',
  sprout2: '#B8E04F',
  sproutDeep: '#3F5A00',
  thread: '#D42B26',
  honey: '#FFB627',
  honeyTint: '#FFF0CC',
  honeyDeep: '#7A4A00',
  cobalt: '#3B5BFF',
  cobaltTint: '#DDE3FF',
  cobaltDeep: '#16247A',
  lagoon: '#1FBFB0',
  lagoonTint: '#D2F4F0',
  lagoonDeep: '#0A554E',
  coral: '#FF5B3A',
  coralTint: '#FFE0D8',
  coralDeep: '#8A2310',
  stone: '#9C9384',
  stoneTint: '#ECE9E3',
  stoneDeep: '#4A443A',
  ok: '#E9F9D0',
  okLine: '#7DB321',
  no: '#FFE6E1',
  sign: '#1B2A8A',
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
