/**
 * Pro paywall metrics: the hero jewel composition (gem + gold ∞ heart + sparkles) and the timing
 * of the demo activation. Sizes stay on the 4-pt grid or derive from the kit's control metrics.
 */
import { iconSize, tileSize } from '@/components/ui';
import { duration, spacing } from '@/theme';

export const proMetrics = {
  /** Square box holding the hero jewel. */
  heroArt: 152,
  /** Violet gem in the hero. */
  heroGem: 104,
  /** Gold ∞ heart overlapping the gem's lower right. */
  heroHeart: tileSize.xl,
  /** Sparkles around the gem. */
  heroSparkle: iconSize.xl,
  heroSparkleSmall: iconSize.md,
  /** Vertical float of the jewel (pt, each way). */
  floatAmplitude: spacing.xxs,
  /** One float cycle (down + up). */
  floatPeriod: duration.orbBreath,
  /** Benefit icon inside its 40 pt tile. */
  benefitIcon: iconSize.lg,
  /** Entrance stagger between benefit rows / plan cards (ms). */
  entranceStagger: duration.fast / 2,
  /** Simulated "processing" beat of the demo activation (ms). */
  activationDelay: duration.celebration,
  /** Simulated restore lookup (ms). */
  restoreDelay: duration.slower,
} as const;
