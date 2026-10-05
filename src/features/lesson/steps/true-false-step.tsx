/**
 * True / false ("🎩 METTITI ALLA PROVA"): statement image in a rounded frame, the statement, then
 * two big side-by-side tiles "✓ Vero" / "✕ Falso" with icon discs.
 */
import { StyleSheet, View } from 'react-native';
import { Check, X, type LucideIcon } from 'lucide-react-native';

import { iconSize, iconStroke } from '@/components/ui';
import type { TrueFalseStep as TrueFalseStepData } from '@/content/types';
import { radius, spacing, useTheme } from '@/theme';

import { COPY } from '../copy';
import { trueFalseOptionId } from '../machine';
import { lessonMetrics } from '../metrics';
import { OptionTile, type OptionStatus } from '../components/option-tile';
import { GradedStepCard, StepArt, StepPrompt } from '../components/step-layout';
import { isAnswering, singleOptionStatus, type StepViewProps } from './types';

const CHOICES: { value: boolean; label: string; icon: LucideIcon }[] = [
  { value: true, label: COPY.steps.trueLabel, icon: Check },
  { value: false, label: COPY.steps.falseLabel, icon: X },
];

export function TrueFalseStep({
  step,
  answer,
  phase,
  disabledOptionIds,
  wrongSignal,
  onSelect,
  bottomInset,
  compact,
}: StepViewProps<TrueFalseStepData>) {
  const selectedId = typeof answer === 'boolean' ? trueFalseOptionId(answer) : null;
  const answering = isAnswering(phase);

  return (
    <GradedStepCard
      tag={step.tag}
      art={step.illustration ? <StepArt illustration={step.illustration} compact={compact} framed /> : undefined}
      prompt={<StepPrompt>{step.statement}</StepPrompt>}
      bottomInset={bottomInset}
      compact={compact}>
      <View style={styles.row}>
        {CHOICES.map((choice) => {
          const id = trueFalseOptionId(choice.value);
          const status = singleOptionStatus(id, selectedId, phase, disabledOptionIds);
          return (
            <OptionTile
              key={id}
              label={choice.label}
              status={status}
              locked={!answering}
              onPress={() => onSelect(choice.value)}
              leading={<IconDisc icon={choice.icon} status={status} />}
              indicator={false}
              labelVariant="titleSm"
              shakeSignal={status === 'wrong' ? wrongSignal : 0}
              style={styles.cell}
              faceStyle={styles.face}
              testID={`option-${id}`}
            />
          );
        })}
      </View>
    </GradedStepCard>
  );
}

function IconDisc({ icon: Glyph, status }: { icon: LucideIcon; status: OptionStatus }) {
  const theme = useTheme();
  const c = theme.colors;
  const tone =
    status === 'correct'
      ? { bg: c.successSolid, fg: c.onBrand }
      : status === 'wrong'
        ? { bg: c.dangerSolid, fg: c.onBrand }
        : status === 'selected'
          ? { bg: c.brandSolid, fg: c.onBrand }
          : { bg: c.fill, fg: c.textSecondary };
  return (
    <View style={[styles.disc, { backgroundColor: tone.bg }]}>
      <Glyph size={iconSize.md} color={tone.fg} strokeWidth={iconStroke.heavy} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm },
  cell: { flex: 1 },
  face: { minHeight: lessonMetrics.booleanTileHeight, paddingHorizontal: spacing.sm },
  disc: {
    width: iconSize.xl + spacing.xxs,
    height: iconSize.xl + spacing.xxs,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
