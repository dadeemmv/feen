/**
 * The village derived from the store: every building's state, the walls of each site, today's
 * site (where the partner waits), residents, bricks and the day of the pact.
 */
import { getMascot } from '@/content/personality';
import { BUILDING_IDS, BUILDINGS, type BuildingId } from '@/content/village';
import {
  activeSites,
  buildingState,
  chaptersDone,
  countResidents,
  pactDay,
  selectMascot,
  suggestedBuilding,
  useStoreShallow,
  type BuildingState,
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
    pact: st.pact,
    activeDays: st.activeDays,
    coins: st.coins,
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
  const starts = s.mascot ? getMascot(s.mascot).startBuildings : [];
  const current = activeSites(s)[0] ?? suggestedBuilding(s, starts);

  return {
    states,
    progress,
    current,
    residents: countResidents(s),
    houses: 0,
    name: s.villageName,
    bricks: s.coins,
    day: s.pact ? pactDay(s.pact, now) : null,
    days: s.pact?.days ?? null,
  };
}
