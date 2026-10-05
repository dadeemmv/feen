/**
 * Italian copy of the reward reveal (Home milestones "Sblocca dopo n lezioni") and the helpers
 * that turn a `MilestoneReward` into short labels.
 */
import type { MilestoneReward } from '@/content/extra-types';
import { formatCoins, formatLessons, plural } from '@/lib/format';

export const REWARD_COPY = {
  claimableTitle: 'Traguardo raggiunto!',
  claimCta: 'Riscatta premio',
  claimedTitle: 'Premio riscattato!',
  claimedCta: 'Fantastico!',
  lockedCta: 'Continua il tuo viaggio!',
  alreadyClaimedCta: 'Ok',
  claimedToast: 'Premio aggiunto al tuo account',
  claimFailed: 'Non è stato possibile riscattare il premio',
  /** "Ancora 2 lezioni per sbloccare questo premio." */
  lockedMessage: (remaining: number) =>
    `Completa ancora ${formatLessons(remaining)} per sbloccare questo premio.`,
  /** "1/2 lezioni" under the locked progress bar. */
  progressLabel: (current: number, threshold: number) =>
    `${current}/${threshold} ${plural(threshold, 'lezione', 'lezioni')}`,
} as const;

/** Long label for chips and dialogs: "+1 Scudo", "+1.000 Kiwi", "7 giorni di Pro". */
export function rewardAmountLabel(reward: MilestoneReward): string {
  switch (reward.kind) {
    case 'shield':
      return `+${reward.amount} ${plural(reward.amount, 'Scudo', 'Scudi')}`;
    case 'coins':
      return `+${formatCoins(reward.amount)} Kiwi`;
    case 'pro':
      return `${reward.amount} ${plural(reward.amount, 'giorno', 'giorni')} di Pro`;
  }
}

/** Compact label for the pill on the Home milestone cards: "×1", "1.000", "7 gg". */
export function rewardShortLabel(reward: MilestoneReward): string {
  switch (reward.kind) {
    case 'shield':
      return `×${reward.amount}`;
    case 'coins':
      return formatCoins(reward.amount);
    case 'pro':
      return `${reward.amount} gg`;
  }
}

/** What the user can do with the reward once it is in the account (claimed dialog). */
export function rewardClaimedMessage(reward: MilestoneReward): string {
  switch (reward.kind) {
    case 'shield':
      return `${reward.amount === 1 ? 'Lo scudo protegge' : 'Gli scudi proteggono'} la tua serie se salti un giorno di studio.`;
    case 'coins':
      return 'I Kiwi sono già nel tuo saldo: spendili nello Shop per vite e scudi.';
    case 'pro':
      return 'Finanz Pro è attivo: vite illimitate per tutta la durata del premio.';
  }
}
