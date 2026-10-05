/**
 * Academy story, page 1 (spec §3.4): giant "ACADEMY 📚", "Cosa troverai all'interno dell'app?",
 * the intro paragraph, the poster of the upcoming course and the tilted sticker
 * "Che ti insegnerà… Si capisce vero?" slapped on its corner.
 */
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import type { StoryPage } from '@/content/types';
import { spacing } from '@/theme';

import { storyMetrics } from '../../metrics';
import { DisplayTitle } from '../display-title';
import { FitToHeight } from '../fit-to-height';
import { Reveal } from '../reveal';
import { Sticker } from '../sticker';
import { CoursePoster } from './course-poster';

export type AcademyIntroPageProps = {
  page: Extract<StoryPage, { kind: 'academy-intro' }>;
  /** Width of the content column. */
  width: number;
  compact: boolean;
};

export function AcademyIntroPage({ page, width, compact }: AcademyIntroPageProps) {
  const posterWidth = Math.round(width * storyMetrics.posterWidth);
  const artHeight = Math.round(
    posterWidth * (compact ? storyMetrics.posterArtRatioCompact : storyMetrics.posterArtRatio),
  );

  return (
    <FitToHeight>
      <View style={[styles.column, { gap: compact ? spacing.sm : spacing.md }]}>
        <Reveal order={0}>
          <DisplayTitle title={page.title} width={width} color="tintMintText" />
        </Reveal>
        <Reveal order={1} style={styles.texts}>
          <Text variant={compact ? 'titleMd' : 'titleLg'} color="tintMintText" align="center">
            {page.subtitle}
          </Text>
          <Text variant={compact ? 'bodyMd' : 'bodyLg'} color="tintMintText" align="center">
            {page.body}
          </Text>
        </Reveal>
        <Reveal order={2} style={styles.posterSlot}>
          <CoursePoster title={page.posterTitle} width={posterWidth} artHeight={artHeight} />
          <Sticker
            text={page.sticker}
            tilt={storyMetrics.stickerTilt.academy}
            tone="mint"
            delay={storyMetrics.stickerDelay}
            style={[styles.sticker, { maxWidth: width * storyMetrics.stickerMaxWidth }]}
          />
        </Reveal>
      </View>
    </FitToHeight>
  );
}

const styles = StyleSheet.create({
  column: { alignItems: 'center', pointerEvents: 'box-none' },
  texts: { gap: spacing.xxs },
  posterSlot: { marginTop: spacing.xs },
  // Hangs off the poster's bottom-left corner, below its title.
  sticker: {
    alignSelf: 'flex-start',
    marginTop: -spacing.sm,
    marginLeft: -spacing.xs,
  },
});
