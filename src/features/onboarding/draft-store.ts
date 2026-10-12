/**
 * Answers collected while the user walks through onboarding. Non-persisted on purpose: the
 * profile is only written once, on "Inizia il percorso" (`completeOnboarding`), so quitting
 * half-way never leaves a half-filled profile. Logout resets it.
 */
import { create } from 'zustand';

import type { ChoiceValue } from '@/content/personality';
import { DOSE_OPTIONS, PACT_DAYS, WHEN_OPTIONS, WHY_OPTIONS } from '@/features/pact/data';
import type { Experience, PactSignature, ReminderSlot } from '@/store';

import type { InterestId } from './data/interests';

export type OnboardingDraft = {
  name: string;
  interests: InterestId[];
  /** Personality test: scenario id → choice (−3…+3), and the scenario on screen. */
  quizAnswers: Record<string, ChoiceValue>;
  quizIndex: number;
  experience: Experience | null;
  goalMinutes: number | null;
  reminders: boolean;
  reminderSlot: ReminderSlot;
  /** "Ho già un account": skip the questions and keep the saved profile. */
  returning: boolean;
  /** The pact's terms (Art. 1–3), its signature and when it was sealed. */
  pactWhy: string;
  pactMinutes: number;
  pactDays: number;
  pactWhen: string;
  signature: PactSignature | null;
  signedAt: number | null;
  villageName: string;
};

type DraftState = OnboardingDraft & {
  setName: (name: string) => void;
  toggleInterest: (id: InterestId) => void;
  setQuizAnswer: (statementId: string, value: ChoiceValue) => void;
  setQuizIndex: (index: number) => void;
  setExperience: (experience: Experience) => void;
  setGoalMinutes: (minutes: number) => void;
  setReminders: (value: boolean) => void;
  setReminderSlot: (slot: ReminderSlot) => void;
  setReturning: (value: boolean) => void;
  setPactTerms: (terms: Partial<Pick<OnboardingDraft, 'pactWhy' | 'pactMinutes' | 'pactWhen'>>) => void;
  sealPact: (signature: NonNullable<OnboardingDraft['signature']>, at: number) => void;
  setVillageName: (name: string) => void;
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
  pactWhy: WHY_OPTIONS[0],
  pactMinutes: DOSE_OPTIONS[0],
  pactDays: PACT_DAYS,
  pactWhen: WHEN_OPTIONS[0].text,
  signature: null,
  signedAt: null,
  villageName: '',
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
  setPactTerms: (terms) => set(terms),
  sealPact: (signature, signedAt) => set({ signature, signedAt }),
  setVillageName: (villageName) => set({ villageName }),
  reset: () => set(createDraft()),
}));

export const getOnboardingDraft = () => useOnboardingDraft.getState();
