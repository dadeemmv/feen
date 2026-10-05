/**
 * ProgressBar — rounded track with an animated fill (withTiming duration.progress, easing.enter).
 * Tones: brand (evergreen, lesson progress), accent (lime), streak (flame gradient),
 * lives (heart gradient), success. md/lg get a glossy top highlight.
 */
import { useEffect, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { duration, easing, gradients, radius, useTheme, type Theme } from '@/theme';

import { progressHeight } from './metrics';
import { useReduceMotion } from './use-reduce-motion';

export type ProgressTone = 'brand' | 'accent' | 'streak' | 'lives' | 'success';
export type ProgressSize = 'sm' | 'md' | 'lg';

export type ProgressBarProps = {
  /** 0…1 (clamped). */
  value: number;
  /** sm 6 · md 10 · lg 14. Default `md`. */
  size?: ProgressSize;
  /** Default `brand`. */
  tone?: ProgressTone;
  /** Glossy top strip. Default on for md/lg. */
  highlight?: boolean;
  /** Animate from 0 on mount. Default `true`. */
  animateOnMount?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/** Highlight strip geometry, as fractions of the bar height (min height in pt). */
const SHEEN = { top: 0.15, height: 0.4, inset: 0.35, minHeight: 2 } as const;

function fillColors(theme: Theme, tone: ProgressTone): readonly [string, string] {
  switch (tone) {
    case 'brand':
      return [theme.colors.brandSolid, theme.colors.brandSolid];
    case 'accent':
      return gradients.accent;
    case 'streak':
      return gradients.flame;
    case 'lives':
      return gradients.heart;
    case 'success':
      return [theme.colors.successSolid, theme.colors.successSolid];
  }
}

export function ProgressBar({
  value,
  size = 'md',
  tone = 'brand',
  highlight,
  animateOnMount = true,
  accessibilityLabel,
  style,
}: ProgressBarProps) {
  const theme = useTheme();
  const reduceMotion = useReduceMotion();
  const clamped = Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
  const height = progressHeight[size];
  const [trackWidth, setTrackWidth] = useState(0);
  const progress = useSharedValue(animateOnMount && !reduceMotion ? 0 : clamped);
  const showSheen = highlight ?? size !== 'sm';

  useEffect(() => {
    if (reduceMotion) {
      progress.set(clamped);
      return;
    }
    progress.set(withTiming(clamped, { duration: duration.progress, easing: easing.enter }));
  }, [clamped, reduceMotion, progress]);

  const fillStyle = useAnimatedStyle(() => {
    const p = progress.get();
    // Keep a visible pill (not a sliver) as soon as there is any progress.
    const width = p <= 0 ? 0 : Math.max(height, p * trackWidth);
    return { width };
  });

  const onLayout = (event: LayoutChangeEvent) => setTrackWidth(event.nativeEvent.layout.width);

  return (
    <View
      onLayout={onLayout}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      style={[styles.track, { height, backgroundColor: theme.colors.fill }, style]}>
      <Animated.View style={[styles.fill, fillStyle]}>
        <LinearGradient
          colors={fillColors(theme, tone)}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        {showSheen ? (
          <LinearGradient
            colors={gradients.sheen}
            style={[
              styles.sheen,
              {
                top: Math.round(height * SHEEN.top),
                height: Math.max(SHEEN.minHeight, Math.round(height * SHEEN.height)),
                left: Math.round(height * SHEEN.inset),
                right: Math.round(height * SHEEN.inset),
              },
            ]}
          />
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: '100%', borderRadius: radius.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.pill, overflow: 'hidden' },
  sheen: { position: 'absolute', borderRadius: radius.pill },
});
