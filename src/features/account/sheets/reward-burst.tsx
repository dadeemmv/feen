/**
 * RewardBurst — a lime halo that blooms open while the reward icon pops in with the bouncy
 * spring (visible overshoot). Springs run in JS on web, so the pop survives there too.
 * Under reduced motion everything is shown at rest.
 */
import { useEffect, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { feedbackMotion, hairline, popAnimation, useReduceMotion } from '@/components/ui';
import { duration, easing, radius, useTheme } from '@/theme';

import { accountMetrics } from '../metrics';

export function RewardBurst({ children }: { children: ReactNode }) {
  const { colors } = useTheme();
  const reduceMotion = useReduceMotion();
  const halo = useSharedValue(reduceMotion ? 1 : 0);
  const icon = useSharedValue(reduceMotion ? 1 : feedbackMotion.popFromScale);
  const iconOpacity = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) return;
    halo.set(withTiming(1, { duration: duration.slower, easing: easing.enter }));
    icon.set(withDelay(duration.press, popAnimation()));
    iconOpacity.set(withDelay(duration.press, withTiming(1, { duration: duration.fast })));
  }, [reduceMotion, halo, icon, iconOpacity]);

  const haloStyle = useAnimatedStyle(() => ({ opacity: halo.get(), transform: [{ scale: halo.get() }] }));
  const iconStyle = useAnimatedStyle(() => ({ opacity: iconOpacity.get(), transform: [{ scale: icon.get() }] }));

  return (
    <View style={styles.root} aria-hidden>
      <Animated.View
        style={[
          styles.halo,
          { backgroundColor: colors.accentBg, borderColor: colors.accentBorder },
          haloStyle,
        ]}
      />
      <Animated.View style={iconStyle}>{children}</Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: accountMetrics.rewardHalo,
    height: accountMetrics.rewardHalo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    ...StyleSheet.absoluteFill,
    borderRadius: radius.pill,
    borderWidth: hairline,
  },
});
