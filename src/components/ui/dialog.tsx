/**
 * Dialog — modal card with an overlapping icon badge ("Risposta corretta", "Risposta errata",
 * "Aspetta, non uscire!"). Bottom-anchored on phones (thumb reach, like the video), centred on
 * tablet/web widths. Layout animations use `.duration().easing()` for web parity; the Modal stays
 * mounted until the exit animation has played.
 */
import { useEffect, useEffectEvent, useState, type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View, useWindowDimensions, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut, FadeOutDown, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';

import { haptics } from '@/lib/haptics';
import { duration, easing, elevation, layout, radius, spacing, useTheme } from '@/theme';

import { Button, type ButtonVariant } from './button';
import { DialogBadge, type DialogBadgePreset, type DialogTone } from './dialog-badge';
import type { IconSource } from './icon';
import { IconButton } from './icon-button';
import { dialogBadgeSize } from './metrics';
import { Text } from './text';
import { useReduceMotion } from './use-reduce-motion';

export type DialogAction = {
  label: string;
  onPress: () => void;
  /** Primary default follows the tone (danger → `danger`, else `primary`); secondary default `outline`. */
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  iconLeft?: IconSource;
};

export type DialogProps = {
  visible: boolean;
  /** Close button, scrim tap (if `dismissible`) and Android back. */
  onClose: () => void;
  /** After the exit animation. */
  onClosed?: () => void;
  /** Badge colours + default primary variant + open haptic. Default `neutral`. */
  tone?: DialogTone;
  /** 'success' ✓ · 'danger' ✕ · 'warning' ! · `{ type: 'emoji', emoji: '🥺' }` · `{ type: 'node', node }`. */
  badge?: DialogBadgePreset;
  /** Shorthand for `badge={{ type: 'node', node: icon }}`. */
  icon?: ReactNode;
  title: string;
  message?: ReactNode;
  /** Extra content between the message and the actions. */
  children?: ReactNode;
  primaryAction?: DialogAction;
  secondaryAction?: DialogAction;
  /** Top-right ✕. Default `true`. */
  showClose?: boolean;
  /** Scrim tap / back closes. Default `true`. */
  dismissible?: boolean;
  /** Default `auto` (bottom on phones, centre from tablet width). */
  placement?: 'auto' | 'bottom' | 'center';
  /** Notification haptic matching the tone when it opens. Default `true`. */
  haptic?: boolean;
  style?: StyleProp<ViewStyle>;
};

const OPEN_HAPTIC: Record<DialogTone, (() => void) | undefined> = {
  success: haptics.success,
  danger: haptics.error,
  warning: haptics.warning,
  neutral: undefined,
};

export function Dialog(props: DialogProps) {
  const { visible, onClosed } = props;
  const [mounted, setMounted] = useState(visible);
  if (visible && !mounted) setMounted(true);

  const onExited = useEffectEvent(() => {
    setMounted(false);
    onClosed?.();
  });

  useEffect(() => {
    if (visible || !mounted) return;
    // Keep the Modal alive while the exiting layout animations play.
    const timer = setTimeout(onExited, duration.base);
    return () => clearTimeout(timer);
  }, [visible, mounted]);

  if (!mounted) return null;
  return <DialogModal {...props} />;
}

function DialogModal({
  visible,
  onClose,
  tone = 'neutral',
  badge,
  icon,
  title,
  message,
  children,
  primaryAction,
  secondaryAction,
  showClose = true,
  dismissible = true,
  placement = 'auto',
  haptic = true,
  style,
}: DialogProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReduceMotion();
  const { width } = useWindowDimensions();
  const centered = placement === 'center' || (placement === 'auto' && width >= layout.breakpoints.tablet);
  const resolvedBadge: DialogBadgePreset | undefined = badge ?? (icon ? { type: 'node', node: icon } : undefined);

  const onOpen = useEffectEvent(() => {
    if (haptic) OPEN_HAPTIC[tone]?.();
  });
  useEffect(() => {
    if (visible) onOpen();
  }, [visible]);

  const enterDuration = reduceMotion ? duration.fast : duration.slow;
  const cardEntering = reduceMotion
    ? FadeIn.duration(enterDuration)
    : centered
      ? ZoomIn.duration(enterDuration).easing(easing.enter)
      : FadeInDown.duration(enterDuration).easing(easing.enter);
  const cardExiting = centered || reduceMotion
    ? FadeOut.duration(duration.fast).easing(easing.exit)
    : FadeOutDown.duration(duration.fast).easing(easing.exit);

  const dismiss = () => {
    if (dismissible) onClose();
  };
  const primaryVariant: ButtonVariant = primaryAction?.variant ?? (tone === 'danger' ? 'danger' : 'primary');

  return (
    <Modal visible transparent animationType="none" statusBarTranslucent navigationBarTranslucent onRequestClose={dismiss}>
      <View
        style={[styles.root, centered ? styles.center : [styles.bottom, { paddingBottom: insets.bottom + spacing.md }]]}>
        {visible ? (
          <Animated.View
            entering={FadeIn.duration(duration.base).easing(easing.standard)}
            exiting={FadeOut.duration(duration.base).easing(easing.standard)}
            style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.scrim }]}>
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={dismiss}
              disabled={!dismissible}
              accessibilityRole="button"
              accessibilityLabel="Chiudi"
            />
          </Animated.View>
        ) : null}

        {visible ? (
          <Animated.View
            entering={cardEntering}
            exiting={cardExiting}
            accessibilityViewIsModal
            accessibilityRole="alert"
            style={[
              styles.card,
              { backgroundColor: theme.colors.surface },
              resolvedBadge ? styles.cardWithBadge : styles.cardPlain,
              style,
            ]}>
            {resolvedBadge ? (
              <View style={styles.badgeSlot}>
                <DialogBadge badge={resolvedBadge} tone={tone} />
              </View>
            ) : null}
            {showClose ? (
              <IconButton
                icon={X}
                variant="glass"
                size="sm"
                accessibilityLabel="Chiudi"
                onPress={onClose}
                style={styles.close}
              />
            ) : null}

            <Text variant="displaySm" align="center" accessibilityRole="header">
              {title}
            </Text>
            {typeof message === 'string' ? (
              <Text variant="bodyMd" color="textSecondary" align="center" style={styles.message}>
                {message}
              </Text>
            ) : (
              message
            )}
            {children}

            {primaryAction || secondaryAction ? (
              <View style={styles.actions}>
                {primaryAction ? (
                  <Button
                    title={primaryAction.label}
                    onPress={primaryAction.onPress}
                    variant={primaryVariant}
                    loading={primaryAction.loading}
                    disabled={primaryAction.disabled}
                    iconLeft={primaryAction.iconLeft}
                    fullWidth
                  />
                ) : null}
                {secondaryAction ? (
                  <Button
                    title={secondaryAction.label}
                    onPress={secondaryAction.onPress}
                    variant={secondaryAction.variant ?? 'outline'}
                    loading={secondaryAction.loading}
                    disabled={secondaryAction.disabled}
                    iconLeft={secondaryAction.iconLeft}
                    fullWidth
                  />
                ) : null}
              </View>
            ) : null}
          </Animated.View>
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: layout.screenX },
  center: { justifyContent: 'center', alignItems: 'center' },
  bottom: { justifyContent: 'flex-end', alignItems: 'center' },
  card: {
    width: '100%',
    maxWidth: layout.maxContentWidth,
    borderRadius: radius.xxl,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.xs,
    boxShadow: elevation.xl,
  },
  cardWithBadge: { marginTop: dialogBadgeSize / 2, paddingTop: dialogBadgeSize / 2 + spacing.md },
  cardPlain: { paddingTop: spacing.xxl },
  badgeSlot: { position: 'absolute', top: -dialogBadgeSize / 2, left: 0, right: 0, alignItems: 'center' },
  close: { position: 'absolute', top: spacing.md, right: spacing.md },
  message: { marginBottom: spacing.xs },
  actions: { gap: spacing.sm, marginTop: spacing.md },
});
