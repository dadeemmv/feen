/**
 * Learning path — level banners + zig-zag chapter nodes + dashed connectors, laid out absolutely
 * by the pure `computePathLayout` once the container width is known (skeleton until then).
 */
import { useEffect, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';

import { Skeleton, VStack } from '@/components/ui';
import { getChapter } from '@/content/courses';
import type { Course } from '@/content/types';
import type { ChapterRecord } from '@/store';

import { PATH_METRICS } from '../constants';
import { COURSE_COPY } from '../copy';
import { getChapterState, type ResumePoint } from '../lib/course-summary';
import { bannerKey, computePathLayout, GOAL_ID, type PathRect } from '../path-layout';
import { ChapterNode } from './chapter-node';
import { LevelBanner, type LevelBannerState } from './level-banner';
import { NodeTooltip } from './node-tooltip';
import { PathConnectors } from './path-connectors';

export type LearningPathProps = {
  course: Course;
  records: Record<string, ChapterRecord>;
  currentChapterId?: string;
  resume?: ResumePoint;
  isDone: boolean;
  onOpenChapter: (chapterId: string) => void;
  onLockedChapter: (chapterId: string) => void;
  /** Rect of the current node inside the path (null when the course is done). */
  onCurrentNode?: (rect: PathRect | null) => void;
};

export function LearningPath({
  course,
  records,
  currentChapterId,
  resume,
  isDone,
  onOpenChapter,
  onLockedChapter,
  onCurrentNode,
}: LearningPathProps) {
  const [width, setWidth] = useState(0);
  const handleLayout = (event: LayoutChangeEvent) => {
    const next = Math.round(event.nativeEvent.layout.width);
    if (next !== width) setWidth(next);
  };

  const levels = course.levels.map((level) => ({ id: level.id, chapterIds: level.chapterIds }));
  const layout = computePathLayout({ width, levels, metrics: PATH_METRICS, tooltipChapterId: currentChapterId });
  const total = layout.nodes.length;
  const currentNode = layout.nodes.find((node) => node.chapterId === currentChapterId);

  const isReached = (chapterId: string) => records[chapterId] !== undefined || chapterId === currentChapterId;
  const walked = new Set(
    layout.connectors
      .filter((connector) => {
        if (connector.to === GOAL_ID) return isDone;
        const level = course.levels.find((l) => bannerKey(l.id) === connector.to);
        if (level) return level.chapterIds.length > 0 && isReached(level.chapterIds[0]);
        return isReached(connector.to);
      })
      .map((connector) => connector.id),
  );

  // Report the current node rect to the screen (auto-scroll) only when it actually changes:
  // primitives as dependencies, so a re-render with the same geometry does not re-report.
  const rectX = currentNode?.x ?? -1;
  const rectY = currentNode?.y ?? -1;
  const rectWidth = currentNode?.width ?? -1;
  const rectHeight = currentNode?.height ?? -1;
  useEffect(() => {
    if (width === 0) return;
    onCurrentNode?.(rectWidth < 0 ? null : { x: rectX, y: rectY, width: rectWidth, height: rectHeight });
  }, [width, rectX, rectY, rectWidth, rectHeight, onCurrentNode]);

  if (width === 0) {
    return (
      <View onLayout={handleLayout}>
        <PathSkeleton />
      </View>
    );
  }

  return (
    <View
      onLayout={handleLayout}
      accessibilityLabel={COURSE_COPY.pathLabel}
      style={[styles.root, { height: layout.height }]}>
      <PathConnectors width={layout.width} height={layout.height} connectors={layout.connectors} walked={walked} />

      {layout.banners.map((banner) => {
        const level = course.levels[banner.levelIndex];
        const completed = level.chapterIds.filter((id) => records[id] !== undefined).length;
        const state: LevelBannerState =
          completed === level.chapterIds.length && completed > 0
            ? 'done'
            : level.chapterIds.some(isReached)
              ? 'active'
              : 'locked';
        const firstNode = layout.nodes.find((node) => node.levelId === level.id);
        return (
          <LevelBanner
            key={banner.levelId}
            rect={banner}
            number={level.number}
            title={level.title}
            completed={completed}
            total={level.chapterIds.length}
            state={state}
            order={firstNode?.index ?? banner.levelIndex}
          />
        );
      })}

      {layout.nodes.map((node) => {
        const chapter = getChapter(node.chapterId);
        if (!chapter) return null;
        const state = getChapterState(node.chapterId, currentChapterId, records);
        return (
          <ChapterNode
            key={node.chapterId}
            node={node}
            chapter={chapter}
            state={state}
            total={total}
            accuracy={records[node.chapterId]?.accuracy}
            resume={state === 'current' ? resume : undefined}
            onOpen={onOpenChapter}
            onLocked={onLockedChapter}
          />
        );
      })}

      {currentNode ? (
        <NodeTooltip node={currentNode} resume={resume !== undefined} onPress={() => onOpenChapter(currentNode.chapterId)} />
      ) : null}
    </View>
  );
}

/** Loading shape of the path: banner + zig-zag blocks. */
function PathSkeleton() {
  return (
    <VStack gap="xl">
      <Skeleton height={PATH_METRICS.bannerHeight} radius="lg" />
      {[0, 1, 2].map((index) => (
        <Skeleton
          key={index}
          width={`${PATH_METRICS.nodeWidthRatio * 100}%`}
          height={PATH_METRICS.nodeMinHeight}
          radius="xl"
          style={index % 2 === 1 ? styles.right : undefined}
        />
      ))}
    </VStack>
  );
}

const styles = StyleSheet.create({
  root: { position: 'relative' },
  right: { alignSelf: 'flex-end' },
});
