/**
 * Root store types. One persisted zustand store assembled from four slices
 * (docs/ARCHITECTURE.md §4). Data fields are JSON-serialisable (timestamps are epoch ms,
 * days are local 'YYYY-MM-DD' keys) so the whole object round-trips through AsyncStorage.
 */
import type { StateCreator } from 'zustand';

import type { MascotId } from '@/content/personality';
import type { BuildingId, DecorId } from '@/content/village';
import type { DayKey } from '@/lib/dates';

import type { ResolvedChallenge } from './challenges';
import type { ResolvedMilestone } from './milestones';

/* ------------------------------------------------------------------------------------------ */
/* Profile                                                                                     */
/* ------------------------------------------------------------------------------------------ */

export type Experience = 'beginner' | 'some' | 'expert';

/** Outcome of the test ("Che animale sei con i soldi?"). */
export type PersonalityResult = {
  /** The animal assigned by the first test. It never changes: the partner signed with you. */
  mascot: MascotId;
  /** Position on the oggi ↔ domani axis, 0…100 towards domani. */
  future: number;
  /** Position on the prudenza ↔ audacia axis, 0…100 towards audacia. */
  risk: number;
  /** Epoch ms. */
  takenAt: number;
};

/**
 * The student's signature: drawn with the finger (its strokes as one SVG path, in the coordinates
 * of the pad it was drawn on, so it can be redrawn on the pact) or the name written in the
 * signature ink. Older drawn signatures have no path: the name stands in for them.
 */
export type PactSignature = {
  kind: 'drawn' | 'typed';
  name: string;
  /** Drawn only: every stroke as `M x y L x y …`. */
  path?: string;
  /** Drawn only: width and height of the pad, the path's viewBox. */
  box?: [number, number];
};

/** The pact signed after the test (concept board §03): five articles, countersigned by the partner. */
export type Pact = {
  /** Progressive number ("Patto n. 0001"): a new pact at each renewal. */
  number: number;
  /** Epoch ms. */
  signedAt: number;
  /** Art. 1 · the reason, chosen by the student. */
  why: string;
  /** Art. 2 · daily dose in minutes (5 · 10 · 15). */
  minutes: number;
  /** Art. 2 · length in days (30, then renewal). */
  days: number;
  /** Art. 3 · the habit it hooks onto ("Quando salgo sul bus per andare a scuola"). */
  when: string;
  /** Drawn with the finger, or the name written in the signature ink. */
  signature: PactSignature;
};

export type PactInput = Omit<Pact, 'number' | 'signedAt'>;
export type AppLanguage = 'it' | 'en';

export type ProfileData = {
  name: string;
  email: string;
  avatar: string;
  interests: string[];
  /** Daily study goal chosen in onboarding. */
  goalMinutes: number;
  experience: Experience;
  /** Personality test result; null until the test is taken. */
  personality: PersonalityResult | null;
  /** The pact in force; null until signed. */
  pact: Pact | null;
  /** Chosen after the first stone ("Borgo Ginestra"); null until then. */
  villageName: string | null;
  onboardingDone: boolean;
  referralCode: string;
  /** Friends who redeemed the referral code (0…3 for the "30 giorni di Feen Pro" promo). */
  invitedFriends: number;
  language: AppLanguage;
};

export type OnboardingAnswers = Partial<
  Pick<ProfileData, 'name' | 'interests' | 'goalMinutes' | 'experience' | 'avatar' | 'personality' | 'villageName'>
>;

export type ProfileActions = {
  updateProfile: (patch: Partial<Omit<ProfileData, 'referralCode'>>) => void;
  setInterests: (interests: string[]) => void;
  toggleInterest: (interest: string) => void;
  completeOnboarding: (answers?: OnboardingAnswers) => void;
  setLanguage: (language: AppLanguage) => void;
  setPersonality: (result: PersonalityResult) => void;
  /** Signs (or renews) the pact: the first stone of the village. */
  signPact: (input: PactInput, now?: number) => Pact;
  setVillageName: (name: string) => void;
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
  /** Feen Pro active until (epoch ms). */
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
  /** Village sites opened by the student (at most two at a time, built ones drop out). */
  openSites: BuildingId[];
  /** Buildings that bloomed: built, and the one-week review brought by a resident was right. */
  bloomed: BuildingId[];
  /** The residents' visits to each built building (the reviews that make it bloom). */
  reviews: Partial<Record<BuildingId, ReviewRecord>>;
  /** What bricks built, each on its own free lot (index into `VILLAGE_LOTS`). */
  placements: Placement[];
};

/** A house, a tree or a decoration bought with bricks and placed on a free lot. */
export type Placement = { kind: DecorId; lot: number; at: number };

/**
 * The visits of a building's resident. The first comes a week after the building is finished;
 * after a wrong answer the resident comes back a few days later with another problem.
 */
export type ReviewRecord = {
  /** Problems already brought (ids), in order: the next visit brings another one. */
  asked: string[];
  /** The last answer (epoch ms). */
  lastAt: number;
  /** Bloomed (epoch ms), after a right answer. */
  bloomedAt?: number;
};

export type ReviewFailure = 'not-waiting' | 'unknown-problem';
export type ReviewResult =
  | { ok: true; right: boolean; bricks: number; nextAt: number | null }
  | { ok: false; reason: ReviewFailure };

export type BuildFailure = 'bricks' | 'taken' | 'no-lot';
export type BuildResult = { ok: true; placement: Placement } | { ok: false; reason: BuildFailure };

export type OpenSiteFailure = 'built' | 'needs-building' | 'too-many' | 'no-lessons';
export type OpenSiteResult = { ok: true } | { ok: false; reason: OpenSiteFailure };

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
  /** Opens a project as a site (no locks: at most two open, the Tower after the Well). */
  openSite: (id: BuildingId) => OpenSiteResult;
  /** Spends bricks on a house or a decoration, placed on a free lot of the village. */
  build: (kind: DecorId, lot: number, now?: number) => BuildResult;
  /**
   * Answers the problem a resident brought. Right: the building blooms and the resident leaves a
   * few bricks as thanks. Wrong: nothing is lost, the resident comes back later with another one.
   */
  answerReview: (id: BuildingId, problemId: string, optionId: string, now?: number) => ReviewResult;
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
