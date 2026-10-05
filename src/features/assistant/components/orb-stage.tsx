/**
 * OrbStage — places the breathing orb: big and centred in the upper part of an empty chat
 * ("hero"), then it glides up and shrinks into the top bar once the conversation starts
 * ("docked"). One element animated with translate + scale (no layout jumps); reduced motion
 * switches instantly.
 */
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useReduceMotion } from '@/components/ui';
import { duration, easing } from '@/theme';

import { ORB_PEARL_RATIO } from '../metrics';
import { BreathingOrb } from './breathing-orb';

export type OrbStageProps = {
  docked: boolean;
  thinking: boolean;
  /** Pearl diameter in the hero position. */
  heroSize: number;
  /** Pearl diameter once docked in the top bar. */
  dockedSize: number;
  /** Vertical centre of the hero orb (from the top of the screen). */
  heroCenterY: number;
  /** Vertical centre of the top bar. */
  dockedCenterY: number;
};

export function OrbStage({ docked, thinking, heroSize, dockedSize, heroCenterY, dockedCenterY }: OrbStageProps) {
  const reduceMotion = useReduceMotion();
  const progress = useSharedValue(docked ? 1 : 0);
  const box = heroSize / ORB_PEARL_RATIO;
  const travel = dockedCenterY - heroCenterY;
  const dockedScale = dockedSize / heroSize;

  useEffect(() => {
    const target = docked ? 1 : 0;
    progress.set(reduceMotion ? target : withTiming(target, { duration: duration.slower, easing: easing.enter }));
  }, [docked, progress, reduceMotion]);

  const style = useAnimatedStyle(() => {
    const p = progress.get();
    return { transform: [{ translateY: travel * p }, { scale: 1 + (dockedScale - 1) * p }] };
  });

  return (
    <Animated.View style={[styles.stage, { top: heroCenterY - box / 2, height: box }, style]}>
      <BreathingOrb size={heroSize} thinking={thinking} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  stage: { position: 'absolute', left: 0, right: 0, alignItems: 'center', pointerEvents: 'none' },
});
