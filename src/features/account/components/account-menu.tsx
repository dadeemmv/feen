/**
 * Account menu groups "Menu" and "Altro": settings, your animal, support and legal. No language
 * picker (the app is Italian, for Italian schools), no interests (the test already says where to
 * start) and no "rate the app" prompt for students.
 */
import type { StyleProp, ViewStyle } from 'react-native';
import { router } from 'expo-router';
import { Compass, Headset, Settings, ShieldCheck } from 'lucide-react-native';

import { MascotArt } from '@/components/illustrations';
import { mascotMetrics } from '@/features/mascots/metrics';
import { ListGroup, ListItem } from '@/components/ui';
import { selectMascot, useStore } from '@/store';

import { ACCOUNT_COPY, MENU_COPY } from '../copy';
import { openSection } from '../lib/navigation';

export function AccountMainMenu({ style }: { style?: StyleProp<ViewStyle> }) {
  const mascot = useStore(selectMascot);

  return (
    <ListGroup title={ACCOUNT_COPY.menuTitle} style={style}>
      <ListItem
        icon={Settings}
        iconTone="neutral"
        {...MENU_COPY.settings}
        onPress={() => openSection('settings')}
        testID="account-settings"
      />
      <ListItem
        icon={mascot ? <MascotArt id={mascot} framing="bust" width={mascotMetrics.rowBust} /> : Compass}
        iconTone="butter"
        {...MENU_COPY.mascot}
        onPress={() => router.push('/mascot')}
      />
    </ListGroup>
  );
}

export type AccountOtherMenuProps = {
  onRedeem: () => void;
  onRate: () => void;
  style?: StyleProp<ViewStyle>;
};

export function AccountOtherMenu({ style }: AccountOtherMenuProps) {
  return (
    <ListGroup title={ACCOUNT_COPY.otherTitle} style={style}>
      <ListItem icon={Headset} iconTone="neutral" {...MENU_COPY.support} onPress={() => openSection('support')} />
      <ListItem icon={ShieldCheck} iconTone="neutral" {...MENU_COPY.legal} onPress={() => openSection('legal')} />
    </ListGroup>
  );
}
