/**
 * Story viewer geometry, gesture thresholds and timings (docs/SCREEN_SPECS.md "Story viewer",
 * birdwingo/react-native-instagram-stories for the gesture model).
 */
import { avatarSize, borderWidth, tileSize } from '@/components/ui';
import { duration, spacing } from '@/theme';

export const storyMetrics = {
  /** Header avatar (redlines: 32). */
  headerAvatar: tileSize.sm,
  /** Emoji stickers on timeline cards and title emoji (redlines: 36). */
  stickerEmoji: avatarSize.sm,
  /** Timeline cards: max width as a fraction of the content column (redlines: 86 %). */
  cardMaxWidth: 0.86,
  /** Dashed connector between timeline cards (redlines: 2 px, dash 6/6). */
  connectorWidth: borderWidth.thick,
  connectorDash: [6, 6] as const,
  connectorRadius: spacing.sm,
  /** Vertical gap between two timeline cards (room for the connector elbow). */
  timelineGap: { regular: spacing.xxl, compact: spacing.xl },
  /** Sticker tilt (redlines: −6°…−10°). */
  stickerTilt: { academy: -6, poll: -7 },
  /** Emoji sticker tilt on timeline cards (alternates sign). */
  emojiTilt: 10,
  /** How far an emoji sticker overlaps the card edge (fraction of its size). */
  emojiOverlap: 0.45,
  /** Course poster on the Academy page: width (fraction of the column), art height / width. */
  posterWidth: 0.84,
  posterArtRatio: 9 / 16,
  posterArtRatioCompact: 0.42,
  /** Max width of a sticker, as a fraction of the column. */
  stickerMaxWidth: 0.72,
  /** Sticker landing delay after the page appears (ms). */
  stickerDelay: duration.slower + duration.slow,
  /** Fraction of the width on the left that goes back (Instagram: 1/3). */
  backZone: 1 / 3,
  /**
   * Hold this long to pause and hide the chrome; a press released within it counts as a tap
   * (Instagram feel: ~250 ms).
   */
  holdDelay: 250,
  /** A tap may drift this far before it becomes a pan (pt). */
  tapSlop: spacing.sm,
  /** The pan activates after this distance (pt). */
  panActivate: spacing.sm,
  /** Swipe-down dismissal: distance as a fraction of the height, or fling velocity (pt/s). */
  dismissFraction: 0.2,
  dismissVelocity: 800,
  /** Horizontal swipe between groups: distance fraction or fling velocity. */
  switchFraction: 0.25,
  switchVelocity: 500,
  /** Rubber band past the first/last group. */
  edgeResistance: 0.25,
  /** Scale of the story while it is dragged down to close. */
  dragMinScale: 0.86,
  /**
   * Perspective of the cube, as a multiple of the width. 1 + √½ is the value for which both
   * faces exactly fill the screen at the half-way point of the rotation (see `lib/cube.ts`).
   */
  cubePerspective: 1 + Math.SQRT1_2,
  /** Darkening of a face as it turns away. */
  cubeShade: 0.5,
  /** Cube rotation between two groups (ms). */
  cubeDuration: duration.slower + duration.fast,
  /** Page timer: base segment, stretched for text-heavy pages (chars → ms), capped. */
  segmentBase: duration.storySegment,
  segmentCharsPerSecond: 32,
  segmentMaxFactor: 1.6,
  /** After a poll vote the timer waits so the result bars can be read (ms). */
  pollResultHold: duration.celebration * 3,
  /** Reveal of page content (cards, poster, poll) once a page is shown. */
  revealStagger: 110,
  /** Never shrink a page below this scale to fit short screens. */
  minFitScale: 0.78,
  /** Window heights below this use the compact page layout (iPhone SE / mini). */
  compactHeight: 760,
} as const;
