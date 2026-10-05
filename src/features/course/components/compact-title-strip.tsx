/**
 * Sticky compact title (video t=32 s): once the course title scrolls under the status row, a
 * strip with the title and a slim progress bar slides in. Tapping it scrolls back to the chapter
 * to do. It ignores touches while hidden.
 */
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { LocateFixed } from 'lucide-react-native';

import { hairline, HStack, Icon, PressableScale, ProgressBar, Text, VStack } from '@/components/ui';
import { layout, spacing, useTheme } from '@/theme';

import { COMPACT_STRIP } from '../constants';
import { COURSE_COPY } from '../copy';

export type CompactTitleStripProps = {
  title: string;
  completed: number;
  total: number;
  scrollY: SharedValue<number>;
  /** Scroll offset at which the strip is fully visible (title bottom). Hidden while < 0. */
  threshold: number;
  onPress?: () => void;
};

export function CompactTitleStrip({ title, completed, total, scrollY, threshold, onPress }: CompactTitleStripProps) {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);

  useAnimatedReaction(
    () => threshold >= 0 && scrollY.get() > threshold - COMPACT_STRIP.fadeRange / 2,
    (shown, previous) => {
      if (shown !== previous) scheduleOnRN(setVisible, shown);
    },
    [threshold],
  );

  const style = useAnimatedStyle(() => {
    if (threshold < 0) return { opacity: 0, transform: [{ translateY: -COMPACT_STRIP.slide }] };
    const progress = interpolate(
      scrollY.get(),
      [threshold - COMPACT_STRIP.fadeRange, threshold],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return { opacity: progress, transform: [{ translateY: (progress - 1) * COMPACT_STRIP.slide }] };
  });

  return (
    <Animated.View
      aria-hidden={!visible}
      style={[
        styles.strip,
        { pointerEvents: visible ? 'auto' : 'none' },
        { backgroundColor: theme.colors.background, borderBottomColor: theme.colors.borderSubtle },
        style,
      ]}>
      <PressableScale
        onPress={onPress}
        scaleTo={false}
        dimOnPress
        haptic="selection"
        accessibilityLabel={COURSE_COPY.compactLabel(title, completed, total)}
        accessibilityHint={COURSE_COPY.compactHint}
        style={styles.press}>
        <VStack gap="xs">
          <HStack gap="xs">
            <Text variant="titleSm" numberOfLines={1} style={styles.title}>
              {title}
            </Text>
            <Text variant="labelSm" color="textSecondary" tabular>
              {COURSE_COPY.chaptersFraction(completed, total)}
            </Text>
            <Icon icon={LocateFixed} size="sm" color="textTertiary" />
          </HStack>
          <ProgressBar value={total === 0 ? 0 : completed / total} size="sm" tone="brand" animateOnMount={false} />
        </VStack>
      </PressableScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  strip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: COMPACT_STRIP.height,
    borderBottomWidth: hairline,
  },
  press: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: layout.screenX,
    paddingBottom: spacing.xxs,
  },
  title: { flex: 1 },
});
