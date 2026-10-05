/**
 * Home tab (spec §3.1 + §3.3, redlines "Home"): status chips, greeting, stories row, the hero
 * card with the journey CTA, the three unlock milestones and — once per launch — the referral
 * promo sheet. Milestone cards open the reward reveal (features/rewards).
 */
import { useRef, useState } from 'react';
import { router } from 'expo-router';

import { ConnectedStatusHeader } from '@/components/navigation/connected-status-header';
import { Screen } from '@/components/ui';
import { MAIN_COURSE_ID } from '@/content/courses';
import { ReferralSheet } from '@/features/invite/referral-sheet';
import { RewardDialog } from '@/features/rewards';
import { useStore, type ResolvedMilestone } from '@/store';
import { useCourseProgress, useNow, useStreakInfo } from '@/store/hooks';

import { Greeting } from './components/greeting';
import { HeroCard } from './components/hero-card';
import { MilestonesSection } from './components/milestones-section';
import { StoriesRow } from './components/stories-row';
import { useHomeLayout } from './lib/use-home-layout';
import { useReferralPromo } from './lib/use-referral-promo';

export function HomeScreen() {
  const layout = useHomeLayout();
  const now = useNow();
  const streak = useStreakInfo(now);
  const name = useStore((s) => s.name);
  const courseDone = useCourseProgress(MAIN_COURSE_ID).isDone;
  const promo = useReferralPromo();

  // The dialog renders a snapshot, so its content stays stable while it animates out.
  const [reward, setReward] = useState<{ milestone: ResolvedMilestone | null; visible: boolean }>({
    milestone: null,
    visible: false,
  });
  const afterRewardClosed = useRef<(() => void) | null>(null);
  const openReward = (milestone: ResolvedMilestone) => setReward({ milestone, visible: true });
  const closeReward = () => setReward((r) => ({ ...r, visible: false }));
  const continueToCourse = () => {
    afterRewardClosed.current = () => router.push({ pathname: '/course/[id]', params: { id: MAIN_COURSE_ID } });
    closeReward();
  };
  const handleRewardClosed = () => {
    const action = afterRewardClosed.current;
    afterRewardClosed.current = null;
    action?.();
  };

  return (
    <Screen withTabBar header={<ConnectedStatusHeader />}>
      <Greeting name={name} streak={streak.count} studiedToday={streak.activeToday} courseDone={courseDone} />
      <StoriesRow />
      <HeroCard layout={layout} />
      <MilestonesSection onOpenMilestone={openReward} />

      <RewardDialog
        milestone={reward.milestone}
        visible={reward.visible}
        onClose={closeReward}
        onClosed={handleRewardClosed}
        onContinue={continueToCourse}
      />
      <ReferralSheet visible={promo.visible} onClose={promo.close} />
    </Screen>
  );
}
