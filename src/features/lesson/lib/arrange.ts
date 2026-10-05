/**
 * Stable layouts for answer pieces (seeded by the step id, so a resumed lesson shows the same
 * arrangement and nothing reshuffles on re-render).
 */
import { shuffle, shuffleUnsolved } from '@/lib/random';

const MAX_ATTEMPTS = 12;

/**
 * Shuffle where no item keeps its original index (match columns: no meaning sits right next to
 * its own term). Falls back to a rotation, which is always a derangement for 2+ items.
 */
export function derange<T>(items: readonly T[], seed: string): T[] {
  if (items.length < 2) return items.slice();
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const candidate = shuffle(items, `${seed}~${attempt}`);
    if (candidate.every((item, index) => item !== items[index])) return candidate;
  }
  return [...items.slice(1), items[0]];
}

/** Word bank order for an order step: never the solved order. */
export function bankOrder<T extends { id: string }>(items: readonly T[], seed: string): T[] {
  return shuffleUnsolved(items, seed, (a, b) => a.id === b.id);
}
