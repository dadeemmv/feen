/**
 * RateAppSheet ("Valuta app" — "Che voto ci daresti?"). Five animated stars; the follow-up
 * appears under them and follows the vote live:
 *   ≥ 4 → "Grazie! 💚" + "Lascia una recensione" (demo: no store link, a thank-you toast)
 *   ≤ 3 → "Cosa possiamo migliorare?" feedback field + "Invia" → "Feedback ricevuto".
 * The vote is saved in the store (`meta.appRating`) and pre-selected the next time.
 *
 * `{ visible, onClose }` matches `GlobalOverlayProps`, so it can be registered as 'rate'.
 */
import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { HeartHandshake, MessageSquareHeart } from 'lucide-react-native';

import { Button, IconTile, Sheet, Text, TextField, VStack } from '@/components/ui';
import { useEntering } from '@/features/onboarding/lib/entering';
import { haptics } from '@/lib/haptics';
import { getStoreState, useStore } from '@/store';
import { showToast } from '@/store/ui';
import { spacing } from '@/theme';

import { RATE_COPY } from '../copy';
import { RewardBurst } from './reward-burst';
import { RatingStars } from './rating-stars';

export type RateAppSheetProps = { visible: boolean; onClose: () => void };

/** A vote from 4 stars up is a happy user: ask for a public review instead of feedback. */
const POSITIVE_RATING = 4;
const FEEDBACK_MAX_LENGTH = 400;

export function RateAppSheet({ visible, onClose }: RateAppSheetProps) {
  const savedRating = useStore((s) => s.appRating) ?? 0;
  const [rating, setRating] = useState(savedRating);
  const [pulse, setPulse] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [sent, setSent] = useState(false);
  const toastAfterClose = useRef<string | null>(null);
  const { rise } = useEntering();

  const rate = (value: number) => {
    setRating(value);
    setPulse((p) => p + 1);
    getStoreState().setAppRating(value);
    if (value >= POSITIVE_RATING) haptics.success();
  };

  const leaveReview = () => {
    toastAfterClose.current = RATE_COPY.reviewToast;
    onClose();
  };

  const send = () => {
    haptics.success();
    setSent(true);
  };

  // Toasts render under an open Modal on native: show them once the sheet is gone.
  const handleClosed = () => {
    if (toastAfterClose.current) showToast(toastAfterClose.current, { tone: 'success', icon: '💚' });
    toastAfterClose.current = null;
    setRating(getStoreState().appRating ?? 0);
    setPulse(0);
    setFeedback('');
    setSent(false);
  };

  const positive = rating >= POSITIVE_RATING;

  return (
    <Sheet visible={visible} onClose={onClose} onClosed={handleClosed} title={sent ? undefined : RATE_COPY.title}>
      {sent ? (
        <VStack gap="lg" align="center" style={styles.top}>
          <RewardBurst>
            <IconTile icon={HeartHandshake} tone="mint" size="xl" round solid />
          </RewardBurst>
          <VStack gap="xxs" align="center">
            <Text variant="displaySm" align="center" accessibilityRole="header" accessibilityLiveRegion="polite">
              {RATE_COPY.sentTitle}
            </Text>
            <Text variant="bodyMd" color="textSecondary" align="center">
              {RATE_COPY.sentMessage}
            </Text>
          </VStack>
          <Button title={RATE_COPY.close} fullWidth onPress={onClose} />
        </VStack>
      ) : (
        <VStack gap="lg">
          <VStack gap="sm" align="center">
            <Text variant="bodyMd" color="textSecondary" align="center">
              {RATE_COPY.question}
            </Text>
            <RatingStars value={rating} pulse={pulse} onChange={rate} />
            <Text
              variant="labelLg"
              color={rating > 0 ? 'text' : 'textTertiary'}
              align="center"
              accessibilityLiveRegion="polite">
              {rating > 0 ? RATE_COPY.labels[rating - 1] : RATE_COPY.hint}
            </Text>
          </VStack>

          {rating === 0 ? null : positive ? (
            <Animated.View key="positive" entering={rise()} style={styles.block}>
              <View style={styles.thanks}>
                <Text variant="titleMd" align="center">
                  {RATE_COPY.thanksTitle}
                </Text>
                <Text variant="bodyMd" color="textSecondary" align="center">
                  {RATE_COPY.thanksMessage}
                </Text>
              </View>
              <Button title={RATE_COPY.review} fullWidth onPress={leaveReview} />
              <Button title={RATE_COPY.later} variant="ghost" size="md" fullWidth onPress={onClose} />
            </Animated.View>
          ) : (
            <Animated.View key="negative" entering={rise()} style={styles.block}>
              <TextField
                label={RATE_COPY.feedbackTitle}
                placeholder={RATE_COPY.feedbackPlaceholder}
                value={feedback}
                onChangeText={setFeedback}
                multiline
                maxLength={FEEDBACK_MAX_LENGTH}
                leading={MessageSquareHeart}
                textVariant="bodyMd"
              />
              <Button title={RATE_COPY.send} fullWidth disabled={feedback.trim().length === 0} onPress={send} />
            </Animated.View>
          )}
        </VStack>
      )}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  top: { paddingTop: spacing.md },
  block: { gap: spacing.sm },
  thanks: { gap: spacing.xxs, paddingBottom: spacing.xs },
});
