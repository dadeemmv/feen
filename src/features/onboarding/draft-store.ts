/**
 * Answers collected while the user walks through onboarding. Non-persisted on purpose: the
 * profile is only written once, on "Inizia il percorso" (`completeOnboarding`), so quitting
 * half-way never leaves a half-filled profile. Logout resets it.
 */
import { create } from 'zustand';

import type { AgreementValue } from '@/content/personality';
import type { Experience, ReminderSlot } from '@/store';

import type { InterestId } from './data/interests';

export type OnboardingDraft = {
  name: string;
  interests: InterestId[];
  /** Personality test: statement id → agreement (−3…+3), and the statement on screen. */
  quizAnswers: Record<string, AgreementValue>;
  quizIndex: number;
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
  setQuizAnswer: (statementId: string, value: AgreementValue) => void;
  setQuizIndex: (index: number) => void;
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
  quizAnswers: {},
  quizIndex: 0,
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
  setQuizAnswer: (statementId, value) => set((s) => ({ quizAnswers: { ...s.quizAnswers, [statementId]: value } })),
  setQuizIndex: (quizIndex) => set({ quizIndex }),
  setExperience: (experience) => set({ experience }),
  setGoalMinutes: (goalMinutes) => set({ goalMinutes }),
  setReminders: (reminders) => set({ reminders }),
  setReminderSlot: (reminderSlot) => set({ reminderSlot }),
  setReturning: (returning) => set({ returning }),
  reset: () => set(createDraft()),
}));

export const getOnboardingDraft = () => useOnboardingDraft.getState();
