/**
 * Step 1 — Welcome (first launch): evergreen cover with the Finanz wordmark, the open book
 * floating in its cone of light, "La finanza, finalmente semplice." and the two ways in:
 *   "Inizia"            → the four questions (name → interests → level → pace)
 *   "Ho già un account" → demo: keeps the saved profile and jumps to "Tutto pronto".
 */
import { useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { ArrowRight, Clock, Target } from 'lucide-react-native';

import { FinanzWordmark, KiwiCoinIcon } from '@/components/icons';
import { HERO_BOOK_SIZE, HeroBookSpotlight } from '@/components/illustrations';
import { Button, Chip, iconSize, Screen, Spotlight, Text, useReduceMotion } from '@/components/ui';
import { useContentWidth } from '@/features/account/lib/use-content-width';
import { duration, easing, layout, spacing } from '@/theme';

import { ONBOARDING_COPY } from '../copy';
import { useOnboardingDraft } from '../draft-store';
import { useEntering } from '../lib/entering';
import { STEP_HREF } from '../steps';

const [ART_WIDTH, ART_HEIGHT] = HERO_BOOK_SIZE;
/** Share of the window height the hero art may take (keeps the CTA above the fold on an SE). */
const HERO_HEIGHT_SHARE = 0.27;
/** Vertical travel of the floating book. */
const FLOAT_DISTANCE = spacing.xs;
const WORDMARK_HEIGHT = iconSize.xl;
/** Below this window height (iPhone SE, small Androids) the headline steps down one size. */
const COMPACT_HEIGHT = 720;

/**
 * Hero width that fits both the column and the height budget (keeping the art's proportions),
 * and whether the window is short enough to need the compact type scale.
 */
function useHeroLayout() {
  const { height } = useWindowDimensions();
  const columnWidth = useContentWidth();
  const maxHeight = Math.min(ART_HEIGHT, height * HERO_HEIGHT_SHARE);
  return {
    heroWidth: Math.round(Math.min(columnWidth, ART_WIDTH, (maxHeight * ART_WIDTH) / ART_HEIGHT)),
    compact: height < COMPACT_HEIGHT,
  };
}

/** Slow up-and-down drift of the hero (none under reduced motion). */
function useFloatStyle() {
  const reduceMotion = useReduceMotion();
  const lift = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      lift.set(0);
      return;
    }
    lift.set(withRepeat(withTiming(1, { duration: duration.orbBreath, easing: easing.inOut }), -1, true));
    return () => cancelAnimation(lift);
  }, [reduceMotion, lift]);

  return useAnimatedStyle(() => ({ transform: [{ translateY: -lift.get() * FLOAT_DISTANCE }] }));
}

export function WelcomeScreen() {
  const setReturning = useOnboardingDraft((s) => s.setReturning);
  const { heroWidth, compact } = useHeroLayout();
  const headline = compact ? 'displayMd' : 'displayLg';
  const floatStyle = useFloatStyle();
  const { rise, fade } = useEntering();
  const copy = ONBOARDING_COPY.welcome;
  const [timePerk, challengePerk, rewardPerk] = copy.perks;

  const start = () => {
    setReturning(false);
    router.push(STEP_HREF.name);
  };

  const signIn = () => {
    setReturning(true);
    router.push(STEP_HREF.ready);
  };

  return (
    <Screen
      background="brand"
      edges={['top', 'bottom']}
      statusBar="light"
      contentContainerStyle={styles.content}
      footer={
        <Animated.View entering={rise(4)} style={styles.footer}>
          <Button title={copy.start} iconRight={ArrowRight} glow shimmer fullWidth onPress={start} testID="onboarding-start" />
          <Button title={copy.returning} variant="ghost" size="md" fullWidth onPress={signIn} testID="onboarding-returning" />
        </Animated.View>
      }>
      <Spotlight reach={{ x: 0.95, y: 0.6 }} />

      <Animated.View
        entering={fade(0)}
        style={styles.brandRow}
        accessible
        accessibilityRole="image"
        accessibilityLabel="Finanz">
        <FinanzWordmark tone="white" withMark height={WORDMARK_HEIGHT} />
      </Animated.View>

      <View style={styles.hero}>
        <Animated.View entering={rise(1)}>
          <Animated.View style={floatStyle}>
            <HeroBookSpotlight width={heroWidth} accessibilityLabel={copy.artLabel} />
          </Animated.View>
        </Animated.View>
      </View>

      <Animated.View entering={rise(2)} style={styles.copy}>
        <Text variant={headline} align="center" accessibilityRole="header">
          {copy.headlineStart}
          <Text variant={headline} color="accentText">
            {copy.headlineAccent}
          </Text>
        </Text>
        <Text variant={compact ? 'bodyMd' : 'bodyLg'} color="textSecondary" align="center">
          {copy.subtitle}
        </Text>
      </Animated.View>

      <Animated.View entering={rise(3)} style={styles.perks}>
        <Chip icon={Clock} label={timePerk} size="sm" />
        <Chip icon={Target} label={challengePerk} size="sm" />
        <Chip icon={<KiwiCoinIcon size={iconSize.sm} />} label={rewardPerk} size="sm" />
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1 },
  brandRow: { height: layout.headerHeight, alignItems: 'center', justifyContent: 'center' },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.md },
  copy: { gap: spacing.sm, alignItems: 'center' },
  perks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.lg,
  },
  footer: { gap: spacing.xxs },
});
