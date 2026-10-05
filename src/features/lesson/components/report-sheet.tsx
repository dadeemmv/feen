/**
 * "Segnala un problema" (flag in the lesson header): three reasons as radio rows, "Invia" enabled
 * once one is picked. The thank-you toast is shown by the player after the sheet has closed
 * (toasts render under native modals).
 */
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, ChoiceRow, Sheet, Text } from '@/components/ui';
import { spacing } from '@/theme';

import { COPY } from '../copy';

export type ReportReasonId = (typeof COPY.report.reasons)[number]['id'];

export type ReportSheetProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: ReportReasonId) => void;
  /** After any close animation (sent or dismissed). */
  onClosed: () => void;
};

export function ReportSheet({ visible, onClose, onSubmit, onClosed }: ReportSheetProps) {
  const [reason, setReason] = useState<ReportReasonId | null>(null);

  const handleClosed = () => {
    setReason(null);
    onClosed();
  };

  return (
    <Sheet visible={visible} onClose={onClose} onClosed={handleClosed} title={COPY.report.title}>
      <Text variant="bodyMd" color="textSecondary" align="center" style={styles.subtitle}>
        {COPY.report.subtitle}
      </Text>
      <View style={styles.reasons} accessibilityRole="radiogroup">
        {COPY.report.reasons.map((item) => (
          <ChoiceRow
            key={item.id}
            label={item.label}
            emoji={item.emoji}
            iconTone="butter"
            labelVariant="bodyMd"
            selected={reason === item.id}
            onPress={() => setReason(item.id)}
          />
        ))}
      </View>
      <Button
        title={COPY.report.send}
        disabled={reason === null}
        fullWidth
        onPress={() => {
          if (reason) onSubmit(reason);
        }}
      />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  subtitle: { marginBottom: spacing.lg },
  reasons: { gap: spacing.xs, marginBottom: spacing.lg },
});
