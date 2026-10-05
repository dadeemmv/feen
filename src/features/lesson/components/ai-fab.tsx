/**
 * The AI sparkle button (bottom-right on every step). After a wrong answer it morphs into the
 * pill "Spiegami il perché ✨": the width grows leftwards from the right edge (anchored), the label
 * fades in and the button gives a small bump. Two layers: the outer one carries the brand glow,
 * the inner one clips the content, so the shadow is never cut off.
 */
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { SparkleIcon } from '@/components/icons';
import { PressableScale, Text, readableWidth, useBump, useReduceMotion } from '@/components/ui';
import { ColorModeProvider, duration, easing, elevation, radius, spacing, useTheme } from '@/theme';

import { COPY } from '../copy';
import { lessonMetrics } from '../metrics';

export type AiFabProps = {
  expanded: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

const SIZE: number = lessonMetrics.fabSize;

export function AiFab({ expanded, onPress, style }: AiFabProps) {
  const theme = useTheme();
  const reduceMotion = useReduceMotion();
  const [labelWidth, setLabelWidth] = useState(0);
  const width = useSharedValue(SIZE);
  const labelOpacity = useSharedValue(0);
  const { style: bumpStyle, bump } = useBump(lessonMetrics.correctPopScale);
  const target = expanded && labelWidth > 0 ? SIZE + labelWidth : SIZE;

  useEffect(() => {
    const config = { duration: reduceMotion ? duration.fast : duration.slow, easing: easing.enter };
    width.set(withTiming(target, config));
    labelOpacity.set(withTiming(target > SIZE ? 1 : 0, { duration: duration.base, easing: easing.standard }));
  }, [target, reduceMotion, width, labelOpacity]);

  // Bump once when it turns into the pill (not on mount, not when it collapses).
  const wasExpanded = useRef(expanded);
  useEffect(() => {
    const grew = expanded && !wasExpanded.current;
    wasExpanded.current = expanded;
    if (grew) bump();
  }, [expanded, bump]);

  const widthStyle = useAnimatedStyle(() => ({ width: width.get() }));
  const labelStyle = useAnimatedStyle(() => ({ opacity: labelOpacity.get() }));
  const onMeasure = (event: LayoutChangeEvent) => setLabelWidth(Math.ceil(event.nativeEvent.layout.width));

  return (
    <Animated.View style={[styles.shadow, widthStyle, bumpStyle, style]}>
      <PressableScale
        onPress={onPress}
        haptic="light"
        accessibilityRole="button"
        accessibilityLabel={expanded ? COPY.a11y.fabExpanded : COPY.a11y.fab}
        style={styles.fill}
        testID="lesson-ai-fab">
        <View style={[styles.clip, { backgroundColor: theme.colors.brandSolid }]}>
          <View style={styles.row}>
            <Animated.View style={[styles.labelBox, labelStyle]} onLayout={onMeasure}>
              <ColorModeProvider mode="brand">
                <Text variant="labelLg" numberOfLines={1} style={styles.label}>
                  {COPY.fabPill}
                </Text>
              </ColorModeProvider>
            </Animated.View>
            <View style={styles.icon}>
              <SparkleIcon size={lessonMetrics.fabIcon} tone="white" />
            </View>
          </View>
        </View>
      </PressableScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shadow: { height: SIZE, borderRadius: radius.pill, boxShadow: elevation.brandGlow },
  fill: { flex: 1 },
  clip: { flex: 1, borderRadius: radius.pill, overflow: 'hidden' },
  // Wide, right-anchored track: the label is measured at its natural width, the clip shows the
  // rightmost `width` points of it.
  row: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: readableWidth,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  labelBox: { flexShrink: 0 },
  label: { paddingLeft: spacing.lg },
  icon: { width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' },
});
