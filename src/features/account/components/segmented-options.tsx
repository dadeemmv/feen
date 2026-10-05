/**
 * Segmented picker (reminder time "Mattina · Pomeriggio · Sera"): a soft track with a white
 * thumb that springs under the selected option (`spring.snappy`). Radio-group semantics.
 */
import { useEffect, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { PressableScale, Text, uiOpacity, useReduceMotion } from '@/components/ui';
import { elevation, radius, spacing, spring, useTheme } from '@/theme';

import { accountMetrics } from '../metrics';

export type SegmentedOption<T extends string> = { id: T; label: string; caption?: string };

export type SegmentedOptionsProps<T extends string> = {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  accessibilityLabel: string;
};

const TRACK_PADDING = spacing.xxs;

export function SegmentedOptions<T extends string>({
  options,
  value,
  onChange,
  disabled = false,
  accessibilityLabel,
}: SegmentedOptionsProps<T>) {
  const { colors } = useTheme();
  const reduceMotion = useReduceMotion();
  const [trackWidth, setTrackWidth] = useState(0);
  const segmentWidth = trackWidth > 0 ? (trackWidth - TRACK_PADDING * 2) / options.length : 0;
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.id === value),
  );
  const offset = useSharedValue(0);

  useEffect(() => {
    const target = selectedIndex * segmentWidth;
    offset.set(reduceMotion || segmentWidth === 0 ? target : withSpring(target, spring.snappy));
  }, [selectedIndex, segmentWidth, reduceMotion, offset]);

  const thumbStyle = useAnimatedStyle(() => ({ transform: [{ translateX: offset.get() }] }));
  const onLayout = (event: LayoutChangeEvent) => setTrackWidth(event.nativeEvent.layout.width);

  return (
    <View
      onLayout={onLayout}
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      style={[styles.track, { backgroundColor: colors.fill }, disabled && styles.disabled]}>
      {segmentWidth > 0 ? (
        <Animated.View
          style={[styles.thumb, { width: segmentWidth, backgroundColor: colors.surface }, thumbStyle]}
          aria-hidden
        />
      ) : null}
      {options.map((option) => {
        const selected = option.id === value;
        return (
          <PressableScale
            key={option.id}
            onPress={() => onChange(option.id)}
            disabled={disabled}
            scaleTo="small"
            haptic="selection"
            accessibilityRole="radio"
            accessibilityState={{ checked: selected, disabled }}
            accessibilityLabel={option.caption ? `${option.label}, ${option.caption}` : option.label}
            style={styles.segment}>
            <Text variant="labelMd" color={selected ? 'text' : 'textSecondary'} numberOfLines={1}>
              {option.label}
            </Text>
            {option.caption ? (
              <Text variant="labelSm" color={selected ? 'brandText' : 'textTertiary'} tabular numberOfLines={1}>
                {option.caption}
              </Text>
            ) : null}
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row', padding: TRACK_PADDING, borderRadius: radius.md },
  thumb: {
    position: 'absolute',
    top: TRACK_PADDING,
    bottom: TRACK_PADDING,
    left: TRACK_PADDING,
    borderRadius: radius.sm,
    boxShadow: elevation.sm,
  },
  segment: {
    flex: 1,
    minHeight: accountMetrics.toggleHeight + spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxxs,
    paddingHorizontal: spacing.xxs,
  },
  disabled: { opacity: uiOpacity.disabled },
});
