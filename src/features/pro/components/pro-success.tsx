/**
 * ProSuccess — the moment right after the (demo) trial starts: confetti, the jewel pops in, a lime
 * "Benvenuto in Finanz Pro!", the expiry date and the unlocked benefits checking in one by one.
 * The status-header lives chip already shows ∞ behind the modal.
 */
import { StyleSheet, View } from 'react-native';
import { Info } from 'lucide-react-native';

import { Button, Chip, Confetti, Screen, VStack } from '@/components/ui';
import { PRO_PLAN } from '@/content/shop';
import { formatLongDate } from '@/lib/dates';
import { duration, spacing } from '@/theme';

import { PRO_COPY } from '../copy';
import { BenefitList } from './benefit-list';
import { GlassPanel, ProHero, ProTopBar, transparentScreen } from './pro-chrome';

const CONFETTI_ORIGIN = { x: 0.5, y: 0.22 };

export type ProSuccessProps = {
  proUntil: number;
  onDone: () => void;
};

export function ProSuccess({ proUntil, onDone }: ProSuccessProps) {
  return (
    <View style={styles.flex}>
      <Screen
        background="brand"
        statusBar="light"
        style={transparentScreen}
        header={<ProTopBar onClose={onDone} />}
        footer={
          <VStack gap="xs" align="center">
            <Button title={PRO_COPY.successCta} glow fullWidth onPress={onDone} />
            <Chip size="sm" icon={Info} label={PRO_COPY.demoBadge} accessibilityLabel={PRO_PLAN.demoNotice} />
          </VStack>
        }>
        <ProHero
          pop
          accentTitle
          tag={PRO_COPY.successTag}
          tagTone="accent"
          title={PRO_COPY.successTitle}
          tagline={PRO_COPY.successMessage(formatLongDate(proUntil))}
        />
        <GlassPanel title={PRO_COPY.successUnlocked} delay={duration.slow} style={styles.panel}>
          <BenefitList benefits={PRO_PLAN.benefits} checked delay={duration.slow} />
        </GlassPanel>
      </Screen>
      <View style={styles.confetti}>
        <Confetti run origin={CONFETTI_ORIGIN} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  panel: { marginTop: spacing.xs },
  confetti: { ...StyleSheet.absoluteFill, pointerEvents: 'none' },
});
