/**
 * ListItem (alias MenuRow) — Account-style row: tinted icon tile, title, one-line subtitle,
 * trailing chevron / value / custom node. `plain` rows live inside a <ListGroup>; `card` rows
 * stand alone as their own white card (the video's layout).
 */
import { useState, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { type CSSTransitionProperties } from 'react-native-reanimated';
import { ChevronRight } from 'lucide-react-native';

import type { HapticKind } from '@/lib/haptics';
import { duration, elevation, radius, spacing, useTheme } from '@/theme';

import type { IconSource } from './icon';
import { IconTile } from './icon-tile';
import { hairline, iconSize, iconStroke, tileSize, uiOpacity } from './metrics';
import { PressableScale } from './pressable-scale';
import { Text } from './text';
import type { Tone } from './tones';

export type ListItemProps = {
  title: string;
  subtitle?: string;
  /** Leading tile icon (Lucide component / element / emoji string). */
  icon?: IconSource;
  /** Leading tile emoji (shorthand). */
  emoji?: string;
  /** Tile tint. Default `neutral`. */
  iconTone?: Tone;
  /** Replaces the tile entirely (e.g. an Avatar). */
  leading?: ReactNode;
  /** Secondary value shown before the chevron ("Italiano"). */
  value?: string;
  /** `'chevron'` (default when pressable), `'none'`, or any node (Switch, Badge, Chip…). */
  trailing?: ReactNode | 'chevron' | 'none';
  onPress?: () => void;
  disabled?: boolean;
  /** Title in danger colour (Logout, Delete). */
  destructive?: boolean;
  /** Default `plain`. */
  variant?: 'plain' | 'card';
  haptic?: Extract<HapticKind, 'selection' | 'light'>;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
};

const ROW_MIN_HEIGHT = tileSize.md + spacing.sm * 2;

export function ListItem({
  title,
  subtitle,
  icon,
  emoji,
  iconTone = 'neutral',
  leading,
  value,
  trailing,
  onPress,
  disabled = false,
  destructive = false,
  variant = 'plain',
  haptic = 'selection',
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
}: ListItemProps) {
  const theme = useTheme();
  const [pressed, setPressed] = useState(false);
  const isCard = variant === 'card';
  const trailingMode = trailing ?? (onPress ? 'chevron' : 'none');
  const restingBg = isCard ? theme.colors.surface : 'transparent';
  const background = pressed ? theme.colors.fill : restingBg;

  const leadingNode =
    leading ?? (icon || emoji ? <IconTile icon={icon} emoji={emoji} tone={iconTone} size="md" /> : null);

  const content = (
    <Animated.View
      style={[
        styles.row,
        isCard && [styles.card, { borderColor: theme.colors.borderSubtle }],
        rowTransition,
        { backgroundColor: background },
        disabled && styles.disabled,
      ]}>
      {leadingNode}
      <View style={styles.texts}>
        <Text variant="titleSm" color={destructive ? 'dangerText' : 'text'} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="bodySm" color="textSecondary" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {value ? (
        <Text variant="bodyMd" color="textSecondary" numberOfLines={1} style={styles.value}>
          {value}
        </Text>
      ) : null}
      {trailingMode === 'chevron' ? (
        <ChevronRight size={iconSize.md} color={theme.colors.textTertiary} strokeWidth={iconStroke.bold} />
      ) : trailingMode === 'none' ? null : (
        trailingMode
      )}
    </Animated.View>
  );

  if (!onPress) {
    // A custom trailing control (Switch, Button) must stay reachable by screen readers, so the
    // row is only grouped into one accessible element when it has no interactive trailing node.
    const groupForA11y = trailingMode === 'chevron' || trailingMode === 'none';
    return (
      <View
        style={style}
        testID={testID}
        accessible={groupForA11y}
        accessibilityLabel={groupForA11y ? (accessibilityLabel ?? title) : undefined}>
        {content}
      </View>
    );
  }

  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      haptic={haptic}
      scaleTo={isCard ? 'large' : false}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? (subtitle ? `${title}, ${subtitle}` : title)}
      accessibilityHint={accessibilityHint}
      testID={testID}
      style={style}>
      {content}
    </PressableScale>
  );
}

/** Alias used by the Account screen spec. */
export const MenuRow = ListItem;
export type MenuRowProps = ListItemProps;

const rowTransition: CSSTransitionProperties<ViewStyle> = {
  transitionProperty: 'backgroundColor',
  transitionDuration: duration.fast,
  transitionTimingFunction: 'ease',
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: ROW_MIN_HEIGHT,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  card: { borderRadius: radius.lg, borderWidth: hairline, boxShadow: elevation.sm },
  texts: { flex: 1, gap: spacing.xxxs },
  value: { maxWidth: '40%' },
  disabled: { opacity: uiOpacity.disabled },
});
