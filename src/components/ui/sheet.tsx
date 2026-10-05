/**
 * Sheet — custom Reanimated bottom sheet (software-mansion BottomSheet example + vaul curve),
 * chosen over @gorhom/bottom-sheet (Reanimated 4 / web issues). Rendered in a transparent RN
 * Modal so it sits above tabs and stacks.
 *
 * Lifecycle: `visible` true → mount, measure, slide up (duration.sheet, easing.sheet).
 * User dismiss (drag down, scrim tap, Android back) → slide out → `onClose()`.
 * Parent sets `visible` false → slide out → unmount. The Modal stays mounted until the exit
 * animation ends, so closing is always animated.
 */
import { useEffect, useEffectEvent, useState, type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { isIOS } from '@/lib/platform';
import { duration, easing, elevation, layout, radius, spacing, spring, useTheme } from '@/theme';

import { grabber } from './metrics';
import { Text } from './text';
import { useReduceMotion } from './use-reduce-motion';

/** Drag physics (vaul/gorhom-like thresholds). */
const DISMISS_VELOCITY = 400;
const DISMISS_FRACTION = 0.25;
const RUBBER_BAND_LIMIT = spacing.xxl;
const ACTIVATE_OFFSET = spacing.xs;

export type SheetProps = {
  visible: boolean;
  /** Called after a user-initiated dismiss finished animating. Set `visible` to false here. */
  onClose: () => void;
  /** Called after any exit animation, right before unmount. */
  onClosed?: () => void;
  children?: ReactNode;
  title?: string;
  /** Allow drag / scrim / back-button dismissal. Default `true`. */
  dismissible?: boolean;
  /** Max height as a fraction of the window. Default 0.9. */
  maxHeight?: number;
  /** Wrap children in a ScrollView (drag then works from the handle/title only). */
  scrollable?: boolean;
  /** Where dragging starts: whole sheet or only the handle/title area. Default `sheet`. */
  dragArea?: 'sheet' | 'handle';
  /** Sticky bottom area (chat input, CTA row). */
  footer?: ReactNode;
  /** Move with the keyboard (iOS KeyboardAvoidingView). Default `true`. */
  keyboard?: boolean;
  /** Panel background. Default `surface`. */
  background?: 'surface' | 'background';
  contentStyle?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export function Sheet(props: SheetProps) {
  const [mounted, setMounted] = useState(props.visible);
  if (props.visible && !mounted) setMounted(true);
  if (!mounted) return null;

  const handleExited = () => {
    setMounted(false);
    props.onClosed?.();
  };
  return <SheetPanel {...props} onExited={handleExited} />;
}

function rubberBand(distance: number): number {
  'worklet';
  return RUBBER_BAND_LIMIT * (1 - Math.exp(-distance / RUBBER_BAND_LIMIT));
}

function SheetPanel({
  visible,
  onClose,
  onExited,
  children,
  title,
  dismissible = true,
  maxHeight = 0.9,
  scrollable = false,
  dragArea = 'sheet',
  footer,
  keyboard = true,
  background = 'surface',
  contentStyle,
  accessibilityLabel,
}: SheetProps & { onExited: () => void }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReduceMotion();
  const { height: windowHeight } = useWindowDimensions();
  const translateY = useSharedValue(windowHeight);
  const sheetHeight = useSharedValue(windowHeight);
  const closingByUser = useSharedValue(false);
  const [measured, setMeasured] = useState(false);

  const enterConfig = { duration: reduceMotion ? duration.fast : duration.sheet, easing: easing.sheet };
  const exitConfig = { duration: reduceMotion ? duration.fast : duration.slow, easing: easing.sheet };

  const finishUserDismiss = () => {
    onClose();
    onExited();
  };

  const animateIn = () => {
    closingByUser.set(false);
    translateY.set(withTiming(0, enterConfig));
  };

  const animateOut = (byUser: boolean) => {
    if (byUser) closingByUser.set(true);
    translateY.set(
      withTiming(sheetHeight.get(), exitConfig, (finished) => {
        if (finished) scheduleOnRN(byUser ? finishUserDismiss : onExited);
      }),
    );
  };

  const requestDismiss = () => {
    if (dismissible && !closingByUser.get()) animateOut(true);
  };

  const onVisibilityChange = useEffectEvent((isVisible: boolean) => {
    if (isVisible) {
      if (measured) animateIn();
    } else if (!closingByUser.get()) {
      animateOut(false);
    }
  });

  useEffect(() => {
    onVisibilityChange(visible);
  }, [visible]);

  const onLayout = (event: LayoutChangeEvent) => {
    const height = event.nativeEvent.layout.height;
    sheetHeight.set(height);
    if (measured) return;
    setMeasured(true);
    if (visible) {
      translateY.set(withSequence(withTiming(height, { duration: 0 }), withTiming(0, enterConfig)));
    }
  };

  const pan = Gesture.Pan()
    .enabled(dismissible)
    .activeOffsetY([-ACTIVATE_OFFSET, ACTIVATE_OFFSET])
    .onUpdate((event) => {
      const dy = event.translationY;
      translateY.set(dy >= 0 ? dy : -rubberBand(-dy));
    })
    .onEnd((event) => {
      const height = sheetHeight.get();
      if (event.velocityY > DISMISS_VELOCITY || translateY.get() > height * DISMISS_FRACTION) {
        closingByUser.set(true);
        translateY.set(
          withTiming(height, exitConfig, (finished) => {
            if (finished) scheduleOnRN(finishUserDismiss);
          }),
        );
      } else {
        translateY.set(withSpring(0, spring.sheetRelease));
      }
    });

  const scrimStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.get(), [0, sheetHeight.get()], [1, 0], Extrapolation.CLAMP),
  }));
  const panelStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.get() }] }));

  const panelColor = theme.colors[background];
  const dragWholeSheet = dragArea === 'sheet' && !scrollable;

  const header = (
    <View style={styles.header}>
      <View style={[styles.grabber, { backgroundColor: theme.colors.border }]} />
      {title ? (
        <Text variant="titleLg" align="center" accessibilityRole="header" style={styles.title}>
          {title}
        </Text>
      ) : null}
    </View>
  );

  const panel = (
    <Animated.View
      onLayout={onLayout}
      accessibilityViewIsModal
      accessibilityLabel={accessibilityLabel ?? title}
      style={[
        styles.panel,
        {
          backgroundColor: panelColor,
          maxHeight: windowHeight * maxHeight - insets.top,
          paddingBottom: insets.bottom + spacing.lg,
        },
        panelStyle,
      ]}>
      <View style={[styles.overdraw, { backgroundColor: panelColor }]} />
      {dragWholeSheet ? header : <GestureDetector gesture={pan}>{header}</GestureDetector>}
      {scrollable ? (
        <ScrollView
          style={styles.shrink}
          contentContainerStyle={contentStyle}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.shrink, contentStyle]}>{children}</View>
      )}
      {footer}
    </Animated.View>
  );

  return (
    <Modal
      visible
      transparent
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={requestDismiss}>
      <GestureHandlerRootView style={styles.flex}>
        <KeyboardAvoidingView
          style={[styles.flex, styles.end]}
          enabled={keyboard && isIOS}
          behavior={isIOS ? 'padding' : undefined}>
          <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.scrim }, scrimStyle]}>
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={requestDismiss}
              accessibilityRole="button"
              accessibilityLabel="Chiudi"
              disabled={!dismissible}
            />
          </Animated.View>
          {dragWholeSheet ? <GestureDetector gesture={pan}>{panel}</GestureDetector> : panel}
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  end: { justifyContent: 'flex-end' },
  panel: {
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingHorizontal: layout.screenX,
    boxShadow: elevation.xl,
  },
  overdraw: { position: 'absolute', left: 0, right: 0, top: '100%', height: RUBBER_BAND_LIMIT * 2 },
  header: { alignItems: 'center', paddingTop: spacing.xs, paddingBottom: spacing.md, gap: spacing.md },
  grabber: { width: grabber.width, height: grabber.height, borderRadius: radius.pill },
  title: { paddingHorizontal: spacing.xs },
  shrink: { flexShrink: 1 },
});
