/**
 * End of the path: "TRAGUARDO RAGGIUNTO" trophy card (video t=36 s).
 * - locked: quiet surface card, greyscale trophies, how many chapters are left, disabled share.
 * - done: evergreen spotlight card, toasting trophies, lime headline, share CTA (+ confetti the
 *   moment the course gets completed while the path is open).
 */
import { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Lock, Share2 } from 'lucide-react-native';

import { TrophyCups } from '@/components/illustrations';
import { Button, Card, Confetti, ProgressBar, Tag, Text, toast, useReduceMotion, VStack } from '@/components/ui';
import { haptics } from '@/lib/haptics';
import { shareText } from '@/lib/share';
import { duration, easing, spacing } from '@/theme';

import { GOAL } from '../constants';
import { COURSE_COPY } from '../copy';

export type GoalCardProps = {
  courseTitle: string;
  completed: number;
  total: number;
  isDone: boolean;
};

export function GoalCard({ courseTitle, completed, total, isDone }: GoalCardProps) {
  const reduceMotion = useReduceMotion();
  const [sharing, setSharing] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const wasDone = useRef(isDone);

  useEffect(() => {
    if (isDone && !wasDone.current) {
      setCelebrate(true);
      haptics.success();
    }
    wasDone.current = isDone;
  }, [isDone]);

  const share = async () => {
    setSharing(true);
    const outcome = await shareText(COURSE_COPY.goalShareMessage(courseTitle), undefined, {
      title: COURSE_COPY.goalShareTitle,
    });
    setSharing(false);
    if (outcome === 'shared') toast.show({ message: COURSE_COPY.goalShared, tone: 'success' });
  };

  const entering = reduceMotion ? undefined : FadeInDown.duration(duration.slow).easing(easing.enter).delay(duration.slow);

  if (!isDone) {
    return (
      <Animated.View entering={entering}>
        <Card variant="surface" padding="lg" contentStyle={styles.content} accessibilityLabel={COURSE_COPY.goalTitle}>
          <Tag label={COURSE_COPY.goalLockedTag} icon={Lock} tone="neutral" size="sm" style={styles.tag} />
          <TrophyCups muted width={GOAL.trophyWidth} />
          <Text variant="displayLg" color="textTertiary" align="center" style={styles.headline}>
            {COURSE_COPY.goalTitle}
          </Text>
          <Text variant="bodyMd" color="textSecondary" align="center">
            {COURSE_COPY.goalLockedMessage(total)}
          </Text>
          <VStack gap="xs" style={styles.progress}>
            <ProgressBar value={total === 0 ? 0 : completed / total} size="sm" tone="brand" />
            <Text variant="labelSm" color="textTertiary" align="center" tabular>
              {COURSE_COPY.goalProgress(completed, total)}
            </Text>
          </VStack>
          <Button
            title={COURSE_COPY.goalShare}
            iconLeft={Share2}
            disabled
            fullWidth
            accessibilityHint={COURSE_COPY.goalShareLockedHint}
          />
        </Card>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={entering}>
      <Card variant="brand" spotlight padding="lg" contentStyle={styles.content} accessibilityLabel={COURSE_COPY.goalTitle}>
        <Tag label={COURSE_COPY.goalDoneTag} tone="accent" solid size="sm" style={styles.tag} />
        <TrophyCups width={GOAL.trophyWidth} accessibilityLabel={COURSE_COPY.goalTitle} />
        <Text variant="displayLg" color="accentText" align="center" style={styles.headline}>
          {COURSE_COPY.goalTitle}
        </Text>
        <Text variant="bodyMd" color="textSecondary" align="center">
          {COURSE_COPY.goalDoneMessage}
        </Text>
        <Button
          title={COURSE_COPY.goalShare}
          iconLeft={Share2}
          shimmer
          glow
          fullWidth
          loading={sharing}
          onPress={share}
          style={styles.cta}
        />
      </Card>
      <Confetti run={celebrate} onComplete={() => setCelebrate(false)} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: 'center', gap: spacing.sm },
  tag: { alignSelf: 'center' },
  headline: { textTransform: 'uppercase', marginTop: spacing.xxs },
  progress: { alignSelf: 'stretch', marginVertical: spacing.xxs },
  cta: { marginTop: spacing.xs },
});
