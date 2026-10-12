/**
 * "Lezioni" (tab): the same village as a list — the accessible version of the map. Every
 * building is a product card with its state and how many lessons are done; it opens the
 * building's page.
 */
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { Screen, Text, VStack } from '@/components/ui';
import { BUILDING_IDS } from '@/content/village';
import { useEntering } from '@/features/onboarding/lib/entering';
import { chaptersDone, useStore } from '@/store';
import { fonts, spacing } from '@/theme';

import { BuildingCard } from './components/building-card';
import { VILLAGE_COPY } from './copy';
import { useVillage } from './lib/model';
import { openBuilding } from './lib/navigation';

export function LessonsScreen() {
  const [now] = useState(() => Date.now());
  const village = useVillage(now);
  const records = useStore((s) => s.chapterRecords);
  const { rise } = useEntering();
  const copy = VILLAGE_COPY.lessons;

  return (
    <Screen withTabBar edges={['top']}>
      <Animated.View entering={rise(0)} style={styles.heading}>
        <Text variant="displayMd" accessibilityRole="header">
          <Text variant="displayMd" style={styles.italic}>
            {copy.titleWord}
          </Text>
        </Text>
        <Text variant="bodyLg" color="textSecondary">
          {copy.subtitle}
        </Text>
      </Animated.View>
      <VStack gap="md" style={styles.list}>
        {BUILDING_IDS.map((id, index) => (
          <Animated.View key={id} entering={rise(Math.min(index + 1, 6))}>
            <BuildingCard
              id={id}
              state={village.states[id]}
              done={chaptersDone(id, records)}
              progress={village.progress[id]}
              onPress={() => openBuilding(id)}
            />
          </Animated.View>
        ))}
      </VStack>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: spacing.xs, marginTop: spacing.sm, marginBottom: spacing.xl },
  italic: { fontFamily: fonts.serif.italic, letterSpacing: 0 },
  list: { paddingBottom: spacing.xxl },
});
