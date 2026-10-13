/**
 * "Tieni premuto per firmare": the indigo pill fills with lilac from the left while you hold it
 * (1.1 s). Locked and grey until there is a signature; pressing it then asks for the signature
 * instead. Works with a held Space/Enter, and with a screen reader (a single activation fills it
 * on its own, since holding is not possible there).
 *
 * On a phone browser a long press would select the label (or open the callout menu) and cancel
 * the hold: the pill and its labels are not selectable and the context menu is blocked.
 */
import { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, View, type TextStyle, type ViewStyle } from 'react-native';
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
  const root = useRef<View>(null);

  // Web: no context menu (Android Chrome opens it and cancels the touch) and no "copy / look up"
  // callout on iOS Safari (React Native Web drops that style, so it is set on the element).
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const node = root.current as unknown as HTMLElement | null;
    const block = (e: Event) => e.preventDefault();
    node?.style.setProperty('-webkit-touch-callout', 'none');
    node?.addEventListener('contextmenu', block);
    return () => node?.removeEventListener('contextmenu', block);
  }, []);

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
    <View ref={root} style={styles.noSelect}>
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
  );
}

/** Web only: no text selection and no double-tap zoom while holding. */
const NO_SELECT = (Platform.OS === 'web' ? { userSelect: 'none', WebkitUserSelect: 'none', touchAction: 'manipulation' } : {}) as ViewStyle &
  TextStyle;

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
