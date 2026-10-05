/**
 * OutOfLivesSheet — 0 hearts (global overlay 'out-of-lives', spec §5): empty hearts, the live
 * countdown to the next life, instant refills with Kiwi and the Finanz Pro upsell. Opened by the
 * lesson player when the user tries to answer with no lives left (or opens a lesson at 0).
 *
 * When it is shown over a lesson, the secondary action leaves the lesson (progress is saved);
 * as soon as a life is back (clock or purchase) it turns into "Sei di nuovo in gioco!".
 */
import { useRef } from 'react';
import { StyleSheet } from 'react-native';
import { router, usePathname } from 'expo-router';
import { Clock } from 'lucide-react-native';

import { GemIcon } from '@/components/icons';
import { Button, Card, Chip, HStack, Sheet, Text, VStack, iconSize } from '@/components/ui';
import { formatCountdown } from '@/lib/format';
import { useLives, useNow } from '@/store/hooks';
import { spacing } from '@/theme';

import { HeartsRow } from './components/hearts-row';
import { RefillOptions } from './components/refill-options';
import { LIVES_COPY } from './copy';

export type OutOfLivesSheetProps = {
  visible: boolean;
  onClose: () => void;
  /**
   * Presented over a lesson: the secondary action becomes "Esci dalla lezione". Defaults to the
   * current route (`/lesson/...`), so the global overlay works without passing it.
   */
  fromLesson?: boolean;
  /** "Esci dalla lezione" handler (after the sheet has closed). Default: back (or Home). */
  onLeaveLesson?: () => void;
};

const leaveLessonDefault = () => (router.canGoBack() ? router.back() : router.replace('/'));

const HERO_HEART = iconSize.xl + spacing.md;

export function OutOfLivesSheet({ visible, onClose, fromLesson, onLeaveLesson = leaveLessonDefault }: OutOfLivesSheetProps) {
  const pathname = usePathname();
  const inLesson = fromLesson ?? pathname.startsWith('/lesson');
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
    <Sheet visible={visible} onClose={onClose} onClosed={handleClosed} scrollable accessibilityLabel={LIVES_COPY.outTitle}>
      <OutOfLivesContent
        inLesson={inLesson}
        onClose={onClose}
        onOpenPro={() => closeThen(() => router.push('/pro'))}
        onLeaveLesson={() => closeThen(onLeaveLesson)}
      />
    </Sheet>
  );
}

type ContentProps = {
  inLesson: boolean;
  onClose: () => void;
  onOpenPro: () => void;
  onLeaveLesson: () => void;
};

function OutOfLivesContent({ inLesson, onClose, onOpenPro, onLeaveLesson }: ContentProps) {
  const now = useNow(1000);
  const lives = useLives(now);
  const back = lives.unlimited || lives.lives > 0;

  if (back) {
    return (
      <VStack gap="lg" style={styles.content}>
        <HeartsRow lives={lives.lives} max={lives.max} unlimited={lives.unlimited} size={HERO_HEART} />
        <VStack gap="xs" align="center">
          <Text variant="titleLg" align="center" accessibilityRole="header" accessibilityLiveRegion="polite">
            {LIVES_COPY.backTitle}
          </Text>
          <Text variant="bodyMd" color="textSecondary" align="center">
            {lives.unlimited ? LIVES_COPY.unlimitedOn : LIVES_COPY.backMessage(lives.lives)}
          </Text>
        </VStack>
        <Button title={inLesson ? LIVES_COPY.ctaResume : LIVES_COPY.ctaContinue} fullWidth onPress={onClose} />
      </VStack>
    );
  }

  const countdown = formatCountdown(Math.max(0, (lives.nextRefillAt ?? now) - now));
  return (
    <VStack gap="lg" style={styles.content}>
      <HeartsRow lives={0} max={lives.max} size={HERO_HEART} />
      <VStack gap="xs" align="center">
        <Text variant="titleLg" align="center" accessibilityRole="header">
          {LIVES_COPY.outTitle}
        </Text>
        <Text variant="bodyMd" color="textSecondary" align="center">
          {LIVES_COPY.outMessage}
        </Text>
        <Chip icon={Clock} tone="lives" label={LIVES_COPY.nextLife(countdown)} style={styles.chip} />
      </VStack>

      <RefillOptions now={now} />

      <Card variant="brand" padding="md" contentStyle={styles.pro}>
        <HStack gap="sm">
          <GemIcon size={iconSize.xl} />
          <VStack flex gap="xxxs">
            <Text variant="titleSm">{LIVES_COPY.proCard.title}</Text>
            <Text variant="bodySm" color="textSecondary">
              {LIVES_COPY.proCard.subtitle}
            </Text>
          </VStack>
        </HStack>
        <Button title={LIVES_COPY.ctaTryPro} size="md" glow fullWidth onPress={onOpenPro} />
      </Card>

      <Button
        title={inLesson ? LIVES_COPY.ctaLeaveLesson : LIVES_COPY.ctaWait}
        variant="outline"
        fullWidth
        onPress={inLesson ? onLeaveLesson : onClose}
      />
    </VStack>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.xs },
  chip: { marginTop: spacing.xxs, alignSelf: 'center' },
  pro: { gap: spacing.sm },
});
