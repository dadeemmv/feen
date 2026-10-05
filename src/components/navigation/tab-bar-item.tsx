/**
 * One slot of the FloatingTabBar. Its width, icon colour and label reveal are all driven by the
 * bar's animated `position` (a float index), so the lime pill, the growing slot and the label
 * move as one gesture on the UI thread.
 */
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';
import type { LucideIcon } from 'lucide-react-native';

import { Badge } from '@/components/ui/badge';
import { iconSize, iconStroke } from '@/components/ui/metrics';
import { PressableScale } from '@/components/ui/pressable-scale';
import { AnimatedText } from '@/components/ui/text';
import { spacing, useTheme } from '@/theme';

/** Space between icon and revealed label. */
export const TAB_LABEL_GAP = spacing.xs - spacing.xxxs;
export const TAB_ICON_SIZE = iconSize.lg;

export type TabGeometry = { activeWidth: number; inactiveWidth: number; count: number };

export type TabBarItemProps = {
  index: number;
  position: SharedValue<number>;
  geometry: TabGeometry;
  /** Natural width of this label (0 until measured). */
  labelWidth: number;
  /** Max label width that fits the active slot. */
  labelMaxWidth: number;
  icon: LucideIcon;
  label: string;
  focused: boolean;
  badge?: number | string;
  onPress: () => void;
  onLongPress: () => void;
  accessibilityLabel: string;
  testID?: string;
};

/** 1 for the active slot, fading to 0 one slot away. */
function reveal(index: number, position: number, count: number): number {
  'worklet';
  const clamped = Math.min(count - 1, Math.max(0, position));
  return Math.max(0, 1 - Math.abs(index - clamped));
}

export function TabBarItem({
  index,
  position,
  geometry,
  labelWidth,
  labelMaxWidth,
  icon: IconComponent,
  label,
  focused,
  badge,
  onPress,
  onLongPress,
  accessibilityLabel,
  testID,
}: TabBarItemProps) {
  const theme = useTheme();
  const { activeWidth, inactiveWidth, count } = geometry;
  const visibleLabel = Math.min(labelWidth, labelMaxWidth);

  const slotStyle = useAnimatedStyle(() => {
    const t = reveal(index, position.get(), count);
    return { width: inactiveWidth + (activeWidth - inactiveWidth) * t };
  });
  const labelStyle = useAnimatedStyle(() => {
    const t = reveal(index, position.get(), count);
    return { width: visibleLabel * t, marginLeft: TAB_LABEL_GAP * t, opacity: t * t };
  });
  const activeIconStyle = useAnimatedStyle(() => ({ opacity: reveal(index, position.get(), count) }));
  const restingIconStyle = useAnimatedStyle(() => ({ opacity: 1 - reveal(index, position.get(), count) }));

  const glyph = { size: TAB_ICON_SIZE, strokeWidth: iconStroke.regular } as const;

  return (
    <Animated.View style={[styles.slot, slotStyle]}>
      <PressableScale
        onPress={onPress}
        onLongPress={onLongPress}
        scaleTo="small"
        haptic="selection"
        accessibilityRole="tab"
        accessibilityState={{ selected: focused }}
        accessibilityLabel={accessibilityLabel}
        testID={testID}
        style={styles.pressable}>
        <View style={styles.icon}>
          <Animated.View style={[StyleSheet.absoluteFill, styles.center, restingIconStyle]}>
            <IconComponent {...glyph} color={theme.colors.textSecondary} />
          </Animated.View>
          <Animated.View style={[StyleSheet.absoluteFill, styles.center, activeIconStyle]}>
            <IconComponent {...glyph} color={theme.colors.onAccent} strokeWidth={iconStroke.bold} />
          </Animated.View>
          {badge !== undefined ? (
            <View style={styles.badge}>
              <Badge count={typeof badge === 'number' ? badge : undefined} size="sm" />
            </View>
          ) : null}
        </View>
        <Animated.View style={[styles.labelClip, labelStyle]}>
          <AnimatedText variant="labelMd" color="onAccent" numberOfLines={1} style={{ width: visibleLabel }}>
            {label}
          </AnimatedText>
        </Animated.View>
      </PressableScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  slot: { height: '100%' },
  pressable: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  icon: { width: TAB_ICON_SIZE, height: TAB_ICON_SIZE },
  center: { alignItems: 'center', justifyContent: 'center' },
  labelClip: { overflow: 'hidden' },
  badge: { position: 'absolute', top: -spacing.xxs, right: -spacing.xxs },
});
