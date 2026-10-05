/**
 * Screen — every route's root (Ignite `Screen` presets). Handles background tone, safe areas,
 * floating tab-bar clearance, keyboard avoidance (iOS), a sticky header/footer and — on web or
 * tablets — a centred phone-width column (`layout.maxContentWidth`).
 */
import type { ReactNode, Ref } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  View,
  type ScrollView,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, { type AnimatedScrollViewProps } from 'react-native-reanimated';
import { useSafeAreaInsets, type Edge } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { useTabBarInset } from '@/components/navigation/use-tab-bar-inset';
import { isIOS } from '@/lib/platform';
import { ColorModeProvider, layout, spacing, themes, useTheme } from '@/theme';

export type ScreenBackground = 'background' | 'surface' | 'brand';

export type ScreenProps = {
  children?: ReactNode;
  /** `scroll` wraps content in an Animated.ScrollView. Default `scroll`. */
  preset?: 'fixed' | 'scroll';
  /** Safe-area edges applied as padding. Default `['top']` (tab bar / footer handle the bottom). */
  edges?: Edge[];
  /** Default `background`. `brand` switches the subtree to brand tokens. */
  background?: ScreenBackground;
  /** Pad the bottom so content clears the floating tab bar (tab screens). */
  withTabBar?: boolean;
  /** Sticky node above the content (not padded; e.g. StatusHeader). */
  header?: ReactNode;
  /** Sticky node pinned to the bottom (padded + safe area; e.g. a CTA). */
  footer?: ReactNode;
  /** Horizontal screen gutter (`layout.screenX`) on content and footer. Default `true`. */
  padded?: boolean;
  /** KeyboardAvoidingView (iOS padding). Default `false`. */
  keyboard?: boolean;
  /** Renders an expo-status-bar with this style. Omit to keep the current one. */
  statusBar?: 'light' | 'dark';
  /** Scroll preset: styles the content container. Fixed preset: styles the content view. */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /** Extra Animated.ScrollView props (onScroll handler, refreshControl, scrollEventThrottle…). */
  scrollProps?: Omit<AnimatedScrollViewProps, 'children' | 'contentContainerStyle' | 'ref'>;
  scrollRef?: Ref<Animated.ScrollView & ScrollView>;
  style?: StyleProp<ViewStyle>;
};

export function Screen(props: ScreenProps) {
  const { background = 'background' } = props;
  if (background === 'brand') {
    return (
      <ColorModeProvider mode="brand">
        <ScreenBody {...props} />
      </ColorModeProvider>
    );
  }
  return <ScreenBody {...props} />;
}

function ScreenBody({
  children,
  preset = 'scroll',
  edges = ['top'],
  background = 'background',
  withTabBar = false,
  header,
  footer,
  padded = true,
  keyboard = false,
  statusBar,
  contentContainerStyle,
  scrollProps,
  scrollRef,
  style,
}: ScreenProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const tabBarInset = useTabBarInset();
  const backgroundColor =
    background === 'brand' ? themes.brand.colors.background : theme.colors[background];

  const has = (edge: Edge) => edges.includes(edge);
  const gutter = padded ? styles.gutter : undefined;
  const bottomSafe = has('bottom') ? insets.bottom : 0;
  const contentBottom = footer
    ? spacing.md
    : withTabBar
      ? tabBarInset
      : bottomSafe + (preset === 'scroll' ? spacing.xl : 0);
  const footerBottom = withTabBar ? tabBarInset : Math.max(insets.bottom, spacing.md);

  const body =
    preset === 'scroll' ? (
      <Animated.ScrollView
        ref={scrollRef}
        style={styles.flex}
        contentContainerStyle={[styles.column, gutter, { paddingBottom: contentBottom }, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={isIOS ? 'interactive' : 'on-drag'}
        contentInsetAdjustmentBehavior="never"
        {...scrollProps}>
        {children}
      </Animated.ScrollView>
    ) : (
      <View style={[styles.flex, styles.column, gutter, { paddingBottom: contentBottom }, contentContainerStyle]}>
        {children}
      </View>
    );

  return (
    <View style={[styles.flex, { backgroundColor }, style]}>
      {statusBar ? <StatusBar style={statusBar} /> : null}
      <KeyboardAvoidingView
        style={styles.flex}
        enabled={keyboard && isIOS}
        behavior={isIOS ? 'padding' : undefined}>
        <View
          style={[
            styles.flex,
            {
              paddingTop: has('top') ? insets.top : 0,
              paddingLeft: has('left') ? insets.left : 0,
              paddingRight: has('right') ? insets.right : 0,
            },
          ]}>
          {header ? <View style={styles.column}>{header}</View> : null}
          {body}
          {footer ? (
            <View style={[styles.column, gutter, styles.footer, { paddingBottom: footerBottom }]}>{footer}</View>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  column: { width: '100%', maxWidth: layout.maxContentWidth, alignSelf: 'center' },
  gutter: { paddingHorizontal: layout.screenX },
  footer: { paddingTop: spacing.sm },
});
