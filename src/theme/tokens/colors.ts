/**
 * Semantic colour tokens. Names describe the JOB of a colour (Radix use-case aliases:
 * bg / bgHover / bgActive / border / solid / text), never the hue.
 *
 * Two colour modes (Rainbow's contextual colour-mode pattern):
 * - `light`: the default app canvas.
 * - `brand`: inverted indigo surfaces (welcome, "Lezione fatta.", toasts, hero cards).
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
  // Accent (indigo) — the single action colour
  accentBg: string;
  accentBgHover: string;
  accentBgActive: string;
  accentBorder: string;
  accentSolid: string;
  accentSolidPressed: string;
  onAccent: string;
  accentText: string;
  // Brand (indigo surfaces)
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
  // Materials: the pact's paper, its red thread and signature ink, the reward surface
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
  scrim: 'rgba(17, 24, 39, 0.48)',

  // No-Line Rule: container hairlines (cards, tiles, list groups) disappear; dividers use `border`.
  borderSubtle: 'transparent',
  border: g.line,
  borderStrong: g.lineStrong,

  text: g.ink,
  textSecondary: g.ink2,
  textTertiary: g.muted,
  textDisabled: g.faint,
  textInverse: g.paper,

  // The action colour is indigo: indigo pills on white, white pills on indigo (brand mode below).
  accentBg: g.indigoTint,
  accentBgHover: g.indigoTintHover,
  accentBgActive: g.indigoTintPressed,
  accentBorder: g.indigo,
  accentSolid: g.indigo,
  accentSolidPressed: g.indigoPressed,
  onAccent: g.paper,
  accentText: g.indigoText,

  brandBg: g.indigoTint,
  brandBorder: g.indigo,
  brandSolid: g.indigo,
  brandSolidPressed: g.indigoPressed,
  onBrand: g.paper,
  brandText: g.indigoText,
  brandSurface: g.indigo,
  brandSurfaceRaised: g.indigoNight,

  successBg: g.greenTint,
  successBorder: g.green,
  successSolid: g.green,
  successText: g.greenDeep,
  dangerBg: g.roseTint,
  dangerBorder: g.rose,
  // Vivid rose for discs and borders, like the vivid green of `successSolid`. White labels on rose
  // are ~2.7:1, so the danger button fills with `dangerText` (deep rose) and presses darker.
  dangerSolid: g.rose,
  dangerSolidPressed: g.roseDeepPressed,
  dangerText: g.roseDeep,
  warningBg: g.sunTint,
  warningSolid: g.sun,
  warningText: g.sunDeep,
  infoBg: g.cyanTint,
  infoSolid: g.cyan,
  infoText: g.cyanDeep,

  // Economy: sun for mattoni and days (Harmony "Streak / XP"), lilac for achievements.
  streak: g.sunDeep,
  streakBg: g.sunTint,
  lives: g.roseDeep,
  livesBg: g.roseTint,
  coin: g.sunDeep,
  coinBg: g.sunTint,
  shield: g.cyanDeep,
  shieldBg: g.cyanTint,
  pro: g.lilacDeep,
  proBg: g.lilacTint,

  // Lesson tints: the palette's tints, with the deep tone for text on them.
  tintMint: g.greenTint,
  tintMintText: g.greenDeep,
  tintSky: g.cyanTint,
  tintSkyText: g.cyanDeep,
  tintBlush: g.roseTint,
  tintBlushText: g.roseDeep,
  tintButter: g.sunTint,
  tintButterText: g.sunDeep,
  tintLilac: g.lilacTint,
  tintLilacText: g.lilacDeep,

  contract: g.contract,
  thread: g.thread,
  signInk: g.sign,
  // Reward moments (first stone, a building finished, the pact signed): lilac, the achievement colour.
  reward: g.lilac,
  onReward: g.ink,

  shadow: g.ink,
} as const satisfies SemanticColors;

/**
 * Inverted indigo surfaces (the brand moments). Same keys, so a subtree can swap modes safely.
 * White on indigo is 4.9:1, so every text level stays white; hierarchy comes from size.
 */
export const brandColors = {
  ...lightColors,
  background: g.indigo,
  surface: g.indigoNight,
  surfaceRaised: g.indigoNight2,
  surfaceSunken: g.indigoNight2,
  fill: p.whiteA3,
  fillHover: p.whiteA4,
  fillPressed: p.whiteA5,

  borderSubtle: 'transparent',
  border: p.whiteA4,
  borderStrong: p.whiteA6,

  text: g.paper,
  textSecondary: g.paper,
  textTertiary: g.paper,
  textDisabled: p.whiteA8,
  textInverse: g.ink,

  // On indigo the action pill turns white with an indigo label.
  accentBg: p.whiteA3,
  accentBorder: g.paper,
  accentSolid: g.paper,
  accentSolidPressed: g.paperPressed,
  onAccent: g.indigo,
  // The italic word on indigo is sun (large text only: 3.2:1).
  accentText: g.sun,
  brandSolid: g.paper,
  brandSolidPressed: g.paperPressed,
  onBrand: g.indigo,
  brandText: g.sun,

  shadow: g.ink,
} as const satisfies SemanticColors;

export type ColorToken = keyof SemanticColors;

/** Gradient pairs (top → bottom / start → end). Used by LinearGradient and SVG icons. */
export const gradients = {
  /** Flat indigo: no gradients on the interface. */
  hero: [g.indigo, g.indigo] as const,
  heroSpotlight: ['rgba(255, 255, 255, 0.10)', 'rgba(255, 255, 255, 0)'] as const,
  /** Indigo: progress fills. */
  accent: [g.indigo, g.indigo] as const,
  flame: [p.flameFrom, p.flameTo] as const,
  heart: [p.heartFrom, p.heartTo] as const,
  gold: [p.goldFrom, p.goldTo] as const,
  shield: [p.shieldFrom, p.shieldTo] as const,
  gem: [p.gemFrom, p.gemTo] as const,
  assistant: [g.surface, g.paper] as const,
  academyStory: [g.greenTint, g.greenTint] as const,
  /** Greyscale pair for locked / muted economy icons. */
  muted: ['#C7C7C7', '#8F8F8F'] as const,
  /** White sweep band for `<Shimmer/>` (transparent → sheen → transparent), any surface. */
  shimmer: ['rgba(255, 255, 255, 0)', p.whiteA7, 'rgba(255, 255, 255, 0)'] as const,
  /** Glossy top highlight on progress fills (white 30% → 0). */
  sheen: [p.whiteA5, 'rgba(255, 255, 255, 0)'] as const,
  /** Unseen story ring (indigo → lilac). */
  storyRing: [g.indigo, g.lilac] as const,
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
  paper: g.paper,
  ink: g.ink,
  /** The old evergreen slots now hold the brand indigo (metal, frames, the logo's letters). */
  forest: g.indigo,
  forestDeep: g.indigoInk,
  forestLight: g.indigoLight,
  /** The old lime slots now hold the palette's green (growth, charts, leaves). */
  lime: g.green,
  limeLight: g.greenLight,
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
  castoro: { base: g.indigo, mid: '#5C4EC4', tint: g.indigoTint, deep: g.indigoDeep },
  lontra: { base: g.cyan, mid: '#00ABD1', tint: g.cyanTint, deep: g.cyanDeep },
  scoiattolo: { base: g.sun, mid: '#E4A72A', tint: g.sunTint, deep: g.sunDeep },
} as const;

/**
 * Building tones (village and building cards): tint for the card, glow for the halo under it,
 * deep for text on the tint. Buildings without an animal take the colour of their material.
 */
export const buildingTones = {
  indigo: { tint: g.indigoTint, glow: g.indigo, deep: g.indigoDeep },
  green: { tint: g.greenTint, glow: g.green, deep: g.greenDeep },
  coral: { tint: g.coralTint, glow: g.coral, deep: g.coralDeep },
  sun: { tint: g.sunTint, glow: g.sun, deep: g.sunDeep },
  wheat: { tint: g.wheatTint, glow: g.sun, deep: g.sunDeep },
  cyan: { tint: g.cyanTint, glow: g.cyan, deep: g.cyanDeep },
  leaf: { tint: g.leafTint, glow: g.leaf, deep: g.leafDeep },
  stone: { tint: g.stoneTint, glow: g.stone, deep: g.stoneDeep },
  wood: { tint: g.woodTint, glow: g.wood, deep: g.woodDeep },
} as const;

export type BuildingTone = keyof typeof buildingTones;

/** Raw palette values for places where a token can't reach (SVG markup, the pact's paper). */
export const galleryColors = {
  indigo: g.indigo,
  indigoTint: g.indigoTint,
  indigoText: g.indigoText,
  sun: g.sun,
  green: g.green,
  rose: g.rose,
  lilac: g.lilac,
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
