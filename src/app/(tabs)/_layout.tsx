/**
 * Tab navigator (Home · Academy · Coach · Shop) with the custom floating pill bar.
 * Also the onboarding gate: until the first-run flow is done every tab redirects to it
 * (the root layout only renders after the store has hydrated, so the flag is final here).
 */
import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';

import { FloatingTabBar } from '@/components/navigation';
import { useReduceMotion } from '@/components/ui';
import { useStore } from '@/store';
import { useTheme } from '@/theme';

export default function TabsLayout() {
  const onboardingDone = useStore((s) => s.onboardingDone);
  const reduceMotion = useReduceMotion();
  const { colors } = useTheme();

  if (!onboardingDone) return <Redirect href="/onboarding" />;

  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        lazy: true,
        freezeOnBlur: true,
        animation: reduceMotion ? 'none' : 'fade',
        sceneStyle: { backgroundColor: colors.background },
      }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="academy" />
      <Tabs.Screen name="assistant" />
      <Tabs.Screen name="shop" />
    </Tabs>
  );
}
