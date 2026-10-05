/**
 * Deterministic pseudo-randomness for lesson steps.
 *
 * Order / match steps shuffle their items with a seed derived from the step id, so the layout is
 * stable across re-renders, remounts and "RIPRENDI DA QUI" resumes, yet different per step.
 * PRNG: mulberry32 (public domain, 32-bit state, good enough for UI shuffles).
 * Seed hashing: FNV-1a 32-bit over UTF-16 code units.
 */

export type Seed = number | string;
export type Rng = () => number;

/** FNV-1a 32-bit hash of a string → unsigned 32-bit integer. */
export function hashString(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

const toSeedInt = (seed: Seed): number => (typeof seed === 'number' ? seed >>> 0 : hashString(seed));

/** mulberry32 generator: returns floats in [0, 1). Same seed → same sequence. */
export function createRng(seed: Seed): Rng {
  let state = toSeedInt(seed);
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Integer in [min, max] (inclusive). */
export function randomInt(rng: Rng, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

/** Deterministic Fisher–Yates shuffle. Never mutates the input. */
export function shuffle<T>(items: readonly T[], seed: Seed): T[] {
  const result = items.slice();
  const rng = createRng(seed);
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = result[i];
    result[i] = result[j];
    result[j] = tmp;
  }
  return result;
}

const MAX_RESHUFFLES = 8;

/**
 * Like `shuffle`, but guarantees the result differs from the input order when that is possible
 * (an order step shown already solved would be pointless). Still deterministic for a seed.
 */
export function shuffleUnsolved<T>(items: readonly T[], seed: Seed, isSame: (a: T, b: T) => boolean = Object.is): T[] {
  if (items.length < 2) return items.slice();
  const unchanged = (candidate: T[]) => candidate.every((item, i) => isSame(item, items[i]));
  for (let attempt = 0; attempt < MAX_RESHUFFLES; attempt += 1) {
    const candidate = shuffle(items, `${String(seed)}#${attempt}`);
    if (!unchanged(candidate)) return candidate;
  }
  // Fallback that can never equal the input: rotate by one.
  return [...items.slice(1), items[0]];
}

/** Deterministic pick of one element (undefined for an empty list). */
export function pick<T>(items: readonly T[], seed: Seed): T | undefined {
  if (items.length === 0) return undefined;
  return items[Math.floor(createRng(seed)() * items.length)];
}
