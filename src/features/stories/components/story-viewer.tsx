/**
 * StoryViewer — Instagram-style viewer over all story groups (spec §3.4, birdwingo pattern).
 *
 * - One face per group arranged on a cube; `position` (continuous group index) drives it.
 * - The settled face runs a page timer (SegmentedProgress); the timer pauses for touches, poll
 *   interaction, share sheet, cube turns, background and screen readers (`usePauseReasons`).
 * - Tap right 2/3 = next page, left 1/3 = previous; past the last page → cube to the next
 *   group; past the last group → close. Swipe sideways to switch group, down to close.
 * - Each group is marked seen in the store when it comes to the front.
 */
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, useWindowDimensions, type LayoutChangeEvent } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';
import { StatusBar } from 'expo-status-bar';

import { useReduceMotion } from '@/components/ui';
import { STORY_GROUPS } from '@/content/stories';
import { shareText } from '@/lib/share';
import { useStore } from '@/store';
import { duration, easing, radius, themes } from '@/theme';

import { STORY_COPY } from '../copy';
import { passThrough } from '../lib/pass-through';
import { pageDuration } from '../lib/story-pages';
import { usePauseReasons } from '../lib/use-pause-reasons';
import { useStoryGesture } from '../lib/use-story-gesture';
import { useStoryTimer } from '../lib/use-story-timer';
import { storyMetrics } from '../metrics';
import { StoryFace } from './story-face';

export type StoryViewerProps = {
  initialGroup: number;
  onClose: () => void;
};

const GROUPS = STORY_GROUPS;
/** Deep evergreen behind the cube (visible at the edges while it turns). */
const BACKDROP = themes.brand.colors.surfaceSunken;
/** Shortest cube animation, as a fraction of a full turn (snap-backs after a small drag). */
const MIN_TURN = 0.35;

export function StoryViewer({ initialGroup, onClose }: StoryViewerProps) {
  const window = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReduceMotion();
  const markStorySeen = useStore((s) => s.markStorySeen);

  // The viewer may live in the web phone-width column: measure the real box.
  const [size, setSize] = useState({
    width: window.width,
    height: window.height,
  });
  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width !== size.width || height !== size.height) setSize({ width, height });
  };
  const compact = size.height < storyMetrics.compactHeight;

  const [group, setGroup] = useState(initialGroup);
  const [pages, setPages] = useState<number[]>(() => GROUPS.map(() => 0));
  const [restart, setRestart] = useState(0);
  const page = pages[group];
  const current = GROUPS[group];

  const { paused, has, setReason } = usePauseReasons();
  const turning = has('transition');
  const position = useSharedValue(initialGroup);
  const settledGroup = useSharedValue(initialGroup);
  const dragY = useSharedValue(0);
  const chrome = useSharedValue(1);
  const idleProgress = useSharedValue(0);
  const idleChrome = useSharedValue(1);
  const closing = useRef(false);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    markStorySeen(GROUPS[group].id);
  }, [group, markStorySeen]);

  // Every page starts free of the previous page's poll interaction.
  useEffect(() => {
    setReason('interaction', false);
  }, [group, page, setReason]);

  useEffect(
    () => () => {
      if (holdTimer.current) clearTimeout(holdTimer.current);
    },
    [],
  );

  const close = () => {
    if (closing.current) return;
    closing.current = true;
    onClose();
  };

  const settle = (target: number) => {
    settledGroup.set(target);
    setGroup(target);
    setReason('transition', false);
  };

  const turnTo = (target: number) => {
    setReason('transition', true);
    const distance = Math.max(MIN_TURN, Math.abs(position.get() - target));
    const ms = (reduceMotion ? duration.base : storyMetrics.cubeDuration) * distance;
    position.set(
      withTiming(target, { duration: ms, easing: easing.inOut }, (finished) => {
        if (finished) scheduleOnRN(settle, target);
      }),
    );
  };

  const showPage = (groupIndex: number, pageIndex: number) =>
    setPages((all) => all.map((value, index) => (index === groupIndex ? pageIndex : value)));

  const next = () => {
    if (turning || closing.current) return;
    if (page < current.pages.length - 1) showPage(group, page + 1);
    else if (group < GROUPS.length - 1) {
      showPage(group + 1, 0);
      turnTo(group + 1);
    } else close();
  };

  const previous = () => {
    if (turning || closing.current) return;
    if (page > 0) showPage(group, page - 1);
    else if (group > 0) turnTo(group - 1);
    else setRestart((n) => n + 1);
  };

  const progress = useStoryTimer({
    pageKey: `${group}:${page}:${restart}`,
    durationMs: pageDuration(current.pages[page]),
    running: !paused,
    onFinish: next,
  });

  const onTouchStart = () => {
    setReason('touch', true);
    if (holdTimer.current) clearTimeout(holdTimer.current);
    holdTimer.current = setTimeout(
      () => chrome.set(withTiming(0, { duration: duration.fast })),
      storyMetrics.holdDelay,
    );
  };
  const onTouchEnd = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    holdTimer.current = null;
    chrome.set(withTiming(1, { duration: duration.fast }));
    setReason('touch', false);
  };

  const gesture = useStoryGesture({
    size,
    groupCount: GROUPS.length,
    settledGroup,
    position,
    dragY,
    handlers: {
      onTouchStart,
      onTouchEnd,
      onTapLeft: previous,
      onTapRight: next,
      onSwitchRelease: (target) => {
        // Going forward opens the next group from its first page; going back resumes it.
        if (target > group) showPage(target, 0);
        turnTo(target);
      },
      onDismiss: close,
    },
  });

  const share = async () => {
    setReason('share', true);
    await shareText(STORY_COPY.shareMessage[current.id] ?? STORY_COPY.shareMessage.default, undefined, {
      title: STORY_COPY.shareTitle,
      copiedFeedback: STORY_COPY.shareCopied,
    });
    setReason('share', false);
  };

  const sheetStyle = useAnimatedStyle(() => {
    const y = Math.max(0, dragY.get());
    return {
      borderRadius: interpolate(y, [0, size.height * storyMetrics.dismissFraction], [0, radius.xxl], 'clamp'),
      transform: [
        { translateY: dragY.get() },
        {
          scale: interpolate(y, [0, size.height], [1, storyMetrics.dragMinScale], 'clamp'),
        },
      ],
    };
  });

  return (
    <View style={[styles.root, { backgroundColor: BACKDROP }]} onLayout={onLayout}>
      <StatusBar style={current.theme === 'brand' ? 'light' : 'dark'} animated />
      <GestureDetector gesture={gesture}>
        <View
          style={StyleSheet.absoluteFill}
          accessible
          accessibilityRole="adjustable"
          accessibilityLabel={STORY_COPY.pageA11y(current.title, page + 1, current.pages.length)}
          accessibilityHint={STORY_COPY.pageHint}
          accessibilityActions={[
            { name: 'increment', label: STORY_COPY.next },
            { name: 'decrement', label: STORY_COPY.previous },
          ]}
          onAccessibilityAction={(event) => (event.nativeEvent.actionName === 'increment' ? next() : previous())}
        />
      </GestureDetector>
      <Animated.View style={[styles.sheet, passThrough.animatedShell, sheetStyle]}>
        <View style={[StyleSheet.absoluteFill, passThrough.boxNone]}>
          {GROUPS.map((g, index) =>
            // Only the front face and its neighbours can be on screen.
            Math.abs(index - group) <= 1 ? (
              <StoryFace
                key={g.id}
                group={g}
                faceIndex={index}
                pageIndex={pages[index]}
                position={position}
                active={index === group && !turning}
                progress={index === group ? progress : idleProgress}
                chromeVisibility={index === group ? chrome : idleChrome}
                width={size.width}
                insets={insets}
                compact={compact}
                onShare={() => void share()}
                onClose={close}
                onInteraction={(active) => setReason('interaction', active)}
              />
            ) : null,
          )}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  // No text selection while tapping / dragging through the story with a mouse (web).
  root: { flex: 1, overflow: 'hidden', userSelect: 'none' },
  sheet: { ...StyleSheet.absoluteFill, overflow: 'hidden' },
});
