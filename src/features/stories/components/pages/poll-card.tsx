/**
 * "Piccolo sondaggio" — the interactive poll card of the Academy story. The vote is saved in the
 * store (`meta.pollAnswers[pollId]`) and can be changed; once voted the options show the
 * (offline, plausible) results including the user's vote. While a finger is on an option the
 * story timer is paused; after a vote it stays paused long enough to read the bars.
 */
import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Check } from 'lucide-react-native';

import { Chip, Text } from '@/components/ui';
import { POLL_CARD_TITLE } from '@/content/stories';
import type { StoryPage } from '@/content/types';
import { haptics } from '@/lib/haptics';
import { useStore } from '@/store';
import { elevation, radius, spacing, useTheme } from '@/theme';

import { STORY_COPY } from '../../copy';
import { getPollResults } from '../../lib/poll-results';
import { storyMetrics } from '../../metrics';
import { PollOption } from './poll-option';

export type PollCardProps = {
  page: Extract<StoryPage, { kind: 'poll' }>;
  compact: boolean;
  /** Pauses (true) / resumes (false) the story timer. */
  onInteraction: (active: boolean) => void;
};

export function PollCard({ page, compact, onInteraction }: PollCardProps) {
  const { colors } = useTheme();
  const answer = useStore((s) => s.pollAnswers[page.pollId] ?? null);
  const answerPoll = useStore((s) => s.answerPoll);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (holdTimer.current) clearTimeout(holdTimer.current);
    },
    [],
  );

  const optionIds = page.options.map((option) => option.id);
  const results = answer ? getPollResults(page.pollId, optionIds, answer) : null;

  const pressIn = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    holdTimer.current = null;
    onInteraction(true);
  };
  // Released without voting (or after a vote): resume — after a reading pause if results show.
  const pressOut = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    holdTimer.current = setTimeout(() => {
      holdTimer.current = null;
      onInteraction(false);
    }, storyMetrics.pollResultHold);
  };
  const vote = (optionId: string) => {
    if (optionId === answer) return;
    haptics.success();
    answerPoll(page.pollId, optionId);
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          padding: compact ? spacing.sm : spacing.md,
          gap: compact ? spacing.xs : spacing.sm,
        },
      ]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text variant={compact ? 'titleMd' : 'titleLg'} accessibilityRole="header" style={styles.title}>
            {POLL_CARD_TITLE}
          </Text>
          {results ? (
            <Chip
              label={STORY_COPY.poll.votes(results.total)}
              icon={Check}
              tone="accent"
              size="sm"
              accessibilityLabel={`${STORY_COPY.poll.votes(results.total)}. ${STORY_COPY.poll.thanks}`}
            />
          ) : null}
        </View>
        <Text variant={compact ? 'labelSm' : 'labelMd'} color="textSecondary">
          {page.question}
        </Text>
      </View>
      <View style={styles.options} accessibilityRole="radiogroup">
        {page.options.map((option) => (
          <PollOption
            key={option.id}
            label={option.label}
            percent={results ? results.percents[option.id] : null}
            mine={option.id === answer}
            labelVariant={compact ? 'bodySm' : 'bodyMd'}
            onPress={() => vote(option.id)}
            onPressIn={pressIn}
            onPressOut={pressOut}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    boxShadow: elevation.lg,
    alignSelf: 'stretch',
  },
  header: { gap: spacing.xxs },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  title: { flex: 1 },
  options: { gap: spacing.xs },
});
