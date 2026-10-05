/**
 * Greeting block: "Ciao Alberto 👋" + a contextual line driven by the streak and the course
 * progress (docs/SCREEN_SPECS.md "Home" §2).
 */
import { StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Text } from '@/components/ui';
import { duration, easing, spacing } from '@/theme';

import { HOME_COPY } from '../copy';

export type GreetingProps = {
  name: string;
  streak: number;
  studiedToday: boolean;
  courseDone: boolean;
};

export function Greeting({ name, streak, studiedToday, courseDone }: GreetingProps) {
  return (
    <Animated.View entering={FadeIn.duration(duration.base).easing(easing.enter)} style={styles.root}>
      <Text variant="titleLg" accessibilityRole="header" numberOfLines={1}>
        {HOME_COPY.greeting(name)}
      </Text>
      <Text variant="bodyMd" color="textSecondary" numberOfLines={2}>
        {HOME_COPY.subtitle({ streak, courseDone, studiedToday })}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.xxxs, marginTop: spacing.xs, marginBottom: spacing.lg },
});
