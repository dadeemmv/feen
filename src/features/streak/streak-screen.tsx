/**
 * Streak screen (/streak, docs/PRODUCT_SPEC.md §3.5, SCREEN_SPECS "Streak"):
 * evergreen hero with the streak count · "Calendario dei progressi" · "Scudo salva-streak" ·
 * "Sfide Maratona". The hero runs under the status bar; the rest scrolls on the light canvas.
 */
import { useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Screen, Text } from '@/components/ui';
import { shareText } from '@/lib/share';
import { selectLongestStreak, useStoreShallow } from '@/store';
import { useNow, useStreakInfo } from '@/store/hooks';
import { layout, spacing } from '@/theme';

import { goBackOr, openShop } from '@/features/shop/lib/navigation';

import { MarathonSection } from './components/marathon-section';
import { ShieldCard } from './components/shield-card';
import { StreakCalendar } from './components/streak-calendar';
import { StreakHero } from './components/streak-hero';
import { STREAK_COPY } from './copy';
import { ShieldInfoSheet } from './shield-info-sheet';

export function StreakScreen() {
  const insets = useSafeAreaInsets();
  const now = useNow();
  const streak = useStreakInfo(now);
  const data = useStoreShallow((s) => ({ activeDays: s.activeDays, shieldedDays: s.shieldedDays, shields: s.shields }));
  const longest = selectLongestStreak(data, now);
  const [infoOpen, setInfoOpen] = useState(false);

  const shieldedDays = streak.pendingShieldDay ? [...data.shieldedDays, streak.pendingShieldDay] : data.shieldedDays;

  const share = () => {
    void shareText(STREAK_COPY.shareMessage(streak.count), undefined, {
      title: STREAK_COPY.shareTitle,
      copiedFeedback: STREAK_COPY.shareCopied,
    });
  };

  return (
    <Screen
      edges={[]}
      padded={false}
      statusBar="light"
      contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl }}>
      <StreakHero
        streak={streak}
        longest={longest}
        shields={data.shields}
        onBack={() => goBackOr('/')}
        onShare={share}
      />

      <View style={styles.body}>
        <Section title={STREAK_COPY.calendarTitle}>
          <StreakCalendar now={now} activeDays={data.activeDays} shieldedDays={shieldedDays} />
        </Section>

        <Section>
          <ShieldCard
            shields={data.shields}
            saving={streak.pendingShieldDay !== null}
            onBuy={openShop}
            onInfo={() => setInfoOpen(true)}
          />
        </Section>

        <Section title={STREAK_COPY.marathonTitle}>
          <MarathonSection now={now} />
        </Section>
      </View>

      <ShieldInfoSheet visible={infoOpen} onClose={() => setInfoOpen(false)} />
    </Screen>
  );
}

function Section({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      {title ? (
        <Text variant="titleLg" accessibilityRole="header" style={styles.sectionTitle}>
          {title}
        </Text>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: layout.screenX },
  section: { marginTop: layout.sectionGap - spacing.xs },
  sectionTitle: { marginBottom: spacing.sm },
});
