/**
 * Persistence plumbing: AsyncStorage JSON storage, SSR guard, merge and migrations.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { createJSONStorage, type StateStorage } from 'zustand/middleware';

import { createInitialData, PERSISTED_KEYS } from './initial-state';
import type { PersistedData, RootState } from './types';

/**
 * Web static rendering (app.json `web.output: "static"`) evaluates this module in Node, where
 * AsyncStorage's localStorage backend does not exist: use an inert storage there.
 */
const serverStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

const isServer = Platform.OS === 'web' && typeof window === 'undefined';

export const storage = createJSONStorage<PersistedData>(() => (isServer ? serverStorage : AsyncStorage));

/** Only data fields are written: actions and `_hasHydrated` are excluded. */
export function partialize(state: RootState): PersistedData {
  const data = {} as Record<keyof PersistedData, unknown>;
  for (const key of PERSISTED_KEYS) data[key] = state[key];
  return data as PersistedData;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Version migrations. v1 is the first shipped schema; older/unknown blobs are sanitised by
 * `mergePersisted` (unknown keys dropped, missing keys defaulted).
 */
export function migrate(persisted: unknown, version: number): PersistedData {
  const data = isRecord(persisted) ? persisted : {};
  switch (version) {
    // case 1: → future v2 transforms go here, falling through to the latest version.
    default:
      return data as PersistedData;
  }
}

/**
 * Deep-enough merge of the persisted blob into the fresh state: keeps only known keys, drops
 * values whose type does not match the defaults and merges nested `settings` so settings added
 * in a later version get their default instead of `undefined`.
 */
export function mergePersisted(persisted: unknown, current: RootState): RootState {
  if (!isRecord(persisted)) return current;
  const defaults = createInitialData();
  const next: Record<string, unknown> = {};
  for (const key of PERSISTED_KEYS) {
    const value = persisted[key];
    const fallback = defaults[key];
    if (value === undefined) continue;
    const sameShape =
      fallback === null ||
      value === null ||
      (Array.isArray(fallback) ? Array.isArray(value) : typeof value === typeof fallback);
    if (!sameShape) continue;
    next[key] = isRecord(fallback) && isRecord(value) && key === 'settings' ? { ...fallback, ...value } : value;
  }
  return { ...current, ...(next as Partial<PersistedData>) };
}
