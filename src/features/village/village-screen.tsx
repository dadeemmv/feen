/**
 * The village (home tab): a full-screen hub world like FIFA City. The island fills the screen
 * and moves under your fingers; "Borgo Ginestra" and the big serif numbers (residents, bricks,
 * days of the pact) float on top over a white fade, and at the bottom the partner says where
 * today's step of the path is, with "Costruisci". A building opens its page; the partner opens
 * the pact; "Usa i mattoni" opens the catalogue of homes and decorations. When a resident waits
 * by a finished building with a problem (the review), the card says so first, with "Aiutalo".
 */
import { useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

import { BrickIcon } from '@/components/icons';
import { MascotArt } from '@/components/illustrations';
import { getTabBarBottomOffset } from '@/components/navigation/use-tab-bar-inset';
import { avatarSize, Button, HStack, iconSize, Screen, Text, VStack } from '@/components/ui';
import { getChapter } from '@/content/courses';
import { getMascot } from '@/content/personality';
import { getReviewSet } from '@/content/reviews';
import { BUILDINGS, theBuilding } from '@/content/village';
import { useEntering } from '@/features/onboarding/lib/entering';
import { toDayKey } from '@/lib/dates';
import { chaptersDone, selectMascot, useStore } from '@/store';
import { elevation, fonts, layout, radius, spacing, useTheme } from '@/theme';

import { BuildingScene } from './components/building-scene';
import { VillageCounters } from './components/village-counters';
import { VillageWorld } from './components/village-world';
import { VILLAGE_COPY } from './copy';
import { usePath, useVillage } from './lib/model';
import { openBuilding, openLesson, openReview } from './lib/navigation';

/** The white fade under the header, so the island slides beneath it. */
const FADE = 40;

export function VillageScreen() {
  const [now] = useState(() => Date.now());
  const village = useVillage(now);
  const path = usePath();
  const name = useStore((s) => s.name);
  const records = useStore((s) => s.chapterRecords);
  const doneToday = useStore((s) => s.activeDays.includes(toDayKey(now)));
  const mascotId = useStore(selectMascot);
  const { rise } = useEntering();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const mascot = mascotId ? getMascot(mascotId) : null;
  const hour = new Date(now).getHours();

  const site = village.current ? BUILDINGS[village.current] : null;
  const siteTotal = site?.chapterIds.length ?? 0;
  const siteDone = site ? chaptersDone(site.id, records) : 0;
  const nextId = path.steps[path.current]?.chapterId;
  const next = nextId ? getChapter(nextId) : undefined;
  // The first resident waiting with a problem (the others wait by their buildings on the map).
  const visitorId = village.visitors?.[0];
  const visitor = visitorId ? getReviewSet(visitorId)?.resident : undefined;

  // The camera frames the band between the floating header and the bottom card.
  const tabBar = getTabBarBottomOffset(insets.bottom) + layout.tabBarHeight + spacing.sm;
  const [header, setHeader] = useState(0);
  const [card, setCard] = useState(0);
  const measure = (set: (h: number) => void) => (e: LayoutChangeEvent) => set(Math.round(e.nativeEvent.layout.height));
  const cover = { top: header, bottom: tabBar + card };
  const above = { bottom: cover.bottom + spacing.sm };

  return (
    <Screen preset="fixed" padded={false} edges={[]}>
      <View style={styles.root}>
        <VillageWorld
          village={village}
          partner={mascotId}
          partnerName={mascot?.partner.name}
          onBuilding={openBuilding}
          onPartner={() => router.push('/pact')}
          onVisitor={openReview}
          sitePin={
            site && siteTotal > 0 ? { done: siteDone, total: siteTotal, open: village.states[site.id] === 'cantiere' } : undefined
          }
          cover={cover}
          controlsStyle={[styles.controls, above]}
        />

        <View style={styles.header} pointerEvents="box-none">
          <View style={{ backgroundColor: colors.background }} onLayout={measure(setHeader)}>
            <Animated.View entering={rise(0)} style={[styles.heading, { paddingTop: insets.top + spacing.sm }]}>
              <Text variant="labelMd" color="textSecondary">
                {VILLAGE_COPY.greeting(name, hour)}
              </Text>
              <Text variant="displayMd" accessibilityRole="header">
                {'Borgo '}
                <Text variant="displayMd" style={styles.italic}>
                  {VILLAGE_COPY.titleWord(village.name)}
                </Text>
              </Text>
              <View style={styles.counters}>
                <VillageCounters village={village} compact />
              </View>
            </Animated.View>
          </View>
          <LinearGradient colors={[colors.background, `${colors.background}00`]} style={styles.fade} pointerEvents="none" />
        </View>

        <View style={[styles.bricks, above]} pointerEvents="box-none">
          <Button
            title={VILLAGE_COPY.decor.entry}
            size="sm"
            iconLeft={<BrickIcon size={iconSize.sm} />}
            accessibilityLabel={VILLAGE_COPY.decor.entryA11y(village.bricks)}
            onPress={() => router.push('/build')}
            testID="village-use-bricks"
          />
        </View>

        <Animated.View
          entering={rise(2)}
          onLayout={measure(setCard)}
          style={[styles.card, { bottom: tabBar, backgroundColor: colors.background }]}>
          <VStack gap="md">
            {visitorId && visitor ? (
              <HStack gap="sm" align="center">
                <BuildingScene id={visitorId} state="costruito" visitor width={avatarSize.md} />
                <VStack flex gap="xxxs">
                  <Text variant="labelMd">{VILLAGE_COPY.ripasso.waiting(visitor.who, BUILDINGS[visitorId].at)}</Text>
                  <Text variant="bodySm" color="textSecondary">
                    {VILLAGE_COPY.ripasso.waitingWhy(theBuilding(BUILDINGS[visitorId]))}
                  </Text>
                </VStack>
                <Button
                  title={VILLAGE_COPY.ripasso.help(visitor.pronoun)}
                  size="sm"
                  variant="secondary"
                  onPress={() => openReview(visitorId)}
                  testID="village-help-visitor"
                />
              </HStack>
            ) : null}
            {mascot ? (
              <HStack gap="sm" align="center">
                <MascotArt id={mascot.id} framing="bust" width={avatarSize.md} />
                <VStack flex gap="xxxs">
                  <Text variant="bodyMd">
                    <Text variant="labelMd">{`${mascot.partner.name} · `}</Text>
                    {site
                      ? doneToday
                        ? VILLAGE_COPY.partnerDone(site.at)
                        : VILLAGE_COPY.partnerSays(site.at)
                      : VILLAGE_COPY.partnerIdle}
                  </Text>
                  {site && next ? (
                    <Text variant="bodySm" color="textSecondary" numberOfLines={1}>
                      {`${next.title} · ${VILLAGE_COPY.minutes(next.estimatedMinutes)} · ${VILLAGE_COPY.bricksReward(next.coinReward)} ${VILLAGE_COPY.bricks}`}
                    </Text>
                  ) : null}
                </VStack>
              </HStack>
            ) : null}
            {site && next ? <Button title={VILLAGE_COPY.build} fullWidth onPress={() => openLesson(next.id)} /> : null}
          </VStack>
        </Animated.View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, overflow: 'hidden' },
  header: { position: 'absolute', left: 0, right: 0, top: 0 },
  heading: { gap: spacing.xxxs, paddingHorizontal: layout.screenX },
  italic: { fontFamily: fonts.serif.italic, letterSpacing: 0 },
  counters: { marginTop: spacing.sm },
  fade: { height: FADE },
  controls: { right: layout.screenX },
  bricks: { position: 'absolute', left: layout.screenX },
  card: {
    position: 'absolute',
    left: layout.screenX,
    right: layout.screenX,
    padding: spacing.lg,
    borderRadius: radius.xxl,
    boxShadow: elevation.lg,
  },
});
