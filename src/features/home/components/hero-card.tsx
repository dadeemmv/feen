/**
 * Home hero (spec §3.3, redlines "Home" §4): the evergreen card with the open book in a cone of
 * light, the current chapter, the course progress and the shimmering "Continua il tuo viaggio!"
 * CTA → course path. A saved lesson session adds a "Riprendi: <capitolo>" pill on the artwork.
 */
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Play } from 'lucide-react-native';

import { HeroBookSpotlight } from '@/components/illustrations';
import { Button, Card, Chip, HStack, ProgressBar, Text, VStack } from '@/components/ui';
import { MAIN_COURSE_ID, getChapter, getLevelForChapter } from '@/content/courses';
import { selectCurrentChapter, useStore } from '@/store';
import { useCourseProgress } from '@/store/hooks';
import { duration, easing, spacing } from '@/theme';

import { HOME_COPY } from '../copy';
import type { HomeLayout } from '../lib/use-home-layout';
import { HeroSparkles } from './hero-sparkles';

export type HeroCardProps = { layout: HomeLayout };

const openCourse = () => router.push({ pathname: '/course/[id]', params: { id: MAIN_COURSE_ID } });

export function HeroCard({ layout }: HeroCardProps) {
  const progress = useCourseProgress(MAIN_COURSE_ID);
  const currentId = useStore((s) => selectCurrentChapter(s, MAIN_COURSE_ID));
  const session = useStore((s) => s.session);

  const current = currentId ? getChapter(currentId) : undefined;
  const level = currentId ? getLevelForChapter(currentId) : undefined;
  const overline = current && level ? HOME_COPY.hero.level(level.number, current.title) : HOME_COPY.hero.done;
  const resumeChapter = session && session.stepIndex > 0 ? getChapter(session.chapterId) : undefined;
  const { heroArt, heroPadding, compact } = layout;

  return (
    <Animated.View entering={FadeInDown.delay(duration.fast).duration(duration.slow).easing(easing.enter)}>
      <Card
        variant="brand"
        spotlight
        padding="none"
        contentStyle={{ padding: heroPadding, gap: compact ? spacing.sm : spacing.md }}>
        <View style={[styles.art, heroArt]}>
          <HeroBookSpotlight width={heroArt.width} height={heroArt.height} />
          <HeroSparkles />
          {resumeChapter ? (
            <Chip
              label={HOME_COPY.hero.resume(resumeChapter.title)}
              icon={Play}
              size="sm"
              tone="neutral"
              style={styles.resume}
            />
          ) : null}
        </View>

        <VStack gap="xxs">
          <Text variant="overline" color="accentText" numberOfLines={1}>
            {overline}
          </Text>
          <Text variant="displaySm" accessibilityRole="header">
            {HOME_COPY.hero.title}
          </Text>
        </VStack>

        <HStack gap="sm">
          <ProgressBar
            value={progress.ratio}
            size="sm"
            tone="accent"
            accessibilityLabel={HOME_COPY.hero.progressA11y(progress.completed, progress.total)}
            style={styles.bar}
          />
          <Text variant="labelSm" color="textSecondary" tabular>
            {HOME_COPY.hero.progress(progress.completed, progress.total)}
          </Text>
        </HStack>

        <Button
          title={HOME_COPY.hero.cta}
          accessibilityHint={HOME_COPY.hero.ctaHint}
          shimmer
          glow
          fullWidth
          onPress={openCourse}
        />
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  art: { alignSelf: 'center' },
  resume: { position: 'absolute', top: 0, left: 0 },
  bar: { flex: 1 },
});
