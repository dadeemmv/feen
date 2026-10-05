/**
 * StreakHero — the evergreen header of the Streak screen (spec §3.5, redlines "Streak"):
 * glass back / share buttons, the streak counting up in giant lime digits, "GIORNI DI FILA",
 * a status line that depends on the day (zero, studied today, at risk, saved by a shield) and the
 * record + shields chips. A faint lime flame watermark hangs off the right edge.
 */
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Share } from 'lucide-react-native';

import { FlameIcon, ShieldIcon } from '@/components/icons';
import { StreakFlameHero } from '@/components/illustrations';
import { Chip, CountUp, HStack, IconButton, Spotlight, Text, VStack, iconSize } from '@/components/ui';
import { formatShields } from '@/lib/format';
import type { StreakInfo } from '@/store';
import { ColorModeProvider, gradients, layout, spacing } from '@/theme';

import { STREAK_COPY } from '../copy';
import { streakMetrics } from '../metrics';

export type StreakHeroProps = {
  streak: StreakInfo;
  longest: number;
  shields: number;
  onBack: () => void;
  onShare: () => void;
};

const SPOTLIGHT_ORIGIN = { x: 0.15, y: 0.1 };

function statusLine(streak: StreakInfo): string {
  if (streak.count === 0) return STREAK_COPY.zeroLine;
  if (streak.pendingShieldDay !== null) return STREAK_COPY.shieldSavingLine;
  if (streak.activeToday) return STREAK_COPY.activeTodayLine;
  return STREAK_COPY.atRiskLine;
}

export function StreakHero(props: StreakHeroProps) {
  return (
    <ColorModeProvider mode="brand">
      <HeroContent {...props} />
    </ColorModeProvider>
  );
}

function HeroContent({ streak, longest, shields, onBack, onShare }: StreakHeroProps) {
  const insets = useSafeAreaInsets();
  const count = streak.count;

  return (
    <View>
      {/* iOS over-scroll: the evergreen continues above the header instead of the light canvas. */}
      <View style={styles.overscroll} aria-hidden />
      <View
        style={[styles.hero, { paddingTop: insets.top + spacing.xs, minHeight: insets.top + streakMetrics.heroHeight }]}>
        <LinearGradient colors={gradients.hero} style={StyleSheet.absoluteFill} />
      <Spotlight origin={SPOTLIGHT_ORIGIN} />
      <View style={styles.flame} aria-hidden>
        <StreakFlameHero tone="ghost" width={streakMetrics.flameWidth} />
      </View>

      <HStack justify="space-between" style={styles.toolbar}>
        <IconButton icon={ArrowLeft} variant="glass" accessibilityLabel={STREAK_COPY.back} onPress={onBack} />
        <IconButton icon={Share} variant="glass" accessibilityLabel={STREAK_COPY.share} onPress={onShare} />
      </HStack>

      <VStack gap="xxs" style={styles.copy}>
        <View accessible accessibilityRole="header" accessibilityLabel={`${count} ${STREAK_COPY.daysLabel(count).toLowerCase()}`}>
          <CountUp value={count} color="accentText" style={styles.number} />
          <Text variant="displayLg" color="accentText">
            {STREAK_COPY.daysLabel(count)}
          </Text>
        </View>
        <Text variant="bodyMd" color="textSecondary" style={styles.line}>
          {statusLine(streak)}
        </Text>
      </VStack>

      <HStack gap="xs" wrap style={styles.chips}>
        {longest > 0 ? (
          <Chip size="sm" icon={<FlameIcon size={iconSize.sm} />} label={STREAK_COPY.record(longest)} />
        ) : null}
        <Chip
          size="sm"
          icon={<ShieldIcon size={iconSize.sm} muted={shields === 0} />}
          label={shields === 0 ? STREAK_COPY.shieldOwned(0) : formatShields(shields)}
        />
      </HStack>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: layout.screenX,
    paddingBottom: spacing.xl,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  overscroll: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -streakMetrics.overscrollFill,
    height: streakMetrics.overscrollFill,
    backgroundColor: gradients.hero[0],
  },
  flame: {
    position: 'absolute',
    right: -Math.round(streakMetrics.flameWidth * streakMetrics.flameCrop),
    top: spacing.xxl,
  },
  toolbar: { marginBottom: spacing.md },
  copy: { marginTop: 'auto' },
  number: { marginBottom: -spacing.xxs },
  line: { maxWidth: '80%', marginTop: spacing.xxs },
  chips: { marginTop: spacing.md },
});
