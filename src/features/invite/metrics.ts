/**
 * Invite-a-friend geometry and timings.
 */
import { tileSize } from '@/components/ui';
import { duration, spacing } from '@/theme';

export const inviteMetrics = {
  /** Kiwi-slice band on top of the code card. */
  kiwiBandHeight: tileSize.xl * 3,
  /** Letter spacing of the referral code (reads as a code, not a word). */
  codeTracking: spacing.xxs,
  /** The copy glyph stays a check for this long (ms). */
  copiedResetMs: 2000,
  /** Entrance stagger between the screen sections (ms). */
  sectionStagger: duration.fast / 2,
} as const;
