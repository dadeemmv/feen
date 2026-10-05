/**
 * ProOffer — the paywall itself: hero, "Cosa ottieni" benefits, plan selector (yearly preselected)
 * and a sticky footer with the trial CTA, the price after the trial and the unmistakable
 * "Demo — nessun addebito" note. Below the plans: restore link and the legal / demo footnote.
 */
import { StyleSheet } from 'react-native';
import { Info } from 'lucide-react-native';

import { Button, Chip, Screen, SectionHeader, Text, VStack, readableWidth } from '@/components/ui';
import type { ProPrice } from '@/content/extra-types';
import { PRO_PLAN } from '@/content/shop';
import { spacing } from '@/theme';

import { PRO_COPY } from '../copy';
import { proMetrics } from '../metrics';
import { BenefitList } from './benefit-list';
import { PlanSelector } from './plan-selector';
import { GlassPanel, ProHero, ProTopBar, transparentScreen } from './pro-chrome';
import { RestorePurchases } from './restore-purchases';

export type ProOfferProps = {
  planId: ProPrice['id'];
  onSelectPlan: (id: ProPrice['id']) => void;
  processing: boolean;
  onStartTrial: () => void;
  onClose: () => void;
};

export function ProOffer({ planId, onSelectPlan, processing, onStartTrial, onClose }: ProOfferProps) {
  const plan = PRO_PLAN.prices.find((price) => price.id === planId) ?? PRO_PLAN.prices[0];
  const benefitsDelay = proMetrics.entranceStagger * 2;

  return (
    <Screen
      background="brand"
      statusBar="light"
      style={transparentScreen}
      header={<ProTopBar onClose={onClose} />}
      footer={
        <VStack gap="xs" align="center">
          <Button
            title={processing ? PRO_COPY.ctaProcessing : PRO_COPY.cta}
            loading={processing}
            glow
            shimmer={!processing}
            fullWidth
            onPress={onStartTrial}
            accessibilityHint={PRO_COPY.trialTerms(plan.priceLabel, plan.period)}
          />
          <Text variant="bodySm" color="textSecondary" align="center" style={styles.terms}>
            {PRO_COPY.trialTerms(plan.priceLabel, plan.period)}
          </Text>
          <Chip size="sm" icon={Info} label={PRO_COPY.demoBadge} accessibilityLabel={PRO_PLAN.demoNotice} />
        </VStack>
      }>
      <ProHero tag={PRO_COPY.tag} title={PRO_COPY.headline} tagline={PRO_PLAN.tagline} />

      <GlassPanel title={PRO_COPY.benefitsTitle} delay={benefitsDelay}>
        <BenefitList benefits={PRO_PLAN.benefits} delay={benefitsDelay} />
      </GlassPanel>

      <SectionHeader title={PRO_COPY.plansTitle} style={styles.section} />
      <PlanSelector prices={PRO_PLAN.prices} selectedId={planId} onSelect={onSelectPlan} disabled={processing} />

      <VStack gap="sm" align="center" style={styles.footnotes}>
        <RestorePurchases disabled={processing} />
        <Text variant="bodySm" color="textTertiary" align="center" style={styles.legal}>
          {`${PRO_PLAN.demoNotice} ${PRO_PLAN.legal}`}
        </Text>
      </VStack>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: spacing.xl, marginBottom: spacing.xs },
  footnotes: { marginTop: spacing.xl },
  terms: { maxWidth: readableWidth },
  legal: { maxWidth: readableWidth },
});
