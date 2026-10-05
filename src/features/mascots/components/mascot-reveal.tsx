/**
 * The result of the test, for evergreen surfaces: the mascot pops in, "Sei uno Scoiattolo",
 * its type, the motto, the two axes as split bars, strengths, what to train and the other three
 * companions. Content rises in, staggered. Used by onboarding and by the Account page.
 */
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { Quote, Sparkles, Target } from 'lucide-react-native';

import { MascotArt } from '@/components/illustrations';
import { Card, Chip, Divider, HStack, Icon, iconSize, Tag, Text, VStack } from '@/components/ui';
import { AXIS_POLES, getMascot } from '@/content/personality';
import { useEntering } from '@/features/onboarding/lib/entering';
import { PopIn } from '@/features/rewards';
import { selectMascot, type PersonalityResult } from '@/store';
import { duration, spacing } from '@/theme';

import { MASCOT_COPY } from '../copy';
import { mascotMetrics } from '../metrics';
import { MascotLineup } from './mascot-lineup';
import { TraitBar } from './trait-bar';

export type MascotRevealProps = {
  result: PersonalityResult;
  /** Show "Gli altri compagni" at the bottom. Default true. */
  showOthers?: boolean;
};

export function MascotReveal({ result, showOthers = true }: MascotRevealProps) {
  const { rise } = useEntering();
  const mascot = getMascot(selectMascot({ personality: result }) ?? 'squirrel');
  const copy = MASCOT_COPY.reveal;

  return (
    <VStack gap="lg">
      <VStack gap="sm" align="center">
        <PopIn delay={duration.fast}>
          <MascotArt
            id={mascot.id}
            width={mascotMetrics.revealArt}
            accessibilityLabel={copy.artLabel(mascot.animal, mascot.name)}
          />
        </PopIn>
        <Animated.View entering={rise(1)} style={styles.heading}>
          <Text variant="overline" color="accentText" align="center">
            {copy.overline}
          </Text>
          <Text variant="displayMd" align="center" accessibilityRole="header">
            {mascot.youAre}
          </Text>
          <Tag label={mascot.type} tone="accent" solid style={styles.tag} />
          <Text variant="bodyMd" color="textSecondary" align="center">
            {copy.meet(mascot.name)}
          </Text>
        </Animated.View>
      </VStack>

      <Animated.View entering={rise(2)}>
        <Card padding="md" contentStyle={styles.motto}>
          <Icon icon={Quote} size={iconSize.lg} color="accentText" />
          <VStack flex gap="xxxs">
            <Text variant="titleSm">{mascot.motto}</Text>
            <Text variant="labelSm" color="textTertiary">
              {mascot.name}
            </Text>
          </VStack>
        </Card>
      </Animated.View>

      <Animated.View entering={rise(3)}>
        <Card padding="md" contentStyle={styles.profile}>
          <Text variant="overline" color="textSecondary">
            {copy.traitsTitle}
          </Text>
          <TraitBar left={AXIS_POLES.horizon.negative} right={AXIS_POLES.horizon.positive} value={result.future} />
          <TraitBar left={AXIS_POLES.risk.negative} right={AXIS_POLES.risk.positive} value={result.bold} />
          <Divider />
          <Text variant="bodyMd" color="textSecondary">
            {mascot.description}
          </Text>
        </Card>
      </Animated.View>

      <Animated.View entering={rise(4)} style={styles.section}>
        <Text variant="overline" color="textSecondary">
          {copy.strengthsTitle}
        </Text>
        <View style={styles.chips}>
          {mascot.strengths.map((strength) => (
            <Chip key={strength} label={strength} icon={Sparkles} size="sm" tone="neutral" />
          ))}
        </View>
        <HStack gap="xs" align="flex-start" style={styles.watchOut}>
          <Icon icon={Target} size={iconSize.md} color="textSecondary" />
          <Text variant="bodySm" color="textSecondary" style={styles.flex}>
            <Text variant="labelSm" color="text">
              {`${copy.watchOutTitle}: `}
            </Text>
            {mascot.watchOut}
          </Text>
        </HStack>
      </Animated.View>

      {showOthers ? (
        <Animated.View entering={rise(5)} style={styles.section}>
          <Text variant="overline" color="textSecondary">
            {copy.othersTitle}
          </Text>
          <MascotLineup exclude={mascot.id} />
        </Animated.View>
      ) : null}
    </VStack>
  );
}

const styles = StyleSheet.create({
  heading: { gap: spacing.xs, alignItems: 'center' },
  tag: { alignSelf: 'center' },
  motto: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  profile: { gap: spacing.md },
  section: { gap: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  watchOut: { paddingTop: spacing.xxs },
  flex: { flex: 1 },
});
