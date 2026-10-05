/**
 * Step 2/5 — "Che tipo sei con i soldi?": the intro of the personality test, with the four
 * companions it can assign and how long it takes. "Inizia il test" opens the quiz, which resumes
 * where the user left it.
 */
import { StyleSheet } from 'react-native';
import { Clock } from 'lucide-react-native';

import { Card, Chip } from '@/components/ui';
import { MascotLineup } from '@/features/mascots/components/mascot-lineup';
import { MASCOT_COPY } from '@/features/mascots/copy';
import { spacing } from '@/theme';

import { StepScreen } from '../components/step-screen';

export function TestIntroScreen() {
  const copy = MASCOT_COPY.intro;
  return (
    <StepScreen step="test" title={copy.title} subtitle={copy.subtitle} valid cta={copy.cta}>
      <Card padding="lg" contentStyle={styles.card}>
        <MascotLineup columns={2} accessibilityLabel={copy.lineupLabel} />
        <Chip icon={Clock} label={copy.meta} size="sm" style={styles.meta} />
      </Card>
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.lg },
  meta: { alignSelf: 'center' },
});
