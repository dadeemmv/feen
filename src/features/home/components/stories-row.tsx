/**
 * Stories row (spec §3.3): Instagram-like circles "Academy" 📚 and "App" 📱. Unseen stories get
 * the lime → mint gradient ring, seen ones a grey ring (the viewer marks them seen).
 */
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Avatar, PressableScale, StoryRing, Text, type Tone } from '@/components/ui';
import { STORY_GROUPS } from '@/content/stories';
import type { StoryGroup } from '@/content/types';
import { useStore } from '@/store';
import { duration, easing, spacing } from '@/theme';

import { HOME_COPY } from '../copy';
import { homeMetrics } from '../metrics';

/** Avatar tint per story theme (matches the background of the story itself). */
const STORY_TONE: Record<StoryGroup['theme'], Tone> = { mint: 'mint', brand: 'brand' };

const { storyFace: FACE, storyRing: RING, storyRingGap: RING_GAP } = homeMetrics;
const BUBBLE_WIDTH = FACE + (RING + RING_GAP) * 2;

export function StoriesRow() {
  const seenStories = useStore((s) => s.seenStories);
  return (
    <View style={styles.row}>
      {STORY_GROUPS.map((group, index) => (
        <StoryBubble key={group.id} group={group} seen={seenStories.includes(group.id)} index={index} />
      ))}
    </View>
  );
}

type StoryBubbleProps = { group: StoryGroup; seen: boolean; index: number };

function StoryBubble({ group, seen, index }: StoryBubbleProps) {
  const open = () => router.push({ pathname: '/story/[id]', params: { id: group.id } });
  return (
    <Animated.View entering={FadeIn.delay(index * duration.fast).duration(duration.base).easing(easing.enter)}>
      <PressableScale
        onPress={open}
        scaleTo="small"
        haptic="selection"
        accessibilityRole="button"
        accessibilityLabel={HOME_COPY.stories.a11y(group.title, seen)}
        accessibilityHint={HOME_COPY.stories.hint}
        style={styles.bubble}>
        <StoryRing seen={seen} size={FACE} thickness={RING} gap={RING_GAP}>
          <Avatar emoji={group.emoji} size={FACE} tone={STORY_TONE[group.theme]} accessibilityLabel={group.title} />
        </StoryRing>
        <Text variant="labelSm" color={seen ? 'textTertiary' : 'textSecondary'} align="center" numberOfLines={1}>
          {group.title}
        </Text>
      </PressableScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl },
  bubble: { width: BUBBLE_WIDTH, alignItems: 'center', gap: spacing.xxs },
});
