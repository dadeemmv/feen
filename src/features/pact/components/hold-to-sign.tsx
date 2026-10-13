/**
 * "Tieni premuto per firmare": the indigo pill fills with lilac from the left while you hold it
 * (1.1 s). Locked and grey until there is a signature; pressing it then asks for the signature
 * instead. Works with a held Space/Enter, and with a screen reader (a single activation fills it
 * on its own, since holding is not possible there).
 *
 * The finger is followed by the gesture handler, not by the browser's press events: on a phone
 * browser a long press would otherwise select the label, open the callout or context menu, or
 * turn into a scroll, and cancel the hold. The gesture view takes the touch for itself
 * (touch-action none, no selection, no context menu) on iOS, Android and every browser. The
 * pressable inside only handles the keyboard and the screen reader.
 */
import { useState } from 'react';
import { Platform, StyleSheet, View, type GestureResponderEvent, type TextStyle, type ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { controlHeight, PressableScale, Text } from '@/components/ui';
import { haptics } from '@/lib/haptics';
import { duration, radius, spacing, useTheme } from '@/theme';

import { PACT_COPY } from '../copy';

const HOLD_MS = 1100;
/** The finger may wander this far (points) and still be holding. */
const HOLD_SLOP = 60;

export type HoldToSignProps = {
  locked: boolean;
  done: boolean;
  onLockedPress: () => void;
  onComplete: () => void;
};

/** A press that came from the keyboard (web: Space/Enter), not from a finger or a mouse. */
const fromKeyboard = (e: GestureResponderEvent) =>
  Platform.OS === 'web' && String((e.nativeEvent as unknown as { type?: string }).type ?? '').startsWith('key');

export function HoldToSign({ locked, done, onLockedPress, onComplete }: HoldToSignProps) {
  const { colors } = useTheme();
  const progress = useSharedValue(done ? 1 : 0);
  const [width, setWidth] = useState(0);
  // One hold at a time: key repeats and a second begin must not restart the fill.
  const holding = useSharedValue(false);

  const fill = useAnimatedStyle(() => ({ width: `${progress.get() * 100}%` }));

  const start = () => {
    if (done || holding.get()) return;
    if (locked) {
      haptics.warning();
      onLockedPress();
      return;
    }
    holding.set(true);
    haptics.light();
    progress.set(
      withTiming(1, { duration: HOLD_MS, easing: Easing.linear }, (finished) => {
        if (finished) scheduleOnRN(onComplete);
      }),
    );
  };

  const stop = () => {
    holding.set(false);
    // Already full: the pact is being signed, lifting the finger now changes nothing.
    if (done || progress.get() >= 1) return;
    cancelAnimation(progress);
    progress.set(withTiming(0, { duration: duration.fast }));
  };

  // Touch and mouse: the fill starts when the finger lands and stops when it lifts early. It never
  // activates as a long press (the fill decides when the pact is signed), it only follows the hold.
  const hold = Gesture.LongPress()
    .runOnJS(true)
    .minDuration(HOLD_MS * 4)
    .maxDistance(HOLD_SLOP)
    .shouldCancelWhenOutside(false)
    .onBegin(start)
    .onFinalize(stop);

  const label = done ? PACT_COPY.holdDone : locked ? PACT_COPY.holdLocked : PACT_COPY.holdReady;
  const bg = locked && !done ? colors.accentBg : colors.accentSolid;
  const fg = locked && !done ? colors.textTertiary : colors.onAccent;

  return (
    <GestureDetector gesture={hold}>
      <View style={styles.noSelect} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
        <PressableScale
          onPressIn={(e) => {
            if (fromKeyboard(e)) start();
          }}
          onPressOut={(e) => {
            if (fromKeyboard(e)) stop();
          }}
          onLongPress={() => undefined}
          delayLongPress={HOLD_MS * 4}
          accessibilityLabel={label}
          accessibilityState={{ disabled: locked, checked: done }}
          accessibilityActions={[{ name: 'activate' }]}
          onAccessibilityAction={() => start()}
          style={[styles.pill, styles.noSelect, { backgroundColor: bg }]}>
          <View style={styles.labels} pointerEvents="none">
            <Text variant="labelLg" selectable={false} style={[styles.noSelect, { color: fg }]}>
              {label}
            </Text>
          </View>
          {/* The lilac fill carries its own ink label, clipped to the filled part. */}
          <Animated.View style={[styles.fill, { backgroundColor: colors.reward }, fill]} pointerEvents="none">
            <View style={[styles.labels, styles.inner, { width }]}>
              <Text variant="labelLg" selectable={false} style={[styles.noSelect, { color: colors.onReward }]}>
                {label}
              </Text>
            </View>
          </Animated.View>
        </PressableScale>
      </View>
    </GestureDetector>
  );
}

/** Web only: no text selection on the pill and its labels. */
const NO_SELECT = (Platform.OS === 'web' ? { userSelect: 'none', WebkitUserSelect: 'none' } : {}) as ViewStyle & TextStyle;

const styles = StyleSheet.create({
  noSelect: NO_SELECT,
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
