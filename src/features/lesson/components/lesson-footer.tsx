/**
 * Lesson footer: the partner beside the one primary button. Tapping her bust asks her about the
 * step ("Spiegami il perché"); she sits in the footer, so she never covers an answer. The button
 * is pale and disabled until an answer is complete, then CHECK on graded steps and NEXT on info /
 * definition steps. White like the screen, no top line (No-Line Rule).
 */
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MascotArt } from '@/components/illustrations';
import { Button, PressableScale, controlHeight } from '@/components/ui';
import type { Mascot } from '@/content/personality';
import { radius, spacing, useTheme } from '@/theme';

import { COPY } from '../copy';

export type LessonFooterProps = {
  enabled: boolean;
  onPress: () => void;
  /** The student's partner, who answers "Spiegami il perché". */
  partner: Mascot | null;
  onAsk: () => void;
};

const ASK = controlHeight.lg;

export function LessonFooter({ enabled, onPress, partner, onAsk }: LessonFooterProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.footer,
        { backgroundColor: theme.colors.background, paddingBottom: Math.max(insets.bottom, spacing.md) },
      ]}>
      {partner ? (
        <PressableScale
          onPress={onAsk}
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel={COPY.a11y.ask(partner.partner.name)}
          style={styles.ask}
          testID="lesson-ask">
          <MascotArt id={partner.id} framing="bust" width={ASK} />
        </PressableScale>
      ) : null}
      <View style={styles.cta}>
        <Button
          title={COPY.cta.continue}
          disabled={!enabled}
          fullWidth
          haptic={enabled ? 'light' : false}
          onPress={onPress}
          testID="lesson-continue"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  ask: { width: ASK, height: ASK, borderRadius: radius.pill },
  cta: { flex: 1 },
});
