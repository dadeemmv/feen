/**
 * SegmentedProgress — Instagram-style story bars (birdwingo/react-native-instagram-stories
 * `Progress/item.tsx`). Segments before `activeIndex` are full, after it empty; the active one
 * reads a 0…1 SharedValue driven by the story timer, so it animates on the UI thread.
 */
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { radius, spacing, themes } from '@/theme';

import { segmentHeight, uiOpacity } from './metrics';

export type SegmentedProgressProps = {
  count: number;
  activeIndex: number;
  /** Progress of the active segment, 0…1. */
  progress: SharedValue<number>;
  /** `light` = white bars for dark/photo backgrounds; `dark` = ink bars for light backgrounds. */
  tone?: 'light' | 'dark';
  style?: StyleProp<ViewStyle>;
};

export function SegmentedProgress({ count, activeIndex, progress, tone = 'light', style }: SegmentedProgressProps) {
  const color = tone === 'light' ? themes.brand.colors.text : themes.light.colors.text;
  return (
    <View
      style={[styles.row, style]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 1, max: count, now: activeIndex + 1 }}>
      {Array.from({ length: count }, (_, index) => (
        <Segment
          key={index}
          color={color}
          state={index < activeIndex ? 'done' : index === activeIndex ? 'active' : 'todo'}
          progress={progress}
        />
      ))}
    </View>
  );
}

type SegmentProps = { color: string; state: 'done' | 'active' | 'todo'; progress: SharedValue<number> };

function Segment({ color, state, progress }: SegmentProps) {
  const fillStyle = useAnimatedStyle(() => {
    const p = state === 'done' ? 1 : state === 'todo' ? 0 : Math.min(1, Math.max(0, progress.get()));
    return { width: `${p * 100}%` };
  });

  return (
    <View style={styles.segment}>
      <View style={[StyleSheet.absoluteFill, styles.track, { backgroundColor: color }]} />
      <Animated.View style={[styles.fill, { backgroundColor: color }, fillStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.xxs },
  segment: { flex: 1, height: segmentHeight, borderRadius: radius.pill, overflow: 'hidden' },
  track: { opacity: uiOpacity.storyTrack },
  fill: { height: '100%', borderRadius: radius.pill },
});
