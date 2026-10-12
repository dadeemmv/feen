/**
 * Lesson header: close ✕, the ink progress bar and report ⚑ on one row. No coins and no share:
 * bricks are counted at the end, in the village, and a lesson is not something to advertise.
 * "Di nuovo" marks a lesson that is being done again.
 */
import { StyleSheet, View } from 'react-native';
import { Flag, X } from 'lucide-react-native';

import { IconButton, ProgressBar, Text } from '@/components/ui';
import { layout, spacing } from '@/theme';

import { COPY } from '../copy';

export type LessonHeaderProps = {
  progress: number;
  practice: boolean;
  onClose: () => void;
  onReport: () => void;
};

export function LessonHeader({ progress, practice, onClose, onReport }: LessonHeaderProps) {
  return (
    <View style={styles.row}>
      <IconButton icon={X} variant="plain" accessibilityLabel={COPY.a11y.close} onPress={onClose} testID="lesson-close" />
      <ProgressBar value={progress} tone="brand" size="md" accessibilityLabel={COPY.a11y.progress} style={styles.bar} />
      {practice ? (
        <Text variant="overline" color="textSecondary">
          {COPY.practiceTag}
        </Text>
      ) : null}
      <IconButton icon={Flag} variant="plain" accessibilityLabel={COPY.a11y.report} onPress={onReport} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: layout.screenX - spacing.sm,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
  },
  bar: { flex: 1 },
});
