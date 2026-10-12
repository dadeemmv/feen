/**
 * Semantic colour tokens. Names describe the JOB of a colour (Radix use-case aliases:
 * bg / bgHover / bgActive / border / solid / text), never the hue.
 *
 * Two colour modes (Rainbow's contextual colour-mode pattern):
 * - `light`: the default app canvas.
 * - `brand`: inverted black surfaces (hero card, streak header, invite card, App stories).
 *   A `<ColorModeProvider mode="brand">` makes every Text/Icon inside pick these values.
 */
import { gallery as g, palette as p } from './palette';

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
  // Accent (ink) — the single action colour
  accentBg: string;
  accentBgHover: string;
  accentBgActive: string;
  accentBorder: string;
  accentSolid: string;
  accentSolidPressed: string;
  onAccent: string;
  accentText: string;
  // Brand (night)
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
  // Gallery materials: the pact's paper, its red thread and signature ink, the reward surface
  contract: string;
  thread: string;
  signInk: string;
  reward: string;
  onReward: string;
  // Shadows
  shadow: string;
};

export const lightColors = {
  background: g.paper,
  surface: g.surface,
  surfaceRaised: g.paper,
  surfaceSunken: g.surfaceSunken,
  fill: g.veil,
  fillHover: g.veilHover,
  fillPressed: g.veilPressed,
  scrim: 'rgba(0, 0, 0, 0.48)',

  borderSubtle: g.line,
  border: g.line,
  borderStrong: g.lineStrong,

  text: g.ink,
  textSecondary: g.ink2,
  textTertiary: g.muted,
  textDisabled: g.faint,
  textInverse: g.paper,

  // The action colour is ink: black pills on white, white pills on black (brand mode below).
  accentBg: g.disabled,
  accentBgHover: g.veilHover,
  accentBgActive: g.veilPressed,
  accentBorder: g.ink,
  accentSolid: g.ink,
  accentSolidPressed: g.inkPressed,
  onAccent: g.paper,
  accentText: g.ink,

  brandBg: g.surface,
  brandBorder: g.lineStrong,
  brandSolid: g.ink,
  brandSolidPressed: g.inkPressed,
  onBrand: g.paper,
  brandText: g.ink,
  brandSurface: g.night,
  brandSurfaceRaised: g.night2,

  successBg: g.ok,
  successBorder: g.okLine,
  successSolid: g.okLine,
  successText: g.sproutDeep,
  dangerBg: g.no,
  dangerBorder: g.coral,
  // coral with white labels is ~3:1 → the deep coral keeps AA for the "Chiudi" CTA.
  dangerSolid: g.coralDeep,
  dangerSolidPressed: '#6E1B0C',
  dangerText: g.coralDeep,
  warningBg: g.honeyTint,
  warningSolid: g.honey,
  warningText: g.honeyDeep,
  infoBg: g.cobaltTint,
  infoSolid: g.cobalt,
  infoText: g.cobaltDeep,

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

  // Lesson tints come from the character families (tint + deep text on it).
  tintMint: g.lagoonTint,
  tintMintText: g.lagoonDeep,
  tintSky: g.cobaltTint,
  tintSkyText: g.cobaltDeep,
  tintBlush: g.coralTint,
  tintBlushText: g.coralDeep,
  tintButter: g.honeyTint,
  tintButterText: g.honeyDeep,
  tintLilac: g.stoneTint,
  tintLilacText: g.stoneDeep,

  contract: g.contract,
  thread: g.thread,
  signInk: g.sign,
  reward: g.sprout,
  onReward: g.ink,

  shadow: g.ink,
} as const satisfies SemanticColors;

/** Inverted black surfaces ("night"). Same keys, so a subtree can swap modes safely. */
export const brandColors = {
  ...lightColors,
  background: g.night,
  surface: g.night2,
  surfaceRaised: g.night3,
  surfaceSunken: g.night,
  fill: p.whiteA3,
  fillHover: p.whiteA4,
  fillPressed: p.whiteA5,

  borderSubtle: p.whiteA3,
  border: p.whiteA4,
  borderStrong: p.whiteA6,

  text: g.paper,
  textSecondary: p.whiteA11,
  textTertiary: p.whiteA9,
  textDisabled: p.whiteA6,
  textInverse: g.ink,

  // On black the action pill turns white with a black label.
  accentBg: p.whiteA3,
  accentBorder: g.paper,
  accentSolid: g.paper,
  accentSolidPressed: g.paperPressed,
  onAccent: g.ink,
  // The italic word on black is sprout.
  accentText: g.sprout,
  brandSolid: g.paper,
  brandSolidPressed: g.paperPressed,
  onBrand: g.ink,
  brandText: g.sprout,

  shadow: g.ink,
} as const satisfies SemanticColors;

export type ColorToken = keyof SemanticColors;

/** Gradient pairs (top → bottom / start → end). Used by LinearGradient and SVG icons. */
export const gradients = {
  /** Flat night: the gallery has no gradients on the interface. */
  hero: [g.night, g.night] as const,
  heroSpotlight: ['rgba(255, 255, 255, 0.10)', 'rgba(255, 255, 255, 0)'] as const,
  /** Sprout: progress fills and reward surfaces (never a button). */
  accent: [g.sprout, g.sprout2] as const,
  flame: [p.flameFrom, p.flameTo] as const,
  heart: [p.heartFrom, p.heartTo] as const,
  gold: [p.goldFrom, p.goldTo] as const,
  shield: [p.shieldFrom, p.shieldTo] as const,
  gem: [p.gemFrom, p.gemTo] as const,
  assistant: [g.surface, g.paper] as const,
  academyStory: [g.lagoonTint, g.lagoonTint] as const,
  /** Greyscale pair for locked / muted economy icons. */
  muted: ['#C7C7C7', '#8F8F8F'] as const,
  /** White sweep band for `<Shimmer/>` (transparent → sheen → transparent), any surface. */
  shimmer: ['rgba(255, 255, 255, 0)', p.whiteA7, 'rgba(255, 255, 255, 0)'] as const,
  /** Glossy top highlight on progress fills (white 30% → 0). */
  sheen: [p.whiteA5, 'rgba(255, 255, 255, 0)'] as const,
  /** Unseen story ring (ink). */
  storyRing: [g.ink, g.ink2] as const,
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
  lime: g.sprout,
  limeLight: '#EAFBC2',
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

/**
 * The four animals (features/mascots): base for the illustration, mid for its shading, tint for
 * backgrounds, deep for text on the tint. Also the colours of their buildings in the village.
 */
export const characterColors = {
  volpe: { base: g.coral, mid: '#E2431F', tint: g.coralTint, deep: g.coralDeep },
  castoro: { base: g.cobalt, mid: '#2A44D6', tint: g.cobaltTint, deep: g.cobaltDeep },
  lontra: { base: g.lagoon, mid: '#16A094', tint: g.lagoonTint, deep: g.lagoonDeep },
  scoiattolo: { base: g.honey, mid: '#E89A0C', tint: g.honeyTint, deep: g.honeyDeep },
} as const;

/**
 * Building tones (village and building cards): tint for the card, glow for the halo under it,
 * deep for text on the tint. Buildings without an animal take the colour of their material.
 */
export const buildingTones = {
  cobalt: { tint: g.cobaltTint, glow: g.cobalt, deep: g.cobaltDeep },
  mint: { tint: g.mintTint, glow: g.mint, deep: g.mintDeep },
  coral: { tint: g.coralTint, glow: g.coral, deep: g.coralDeep },
  honey: { tint: g.honeyTint, glow: g.honey, deep: g.honeyDeep },
  wheat: { tint: g.wheatTint, glow: g.honey, deep: g.honeyDeep },
  lagoon: { tint: g.lagoonTint, glow: g.lagoon, deep: g.lagoonDeep },
  leaf: { tint: g.leafTint, glow: g.leaf, deep: g.leafDeep },
  stone: { tint: g.stoneTint, glow: g.stone, deep: g.stoneDeep },
  wood: { tint: g.woodTint, glow: g.wood, deep: g.woodDeep },
} as const;

export type BuildingTone = keyof typeof buildingTones;

/** Gallery inks for places where a raw value is needed (SVG markup, the pact's paper). */
export const galleryColors = {
  sprout: g.sprout,
  sprout2: g.sprout2,
  sproutDeep: g.sproutDeep,
  thread: g.thread,
  contract: g.contract,
  sign: g.sign,
  ink: g.ink,
  paper: g.paper,
} as const;

/**
 * Raw colours of the four companion characters, for their SVG art only (features/mascots):
 * `[base, cel shade]` pairs and single inks. Every outline uses `ink`.
 */
export const mascotColors = {
  ink: p.charInk,
  skin: [p.skinBase, p.skinShade] as const,
  tan: [p.tanBase, p.tanShade] as const,
  hairWhite: [p.hairWhite, p.hairWhiteShade] as const,
  hairAsh: [p.hairAsh, p.hairAshShade] as const,
  hairDark: [p.hairDark, p.hairDarkShade] as const,
  hairHoney: [p.hairHoney, p.hairHoneyShade] as const,
  suitNavy: [p.suitNavy, p.suitNavyShade] as const,
  suitCharcoal: [p.suitCharcoal, p.suitCharcoalShade] as const,
  blazerBlue: [p.blazerBlue, p.blazerBlueShade] as const,
  sweater: [p.sweater, p.sweaterShade] as const,
  khaki: [p.khaki, p.khakiShade] as const,
  trouser: [p.trouser, p.trouserShade] as const,
  shirt: [p.shirt, p.shirtShade] as const,
  tieRed: [p.tieRed, p.tieRedShade] as const,
  paper: [p.paper, p.paperShade] as const,
  roof: [p.roof, p.roofShade] as const,
  rocket: [p.rocketBody, p.rocketShade] as const,
  shoe: p.shoe,
  shoeBrown: p.shoeBrown,
  gold: p.gold,
  frameGold: p.frameGold,
  frameBlack: p.frameBlack,
  lens: p.lens,
  canRed: p.canRed,
  wallCream: p.wallCream,
  flame: p.flame,
  flameCore: p.flameCore,
  cheek: p.cheek,
  mouth: p.mouth,
  tongue: p.tongue,
} as const;
