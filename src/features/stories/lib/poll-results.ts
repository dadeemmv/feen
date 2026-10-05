/**
 * Poll results shown after voting. There is no backend in this build, so the community votes are
 * a fixed, plausible baseline (seeded per poll) and the user's own vote is added on top: the bar
 * of the chosen option always moves, and percentages always sum to 100.
 */
import { createRng, randomInt } from '@/lib/random';

/** Hand-tuned baselines for the polls shipped in `@/content/stories`. */
const BASELINES: Record<string, Record<string, number>> = {
  'level-1-clarity': {
    'very-clear': 562,
    'fairly-clear': 389,
    'bit-confused': 196,
    'washing-machine': 101,
  },
};

/** Fallback for new polls: decreasing, seeded shares (most people pick the first answers). */
function seededBaseline(pollId: string, optionIds: readonly string[]): Record<string, number> {
  const rng = createRng(pollId);
  return Object.fromEntries(optionIds.map((id, index) => [id, randomInt(rng, 80, 160) * (optionIds.length - index)]));
}

export type PollResults = {
  total: number;
  /** optionId → whole percentage (sums to 100). */
  percents: Record<string, number>;
};

export function getPollResults(pollId: string, optionIds: readonly string[], userChoice: string | null): PollResults {
  const baseline = BASELINES[pollId] ?? seededBaseline(pollId, optionIds);
  const counts = optionIds.map((id) => (baseline[id] ?? 0) + (id === userChoice ? 1 : 0));
  const total = counts.reduce((sum, n) => sum + n, 0);
  if (total === 0)
    return {
      total,
      percents: Object.fromEntries(optionIds.map((id) => [id, 0])),
    };

  // Largest remainder method: floor every share, then hand the missing points to the largest
  // fractional parts, so the bars never add up to 99 % or 101 %.
  const raw = counts.map((n) => (n / total) * 100);
  const floors = raw.map(Math.floor);
  let missing = 100 - floors.reduce((sum, n) => sum + n, 0);
  const order = raw.map((value, index) => ({ index, rest: value - floors[index] })).sort((a, b) => b.rest - a.rest);
  for (const { index } of order) {
    if (missing <= 0) break;
    floors[index] += 1;
    missing -= 1;
  }
  return {
    total,
    percents: Object.fromEntries(optionIds.map((id, index) => [id, floors[index]])),
  };
}
