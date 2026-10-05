/**
 * StoryFace — one story group as a face of the cube: backdrop, chrome (segments + header) and
 * the current page. The face's 3D pose comes from the viewer's continuous `position`; only the
 * settled face receives touches. Mint faces use light tokens, App faces brand tokens.
 */
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { useReduceMotion } from '@/components/ui';
import type { StoryGroup, StoryPage } from '@/content/types';
import { ColorModeProvider, spacing, useTheme } from '@/theme';

import { cubeFace } from '../lib/cube';
import { passThrough } from '../lib/pass-through';
import { storyMetrics } from '../metrics';
import { AcademyIntroPage } from './pages/academy-intro-page';
import { PollPage } from './pages/poll-page';
import { TimelinePage } from './pages/timeline-page';
import { StoryBackground } from './story-background';
import { StoryChrome } from './story-chrome';

export type StoryFaceProps = {
  group: StoryGroup;
  faceIndex: number;
  pageIndex: number;
  /** Continuous index of the group in front (drives the cube). */
  position: SharedValue<number>;
  /** The settled face: receives touches and owns the running timer. */
  active: boolean;
  progress: SharedValue<number>;
  chromeVisibility: SharedValue<number>;
  width: number;
  insets: { top: number; bottom: number };
  compact: boolean;
  onShare: () => void;
  onClose: () => void;
  onInteraction: (active: boolean) => void;
};

/** Content gutter of story pages (redlines: padding x `xl`). */
const GUTTER = spacing.xl;

export function StoryFace(props: StoryFaceProps) {
  return (
    <ColorModeProvider mode={props.group.theme === 'brand' ? 'brand' : 'light'}>
      <StoryFaceBody {...props} />
    </ColorModeProvider>
  );
}

function StoryFaceBody({
  group,
  faceIndex,
  pageIndex,
  position,
  active,
  progress,
  chromeVisibility,
  width,
  insets,
  compact,
  onShare,
  onClose,
  onInteraction,
}: StoryFaceProps) {
  const { colors } = useTheme();
  const reduceMotion = useReduceMotion();
  const page = group.pages[pageIndex];
  const column = width - GUTTER * 2;

  const faceStyle = useAnimatedStyle(() => {
    const t = faceIndex - position.get();
    if (reduceMotion) return { opacity: Math.max(0, 1 - Math.abs(t)), transform: [] };
    const face = cubeFace(t, width, storyMetrics.cubePerspective);
    return { opacity: face.visible ? 1 : 0, transform: face.transform };
  });
  const shadeStyle = useAnimatedStyle(() => ({
    opacity: reduceMotion ? 0 : Math.min(1, Math.abs(faceIndex - position.get())) * storyMetrics.cubeShade,
  }));

  return (
    <Animated.View style={[styles.face, active ? passThrough.animatedShell : passThrough.none, faceStyle]}>
      <View style={[StyleSheet.absoluteFill, active ? passThrough.boxNone : passThrough.none]}>
        <StoryBackground theme={group.theme} />
        <StoryChrome
          group={group}
          pageIndex={pageIndex}
          progress={progress}
          visibility={chromeVisibility}
          topInset={insets.top}
          onShare={onShare}
          onClose={onClose}
        />
        <View
          style={[
            styles.page,
            {
              paddingHorizontal: GUTTER,
              paddingBottom: insets.bottom + spacing.md,
            },
          ]}
          key={`${group.id}-${pageIndex}`}>
          <PageContent
            page={page}
            pageIndex={pageIndex}
            pageCount={group.pages.length}
            width={column}
            compact={compact}
            onInteraction={onInteraction}
          />
        </View>
        <Animated.View style={[styles.shade, { backgroundColor: colors.shadow }, shadeStyle]} />
      </View>
    </Animated.View>
  );
}

function PageContent({
  page,
  pageIndex,
  pageCount,
  width,
  compact,
  onInteraction,
}: {
  page: StoryPage;
  pageIndex: number;
  pageCount: number;
  width: number;
  compact: boolean;
  onInteraction: (active: boolean) => void;
}) {
  switch (page.kind) {
    case 'academy-intro':
      return <AcademyIntroPage page={page} width={width} compact={compact} />;
    case 'poll':
      return <PollPage page={page} width={width} compact={compact} onInteraction={onInteraction} />;
    case 'timeline':
      return (
        <TimelinePage
          page={page}
          pageIndex={pageIndex}
          pageCount={pageCount}
          width={width}
          bleed={GUTTER}
          compact={compact}
        />
      );
  }
}

const styles = StyleSheet.create({
  face: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
    backfaceVisibility: 'hidden',
  },
  page: { flex: 1, paddingTop: spacing.lg, pointerEvents: 'box-none' },

  shade: { ...StyleSheet.absoluteFill, pointerEvents: 'none' },
});
