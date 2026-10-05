/**
 * Shop layout metrics (docs/SCREEN_SPECS.md → Shop): the product art band is 150 high and holds a
 * big economy icon cropped by the band's bottom edge, with the amount pill centred on it.
 */
import { controlHeight, dialogBadgeSize, iconSize } from '@/components/ui';
import { duration } from '@/theme';

export const shopMetrics = {
  /** Height of the tinted illustration band on top of every product card. */
  artBandHeight: 150,
  /** Big economy icon inside the band. */
  artIconSize: 136,
  /** Share of the big icon that hangs below the band edge (cropped). */
  artIconDrop: 0.2,
  /** Amount pill on the art ("+100", "1h"). */
  amountPillHeight: controlHeight.sm,
  amountPillIcon: iconSize.md,
  /** Price pill in the card body. */
  priceIcon: iconSize.sm,
  /** Purchase-sheet medallion (same diameter as dialog badges). */
  medallion: dialogBadgeSize,
  medallionIcon: 52,
  /** Entrance stagger between product cards (ms). */
  entranceStagger: duration.fast / 2,
  /** How long the purchase sheet shows its success state before closing itself (ms). */
  successHold: duration.celebration + duration.slow,
  /** Kiwi coin inside the daily-reward dialog badge (88 pt). */
  rewardBadgeIcon: 60,
  /** Gem on the Pro banner. */
  proBannerIcon: 56,
} as const;
