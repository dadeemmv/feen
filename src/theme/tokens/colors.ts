/**
 * Semantic colour tokens. Names describe the JOB of a colour (Radix use-case aliases:
 * bg / bgHover / bgActive / border / solid / text), never the hue.
 *
 * Two colour modes (Rainbow's contextual colour-mode pattern):
 * - `light`: the default app canvas.
 * - `brand`: inverted evergreen surfaces (hero card, streak header, invite card, App stories).
 *   A `<ColorModeProvider mode="brand">` makes every Text/Icon inside pick these values.
 */
import { palette as p } from './palette';

export type SemanticColors = {
  // Canvas & surfaces
  background: string;
  surface: string;
  surfaceRaised: string;
  surfaceSunken: string;
  fill: string;
  fillHover: string;
  fillPressed: string;
  scrim: string;
  // Lines
  borderSubtle: string;
  border: string;
  borderStrong: string;
  // Text
  text: string;
  textSecondary: string;
  textTertiary: string;
  textDisabled: string;
  textInverse: string;
  // Accent (lime) — the single action colour
  accentBg: string;
  accentBgHover: string;
  accentBgActive: string;
  accentBorder: string;
  accentSolid: string;
  accentSolidPressed: string;
  onAccent: string;
  accentText: string;
  // Brand (evergreen)
  brandBg: string;
  brandBorder: string;
  brandSolid: string;
  brandSolidPressed: string;
  onBrand: string;
  brandText: string;
  brandSurface: string;
  brandSurfaceRaised: string;
  // Feedback
  successBg: string;
  successBorder: string;
  successSolid: string;
  successText: string;
  dangerBg: string;
  dangerBorder: string;
  dangerSolid: string;
  dangerSolidPressed: string;
  dangerText: string;
  warningBg: string;
  warningSolid: string;
  warningText: string;
  infoBg: string;
  infoSolid: string;
  infoText: string;
  // Economy
  streak: string;
  streakBg: string;
  lives: string;
  livesBg: string;
  coin: string;
  coinBg: string;
  shield: string;
  shieldBg: string;
  pro: string;
  proBg: string;
  // Lesson content tints (info rows, definition boxes)
  tintMint: string;
  tintMintText: string;
  tintSky: string;
  tintSkyText: string;
  tintBlush: string;
  tintBlushText: string;
  tintButter: string;
  tintButterText: string;
  tintLilac: string;
  tintLilacText: string;
  // Shadows
  shadow: string;
};

export const lightColors = {
  background: p.olive2,
  surface: p.white,
  surfaceRaised: p.olive1,
  surfaceSunken: p.olive3,
  fill: p.olive3,
  fillHover: p.olive4,
  fillPressed: p.olive5,
  scrim: 'rgba(8, 20, 14, 0.48)',

  borderSubtle: p.olive4,
  border: p.olive6,
  borderStrong: p.olive8,

  text: p.olive12,
  textSecondary: p.olive11,
  textTertiary: p.olive9,
  textDisabled: p.olive8,
  textInverse: p.white,

  accentBg: p.lime3,
  accentBgHover: p.lime4,
  accentBgActive: p.lime5,
  accentBorder: p.lime7,
  accentSolid: p.lime9,
  accentSolidPressed: p.lime10,
  onAccent: p.forest12,
  accentText: p.lime11,

  brandBg: p.forest3,
  brandBorder: p.forest7,
  brandSolid: p.forest9,
  brandSolidPressed: p.forest10,
  onBrand: p.white,
  brandText: p.forest11,
  brandSurface: p.deep3,
  brandSurfaceRaised: p.deep5,

  successBg: p.green3,
  successBorder: p.green7,
  successSolid: p.green9,
  // green11 on green3 is 4.2:1 → use a deeper custom step for AA on tinted feedback surfaces.
  successText: '#1A6E48',
  dangerBg: p.red3,
  dangerBorder: p.red7,
  // red9 with white labels is 3.9:1 → red11 keeps AA (4.9:1) for the "Chiudi" CTA.
  dangerSolid: p.red11,
  dangerSolidPressed: '#B42329',
  dangerText: p.red11,
  warningBg: p.amber3,
  warningSolid: p.amber9,
  warningText: p.amber11,
  infoBg: p.blue3,
  infoSolid: p.blue9,
  infoText: p.blue11,

  streak: p.orange9,
  streakBg: p.orange3,
  lives: p.heartTo,
  livesBg: p.red3,
  coin: p.amber11,
  coinBg: p.amber3,
  shield: p.shieldTo,
  shieldBg: p.sky3,
  pro: p.violet9,
  proBg: p.violet3,

  tintMint: p.mint3,
  tintMintText: p.mint11,
  tintSky: p.sky3,
  tintSkyText: p.sky11,
  tintBlush: p.pink3,
  tintBlushText: p.pink11,
  tintButter: p.amber2,
  tintButterText: p.amber11,
  tintLilac: p.violet3,
  tintLilacText: p.violet11,

  shadow: p.forest12,
} as const satisfies SemanticColors;

/** Inverted evergreen surfaces. Same keys, so a subtree can swap modes safely. */
export const brandColors = {
  ...lightColors,
  background: p.deep3,
  surface: p.deep4,
  surfaceRaised: p.deep5,
  surfaceSunken: p.deep2,
  fill: p.whiteA2,
  fillHover: p.whiteA3,
  fillPressed: p.whiteA4,

  borderSubtle: p.whiteA3,
  border: p.whiteA4,
  borderStrong: p.whiteA6,

  text: p.white,
  textSecondary: p.whiteA10,
  textTertiary: p.whiteA8,
  textDisabled: p.whiteA6,
  textInverse: p.forest12,

  accentText: p.lime9,
  brandText: p.lime9,

  shadow: p.black,
} as const satisfies SemanticColors;

export type ColorToken = keyof SemanticColors;

/** Gradient pairs (top → bottom / start → end). Used by LinearGradient and SVG icons. */
export const gradients = {
  hero: [p.deep5, p.deep2] as const,
  heroSpotlight: ['rgba(189, 238, 99, 0.22)', 'rgba(189, 238, 99, 0)'] as const,
  accent: [p.lime9, p.lime10] as const,
  flame: [p.flameFrom, p.flameTo] as const,
  heart: [p.heartFrom, p.heartTo] as const,
  gold: [p.goldFrom, p.goldTo] as const,
  shield: [p.shieldFrom, p.shieldTo] as const,
  gem: [p.gemFrom, p.gemTo] as const,
  assistant: [p.lime4, p.olive2] as const,
  academyStory: [p.mint3, p.mint5] as const,
  /** Greyscale pair for locked / muted economy icons. */
  muted: [p.olive7, p.olive9] as const,
  /** White sweep band for `<Shimmer/>` (transparent → sheen → transparent), any surface. */
  shimmer: ['rgba(255, 255, 255, 0)', p.whiteA7, 'rgba(255, 255, 255, 0)'] as const,
  /** Glossy top highlight on progress fills (white 30% → 0). */
  sheen: [p.whiteA5, 'rgba(255, 255, 255, 0)'] as const,
  /** Unseen story ring (lime → mint). */
  storyRing: [p.lime9, p.mint9] as const,
  /** Soft violet halo behind the Pro gem on evergreen (gemFrom @ 40% → 0). Appended by features/pro. */
  proGlow: ['rgba(164, 139, 255, 0.4)', 'rgba(164, 139, 255, 0)'] as const,
} as const;

/** Raw economy colours for custom SVG illustrations/icons only. */
export const illustration = {
  kiwiRim: p.kiwiRim,
  kiwiRimLight: p.kiwiRimLight,
  kiwiFlesh: p.kiwiFlesh,
  kiwiFleshDark: p.kiwiFleshDark,
  kiwiSeed: p.kiwiSeed,
  kiwiCore: p.kiwiCore,
  flameCore: p.flameCore,
  paper: p.olive1,
  ink: p.olive12,
  forest: p.forest9,
  forestDeep: p.deep3,
  forestLight: p.forest5,
  lime: p.lime9,
  limeLight: p.lime4,
  white: p.white,
  whiteSoft: p.whiteA8,
  mint: p.mint5,
  sky: p.sky6,
  blush: p.pink5,
  gold: p.goldFrom,
  goldDeep: p.goldTo,
  red: p.red9,
  wax: p.red10,
  orange: p.orange9,
  /** Greyscale details for muted/locked icons (pairs with `gradients.muted`). */
  mutedLight: p.olive5,
  mutedDeep: p.olive11,
  /** Deeper blush for shading pink illustrations (piggy bank). */
  blushDeep: p.pink8,
} as const;
