/**
 * BenefitList — what Finanz Pro unlocks (`PRO_PLAN.benefits`): one row per benefit with a glass
 * icon tile (economy SVG icons for lives / shields, the lime AI sparkle, Lucide for the rest),
 * title and one-line description. `checked` adds a lime check on each row (member / success).
 * Rendered on evergreen: it expects the brand colour mode.
 */
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ban, Check, Rocket } from 'lucide-react-native';

import { HeartInfinityIcon, ShieldIcon, SparkleIcon } from '@/components/icons';
import { HStack, Icon, Text, VStack, hairline, iconSize, iconStroke, tileSize, useReduceMotion } from '@/components/ui';
import type { ProBenefit, ProBenefitIcon } from '@/content/extra-types';
import { duration, easing, radius, spacing, useTheme } from '@/theme';

import { proMetrics } from '../metrics';

export type BenefitListProps = {
  benefits: readonly ProBenefit[];
  /** Lime check on every row (already unlocked). */
  checked?: boolean;
  /** Delay before the first row rises in (ms). */
  delay?: number;
};

function BenefitGlyph({ icon }: { icon: ProBenefitIcon }) {
  const size = proMetrics.benefitIcon;
  switch (icon) {
    case 'lives':
      return <HeartInfinityIcon size={size} />;
    case 'shield':
      return <ShieldIcon size={size} />;
    case 'assistant':
      return <SparkleIcon tone="lime" size={size} />;
    case 'no-ads':
      return <Icon icon={Ban} size={iconSize.md} color="accentText" />;
    case 'early-access':
      return <Icon icon={Rocket} size={iconSize.md} color="accentText" />;
  }
}

export function BenefitList({ benefits, checked = false, delay = 0 }: BenefitListProps) {
  const { colors } = useTheme();
  const reduceMotion = useReduceMotion();

  return (
    <VStack gap="md">
      {benefits.map((benefit, index) => (
        <Animated.View
          key={benefit.id}
          entering={
            reduceMotion
              ? undefined
              : FadeInDown.duration(duration.base)
                  .delay(delay + index * proMetrics.entranceStagger)
                  .easing(easing.enter)
          }>
          <HStack gap="sm" align="flex-start" accessible accessibilityLabel={`${benefit.title}. ${benefit.description}`}>
            <View style={[styles.tile, { backgroundColor: colors.fill, borderColor: colors.borderSubtle }]}>
              <BenefitGlyph icon={benefit.icon} />
            </View>
            <VStack flex gap="xxxs" style={styles.copy}>
              <Text variant="titleSm">{benefit.title}</Text>
              <Text variant="bodySm" color="textSecondary">
                {benefit.description}
              </Text>
            </VStack>
            {checked ? (
              <View style={[styles.check, { backgroundColor: colors.accentSolid }]}>
                <Icon icon={Check} size={iconSize.xs} color="onAccent" strokeWidth={iconStroke.heavy} />
              </View>
            ) : null}
          </HStack>
        </Animated.View>
      ))}
    </VStack>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: tileSize.md,
    height: tileSize.md,
    borderRadius: radius.md,
    borderWidth: hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { paddingTop: spacing.xxxs },
  check: {
    width: iconSize.md,
    height: iconSize.md,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
});
