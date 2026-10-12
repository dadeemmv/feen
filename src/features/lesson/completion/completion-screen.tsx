/**
 * Lesson completion (spec §5 "Lesson completion / celebration screen", redlines "Completion"):
 * brand full screen, confetti burst, the chapter medal, "Capitolo completato!" (first time) or
 * "Lezione completata!" (replay), XP / Kiwi / Precisione counting up, the streak moment, then
 * what comes next (unlocked chapter, milestone reached, course trophy). Rewards were committed
 * once by the controller when the last step was passed; "Continua" only goes back to the path,
 * which then shows the next node as current. "Rivedi le risposte" opens the answers review.
 */
import type { ReactNode } from 'react';
import { StyleSheet, View, useWindowDimensions, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { Button, Chip, Confetti, Screen, Text, useReduceMotion } from '@/components/ui';
import { getChapter } from '@/content/courses';
import { isGradedStep, type Chapter, type LessonStep } from '@/content/types';
import { BUILDINGS, buildingOfChapter } from '@/content/village';
import { BuildingScene } from '@/features/village/components/building-scene';
import { isBuilt, useStoreShallow } from '@/store';
import { duration, easing, radius, spacing, useTheme } from '@/theme';

import { COPY } from '../copy';
import { COMPLETION, lessonMetrics } from '../metrics';
import type { LessonCompletion } from '../use-lesson-controller';
import { CompletionHero } from './completion-hero';
import { NextChapterCard } from './next-up-cards';
import { ReviewSheet } from './review-sheet';
import { RewardTiles } from './reward-tiles';
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
  const { height } = useWindowDimensions();
  const compact = height < lessonMetrics.compactHeight;
  const { summary } = completion;
  const theme = useTheme();
  // What comes next lives in the lesson's building: its next lesson, or the building finished.
  const buildingId = buildingOfChapter(chapter.id);
  const building = buildingId ? BUILDINGS[buildingId] : undefined;
  const village = useStoreShallow((s) => ({ chapterRecords: s.chapterRecords, pact: s.pact }));
  const builtNow = Boolean(buildingId && isBuilt(buildingId, village) && summary.isFirstCompletion);
  const nextId = building?.chapterIds.find((id) => village.chapterRecords[id] === undefined);
  const next = nextId ? getChapter(nextId) : undefined;
  const hasReview = steps.some(isGradedStep);
  const perfect = summary.accuracy >= 1;

  const footer = (
    <Reveal delay={COMPLETION.ctaDelayMs} style={styles.actions}>
      <Button title={COPY.completion.cta} glow fullWidth onPress={onContinue} testID="lesson-complete-continue" />
      {hasReview ? (
        <Button title={COPY.completion.review} variant="ghost" size="md" fullWidth onPress={onOpenReview} />
      ) : null}
    </Reveal>
  );

  return (
    <View style={styles.root}>
      <Screen
        background="brand"
        preset="scroll"
        edges={['top']}
        statusBar="light"
        footer={footer}
        contentContainerStyle={styles.content}>
        <CompletionHero emoji={chapter.emoji} courseDone={false} compact={compact} />

        <Reveal delay={COMPLETION.revealMs} style={styles.titles}>
          <Text variant="overline" color="accentText" align="center">
            {building ? `${building.name} · ${building.topic}` : COPY.completion.overline(undefined)}
          </Text>
          <Text variant={compact ? 'displayMd' : 'displayLg'} color="accentText" align="center" accessibilityRole="header">
            {summary.isFirstCompletion ? COPY.completion.titleFirst : COPY.completion.titleReplay}
          </Text>
          <Text variant="titleMd" color="textSecondary" align="center">
            {chapter.title}
          </Text>
        </Reveal>

        <Reveal delay={COMPLETION.statsDelayMs - COMPLETION.revealMs} style={styles.block}>
          <RewardTiles
            xp={summary.xpEarned}
            coins={summary.coinsEarned}
            accuracy={summary.accuracy}
            delay={COMPLETION.statsDelayMs}
          />
          {practice || perfect ? (
            <Chip
              label={practice ? COPY.completion.replayNote : COPY.completion.perfect}
              tone={practice ? 'neutral' : 'accent'}
              size="sm"
              style={styles.note}
            />
          ) : null}
        </Reveal>

        <Reveal delay={COMPLETION.streakDelayMs} style={styles.block}>
          <StreakMoment
            isNewStreakDay={summary.isNewStreakDay}
            streak={summary.streakAfter}
            delay={COMPLETION.streakDelayMs + COMPLETION.revealMs}
          />
        </Reveal>

        <Reveal delay={COMPLETION.nextDelayMs} style={[styles.block, styles.nextUp]}>
          {builtNow && buildingId && building ? (
            <View style={[styles.built, { backgroundColor: theme.colors.reward }]}>
              <BuildingScene id={buildingId} state="costruito" width={96} />
              <View style={styles.builtText}>
                <Text variant="titleMd" color="onReward">
                  {COPY.completion.built(building.name)}
                </Text>
                <Text variant="bodySm" color="onReward">
                  {COPY.completion.builtBody}
                </Text>
              </View>
            </View>
          ) : next ? (
            <NextChapterCard chapter={next} justUnlocked={summary.isFirstCompletion} />
          ) : null}
        </Reveal>
      </Screen>

      <Confetti run origin={CONFETTI_ORIGIN} />
      {hasReview ? (
        <ReviewSheet visible={reviewOpen} steps={steps} results={completion.results} onClose={onCloseReview} />
      ) : null}
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
  // Tall phones: the celebration sits in the optical centre instead of hugging the top.
  content: { flexGrow: 1, justifyContent: 'center', paddingTop: spacing.md },
  titles: { gap: spacing.xxs, alignItems: 'center', marginBottom: spacing.xl },
  block: { alignSelf: 'stretch', marginBottom: spacing.sm },
  note: { alignSelf: 'center', marginTop: spacing.sm },
  nextUp: { gap: spacing.xs },
  actions: { gap: spacing.xxs },
  built: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, borderRadius: radius.xl },
  builtText: { flex: 1, gap: spacing.xxxs },
});
