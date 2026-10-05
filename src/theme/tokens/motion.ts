/**
 * Motion tokens (shape of Rainbow's `animationConfigs.ts`; durations from Polaris motion +
 * Bluesky custom-animations; springs from Reanimated 4's exported presets).
 *
 * Web parity rule: Reanimated layout animations (`entering`/`exiting`) become CSS keyframes on
 * web and ignore `.springify()`. For anything visible on web, chain
 * `.duration(motion.duration.x).easing(motion.easing.y)` instead of `.springify()`.
 */
import { Easing } from 'react-native-reanimated';

export const duration = {
  instant: 0,
  press: 120,
  fast: 160,
  base: 240,
  slow: 320,
  slower: 420,
  sheet: 480,
  stepEnter: 360,
  stepExit: 240,
  progress: 480,
  celebration: 900,
  shimmer: 1400,
  shimmerPause: 2200,
  typingDot: 320,
  orbBreath: 2400,
  storySegment: 6000,
  toast: 2200,
} as const;

export const easing = {
  /** Default for user-initiated changes. */
  standard: Easing.bezier(0.25, 0.1, 0.25, 1),
  /** Things entering the screen (decelerate). */
  enter: Easing.bezier(0.16, 1, 0.3, 1),
  /** Things leaving the screen (accelerate). */
  exit: Easing.bezier(0.4, 0, 1, 1),
  /** System transitions (step slides). */
  inOut: Easing.bezier(0.42, 0, 0.58, 1),
  /** iOS-like sheet curve (vaul). */
  sheet: Easing.bezier(0.32, 0.72, 0, 1),
  linear: Easing.linear,
} as const;

export const spring = {
  /** Press feedback, toggles, selection. */
  snappy: { damping: 20, stiffness: 320, mass: 0.8 },
  /** Pops, badges, reward icons (visible overshoot). */
  bouncy: { damping: 11, stiffness: 220, mass: 0.9 },
  /** Sheets, cards, layout settling. */
  gentle: { damping: 22, stiffness: 160, mass: 1 },
  /** Sheet release after drag (vaul/gorhom-like). */
  sheetRelease: { damping: 46, stiffness: 680, mass: 0.8 },
} as const;

export const pressScale = {
  /** Big CTAs and cards. */
  large: 0.97,
  /** Chips, icon buttons, story circles, option tiles. */
  small: 0.93,
} as const;

export const motion = { duration, easing, spring, pressScale } as const;
