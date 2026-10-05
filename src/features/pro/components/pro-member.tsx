/**
 * ProMember — the paywall for someone who is already Pro (trial, milestone reward or referral):
 * no plans to buy, just the membership summary (expiry date + days left) and every benefit
 * checked. The CTA closes the modal.
 */
import { StyleSheet } from 'react-native';
import { CalendarCheck } from 'lucide-react-native';

import { Button, Chip, HStack, Icon, Screen, Text, VStack } from '@/components/ui';
import { PRO_PLAN } from '@/content/shop';
import { DAY_MS, formatLongDate } from '@/lib/dates';
import { spacing } from '@/theme';

import { PRO_COPY } from '../copy';
import { proMetrics } from '../metrics';
import { BenefitList } from './benefit-list';
import { GlassPanel, ProHero, ProTopBar, transparentScreen } from './pro-chrome';

export type ProMemberProps = {
  proUntil: number;
  now: number;
  onClose: () => void;
};

export function ProMember({ proUntil, now, onClose }: ProMemberProps) {
  const daysLeft = Math.max(1, Math.ceil((proUntil - now) / DAY_MS));
  const until = formatLongDate(proUntil);

  return (
    <Screen
      background="brand"
      statusBar="light"
      style={transparentScreen}
      header={<ProTopBar onClose={onClose} />}
      footer={<Button title={PRO_COPY.activeCta} glow fullWidth onPress={onClose} />}>
      <ProHero tag={PRO_COPY.activeTag} tagTone="accent" title={PRO_COPY.activeHeadline} tagline={PRO_COPY.activeTagline} />

      <GlassPanel delay={proMetrics.entranceStagger}>
        <HStack gap="sm" accessible accessibilityLabel={`${PRO_COPY.activeUntil(until)}. ${PRO_COPY.activeLeft(daysLeft)}`}>
          <Icon icon={CalendarCheck} size="lg" color="accentText" />
          <VStack flex gap="xxxs">
            <Text variant="titleSm">{PRO_COPY.activeUntil(until)}</Text>
            <Text variant="bodySm" color="textSecondary">
              {PRO_PLAN.name}
            </Text>
          </VStack>
          <Chip size="sm" tone="accent" variant="solid" label={PRO_COPY.activeLeft(daysLeft)} />
        </HStack>
      </GlassPanel>

      <GlassPanel title={PRO_COPY.activeIncluded} delay={proMetrics.entranceStagger * 2} style={styles.benefits}>
        <BenefitList benefits={PRO_PLAN.benefits} checked delay={proMetrics.entranceStagger * 2} />
      </GlassPanel>
    </Screen>
  );
}

const styles = StyleSheet.create({
  benefits: { marginTop: spacing.md },
});
