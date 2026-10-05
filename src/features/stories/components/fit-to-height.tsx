/**
 * FitToHeight — a story page never scrolls. The page lays out at its natural height; if that is
 * taller than the space under the header (iPhone SE, large text), it is scaled down uniformly
 * (never below `storyMetrics.minFitScale`) and pinned to the top; if it is shorter it is centred
 * or top-aligned. Passes touches through except where children accept them.
 */
import { useState, type ReactNode } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';

import { storyMetrics } from '../metrics';

export type FitToHeightProps = {
  children: ReactNode;
  /** `center` (mint pages) or `top` (timeline). Default `center`. */
  align?: 'center' | 'top';
};

export function FitToHeight({ children, align = 'center' }: FitToHeightProps) {
  const [box, setBox] = useState(0);
  const [content, setContent] = useState(0);

  const onBox = (event: LayoutChangeEvent) => setBox(event.nativeEvent.layout.height);
  const onContent = (event: LayoutChangeEvent) => setContent(event.nativeEvent.layout.height);

  const measured = box > 0 && content > 0;
  const scale = measured ? Math.max(storyMetrics.minFitScale, Math.min(1, box / content)) : 1;
  const shrunk = scale < 1;
  // Scaling happens around the centre: shift up by the lost height to keep the top edge pinned.
  const pinTop = shrunk ? -(content * (1 - scale)) / 2 : 0;
  const offset = !measured || shrunk || align === 'top' ? 0 : (box - content) / 2;

  return (
    <View style={styles.box} onLayout={onBox}>
      <View
        onLayout={onContent}
        style={[
          styles.content,
          {
            opacity: measured ? 1 : 0,
            transform: [{ translateY: offset + pinTop }, { scale }],
          },
        ]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, pointerEvents: 'box-none' },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    pointerEvents: 'box-none',
  },
});
