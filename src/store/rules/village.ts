/**
 * Village rules (pure). A building's state is derived, never stored:
 *   progetto  → the lot is marked on the ground, opens when the path reaches it;
 *   cantiere  → opened as a site: each lesson raises the walls;
 *   costruito → all its lessons done;
 *   fiorito   → built, and the review brought by a resident a week later was right.
 * The Town Hall stands from the first stone (the signed pact). Residents count the days of the
 * pact that were kept: a skipped day takes nobody away.
 */
import {
  BUILDING_IDS,
  BUILDINGS,
  buildingOfChapter,
  DECORS,
  FIRST_STONE,
  MAX_OPEN_SITES,
  PATH_ORDER,
  RESIDENTS_PER_HOUSE,
  VILLAGE_LOTS,
  type BuildingId,
  type DecorId,
} from '@/content/village';
import { toDayKey } from '@/lib/dates';

import type { BuildFailure, OpenSiteFailure, Pact, Placement, ProgressData } from '../types';

export type BuildingState = 'progetto' | 'cantiere' | 'costruito' | 'fiorito';

type VillageInput = Pick<ProgressData, 'chapterRecords' | 'openSites' | 'bloomed'> & { pact: Pact | null };

/** Lessons of a building completed at least once. */
export function chaptersDone(id: BuildingId, records: ProgressData['chapterRecords']): number {
  return BUILDINGS[id].chapterIds.filter((chapterId) => records[chapterId] !== undefined).length;
}

export function isBuilt(id: BuildingId, s: Pick<VillageInput, 'chapterRecords' | 'pact'>): boolean {
  if (id === FIRST_STONE) return s.pact !== null;
  const { chapterIds } = BUILDINGS[id];
  return chapterIds.length > 0 && chaptersDone(id, s.chapterRecords) === chapterIds.length;
}

export function buildingState(id: BuildingId, s: VillageInput): BuildingState {
  if (isBuilt(id, s)) return s.bloomed.includes(id) ? 'fiorito' : 'costruito';
  return s.openSites.includes(id) ? 'cantiere' : 'progetto';
}

/** Sites still open: opened and not built yet (built ones drop out automatically). */
export function activeSites(s: VillageInput): BuildingId[] {
  return s.openSites.filter((id) => !isBuilt(id, s));
}

/** Why a project cannot be opened right now, or null when it can. */
export function openSiteIssue(id: BuildingId, s: VillageInput): OpenSiteFailure | null {
  const building = BUILDINGS[id];
  if (isBuilt(id, s)) return 'built';
  if (building.chapterIds.length === 0) return 'no-lessons';
  if (building.requires && !isBuilt(building.requires, s)) return 'needs-building';
  const sites = activeSites(s);
  if (!sites.includes(id) && sites.length >= MAX_OPEN_SITES) return 'too-many';
  return null;
}

/** Next lesson to play in a building (first not completed), or the first one to practise. */
export function nextChapterOf(id: BuildingId, records: ProgressData['chapterRecords']): string | undefined {
  const { chapterIds } = BUILDINGS[id];
  return chapterIds.find((chapterId) => records[chapterId] === undefined) ?? chapterIds[0];
}

/** Sites after a lesson: its building joins them if it was a project; built ones drop out. */
export function sitesAfterLesson(chapterId: string, s: VillageInput): BuildingId[] {
  const id = buildingOfChapter(chapterId);
  const opened = id && !s.openSites.includes(id) ? [...s.openSites, id] : s.openSites;
  return opened.filter((site) => !isBuilt(site, s));
}

/** Residents: one per day of the pact that was kept (a day with at least one lesson). */
export function countResidents(s: { activeDays: readonly string[]; pact: Pact | null }): number {
  if (!s.pact) return 0;
  const from = toDayKey(s.pact.signedAt);
  return s.activeDays.filter((day) => day >= from).length;
}

/** Day of the pact (1-based), capped at its length. */
export function pactDay(pact: Pact, now: number): number {
  const start = new Date(pact.signedAt);
  start.setHours(0, 0, 0, 0);
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const days = Math.round((today.getTime() - start.getTime()) / 86_400_000) + 1;
  return Math.min(pact.days, Math.max(1, days));
}

/* ── The path ──────────────────────────────────────────────────────────────────────────────── */

/** One step of the path: a lesson and the building it raises. */
export type PathStep = { chapterId: string; building: BuildingId };

/** `fatta` = done, `oggi` = the step to play now, `chiusa` = opens after the one before. */
export type StepStatus = 'fatta' | 'oggi' | 'chiusa';

/**
 * The path: the animal's start buildings first, then `PATH_ORDER`, each building with all its
 * lessons in order. A building that needs another (the Tower after the Well) pulls it in first.
 */
export function learningPath(starts: readonly BuildingId[]): PathStep[] {
  const order: BuildingId[] = [];
  const add = (id: BuildingId) => {
    if (order.includes(id)) return;
    const { requires } = BUILDINGS[id];
    if (requires) add(requires);
    order.push(id);
  };
  for (const id of [...starts, ...PATH_ORDER]) if (BUILDINGS[id].chapterIds.length > 0) add(id);
  return order.flatMap((building) => BUILDINGS[building].chapterIds.map((chapterId) => ({ chapterId, building })));
}

/** Index of the step to play now: the first not done. `path.length` when the path is finished. */
export function currentStepIndex(path: readonly PathStep[], records: ProgressData['chapterRecords']): number {
  const index = path.findIndex((step) => records[step.chapterId] === undefined);
  return index === -1 ? path.length : index;
}

export function stepStatus(index: number, current: number, step: PathStep, records: ProgressData['chapterRecords']): StepStatus {
  if (records[step.chapterId] !== undefined) return 'fatta';
  return index === current ? 'oggi' : 'chiusa';
}

/** Where the partner suggests to go next: an open site, else the animal's first start building. */
export function suggestedBuilding(s: VillageInput, starts: readonly BuildingId[]): BuildingId | undefined {
  const sites = activeSites(s);
  if (sites.length > 0) return sites[0];
  return [...starts, ...BUILDING_IDS].find((id) => openSiteIssue(id, s) === null);
}

/* ── What bricks build ─────────────────────────────────────────────────────────────────────── */

/** Lots still free, in the order of `VILLAGE_LOTS`. */
export function freeLots(placements: readonly Placement[]): number[] {
  const taken = new Set(placements.map((p) => p.lot));
  return VILLAGE_LOTS.map((_, lot) => lot).filter((lot) => !taken.has(lot));
}

/** Houses bought with bricks. */
export const countHouses = (placements: readonly Placement[]): number => placements.filter((p) => p.kind === 'casa').length;

/** Residents still in a tent: a house holds four, the rest wait (happy all the same). */
export const countInTents = (residents: number, placements: readonly Placement[]): number =>
  Math.max(0, residents - countHouses(placements) * RESIDENTS_PER_HOUSE);

/** Why this cannot be built there right now, or null when it can. */
export function buildIssue(kind: DecorId, lot: number, s: { coins: number; placements: readonly Placement[] }): BuildFailure | null {
  if (!Number.isInteger(lot) || lot < 0 || lot >= VILLAGE_LOTS.length) return 'no-lot';
  if (s.placements.some((p) => p.lot === lot)) return 'taken';
  if (s.coins < DECORS[kind].cost) return 'bricks';
  return null;
}
