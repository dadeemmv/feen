/**
 * Title block of info / definition steps: the displaySm title, then the titleSm lead. The
 * content's emoji is not drawn: the lesson stays black and white (colour lives in the village).
 */
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { spacing } from '@/theme';

type Props = { title: string; lead: string };

export function StepTitle({ title, lead }: Props) {
  return (
    <View style={styles.block}>
      <Text variant="displaySm" accessibilityRole="header">
        {title}
      </Text>
      <Text variant="titleSm" color="textSecondary">
        {lead}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: spacing.sm },
});
