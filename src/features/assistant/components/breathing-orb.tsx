/**
 * BreathingOrb — the Coach's living avatar: the AssistantOrb pearl breathing (scale) inside a
 * glowing halo (opacity + scale), with a rim glint slowly orbiting the pearl. While a reply is
 * being written (`thinking`) everything speeds up and swells a little.
 *
 * `size` is the visible pearl diameter; the component box is larger (`size / ORB_PEARL_RATIO`)
 * to leave room for the halo. Reduced motion: a still orb (no loops).
 */
import { useEffect } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { AssistantOrb } from '@/components/illustrations';
import { useReduceMotion } from '@/components/ui';
import { duration, easing, radius } from '@/theme';

import { ORB_BREATH_SCALE, ORB_PEARL_RATIO, ORB_SPIN_MS, ORB_THINKING_SPEEDUP } from '../metrics';
import { OrbHalo, OrbSheen } from './orb-layers';

/** Halo swing: opacity floor and extra scale at the top of a breath. */
const HALO = { minOpacity: 0.55, scale: 0.1, thinkingScale: 0.18 } as const;

export type BreathingOrbProps = {
  /** Visible pearl diameter. */
  size: number;
  /** A reply is being written: faster, deeper breathing. */
  thinking?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function BreathingOrb({ size, thinking = false, style }: BreathingOrbProps) {
  const reduceMotion = useReduceMotion();
  const box = size / ORB_PEARL_RATIO;
  const breath = useSharedValue(0);
  const spin = useSharedValue(0);
  const depth = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      cancelAnimation(breath);
      cancelAnimation(spin);
      breath.set(withTiming(0, { duration: duration.fast }));
      return;
    }
    const speed = thinking ? ORB_THINKING_SPEEDUP : 1;
    const half = { duration: duration.orbBreath / 2 / speed, easing: easing.inOut };
    breath.set(withRepeat(withSequence(withTiming(1, half), withTiming(0, half)), -1, false));
    // From the current angle to one turn later: repeats are seamless and a speed change never jumps.
    const from = spin.get();
    spin.set(withRepeat(withTiming(from + 1, { duration: ORB_SPIN_MS / speed, easing: Easing.linear }), -1, false));
    return () => {
      cancelAnimation(breath);
      cancelAnimation(spin);
    };
  }, [breath, spin, thinking, reduceMotion]);

  useEffect(() => {
    depth.set(withTiming(thinking ? 1 : 0, { duration: duration.slow, easing: easing.standard }));
  }, [depth, thinking]);

  const haloStyle = useAnimatedStyle(() => {
    const b = breath.get();
    const extra = HALO.scale + (HALO.thinkingScale - HALO.scale) * depth.get();
    return {
      opacity: HALO.minOpacity + (1 - HALO.minOpacity) * b,
      transform: [{ scale: 1 + extra * b }],
    };
  });

  const pearlStyle = useAnimatedStyle(() => {
    const amplitude = ORB_BREATH_SCALE.rest + (ORB_BREATH_SCALE.thinking - ORB_BREATH_SCALE.rest) * depth.get();
    return { transform: [{ scale: 1 + (amplitude - 1) * breath.get() }] };
  });

  const sheenStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${spin.get() * 360}deg` }] }));

  const inset = (box - size) / 2;

  return (
    <View aria-hidden style={[styles.root, { width: box, height: box }, style]}>
      <Animated.View style={[StyleSheet.absoluteFill, haloStyle]}>
        <OrbHalo size={box} />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, pearlStyle]}>
        <AssistantOrb halo={false} width={box} height={box} />
        <View style={[styles.sheenClip, { top: inset, left: inset, width: size, height: size }]}>
          <Animated.View style={[StyleSheet.absoluteFill, sheenStyle]}>
            <OrbSheen size={size} />
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { pointerEvents: 'none' },
  sheenClip: { position: 'absolute', borderRadius: radius.pill, overflow: 'hidden' },
});
