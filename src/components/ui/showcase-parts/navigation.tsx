/**
 * Showcase: StatusHeader variants and a FloatingTabBar driven by a mocked navigator, so the pill
 * slide + label reveal can be reviewed without a real Tabs layout.
 */
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Flag, Share, X } from 'lucide-react-native';
import type { BottomTabBarProps } from 'expo-router/js-tabs';

import { FloatingTabBar } from '@/components/navigation/floating-tab-bar';
import { StatusHeader } from '@/components/navigation/status-header';
import { getTabBarBottomOffset } from '@/components/navigation/use-tab-bar-inset';
import { layout, radius, useTheme } from '@/theme';

import { Card } from '../card';
import { IconButton } from '../icon-button';
import { ShowcaseSection } from './section';

const ROUTES = ['index', 'academy', 'assistant', 'shop'].map((name) => ({ key: `${name}-demo`, name }));
const NO_INSETS = { top: 0, right: 0, bottom: 0, left: 0 };
const DEMO_HEIGHT = layout.tabBarHeight + getTabBarBottomOffset(0) * 2;

/** Minimal stand-in for the navigator props: enough for FloatingTabBar's reads and calls. */
function useMockTabBarProps(): BottomTabBarProps {
  const [index, setIndex] = useState(0);
  const mock = {
    state: { index, routes: ROUTES, key: 'tabs-demo', routeNames: ROUTES.map((r) => r.name), type: 'tab', stale: false },
    descriptors: Object.fromEntries(
      ROUTES.map((route) => [route.key, { route, options: route.name === 'shop' ? { tabBarBadge: 1 } : {} }]),
    ),
    navigation: {
      emit: () => ({ defaultPrevented: false }),
      navigate: (name: string) => setIndex(Math.max(0, ROUTES.findIndex((route) => route.name === name))),
    },
    insets: NO_INSETS,
  };
  return mock as unknown as BottomTabBarProps;
}

export function NavigationShowcase() {
  const theme = useTheme();
  const tabBarProps = useMockTabBarProps();
  const [lives, setLives] = useState(3);

  return (
    <ShowcaseSection title="StatusHeader · FloatingTabBar" note="Presentational: values and handlers come from the shell.">
      <View style={[styles.frame, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
        <StatusHeader streak={0} lives={lives} coins={0} avatarEmoji="🤠" onLivesPress={() => setLives((v) => (v > 0 ? v - 1 : 3))} />
        <StatusHeader streak={12} lives={3} coins={1250} unlimited onBack={() => {}} showAvatar={false} />
        <StatusHeader
          stats={['lives', 'coins']}
          lives={1}
          coins={40}
          showAvatar={false}
          left={
            <>
              <IconButton icon={X} variant="plain" accessibilityLabel="Chiudi lezione" onPress={() => {}} />
              <IconButton icon={Flag} variant="plain" accessibilityLabel="Segnala" onPress={() => {}} />
              <IconButton icon={Share} variant="plain" accessibilityLabel="Condividi" onPress={() => {}} />
            </>
          }
        />
      </View>
      <Card variant="brand" padding="none">
        <StatusHeader streak={5} lives={2} coins={300} avatarEmoji="🦊" />
      </Card>
      <View style={[styles.tabDemo, { backgroundColor: theme.colors.surfaceSunken }]}>
        <FloatingTabBar {...tabBarProps} />
      </View>
    </ShowcaseSection>
  );
}

const styles = StyleSheet.create({
  frame: { borderRadius: radius.xl, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' },
  tabDemo: { height: DEMO_HEIGHT, borderRadius: radius.xl, overflow: 'hidden' },
});
