/**
 * Initial data of every slice — the demo user from the reference video.
 * Factories (not constants) so arrays/objects are never shared between resets.
 */
import { MAX_LIVES } from './constants';
import type { EconomyData, MetaData, PersistedData, ProfileData, ProgressData } from './types';

export const createInitialProfile = (): ProfileData => ({
  name: 'Alberto',
  email: 'alberto.rossi@finanz.app',
  avatar: '🤠',
  interests: [],
  goalMinutes: 5,
  experience: 'beginner',
  onboardingDone: false,
  referralCode: 'ZGGK2O',
  invitedFriends: 0,
  language: 'it',
});

export const createInitialEconomy = (): EconomyData => ({
  coins: 0,
  lives: MAX_LIVES,
  maxLives: MAX_LIVES,
  lastLifeAt: null,
  unlimitedUntil: null,
  proUntil: null,
  shields: 0,
  purchases: [],
});

export const createInitialProgress = (): ProgressData => ({
  chapterRecords: {},
  session: null,
  activeDays: [],
  shieldedDays: [],
  xp: 0,
  claimedMilestones: [],
  claimedChallenges: [],
});

export const createInitialMeta = (): MetaData => ({
  seenStories: [],
  pollAnswers: {},
  dailyRewardClaimedOn: null,
  lastReferralPromoOn: null,
  settings: { haptics: true, sound: true, reduceMotion: false, notifications: true },
  reminderSlot: 'evening',
  redeemedCodes: [],
  appRating: null,
  notifyCourseIds: [],
});

/** All persisted fields (no actions, no `_hasHydrated`). */
export const createInitialData = (): PersistedData => ({
  ...createInitialProfile(),
  ...createInitialEconomy(),
  ...createInitialProgress(),
  ...createInitialMeta(),
});

/** The keys written to AsyncStorage — derived from the initial data, so it is always complete. */
export const PERSISTED_KEYS = Object.keys(createInitialData()) as (keyof PersistedData)[];
