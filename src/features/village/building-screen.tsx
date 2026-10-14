/**
 * A building's page (/building/[id]): the product card on its tint with the scene, the state and
 * what you learn there, then its lessons in order. The path decides when a lesson opens: done
 * lessons can be played again, today's step plays now, the others say at which step they come.
 * Once built, the page says when its resident comes by with a problem (the review); while they
 * wait, they stand at the door in the scene and the main button is "Aiutalo".
 */
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Check, Lock } from 'lucide-react-native';

import { Button, Card, Icon, IconButton, iconSize, PressableScale, Screen, Text, VStack } from '@/components/ui';
import { getChapter } from '@/content/courses';
import { getReviewSet } from '@/content/reviews';
import { agree, BUILDINGS, isBuildingId, theBuilding, type BuildingId } from '@/content/village';
import { goBackOr } from '@/features/shop/lib/navigation';
import { formatLongDate } from '@/lib/dates';
import { buildingState, chaptersDone, daysToReview, isReviewWaiting, reviewRecordOf, useStoreShallow } from '@/store';
import { buildingTones, layout, radius, spacing } from '@/theme';

import { BuildingScene } from './components/building-scene';
import { VILLAGE_COPY } from './copy';
import { usePath } from './lib/model';
import { openLesson, openReview } from './lib/navigation';

const ART = 200;

export function BuildingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const buildingId: BuildingId = isBuildingId(id) ? id : 'municipio';
  const [now] = useState(() => Date.now());
  const s = useStoreShallow((st) => ({
    chapterRecords: st.chapterRecords,
    openSites: st.openSites,
    bloomed: st.bloomed,
    reviews: st.reviews,
    pact: st.pact,
  }));
  const b = BUILDINGS[buildingId];
  const tone = buildingTones[b.tone];
  const state = buildingState(buildingId, s);
  const total = b.chapterIds.length;
  const done = chaptersDone(buildingId, s.chapterRecords);
  const path = usePath();
  const copy = VILLAGE_COPY.building;

  // The resident and the review: when they come, that they wait, or when it bloomed.
  const resident = getReviewSet(buildingId)?.resident;
  const waiting = resident !== undefined && isReviewWaiting(buildingId, s, now);
  const reviewText = (() => {
    if (!resident) return null;
    const review = VILLAGE_COPY.ripasso;
    const bloomedAt = reviewRecordOf(s, buildingId)?.bloomedAt;
    if (state === 'fiorito') return bloomedAt ? review.bloomed(agree(b, 'Fiorit'), formatLongDate(bloomedAt), resident.who) : null;
    const days = daysToReview(buildingId, s, now);
    if (state !== 'costruito' || days === null) return null;
    if (waiting) return `${review.waiting(resident.who, 'qui')} ${review.waitingWhy(theBuilding(b))}`;
    return reviewRecordOf(s, buildingId) ? review.again(resident.who, days) : review.soon(resident.who, days, theBuilding(b));
  })();

  // Where this building's lessons sit on the path.
  const stepOf = (chapterId: string) => path.steps.findIndex((step) => step.chapterId === chapterId);
  const todayId = path.steps[path.current]?.chapterId;
  const today = todayId && b.chapterIds.includes(todayId) ? getChapter(todayId) : undefined;
  const firstStep = total > 0 ? stepOf(b.chapterIds[0]) : -1;
  const firstDone = b.chapterIds.find((chapterId) => s.chapterRecords[chapterId] !== undefined);

  const issueText = (() => {
    if (today || done === total || total === 0) return null;
    if (done > 0) return copy.later;
    return firstStep >= 0 ? copy.atStep(firstStep + 1) : null;
  })();

  const footer = waiting ? (
    <Button title={VILLAGE_COPY.ripasso.help(resident.pronoun)} fullWidth onPress={() => openReview(buildingId)} />
  ) : today ? (
    <Button title={copy.continue(today.title)} fullWidth onPress={() => openLesson(today.id)} />
  ) : firstDone ? (
    <Button title={copy.practise} fullWidth onPress={() => openLesson(firstDone)} />
  ) : total > 0 ? (
    <Button title={copy.toPath} fullWidth onPress={() => router.navigate('/path')} />
  ) : undefined;

  return (
    <Screen
      edges={['top', 'bottom']}
      header={
        <View style={styles.header}>
          <IconButton icon={ArrowLeft} accessibilityLabel={copy.back} onPress={() => goBackOr('/')} />
        </View>
      }
      footer={footer}>
      <VStack gap="xl" style={styles.body}>
        <View style={[styles.card, { backgroundColor: tone.tint, boxShadow: `0px 70px 70px -70px ${tone.glow}` }]}>
          <VStack gap="xxs">
            <Text variant="code" style={{ color: tone.deep }}>
              {VILLAGE_COPY.state[state]}
            </Text>
            <Text variant="displayMd" accessibilityRole="header">
              {b.name}
            </Text>
            <Text variant="titleSm" style={{ color: tone.deep }}>
              {b.topic}
            </Text>
          </VStack>
          <Text variant="bodyMd" color="textSecondary">
            {b.description}
          </Text>
          <View style={styles.art}>
            <BuildingScene id={buildingId} state={state} progress={total ? done / total : 0} visitor={waiting} width={ART} />
          </View>
        </View>

        {issueText ? (
          <Card padding="md">
            <Text variant="bodyMd" color="textSecondary">
              {issueText}
            </Text>
          </Card>
        ) : null}

        {reviewText ? (
          <Card padding="md">
            <Text variant="bodyMd" color={waiting ? 'text' : 'textSecondary'}>
              {reviewText}
            </Text>
          </Card>
        ) : null}

        <VStack gap="sm">
          <Text variant="titleLg">{copy.lessonsTitle}</Text>
          {total === 0 ? (
            <Text variant="bodyMd" color="textSecondary">
              {copy.soon}
            </Text>
          ) : (
            b.chapterIds.map((chapterId, index) => {
              const chapter = getChapter(chapterId);
              if (!chapter) return null;
              const isDone = s.chapterRecords[chapterId] !== undefined;
              const isNext = chapterId === todayId && !isDone;
              const playable = isDone || isNext;
              return (
                <PressableScale
                  key={chapterId}
                  disabled={!playable}
                  onPress={() => openLesson(chapterId)}
                  accessibilityLabel={`${VILLAGE_COPY.lessonOf(index + 1, total)}: ${chapter.title}${isDone ? `, ${copy.done}` : ''}`}
                  style={styles.row}>
                  <Card padding="md" contentStyle={styles.rowContent}>
                    <Text variant="code" color="textSecondary" style={styles.num}>
                      {String(index + 1).padStart(2, '0')}
                    </Text>
                    <VStack flex gap="xxxs">
                      <Text variant="titleSm">{chapter.title}</Text>
                      <Text variant="bodySm" color="textSecondary">
                        {`${VILLAGE_COPY.minutes(chapter.estimatedMinutes)} · ${VILLAGE_COPY.bricksReward(chapter.coinReward)} ${VILLAGE_COPY.bricks}`}
                      </Text>
                    </VStack>
                    {isDone ? (
                      <Icon icon={Check} size={iconSize.md} color="successText" />
                    ) : isNext ? (
                      <Text variant="labelSm">{copy.next}</Text>
                    ) : (
                      <Icon icon={Lock} size={iconSize.sm} color="textDisabled" />
                    )}
                  </Card>
                </PressableScale>
              );
            })
          )}
        </VStack>
      </VStack>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { height: layout.headerHeight, flexDirection: 'row', alignItems: 'center', paddingHorizontal: layout.screenX },
  body: { paddingBottom: spacing.xl },
  card: { borderRadius: radius.xxl, padding: spacing.xl, gap: spacing.md },
  art: { alignItems: 'center', marginBottom: -spacing.xxl },
  row: { borderRadius: radius.xl },
  rowContent: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  num: { width: 24 },
});
