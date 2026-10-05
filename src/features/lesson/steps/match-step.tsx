/**
 * Match ("Collega ogni termine al suo significato"): terms on the left, meanings on the right
 * (deranged so no meaning starts next to its own term). Tap one tile on each side, in any order:
 * - right pair → both flash green, then lock as "matched";
 * - wrong pair → both turn red and shake, then reset. It counts as a mistake and, through the
 *   controller, costs at most one life for the whole step.
 * Every pair matched → the answer is complete and "Continua" checks it.
 */
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text, borderWidth, tileSize } from '@/components/ui';
import { PopIn } from '@/features/rewards';
import type { MatchStep as MatchStepData } from '@/content/types';
import { haptics } from '@/lib/haptics';
import { radius, spacing, useTheme } from '@/theme';

import { COPY } from '../copy';
import { checkPair, matchedPairs } from '../machine';
import { MATCH_LOCK_MS, MATCH_MISS_MS } from '../metrics';
import { derange } from '../lib/arrange';
import { OptionTile, type OptionStatus } from '../components/option-tile';
import { GradedStepCard, StepPrompt } from '../components/step-layout';
import { isAnswering, type StepViewProps } from './types';

type Side = 'left' | 'right';
type Flash = { left: string; right: string; kind: 'correct' | 'wrong' };

export function MatchStep({
  step,
  answer,
  phase,
  onSelect,
  onMatchMiss,
  bottomInset,
  compact,
}: StepViewProps<MatchStepData>) {
  const [pick, setPick] = useState<{ side: Side; id: string } | null>(null);
  const [flash, setFlash] = useState<Flash | null>(null);
  const [missSignal, setMissSignal] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const matched = matchedPairs(answer);
  const matchedRight = new Set(Object.values(matched));
  // Pair number = order in which pairs were locked (object keys keep insertion order).
  const pairNumber = (side: Side, id: string): number | undefined => {
    const left = side === 'left' ? id : Object.keys(matched).find((key) => matched[key] === id);
    const index = left === undefined ? -1 : Object.keys(matched).indexOf(left);
    return index >= 0 ? index + 1 : undefined;
  };
  const answering = isAnswering(phase);
  const rights = derange(step.pairs, step.id);

  const resolvePair = (left: string, right: string) => {
    setPick(null);
    if (checkPair(step, left, right)) {
      haptics.selection();
      setFlash({ left, right, kind: 'correct' });
      onSelect({ ...matched, [left]: right });
      timer.current = setTimeout(() => setFlash(null), MATCH_LOCK_MS);
      return;
    }
    // The controller refuses the miss when the user is out of lives: still shake, count nothing.
    onMatchMiss(left, right);
    setMissSignal((n) => n + 1);
    setFlash({ left, right, kind: 'wrong' });
    timer.current = setTimeout(() => setFlash(null), MATCH_MISS_MS);
  };

  const press = (side: Side, id: string) => {
    if (!answering || flash !== null) return;
    if (pick === null || pick.side === side) {
      setPick(pick?.id === id && pick.side === side ? null : { side, id });
      return;
    }
    if (side === 'left') resolvePair(id, pick.id);
    else resolvePair(pick.id, id);
  };

  const statusOf = (side: Side, id: string): OptionStatus => {
    const isMatched = side === 'left' ? matched[id] !== undefined : matchedRight.has(id);
    if (flash && flash[side] === id) return flash.kind;
    if (isMatched || !answering) return 'matched';
    if (pick?.side === side && pick.id === id) return 'selected';
    return 'idle';
  };

  const tile = (side: Side, id: string, label: string) => {
    const status = statusOf(side, id);
    const number = status === 'matched' || status === 'correct' ? pairNumber(side, id) : undefined;
    return (
      <View key={`${side}-${id}`} style={styles.cell}>
        <OptionTile
          label={label}
          status={status}
          onPress={() => press(side, id)}
          locked={!answering || status === 'matched'}
          indicator={false}
          role="button"
          labelVariant={side === 'left' ? 'labelLg' : 'bodyMd'}
          shakeSignal={status === 'wrong' ? missSignal : 0}
          style={styles.fill}
          faceStyle={styles.face}
          testID={`match-${side}-${id}`}
        />
        {number !== undefined ? <PairBadge number={number} /> : null}
      </View>
    );
  };

  return (
    <GradedStepCard
      tag={step.tag}
      prompt={<StepPrompt>{step.prompt}</StepPrompt>}
      bottomInset={bottomInset}
      compact={compact}>
      <Text variant="labelSm" color="textTertiary" align="center">
        {COPY.steps.matchHint}
      </Text>
      {step.pairs.map((pair, index) => (
        <View key={pair.id} style={styles.row}>
          {tile('left', pair.id, pair.left)}
          {tile('right', rights[index].id, rights[index].right)}
        </View>
      ))}
    </GradedStepCard>
  );
}

/**
 * Small numbered disc pinned to the corner of both tiles of a locked pair, so pairs read at a
 * glance while the labels stay centred. It pops in with the lock.
 */
function PairBadge({ number }: { number: number }) {
  const theme = useTheme();
  return (
    <PopIn style={styles.corner}>
      <View
        aria-hidden
        style={[
          styles.badge,
          {
            backgroundColor: theme.colors.successSolid,
            borderColor: theme.colors.surface,
          },
        ]}>
        <Text variant="labelSm" color="onBrand" tabular>
          {number}
        </Text>
      </View>
    </PopIn>
  );
}

const styles = StyleSheet.create({
  corner: { position: 'absolute', top: -spacing.xxs, left: -spacing.xxs },
  badge: {
    width: tileSize.sm - spacing.xs,
    height: tileSize.sm - spacing.xs,
    borderRadius: radius.pill,
    borderWidth: borderWidth.thick,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'stretch', gap: spacing.xs },
  cell: { flex: 1 },
  fill: { flexGrow: 1 },
  face: { paddingHorizontal: spacing.sm, justifyContent: 'center' },
});
