/**
 * Meta slice: stories seen, poll answers, daily flags, settings and the hydration flag.
 */
import { toDayKey } from '@/lib/dates';

import { createInitialData, createInitialMeta } from '../initial-state';
import type { MetaSlice, SliceCreator } from '../types';

export const createMetaSlice: SliceCreator<MetaSlice> = (set, get) => ({
  ...createInitialMeta(),
  _hasHydrated: false,

  setHasHydrated: (value) => set({ _hasHydrated: value }),

  markStorySeen: (storyId) =>
    set((s) => (s.seenStories.includes(storyId) ? s : { seenStories: [...s.seenStories, storyId] })),

  answerPoll: (pollId, optionId) => set((s) => ({ pollAnswers: { ...s.pollAnswers, [pollId]: optionId } })),

  setSetting: (key, value) => set((s) => ({ settings: { ...s.settings, [key]: value } })),

  markReferralPromoShown: (now = Date.now()) => set({ lastReferralPromoOn: toDayKey(now) }),

  setReminderSlot: (reminderSlot) => set({ reminderSlot }),

  markCodeRedeemed: (code) => {
    if (get().redeemedCodes.includes(code)) return false;
    set((s) => ({ redeemedCodes: [...s.redeemedCodes, code] }));
    return true;
  },

  setAppRating: (rating) => set({ appRating: Math.min(5, Math.max(1, Math.round(rating))) }),

  toggleCourseNotify: (courseId) => {
    const on = !get().notifyCourseIds.includes(courseId);
    set((s) => ({
      notifyCourseIds: on ? [...s.notifyCourseIds, courseId] : s.notifyCourseIds.filter((id) => id !== courseId),
    }));
    return on;
  },

  resetAll: () => set({ ...createInitialData(), _hasHydrated: true }),
});
