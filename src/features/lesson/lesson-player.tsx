/**
 * Lesson player: header (✕ · progress · ⚑), the current step rendered through the registry and
 * sliding in horizontally, the footer with the partner beside "Continua", and every
 * lesson-internal overlay (answer feedback, exit confirmation, report, "Spiegami il perché",
 * local toasts). Passing the last step swaps the player for the completion screen (overlays stay
 * mounted, so the last feedback dialog can still animate out). No lives, no coins on screen.
 *
 * Logic lives in the pure machine (`machine.ts`) and the controller hook; this file only wires.
 */
import { useEffect, useEffectEvent } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Screen, ToastHost } from '@/components/ui';
import { getMascot } from '@/content/personality';
import type { Chapter, Lesson } from '@/content/types';
import { selectMascot, useStore } from '@/store';
import { duration, spacing } from '@/theme';

import { ExitDialog } from './components/exit-dialog';
import { FeedbackDialogs } from './components/feedback-dialogs';
import { LessonFooter } from './components/lesson-footer';
import { LessonHeader } from './components/lesson-header';
import { ReportSheet } from './components/report-sheet';
import { StepStage } from './components/step-stage';
import { CompletionScreen } from './completion/completion-screen';
import { COPY } from './copy';
import { ExplainSheet } from './explain-sheet';
import { lessonMetrics } from './metrics';
import { StepView } from './steps';
import { useLessonController } from './use-lesson-controller';
import { goBackToPath, useLessonNotice, useLessonOverlays } from './use-lesson-overlays';

/** Breathing room under the last element of a step (nothing floats over the content any more). */
const STEP_BOTTOM = spacing.md;

export type LessonPlayerProps = { chapter: Chapter; lesson: Lesson };

export function LessonPlayer({ chapter, lesson }: LessonPlayerProps) {
  const { height } = useWindowDimensions();
  const compact = height < lessonMetrics.compactHeight;
  const { notice, notify, hide } = useLessonNotice(null);
  const controller = useLessonController(chapter, lesson, notify);
  const overlays = useLessonOverlays(chapter, controller, notify);
  const mascotId = useStore(selectMascot);
  const partner = mascotId ? getMascot(mascotId) : null;

  const { state, step, practice, completion } = controller;

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
                  bottomInset={STEP_BOTTOM}
                  compact={compact}
                />
              </StepStage>
            ) : null}
          </View>
          <LessonFooter
            enabled={controller.primary.enabled}
            onPress={controller.primaryPress}
            partner={partner}
            onAsk={overlays.explain.show}
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
});
