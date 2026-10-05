/**
 * Home unlock milestones ("Sblocca dopo n lezioni"): progress = completed lessons / threshold.
 * Content lives in `@/content/shop` (MILESTONES); this module only derives state from it.
 */
import type { Milestone } from '@/content/extra-types';
import { MILESTONES } from '@/content/shop';

export type ResolvedMilestone = Milestone & {
  /** Completed lessons counted towards the threshold (capped at the threshold). */
  current: number;
  /** 0…1. */
  progress: number;
  reached: boolean;
  claimed: boolean;
};

export function findMilestone(milestoneId: string): Milestone | undefined {
  return MILESTONES.find((m) => m.id === milestoneId);
}

export function resolveMilestone(milestone: Milestone, lessonsCompleted: number, claimedIds: readonly string[]): ResolvedMilestone {
  const threshold = Math.max(1, milestone.threshold);
  const current = Math.min(lessonsCompleted, threshold);
  return {
    ...milestone,
    current,
    progress: current / threshold,
    reached: lessonsCompleted >= threshold,
    claimed: claimedIds.includes(milestone.id),
  };
}

/** All milestones in content order (ascending thresholds). */
export function resolveMilestones(lessonsCompleted: number, claimedIds: readonly string[]): ResolvedMilestone[] {
  return MILESTONES.map((m) => resolveMilestone(m, lessonsCompleted, claimedIds));
}

/** The milestone whose threshold is crossed going from `before` to `after` lessons, if any. */
export function findCrossedMilestone(before: number, after: number): Milestone | undefined {
  return MILESTONES.find((m) => before < m.threshold && after >= m.threshold);
}
