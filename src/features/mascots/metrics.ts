/**
 * Geometry of the personality test and the mascot screens, from the kit's metrics where a token
 * exists.
 */
import { avatarSize, borderWidth, iconSize, progressHeight, tileSize } from '@/components/ui';
import { duration, layout, spacing } from '@/theme';

export const mascotMetrics = {
  /** Agreement circles, extremes → centre (16Personalities rhythm: big, medium, small, smallest). */
  likertDiameters: [tileSize.lg - spacing.xxs, tileSize.md - spacing.xxs, iconSize.xl, iconSize.md + spacing.xxs] as const,
  /** Each circle sits in a full touch target. */
  likertTarget: layout.minTouch,
  likertBorder: borderWidth.thick + borderWidth.thin / 2,
  /** Pause after a tap before the next statement slides in (the choice stays visible). */
  advanceDelay: duration.base + duration.fast,
  /** Mascot art sizes: reveal hero, intro lineup, greeting / list row. */
  revealArt: avatarSize.xl * 2,
  lineupArt: tileSize.xl + spacing.xl,
  readyArt: avatarSize.xl + spacing.xxxl,
  greetingArt: tileSize.xl,
  rowArt: tileSize.md,
  traitBar: progressHeight.md,
} as const;
