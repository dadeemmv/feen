/**
 * Root store types. One persisted zustand store assembled from four slices
 * (docs/ARCHITECTURE.md §4). Data fields are JSON-serialisable (timestamps are epoch ms,
 * days are local 'YYYY-MM-DD' keys) so the whole object round-trips through AsyncStorage.
 */
import type { StateCreator } from 'zustand';

import type { MascotId } from '@/content/personality';
import type { DayKey } from '@/lib/dates';

import type { ResolvedChallenge } from './challenges';
import type { ResolvedMilestone } from './milestones';

/* ------------------------------------------------------------------------------------------ */
/* Profile                                                                                     */
/* ------------------------------------------------------------------------------------------ */

export type Experience = 'beginner' | 'some' | 'expert';

/** Outcome of the money-personality test ("Che tipo sei con i soldi?"). */
export type PersonalityResult = {
  /** The companion mascot assigned by the test. */
  mascot: MascotId;
  /** Lean towards the future on the present ↔ future axis, 0…100. */
  future: number;
  /** Lean towards boldness on the safe ↔ bold axis, 0…100. */
  bold: number;
  /** Epoch ms. */
  takenAt: number;
};
export type AppLanguage = 'it' | 'en';

export type ProfileData = {
  name: string;
  email: string;
  avatar: string;
  interests: string[];
  /** Daily study goal chosen in onboarding. */
  goalMinutes: number;
  experience: Experience;
  /** Money-personality test result; null until the test is taken. */
  personality: PersonalityResult | null;
  onboardingDone: boolean;
  referralCode: string;
  /** Friends who redeemed the referral code (0…3 for the "30 giorni di Finanz Pro" promo). */
  invitedFriends: number;
  language: AppLanguage;
};

export type OnboardingAnswers = Partial<Pick<ProfileData, 'name' | 'interests' | 'goalMinutes' | 'experience' | 'avatar' | 'personality'>>;

export type ProfileActions = {
  updateProfile: (patch: Partial<Omit<ProfileData, 'referralCode'>>) => void;
  setInterests: (interests: string[]) => void;
  toggleInterest: (interest: string) => void;
  completeOnboarding: (answers?: OnboardingAnswers) => void;
  setLanguage: (language: AppLanguage) => void;
  setPersonality: (result: PersonalityResult) => void;
  addInvitedFriend: () => void;
};

export type ProfileSlice = ProfileData & ProfileActions;

/* ------------------------------------------------------------------------------------------ */
/* Economy                                                                                     */
/* ------------------------------------------------------------------------------------------ */

export type Purchase = {
  id: string;
  itemId: string;
  title: string;
  /** Kiwi coins paid. */
  price: number;
  /** Epoch ms. */
  at: number;
};

export type EconomyData = {
  coins: number;
  lives: number;
  maxLives: number;
  /** Start of the running refill clock (epoch ms); null when lives are full. */
  lastLifeAt: number | null;
  /** Unlimited lives until (epoch ms). */
  unlimitedUntil: number | null;
  /** Finanz Pro active until (epoch ms). */
  proUntil: number | null;
  /** Streak shields owned (not yet consumed). */
  shields: number;
  purchases: Purchase[];
};

export type BuyFailureReason = 'insufficient-coins' | 'already-claimed' | 'lives-full';
export type BuyResult = { ok: true } | { ok: false; reason: BuyFailureReason };

export type EconomyActions = {
  /** Atomic check + deduct. Returns false (and changes nothing) when coins are insufficient. */
  spend: (amount: number) => boolean;
  earn: (amount: number) => void;
  /** Returns true when a life was actually lost (false when unlimited/Pro or already at 0). */
  loseLife: (now?: number) => boolean;
  /** Commits the lives refilled by the clock; returns the current lives. */
  syncLives: (now?: number) => number;
  addLives: (amount: number, now?: number) => void;
  activateUnlimited: (minutes: number, now?: number) => void;
  activatePro: (days: number, now?: number) => void;
  addShields: (amount: number) => void;
  buy: (itemId: string, now?: number) => BuyResult;
  claimDailyReward: (now?: number) => BuyResult;
};

export type EconomySlice = EconomyData & EconomyActions;

/* ------------------------------------------------------------------------------------------ */
/* Progress                                                                                    */
/* ------------------------------------------------------------------------------------------ */

export type ChapterRecord = {
  /** First completion (epoch ms). */
  completedAt: number;
  /** Most recent completion (epoch ms). */
  lastCompletedAt: number;
  /** Best accuracy 0…1. */
  accuracy: number;
  /** XP earned on this chapter, all runs included. */
  xp: number;
  /** Number of completed runs (1 = first completion, >1 = practice). */
  runs: number;
};

export type LessonSession = {
  chapterId: string;
  stepIndex: number;
  lostLifeStepIds: string[];
  mistakeStepIds: string[];
  updatedAt: number;
};

export type ProgressData = {
  chapterRecords: Record<string, ChapterRecord>;
  /** The lesson in progress ("RIPRENDI DA QUI"); one at a time. */
  session: LessonSession | null;
  /** Local days with at least one completed chapter, ascending, unique. */
  activeDays: DayKey[];
  /** Missed days bridged by a consumed streak shield, ascending, unique. */
  shieldedDays: DayKey[];
  xp: number;
  claimedMilestones: string[];
  /** Marathon (streak) challenges whose coins were collected. */
  claimedChallenges: string[];
};

export type CompleteChapterInput = {
  chapterId: string;
  /** 0…1 from `computeAccuracy`. */
  accuracy: number;
  xp: number;
  coins: number;
  now?: number;
};

export type CompletionSummary = {
  xpEarned: number;
  coinsEarned: number;
  accuracy: number;
  /** First completion of this chapter (false for a practice replay). */
  isFirstCompletion: boolean;
  streakBefore: number;
  streakAfter: number;
  /** Today was not active before this completion (streak flame lights up). */
  isNewStreakDay: boolean;
  /** Lesson-count milestone crossed by this completion, if any (replays count as lessons). */
  milestoneReached?: ResolvedMilestone;
};

export type SyncStreakResult = { shieldsConsumed: number; bridgedDays: DayKey[] };

export type ClaimMilestoneResult =
  | { ok: true; milestone: ResolvedMilestone }
  | { ok: false; reason: 'not-found' | 'locked' | 'already-claimed' };

export type ClaimChallengeResult =
  | { ok: true; challenge: ResolvedChallenge }
  | { ok: false; reason: 'not-found' | 'locked' | 'already-claimed' };

export type ProgressActions = {
  /** Returns the session to play: the saved one for this chapter, or a fresh one at step 0. */
  startOrResumeSession: (chapterId: string, now?: number) => LessonSession;
  saveSessionStep: (
    chapterId: string,
    stepIndex: number,
    lostLifeStepIds: readonly string[],
    mistakeStepIds?: readonly string[],
    now?: number,
  ) => void;
  clearSession: () => void;
  completeChapter: (input: CompleteChapterInput) => CompletionSummary;
  /** Consumes shields for a missed yesterday (see `computeStreak`). Call on launch/foreground. */
  syncStreak: (now?: number) => SyncStreakResult;
  claimMilestone: (milestoneId: string, now?: number) => ClaimMilestoneResult;
  /** Collects the coins of a reached marathon challenge ("Sfide Maratona"). */
  claimChallenge: (challengeId: string, now?: number) => ClaimChallengeResult;
};

export type ProgressSlice = ProgressData & ProgressActions;

/* ------------------------------------------------------------------------------------------ */
/* Meta                                                                                        */
/* ------------------------------------------------------------------------------------------ */

export type Settings = {
  haptics: boolean;
  sound: boolean;
  reduceMotion: boolean;
  notifications: boolean;
};

/** Preferred time of the daily study reminder (Account → Impostazioni). */
export type ReminderSlot = 'morning' | 'afternoon' | 'evening';

export type MetaData = {
  seenStories: string[];
  /** pollId → optionId. */
  pollAnswers: Record<string, string>;
  dailyRewardClaimedOn: DayKey | null;
  lastReferralPromoOn: DayKey | null;
  settings: Settings;
  reminderSlot: ReminderSlot;
  /** Normalised promo codes already redeemed ("Utilizza codice": each code works once). */
  redeemedCodes: string[];
  /** Last rating given in "Valuta app" (1…5), null when never rated. */
  appRating: number | null;
  /** Coming-soon courses the user asked to be notified about (Academy bell). */
  notifyCourseIds: string[];
};

export type MetaState = MetaData & {
  /** true once AsyncStorage has been read (never persisted). */
  _hasHydrated: boolean;
};

export type MetaActions = {
  setHasHydrated: (value: boolean) => void;
  markStorySeen: (storyId: string) => void;
  answerPoll: (pollId: string, optionId: string) => void;
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  markReferralPromoShown: (now?: number) => void;
  setReminderSlot: (slot: ReminderSlot) => void;
  /** Returns false when the code was already redeemed. */
  markCodeRedeemed: (code: string) => boolean;
  setAppRating: (rating: number) => void;
  /** Toggles the "Avvisami" bell of a coming-soon course; returns the new state. */
  toggleCourseNotify: (courseId: string) => boolean;
  /** Back to the demo user (Logout). */
  resetAll: () => void;
};

export type MetaSlice = MetaState & MetaActions;

/* ------------------------------------------------------------------------------------------ */
/* Root                                                                                        */
/* ------------------------------------------------------------------------------------------ */

export type RootState = ProfileSlice & EconomySlice & ProgressSlice & MetaSlice;

/** Everything that is written to AsyncStorage. */
export type PersistedData = ProfileData & EconomyData & ProgressData & MetaData;

export type SliceCreator<Slice> = StateCreator<RootState, [], [], Slice>;
