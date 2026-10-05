/**
 * Title block of info / definition steps: emoji inline before the displaySm title (it pops in),
 * then the titleSm lead.
 */
import { StyleSheet, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { Text, useReduceMotion } from '@/components/ui';
import { duration, easing, spacing } from '@/theme';

import { EMOJI_LINE_HEIGHT, lessonMetrics, STAGGER } from '../metrics';

type Props = { emoji: string; title: string; lead: string };

export function StepTitle({ emoji, title, lead }: Props) {
  const reduceMotion = useReduceMotion();
  return (
    <View style={styles.block}>
      <View style={styles.titleRow}>
        <Animated.View
          aria-hidden
          entering={reduceMotion ? undefined : ZoomIn.delay(STAGGER.popMs).duration(duration.base).easing(easing.enter)}>
          <Text style={styles.emoji}>{emoji}</Text>
        </Animated.View>
        <Text variant="displaySm" accessibilityRole="header" style={styles.title}>
          {title}
        </Text>
      </View>
      <Text variant="titleSm">{lead}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: spacing.sm },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  emoji: {
    fontSize: lessonMetrics.titleEmoji,
    lineHeight: Math.round(lessonMetrics.titleEmoji * EMOJI_LINE_HEIGHT),
  },
  title: { flex: 1 },
});
