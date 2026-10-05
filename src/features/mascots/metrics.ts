/**
 * Geometry of the personality test and the mascot screens, from the kit's metrics where a token
 * exists.
 */
import { avatarSize, borderWidth, iconSize, tileSize } from '@/components/ui';
import { duration, layout, spacing } from '@/theme';

export const mascotMetrics = {
  /** Agreement circles, extremes → centre (16Personalities rhythm: big, medium, small, smallest). */
  likertDiameters: [tileSize.lg - spacing.xxs, tileSize.md - spacing.xxs, iconSize.xl, iconSize.md + spacing.xxs] as const,
  /** Each circle sits in a full touch target. */
  likertTarget: layout.minTouch,
  likertBorder: borderWidth.thick + borderWidth.thin / 2,
  /** Pause after a tap before the next statement slides in (the choice stays visible). */
  advanceDelay: duration.base + duration.fast,
  /** Character art: full-figure heights (reveal, ready, lineups) and bust widths (greeting, rows, compass). */
  revealArtHeight: avatarSize.xl * 2 + spacing.xxxl,
  readyArtHeight: avatarSize.xl * 2,
  lineupArtHeight: avatarSize.xl + spacing.xl,
  greetingBust: tileSize.xl + spacing.xs,
  rowBust: tileSize.md - spacing.xxs,
  compassBust: tileSize.lg,
  /** Compass: the user's dot, the other quadrants' strength, the axis cross. */
  compassDot: iconSize.md + spacing.xxs,
  compassDimmed: 0.45,
  compassAxisOpacity: 0.25,
} as const;
