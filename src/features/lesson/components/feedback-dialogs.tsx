/**
 * Answer feedback: bottom-anchored dialogs with the badge overlapping the top edge, in the voice
 * of the partner. Correct → ✓ "Giusto", the partner says why (the step's explanation) and a small
 * chip ("Al primo colpo", "3 giuste di fila"), CTA "Continua". Wrong → ✕ "Non proprio", a mistake
 * costs nothing, CTA "Riprova" and a shortcut to "Spiegami il perché".
 * Content is frozen by the controller at grading time, so it never changes while animating out.
 */
import { StyleSheet, View } from 'react-native';

import { BoltIcon, FlameIcon, SparkleIcon } from '@/components/icons';
import { MascotArt } from '@/components/illustrations';
import { Chip, Dialog, HStack, Text, avatarSize, iconSize } from '@/components/ui';
import { getMascot } from '@/content/personality';
import { selectMascot, useStore } from '@/store';
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

/** The partner's line: her bust and name, then what she says. */
function PartnerLine({ text }: { text: string }) {
  const mascotId = useStore(selectMascot);
  const mascot = mascotId ? getMascot(mascotId) : null;
  return (
    <View style={styles.partner}>
      {mascot ? (
        <HStack gap="xs" align="center" justify="center">
          <MascotArt id={mascot.id} framing="bust" width={avatarSize.sm} />
          <Text variant="labelMd" color="textSecondary">
            {mascot.partner.name}
          </Text>
        </HStack>
      ) : null}
      <Text variant="bodyLg" align="center">
        {text}
      </Text>
    </View>
  );
}

export function FeedbackDialogs({
  correctVisible,
  wrongVisible,
  correct,
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
        message={<PartnerLine text={correct?.message ?? COPY.feedback.praise[0]} />}
        primaryAction={{ label: COPY.cta.continue, onPress: onContinue }}>
        {correct && correct.chips.length > 0 ? (
          <View style={styles.chips}>
            {correct.chips.map((chip) => (
              <Chip
                key={chip.kind}
                label={chip.label}
                icon={chipIcon(chip.kind)}
                tone={chip.kind === 'combo' ? 'streak' : 'lilac'}
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
        primaryAction={{ label: COPY.feedback.close, onPress: onRetry, variant: 'primary' }}
        secondaryAction={{ label: COPY.fabPill, onPress: onExplain, variant: 'ghost' }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  partner: { gap: spacing.sm, alignItems: 'center' },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
});
