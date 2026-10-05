/**
 * Account (spec §3.8): back + economy chips, "Account" title, profile card with the level strip,
 * three mini stats, the "30 giorni di Finanz Pro" referral card, MENU / ALTRO groups, Logout and
 * the version footnote. "Utilizza codice" and "Valuta app" open their sheets in place.
 */
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { ConnectedStatusHeader } from '@/components/navigation/connected-status-header';
import { Screen, ScreenTitle } from '@/components/ui';
import { useEntering } from '@/features/onboarding/lib/entering';
import { layout, spacing } from '@/theme';

import { AccountMainMenu, AccountOtherMenu } from './components/account-menu';
import { AccountStats } from './components/account-stats';
import { LogoutSection } from './components/logout-section';
import { ProfileCard } from './components/profile-card';
import { ReferralCard } from './components/referral-card';
import { ACCOUNT_COPY } from './copy';
import { backToHome } from './lib/navigation';
import { RateAppSheet } from './sheets/rate-app-sheet';
import { RedeemCodeSheet } from './sheets/redeem-code-sheet';

type AccountSheet = 'redeem' | 'rate' | null;

export function AccountScreen() {
  const [sheet, setSheet] = useState<AccountSheet>(null);
  const { rise } = useEntering();
  const closeSheet = () => setSheet(null);

  return (
    <Screen edges={['top', 'bottom']} header={<ConnectedStatusHeader onBack={backToHome} showAvatar={false} />}>
      <ScreenTitle title={ACCOUNT_COPY.title} />

      <Animated.View entering={rise(0)} style={styles.stack}>
        <ProfileCard />
        <AccountStats />
      </Animated.View>

      <Animated.View entering={rise(1)} style={styles.section}>
        <ReferralCard />
      </Animated.View>

      <Animated.View entering={rise(2)} style={styles.section}>
        <AccountMainMenu />
      </Animated.View>

      <Animated.View entering={rise(3)} style={styles.section}>
        <AccountOtherMenu onRedeem={() => setSheet('redeem')} onRate={() => setSheet('rate')} />
      </Animated.View>

      <LogoutSection />

      <RedeemCodeSheet visible={sheet === 'redeem'} onClose={closeSheet} />
      <RateAppSheet visible={sheet === 'rate'} onClose={closeSheet} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  stack: { gap: spacing.xs },
  section: { marginTop: layout.sectionGap },
});
