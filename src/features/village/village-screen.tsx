/**
 * The village (home tab, concept board screen 5). Not a list of lessons but a place that grows
 * while you learn: "Borgo Ginestra", residents, bricks and days of the pact as big numbers, the
 * island with today's site and the partner beside it, the partner's line and the next site with
 * "Costruisci". A building opens its page; the partner opens the pact.
 */
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { router } from 'expo-router';

import { MascotArt } from '@/components/illustrations';
import { avatarSize, Button, Card, HStack, Screen, Text, VStack } from '@/components/ui';
import { getChapter } from '@/content/courses';
import { getMascot } from '@/content/personality';
import { BUILDINGS } from '@/content/village';
import { useEntering } from '@/features/onboarding/lib/entering';
import { chaptersDone, nextChapterOf, selectMascot, useStore } from '@/store';
import { fonts, layout, spacing } from '@/theme';

import { VillageCounters } from './components/village-counters';
import { VillageMap } from './components/village-map';
import { VILLAGE_COPY } from './copy';
import { useVillage } from './lib/model';
import { openBuilding, openLesson } from './lib/navigation';

export function VillageScreen() {
  const [now] = useState(() => Date.now());
  const village = useVillage(now);
  const name = useStore((s) => s.name);
  const records = useStore((s) => s.chapterRecords);
  const mascotId = useStore(selectMascot);
  const { rise } = useEntering();
  const mascot = mascotId ? getMascot(mascotId) : null;
  const hour = new Date(now).getHours();

  const site = village.current ? BUILDINGS[village.current] : null;
  const siteTotal = site?.chapterIds.length ?? 0;
  const siteDone = site ? chaptersDone(site.id, records) : 0;
  const nextId = site ? nextChapterOf(site.id, records) : undefined;
  const next = nextId ? getChapter(nextId) : undefined;
  const nextIndex = site && nextId ? site.chapterIds.indexOf(nextId) + 1 : 0;

  return (
    <Screen withTabBar edges={['top']}>
      <Animated.View entering={rise(0)} style={styles.heading}>
        <Text variant="labelMd" color="textSecondary">
          {VILLAGE_COPY.greeting(name, hour)}
        </Text>
        <Text variant="displayMd" accessibilityRole="header">
          {'Borgo '}
          <Text variant="displayMd" style={styles.italic}>
            {VILLAGE_COPY.titleWord(village.name)}
          </Text>
        </Text>
      </Animated.View>

      <Animated.View entering={rise(1)}>
        <VillageCounters village={village} />
      </Animated.View>

      <Animated.View entering={rise(2)} style={styles.map}>
        <VillageMap
          village={village}
          partner={mascotId}
          partnerName={mascot?.partner.name}
          onBuilding={openBuilding}
          onPartner={() => router.push('/pact')}
          sitePin={site && siteTotal > 0 ? { done: siteDone, total: siteTotal } : undefined}
        />
      </Animated.View>

      {mascot ? (
        <Animated.View entering={rise(3)}>
          <HStack gap="sm" align="center">
            <MascotArt id={mascot.id} framing="bust" width={avatarSize.md} />
            <Text variant="bodyMd" style={styles.flex}>
              <Text variant="labelMd">{`${mascot.partner.name} · `}</Text>
              {site ? VILLAGE_COPY.partnerSays(site.at) : VILLAGE_COPY.partnerIdle}
            </Text>
          </HStack>
        </Animated.View>
      ) : null}

      {site && next ? (
        <Animated.View entering={rise(4)}>
          <Card padding="lg" contentStyle={styles.next}>
            <VStack gap="xxs">
              <Text variant="overline" color="textSecondary">
                {VILLAGE_COPY.nextSite}
              </Text>
              <Text variant="titleMd">{`${site.name} · ${site.topic}`}</Text>
              <Text variant="bodySm" color="textSecondary">
                {`${VILLAGE_COPY.lessonOf(nextIndex, siteTotal)} · ${next.title} · ${VILLAGE_COPY.minutes(next.estimatedMinutes)} · ${VILLAGE_COPY.bricksReward(next.coinReward)} ${VILLAGE_COPY.bricks}`}
              </Text>
            </VStack>
            <Button title={VILLAGE_COPY.build} fullWidth onPress={() => openLesson(next.id)} />
          </Card>
        </Animated.View>
      ) : null}
      <View style={styles.bottom} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: spacing.xxxs, marginTop: spacing.sm, marginBottom: spacing.lg },
  italic: { fontFamily: fonts.serif.italic, letterSpacing: 0 },
  map: { marginHorizontal: -layout.screenX, marginVertical: spacing.md },
  flex: { flex: 1 },
  next: { gap: spacing.md },
  bottom: { height: spacing.xl },
});
