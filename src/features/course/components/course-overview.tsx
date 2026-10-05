/**
 * "Cosa imparerai" — a collapsed-by-default disclosure card with the course description and
 * its outcomes, so the path stays the hero of the screen.
 */
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Check, ChevronDown, Target } from 'lucide-react-native';

import { hairline, HStack, Icon, IconTile, iconStroke, PressableScale, Text, useReduceMotion, VStack } from '@/components/ui';
import type { Course } from '@/content/types';
import { duration, easing, elevation, radius, spacing, useTheme } from '@/theme';

import { COURSE_COPY, COURSE_OUTCOMES } from '../copy';

export type CourseOverviewProps = {
  course: Course;
  totalChapters: number;
};

export function CourseOverview({ course, totalChapters }: CourseOverviewProps) {
  const theme = useTheme();
  const reduceMotion = useReduceMotion();
  const [open, setOpen] = useState(false);
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.set(withTiming(open ? 1 : 0, { duration: reduceMotion ? 0 : duration.base, easing: easing.standard }));
  }, [open, reduceMotion, rotation]);

  const chevronStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.get() * 180}deg` }] }));
  const outcomes = COURSE_OUTCOMES[course.id] ?? course.levels.map((level) => level.title);

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.borderSubtle }]}>
      <PressableScale
        onPress={() => setOpen((value) => !value)}
        scaleTo={false}
        dimOnPress
        haptic="selection"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={open ? COURSE_COPY.overviewCollapse : COURSE_COPY.overviewExpand}
        style={styles.header}>
        <IconTile icon={Target} tone="mint" size="md" />
        <VStack flex>
          <Text variant="titleSm">{COURSE_COPY.overviewTitle}</Text>
          <Text variant="bodySm" color="textSecondary">
            {COURSE_COPY.overviewSubtitle(course.levels.length, totalChapters)}
          </Text>
        </VStack>
        <Animated.View style={chevronStyle}>
          <Icon icon={ChevronDown} size="md" color="textTertiary" />
        </Animated.View>
      </PressableScale>

      {open ? (
        <Animated.View
          entering={reduceMotion ? undefined : FadeIn.duration(duration.base).easing(easing.enter)}
          exiting={reduceMotion ? undefined : FadeOut.duration(duration.fast).easing(easing.exit)}
          style={[styles.body, { borderTopColor: theme.colors.borderSubtle }]}>
          <Text variant="bodyMd" color="textSecondary">
            {course.description}
          </Text>
          <VStack gap="sm">
            {outcomes.map((outcome) => (
              <HStack key={outcome} gap="sm" align="flex-start">
                <View style={[styles.check, { backgroundColor: theme.colors.brandBg }]}>
                  <Icon icon={Check} size="xs" color="brandText" strokeWidth={iconStroke.heavy} />
                </View>
                <Text variant="bodyMd" style={styles.flex}>
                  {outcome}
                </Text>
              </HStack>
            ))}
          </VStack>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.xl, borderWidth: hairline, boxShadow: elevation.sm, overflow: 'hidden' },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md },
  body: { gap: spacing.md, paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.lg, borderTopWidth: hairline },
  check: {
    width: spacing.lg,
    height: spacing.lg,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xxxs,
  },
  flex: { flex: 1 },
});
