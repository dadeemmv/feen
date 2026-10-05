/** Three small stars under a completed chapter: 1–3 earned from the best accuracy. */
import { StyleSheet, View } from 'react-native';
import { Star } from 'lucide-react-native';

import { Icon } from '@/components/ui';
import { spacing } from '@/theme';

import { NODE } from '../constants';
import { COURSE_COPY } from '../copy';
import { accuracyStars } from '../lib/course-summary';

export function AccuracyStars({ accuracy }: { accuracy: number }) {
  const earned = accuracyStars(accuracy);
  return (
    <View style={styles.row} accessible accessibilityLabel={COURSE_COPY.accuracy(accuracy)}>
      {[1, 2, 3].map((n) => (
        <Icon
          key={n}
          icon={Star}
          size={NODE.star}
          color={n <= earned ? 'warningSolid' : 'border'}
          fill={n <= earned ? 'warningSolid' : 'border'}
          strokeWidth={0}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { height: NODE.footerLine, flexDirection: 'row', alignItems: 'center', gap: spacing.xxxs },
});
