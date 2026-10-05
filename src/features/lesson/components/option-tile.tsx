/**
 * OptionTile — the graded answer tile of the lesson player (the kit's ChoiceRow has no
 * correct/wrong states on purpose). States:
 *   idle · selected (brand tint + border + radio dot) · correct (success tint + check, small pop)
 *   · wrong (danger tint + ✕, shakes) · disabled (eliminated after a wrong try: faded, struck
 *   through, not pressable) · matched (a locked match pair).
 * Colours glide with Reanimated CSS transitions; motion respects reduced motion (kit hooks).
 */
import { useEffect, useRef, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { type CSSTransitionProperties } from 'react-native-reanimated';
import { Check, X } from 'lucide-react-native';

import {
  AnimatedText,
  PressableScale,
  borderWidth,
  controlHeight,
  iconSize,
  iconStroke,
  uiOpacity,
  useBump,
  useShake,
} from '@/components/ui';
import { duration, radius, spacing, useTheme, type Theme, type TextVariant } from '@/theme';

import { lessonMetrics } from '../metrics';

export type OptionStatus = 'idle' | 'selected' | 'correct' | 'wrong' | 'disabled' | 'matched';

export type OptionTileProps = {
  label: string;
  status: OptionStatus;
  onPress?: () => void;
  /** Not pressable, without the faded look (feedback phases, locked pairs). */
  locked?: boolean;
  /** Leading node (true/false icon disc). */
  leading?: ReactNode;
  /** `block` (full-width option, default) or `pill` (fill-in-the-blank chips, word bank). */
  shape?: 'block' | 'pill';
  /** Increment to shake the tile (wrong answer / wrong pair). */
  shakeSignal?: number;
  labelVariant?: TextVariant;
  /** Show the trailing status disc. Default: `block` tiles only. */
  indicator?: boolean;
  /** Accessibility role. Default `radio`. */
  role?: 'radio' | 'button';
  accessibilityHint?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  /** Styles the inner face (e.g. `flex: 1` to fill a row). */
  faceStyle?: StyleProp<ViewStyle>;
};

type Face = { bg: string; border: string; label: string };

function faceColors(theme: Theme, status: OptionStatus): Face {
  const c = theme.colors;
  switch (status) {
    case 'idle':
      return { bg: c.surface, border: c.border, label: c.text };
    case 'selected':
      return { bg: c.brandBg, border: c.brandSolid, label: c.brandText };
    case 'correct':
      return { bg: c.successBg, border: c.successSolid, label: c.successText };
    case 'wrong':
      return { bg: c.dangerBg, border: c.dangerSolid, label: c.dangerText };
    case 'matched':
      return { bg: c.successBg, border: c.successBorder, label: c.successText };
    case 'disabled':
      return { bg: c.surfaceRaised, border: c.borderSubtle, label: c.textTertiary };
  }
}

const STATUS_A11Y: Partial<Record<OptionStatus, string>> = {
  correct: 'risposta corretta',
  wrong: 'risposta errata',
  disabled: 'esclusa',
  matched: 'abbinata',
};

export function OptionTile({
  label,
  status,
  onPress,
  locked = false,
  leading,
  shape = 'block',
  shakeSignal = 0,
  labelVariant,
  indicator,
  role = 'radio',
  accessibilityHint,
  testID,
  style,
  faceStyle,
}: OptionTileProps) {
  const theme = useTheme();
  const colors = faceColors(theme, status);
  const { style: shakeStyle, shake } = useShake();
  const { style: bumpStyle, bump } = useBump(lessonMetrics.correctPopScale);
  const showIndicator = indicator ?? shape === 'block';
  const interactive = !locked && status !== 'disabled' && status !== 'matched' && onPress !== undefined;

  // Shake when the signal grows (never on mount, never when it is reset to 0).
  const lastShake = useRef(shakeSignal);
  useEffect(() => {
    const grew = shakeSignal > lastShake.current;
    lastShake.current = shakeSignal;
    if (grew) shake();
  }, [shakeSignal, shake]);

  // Small pop when the tile turns correct / matched.
  const lastStatus = useRef(status);
  useEffect(() => {
    const before = lastStatus.current;
    lastStatus.current = status;
    const solved = (s: OptionStatus) => s === 'correct' || s === 'matched';
    if (solved(status) && !solved(before)) bump();
  }, [status, bump]);

  const variant: TextVariant = labelVariant ?? (shape === 'pill' ? 'labelLg' : 'bodyLg');
  // Leading glyph without a status disc (true / false): centre glyph + label as one group.
  const centeredGroup = leading !== undefined && !showIndicator;
  const statusLabel = STATUS_A11Y[status];

  return (
    <Animated.View style={[shakeStyle, style]}>
      <Animated.View style={[bumpStyle, styles.flexFill]}>
        <PressableScale
          onPress={interactive ? onPress : undefined}
          disabled={!interactive}
          scaleTo={shape === 'pill' ? 'small' : 'large'}
          haptic="selection"
          accessibilityRole={role}
          accessibilityState={{ selected: status === 'selected', checked: role === 'radio' ? status === 'selected' : undefined }}
          accessibilityLabel={statusLabel ? `${label}, ${statusLabel}` : label}
          accessibilityHint={accessibilityHint}
          testID={testID}
          style={styles.flexFill}>
          <Animated.View
            style={[
              shape === 'pill' ? styles.pill : styles.block,
              colorTransition,
              { backgroundColor: colors.bg, borderColor: colors.border },
              status === 'disabled' && styles.faded,
              centeredGroup && styles.centered,
              faceStyle,
            ]}>
            {leading}
            {showIndicator && !leading ? <View style={styles.indicatorSpacer} /> : null}
            <AnimatedText
              variant={variant}
              align={leading ? 'left' : 'center'}
              weight={status === 'idle' || status === 'disabled' ? undefined : 'bold'}
              style={[
                shape === 'pill' || centeredGroup ? styles.pillLabel : styles.label,
                labelTransition,
                { color: colors.label },
                status === 'disabled' && styles.struck,
              ]}>
              {label}
            </AnimatedText>
            {showIndicator ? <StatusDisc status={status} theme={theme} /> : null}
          </Animated.View>
        </PressableScale>
      </Animated.View>
    </Animated.View>
  );
}

/** Trailing indicator: radio dot when selected, ✓ / ✕ disc after grading. */
function StatusDisc({ status, theme }: { status: OptionStatus; theme: Theme }) {
  const c = theme.colors;
  const size = lessonMetrics.statusDisc;
  if (status === 'selected') {
    return (
      <View style={[styles.disc, styles.ring, { width: size, height: size, borderColor: c.brandSolid }]}>
        <View style={[styles.dot, { backgroundColor: c.brandSolid }]} />
      </View>
    );
  }
  if (status === 'correct' || status === 'matched' || status === 'wrong') {
    const Glyph = status === 'wrong' ? X : Check;
    const bg = status === 'wrong' ? c.dangerSolid : c.successSolid;
    return (
      <View style={[styles.disc, { width: size, height: size, backgroundColor: bg }]}>
        <Glyph size={iconSize.sm} color={c.onBrand} strokeWidth={iconStroke.heavy} />
      </View>
    );
  }
  return <View style={{ width: size, height: size }} />;
}

const colorTransition: CSSTransitionProperties<ViewStyle> = {
  transitionProperty: ['backgroundColor', 'borderColor', 'opacity'],
  transitionDuration: duration.fast,
  transitionTimingFunction: 'ease',
};

const labelTransition = {
  transitionProperty: 'color',
  transitionDuration: duration.fast,
  transitionTimingFunction: 'ease',
} as const;

const styles = StyleSheet.create({
  flexFill: { flexGrow: 1 },
  block: {
    flexGrow: 1,
    minHeight: lessonMetrics.optionMinHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: borderWidth.regular,
  },
  pill: {
    minHeight: controlHeight.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: borderWidth.regular,
  },
  label: { flex: 1, userSelect: 'none' },
  pillLabel: { flexShrink: 1, userSelect: 'none' },
  faded: { opacity: uiOpacity.disabled },
  centered: { justifyContent: 'center' },
  struck: { textDecorationLine: 'line-through' },
  indicatorSpacer: { width: lessonMetrics.statusDisc },
  disc: { borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  ring: { borderWidth: borderWidth.thick },
  dot: { width: spacing.xs + spacing.xxxs, height: spacing.xs + spacing.xxxs, borderRadius: radius.pill },
});
