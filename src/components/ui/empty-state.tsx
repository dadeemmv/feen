/**
 * EmptyState — centred illustration + title + message + optional action ("Nessun acquisto",
 * "Nessuna chat", "Non hai ancora amici invitati"). The illustration slot takes any node (an
 * `@/components/illustrations` composition, an economy icon) or falls back to an emoji tile.
 */
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { duration, easing, spacing } from '@/theme';

import { Button, type ButtonVariant } from './button';
import { IconTile } from './icon-tile';
import { readableWidth } from './metrics';
import { Text } from './text';
import type { Tone } from './tones';

export type EmptyStateProps = {
  title: string;
  message?: string;
  /** Illustration / icon node above the title. */
  illustration?: ReactNode;
  /** Emoji fallback rendered in a large tinted tile when no illustration is given. */
  emoji?: string;
  /** Tint of the emoji tile. Default `accent`. */
  tone?: Tone;
  action?: { label: string; onPress: () => void; variant?: ButtonVariant };
  secondaryAction?: { label: string; onPress: () => void };
  /** Tighter spacing for cards and sheets. Default `false`. */
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function EmptyState({
  title,
  message,
  illustration,
  emoji,
  tone = 'accent',
  action,
  secondaryAction,
  compact = false,
  style,
}: EmptyStateProps) {
  const art = illustration ?? (emoji ? <IconTile emoji={emoji} tone={tone} size="xl" round /> : null);

  return (
    <Animated.View
      entering={FadeIn.duration(duration.slow).easing(easing.enter)}
      style={[styles.root, compact ? styles.compact : styles.regular, style]}>
      {art ? <View style={compact ? styles.artCompact : styles.art}>{art}</View> : null}
      <Text variant={compact ? 'titleMd' : 'titleLg'} align="center" accessibilityRole="header">
        {title}
      </Text>
      {message ? (
        <Text variant="bodyMd" color="textSecondary" align="center" style={styles.message}>
          {message}
        </Text>
      ) : null}
      {action || secondaryAction ? (
        <View style={styles.actions}>
          {action ? (
            <Button title={action.label} onPress={action.onPress} variant={action.variant ?? 'primary'} size="md" />
          ) : null}
          {secondaryAction ? (
            <Button title={secondaryAction.label} onPress={secondaryAction.onPress} variant="ghost" size="md" />
          ) : null}
        </View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', gap: spacing.xs },
  regular: { paddingVertical: spacing.xxxl, paddingHorizontal: spacing.xl },
  compact: { paddingVertical: spacing.xl, paddingHorizontal: spacing.md },
  art: { marginBottom: spacing.md },
  artCompact: { marginBottom: spacing.xs },
  message: { maxWidth: readableWidth },
  actions: { marginTop: spacing.md, gap: spacing.xs, alignItems: 'center' },
});
