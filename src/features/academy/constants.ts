/** Academy tab geometry (tokens only; SCREEN_SPECS "Global chrome"). */
import { duration, layout, spacing } from '@/theme';

export const COURSE_CARD = {
  /** Cover band heights. */
  largeCover: 168,
  compactCover: 112,
  /** Carousel card width: share of the content width, clamped. */
  compactRatio: 0.64,
  compactMin: 208,
  compactMax: 252,
} as const;

export const CAROUSEL = {
  gap: spacing.sm,
  /** Horizontal bleed so the carousel scrolls edge to edge under the screen gutter. */
  bleed: layout.screenX,
} as const;

export const ACADEMY_MOTION = {
  /** Entrance stagger between sections / carousel cards. */
  stagger: duration.fast / 2,
} as const;
