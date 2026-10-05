/**
 * Story viewer route (/story/[id], full-screen modal with a fade). `id` is the story group the
 * viewer opens on (spec §3.4); the viewer then flows through the following groups. An unknown
 * id shows a calm "not found" state instead of crashing.
 */
import { StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { EmptyState, Screen } from '@/components/ui';
import { storyGroupIndex } from '@/content/stories';

import { StoryViewer } from './components/story-viewer';
import { STORY_COPY } from './copy';

const leave = () => (router.canGoBack() ? router.back() : router.replace('/'));

export function StoryScreen() {
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const index = storyGroupIndex(id);

  if (index < 0) {
    return (
      <Screen preset="fixed" edges={['top', 'bottom']} contentContainerStyle={styles.center}>
        <EmptyState
          emoji="📭"
          title={STORY_COPY.notFound.title}
          message={STORY_COPY.notFound.message}
          action={{ label: STORY_COPY.notFound.cta, onPress: leave }}
        />
      </Screen>
    );
  }

  // Re-key per entry group so reopening from Home always starts fresh.
  return <StoryViewer key={id} initialGroup={index} onClose={leave} />;
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center' },
});
