/**
 * Lesson header (redlines "Lesson player"): close ✕, report ⚑ and share on the left, lives and
 * coins chips on the right (store-connected; the lives chip bumps and shakes when a life goes),
 * then the animated evergreen progress bar. A "Ripasso" tag marks practice replays.
 */
import { StyleSheet, View } from 'react-native';
import { Flag, Share, X } from 'lucide-react-native';

import { ConnectedStatusHeader } from '@/components/navigation/connected-status-header';
import { IconButton, ProgressBar, Tag } from '@/components/ui';
import { layout, spacing } from '@/theme';

import { COPY } from '../copy';

export type LessonHeaderProps = {
  progress: number;
  practice: boolean;
  onClose: () => void;
  onReport: () => void;
  onShare: () => void;
  onLivesPress: () => void;
  onCoinsPress: () => void;
};

const STATS: ('lives' | 'coins')[] = ['lives', 'coins'];

export function LessonHeader({ progress, practice, onClose, onReport, onShare, onLivesPress, onCoinsPress }: LessonHeaderProps) {
  return (
    <View>
      <ConnectedStatusHeader
        stats={STATS}
        showAvatar={false}
        onLivesPress={onLivesPress}
        onCoinsPress={onCoinsPress}
        left={
          <>
            <IconButton icon={X} variant="plain" accessibilityLabel={COPY.a11y.close} onPress={onClose} testID="lesson-close" />
            <IconButton icon={Flag} variant="plain" accessibilityLabel={COPY.a11y.report} onPress={onReport} />
            <IconButton icon={Share} variant="plain" accessibilityLabel={COPY.a11y.share} onPress={onShare} />
          </>
        }
      />
      <View style={styles.progressRow}>
        <ProgressBar
          value={progress}
          tone="brand"
          size="md"
          accessibilityLabel={COPY.a11y.progress}
          style={styles.bar}
        />
        {practice ? <Tag label={COPY.practiceTag} emoji="🔁" tone="lilac" size="sm" /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: layout.screenX,
    paddingTop: spacing.xxs,
    paddingBottom: spacing.xs,
  },
  bar: { flex: 1 },
});
