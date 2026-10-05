/**
 * Component metrics — the intrinsic sizes of design-system controls (Material "component tokens").
 * Theme tokens (`@/theme`) cover colour/spacing/radius/type; these cover control dimensions so no
 * component or screen hard-codes a height or an icon size.
 */
import { StyleSheet } from 'react-native';

/** Pill controls: Button, TextField. md/lg satisfy the 44pt HIG touch target. */
export const controlHeight = { sm: 40, md: 48, lg: 56 } as const;

/** Circular IconButton diameters. */
export const iconButtonSize = { sm: 36, md: 40, lg: 48 } as const;

/** Lucide icon sizes (2px stroke). UI icons are 20–24 (Art direction). */
export const iconSize = { xs: 14, sm: 16, md: 20, lg: 24, xl: 28 } as const;
export type IconSizeToken = keyof typeof iconSize;

/** Lucide stroke widths. */
export const iconStroke = { regular: 2, bold: 2.5, heavy: 3 } as const;

/** Chip / StatChip heights. */
export const chipHeight = { sm: 28, md: 34 } as const;

/** Overline Tag height. */
export const tagHeight = { sm: 22, md: 28 } as const;

/** Leading tiles in list rows, shop cards, etc. */
export const tileSize = { sm: 32, md: 40, lg: 48, xl: 56 } as const;

/** Avatar diameters. */
export const avatarSize = { xs: 28, sm: 36, md: 44, lg: 64, xl: 88 } as const;

/** ProgressBar track heights. */
export const progressHeight = { sm: 6, md: 10, lg: 14 } as const;

/** Story segments (SegmentedProgress). */
export const segmentHeight = 3;

/** Dialog overlapping badge. */
export const dialogBadgeSize = 88;

/** Radio circle. */
export const radioSize = { sm: 20, md: 24 } as const;

/** Switch track and thumb (iOS proportions). */
export const switchSize = { width: 50, height: 30, thumb: 26 } as const;

/** Skeleton text line height and the width of a paragraph's last line (fraction). */
export const skeletonLine = { height: 12, lastLineRatio: 0.6 } as const;

/** Count badge (min width/height). */
export const badgeSize = { sm: 16, md: 20 } as const;

/** Sheet grabber. */
export const grabber = { width: 36, height: 5 } as const;

/** Thinnest line the screen can draw. */
export const hairline = StyleSheet.hairlineWidth;

/** Border widths for focus rings / selected options / avatar rings. */
export const borderWidth = { thin: 1, regular: 1.5, thick: 2, ring: 2.5 } as const;

/** Opacity steps used by primitives (disabled, locked content, pressed rows, tracks). */
export const uiOpacity = {
  disabled: 0.45,
  dimmed: 0.55,
  pressed: 0.72,
  track: 0.2,
  storyTrack: 0.35,
  mutedIcon: 0.45,
} as const;

/** Comfortable measure for centred messages (EmptyState, dialogs). */
export const readableWidth = 320;

/** Multiline TextField growth limit. */
export const inputMaxHeight = 128;

/** Stacking order for app-level overlays rendered outside Modals. */
export const zIndex = { tabBar: 10, toast: 1000 } as const;
