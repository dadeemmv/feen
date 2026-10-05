/**
 * FloatingTabBar — custom `tabBar` for `Tabs` from 'expo-router/js-tabs' (bluesky BottomBar
 * pattern). A white floating pill; the active tab sits on a lime pill that slides between slots
 * (spring.snappy) while the slot widens and reveals its label (Home · Academy · Coach · Shop).
 *
 *   <Tabs tabBar={(props) => <FloatingTabBar {...props} />} screenOptions={{ headerShown: false }}>
 *
 * It floats (absolute) over the screens: tab screens pad their content with `useTabBarInset()`
 * (`<Screen withTabBar>` does it). Honours `href: null` routes (hidden), `tabBarBadge`,
 * `tabBarAccessibilityLabel`, `tabBarButtonTestID`, `tabBarStyle: { display: 'none' }` and
 * `tabBarHideOnKeyboard` (default on Android).
 */
import { useEffect, useState } from 'react';
import { Keyboard, StyleSheet, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import type { BottomTabBarProps } from 'expo-router/js-tabs';

import { hairline } from '@/components/ui/metrics';
import { Text } from '@/components/ui/text';
import { useReduceMotion } from '@/components/ui/use-reduce-motion';
import { isAndroid } from '@/lib/platform';
import { duration, easing, elevation, layout, radius, spacing, spring, useTheme } from '@/theme';

import { getTabConfig } from './tab-config';
import { TAB_ICON_SIZE, TAB_LABEL_GAP, TabBarItem, type TabGeometry } from './tab-bar-item';
import { getTabBarBottomOffset } from './use-tab-bar-inset';

/** Inner padding of the bar around the pill. */
const BAR_PAD = spacing.xs;
/** Horizontal padding inside the active pill. */
const PILL_PAD_X = spacing.md;
/** The active slot never takes more than this share of the bar. */
const MAX_ACTIVE_SHARE = 0.46;
/** Active slot share used until the labels have been measured. */
const FALLBACK_ACTIVE_SHARE = 0.4;

function useKeyboardVisible(enabled: boolean): boolean {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    const show = Keyboard.addListener('keyboardDidShow', () => setVisible(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, [enabled]);
  return enabled && visible;
}

/** `href: null` routes and `tabBarStyle: { display: 'none' }` (plain or animated styles). */
function isDisplayNone(style: unknown): boolean {
  return StyleSheet.flatten(style as StyleProp<ViewStyle>)?.display === 'none';
}

function computeGeometry(barWidth: number, count: number, maxLabel: number): TabGeometry {
  const inner = Math.max(0, barWidth - (BAR_PAD + hairline) * 2);
  if (count <= 1) return { activeWidth: inner, inactiveWidth: inner, count };
  const wanted = maxLabel > 0 ? TAB_ICON_SIZE + TAB_LABEL_GAP + maxLabel + PILL_PAD_X * 2 : inner * FALLBACK_ACTIVE_SHARE;
  const activeWidth = Math.min(Math.max(wanted, inner / count), inner * MAX_ACTIVE_SHARE);
  return { activeWidth, inactiveWidth: (inner - activeWidth) / (count - 1), count };
}

export function FloatingTabBar({ state, descriptors, navigation, insets }: BottomTabBarProps) {
  const theme = useTheme();
  const reduceMotion = useReduceMotion();
  const [barWidth, setBarWidth] = useState(0);
  const [labelWidths, setLabelWidths] = useState<Record<string, number>>({});

  const focusedKey = state.routes[state.index]?.key;
  const focusedOptions = focusedKey ? descriptors[focusedKey]?.options : undefined;
  const routes = state.routes.filter((route) => !isDisplayNone(descriptors[route.key]?.options.tabBarItemStyle));
  const activeIndex = Math.max(0, routes.findIndex((route) => route.key === focusedKey));

  const keyboardVisible = useKeyboardVisible(focusedOptions?.tabBarHideOnKeyboard ?? isAndroid);
  const barHidden = isDisplayNone(focusedOptions?.tabBarStyle) || keyboardVisible;

  const position = useSharedValue(activeIndex);
  const hideProgress = useSharedValue(barHidden ? 1 : 0);

  useEffect(() => {
    position.set(reduceMotion ? activeIndex : withSpring(activeIndex, spring.snappy));
  }, [activeIndex, reduceMotion, position]);

  useEffect(() => {
    hideProgress.set(withTiming(barHidden ? 1 : 0, { duration: duration.base, easing: easing.standard }));
  }, [barHidden, hideProgress]);

  const bottom = getTabBarBottomOffset(insets.bottom);
  const hideDistance = bottom + layout.tabBarHeight + spacing.md;
  const labels = routes.map((route) => {
    const options = descriptors[route.key]?.options;
    const config = getTabConfig(route.name, options?.title);
    const label = typeof options?.tabBarLabel === 'string' ? options.tabBarLabel : config.label;
    return { route, options, config, label };
  });
  const maxLabel = Math.max(0, ...labels.map(({ route }) => labelWidths[route.key] ?? 0));
  const measured = labels.every(({ route }) => labelWidths[route.key] !== undefined);
  const geometry = computeGeometry(barWidth, routes.length, measured ? maxLabel : 0);
  const labelMaxWidth = Math.max(0, geometry.activeWidth - TAB_ICON_SIZE - TAB_LABEL_GAP - PILL_PAD_X * 2);

  const pillStyle = useAnimatedStyle(() => {
    const clamped = Math.min(geometry.count - 1, Math.max(0, position.get()));
    return { transform: [{ translateX: clamped * geometry.inactiveWidth }] };
  });
  const hostStyle = useAnimatedStyle(() => ({
    opacity: 1 - hideProgress.get(),
    transform: [{ translateY: hideProgress.get() * hideDistance }],
  }));

  const onBarLayout = (event: LayoutChangeEvent) => setBarWidth(event.nativeEvent.layout.width);
  const onLabelLayout = (key: string) => (event: LayoutChangeEvent) => {
    const width = Math.ceil(event.nativeEvent.layout.width);
    setLabelWidths((current) => (current[key] === width ? current : { ...current, [key]: width }));
  };

  return (
    <Animated.View style={[styles.host, { bottom }, barHidden ? styles.noTouch : styles.passThrough, hostStyle]}>
      <View
        onLayout={onBarLayout}
        accessibilityRole="tablist"
        style={[styles.bar, { backgroundColor: theme.colors.surface, borderColor: theme.colors.borderSubtle }]}>
        {/* Off-screen measuring pass: natural label widths size the active pill. */}
        <View style={styles.measure} aria-hidden importantForAccessibility="no-hide-descendants">
          {labels.map(({ route, label }) => (
            <Text key={route.key} variant="labelMd" numberOfLines={1} onLayout={onLabelLayout(route.key)}>
              {label}
            </Text>
          ))}
        </View>

        {barWidth > 0 ? (
          <Animated.View
            style={[
              styles.pill,
              { width: geometry.activeWidth, backgroundColor: theme.colors.accentSolid },
              pillStyle,
            ]}
          />
        ) : null}

        {barWidth > 0
          ? labels.map(({ route, options, config, label }, index) => {
              const focused = route.key === focusedKey;
              const onPress = () => {
                const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
              };
              const onLongPress = () => navigation.emit({ type: 'tabLongPress', target: route.key });
              return (
                <TabBarItem
                  key={route.key}
                  index={index}
                  position={position}
                  geometry={geometry}
                  labelWidth={labelWidths[route.key] ?? 0}
                  labelMaxWidth={labelMaxWidth}
                  icon={config.icon}
                  label={label}
                  focused={focused}
                  badge={options?.tabBarBadge}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  accessibilityLabel={options?.tabBarAccessibilityLabel ?? config.accessibilityLabel}
                  testID={options?.tabBarButtonTestID}
                />
              );
            })
          : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: layout.tabBarSideInset,
  },
  bar: {
    width: '100%',
    maxWidth: layout.maxContentWidth - layout.tabBarSideInset * 2,
    height: layout.tabBarHeight,
    flexDirection: 'row',
    padding: BAR_PAD,
    borderRadius: radius.pill,
    borderWidth: hairline,
    boxShadow: elevation.lg,
  },
  pill: {
    position: 'absolute',
    top: BAR_PAD,
    bottom: BAR_PAD,
    left: BAR_PAD,
    borderRadius: radius.pill,
  },
  measure: { position: 'absolute', top: 0, left: 0, opacity: 0, alignItems: 'flex-start', pointerEvents: 'none' },
  noTouch: { pointerEvents: 'none' },
  passThrough: { pointerEvents: 'box-none' },
});
