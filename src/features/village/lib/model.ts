/**
 * The village derived from the store: every building's state, the walls of each site, today's
 * site (the building of the path's current step, where the partner waits), residents, the ones
 * waiting by a building with a problem, what bricks built, bricks and the day of the pact. And the
 * path itself (`usePath`).
 */
import { getMascot } from '@/content/personality';
import { BUILDING_IDS, BUILDINGS, type BuildingId } from '@/content/village';
import {
  buildingState,
  chaptersDone,
  countResidents,
  currentStepIndex,
  learningPath,
  pactDay,
  selectMascot,
  useStore,
  useStoreShallow,
  waitingReviews,
  type BuildingState,
  type PathStep,
} from '@/store';

import type { VillageModel } from './iso';

export type Village = VillageModel & {
  name: string | null;
  bricks: number;
  /** Day of the pact (1-based) and its length; null before the pact. */
  day: number | null;
  days: number | null;
};

export function useVillage(now: number): Village {
  const s = useStoreShallow((st) => ({
    chapterRecords: st.chapterRecords,
    openSites: st.openSites,
    bloomed: st.bloomed,
    reviews: st.reviews,
    pact: st.pact,
    activeDays: st.activeDays,
    coins: st.coins,
    placements: st.placements,
    villageName: st.villageName,
    mascot: selectMascot(st),
  }));

  const states = {} as Record<BuildingId, BuildingState>;
  const progress: Partial<Record<BuildingId, number>> = {};
  for (const id of BUILDING_IDS) {
    states[id] = buildingState(id, s);
    const total = BUILDINGS[id].chapterIds.length;
    if (total > 0) progress[id] = chaptersDone(id, s.chapterRecords) / total;
  }
  const path = learningPath(s.mascot ? getMascot(s.mascot).startBuildings : []);
  const current = path[currentStepIndex(path, s.chapterRecords)]?.building;

  return {
    states,
    progress,
    current,
    residents: countResidents(s),
    visitors: waitingReviews(s, now),
    placements: s.placements,
    name: s.villageName,
    bricks: s.coins,
    day: s.pact ? pactDay(s.pact, now) : null,
    days: s.pact?.days ?? null,
  };
}

export type LearningPath = {
  steps: PathStep[];
  /** Index of the step to play now; `steps.length` when the path is finished. */
  current: number;
};

/** The path of this player (it depends on the animal) and where they are on it. */
export function usePath(): LearningPath {
  const mascot = useStore(selectMascot);
  const records = useStore((st) => st.chapterRecords);
  const steps = learningPath(mascot ? getMascot(mascot).startBuildings : []);
  return { steps, current: currentStepIndex(steps, records) };
}
