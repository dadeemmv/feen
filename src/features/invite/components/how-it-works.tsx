/**
 * "Come funziona": the three referral steps as a vertical timeline (tinted icon tiles joined by
 * a hairline rail): share the code → the friend signs up → you learn together and unlock Pro.
 */
import { StyleSheet, View } from 'react-native';
import { Send, Sparkles, UserPlus, type LucideIcon } from 'lucide-react-native';

import { Card, IconTile, Text, borderWidth, tileSize, type Tone } from '@/components/ui';
import { radius, spacing, useTheme } from '@/theme';

import { INVITE_COPY } from '../copy';

type StepKey = (typeof INVITE_COPY.steps)[number]['key'];

const STEP_ICON: Record<StepKey, { icon: LucideIcon; tone: Tone }> = {
  share: { icon: Send, tone: 'mint' },
  signup: { icon: UserPlus, tone: 'sky' },
  reward: { icon: Sparkles, tone: 'lilac' },
};

export function HowItWorks() {
  const theme = useTheme();
  const steps = INVITE_COPY.steps;
  return (
    <Card padding="lg" contentStyle={styles.list}>
      {steps.map((step, index) => {
        const last = index === steps.length - 1;
        const { icon, tone } = STEP_ICON[step.key];
        return (
          <View
            key={step.key}
            style={styles.step}
            accessible
            accessibilityLabel={INVITE_COPY.stepA11y(index + 1, step.title, step.body)}>
            <View style={styles.rail}>
              <IconTile icon={icon} tone={tone} size="md" round />
              {!last ? <View style={[styles.line, { backgroundColor: theme.colors.borderSubtle }]} /> : null}
            </View>
            <View style={[styles.text, !last && styles.textSpaced]}>
              <Text variant="overline" color="textTertiary">
                {INVITE_COPY.stepLabel(index + 1)}
              </Text>
              <Text variant="titleSm">{step.title}</Text>
              <Text variant="bodySm" color="textSecondary">
                {step.body}
              </Text>
            </View>
          </View>
        );
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  list: { gap: 0 },
  step: { flexDirection: 'row', gap: spacing.md },
  rail: { width: tileSize.md, alignItems: 'center' },
  line: { flex: 1, width: borderWidth.thick, borderRadius: radius.pill, marginVertical: spacing.xxs },
  text: { flex: 1, gap: spacing.xxxs, paddingTop: spacing.xxxs },
  textSpaced: { paddingBottom: spacing.lg },
});
