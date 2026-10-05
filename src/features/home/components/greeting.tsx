/**
 * Greeting block: "Ciao Alberto 👋" + a contextual line driven by the streak and the course
 * progress (docs/SCREEN_SPECS.md "Home" §2), with the user's companion character on the right
 * (tap → "Il tuo personaggio").
 */
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';

import { MascotArt } from '@/components/illustrations';
import { PressableScale, Text } from '@/components/ui';
import { getMascot } from '@/content/personality';
import { mascotMetrics } from '@/features/mascots/metrics';
import { selectMascot, useStore } from '@/store';
import { duration, easing, spacing } from '@/theme';

import { HOME_COPY } from '../copy';

export type GreetingProps = {
  name: string;
  streak: number;
  studiedToday: boolean;
  courseDone: boolean;
};

export function Greeting({ name, streak, studiedToday, courseDone }: GreetingProps) {
  const mascot = useStore(selectMascot);
  return (
    <Animated.View entering={FadeIn.duration(duration.base).easing(easing.enter)} style={styles.root}>
      <View style={styles.text}>
        <Text variant="titleLg" accessibilityRole="header" numberOfLines={1}>
          {HOME_COPY.greeting(name)}
        </Text>
        <Text variant="bodyMd" color="textSecondary" numberOfLines={2}>
          {HOME_COPY.subtitle({ streak, courseDone, studiedToday })}
        </Text>
      </View>
      {mascot ? (
        <PressableScale
          onPress={() => router.push('/mascot')}
          scaleTo="small"
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel={HOME_COPY.mascotA11y(getMascot(mascot).name, getMascot(mascot).title)}>
          <MascotArt id={mascot} framing="bust" width={mascotMetrics.greetingBust} />
        </PressableScale>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs, marginBottom: spacing.lg },
  text: { flex: 1, gap: spacing.xxxs },
});
