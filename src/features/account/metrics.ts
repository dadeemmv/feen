/**
 * Control geometry of the Account feature, derived from the kit metrics and the spacing scale
 * (no free-floating numbers in the screens).
 */
import { avatarSize, dialogBadgeSize, iconButtonSize, iconSize } from '@/components/ui';
import { layout, spacing } from '@/theme';

export const accountMetrics = {
  /** Economy icon inside the reward burst (redeem success). */
  rewardIcon: avatarSize.lg,
  /** Lime halo behind the reward icon. */
  rewardHalo: dialogBadgeSize + spacing.xl,
  /** Rating star glyph and its touch target. */
  starGlyph: iconButtonSize.sm,
  starHit: iconButtonSize.lg,
  /** Empty-state artwork (EmptyBox) width. */
  emptyArt: avatarSize.xl * 2,
  /** Avatar preview at the top of the profile editor. */
  profileAvatar: avatarSize.xl,
  /** Emoji avatar inside a picker cell. */
  pickerAvatar: avatarSize.lg,
  /** Avatar picker columns. */
  pickerColumns: 4,
  /** Interest toggles and segmented options: at least the HIG touch target. */
  toggleHeight: layout.minTouch,
  /** Chevron of an accordion row. */
  chevron: iconSize.md,
} as const;
