/**
 * Lesson completion: the progress shows in the world, not in points. The lesson's building pops
 * in at the top (its site with the walls a bit higher, or finished), the partner says one line,
 * then bricks, residents and the answers right at the first try. When the lesson finishes its
 * building the screen turns lilac (the achievement colour), like the first stone: "Pozzo
 * costruito." with confetti; any other lesson stays on indigo: "Lezione fatta.", with the italic
 * word in sun. Rewards were committed once by the controller
 * when the last step was passed; "Torna al borgo" goes back to the village, "Rivedi le risposte"
 * opens the answers review.
 */
import type { ReactNode } from 'react';
import { StyleSheet, View, useWindowDimensions, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { BrickIcon, CheckBadgeIcon } from '@/components/icons';
import { MascotArt } from '@/components/illustrations';
import { Button, Confetti, CountUp, HStack, Screen, StatTile, Text, avatarSize, iconSize, useReduceMotion } from '@/components/ui';
import { getChapter } from '@/content/courses';
import { getMascot } from '@/content/personality';
import { isGradedStep, type Chapter, type LessonStep } from '@/content/types';
import { BUILDINGS, buildingOfChapter, type Building } from '@/content/village';
import { PopIn } from '@/features/rewards';
import { BuildingScene } from '@/features/village/components/building-scene';
import { chaptersDone, countResidents, isBuilt, selectMascot, useStore, useStoreShallow } from '@/store';
import { duration, easing, fonts, radius, spacing, useTheme } from '@/theme';

import { COPY } from '../copy';
import { COMPLETION, lessonMetrics } from '../metrics';
import type { LessonCompletion } from '../use-lesson-controller';
import { ReviewSheet } from './review-sheet';
import { StreakMoment } from './streak-moment';

export type CompletionScreenProps = {
  chapter: Chapter;
  completion: LessonCompletion;
  practice: boolean;
  steps: readonly LessonStep[];
  onContinue: () => void;
  /** "Rivedi le risposte" sheet (state owned by the player: back / Escape must close it first). */
  reviewOpen: boolean;
  onOpenReview: () => void;
  onCloseReview: () => void;
};

const CONFETTI_ORIGIN = { x: 0.5, y: 0.22 };
const SCENE_WIDTH = 200;
const SCENE_WIDTH_COMPACT = 150;

/** "costruito", "costruita", "costruite": the participle agrees with the building ("alle Mura"). */
function builtWord(building: Building): string {
  if (building.at.startsWith('alle ')) return 'costruite.';
  if (building.at.startsWith('alla ')) return 'costruita.';
  return COPY.completion.builtWord;
}

export function CompletionScreen({
  chapter,
  completion,
  practice,
  steps,
  onContinue,
  reviewOpen,
  onOpenReview,
  onCloseReview,
}: CompletionScreenProps) {
  const theme = useTheme();
  const { height } = useWindowDimensions();
  const compact = height < lessonMetrics.compactHeight;
  const { summary, results } = completion;
  const buildingId = buildingOfChapter(chapter.id);
  const building = buildingId ? BUILDINGS[buildingId] : undefined;
  const village = useStoreShallow((s) => ({ chapterRecords: s.chapterRecords, pact: s.pact, activeDays: s.activeDays }));
  const mascotId = useStore(selectMascot);
  const partner = mascotId ? getMascot(mascotId) : null;

  const builtNow = Boolean(buildingId && isBuilt(buildingId, village) && summary.isFirstCompletion);
  const total = building?.chapterIds.length ?? 0;
  const done = buildingId ? chaptersDone(buildingId, village.chapterRecords) : 0;
  const nextId = building?.chapterIds.find((id) => village.chapterRecords[id] === undefined);
  const next = nextId ? getChapter(nextId) : undefined;
  const residents = countResidents(village);
  const firstTry = results.filter((r) => r.firstTryCorrect).length;
  const hasReview = steps.some(isGradedStep);

  const titleStart = builtNow && building ? `${building.name} ` : practice ? COPY.completion.replayStart : 'Lezione ';
  const titleWord = builtNow && building ? builtWord(building) : practice ? COPY.completion.replayWord : 'fatta.';
  const partnerLine = practice
    ? COPY.completion.partnerReplay
    : builtNow
      ? COPY.completion.partnerBuilt
      : COPY.completion.partnerGrow(Math.max(1, total - done));
  // On lilac the tiles turn white, as on the first stone; on indigo they are deep indigo tiles.
  const tileStyle = builtNow ? { backgroundColor: theme.colors.surfaceRaised } : undefined;
  // Grey text drops under 4.5:1 on lilac, so the secondary lines there stay in ink.
  const subtleText = builtNow ? 'text' : 'textSecondary';
  const step = COMPLETION.revealMs;

  const footer = (
    <Reveal delay={COMPLETION.ctaDelayMs} style={styles.actions}>
      <Button title={COPY.completion.cta} fullWidth onPress={onContinue} testID="lesson-complete-continue" />
      {hasReview ? (
        <Button title={COPY.completion.review} variant="ghost" size="md" fullWidth onPress={onOpenReview} />
      ) : null}
    </Reveal>
  );

  return (
    <View style={styles.root}>
      <Screen
        background={builtNow ? 'reward' : 'brand'}
        preset="scroll"
        edges={['top']}
        statusBar={builtNow ? 'dark' : 'light'}
        footer={footer}
        contentContainerStyle={styles.content}>
        {buildingId ? (
          <PopIn style={styles.scene}>
            <BuildingScene
              id={buildingId}
              state={builtNow || isBuilt(buildingId, village) ? 'costruito' : 'cantiere'}
              progress={total > 0 ? done / total : undefined}
              width={compact ? SCENE_WIDTH_COMPACT : SCENE_WIDTH}
              accessibilityLabel={building ? `${building.name}, ${building.topic}` : undefined}
            />
          </PopIn>
        ) : null}

        <Reveal delay={step} style={styles.titles}>
          {building ? (
            <Text variant="overline" color={subtleText} align="center">
              {`${building.name} · ${building.topic}`}
            </Text>
          ) : null}
          <Text variant={compact ? 'displayMd' : 'displayLg'} align="center" accessibilityRole="header">
            {titleStart}
            <Text
              variant={compact ? 'displayMd' : 'displayLg'}
              color={builtNow ? 'text' : 'accentText'}
              style={styles.italic}>
              {titleWord}
            </Text>
          </Text>
          <Text variant="titleMd" color={subtleText} align="center">
            {chapter.title}
          </Text>
        </Reveal>

        {partner ? (
          <Reveal delay={step * 2} style={styles.block}>
            <HStack gap="sm" align="center" style={styles.partner}>
              <MascotArt id={partner.id} framing="bust" width={avatarSize.md} />
              <Text variant="bodyMd" style={styles.flex}>
                <Text variant="labelMd">{`${partner.partner.name} · `}</Text>
                {partnerLine}
              </Text>
            </HStack>
          </Reveal>
        ) : null}

        <Reveal delay={COMPLETION.statsDelayMs - step} style={[styles.block, styles.stats]}>
          <StatTile
            size="lg"
            style={tileStyle}
            icon={<BrickIcon size={iconSize.xl} muted={summary.coinsEarned === 0} />}
            value={<CountUp value={summary.coinsEarned} format={(n) => `+${n}`} variant="displaySm" delay={COMPLETION.statsDelayMs} />}
            label={COPY.completion.kiwi}
          />
          <StatTile
            size="lg"
            style={tileStyle}
            icon={<CheckBadgeIcon size={iconSize.xl} muted={firstTry === 0} />}
            value={COPY.completion.firstTryValue(firstTry, results.length)}
            label={COPY.completion.firstTryLabel}
          />
        </Reveal>

        {summary.isNewStreakDay ? (
          <Reveal delay={COMPLETION.streakDelayMs} style={styles.block}>
            <StreakMoment isNewStreakDay streak={residents} delay={COMPLETION.streakDelayMs + step} />
          </Reveal>
        ) : null}

        {practice ? (
          <Reveal delay={COMPLETION.nextDelayMs} style={styles.block}>
            <Text variant="bodySm" color="textSecondary" align="center">
              {COPY.completion.replayNote}
            </Text>
          </Reveal>
        ) : !builtNow && next && building ? (
          <Reveal delay={COMPLETION.nextDelayMs} style={styles.block}>
            <NextLessonCard chapter={next} at={building.at} />
          </Reveal>
        ) : null}
      </Screen>

      {builtNow ? <Confetti run origin={CONFETTI_ORIGIN} /> : null}
      {hasReview ? (
        <ReviewSheet visible={reviewOpen} steps={steps} results={completion.results} onClose={onCloseReview} />
      ) : null}
    </View>
  );
}

/** The next lesson of the same building. Reads the theme inside the screen (deep indigo tiles on indigo). */
function NextLessonCard({ chapter, at }: { chapter: Chapter; at: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.next, { backgroundColor: theme.colors.surface }]}>
      <Text variant="overline" color="textSecondary">
        {COPY.completion.nextIn(at)}
      </Text>
      <Text variant="titleMd">{chapter.title}</Text>
      <Text variant="bodySm" color="textSecondary">
        {COPY.completion.nextMinutes(chapter.estimatedMinutes)}
      </Text>
    </View>
  );
}

/** Staggered fade-up entrance (plain fade under reduced motion). */
function Reveal({ delay, style, children }: { delay: number; style?: StyleProp<ViewStyle>; children: ReactNode }) {
  const reduceMotion = useReduceMotion();
  const entering = reduceMotion
    ? FadeIn.duration(duration.fast)
    : FadeInDown.delay(delay).duration(duration.slower).easing(easing.enter);
  return (
    <Animated.View entering={entering} style={style}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  // Tall phones: the moment sits in the optical centre instead of hugging the top.
  content: { flexGrow: 1, justifyContent: 'center', paddingTop: spacing.md },
  scene: { alignItems: 'center', marginBottom: spacing.md },
  titles: { gap: spacing.xxs, alignItems: 'center', marginBottom: spacing.lg },
  italic: { fontFamily: fonts.serif.italic, letterSpacing: 0 },
  block: { alignSelf: 'stretch', marginBottom: spacing.sm },
  partner: { paddingHorizontal: spacing.xxs },
  flex: { flex: 1 },
  stats: { flexDirection: 'row', gap: spacing.xs },
  next: { gap: spacing.xxxs, padding: spacing.lg, borderRadius: radius.xl },
  actions: { gap: spacing.xxs },
});
