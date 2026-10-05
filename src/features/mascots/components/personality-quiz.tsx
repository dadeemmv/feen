/**
 * The test itself: one statement per screen, the seven-circle scale, a progress header. A tap
 * records the answer and, after a short beat, slides the next statement in; the last one calls
 * `onComplete`. Back (header arrow or Android back) returns to the previous statement, and from
 * the first one calls `onExit`. Answers and position are owned by the caller (onboarding draft
 * or the Account retake), so leaving and coming back resumes where the user was.
 */
import { useEffect, useRef } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { ArrowLeft } from 'lucide-react-native';

import { IconButton, ProgressBar, Screen, Text } from '@/components/ui';
import { PERSONALITY_STATEMENTS, type AgreementValue } from '@/content/personality';
import { useEntering } from '@/features/onboarding/lib/entering';
import { layout, spacing } from '@/theme';

import { MASCOT_COPY } from '../copy';
import { QUIZ_LENGTH, type QuizAnswers } from '../lib/score';
import { mascotMetrics } from '../metrics';
import { LikertScale } from './likert-scale';

export type PersonalityQuizProps = {
  answers: QuizAnswers;
  index: number;
  onAnswer: (statementId: string, value: AgreementValue) => void;
  onIndexChange: (index: number) => void;
  onComplete: () => void;
  onExit: () => void;
};

export function PersonalityQuiz({ answers, index, onAnswer, onIndexChange, onComplete, onExit }: PersonalityQuizProps) {
  const { slide, fade } = useEntering();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copy = MASCOT_COPY.quiz;

  const current = Math.min(Math.max(index, 0), QUIZ_LENGTH - 1);
  const statement = PERSONALITY_STATEMENTS[current];

  const cancelAdvance = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  const back = () => {
    cancelAdvance();
    if (current > 0) onIndexChange(current - 1);
    else onExit();
  };

  // Android back walks through the statements before leaving the test.
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      back();
      return true;
    });
    return () => subscription.remove();
  });

  useEffect(() => cancelAdvance, []);

  const choose = (value: AgreementValue) => {
    onAnswer(statement.id, value);
    cancelAdvance();
    timer.current = setTimeout(() => {
      timer.current = null;
      if (current < QUIZ_LENGTH - 1) onIndexChange(current + 1);
      else onComplete();
    }, mascotMetrics.advanceDelay);
  };

  return (
    <Screen
      preset="fixed"
      edges={['top', 'bottom']}
      header={
        <View style={styles.header}>
          <IconButton icon={ArrowLeft} accessibilityLabel={copy.back} onPress={back} />
          <ProgressBar
            value={(current + 1) / QUIZ_LENGTH}
            tone="accent"
            accessibilityLabel={copy.progressLabel(current + 1, QUIZ_LENGTH)}
            style={styles.bar}
          />
          <Text variant="labelMd" color="textSecondary" tabular aria-hidden>
            {copy.progress(current + 1, QUIZ_LENGTH)}
          </Text>
        </View>
      }
      footer={
        <Animated.View entering={fade(2)}>
          <Text variant="bodySm" color="textTertiary" align="center">
            {copy.hint}
          </Text>
        </Animated.View>
      }>
      <View style={styles.body}>
        <Animated.View key={statement.id} entering={slide(0)} style={styles.statement}>
          <Text variant="overline" color="accentText">
            {copy.overline}
          </Text>
          <Text variant="displaySm" accessibilityRole="header" accessibilityLiveRegion="polite">
            {statement.text}
          </Text>
        </Animated.View>
        <LikertScale value={answers[statement.id]} onChange={choose} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    height: layout.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: layout.screenX,
  },
  bar: { flex: 1, width: undefined },
  body: { flex: 1, justifyContent: 'center', gap: spacing.xxxl, paddingBottom: spacing.xxl },
  statement: { gap: spacing.sm },
});
