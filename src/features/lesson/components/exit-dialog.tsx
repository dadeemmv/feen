/**
 * Exit confirmation (rs_exit): 🥺 badge, "Aspetta, non uscire!", lime "Continua a studiare" and
 * outline "Esci". Leaving happens after the dialog has animated out (`onLeft`), never while an
 * RN Modal is still on screen.
 */
import { Dialog, Text } from '@/components/ui';

import { COPY } from '../copy';

export type ExitDialogProps = {
  visible: boolean;
  onStay: () => void;
  onLeave: () => void;
  onClosed: () => void;
};

export function ExitDialog({ visible, onStay, onLeave, onClosed }: ExitDialogProps) {
  return (
    <Dialog
      visible={visible}
      onClose={onStay}
      onClosed={onClosed}
      tone="warning"
      badge={{ type: 'emoji', emoji: '🥺' }}
      title={COPY.exit.title}
      message={
        <Text variant="bodyLg" color="textSecondary" align="center">
          {COPY.exit.message}
        </Text>
      }
      primaryAction={{ label: COPY.exit.stay, onPress: onStay }}
      secondaryAction={{ label: COPY.exit.leave, onPress: onLeave, variant: 'outline' }}
    />
  );
}
