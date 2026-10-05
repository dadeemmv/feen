/**
 * ProJewel — the paywall's hero mark: the violet Pro gem on a soft violet halo, the gold ∞ heart
 * (unlimited lives, the headline benefit) tucked on its lower right and two twinkling sparkles.
 * The jewel floats gently; under reduced motion everything is static.
 */
import { useEffect, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { GemIcon, HeartInfinityIcon, SparkleIcon } from '@/components/icons';
import { Spotlight, uiOpacity, useReduceMotion } from '@/components/ui';
import { PopIn } from '@/features/lives/components/pop-in';
import { duration, gradients, radius } from '@/theme';

import { proMetrics } from '../metrics';

const HALO_ORIGIN = { x: 0.5, y: 0.5 };
const HALO_REACH = { x: 0.5, y: 0.5 };

export type ProJewelProps = {
  /** Pops the jewel in on mount (success moment). */
  pop?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function ProJewel({ pop = false, style }: ProJewelProps) {
  const reduceMotion = useReduceMotion();
  const float = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    const half = proMetrics.floatPeriod / 2;
    const curve = Easing.inOut(Easing.sin);
    float.set(
      withRepeat(
        withSequence(
          withTiming(-proMetrics.floatAmplitude, { duration: half, easing: curve }),
          withTiming(proMetrics.floatAmplitude, { duration: half, easing: curve }),
        ),
        -1,
        true,
      ),
    );
    return () => cancelAnimation(float);
  }, [reduceMotion, float]);

  const floatStyle = useAnimatedStyle(() => ({ transform: [{ translateY: float.get() }] }));

  const jewel = (
    <Animated.View style={[styles.jewel, floatStyle]}>
      <GemIcon size={proMetrics.heroGem} />
      <View style={styles.heart}>
        <HeartInfinityIcon size={proMetrics.heroHeart} />
      </View>
    </Animated.View>
  );

  return (
    <View style={[styles.box, style]} aria-hidden>
      <Spotlight colors={gradients.proGlow} origin={HALO_ORIGIN} reach={HALO_REACH} style={styles.halo} />
      {pop ? <PopIn>{jewel}</PopIn> : jewel}
      <Twinkle delay={0} style={styles.sparkleTop}>
        <SparkleIcon tone="lime" size={proMetrics.heroSparkle} />
      </Twinkle>
      <Twinkle delay={duration.slower} style={styles.sparkleSide}>
        <SparkleIcon tone="white" twin={false} size={proMetrics.heroSparkleSmall} />
      </Twinkle>
    </View>
  );
}

/** Opacity loop (staggered) for the sparkles. */
function Twinkle({ delay, style, children }: { delay: number; style: StyleProp<ViewStyle>; children: ReactNode }) {
  const reduceMotion = useReduceMotion();
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) return;
    const half = proMetrics.floatPeriod / 2;
    opacity.set(
      withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(uiOpacity.mutedIcon, { duration: half, easing: Easing.inOut(Easing.quad) }),
            withTiming(1, { duration: half, easing: Easing.inOut(Easing.quad) }),
          ),
          -1,
        ),
      ),
    );
    return () => cancelAnimation(opacity);
  }, [reduceMotion, delay, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.get() }));
  return <Animated.View style={[styles.sparkle, style, animatedStyle]}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  box: {
    width: proMetrics.heroArt,
    height: proMetrics.heroArt,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  halo: { borderRadius: radius.pill, overflow: 'hidden' },
  jewel: { width: proMetrics.heroGem, height: proMetrics.heroGem },
  heart: { position: 'absolute', right: -proMetrics.heroHeart / 4, bottom: -proMetrics.heroHeart / 8 },
  sparkle: { position: 'absolute' },
  sparkleTop: { top: proMetrics.heroSparkleSmall / 2, left: proMetrics.heroSparkle / 2 },
  sparkleSide: { top: proMetrics.heroArt / 3, right: 0 },
});
