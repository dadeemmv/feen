/**
 * Switch — custom toggle (settings: Vibrazione, Suoni, Riduci animazioni, Notifiche) that looks
 * identical on iOS, Android and web. Thumb slides with spring.snappy, track colour glides with a
 * CSS transition. On = evergreen on light surfaces, lime on brand surfaces.
 * Pair it with a ListItem: `<ListItem title="Vibrazione" trailing={<Switch … />} />`.
 */
import { useEffect } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type CSSTransitionProperties,
} from 'react-native-reanimated';

import { duration, elevation, radius, spring, useTheme } from '@/theme';

import { switchSize, uiOpacity } from './metrics';
import { PressableScale } from './pressable-scale';
import { useReduceMotion } from './use-reduce-motion';

export type SwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  /** Required when the switch has no visible label next to it (ListItem rows pass the title). */
  accessibilityLabel?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
};

const PAD = (switchSize.height - switchSize.thumb) / 2;
const TRAVEL = switchSize.width - switchSize.thumb - PAD * 2;

export function Switch({ value, onValueChange, disabled = false, accessibilityLabel, testID, style }: SwitchProps) {
  const theme = useTheme();
  const reduceMotion = useReduceMotion();
  const progress = useSharedValue(value ? 1 : 0);
  const onColor = theme.mode === 'brand' ? theme.colors.accentSolid : theme.colors.brandSolid;

  useEffect(() => {
    progress.set(reduceMotion ? (value ? 1 : 0) : withSpring(value ? 1 : 0, spring.snappy));
  }, [value, reduceMotion, progress]);

  const thumbStyle = useAnimatedStyle(() => ({ transform: [{ translateX: progress.get() * TRAVEL }] }));

  return (
    <PressableScale
      onPress={() => onValueChange(!value)}
      disabled={disabled}
      scaleTo="small"
      haptic="selection"
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      style={[disabled && styles.disabled, style]}>
      <Animated.View style={[styles.track, trackTransition, { backgroundColor: value ? onColor : theme.colors.fillPressed }]}>
        {/* onBrand is white in both colour modes: the thumb is always a white knob. */}
        <Animated.View style={[styles.thumb, { backgroundColor: theme.colors.onBrand }, thumbStyle]} />
      </Animated.View>
    </PressableScale>
  );
}

const trackTransition: CSSTransitionProperties<ViewStyle> = {
  transitionProperty: 'backgroundColor',
  transitionDuration: duration.fast,
  transitionTimingFunction: 'ease',
};

const styles = StyleSheet.create({
  track: {
    width: switchSize.width,
    height: switchSize.height,
    borderRadius: radius.pill,
    padding: PAD,
  },
  thumb: {
    width: switchSize.thumb,
    height: switchSize.thumb,
    borderRadius: radius.pill,
    boxShadow: elevation.md,
  },
  disabled: { opacity: uiOpacity.disabled },
});
