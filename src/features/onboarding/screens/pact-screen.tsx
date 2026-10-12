/**
 * The pact (concept board, screen 3) — the only screen on warm paper. The partner proposes it;
 * the words in sprout can be tapped to change them; article 4 is the partner's clause. You sign
 * (with the finger or your name), hold the button, and the partner's wax seal drops with a spring.
 * Then "Posa la prima pietra".
 */
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, StyleSheet, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { Redirect, router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

import { MascotArt, WaxSeal } from '@/components/illustrations';
import { avatarSize, Button, HStack, IconButton, Screen, Text, VStack } from '@/components/ui';
import { getMascot } from '@/content/personality';
import { PACT_COPY } from '@/features/pact/copy';
import { DOSE_OPTIONS, nextIndex, WHEN_OPTIONS, WHY_OPTIONS } from '@/features/pact/data';
import { HoldToSign } from '@/features/pact/components/hold-to-sign';
import { PactPaper } from '@/features/pact/components/pact-paper';
import { SignaturePad, type Signature } from '@/features/pact/components/signature-pad';
import { haptics } from '@/lib/haptics';
import { layout, spacing } from '@/theme';

import { ONBOARDING_COPY } from '../copy';
import { cleanName } from '../data/name';
import { useOnboardingDraft } from '../draft-store';
import { allowedStep, draftPersonality, goToPreviousStep, STEP_HREF } from '../steps';

const SEAL_SIZE = 76;
const NEED_MS = 1400;

export function PactStepScreen() {
  const draft = useOnboardingDraft();
  const setPactTerms = useOnboardingDraft((s) => s.setPactTerms);
  const sealPact = useOnboardingDraft((s) => s.sealPact);
  const [signature, setSignature] = useState<Signature | null>(draft.signature);
  const [need, setNeed] = useState(false);
  const [sealed, setSealed] = useState(draft.signedAt !== null);
  const [today] = useState(() => Date.now());
  const needTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (needTimer.current) clearTimeout(needTimer.current);
  }, []);

  const allowed = allowedStep('pact', draft);
  if (allowed !== 'pact') return <Redirect href={STEP_HREF[allowed]} />;

  const mascot = getMascot(draftPersonality(draft).mascot);
  const name = cleanName(draft.name);
  const copy = ONBOARDING_COPY.pact;

  const cycle = (field: 'why' | 'minutes' | 'when') => {
    haptics.selection();
    if (field === 'why') {
      const at = (WHY_OPTIONS as readonly string[]).indexOf(draft.pactWhy);
      setPactTerms({ pactWhy: WHY_OPTIONS[nextIndex(at, WHY_OPTIONS.length)] });
    }
    if (field === 'minutes') {
      const at = (DOSE_OPTIONS as readonly number[]).indexOf(draft.pactMinutes);
      setPactTerms({ pactMinutes: DOSE_OPTIONS[nextIndex(at, DOSE_OPTIONS.length)] });
    }
    if (field === 'when') {
      const at = WHEN_OPTIONS.findIndex((option) => option.text === draft.pactWhen);
      setPactTerms({ pactWhen: WHEN_OPTIONS[nextIndex(at, WHEN_OPTIONS.length)].text });
    }
  };

  const nudge = () => {
    setNeed(true);
    if (needTimer.current) clearTimeout(needTimer.current);
    needTimer.current = setTimeout(() => setNeed(false), NEED_MS);
    AccessibilityInfo.announceForAccessibility(PACT_COPY.needSignature);
  };

  const seal = () => {
    if (!signature) return;
    sealPact(signature, Date.now());
    setSealed(true);
    haptics.success();
    AccessibilityInfo.announceForAccessibility(PACT_COPY.signed(mascot.partner.name));
  };

  return (
    <Screen
      background="contract"
      edges={['top', 'bottom']}
      header={
        <View style={styles.header}>
          <IconButton icon={ArrowLeft} accessibilityLabel={ONBOARDING_COPY.back} onPress={goToPreviousStep} />
        </View>
      }
      footer={
        sealed ? (
          <Button title={copy.next} fullWidth onPress={() => router.push(STEP_HREF.stone)} />
        ) : (
          <HoldToSign locked={signature === null} done={sealed} onLockedPress={nudge} onComplete={seal} />
        )
      }>
      <VStack gap="lg" style={styles.body}>
        <HStack gap="sm" align="center">
          <MascotArt id={mascot.id} framing="bust" width={avatarSize.md} />
          <Text variant="bodyMd" color="textSecondary" style={styles.flex}>
            {copy.intro(mascot.partner.name)}
          </Text>
        </HStack>

        <PactPaper
          name={name}
          mascot={mascot}
          terms={{ why: draft.pactWhy, minutes: draft.pactMinutes, days: draft.pactDays, when: draft.pactWhen }}
          number={1}
          date={draft.signedAt ?? today}
          onCycle={sealed ? undefined : cycle}>
          <SignaturePad name={name} onChange={setSignature} need={need} locked={sealed} />
          <HStack justify="space-between" align="center">
            <Text variant="labelSm" color="textSecondary">
              {PACT_COPY.countersign(mascot.partner.name)}
            </Text>
            <View style={styles.sealSlot}>
              {sealed ? (
                <Animated.View entering={ZoomIn.springify().damping(9)} style={styles.seal}>
                  <WaxSeal size={SEAL_SIZE} accessibilityLabel={PACT_COPY.sealA11y(mascot.partner.name)} />
                </Animated.View>
              ) : null}
            </View>
          </HStack>
        </PactPaper>
      </VStack>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { height: layout.headerHeight, flexDirection: 'row', alignItems: 'center', paddingHorizontal: layout.screenX },
  body: { paddingBottom: spacing.lg },
  sealSlot: { width: SEAL_SIZE, height: SEAL_SIZE },
  seal: { transform: [{ rotate: '-8deg' }] },
});
