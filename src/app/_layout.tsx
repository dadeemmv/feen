/**
 * Root layout (Ignite root-layout pattern): keeps the splash up until the fonts are loaded AND the
 * persisted store has hydrated, then mounts the providers, the root stack and the global overlays.
 *
 * Tabs live in `(tabs)`; detail screens are pushed on this stack above the tab bar; the lesson and
 * story players are full-screen modals (docs/ARCHITECTURE.md §3).
 */
import { useEffect, type ReactNode } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DefaultTheme, Stack, ThemeProvider, type Theme as NavigationTheme } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { GlobalOverlays } from '@/components/navigation/global-overlays';
import { hairline, setReduceMotionOverride, ToastHost } from '@/components/ui';
import { setHapticsEnabled } from '@/lib/haptics';
import { isWeb } from '@/lib/platform';
import { useStore } from '@/store';
import { useHasHydrated, useSyncTimeBasedState } from '@/store/hooks';
import { customFontsToLoad, duration, layout, lightTheme } from '@/theme';

void SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ duration: duration.slower, fade: true });

export const unstable_settings = { anchor: '(tabs)' };

const colors = lightTheme.colors;

/** React Navigation theme on the Finanz canvas (no white flashes between screens). */
const navigationTheme: NavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.brandSolid,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.borderSubtle,
    notification: colors.dangerSolid,
  },
};

/** Mirrors the persisted "Vibrazione" / "Riduci animazioni" settings into the kit. */
function useSettingsBridge() {
  const hapticsOn = useStore((s) => s.settings.haptics);
  const reduceMotion = useStore((s) => s.settings.reduceMotion);
  useEffect(() => setHapticsEnabled(hapticsOn), [hapticsOn]);
  useEffect(() => setReduceMotionOverride(reduceMotion), [reduceMotion]);
}

/**
 * Web document chrome. `web.output: 'single'` serves Expo's default index.html (`+html.tsx` only
 * applies to static output), so the canvas colour, overscroll lock and `viewport-fit=cover` are
 * applied at runtime.
 */
function useWebDocument() {
  useEffect(() => {
    if (!isWeb || typeof document === 'undefined') return;
    for (const element of [document.documentElement, document.body]) {
      element.style.backgroundColor = colors.background;
      element.style.overscrollBehavior = 'none';
    }
    document
      .querySelector('meta[name="viewport"]')
      ?.setAttribute('content', 'width=device-width, initial-scale=1, viewport-fit=cover');
  }, []);
}

/** Web / wide windows: a centred phone-width column on the canvas, hairline-framed when there is room. */
function AppFrame({ children }: { children: ReactNode }) {
  const { width } = useWindowDimensions();
  if (!isWeb) return <>{children}</>;
  const framed = width > layout.maxContentWidth;
  return (
    <View style={styles.frame}>
      <View style={[styles.column, framed && styles.columnFramed]}>{children}</View>
    </View>
  );
}

function RootStack() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="course/[id]" />
      <Stack.Screen name="streak" />
      <Stack.Screen name="account/index" />
      <Stack.Screen name="account/[section]" />
      <Stack.Screen name="invite" />
      <Stack.Screen name="pro" options={{ presentation: 'modal' }} />
      <Stack.Screen
        name="lesson/[id]"
        options={{ presentation: 'fullScreenModal', gestureEnabled: false, animation: 'slide_from_bottom' }}
      />
      <Stack.Screen name="story/[id]" options={{ presentation: 'fullScreenModal', animation: 'fade' }} />
      <Stack.Screen name="onboarding" options={{ animation: 'fade', gestureEnabled: false }} />
      <Stack.Screen name="dev" />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(customFontsToLoad);
  const hydrated = useHasHydrated();
  // A font failure falls back to the system faces instead of blocking the app on the splash.
  const ready = (fontsLoaded || fontError !== null) && hydrated;

  useSyncTimeBasedState();
  useSettingsBridge();
  useWebDocument();

  useEffect(() => {
    if (ready) void SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <ThemeProvider value={navigationTheme}>
          <StatusBar style="dark" />
          <AppFrame>
            <RootStack />
            <GlobalOverlays />
            <ToastHost />
          </AppFrame>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  frame: { flex: 1, alignItems: 'center', backgroundColor: colors.background },
  column: { flex: 1, width: '100%', maxWidth: layout.maxContentWidth, overflow: 'hidden' },
  columnFramed: {
    borderLeftWidth: hairline,
    borderRightWidth: hairline,
    borderColor: colors.borderSubtle,
    maxWidth: layout.maxContentWidth + hairline * 2,
  },
});
