/**
 * Chapter node of the learning path — a square-ish card placed absolutely by `computePathLayout`.
 * - completed: brand-tinted card, emoji on a white disc, check badge, accuracy stars → practice.
 * - current: white card with a lime ring and a breathing glow, chapter meta or session progress.
 * - locked: fill card, padlock, tertiary title; a tap shakes it (the screen shows a toast).
 * Becoming current pops the card in ("unlock"); becoming completed pops the check badge.
 */
import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { CheckBadgeIcon, LockIcon } from '@/components/icons';
import {
  borderWidth,
  hairline,
  PressableScale,
  ProgressBar,
  Text,
  useReduceMotion,
  useShake,
} from '@/components/ui';
import type { Chapter } from '@/content/types';
import { haptics } from '@/lib/haptics';
import { duration, easing, elevation, radius, spacing, spring, useTheme } from '@/theme';

import { NODE, PATH_MOTION } from '../constants';
import { COURSE_COPY } from '../copy';
import type { ChapterState, ResumePoint } from '../lib/course-summary';
import type { PathNodeLayout } from '../path-layout';
import { AccuracyStars } from './accuracy-stars';

export type ChapterNodeProps = {
  node: PathNodeLayout;
  chapter: Chapter;
  state: ChapterState;
  total: number;
  /** Best accuracy (completed chapters). */
  accuracy?: number;
  /** Saved session (current chapter). */
  resume?: ResumePoint;
  onOpen: (chapterId: string) => void;
  onLocked: (chapterId: string) => void;
};

export function ChapterNode({ node, chapter, state, total, accuracy, resume, onOpen, onLocked }: ChapterNodeProps) {
  const theme = useTheme();
  const reduceMotion = useReduceMotion();
  const { style: shakeStyle, shake } = useShake();
  const scale = useSharedValue(1);
  const badgeScale = useSharedValue(1);
  const glow = useSharedValue(0);
  const previous = useRef(state);

  const isCurrent = state === 'current';
  const isCompleted = state === 'completed';
  const isLocked = state === 'locked';

  // Unlock pop / completion badge pop when the state changes while the path is mounted.
  useEffect(() => {
    const before = previous.current;
    previous.current = state;
    if (before === state || reduceMotion) return;
    if (state === 'current' && before === 'locked') {
      scale.set(PATH_MOTION.unlockFrom);
      scale.set(withSpring(1, spring.bouncy));
      haptics.success();
    }
    if (state === 'completed') {
      badgeScale.set(0);
      badgeScale.set(withSpring(1, spring.bouncy));
    }
  }, [state, reduceMotion, scale, badgeScale]);

  // Breathing glow around the current node.
  useEffect(() => {
    cancelAnimation(glow);
    if (!isCurrent) {
      glow.set(0);
      return;
    }
    if (reduceMotion) {
      glow.set(1);
      return;
    }
    glow.set(0);
    glow.set(
      withRepeat(
        withSequence(
          withTiming(1, { duration: PATH_MOTION.glowHalf, easing: easing.inOut }),
          withTiming(0, { duration: PATH_MOTION.glowHalf, easing: easing.inOut }),
        ),
        -1,
      ),
    );
    return () => cancelAnimation(glow);
  }, [isCurrent, reduceMotion, glow]);

  const popStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));
  const badgeStyle = useAnimatedStyle(() => ({ transform: [{ scale: badgeScale.get() }] }));
  const glowStyle = useAnimatedStyle(() => {
    const t = glow.get();
    return {
      opacity: interpolate(t, [0, 1], PATH_MOTION.glowOpacity),
      transform: [{ scale: 1 + (PATH_MOTION.glowScale - 1) * t }],
    };
  });

  const handlePress = () => {
    if (isLocked) {
      shake();
      haptics.warning();
      onLocked(chapter.id);
      return;
    }
    onOpen(chapter.id);
  };

  const stateKey = isCurrent && resume ? 'resume' : state;
  const entering = reduceMotion
    ? undefined
    : FadeInDown.duration(duration.base)
        .easing(easing.enter)
        .delay(Math.min(node.index + 1, PATH_MOTION.staggerCap) * PATH_MOTION.stagger);

  const cardColors = isCompleted
    ? { backgroundColor: theme.colors.brandBg, borderColor: theme.colors.brandBorder, borderWidth: borderWidth.thin }
    : isCurrent
      ? { backgroundColor: theme.colors.surface, borderColor: theme.colors.accentSolid, borderWidth: NODE.ring, boxShadow: elevation.md }
      : { backgroundColor: theme.colors.fill, borderColor: theme.colors.borderSubtle, borderWidth: hairline };

  const tileColors = isCurrent
    ? { backgroundColor: theme.colors.accentBg, borderColor: theme.colors.accentBorder }
    : { backgroundColor: theme.colors.surface, borderColor: isCompleted ? theme.colors.brandBorder : theme.colors.borderSubtle };

  return (
    <Animated.View
      entering={entering}
      style={[styles.slot, { left: node.x, top: node.y, width: node.width, height: node.height }]}>
      <Animated.View style={[styles.fill, shakeStyle]}>
        <Animated.View style={[styles.fill, popStyle]}>
          {isCurrent ? (
            <Animated.View
              style={[styles.glow, { backgroundColor: theme.colors.accentSolid }, glowStyle]}
              aria-hidden
            />
          ) : null}
          <PressableScale
            onPress={handlePress}
            haptic={isLocked ? undefined : 'light'}
            scaleTo={isLocked ? 'large' : 'small'}
            accessibilityLabel={COURSE_COPY.nodeLabel(chapter.title, node.index + 1, total, COURSE_COPY.nodeState[stateKey])}
            accessibilityHint={COURSE_COPY.nodeHint[stateKey]}
            testID={`chapter-node-${chapter.id}`}
            style={[styles.card, cardColors]}>
            <View style={[styles.tile, tileColors]}>
              {isLocked ? (
                <LockIcon size={NODE.badge} muted />
              ) : (
                <Text style={styles.emoji} accessible={false}>
                  {chapter.emoji}
                </Text>
              )}
            </View>
            <Text
              variant="titleSm"
              color={isLocked ? 'textTertiary' : 'text'}
              align="center"
              numberOfLines={2}
              style={styles.title}>
              {chapter.title}
            </Text>
            <NodeFooter state={state} chapter={chapter} accuracy={accuracy} resume={resume} />
          </PressableScale>
          {isCompleted ? (
            <Animated.View style={[styles.badge, badgeStyle]} aria-hidden>
              <CheckBadgeIcon size={NODE.badge} />
            </Animated.View>
          ) : null}
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

function NodeFooter({ state, chapter, accuracy, resume }: Pick<ChapterNodeProps, 'state' | 'chapter' | 'accuracy' | 'resume'>) {
  if (state === 'completed') return <AccuracyStars accuracy={accuracy ?? 1} />;
  if (state === 'locked') return null;
  if (resume) {
    return (
      <View style={styles.footer}>
        <ProgressBar value={resume.ratio} size="sm" tone="accent" style={styles.resumeBar} animateOnMount={false} />
      </View>
    );
  }
  return (
    <View style={styles.footer}>
      <Text variant="labelSm" color="textTertiary" numberOfLines={1}>
        {COURSE_COPY.nodeMeta(chapter.estimatedMinutes, chapter.xpReward)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  slot: { position: 'absolute' },
  fill: { flex: 1 },
  glow: {
    position: 'absolute',
    top: -NODE.glowSpread,
    left: -NODE.glowSpread,
    right: -NODE.glowSpread,
    bottom: -NODE.glowSpread,
    borderRadius: NODE.radius + NODE.glowSpread,
    pointerEvents: 'none',
  },
  card: {
    flex: 1,
    borderRadius: NODE.radius,
    padding: NODE.padding,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxs,
  },
  tile: {
    width: NODE.tile,
    height: NODE.tile,
    borderRadius: radius.pill,
    borderWidth: hairline,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxs,
  },
  emoji: { fontSize: NODE.emoji, lineHeight: NODE.tile - spacing.xs, textAlign: 'center' },
  title: { alignSelf: 'stretch' },
  footer: { height: NODE.footerLine, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' },
  resumeBar: { width: NODE.resumeBarWidth },
  badge: { position: 'absolute', top: NODE.badgeOffset, right: NODE.badgeOffset },
});
