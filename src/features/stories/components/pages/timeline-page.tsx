/**
 * App story pages (spec §3.4): evergreen stage, lime display title on the first page
 * ("CHI SIAMO??"), then white cards zig-zagging left / right (max 86 % wide) joined by the dashed
 * journey path, each with its emoji sticker. Cards rise in one after the other.
 */
import { useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';

import type { StoryPage } from '@/content/types';
import { duration, spacing } from '@/theme';

import { storyMetrics } from '../../metrics';
import { DisplayTitle } from '../display-title';
import { FitToHeight } from '../fit-to-height';
import { Reveal } from '../reveal';
import { TimelineCard, type StickerCorner } from './timeline-card';
import { TimelinePath, type CardFrame } from './timeline-path';

export type TimelinePageProps = {
  page: Extract<StoryPage, { kind: 'timeline' }>;
  pageIndex: number;
  pageCount: number;
  /** Width of the content column. */
  width: number;
  /** Gutter between the column and the screen edges (the path runs into it). */
  bleed: number;
  compact: boolean;
};

function stickerCorner(alignRight: boolean, index: number): StickerCorner {
  // The sticker sits on the card's inner side, in the free 14 %, alternating top / bottom.
  if (alignRight) return index % 2 === 0 ? 'top-left' : 'bottom-left';
  return index % 2 === 0 ? 'bottom-right' : 'top-right';
}

export function TimelinePage({ page, pageIndex, pageCount, width, bleed, compact }: TimelinePageProps) {
  const [frames, setFrames] = useState<(CardFrame | null)[]>(() => page.cards.map(() => null));
  const [columnHeight, setColumnHeight] = useState(0);

  const gap = compact ? storyMetrics.timelineGap.compact : storyMetrics.timelineGap.regular;
  // Entry / exit runs of the path sit in this band above the first / below the last card.
  const pathMargin = gap * 2;
  const enter = pageIndex > 0;
  const exit = pageIndex < pageCount - 1;
  // Alternate the starting side per page so the road snakes on from one page to the next.
  const startRight = pageIndex % 2 === 1;
  const titleOffset = page.title ? 1 : 0;
  const measuredFrames = frames.filter((frame): frame is CardFrame => frame !== null);
  const measured = measuredFrames.length === page.cards.length && columnHeight > 0;

  const onCardLayout = (index: number) => (event: LayoutChangeEvent) => {
    const { x, y, width: w, height: h } = event.nativeEvent.layout;
    setFrames((current) => current.map((frame, i) => (i === index ? { x, y, width: w, height: h } : frame)));
  };

  return (
    <FitToHeight>
      <View style={[styles.column, { gap: compact ? spacing.md : spacing.lg }]}>
        {page.title ? (
          <Reveal order={0}>
            <DisplayTitle title={page.title} width={width} color="accentText" />
          </Reveal>
        ) : null}
        <View
          onLayout={(event) => setColumnHeight(event.nativeEvent.layout.height)}
          style={[
            styles.cards,
            {
              gap,
              paddingTop: enter ? pathMargin : 0,
              paddingBottom: exit ? pathMargin : 0,
            },
          ]}>
          {measured ? (
            <Reveal order={titleOffset + 1} style={StyleSheet.absoluteFill}>
              <TimelinePath
                frames={measuredFrames}
                width={width}
                height={columnHeight}
                bleed={bleed}
                margin={pathMargin}
                enter={enter}
                exit={exit}
              />
            </Reveal>
          ) : null}
          {page.cards.map((card, index) => {
            const alignRight = index % 2 === 1 ? !startRight : startRight;
            const order = titleOffset + index;
            return (
              <View
                key={card.text}
                onLayout={onCardLayout(index)}
                style={[
                  styles.slot,
                  {
                    alignSelf: alignRight ? 'flex-end' : 'flex-start',
                    maxWidth: width * storyMetrics.cardMaxWidth,
                  },
                ]}>
                <Reveal order={order}>
                  <TimelineCard
                    text={card.text}
                    emphasis={card.emphasis}
                    emoji={card.emoji}
                    corner={stickerCorner(alignRight, index)}
                    stickerDelay={order * storyMetrics.revealStagger + duration.slow}
                    compact={compact}
                  />
                </Reveal>
              </View>
            );
          })}
        </View>
      </View>
    </FitToHeight>
  );
}

const styles = StyleSheet.create({
  column: { pointerEvents: 'none' },
  cards: { alignItems: 'stretch' },
  slot: { pointerEvents: 'none' },
});
