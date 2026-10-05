/**
 * "Sfide Maratona": every streak challenge in content order — unlocked ones as challenge cards,
 * locked ones as the grey "Raggiungi n giorni di fila…" card. Claiming credits the coins once
 * (store `claimChallenge`) with a success haptic and a toast.
 */
import { KiwiCoinIcon } from '@/components/icons';
import { VStack, iconSize, toast } from '@/components/ui';
import { haptics } from '@/lib/haptics';
import { formatCoins } from '@/lib/format';
import { useStore, type ResolvedChallenge } from '@/store';
import { useChallenges } from '@/store/hooks';

import { STREAK_COPY } from '../copy';
import { ChallengeCard, LockedChallengeCard } from './challenge-card';

export function MarathonSection({ now }: { now: number }) {
  const challenges = useChallenges(now);
  const claimChallenge = useStore((s) => s.claimChallenge);

  const claim = (challenge: ResolvedChallenge): boolean => {
    const result = claimChallenge(challenge.id, Date.now());
    if (!result.ok) {
      haptics.error();
      toast.show({ message: STREAK_COPY.claimFailed, tone: 'danger' });
      return false;
    }
    haptics.success();
    toast.show({
      message: STREAK_COPY.claimedToast(formatCoins(challenge.reward)),
      tone: 'success',
      icon: <KiwiCoinIcon size={iconSize.md} />,
    });
    return true;
  };

  return (
    <VStack gap="sm">
      {challenges.map((challenge) =>
        challenge.unlocked ? (
          <ChallengeCard key={challenge.id} challenge={challenge} onClaim={claim} />
        ) : (
          <LockedChallengeCard key={challenge.id} label={challenge.lockedLabel} />
        ),
      )}
    </VStack>
  );
}
