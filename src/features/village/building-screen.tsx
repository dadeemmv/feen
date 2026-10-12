/**
 * A building's page (/building/[id]): the product card on its tint with the scene, the state and
 * what you learn there, then its lessons in order. No locks: a project opens whenever you want
 * (at most two sites, the Tower after the Well) and the reason is said plainly when it cannot.
 */
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';

import { Button, Card, Icon, IconButton, iconSize, PressableScale, Screen, Text, toast, VStack } from '@/components/ui';
import { getChapter } from '@/content/courses';
import { BUILDINGS, isBuildingId, type BuildingId } from '@/content/village';
import { goBackOr } from '@/features/shop/lib/navigation';
import { buildingState, chaptersDone, getStoreState, nextChapterOf, openSiteIssue, useStoreShallow } from '@/store';
import { buildingTones, layout, radius, spacing } from '@/theme';

import { BuildingScene } from './components/building-scene';
import { VILLAGE_COPY } from './copy';
import { openLesson } from './lib/navigation';

const ART = 200;

export function BuildingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const buildingId: BuildingId = isBuildingId(id) ? id : 'municipio';
  const s = useStoreShallow((st) => ({
    chapterRecords: st.chapterRecords,
    openSites: st.openSites,
    bloomed: st.bloomed,
    pact: st.pact,
  }));
  const b = BUILDINGS[buildingId];
  const tone = buildingTones[b.tone];
  const state = buildingState(buildingId, s);
  const total = b.chapterIds.length;
  const done = chaptersDone(buildingId, s.chapterRecords);
  const issue = openSiteIssue(buildingId, s);
  const nextId = nextChapterOf(buildingId, s.chapterRecords);
  const next = nextId ? getChapter(nextId) : undefined;
  const copy = VILLAGE_COPY.building;

  const issueText = (() => {
    if (state === 'cantiere' || !issue) return null;
    if (issue === 'needs-building') return copy.issue['needs-building'](BUILDINGS[b.requires ?? 'pozzo'].name);
    return copy.issue[issue];
  })();

  const start = () => {
    if (state === 'progetto') {
      const result = getStoreState().openSite(buildingId);
      if (!result.ok) return;
      toast.show({ message: copy.opened(b.name), tone: 'success' });
    }
    if (next) openLesson(next.id);
  };

  const canStart = state === 'cantiere' || (state === 'progetto' && issue === null);
  const cta = state === 'progetto' ? copy.open : next && state === 'cantiere' ? copy.continue(next.title) : copy.practise;

  return (
    <Screen
      edges={['top', 'bottom']}
      header={
        <View style={styles.header}>
          <IconButton icon={ArrowLeft} accessibilityLabel={copy.back} onPress={() => goBackOr('/')} />
        </View>
      }
      footer={
        total > 0 && (canStart || state === 'costruito' || state === 'fiorito') ? (
          <Button title={cta} fullWidth onPress={start} />
        ) : undefined
      }>
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
            <BuildingScene id={buildingId} state={state} progress={total ? done / total : 0} width={ART} />
          </View>
        </View>

        {issueText ? (
          <Card padding="md">
            <Text variant="bodyMd" color="textSecondary">
              {issueText}
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
              const isNext = chapterId === nextId && !isDone;
              const playable = isDone || state === 'cantiere';
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
                    ) : null}
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
