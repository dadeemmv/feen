/**
 * "Patto" (tab): the pact in force, on its paper with the signature and the partner's seal, and
 * where you are in it — day of the pact and days kept (one resident each). When yesterday was
 * skipped the partner says so without a sermon, quoting article 5 (concept board screen 7, "Il
 * giorno dopo"): nobody left the village, start again today.
 */
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { MascotArt, WaxSeal } from '@/components/illustrations';
import { avatarSize, Card, HStack, Screen, Text, VStack } from '@/components/ui';
import { getMascot } from '@/content/personality';
import { useEntering } from '@/features/onboarding/lib/entering';
import { addDaysToKey, toDayKey } from '@/lib/dates';
import { countResidents, pactDay, selectMascot, useStore, useStoreShallow } from '@/store';
import { fonts, spacing, useTheme } from '@/theme';

import { PactPaper } from './components/pact-paper';
import { PACT_COPY } from './copy';
import { PARACHUTE } from './data';

const SEAL_SIZE = 64;

export const PACT_SCREEN_COPY = {
  title: 'Il patto',
  empty: 'Il patto si firma dopo il test: è la prima pietra del borgo.',
  dayOf: (day: number, days: number) => `Giorno ${day} di ${days}`,
  kept: (n: number) => (n === 1 ? '1 giorno rispettato, 1 abitante' : `${n} giorni rispettati, ${n} abitanti`),
  missedTitle: 'Ieri non c’eri. Riprendiamo.',
  missedBody: 'Nessun problema, il patto lo prevede. Il borgo è com’era: nessun abitante se n’è andato.',
  article5: 'Art. 5 · il paracadute',
  today: 'Oggi hai già fatto la tua parte. A domani.',
} as const;

export function PactScreen() {
  const [now] = useState(() => Date.now());
  const { rise } = useEntering();
  const { colors } = useTheme();
  const s = useStoreShallow((st) => ({ pact: st.pact, activeDays: st.activeDays, name: st.name }));
  const mascotId = useStore(selectMascot);
  const copy = PACT_SCREEN_COPY;

  if (!s.pact || !mascotId) {
    return (
      <Screen withTabBar edges={['top']}>
        <Text variant="displayMd" accessibilityRole="header" style={styles.title}>
          {copy.title}
        </Text>
        <Text variant="bodyLg" color="textSecondary">
          {copy.empty}
        </Text>
      </Screen>
    );
  }

  const mascot = getMascot(mascotId);
  const pact = s.pact;
  const today = toDayKey(now);
  const yesterday = addDaysToKey(today, -1);
  const day = pactDay(pact, now);
  const kept = countResidents(s);
  const doneToday = s.activeDays.includes(today);
  const missedYesterday = day > 1 && toDayKey(pact.signedAt) < today && !s.activeDays.includes(yesterday) && !doneToday;

  return (
    <Screen withTabBar edges={['top']}>
      <Animated.View entering={rise(0)} style={styles.heading}>
        <Text variant="displayMd" accessibilityRole="header">
          {'Il '}
          <Text variant="displayMd" style={styles.italic}>
            patto
          </Text>
        </Text>
        <Text variant="titleSm" color="textSecondary">
          {`${copy.dayOf(day, pact.days)} · ${copy.kept(kept)}`}
        </Text>
      </Animated.View>

      {missedYesterday ? (
        <Animated.View entering={rise(1)}>
          <Card variant="brand" padding="lg" contentStyle={styles.missed}>
            <HStack gap="sm" align="center">
              <MascotArt id={mascot.id} framing="bust" width={avatarSize.md} />
              <Text variant="labelMd" color="textSecondary">
                {mascot.partner.name}
              </Text>
            </HStack>
            <Text variant="titleLg">{copy.missedTitle}</Text>
            <Text variant="bodyMd" color="textSecondary">
              {copy.missedBody}
            </Text>
            <VStack gap="xxs">
              <Text variant="code" color="textTertiary">
                {copy.article5}
              </Text>
              <Text variant="bodyMd">{PARACHUTE}</Text>
            </VStack>
          </Card>
        </Animated.View>
      ) : doneToday ? (
        <Animated.View entering={rise(1)}>
          <Text variant="bodyMd" color="textSecondary">
            {copy.today}
          </Text>
        </Animated.View>
      ) : null}

      <Animated.View entering={rise(2)} style={styles.paper}>
        <PactPaper
          name={s.name}
          mascot={mascot}
          terms={{ why: pact.why, minutes: pact.minutes, days: pact.days, when: pact.when }}
          number={pact.number}
          date={pact.signedAt}>
          <View style={[styles.signature, { borderBottomColor: colors.borderStrong }]}>
            <Text style={[styles.signed, { color: colors.signInk }]}>{pact.signature.name}</Text>
          </View>
          <HStack justify="space-between" align="center">
            <Text variant="labelSm" color="textSecondary">
              {PACT_COPY.countersign(mascot.partner.name)}
            </Text>
            <View style={styles.seal}>
              <WaxSeal size={SEAL_SIZE} accessibilityLabel={PACT_COPY.sealA11y(mascot.partner.name)} />
            </View>
          </HStack>
        </PactPaper>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.sm, marginBottom: spacing.sm },
  heading: { gap: spacing.xxs, marginTop: spacing.sm, marginBottom: spacing.lg },
  italic: { fontFamily: fonts.serif.italic, letterSpacing: 0 },
  missed: { gap: spacing.md },
  paper: { marginTop: spacing.lg, marginBottom: spacing.xxl },
  signature: { borderBottomWidth: StyleSheet.hairlineWidth, paddingBottom: spacing.xs },
  signed: { fontFamily: fonts.serif.italic, fontSize: 30, lineHeight: 36 },
  seal: { transform: [{ rotate: '-8deg' }] },
});
