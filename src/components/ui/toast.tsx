/**
 * Toast — global, one at a time ("Codice copiato", "Ricompensa riscattata!").
 * Mount `<ToastHost />` once at the root (after the navigator). Show from anywhere:
 *   const toast = useToast(); toast.show({ message: 'Codice copiato', tone: 'success' });
 *   // or outside React: toast.show('Codice copiato')
 * Slides down under the safe area, auto-hides after `motion.duration.toast`, tap to dismiss.
 */
import { useEffect, useEffectEvent } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeOutUp, SlideInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CircleCheck, CircleX, Info, TriangleAlert } from 'lucide-react-native';
import { create } from 'zustand';

import { ColorModeProvider, duration, easing, elevation, layout, radius, spacing, themes } from '@/theme';

import { renderIcon, type IconSource } from './icon';
import { controlHeight, hairline, iconSize, iconStroke, zIndex } from './metrics';
import { Text } from './text';

export type ToastTone = 'neutral' | 'success' | 'danger' | 'warning' | 'info';

export type ToastOptions = {
  message: string;
  /** Default `neutral`. */
  tone?: ToastTone;
  /** Overrides the tone icon (Lucide, element or emoji). */
  icon?: IconSource;
  /** Visible time in ms. Default `motion.duration.toast`. */
  duration?: number;
};

type ToastItem = ToastOptions & { id: number };

const useToastStore = create<{ current: ToastItem | null }>(() => ({ current: null }));
let nextId = 1;

export const toast = {
  /** Shows a toast (replacing the current one). Returns its id. */
  show(options: ToastOptions | string): number {
    const item: ToastItem = { ...(typeof options === 'string' ? { message: options } : options), id: nextId++ };
    useToastStore.setState({ current: item });
    return item.id;
  },
  /** Hides the current toast (or only the one with `id`). */
  hide(id?: number): void {
    const { current } = useToastStore.getState();
    if (!current || (id !== undefined && current.id !== id)) return;
    useToastStore.setState({ current: null });
  },
};

export function useToast() {
  return toast;
}

const brand = themes.brand.colors;

const TONE_ICON: Record<ToastTone, { icon?: IconSource; color: string }> = {
  neutral: { color: brand.text },
  success: { icon: CircleCheck, color: brand.accentSolid },
  danger: { icon: CircleX, color: brand.dangerSolid },
  warning: { icon: TriangleAlert, color: brand.warningSolid },
  info: { icon: Info, color: brand.infoSolid },
};

export type ToastHostProps = {
  /**
   * Controlled mode: render this toast instead of the built-in store (e.g. the app's `useUi`
   * store: `<ToastHost toast={ui.toast} onHide={ui.hideToast} />`). `null` shows nothing.
   * Omit to use `toast.show()` / `useToast()`.
   */
  toast?: (ToastOptions & { id: number }) | null;
  /** Controlled mode: called with the id when the toast times out or is tapped. */
  onHide?: (id: number) => void;
};

export function ToastHost({ toast: controlled, onHide }: ToastHostProps = {}) {
  const stored = useToastStore((s) => s.current);
  const insets = useSafeAreaInsets();
  const isControlled = controlled !== undefined;
  const current = isControlled ? controlled : stored;
  const hide = (id: number) => (isControlled ? onHide?.(id) : toast.hide(id));

  // The timer restarts only for a new toast, never because `hide` changed identity.
  const onTimeout = useEffectEvent((id: number) => hide(id));
  useEffect(() => {
    if (!current) return;
    const timer = setTimeout(() => onTimeout(current.id), current.duration ?? duration.toast);
    return () => clearTimeout(timer);
  }, [current]);

  return (
    <View style={[styles.host, { paddingTop: insets.top + spacing.xs }]}>
      {current ? <ToastView key={current.id} item={current} onHide={hide} /> : null}
    </View>
  );
}

function ToastView({ item, onHide }: { item: ToastItem; onHide: (id: number) => void }) {
  const tone = TONE_ICON[item.tone ?? 'neutral'];
  const icon = item.icon ?? tone.icon;

  return (
    <Animated.View
      entering={SlideInUp.duration(duration.slow).easing(easing.enter)}
      exiting={FadeOutUp.duration(duration.fast).easing(easing.exit)}
      style={styles.wrapper}>
      <ColorModeProvider mode="brand">
        <Pressable
          onPress={() => onHide(item.id)}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
          accessibilityLabel={item.message}
          style={styles.toast}>
          {renderIcon(icon, { size: iconSize.md, color: tone.color, strokeWidth: iconStroke.bold })}
          <Text variant="labelMd" color="text" numberOfLines={2} style={styles.message}>
            {item.message}
          </Text>
        </Pressable>
      </ColorModeProvider>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: layout.screenX,
    pointerEvents: 'box-none',
    zIndex: zIndex.toast,
  },
  wrapper: { maxWidth: layout.maxContentWidth },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: controlHeight.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: brand.background,
    borderWidth: hairline,
    borderColor: brand.borderSubtle,
    boxShadow: elevation.lg,
  },
  message: { flexShrink: 1 },
});
