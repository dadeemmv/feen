/**
 * CountUp — a number that counts from `from` to `value` (streak hero "0 → 5 GIORNI DI FILA",
 * lesson-complete rewards "+120 XP"). Eased with motion.easing.enter on a rAF clock; tabular
 * figures keep the width steady. Shows the final value immediately under reduced motion.
 */
import { useEffect, useEffectEvent, useRef, useState } from 'react';

import { duration as durations, easing, type ColorToken, type TextVariant } from '@/theme';

import { formatCount } from './internal/format-count';
import { Text, type TextAlign, type TextProps } from './text';
import { useReduceMotion } from './use-reduce-motion';

export type CountUpProps = {
  value: number;
  /** Start value on mount. Default 0. Later `value` changes count on from the shown number. */
  from?: number;
  /** Default `motion.duration.celebration`. */
  duration?: number;
  /** Wait before counting (ms). Default 0. */
  delay?: number;
  /** Default: Italian grouping (`1.500`). Use it for prefixes/suffixes: `(n) => \`+${n}\``. */
  format?: (value: number) => string;
  /** Default `displayXl`. */
  variant?: TextVariant;
  color?: ColorToken;
  align?: TextAlign;
  onDone?: () => void;
  style?: TextProps['style'];
};

export function CountUp({
  value,
  from = 0,
  duration = durations.celebration,
  delay = 0,
  format = formatCount,
  variant = 'displayXl',
  color = 'text',
  align,
  onDone,
  style,
}: CountUpProps) {
  const reduceMotion = useReduceMotion();
  const instant = reduceMotion || duration <= 0;
  const [shown, setShown] = useState(from);
  // Last rendered number: a later `value` change counts on from here instead of restarting.
  const current = useRef(from);
  const done = useEffectEvent(() => onDone?.());

  useEffect(() => {
    if (instant) {
      current.current = value;
      done();
      return;
    }
    const origin = current.current;
    const ease = easing.enter.factory();
    let frame = 0;
    let start: number | undefined;
    const tick = (now: number) => {
      start ??= now + delay;
      const t = Math.min(1, Math.max(0, (now - start) / duration));
      const next = Math.round(origin + (value - origin) * ease(t));
      current.current = next;
      setShown(next);
      if (t < 1) frame = requestAnimationFrame(tick);
      else done();
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration, delay, instant]);

  return (
    <Text
      variant={variant}
      color={color}
      align={align}
      tabular
      accessibilityLabel={format(value)}
      style={style}>
      {format(instant ? value : shown)}
    </Text>
  );
}
