/**
 * Horizontal step transition: each step is keyed by its id; the new one slides in from the right
 * while the previous one slides out to the left (both absolutely filled, so they overlap during
 * the swap). Durations/easings only (web ignores springs). The step shown on open (fresh or
 * resumed) appears without a slide; reduced motion cross-fades instead.
 */
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInRight, SlideOutLeft } from 'react-native-reanimated';

import { useReduceMotion } from '@/components/ui';
import { duration, easing } from '@/theme';

export type StepStageProps = {
  stepId: string;
  /** Id of the step visible when the lesson opened (no entering animation for it). */
  initialStepId: string;
  children: ReactNode;
};

export function StepStage({ stepId, initialStepId, children }: StepStageProps) {
  const reduceMotion = useReduceMotion();
  const entering =
    stepId === initialStepId
      ? undefined
      : reduceMotion
        ? FadeIn.duration(duration.fast)
        : SlideInRight.duration(duration.stepEnter).easing(easing.enter);
  const exiting = reduceMotion
    ? FadeOut.duration(duration.fast)
    : SlideOutLeft.duration(duration.stepExit).easing(easing.exit);

  return (
    <View style={styles.stage}>
      <Animated.View key={stepId} entering={entering} exiting={exiting} style={StyleSheet.absoluteFill}>
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: { flex: 1, overflow: 'hidden' },
});
