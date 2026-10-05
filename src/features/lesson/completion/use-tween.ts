/**
 * 0 → `target` on a rAF clock with the enter easing (same clock as the kit's CountUp, so the
 * accuracy ring and its percentage land together). Instant under reduced motion. JS-driven on
 * purpose: SVG animated props are unreliable on react-native-web.
 */
import { useEffect, useState } from 'react';

import { useReduceMotion } from '@/components/ui';
import { duration as durations, easing } from '@/theme';

export function useTween(target: number, delay = 0, duration: number = durations.celebration): number {
  const reduceMotion = useReduceMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const ease = easing.enter.factory();
    let frame = 0;
    let start: number | undefined;
    const tick = (now: number) => {
      start ??= now + delay;
      const t = Math.min(1, Math.max(0, (now - start) / duration));
      setValue(target * ease(t));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, delay, duration, reduceMotion]);

  return reduceMotion ? target : value;
}
