/**
 * Radio — animated selection indicator. Off: hairline ring. On: a solid disc pops in
 * (spring.bouncy) carrying a bold check. `shape="square"` gives the checkbox look for
 * multi-select lists. Usually rendered inside a ChoiceRow; pass `onPress` to use it standalone.
 */
import { useEffect } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';

import { duration, radius, spring, useTheme } from '@/theme';

import { borderWidth, iconStroke, radioSize, uiOpacity } from './metrics';
import { feedbackMotion } from './motion-presets';
import { PressableScale } from './pressable-scale';
import { useReduceMotion } from './use-reduce-motion';

export type RadioTone = 'accent' | 'brand';

export type RadioProps = {
  selected: boolean;
  /** sm 20 · md 24. Default `md`. */
  size?: keyof typeof radioSize;
  /** Fill of the selected disc. Default `accent` (lime + evergreen check). */
  tone?: RadioTone;
  /** `circle` (single choice, default) or `square` (checkbox, multi choice). */
  shape?: 'circle' | 'square';
  disabled?: boolean;
  /** Standalone use: makes the indicator itself pressable. */
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/** Check glyph relative to the indicator. */
const GLYPH_RATIO = 0.62;

export function Radio({
  selected,
  size = 'md',
  tone = 'accent',
  shape = 'circle',
  disabled = false,
  onPress,
  accessibilityLabel,
  style,
}: RadioProps) {
  const theme = useTheme();
  const reduceMotion = useReduceMotion();
  const progress = useSharedValue(selected ? 1 : 0);
  const scale = useSharedValue(selected ? 1 : feedbackMotion.popFromScale);

  useEffect(() => {
    if (reduceMotion) {
      progress.set(selected ? 1 : 0);
      scale.set(selected ? 1 : feedbackMotion.popFromScale);
      return;
    }
    progress.set(withTiming(selected ? 1 : 0, { duration: duration.fast }));
    scale.set(selected ? withSpring(1, spring.bouncy) : withTiming(feedbackMotion.popFromScale, { duration: duration.fast }));
  }, [selected, reduceMotion, progress, scale]);

  const discStyle = useAnimatedStyle(() => ({ opacity: progress.get(), transform: [{ scale: scale.get() }] }));

  const dimension = radioSize[size];
  const corner = shape === 'circle' ? radius.pill : radius.xs;
  const fill = tone === 'accent' ? theme.colors.accentSolid : theme.colors.brandSolid;
  const glyph = tone === 'accent' ? theme.colors.onAccent : theme.colors.onBrand;

  const indicator = (
    <View
      style={[
        styles.ring,
        {
          width: dimension,
          height: dimension,
          borderRadius: corner,
          borderColor: theme.colors.borderStrong,
          backgroundColor: theme.colors.surface,
        },
        disabled && styles.disabled,
        !onPress && style,
      ]}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.disc, { borderRadius: corner, backgroundColor: fill }, discStyle]}>
        <Check size={Math.round(dimension * GLYPH_RATIO)} color={glyph} strokeWidth={iconStroke.heavy} />
      </Animated.View>
    </View>
  );

  if (!onPress) return indicator;
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      scaleTo="small"
      haptic="selection"
      hitSlop={dimension / 2}
      accessibilityRole={shape === 'circle' ? 'radio' : 'checkbox'}
      accessibilityState={{ checked: selected, disabled }}
      accessibilityLabel={accessibilityLabel}
      style={style}>
      {indicator}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  ring: { borderWidth: borderWidth.regular, alignItems: 'center', justifyContent: 'center' },
  // Overlaps the ring by its width so the selected disc reads as one solid shape.
  disc: { margin: -borderWidth.regular, alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: uiOpacity.disabled },
});
