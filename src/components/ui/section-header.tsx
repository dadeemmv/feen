/**
 * SectionHeader — `overline` ("MENU", "ALTRO", "BONUS") or `title` ("📖 Continua a studiare",
 * "Calendario dei progressi") with an optional trailing action ("Vedi tutti").
 */
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { spacing } from '@/theme';

import { PressableScale } from './pressable-scale';
import { Text } from './text';

export type SectionHeaderProps = {
  title: string;
  /** Emoji before the title (title variant). */
  emoji?: string;
  /** Default `overline`. */
  variant?: 'overline' | 'title';
  /** `{ label, onPress }` renders a text action; a node renders as-is. */
  action?: { label: string; onPress: () => void } | ReactNode;
  style?: StyleProp<ViewStyle>;
};

function isTextAction(action: SectionHeaderProps['action']): action is { label: string; onPress: () => void } {
  return typeof action === 'object' && action !== null && 'label' in action && 'onPress' in action;
}

export function SectionHeader({ title, emoji, variant = 'overline', action, style }: SectionHeaderProps) {
  const isOverline = variant === 'overline';
  const text = emoji ? `${emoji} ${title}` : title;

  return (
    <View style={[styles.row, isOverline ? styles.overline : styles.title, style]}>
      <Text
        variant={isOverline ? 'overline' : 'titleMd'}
        color={isOverline ? 'textTertiary' : 'text'}
        accessibilityRole="header"
        numberOfLines={1}
        style={styles.flex}>
        {text}
      </Text>
      {isTextAction(action) ? (
        <PressableScale onPress={action.onPress} scaleTo={false} dimOnPress haptic="selection" hitSlop={spacing.xs}>
          <Text variant="labelMd" color="brandText">
            {action.label}
          </Text>
        </PressableScale>
      ) : (
        (action ?? null)
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  overline: { paddingHorizontal: spacing.xxs, minHeight: spacing.xl },
  title: { minHeight: spacing.xxl },
  flex: { flex: 1 },
});
