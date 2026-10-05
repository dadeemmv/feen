/**
 * "Rivedi le risposte": every graded step of the lesson with its outcome (✓ right at the first
 * try, ↺ right after a mistake), the question and the correct answer, so the learner can go
 * over what tripped them up before leaving.
 */
import { StyleSheet, View } from 'react-native';
import { Check, RotateCcw } from 'lucide-react-native';

import { Sheet, Text, hairline, iconSize, iconStroke, tileSize } from '@/components/ui';
import { getCorrectAnswerLabel } from '@/content/lessons';
import { isGradedStep, type LessonStep } from '@/content/types';
import { radius, spacing, useTheme } from '@/theme';

import { COPY } from '../copy';
import { stepPromptOf } from '../explain/explain-content';
import type { StepResult } from '../machine';

/** The fill-in blank ("___") reads as an omission mark in the recap. */
const BLANK = /_{3,}/g;

export type ReviewSheetProps = {
  visible: boolean;
  steps: readonly LessonStep[];
  results: readonly StepResult[];
  onClose: () => void;
};

export function ReviewSheet({ visible, steps, results, onClose }: ReviewSheetProps) {
  const graded = steps.filter(isGradedStep);
  const firstTry = new Map(results.map((r) => [r.stepId, r.firstTryCorrect]));

  return (
    <Sheet visible={visible} onClose={onClose} title={COPY.completion.reviewTitle} scrollable>
      <View style={styles.list}>
        {graded.map((step, index) => (
          <ReviewRow
            key={step.id}
            index={index}
            prompt={stepPromptOf(step).replace(BLANK, '[…]')}
            answer={getCorrectAnswerLabel(step)}
            clean={firstTry.get(step.id) ?? true}
          />
        ))}
      </View>
    </Sheet>
  );
}

type RowProps = { index: number; prompt: string; answer: string; clean: boolean };

function ReviewRow({ index, prompt, answer, clean }: RowProps) {
  const theme = useTheme();
  const c = theme.colors;
  const Glyph = clean ? Check : RotateCcw;
  const outcome = clean ? COPY.completion.reviewFirstTry : COPY.completion.reviewRetry;

  return (
    <View
      accessible
      accessibilityLabel={`${index + 1}. ${prompt}. ${outcome}. ${COPY.completion.reviewAnswer}: ${answer}`}
      style={[styles.row, { backgroundColor: c.surfaceRaised, borderColor: c.borderSubtle }]}>
      <View style={[styles.disc, { backgroundColor: clean ? c.successSolid : c.warningSolid }]}>
        <Glyph size={iconSize.sm} color={c.onBrand} strokeWidth={iconStroke.heavy} />
      </View>
      <View style={styles.body}>
        <Text variant="overline" color={clean ? 'successText' : 'warningText'}>
          {outcome}
        </Text>
        <Text variant="bodyMd" weight="semiBold" numberOfLines={4}>
          {prompt}
        </Text>
        <Text variant="bodySm" color="textSecondary">
          {COPY.completion.reviewAnswer}:{' '}
          <Text variant="bodySm" weight="bold" color="text">
            {answer}
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.xs },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: hairline,
  },
  disc: {
    width: tileSize.sm - spacing.xxs,
    height: tileSize.sm - spacing.xxs,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, gap: spacing.xxs },
});
