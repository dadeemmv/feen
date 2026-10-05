/**
 * Referral promo on launch (spec §3.1): the first time Home gains focus in an app launch, the
 * "30 giorni di Finanz Pro" sheet slides up over it — at most once a day (`lastReferralPromoOn`),
 * never while another global overlay is open, and no more once the 3 friends are invited.
 */
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import { REFERRAL_PROMO } from '@/content/shop';
import { getStoreState, selectReferralPromoDue } from '@/store';
import { useUi } from '@/store/ui';

import { homeMetrics } from '../metrics';

export function useReferralPromo() {
  const [visible, setVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (useUi.getState().sessionFlags.referralPromoShownThisLaunch) return;
      const timer = setTimeout(() => {
        const ui = useUi.getState();
        const store = getStoreState();
        const now = Date.now();
        // Another sheet is up: try again on the next focus.
        if (ui.sheet !== null) return;
        ui.setSessionFlag('referralPromoShownThisLaunch', true);
        if (!selectReferralPromoDue(store, now) || store.invitedFriends >= REFERRAL_PROMO.friendsRequired) return;
        store.markReferralPromoShown(now);
        setVisible(true);
      }, homeMetrics.referralPromoDelay);
      return () => clearTimeout(timer);
    }, []),
  );

  return { visible, close: () => setVisible(false) };
}
