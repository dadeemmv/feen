/**
 * "Tieni premuto per firmare": the black pill fills with sprout from the left while you hold it
 * (1.1 s). Locked and grey until there is a signature; pressing it then asks for the signature
 * instead. Works with a held Space/Enter, and with a screen reader (a single activation fills it
 * on its own, since holding is not possible there).
 */
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { controlHeight, PressableScale, Text } from '@/components/ui';
import { haptics } from '@/lib/haptics';
import { duration, radius, spacing, useTheme } from '@/theme';

import { PACT_COPY } from '../copy';

const HOLD_MS = 1100;

export type HoldToSignProps = {
  locked: boolean;
  done: boolean;
  onLockedPress: () => void;
  onComplete: () => void;
};

export function HoldToSign({ locked, done, onLockedPress, onComplete }: HoldToSignProps) {
  const { colors } = useTheme();
  const progress = useSharedValue(done ? 1 : 0);
  const [width, setWidth] = useState(0);

  const fill = useAnimatedStyle(() => ({ width: `${progress.get() * 100}%` }));

  const start = () => {
    if (done) return;
    if (locked) {
      haptics.warning();
      onLockedPress();
      return;
    }
    haptics.light();
    progress.set(
      withTiming(1, { duration: HOLD_MS, easing: Easing.linear }, (finished) => {
        if (finished) scheduleOnRN(onComplete);
      }),
    );
  };

  const stop = () => {
    if (done) return;
    cancelAnimation(progress);
    progress.set(withTiming(0, { duration: duration.fast }));
  };

  const label = done ? PACT_COPY.holdDone : locked ? PACT_COPY.holdLocked : PACT_COPY.holdReady;
  const bg = locked && !done ? colors.accentBg : colors.accentSolid;
  const fg = locked && !done ? colors.textTertiary : colors.onAccent;

  return (
    <PressableScale
      onPressIn={start}
      onPressOut={stop}
      onLongPress={() => undefined}
      delayLongPress={HOLD_MS * 4}
      accessibilityLabel={label}
      accessibilityState={{ disabled: locked, checked: done }}
      accessibilityActions={[{ name: 'activate' }]}
      onAccessibilityAction={() => start()}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={[styles.pill, { backgroundColor: bg }]}>
      <View style={styles.labels} pointerEvents="none">
        <Text variant="labelLg" style={{ color: fg }}>
          {label}
        </Text>
      </View>
      {/* The sprout fill carries its own ink label, clipped to the filled part. */}
      <Animated.View style={[styles.fill, { backgroundColor: colors.reward }, fill]} pointerEvents="none">
        <View style={[styles.labels, styles.inner, { width }]}>
          <Text variant="labelLg" style={{ color: colors.onReward }}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  pill: {
    height: controlHeight.lg,
    borderRadius: radius.pill,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  fill: { position: 'absolute', left: 0, top: 0, bottom: 0, overflow: 'hidden' },
  labels: { alignItems: 'center', paddingHorizontal: spacing.lg },
  inner: { position: 'absolute', left: 0, top: 0, bottom: 0, justifyContent: 'center' },
});
