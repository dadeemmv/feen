/**
 * Academy story, page 2 (spec §3.4): "💞 AIUTACI A MIGLIORARE 💞", "Non sarà l'ultimo percorso!",
 * the call to vote, the live "Piccolo sondaggio" card and the sticker
 * "Un esempio di cosa NON devi farti sfuggire! 👆" pointing at it.
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
import { PollCard } from './poll-card';

export type PollPageProps = {
  page: Extract<StoryPage, { kind: 'poll' }>;
  width: number;
  compact: boolean;
  onInteraction: (active: boolean) => void;
};

export function PollPage({ page, width, compact, onInteraction }: PollPageProps) {
  return (
    <FitToHeight>
      <View style={[styles.column, { gap: compact ? spacing.sm : spacing.md }]}>
        <Reveal order={0}>
          <DisplayTitle
            title={page.title}
            width={width}
            color="tintMintText"
            sizes={compact ? ['displayMd'] : ['displayLg', 'displayMd']}
          />
        </Reveal>
        <Reveal order={1} style={styles.texts}>
          <Text variant={compact ? 'titleSm' : 'titleMd'} color="tintMintText" align="center">
            {page.subtitle}
          </Text>
          <Text variant={compact ? 'bodySm' : 'bodyMd'} color="tintMintText" align="center">
            {page.body}
          </Text>
        </Reveal>
        <Reveal order={2} interactive>
          <PollCard page={page} compact={compact} onInteraction={onInteraction} />
          <Sticker
            text={page.sticker}
            tilt={storyMetrics.stickerTilt.poll}
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
  column: { alignItems: 'stretch', pointerEvents: 'box-none' },
  texts: { gap: spacing.xxs },
  // Hangs off the card's bottom-right corner, pointing up at the answers.
  sticker: {
    alignSelf: 'flex-end',
    marginTop: -spacing.md,
    marginRight: -spacing.xs,
  },
});
