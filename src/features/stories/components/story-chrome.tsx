/**
 * Story chrome (redlines "Story viewer"): segmented progress (3 px, gap 4, top = safe inset +
 * xs, side sm), then the header row — group avatar 32 + title, share + close buttons 36.
 * It belongs to the face, so it turns with the cube; while the user holds the page it fades
 * out (`visibility`) like Instagram.
 */
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';
import { Share, X } from 'lucide-react-native';

import { Avatar, IconButton, SegmentedProgress, Text } from '@/components/ui';
import type { StoryGroup } from '@/content/types';
import { spacing } from '@/theme';

import { STORY_COPY } from '../copy';
import { passThrough } from '../lib/pass-through';
import { storyMetrics } from '../metrics';

export type StoryChromeProps = {
  group: StoryGroup;
  pageIndex: number;
  /** Progress of the active segment (0…1). */
  progress: SharedValue<number>;
  /** 1 = shown, 0 = hidden (the user is holding the page). */
  visibility: SharedValue<number>;
  topInset: number;
  onShare: () => void;
  onClose: () => void;
};

export function StoryChrome({ group, pageIndex, progress, visibility, topInset, onShare, onClose }: StoryChromeProps) {
  const dark = group.theme === 'brand';
  const animatedStyle = useAnimatedStyle(() => ({ opacity: visibility.get() }));

  return (
    <Animated.View style={[passThrough.animatedShell, animatedStyle]}>
      <View style={[styles.root, { paddingTop: topInset + spacing.xs }]}>
        <SegmentedProgress
          count={group.pages.length}
          activeIndex={pageIndex}
          progress={progress}
          tone={dark ? 'light' : 'dark'}
          style={styles.segments}
        />
        <View style={styles.header}>
          <View style={styles.identity} aria-hidden>
            <Avatar emoji={group.emoji} size={storyMetrics.headerAvatar} tone="accent" />
            <Text variant="titleSm" numberOfLines={1}>
              {group.title}
            </Text>
          </View>
          <View style={styles.actions}>
            <IconButton
              icon={Share}
              size="sm"
              variant={dark ? 'glass' : 'surface'}
              accessibilityLabel={STORY_COPY.share}
              onPress={onShare}
            />
            <IconButton
              icon={X}
              size="sm"
              variant={dark ? 'glass' : 'surface'}
              accessibilityLabel={STORY_COPY.close}
              onPress={onClose}
            />
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { paddingHorizontal: spacing.sm, pointerEvents: 'box-none' },
  segments: { pointerEvents: 'none' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
    marginTop: spacing.sm,
    pointerEvents: 'box-none',
  },
  actions: { flexDirection: 'row', gap: spacing.xs, pointerEvents: 'box-none' },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexShrink: 1,
    pointerEvents: 'none',
  },
});
