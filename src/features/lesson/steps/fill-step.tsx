/**
 * Fill in the blank: the sentence sits in a raised card with an inline blank chip (dashed while
 * empty) that fills with the chosen word; the options are pill chips below. The blank takes the
 * feedback colours (brand while choosing, green when right, red + shake when wrong).
 */
import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { Text, borderWidth, chipHeight, hairline, useReduceMotion, useShake } from '@/components/ui';
import type { FillStep as FillStepData } from '@/content/types';
import { duration, easing, radius, spacing, useTheme, type Theme } from '@/theme';

import { COPY } from '../copy';
import { OptionTile, type OptionStatus } from '../components/option-tile';
import { GradedStepCard, StepPrompt } from '../components/step-layout';
import { isAnswering, singleOptionStatus, type StepViewProps } from './types';

const BLANK_MARK = '___';
/** Punctuation glued to the blank ("___." → the dot stays next to the chip). */
const LEADING_PUNCTUATION = /^[.,;:!?…)»”]+/;

type SentenceParts = { before: string[]; glued: string; after: string[] };

function splitSentence(sentence: string): SentenceParts {
  const [head = '', ...rest] = sentence.split(BLANK_MARK);
  const tail = rest.join(BLANK_MARK);
  const glued = LEADING_PUNCTUATION.exec(tail)?.[0] ?? '';
  const words = (text: string) => text.split(/\s+/).filter(Boolean);
  return { before: words(head), glued, after: words(tail.slice(glued.length)) };
}

export function FillStep({
  step,
  answer,
  phase,
  disabledOptionIds,
  wrongSignal,
  onSelect,
  bottomInset,
  compact,
}: StepViewProps<FillStepData>) {
  const selectedId = typeof answer === 'string' ? answer : null;
  const selected = step.options.find((option) => option.id === selectedId);
  const answering = isAnswering(phase);
  const parts = splitSentence(step.sentence);
  const blankStatus: OptionStatus = selectedId
    ? singleOptionStatus(selectedId, selectedId, phase, disabledOptionIds)
    : 'idle';

  return (
    <GradedStepCard
      tag={step.tag}
      prompt={<StepPrompt>{step.prompt}</StepPrompt>}
      bottomInset={bottomInset}
      compact={compact}>
      <SentenceCard parts={parts} label={selected?.label} status={blankStatus} wrongSignal={wrongSignal} />
      <Text variant="labelSm" color="textTertiary" align="center">
        {COPY.steps.fillHint}
      </Text>
      <View style={styles.options}>
        {step.options.map((option) => {
          const status = singleOptionStatus(option.id, selectedId, phase, disabledOptionIds);
          return (
            <OptionTile
              key={option.id}
              label={option.label}
              status={status}
              shape="pill"
              locked={!answering}
              onPress={() => onSelect(option.id)}
              testID={`option-${option.id}`}
            />
          );
        })}
      </View>
    </GradedStepCard>
  );
}

type SentenceProps = { parts: SentenceParts; label?: string; status: OptionStatus; wrongSignal: number };

function SentenceCard({ parts, label, status, wrongSignal }: SentenceProps) {
  const theme = useTheme();
  const words = (list: string[], prefix: string) =>
    list.map((word, index) => (
      <Text key={`${prefix}-${index}`} variant="bodyLg">
        {word}
      </Text>
    ));

  return (
    <View
      style={[styles.sentence, { backgroundColor: theme.colors.surfaceRaised, borderColor: theme.colors.borderSubtle }]}
      accessible
      accessibilityLabel={[...parts.before, label ?? COPY.steps.blankA11y, parts.glued, ...parts.after].join(' ')}>
      {words(parts.before, 'b')}
      <View style={styles.glued}>
        <BlankChip label={label} status={status} wrongSignal={wrongSignal} />
        {parts.glued ? <Text variant="bodyLg">{parts.glued}</Text> : null}
      </View>
      {words(parts.after, 'a')}
    </View>
  );
}

function blankColors(theme: Theme, status: OptionStatus, filled: boolean) {
  const c = theme.colors;
  if (!filled) return { bg: c.surface, border: c.borderStrong, fg: c.textTertiary };
  switch (status) {
    case 'correct':
      return { bg: c.successBg, border: c.successSolid, fg: c.successText };
    case 'wrong':
      return { bg: c.dangerBg, border: c.dangerSolid, fg: c.dangerText };
    default:
      return { bg: c.brandBg, border: c.brandSolid, fg: c.brandText };
  }
}

function BlankChip({ label, status, wrongSignal }: { label?: string; status: OptionStatus; wrongSignal: number }) {
  const theme = useTheme();
  const reduceMotion = useReduceMotion();
  const { style: shakeStyle, shake } = useShake();
  const colors = blankColors(theme, status, label !== undefined);

  const lastSignal = useRef(wrongSignal);
  useEffect(() => {
    const grew = wrongSignal > lastSignal.current;
    lastSignal.current = wrongSignal;
    if (grew) shake();
  }, [wrongSignal, shake]);

  return (
    <Animated.View
      style={[
        styles.blank,
        shakeStyle,
        { backgroundColor: colors.bg, borderColor: colors.border, borderStyle: label ? 'solid' : 'dashed' },
      ]}>
      {label ? (
        <Animated.View
          key={label}
          entering={reduceMotion ? undefined : ZoomIn.duration(duration.base).easing(easing.enter)}>
          <Text variant="labelLg" style={{ color: colors.fg }}>
            {label}
          </Text>
        </Animated.View>
      ) : (
        <View style={styles.blankEmpty} />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sentence: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: spacing.xxs + spacing.xxxs,
    rowGap: spacing.xs,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: hairline,
  },
  glued: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxxs },
  blank: {
    minHeight: chipHeight.md,
    minWidth: chipHeight.md * 3,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: borderWidth.regular,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blankEmpty: { height: spacing.md },
  options: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.xs },
});
