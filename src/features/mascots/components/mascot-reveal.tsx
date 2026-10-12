/**
 * The result of the test (concept board, screen 2), for dark surfaces: the animal pops in,
 * "Sei una Volpe Esploratrice" (the identity you share, the species in serif italic), then the
 * partner of the same species — one like you who already got past your blind spot — with their
 * story and the clause they will bring to the pact. Below: where you sit on the two axes,
 * superpower and blind spot, where the village starts, and the other animals.
 * Used by onboarding and by the "Il tuo personaggio" page.
 */
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { MascotArt } from '@/components/illustrations';
import { Card, Chip, Divider, HStack, Text, VStack } from '@/components/ui';
import { getMascot, type Mascot } from '@/content/personality';
import { getBuilding } from '@/content/village';
import { useEntering } from '@/features/onboarding/lib/entering';
import { PopIn } from '@/features/rewards';
import type { PersonalityResult } from '@/store';
import { duration, fonts, spacing } from '@/theme';

import { MASCOT_COPY } from '../copy';
import { mascotMetrics } from '../metrics';
import { AxesGrid } from './axes-grid';
import { MascotLineup } from './mascot-lineup';

export type MascotRevealProps = {
  result: PersonalityResult;
  /** Show "Gli altri animali" at the bottom. Default true. */
  showOthers?: boolean;
};

/** "Sei una *Volpe* Esploratrice": the species is the one word in serif italic. */
export function YouAreTitle({ mascot }: { mascot: Mascot }) {
  const rest = mascot.title.slice(mascot.species.length);
  return (
    <Text variant="displayMd" align="center" accessibilityRole="header">
      {`Sei ${mascot.article} `}
      <Text variant="displayMd" color="accentText" style={styles.italic}>
        {mascot.species}
      </Text>
      {rest}
    </Text>
  );
}

export function MascotReveal({ result, showOthers = true }: MascotRevealProps) {
  const { rise } = useEntering();
  const mascot = getMascot(result.mascot);
  const { partner } = mascot;
  const copy = MASCOT_COPY.reveal;

  return (
    <VStack gap="lg">
      <VStack gap="md" align="center">
        <PopIn delay={duration.fast}>
          <MascotArt id={mascot.id} width={mascotMetrics.revealArtHeight} accessibilityLabel={copy.artLabel(mascot.title)} />
        </PopIn>
        <Animated.View entering={rise(1)} style={styles.heading}>
          <Text variant="code" color="textSecondary" align="center">
            {copy.overline(mascot.code)}
          </Text>
          <YouAreTitle mascot={mascot} />
          <Text variant="bodyLg" color="textSecondary" align="center">
            {copy.meet(mascot.description, partner.role, partner.name, mascot.species)}
          </Text>
        </Animated.View>
      </VStack>

      <Animated.View entering={rise(2)}>
        <Card padding="lg" contentStyle={styles.partner}>
          <HStack gap="sm" align="center">
            <MascotArt id={mascot.id} framing="bust" width={mascotMetrics.greetingBust} />
            <VStack flex gap="xxxs">
              <Text variant="titleLg">{partner.name}</Text>
              <Text variant="bodySm" color="textSecondary">
                {`${partner.role[0].toUpperCase()}${partner.role.slice(1)} · ${mascot.title}`}
              </Text>
            </VStack>
          </HStack>
          <Text variant="bodyMd" color="textSecondary">
            {partner.story}
          </Text>
          <Divider />
          <VStack gap="xxs">
            <Text variant="overline" color="textTertiary">
              {copy.clauseTitle}
            </Text>
            <Text variant="titleMd">{`«${partner.clause}»`}</Text>
          </VStack>
        </Card>
      </Animated.View>

      <Animated.View entering={rise(3)}>
        <Card padding="lg" contentStyle={styles.profile}>
          <HStack justify="space-between">
            <Text variant="overline" color="textSecondary">
              {copy.gridTitle}
            </Text>
            <Text variant="labelSm" color="accentText" tabular>
              {copy.position(result.future, result.risk)}
            </Text>
          </HStack>
          <AxesGrid future={result.future} risk={result.risk} mascot={mascot.id} />
          <Divider />
          <VStack gap="xxs">
            <Text variant="overline" color="textTertiary">
              {copy.superpowerTitle}
            </Text>
            <Text variant="bodyMd">{mascot.superpower}</Text>
          </VStack>
          <VStack gap="xxs">
            <Text variant="overline" color="textTertiary">
              {copy.blindSpotTitle}
            </Text>
            <Text variant="bodyMd">{mascot.blindSpot}</Text>
          </VStack>
        </Card>
      </Animated.View>

      <Animated.View entering={rise(4)} style={styles.section}>
        <Text variant="overline" color="textSecondary">
          {copy.startTitle}
        </Text>
        <View style={styles.chips}>
          {mascot.startBuildings.map((id) => (
            <Chip key={id} label={getBuilding(id).name} size="sm" tone="neutral" />
          ))}
        </View>
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
  heading: { gap: spacing.sm, alignItems: 'center' },
  italic: { fontFamily: fonts.serif.italic, letterSpacing: 0 },
  partner: { gap: spacing.md },
  profile: { gap: spacing.md },
  section: { gap: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
});
