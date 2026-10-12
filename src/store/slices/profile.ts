import { createInitialProfile } from '../initial-state';
import type { Pact, ProfileSlice, SliceCreator } from '../types';

const unique = (values: readonly string[]) => [...new Set(values)];

export const createProfileSlice: SliceCreator<ProfileSlice> = (set, get) => ({
  ...createInitialProfile(),

  updateProfile: (patch) => set(patch),

  setInterests: (interests) => set({ interests: unique(interests) }),

  toggleInterest: (interest) =>
    set((s) => ({
      interests: s.interests.includes(interest) ? s.interests.filter((i) => i !== interest) : [...s.interests, interest],
    })),

  completeOnboarding: (answers = {}) =>
    set((s) => ({
      ...answers,
      name: answers.name?.trim() || s.name,
      interests: answers.interests ? unique(answers.interests) : s.interests,
      onboardingDone: true,
    })),

  setLanguage: (language) => set({ language }),

  setPersonality: (personality) => set({ personality }),

  signPact: (input, now = Date.now()) => {
    const pact: Pact = { ...input, number: (get().pact?.number ?? 0) + 1, signedAt: now };
    set({ pact });
    return pact;
  },

  setVillageName: (villageName) => set({ villageName: villageName.trim() || null }),

  addInvitedFriend: () => set((s) => ({ invitedFriends: s.invitedFriends + 1 })),
});
