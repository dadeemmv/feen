/**
 * Lesson footer (redlines "Footer: hairline top border, padding md, CTA lg full width"): the one
 * primary button of the player — pale and disabled until an answer is complete, then CHECK on
 * graded steps and NEXT on info / definition steps. The out-of-lives notice sits above it.
 */
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, hairline } from '@/components/ui';
import { spacing, useTheme } from '@/theme';

import { COPY } from '../copy';
import { OutOfLivesBanner } from './out-of-lives-banner';

export type LessonFooterProps = {
  enabled: boolean;
  onPress: () => void;
  /** Show the out-of-lives notice with this countdown ("2h 26min" or null). `undefined` hides it. */
  outOfLives?: { countdown: string | null };
  onRefill: () => void;
};

export function LessonFooter({ enabled, onPress, outOfLives, onRefill }: LessonFooterProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.footer,
        {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.borderSubtle,
          paddingBottom: Math.max(insets.bottom, spacing.md),
        },
      ]}>
      {outOfLives ? <OutOfLivesBanner countdown={outOfLives.countdown} onRefill={onRefill} /> : null}
      <Button
        title={COPY.cta.continue}
        disabled={!enabled}
        fullWidth
        haptic={enabled ? 'light' : false}
        onPress={onPress}
        testID="lesson-continue"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    borderTopWidth: hairline,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
});
