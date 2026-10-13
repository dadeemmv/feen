/**
 * "Percorso" (tab): the second layer of the app. The village is where you live; the path is how
 * it grows — one road of lessons in sequence, from the two buildings promised by your animal.
 * Steps are grouped by building: each group opens with the building's card (it grows with its
 * steps), then the lessons wind down the screen. Done steps are green and can be played again,
 * today's step is blue with the partner beside it, the next ones open one after the other.
 */
import { useRef, useState } from 'react';
import { StyleSheet, View, type ScrollView } from 'react-native';
import Animated from 'react-native-reanimated';
import { Check, Lock, Play } from 'lucide-react-native';

import { MascotArt } from '@/components/illustrations';
import { avatarSize, Card, Icon, PressableScale, ProgressBar, Screen, Text, toast, VStack } from '@/components/ui';
import { getChapter } from '@/content/courses';
import { BUILDING_IDS, BUILDINGS, FIRST_STONE, type BuildingId } from '@/content/village';
import { useEntering } from '@/features/onboarding/lib/entering';
import { chaptersDone, selectMascot, stepStatus, useStore, type PathStep, type StepStatus } from '@/store';
import { buildingTones, fonts, radius, spacing, useTheme } from '@/theme';

import { BuildingScene } from './components/building-scene';
import { VILLAGE_COPY } from './copy';
import { usePath, useVillage } from './lib/model';
import { openBuilding, openLesson } from './lib/navigation';

const NODE = 72;
const NODE_TODAY = 84;
/** Height of a step row: node + title. Today's row also holds the "Inizia" pill and the meta line. */
const ROW = 118;
const ROW_TODAY = 168;
const LABEL_WIDTH = 150;
const SCENE = 92;
/** The road winds: horizontal offset of each step, as a fraction of the swing. */
const WIND = [0, 0.7, 1, 0.7, 0, -0.7, -1, -0.7];
/** Today's step stays this far below the top when the screen scrolls to it. */
const SCROLL_MARGIN = 220;

type Section = { building: BuildingId; steps: { step: PathStep; index: number }[] };

/** Consecutive steps of the same building form a section. */
function sectionsOf(steps: readonly PathStep[]): Section[] {
  const sections: Section[] = [];
  steps.forEach((step, index) => {
    const last = sections.at(-1);
    if (last?.building === step.building) last.steps.push({ step, index });
    else sections.push({ building: step.building, steps: [{ step, index }] });
  });
  return sections;
}

export function PathScreen() {
  const [now] = useState(() => Date.now());
  const village = useVillage(now);
  const path = usePath();
  const records = useStore((s) => s.chapterRecords);
  const mascotId = useStore(selectMascot);
  const { rise } = useEntering();
  const [width, setWidth] = useState(0);
  const copy = VILLAGE_COPY.path;

  // Scroll once to today's step (the list's offset and the step's offset arrive in any order).
  const scrollRef = useRef<Animated.ScrollView & ScrollView>(null);
  const listRef = useRef<View>(null);
  const offsets = useRef<{ list?: number; step?: number; done: boolean }>({ done: false });
  const scrollToToday = () => {
    const o = offsets.current;
    if (o.done || o.list === undefined || o.step === undefined) return;
    o.done = true;
    scrollRef.current?.scrollTo({ y: Math.max(0, o.list + o.step - SCROLL_MARGIN), animated: false });
  };

  const total = path.steps.length;
  const done = path.steps.filter((step) => records[step.chapterId] !== undefined).length;
  const sections = sectionsOf(path.steps);
  const waiting = BUILDING_IDS.filter((id) => BUILDINGS[id].chapterIds.length === 0 && id !== FIRST_STONE);
  const swing = Math.max(0, Math.min(72, width / 2 - NODE_TODAY / 2 - avatarSize.md - spacing.md));

  return (
    <Screen withTabBar edges={['top']} scrollRef={scrollRef}>
      <Animated.View entering={rise(0)} style={styles.heading}>
        <Text variant="displayMd" accessibilityRole="header">
          {copy.titleStart}
          <Text variant="displayMd" style={styles.italic}>
            {copy.titleWord}
          </Text>
        </Text>
        <Text variant="bodyLg" color="textSecondary">
          {copy.subtitle}
        </Text>
        <VStack gap="xs" style={styles.progress}>
          <Text variant="labelMd">{copy.progress(done, total)}</Text>
          <ProgressBar value={total ? done / total : 0} size="sm" accessibilityLabel={copy.progressA11y(done, total)} />
        </VStack>
      </Animated.View>

      <View
        ref={listRef}
        style={styles.list}
        onLayout={(e) => {
          setWidth(e.nativeEvent.layout.width);
          offsets.current.list = e.nativeEvent.layout.y;
          scrollToToday();
        }}>
        {sections.map((section, sectionIndex) => (
          <Animated.View key={`${section.building}-${sectionIndex}`} entering={rise(Math.min(sectionIndex + 1, 5))}>
            <SectionHeader building={section.building} state={village.states[section.building]} records={records} />
            <View style={styles.rows}>
              {section.steps.map(({ step, index }) => {
                const status = stepStatus(index, path.current, step, records);
                return (
                  <StepRow
                    key={step.chapterId}
                    step={step}
                    index={index}
                    total={total}
                    status={status}
                    previous={index > 0 ? path.steps[index - 1] : undefined}
                    x={width / 2 + WIND[index % WIND.length] * swing}
                    partnerSide={WIND[index % WIND.length] > 0 ? -1 : 1}
                    mascotId={status === 'oggi' ? mascotId : null}
                    onTodayLayout={
                      status === 'oggi' && index > 0
                        ? (ref) => {
                            if (!listRef.current) return;
                            ref.measureLayout(listRef.current, (_x, y) => {
                              offsets.current.step = y;
                              scrollToToday();
                            });
                          }
                        : undefined
                    }
                  />
                );
              })}
            </View>
          </Animated.View>
        ))}
      </View>

      <VStack gap="sm" style={styles.end}>
        {path.current >= total && total > 0 ? (
          <Card padding="lg">
            <Text variant="bodyMd">{copy.finished}</Text>
          </Card>
        ) : null}
        {waiting.length > 0 ? (
          <Text variant="bodySm" color="textSecondary" align="center">
            {copy.soon(listOf(waiting.map((id) => BUILDINGS[id].name)))}
          </Text>
        ) : null}
      </VStack>
    </Screen>
  );
}

/** "Banco, Bottega e Ponte". */
function listOf(names: string[]): string {
  return names.length < 2 ? (names[0] ?? '') : `${names.slice(0, -1).join(', ')} e ${names.at(-1)}`;
}

function SectionHeader({
  building,
  state,
  records,
}: {
  building: BuildingId;
  state: ReturnType<typeof useVillage>['states'][BuildingId];
  records: ReturnType<typeof useStore.getState>['chapterRecords'];
}) {
  const b = BUILDINGS[building];
  const tone = buildingTones[b.tone];
  const total = b.chapterIds.length;
  const done = chaptersDone(building, records);
  const stateLabel = VILLAGE_COPY.stateShort[state];
  return (
    <PressableScale
      onPress={() => openBuilding(building)}
      accessibilityRole="button"
      accessibilityLabel={VILLAGE_COPY.path.sectionA11y(b.name, b.topic, stateLabel)}
      style={[styles.section, { backgroundColor: tone.tint, boxShadow: `0px 60px 60px -60px ${tone.glow}` }]}>
      <VStack flex gap="xxxs">
        <Text variant="code" style={{ color: tone.deep }}>
          {VILLAGE_COPY.path.sectionMeta(stateLabel, done, total)}
        </Text>
        <Text variant="titleLg">{b.name}</Text>
        <Text variant="bodySm" style={{ color: tone.deep }}>
          {b.topic}
        </Text>
      </VStack>
      <BuildingScene id={building} state={state} progress={total ? done / total : 0} width={SCENE} />
    </PressableScale>
  );
}

function StepRow({
  step,
  index,
  total,
  status,
  previous,
  x,
  partnerSide,
  mascotId,
  onTodayLayout,
}: {
  step: PathStep;
  index: number;
  total: number;
  status: StepStatus;
  previous?: PathStep;
  /** Centre of the node in the list. */
  x: number;
  /** The partner stands beside today's step, on the side with more room. */
  partnerSide: 1 | -1;
  mascotId: ReturnType<typeof selectMascot>;
  onTodayLayout?: (ref: View) => void;
}) {
  const { colors } = useTheme();
  const rowRef = useRef<View>(null);
  const chapter = getChapter(step.chapterId);
  if (!chapter) return null;
  const today = status === 'oggi';
  const size = today ? NODE_TODAY : NODE;
  const copy = VILLAGE_COPY.path;

  const press = () => {
    if (status !== 'chiusa') {
      openLesson(step.chapterId);
      return;
    }
    const before = previous ? getChapter(previous.chapterId) : undefined;
    if (before) toast.show(copy.locked(before.title));
  };

  const face = {
    fatta: { backgroundColor: colors.successSolid },
    oggi: { backgroundColor: colors.accentSolid },
    chiusa: { backgroundColor: colors.surfaceSunken },
  }[status];

  return (
    <View
      ref={rowRef}
      style={[styles.row, { height: today ? ROW_TODAY : ROW }]}
      onLayout={() => {
        if (onTodayLayout && rowRef.current) onTodayLayout(rowRef.current);
      }}>
      {today ? (
        <View style={[styles.pill, { left: x - LABEL_WIDTH / 2, width: LABEL_WIDTH }]} pointerEvents="none">
          <View style={[styles.pillBody, { backgroundColor: colors.accentSolid }]}>
            <Text variant="labelSm" color="onAccent">
              {copy.start}
            </Text>
          </View>
          <View style={[styles.pillTip, { borderTopColor: colors.accentSolid }]} />
        </View>
      ) : null}
      <PressableScale
        onPress={press}
        accessibilityRole="button"
        accessibilityLabel={copy.stepA11y(index + 1, total, chapter.title, status)}
        style={[
          styles.node,
          face,
          { width: size, height: size, left: x - size / 2, top: today ? spacing.xxxl : 0 },
          today && { boxShadow: `0px 40px 40px -40px ${colors.accentSolid}` },
        ]}>
        <Icon
          icon={status === 'fatta' ? Check : status === 'oggi' ? Play : Lock}
          size={today ? 'xl' : 'lg'}
          color={status === 'chiusa' ? 'textDisabled' : 'onAccent'}
          fill={today ? 'onAccent' : undefined}
        />
      </PressableScale>
      {today && mascotId ? (
        <View
          style={[
            styles.partner,
            {
              top: spacing.xxxl + (NODE_TODAY - avatarSize.md) / 2,
              left: x + partnerSide * (NODE_TODAY / 2 + spacing.sm + avatarSize.md / 2) - avatarSize.md / 2,
            },
          ]}
          pointerEvents="none">
          <MascotArt id={mascotId} framing="bust" width={avatarSize.md} />
        </View>
      ) : null}
      <View
        style={[styles.label, { left: x - LABEL_WIDTH / 2, top: (today ? spacing.xxxl : 0) + size + spacing.xs }]}
        pointerEvents="none">
        <Text variant={today ? 'labelMd' : 'labelSm'} color={status === 'chiusa' ? 'textTertiary' : 'text'} align="center" numberOfLines={2}>
          {chapter.title}
        </Text>
        {today ? (
          <Text variant="bodySm" color="textSecondary" align="center">
            {copy.meta(chapter.estimatedMinutes, chapter.coinReward)}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { gap: spacing.xs, marginTop: spacing.sm, marginBottom: spacing.xl },
  italic: { fontFamily: fonts.serif.italic, letterSpacing: 0 },
  progress: { marginTop: spacing.sm },
  list: { gap: spacing.xl },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingLeft: spacing.lg,
    paddingRight: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: radius.xxl,
  },
  rows: { marginTop: spacing.xl },
  row: { position: 'relative' },
  node: { position: 'absolute', alignItems: 'center', justifyContent: 'center', borderRadius: radius.pill },
  pill: { position: 'absolute', top: 0, alignItems: 'center' },
  pillBody: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xxs, borderRadius: radius.pill },
  pillTip: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  partner: { position: 'absolute' },
  label: { position: 'absolute', width: LABEL_WIDTH, gap: spacing.xxxs },
  end: { marginTop: spacing.xl, paddingBottom: spacing.xxl },
});
