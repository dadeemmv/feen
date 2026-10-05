/**
 * Answers collected while the user walks through onboarding. Non-persisted on purpose: the
 * profile is only written once, on "Inizia il percorso" (`completeOnboarding`), so quitting
 * half-way never leaves a half-filled profile. Logout resets it.
 */
import { create } from 'zustand';

import type { Experience, ReminderSlot } from '@/store';

import type { InterestId } from './data/interests';

export type OnboardingDraft = {
  name: string;
  interests: InterestId[];
  experience: Experience | null;
  goalMinutes: number | null;
  reminders: boolean;
  reminderSlot: ReminderSlot;
  /** "Ho già un account": skip the questions and keep the saved profile. */
  returning: boolean;
};

type DraftState = OnboardingDraft & {
  setName: (name: string) => void;
  toggleInterest: (id: InterestId) => void;
  setExperience: (experience: Experience) => void;
  setGoalMinutes: (minutes: number) => void;
  setReminders: (value: boolean) => void;
  setReminderSlot: (slot: ReminderSlot) => void;
  setReturning: (value: boolean) => void;
  reset: () => void;
};

const createDraft = (): OnboardingDraft => ({
  name: '',
  interests: [],
  experience: null,
  goalMinutes: null,
  reminders: true,
  reminderSlot: 'evening',
  returning: false,
});

export const useOnboardingDraft = create<DraftState>()((set) => ({
  ...createDraft(),
  setName: (name) => set({ name }),
  toggleInterest: (id) =>
    set((s) => ({ interests: s.interests.includes(id) ? s.interests.filter((i) => i !== id) : [...s.interests, id] })),
  setExperience: (experience) => set({ experience }),
  setGoalMinutes: (goalMinutes) => set({ goalMinutes }),
  setReminders: (reminders) => set({ reminders }),
  setReminderSlot: (reminderSlot) => set({ reminderSlot }),
  setReturning: (returning) => set({ returning }),
  reset: () => set(createDraft()),
}));

export const getOnboardingDraft = () => useOnboardingDraft.getState();
