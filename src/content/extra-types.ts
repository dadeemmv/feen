/**
 * Content types that are NOT part of the lead designer's contract in `./types.ts`.
 * They are additive only (nothing in `types.ts` is redefined): Home milestones, the Pro plan copy,
 * streak challenges and the offline assistant knowledge base.
 */

// ─── Home unlock milestones ──────────────────────────────────────────────────────────────────

/**
 * What a milestone grants when unlocked.
 * `amount` means: shields for `shield`, kiwi coins for `coins`, days of Finanz Pro for `pro`.
 */
export type MilestoneReward = {
  kind: 'shield' | 'coins' | 'pro';
  amount: number;
};

export type Milestone = {
  id: string;
  /** Completed lessons needed to unlock ("Sblocca dopo n lezioni"). */
  threshold: number;
  reward: MilestoneReward;
  /** Reward name shown once unlocked, e.g. "Scudo salva streak". */
  title: string;
  /** One short sentence for the unlock dialog. */
  description: string;
};

// ─── Streak challenges ("Sfide Maratona") ────────────────────────────────────────────────────

export type MarathonChallenge = {
  id: string;
  /** Consecutive days required. */
  days: number;
  /** Kiwi coins granted on completion. */
  reward: number;
  emoji: string;
  title: string;
  /** Streak (in days) needed before the challenge becomes available; 0 = available now. */
  unlockAtStreak: number;
  /** Copy shown while the challenge is still locked. */
  lockedLabel: string;
};

// ─── Finanz Pro ──────────────────────────────────────────────────────────────────────────────

/** Semantic icon key: the UI maps it to an economy icon or a Lucide glyph. */
export type ProBenefitIcon = 'lives' | 'assistant' | 'no-ads' | 'shield' | 'early-access';

export type ProBenefit = {
  id: string;
  icon: ProBenefitIcon;
  title: string;
  description: string;
};

export type ProPrice = {
  id: 'monthly' | 'yearly';
  label: string;
  /** Price in euro cents (integer, avoids float rounding). */
  amountCents: number;
  /** Pre-formatted Italian price, e.g. "6,99 €". */
  priceLabel: string;
  /** e.g. "/mese", "/anno". */
  period: string;
  /** Secondary line, e.g. "Solo 4,17 € al mese". */
  note?: string;
  /** Highlight pill, e.g. "-40%". */
  badge?: string;
};

export type ProPlan = {
  name: string;
  tagline: string;
  benefits: ProBenefit[];
  prices: ProPrice[];
  defaultPriceId: ProPrice['id'];
  cta: string;
  /** This build has no real payments: always show this near the CTA. */
  demoNotice: string;
  legal: string;
};

export type ReferralPromo = {
  title: string;
  subtitle: string;
  cta: string;
  friendsRequired: number;
  rewardProDays: number;
};

// ─── Assistant knowledge base ────────────────────────────────────────────────────────────────

export type AssistantKbEntry = {
  id: string;
  /** Short topic label (history, debugging). */
  topic: string;
  /**
   * Lowercase, accent-free Italian stems matched at the START of a word in the user's message
   * ("inflazion" matches "inflazione"). Multi-word keywords are allowed. A trailing space
   * requires a whole-word match ("pac " matches "pac" but not "pacchetto").
   */
  keywords: string[];
  /** 3–6 short sentences; lines starting with "• " are rendered as bullets. */
  answer: string;
  /** Chapter of the main course that covers the topic (for an "Approfondisci" link). */
  chapterId?: string;
  /**
   * Tie-breaker across topics, applied before keyword scores: `1` = guardrail that must win
   * when matched (e.g. requests for personal advice), `-1` = generic/small talk that only
   * answers when no topic matches. Default `0`.
   */
  priority?: -1 | 0 | 1;
};

export type AssistantReply = {
  text: string;
  /** Matched entry id, or `null` when the fallback answer was used. */
  entryId: string | null;
  chapterId?: string;
};
