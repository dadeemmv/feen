/**
 * Showcase: progress bars, story segments, typing dots, skeletons, shimmer.
 */
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { cancelAnimation, Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { duration, radius, spacing, useTheme } from '@/theme';

import { Button } from '../button';
import { Card } from '../card';
import { ProgressBar, type ProgressSize, type ProgressTone } from '../progress-bar';
import { SegmentedProgress } from '../segmented-progress';
import { Shimmer } from '../shimmer';
import { Skeleton, SkeletonText } from '../skeleton';
import { Text } from '../text';
import { TypingDots } from '../typing-dots';
import { ShowcaseRow, ShowcaseSection } from './section';

const TONES: ProgressTone[] = ['brand', 'accent', 'streak', 'lives', 'success'];
const SIZES: ProgressSize[] = ['sm', 'md', 'lg'];
const STORY_SEGMENTS = 4;
/** Demo story timer (shorter than the real `duration.storySegment`). */
const DEMO_SEGMENT_MS = duration.storySegment / 2;

export function ProgressShowcase() {
  const [value, setValue] = useState(0.35);
  return (
    <ShowcaseSection title="ProgressBar" note="Animated fill (duration.progress, easing.enter); glossy sheen on md/lg.">
      {SIZES.map((size) => (
        <ShowcaseRow key={size} label={`size ${size}`} wrap={false} style={styles.column}>
          {TONES.map((tone) => (
            <ProgressBar key={tone} value={value} size={size} tone={tone} accessibilityLabel={`Progresso ${tone}`} />
          ))}
        </ShowcaseRow>
      ))}
      <ShowcaseRow>
        <Button title="0%" size="sm" variant="secondary" onPress={() => setValue(0)} />
        <Button title="+15%" size="sm" variant="secondary" onPress={() => setValue((v) => Math.min(1, v + 0.15))} />
        <Button title="100%" size="sm" variant="secondary" onPress={() => setValue(1)} />
      </ShowcaseRow>
      <Card variant="brand" padding="md" contentStyle={styles.column}>
        <Text variant="labelSm" color="textSecondary">
          1/13 capitoli
        </Text>
        <ProgressBar value={1 / 13} size="sm" tone="accent" />
      </Card>
    </ShowcaseSection>
  );
}

export function StoryProgressShowcase() {
  const [active, setActive] = useState(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    const next = () => setActive((index) => (index + 1) % STORY_SEGMENTS);
    progress.set(0);
    progress.set(
      withTiming(1, { duration: DEMO_SEGMENT_MS, easing: Easing.linear }, (finished) => {
        if (finished) scheduleOnRN(next);
      }),
    );
    return () => cancelAnimation(progress);
  }, [active, progress]);

  return (
    <ShowcaseSection title="SegmentedProgress" note="Story bars: the active segment reads a SharedValue.">
      <Card variant="brand" padding="md" contentStyle={styles.column}>
        <SegmentedProgress count={STORY_SEGMENTS} activeIndex={active} progress={progress} tone="light" />
        <Text variant="labelMd">Storia {active + 1} di {STORY_SEGMENTS}</Text>
      </Card>
      <Card variant="accent" padding="md">
        <SegmentedProgress count={STORY_SEGMENTS} activeIndex={active} progress={progress} tone="dark" />
      </Card>
    </ShowcaseSection>
  );
}

export function LoadingShowcase() {
  const theme = useTheme();
  return (
    <ShowcaseSection title="TypingDots · Skeleton · Shimmer">
      <ShowcaseRow label="typing">
        <TypingDots />
        <TypingDots bubble />
        <TypingDots color="textTertiary" size={spacing.xxs + spacing.xxxs} />
      </ShowcaseRow>
      <Card contentStyle={styles.skeletonCard}>
        <Skeleton circle size={spacing.huge - spacing.md} />
        <View style={styles.flex}>
          <Skeleton width="50%" height={spacing.md} />
          <SkeletonText lines={2} />
        </View>
      </Card>
      <Skeleton height={spacing.huge * 2} radius="xl" shimmer />
      <View style={[styles.shimmerBox, { backgroundColor: theme.colors.brandSolid }]}>
        <Shimmer />
        <Text variant="labelLg" color="onBrand">
          Shimmer overlay
        </Text>
      </View>
    </ShowcaseSection>
  );
}

const styles = StyleSheet.create({
  column: { flexDirection: 'column', alignItems: 'stretch', gap: spacing.xs },
  skeletonCard: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  flex: { flex: 1, gap: spacing.xs },
  shimmerBox: {
    height: spacing.huge,
    borderRadius: radius.xl,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
