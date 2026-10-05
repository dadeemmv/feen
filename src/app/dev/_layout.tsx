/** QA routes (/dev, /dev/ui, /dev/icons, /dev/illustrations): development builds only. */
import { Redirect, Stack } from 'expo-router';

import { useTheme } from '@/theme';

export default function DevLayout() {
  const { colors } = useTheme();
  if (!__DEV__) return <Redirect href="/" />;
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />;
}
