/**
 * Lesson-player geometry (docs/SCREEN_SPECS.md "Lesson player"), expressed through the kit's
 * control metrics and the spacing scale so screens never inline sizes.
 */
import { controlHeight, iconSize, tileSize } from '@/components/ui';
import { spacing } from '@/theme';

export const lessonMetrics = {
  /** AI sparkle button (circle) and its expanded pill height. */
  fabSize: tileSize.xl,
  fabPillHeight: controlHeight.md + spacing.xxs,
  fabIcon: iconSize.lg + spacing.xxxs,
  /** Distance between the FAB and the footer (regular / compact windows). */
  fabGap: spacing.md,
  fabBottom: { regular: spacing.lg, compact: spacing.sm },
  /** Graded option tiles (≥ 56 per redlines). */
  optionMinHeight: controlHeight.lg,
  /** Order-step slots (regular / compact; compact still ≥ 44 touch target). */
  slotMinHeight: { regular: controlHeight.md, compact: controlHeight.sm + spacing.xxs },
  /** True / false tiles are a little taller (icon disc + label). */
  booleanTileHeight: controlHeight.lg + spacing.xs,
  /** Trailing status disc inside an option tile. */
  statusDisc: iconSize.lg,
  /** Spot art height on graded cards: 120–160 per redlines; compact below `compactHeight`. */
  artHeight: { regular: tileSize.xl * 2 + spacing.xl + spacing.xs, compact: tileSize.xl + spacing.xl },
  /** Emoji art when a step has no illustration. */
  emojiArt: tileSize.xl + spacing.xl,
  /** Window heights below this use the compact layout (iPhone SE / mini). */
  compactHeight: 720,
  /** Inline emoji before info/definition titles. */
  titleEmoji: iconSize.xl + spacing.xxs,
  /** Leading emoji inside info rows. */
  rowEmoji: iconSize.lg - spacing.xxxs,
  /** Pop of a tile that turns correct (subtle; the dialog carries the big moment). */
  correctPopScale: 1.04,
  /** Accent bar on the definition box. */
  accentBar: spacing.xxs,
} as const;

/** Assistant "thinking" time before the reply starts typing (ms). */
export const THINKING_MS = 1200;
/** Typewriter speed: characters revealed per tick, tick length (ms). */
export const TYPEWRITER = { charsPerTick: 3, tickMs: 24 } as const;
/** How long a wrong match pair stays red before resetting (ms). */
export const MATCH_MISS_MS = 520;
/** Brief success flash on a correct match pair before it settles (ms). */
export const MATCH_LOCK_MS = 420;
/** Staggered entrance of info rows / completion blocks (ms). */
export const STAGGER = { baseMs: 180, stepMs: 90, popMs: 120 } as const;
/** Emoji line box relative to its font size (avoids clipping). */
export const EMOJI_LINE_HEIGHT = 1.25;

/** Explain sheet: thread height as a share of the window, its floor, and the sheet chrome around it. */
export const EXPLAIN_THREAD = { ratio: 0.44, min: 160, chrome: 196 } as const;
/**
 * Completion screen: accuracy ring inside the stat tile, the streak flame, the hero medal (regular
 * / compact), its halo ring, the emoji size relative to the medal, and the reveal cadence.
 */
export const COMPLETION = {
  ring: iconSize.xl,
  ringStroke: spacing.xxs,
  flame: tileSize.lg - spacing.xxs,
  medal: tileSize.xl * 2,
  medalCompact: tileSize.xl + tileSize.lg,
  haloRing: spacing.sm,
  medalEmojiRatio: 0.46,
  revealMs: 140,
  /** First stat counter starts once the hero has popped. */
  statsDelayMs: 520,
  /** Streak strip and next-up cards follow the counters. */
  streakDelayMs: 900,
  nextDelayMs: 1100,
  ctaDelayMs: 1250,
} as const;
