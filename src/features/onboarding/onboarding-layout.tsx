/**
 * First-run flow navigator: a header-less stack, one route per step, so iOS swipe-back, Android
 * back and the browser history all walk back through the answers.
 */
import { Stack } from 'expo-router';

import { useReduceMotion } from '@/components/ui';
import { useTheme } from '@/theme';

export function OnboardingLayout() {
  const { colors } = useTheme();
  const reduceMotion = useReduceMotion();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: reduceMotion ? 'fade' : 'slide_from_right',
      }}>
      <Stack.Screen name="index" options={{ animation: 'fade' }} />
      <Stack.Screen name="name" />
      <Stack.Screen name="interests" />
      <Stack.Screen name="level" />
      <Stack.Screen name="pace" />
      <Stack.Screen name="ready" options={{ animation: 'fade' }} />
    </Stack>
  );
}
