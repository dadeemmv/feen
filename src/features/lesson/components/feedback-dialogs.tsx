/**
 * Answer feedback (strips s_10/s_11/s_16): bottom-anchored dialogs with the badge overlapping the
 * top edge. Correct → green ✓, rotating praise and a reward hint ("Al primo colpo", "3 risposte
 * giuste di fila"), CTA "Continua". Wrong → red ✕, "Ops, la tua risposta non è quella giusta.",
 * what happened to the lives, red CTA "Chiudi" and a shortcut to "Spiegami il perché".
 * Content is frozen by the controller at grading time, so it never changes while animating out.
 */
import { StyleSheet, View } from 'react-native';

import { BoltIcon, FlameIcon, HeartIcon, SparkleIcon } from '@/components/icons';
import { Chip, Dialog, Text, iconSize } from '@/components/ui';
import { spacing } from '@/theme';

import { COPY } from '../copy';
import type { CorrectFeedback, FeedbackChipKind, WrongFeedback } from '../feedback';

export type FeedbackDialogsProps = {
  correctVisible: boolean;
  wrongVisible: boolean;
  correct: CorrectFeedback | null;
  wrong: WrongFeedback | null;
  onContinue: () => void;
  onRetry: () => void;
  onExplain: () => void;
  /** After the wrong dialog finished closing (the explain sheet opens from here). */
  onWrongClosed: () => void;
};

const CHIP_ICON = iconSize.sm;

const chipIcon = (kind: FeedbackChipKind) =>
  kind === 'combo' ? (
    <FlameIcon size={CHIP_ICON} />
  ) : kind === 'first-try' ? (
    <BoltIcon size={CHIP_ICON} />
  ) : (
    <SparkleIcon size={CHIP_ICON} tone="gold" twin={false} />
  );

export function FeedbackDialogs({
  correctVisible,
  wrongVisible,
  correct,
  wrong,
  onContinue,
  onRetry,
  onExplain,
  onWrongClosed,
}: FeedbackDialogsProps) {
  return (
    <>
      <Dialog
        visible={correctVisible}
        onClose={onContinue}
        tone="success"
        badge="success"
        title={COPY.feedback.correctTitle}
        message={
          <Text variant="bodyLg" color="textSecondary" align="center">
            {correct?.message ?? COPY.feedback.praise[0]}
          </Text>
        }
        primaryAction={{ label: COPY.cta.continue, onPress: onContinue }}>
        {correct && correct.chips.length > 0 ? (
          <View style={styles.chips}>
            {correct.chips.map((chip) => (
              <Chip
                key={chip.kind}
                label={chip.label}
                icon={chipIcon(chip.kind)}
                tone={chip.kind === 'combo' ? 'streak' : 'accent'}
                size="sm"
              />
            ))}
          </View>
        ) : null}
      </Dialog>

      <Dialog
        visible={wrongVisible}
        onClose={onRetry}
        onClosed={onWrongClosed}
        tone="danger"
        badge="danger"
        title={COPY.feedback.wrongTitle}
        message={
          <Text variant="bodyLg" color="textSecondary" align="center">
            {COPY.feedback.wrongMessage}
          </Text>
        }
        primaryAction={{ label: COPY.feedback.close, onPress: onRetry }}
        secondaryAction={{
          label: `${COPY.fabPill} ✨`,
          onPress: onExplain,
          variant: 'ghost',
        }}>
        {wrong ? (
          <View style={styles.chips}>
            <Chip
              label={wrong.lifeNote.text}
              icon={<HeartIcon size={CHIP_ICON} muted={wrong.lifeNote.tone === 'neutral'} />}
              tone={wrong.lifeNote.tone === 'danger' ? 'danger' : 'neutral'}
              size="sm"
            />
          </View>
        ) : null}
      </Dialog>
    </>
  );
}

const styles = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
});
