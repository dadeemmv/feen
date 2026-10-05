/**
 * Home geometry (docs/SCREEN_SPECS.md "Home"), expressed through the kit's control metrics and
 * the spacing scale wherever a token exists.
 */
import { HERO_BOOK_SIZE } from '@/components/illustrations';
import { avatarSize, borderWidth, chipHeight, iconSize, tileSize } from '@/components/ui';
import { duration, spacing } from '@/theme';

export const homeMetrics = {
  /** Window heights below this use the compact hero (iPhone SE / mini, 667 pt). */
  compactHeight: 740,
  /** Story circle: 64 pt face, ring + gap around it (redlines: 3 px ring, 2 px gap). */
  storyFace: avatarSize.lg,
  storyRing: borderWidth.ring,
  storyRingGap: borderWidth.thick,
  /** Hero illustration natural ratio (height / width). */
  heroArtRatio: HERO_BOOK_SIZE[1] / HERO_BOOK_SIZE[0],
  /** Compact hero: the artwork box is capped at this height (the art scales down inside it). */
  heroArtCompactHeight: tileSize.xl + spacing.xxl + spacing.xs,
  /** Twinkling sparkles over the hero artwork. */
  heroSparkle: { large: iconSize.md, small: iconSize.sm - spacing.xxxs },
  /** Opacity loop of one sparkle (redlines: 2.4 s, staggered). */
  twinklePeriod: duration.orbBreath,
  /** Milestone reward jewel and the tinted disc behind it (redlines: icon 36). */
  milestoneDisc: tileSize.xl,
  milestoneIcon: avatarSize.sm,
  /** Two lines of `labelSm`, so the three cards keep the same height. */
  milestoneLabelHeight: spacing.xxl,
  /** Footer slot of a milestone card (progress row or claim pill). */
  milestoneFooterHeight: chipHeight.sm,
  /** Gentle pulse of a reached, unclaimed milestone. */
  milestonePulseScale: 1.04,
  milestonePulseHalf: duration.slower * 2,
  /** Delay before the referral promo slides up over a freshly rendered Home. */
  referralPromoDelay: duration.sheet + duration.base,
} as const;
