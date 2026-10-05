/**
 * Course-path geometry and motion, expressed in theme tokens (docs/SCREEN_SPECS.md "Course path").
 * Feature-level component metrics, like the kit's `metrics.ts`: screens never inline sizes.
 */
import { borderWidth, chipHeight, iconSize, progressHeight, tileSize } from '@/components/ui';
import { duration, radius, spacing, textVariants } from '@/theme';

import type { PathMetrics } from './path-layout';

/** Collapsing cover: 220 high, parallaxes out under the sticky status row. */
export const COVER = {
  height: 220,
  /** Cover art moves at this fraction of the scroll speed (parallax). */
  parallax: 0.45,
  /** Pull-to-stretch: extra scale per point of overscroll (fraction of the height). */
  stretch: 1,
  /** The art fades to this opacity as it scrolls away. */
  fadeTo: 0.35,
} as const;

/** Compact title strip that slides in under the status row once the title scrolls away. */
export const COMPACT_STRIP = {
  height: spacing.huge - spacing.xs,
  /** Slide distance of the strip's entrance. */
  slide: spacing.xs,
  /** Scroll distance over which the strip fades in. */
  fadeRange: spacing.md,
} as const;

/** Tooltip pill under the current node. */
export const TOOLTIP = {
  height: chipHeight.md,
  caret: spacing.xs,
  /** Distance between the node's bottom edge and the caret tip. */
  offset: spacing.xxs,
} as const;

const TITLE_LINE = textVariants.titleSm.lineHeight;
const FOOTER_LINE = textVariants.labelSm.lineHeight;

export const NODE = {
  tile: tileSize.lg,
  /** Current node ring. */
  ring: borderWidth.thick,
  /** Glow halo around the current node (pt outside the card). */
  glowSpread: spacing.xs,
  radius: radius.xl,
  padding: spacing.sm,
  /** Completed badge (top-right corner, overlapping the edge). */
  badge: iconSize.lg,
  badgeOffset: -spacing.xs + spacing.xxxs,
  /** Accuracy stars on completed nodes. */
  star: iconSize.xs,
  /** Chapter emoji inside the tile. */
  emoji: iconSize.xl,
  /** Session progress bar on the "RIPRENDI DA QUI" node (width as a share of the card). */
  resumeBar: progressHeight.sm,
  resumeBarWidth: '62%',
  footerLine: FOOTER_LINE,
} as const;

export const PATH_METRICS: PathMetrics = {
  nodeWidthRatio: 0.44,
  nodeAspect: 0.9,
  // padding 12 + tile 48 + gap 8 + two title lines 44 + gap 4 + footer 16 + padding 12 = 144.
  nodeMinHeight: NODE.padding * 2 + NODE.tile + spacing.xs + TITLE_LINE * 2 + spacing.xxs + FOOTER_LINE,
  columnInsetRatio: 0,
  nodeGap: spacing.xl + spacing.xxs,
  bannerHeight: tileSize.xl - spacing.xxs,
  bannerGap: spacing.xl,
  levelGap: spacing.xxl,
  goalGap: spacing.xxl,
  tooltipSpace: TOOLTIP.offset + TOOLTIP.caret + TOOLTIP.height + spacing.xs,
  cornerRadius: radius.md,
};

/** Illustration width in empty / unavailable states. */
export const STATE_ART = { width: 160 } as const;

/** "TRAGUARDO RAGGIUNTO" card. */
export const GOAL = {
  /** Trophy illustration width (4:3 artboard). */
  trophyWidth: 200,
} as const;

export const CONNECTOR = {
  width: borderWidth.thick,
  dash: [spacing.xs - spacing.xxxs, spacing.xs - spacing.xxxs] as const,
} as const;

export const PATH_MOTION = {
  /** Entrance stagger between nodes, and the cap on the number of staggered items. */
  stagger: duration.fast / 4,
  staggerCap: 8,
  /** Tooltip bob amplitude and half-cycle. */
  bob: spacing.xxs,
  bobHalf: duration.orbBreath / 4,
  /** Glow pulse (current node). */
  glowHalf: duration.orbBreath / 2,
  glowScale: 1.04,
  /** Halo opacity at rest / at the peak of the breath. */
  glowOpacity: [0.16, 0.45] as const,
  /** Delay before the initial auto-scroll to the current node (after the entrance starts). */
  autoScrollDelay: duration.slower,
  /** The current node is scrolled to this fraction of the viewport height. */
  autoScrollAnchor: 0.32,
  /** Room kept under a node revealed from the first screen. */
  autoScrollMargin: spacing.xl,
  /** Unlock pop start scale. */
  unlockFrom: 0.86,
} as const;
