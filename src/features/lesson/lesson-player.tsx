/**
 * Lesson player (spec §3.10, redlines "Lesson player"): header (✕ / ⚑ / share, lives + coins,
 * progress), the current step rendered through the registry and sliding in horizontally, the AI
 * sparkle button, the single "Continua" footer, and every lesson-internal overlay (answer
 * feedback, exit confirmation, report, "Spiegami il perché", local toasts). Passing the last
 * step swaps the player for the completion celebration (overlays stay mounted, so the last
 * feedback dialog can still animate out).
 *
 * Logic lives in the pure machine (`machine.ts`) and the controller hook; this file only wires.
 */
import { useEffect, useEffectEvent } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Screen, ToastHost } from '@/components/ui';
import { isGradedStep, type Chapter, type Lesson } from '@/content/types';
import { formatCountdown } from '@/lib/dates';
import { useStore } from '@/store';
import { useLives, useNow } from '@/store/hooks';
import { openSheet } from '@/store/ui';
import { duration, spacing } from '@/theme';

import { AiFab } from './components/ai-fab';
import { ExitDialog } from './components/exit-dialog';
import { FeedbackDialogs } from './components/feedback-dialogs';
import { LessonFooter } from './components/lesson-footer';
import { LessonHeader } from './components/lesson-header';
import { ReportSheet } from './components/report-sheet';
import { StepStage } from './components/step-stage';
import { CompletionScreen } from './completion/completion-screen';
import { COPY } from './copy';
import { ExplainSheet } from './explain-sheet';
import { hasMistakeOnCurrentStep } from './machine';
import { lessonMetrics } from './metrics';
import { StepView } from './steps';
import { isAnswering } from './steps/types';
import { useLessonController } from './use-lesson-controller';
import { goBackToPath, useLessonNotice, useLessonOverlays } from './use-lesson-overlays';

/** Room step content keeps at its bottom so it never ends under the AI button. */
const fabClearance = (compact: boolean) =>
  lessonMetrics.fabBottom[compact ? 'compact' : 'regular'] + lessonMetrics.fabSize + spacing.xs - spacing.md;
/** Lives refill every 2 h: a 30 s tick keeps the "next life in" countdown honest. */
const LIVES_TICK_MS = 30_000;

export type LessonPlayerProps = { chapter: Chapter; lesson: Lesson };

export function LessonPlayer({ chapter, lesson }: LessonPlayerProps) {
  const { height } = useWindowDimensions();
  const compact = height < lessonMetrics.compactHeight;
  const { notice, notify, hide } = useLessonNotice(null);
  const controller = useLessonController(chapter, lesson, notify);
  const overlays = useLessonOverlays(chapter, controller, notify);
  const now = useNow(LIVES_TICK_MS);
  const lives = useLives(now);
  const coins = useStore((s) => s.coins);

  const { state, step, practice, completion } = controller;
  const answering = isAnswering(state.phase);
  const graded = step !== undefined && isGradedStep(step);
  const outOfLives = !practice && !lives.unlimited && lives.lives === 0 && graded && answering;
  const countdown = lives.nextRefillAt === null ? null : formatCountdown(Math.max(0, lives.nextRefillAt - now));

  // One welcome line: where we resumed from, or that this is a replay without lives at stake.
  const greet = useEffectEvent(() => {
    if (controller.resumed) notify(COPY.resumed);
    else if (practice) notify(COPY.practiceStart);
  });
  useEffect(() => greet(), []);

  return (
    <View style={styles.root}>
      {completion ? (
        <Animated.View entering={FadeIn.duration(duration.slow)} style={styles.root}>
          <CompletionScreen
            chapter={chapter}
            completion={completion}
            practice={practice}
            steps={controller.steps}
            onContinue={goBackToPath}
            reviewOpen={overlays.review.open}
            onOpenReview={overlays.review.show}
            onCloseReview={overlays.review.close}
          />
        </Animated.View>
      ) : (
        <Screen
          preset="fixed"
          padded={false}
          edges={['top']}
          statusBar="dark"
          header={
            <LessonHeader
              progress={controller.progress}
              practice={practice}
              onClose={overlays.exit.request}
              onReport={overlays.report.show}
              onShare={overlays.share}
              onLivesPress={() => openSheet('lives')}
              onCoinsPress={() => notify(COPY.coinsInfo(coins))}
            />
          }>
          <View style={styles.body}>
            {step ? (
              <StepStage stepId={step.id} initialStepId={controller.initialStepId}>
                <StepView
                  step={step}
                  answer={state.answer}
                  phase={state.phase}
                  disabledOptionIds={state.disabledOptionIds}
                  wrongSignal={state.attempts}
                  onSelect={controller.select}
                  onMatchMiss={controller.matchMiss}
                  bottomInset={fabClearance(compact)}
                  compact={compact}
                />
              </StepStage>
            ) : null}
            <AiFab
              expanded={hasMistakeOnCurrentStep(state) && answering}
              onPress={overlays.explain.show}
              style={[styles.fab, { bottom: lessonMetrics.fabBottom[compact ? 'compact' : 'regular'] }]}
            />
          </View>
          <LessonFooter
            enabled={controller.primary.enabled}
            onPress={controller.primaryPress}
            outOfLives={outOfLives ? { countdown } : undefined}
            onRefill={() => openSheet('out-of-lives')}
          />
        </Screen>
      )}

      <FeedbackDialogs
        correctVisible={state.phase === 'feedback-correct'}
        wrongVisible={state.phase === 'feedback-wrong'}
        correct={controller.correct}
        wrong={controller.wrong}
        onContinue={controller.next}
        onRetry={controller.retry}
        onExplain={overlays.explain.fromWrong}
        onWrongClosed={overlays.explain.onWrongClosed}
      />
      <ExitDialog
        visible={overlays.exit.open}
        onStay={overlays.exit.stay}
        onLeave={overlays.exit.leave}
        onClosed={overlays.exit.onClosed}
      />
      <ReportSheet
        visible={overlays.report.open}
        onClose={overlays.report.close}
        onSubmit={overlays.report.submit}
        onClosed={overlays.report.onClosed}
      />
      <ExplainSheet visible={overlays.explain.open} topic={overlays.explain.topic} onClose={overlays.explain.close} />
      <ToastHost toast={notice} onHide={hide} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  body: { flex: 1 },
  fab: { position: 'absolute', right: spacing.md + spacing.sm },
});
