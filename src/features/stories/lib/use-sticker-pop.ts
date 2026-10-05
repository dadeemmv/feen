/**
 * Sticker landing: after `delay`, the sticker fades in while a bouncy spring takes it from a
 * smaller, over-rotated pose to its resting tilt (a sticker slapped on the page). `withSpring`
 * runs in JS on web too, so the overshoot survives there. Static under reduced motion.
 */
import { useEffect } from 'react';
import { useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated';

import { useReduceMotion } from '@/components/ui';
import { duration, spring } from '@/theme';

/** Starting pose of the pop: smaller and twisted a bit further. */
const FROM_SCALE = 0.6;
const FROM_EXTRA_TILT = -8;

export function useStickerPop(tilt: number, delay = 0) {
  const reduceMotion = useReduceMotion();
  const pop = useSharedValue(reduceMotion ? 1 : 0);
  const opacity = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) {
      pop.set(1);
      opacity.set(1);
      return;
    }
    pop.set(withDelay(delay, withSpring(1, spring.bouncy)));
    opacity.set(withDelay(delay, withTiming(1, { duration: duration.fast })));
  }, [reduceMotion, delay, pop, opacity]);

  return useAnimatedStyle(() => {
    const p = pop.get();
    return {
      opacity: opacity.get(),
      transform: [{ rotate: `${tilt + (1 - p) * FROM_EXTRA_TILT}deg` }, { scale: FROM_SCALE + (1 - FROM_SCALE) * p }],
    };
  });
}
