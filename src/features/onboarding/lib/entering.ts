/**
 * Reduced-motion-aware entering animations for staggered screen content (onboarding steps,
 * Account blocks). Layout animations use `.duration().easing()` so web gets the same motion
 * (web ignores `.springify()`).
 */
import { FadeIn, FadeInDown, FadeInRight, FadeOut } from 'react-native-reanimated';

import { useReduceMotion } from '@/components/ui';
import { duration, easing } from '@/theme';

/** Delay between two staggered items. */
export const STAGGER_MS = duration.fast / 4;

export function useEntering() {
  const reduceMotion = useReduceMotion();
  const delay = (index: number, base: number) => base + index * STAGGER_MS;
  return {
    /** Fade + rise: blocks of a screen, in reading order. */
    rise: (index = 0, base = 0) =>
      reduceMotion ? undefined : FadeInDown.duration(duration.slow).easing(easing.enter).delay(delay(index, base)),
    /** Fade + slide from the right: step content after "Continua". */
    slide: (index = 0, base = 0) =>
      reduceMotion ? undefined : FadeInRight.duration(duration.slow).easing(easing.enter).delay(delay(index, base)),
    /** Plain fade (also under reduced motion, shorter). */
    fade: (index = 0, base = 0) =>
      reduceMotion
        ? FadeIn.duration(duration.fast)
        : FadeIn.duration(duration.base).easing(easing.standard).delay(delay(index, base)),
    fadeOut: () => FadeOut.duration(reduceMotion ? duration.instant : duration.fast).easing(easing.exit),
  };
}
