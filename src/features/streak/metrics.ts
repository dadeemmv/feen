/**
 * Streak screen metrics (docs/SCREEN_SPECS.md → Streak): brand header ~300 high including the
 * safe area, flame watermark cropped on the right, 40 pt day circles joined by a 40 pt band.
 */
import { tileSize } from '@/components/ui';
import { duration, spacing } from '@/theme';

export const streakMetrics = {
  /** Brand header height below the safe area. */
  heroHeight: 264,
  /** Flame watermark width (artwork is 200×240); it hangs off the right edge. */
  flameWidth: 230,
  /** Share of the flame that is cropped by the right edge. */
  flameCrop: 0.22,
  /** Canvas painted above the hero so an iOS over-scroll never shows the light background. */
  overscrollFill: 1000,
  /** Day circle (and band) diameter. */
  dayCell: 40,
  /** Gap between the circle and the cell edge when the grid is too narrow for 40 pt circles. */
  dayCellMinGap: spacing.xxxs,
  /** Small shield badge on a protected day. */
  dayShield: 14,
  /** Brief loading state of the calendar on first mount (reference video). */
  calendarLoadingMs: duration.slower,
  /** Months the calendar can go back (current month included). */
  calendarMonthsBack: 12,
  /** Illustration in the shield card. */
  shieldArtWidth: 104,
  /** Challenge progress pill. */
  challengePillHeight: tileSize.sm + spacing.xxs,
} as const;
