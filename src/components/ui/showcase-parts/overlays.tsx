/**
 * Showcase: bottom sheets, dialogs (every badge preset), toasts, confetti.
 */
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Send } from 'lucide-react-native';

import { HeartIcon, TrophyIcon } from '@/components/icons';
import { spacing } from '@/theme';

import { Button } from '../button';
import { Card } from '../card';
import { ChoiceRow } from '../choice-row';
import { Confetti } from '../confetti';
import { Dialog, type DialogProps } from '../dialog';
import { IconButton } from '../icon-button';
import { iconSize } from '../metrics';
import { Sheet } from '../sheet';
import { Text } from '../text';
import { TextField } from '../text-field';
import { toast } from '../toast';
import { TypingDots } from '../typing-dots';
import { ShowcaseRow, ShowcaseSection } from './section';

type DialogDemo = 'success' | 'danger' | 'exit' | 'custom' | null;

const DIALOGS: Record<Exclude<DialogDemo, null>, Omit<DialogProps, 'visible' | 'onClose'>> = {
  success: {
    tone: 'success',
    badge: 'success',
    title: 'Risposta corretta',
    message: 'Ottimo! L’inflazione riduce il potere d’acquisto dei tuoi risparmi.',
  },
  danger: {
    tone: 'danger',
    badge: 'danger',
    title: 'Risposta errata',
    message: 'Hai perso una vita. Riprova: puoi farcela!',
  },
  exit: {
    tone: 'warning',
    badge: { type: 'emoji', emoji: '🥺' },
    title: 'Aspetta, non uscire!',
    message: 'Se esci ora perderai i progressi di questa lezione.',
  },
  custom: {
    tone: 'neutral',
    icon: <TrophyIcon size={iconSize.xl * 2} />,
    title: 'Traguardo raggiunto',
    message: 'Hai completato 2 lezioni: riscatta il tuo premio.',
    placement: 'center',
  },
};

export function OverlayShowcase() {
  const [sheet, setSheet] = useState<'plain' | 'chat' | null>(null);
  const [plan, setPlan] = useState<'free' | 'pro'>('free');
  const [dialog, setDialog] = useState<DialogDemo>(null);
  // Last opened demo: keeps the content in place while the dialog animates out.
  const [lastDialog, setLastDialog] = useState<Exclude<DialogDemo, null>>('success');
  const [confetti, setConfetti] = useState(false);
  const openDialog = (kind: Exclude<DialogDemo, null>) => {
    setLastDialog(kind);
    setDialog(kind);
  };
  const closeDialog = () => setDialog(null);

  return (
    <ShowcaseSection title="Sheet · Dialog · Toast · Confetti">
      <ShowcaseRow label="sheet">
        <Button title="Vite" size="sm" variant="secondary" onPress={() => setSheet('plain')} />
        <Button title="Chat sheet" size="sm" variant="secondary" onPress={() => setSheet('chat')} />
      </ShowcaseRow>
      <ShowcaseRow label="dialog">
        <Button title="Corretta" size="sm" variant="secondary" onPress={() => openDialog('success')} />
        <Button title="Errata" size="sm" variant="secondary" onPress={() => openDialog('danger')} />
        <Button title="Esci" size="sm" variant="secondary" onPress={() => openDialog('exit')} />
        <Button title="Centrata" size="sm" variant="secondary" onPress={() => openDialog('custom')} />
      </ShowcaseRow>
      <ShowcaseRow label="toast">
        <Button title="Neutral" size="sm" variant="outline" onPress={() => toast.show('Impostazioni salvate')} />
        <Button
          title="Success"
          size="sm"
          variant="outline"
          onPress={() => toast.show({ message: 'Codice copiato', tone: 'success' })}
        />
        <Button
          title="Danger"
          size="sm"
          variant="outline"
          onPress={() => toast.show({ message: 'Kiwi insufficienti', tone: 'danger' })}
        />
        <Button title="Emoji" size="sm" variant="outline" onPress={() => toast.show({ message: 'Scudo attivato', icon: '🛡️' })} />
      </ShowcaseRow>
      <Card variant="brand" padding="lg" style={styles.confettiCard} contentStyle={styles.center}>
        <Text variant="displaySm" color="accentText" align="center">
          Lezione completata!
        </Text>
        <Button title="Festeggia" onPress={() => setConfetti(true)} glow />
        <Confetti run={confetti} origin={{ x: 0.5, y: 0.6 }} onComplete={() => setConfetti(false)} />
      </Card>

      <Sheet visible={sheet === 'plain'} onClose={() => setSheet(null)} title="Vite">
        <View style={styles.sheetBody}>
          <View style={styles.center}>
            <HeartIcon size={iconSize.xl * 2} />
            <Text variant="bodyMd" color="textSecondary" align="center">
              Hai 3 vite. Si ricaricano di una ogni 2 ore.
            </Text>
          </View>
          <ChoiceRow label="Finanz Free" description="3 vite" selected={plan === 'free'} onPress={() => setPlan('free')} />
          <ChoiceRow label="Finanz Pro" description="Vite illimitate" selected={plan === 'pro'} onPress={() => setPlan('pro')} tone="brand" />
          <Button title="Continua" fullWidth onPress={() => setSheet(null)} />
        </View>
      </Sheet>

      <Sheet
        visible={sheet === 'chat'}
        onClose={() => setSheet(null)}
        maxHeight={0.75}
        dragArea="handle"
        scrollable
        footer={
          <TextField
            shape="pill"
            size="md"
            placeholder="Chiedi qualcosa..."
            style={styles.footer}
            trailing={<IconButton icon={Send} variant="accent" size="sm" disabled accessibilityLabel="Invia" />}
          />
        }>
        <View style={styles.sheetBody}>
          <Text variant="bodyLg">Spiegami perchè ho sbagliato</Text>
          <TypingDots bubble />
        </View>
      </Sheet>

      <Dialog
        visible={dialog !== null}
        onClose={closeDialog}
        {...DIALOGS[lastDialog]}
        primaryAction={{ label: lastDialog === 'exit' ? 'Continua la lezione' : 'Continua', onPress: closeDialog }}
        secondaryAction={lastDialog === 'exit' ? { label: 'Esci', onPress: closeDialog, variant: 'ghost' } : undefined}
      />
    </ShowcaseSection>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', gap: spacing.md },
  confettiCard: { overflow: 'hidden' },
  sheetBody: { gap: spacing.sm, paddingBottom: spacing.md },
  footer: { paddingTop: spacing.xs },
});
