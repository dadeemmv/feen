/**
 * LivesSheet — opened by the lives chip everywhere (global overlay 'lives', spec §3.6).
 *
 * - Full: "Vite al massimo! …", PRO card (selected) + "Piena!" card, CTA "Ottieni vite
 *   illimitate" → Pro paywall, outline "No, grazie".
 * - Not full: hearts with empty slots, live refill countdown and "Ricarica con i Kiwi"
 *   (1 vita · 500, 1 ora illimitata · 1000) on top of the same Pro upsell.
 * - Unlimited (1-hour item or Pro): gold ∞ heart and the time left.
 */
import { useRef } from 'react';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Clock } from 'lucide-react-native';

import { Button, Chip, Sheet, Text, VStack } from '@/components/ui';
import { formatLongDate } from '@/lib/dates';
import { formatCountdown } from '@/lib/format';
import { selectIsPro, useStore } from '@/store';
import { useLives, useNow } from '@/store/hooks';
import { spacing } from '@/theme';

import { HeartsRow } from './components/hearts-row';
import { LivesOptionCards } from './components/lives-option-cards';
import { RefillOptions } from './components/refill-options';
import { LIVES_COPY } from './copy';

export type LivesSheetProps = { visible: boolean; onClose: () => void };

/** Big hearts in the unlimited state. */
const HERO_HEART = spacing.huge;

export function LivesSheet({ visible, onClose }: LivesSheetProps) {
  // Navigation waits for the sheet to finish closing (no route push under a closing Modal).
  const afterClose = useRef<(() => void) | null>(null);
  const closeThen = (action: () => void) => {
    afterClose.current = action;
    onClose();
  };
  const handleClosed = () => {
    const action = afterClose.current;
    afterClose.current = null;
    action?.();
  };

  return (
    <Sheet visible={visible} onClose={onClose} onClosed={handleClosed} scrollable accessibilityLabel="Vite">
      <LivesSheetContent onClose={onClose} onOpenPro={() => closeThen(() => router.push('/pro'))} />
    </Sheet>
  );
}

function LivesSheetContent({ onClose, onOpenPro }: { onClose: () => void; onOpenPro: () => void }) {
  const now = useNow(1000);
  const lives = useLives(now);
  const proUntil = useStore((s) => s.proUntil);
  const unlimitedUntil = useStore((s) => s.unlimitedUntil);
  const isPro = useStore((s) => selectIsPro(s, now));

  if (lives.unlimited) {
    const until = isPro ? proUntil : unlimitedUntil;
    return (
      <VStack gap="lg" style={styles.content}>
        <HeartsRow lives={lives.max} max={lives.max} unlimited size={HERO_HEART} />
        <VStack gap="xs" align="center">
          <Text variant="titleLg" align="center" accessibilityRole="header">
            {LIVES_COPY.unlimitedTitle}
          </Text>
          <Text variant="bodyMd" color="textSecondary" align="center">
            {isPro && until !== null
              ? LIVES_COPY.proMessage(formatLongDate(until))
              : LIVES_COPY.unlimitedMessage(formatCountdown(Math.max(0, (until ?? now) - now)))}
          </Text>
        </VStack>
        <Button title={LIVES_COPY.ctaContinue} fullWidth onPress={onClose} />
      </VStack>
    );
  }

  const full = lives.isFull;
  return (
    <VStack gap="lg" style={styles.content}>
      <Text variant="titleLg" align="center" accessibilityRole="header" accessibilityLiveRegion="polite">
        {full ? LIVES_COPY.fullTitle : LIVES_COPY.partialTitle(lives.lives)}
      </Text>

      <LivesOptionCards lives={lives.lives} max={lives.max} onProPress={onOpenPro} />

      {!full && lives.nextRefillAt !== null ? (
        <VStack gap="xs" align="center">
          <Chip
            icon={Clock}
            tone="lives"
            label={LIVES_COPY.nextLife(formatCountdown(lives.nextRefillAt - now))}
            accessibilityLabel={LIVES_COPY.nextLife(formatCountdown(lives.nextRefillAt - now))}
            style={styles.chip}
          />
          <Text variant="bodySm" color="textTertiary" align="center">
            {LIVES_COPY.refillRule}
          </Text>
        </VStack>
      ) : null}

      {!full ? <RefillOptions now={now} /> : null}

      <VStack gap="xs">
        <Button title={LIVES_COPY.ctaPro} fullWidth onPress={onOpenPro} />
        <Button title={LIVES_COPY.ctaNoThanks} variant="outline" fullWidth onPress={onClose} />
      </VStack>
    </VStack>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.xs },
  chip: { alignSelf: 'center' },
});
