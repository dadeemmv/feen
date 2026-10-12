/**
 * Account menu groups "MENU" and "ALTRO" (spec §3.8). Emoji leading glyphs of the video are
 * replaced by tinted Lucide tiles (art direction); the Pro row carries the custom GemIcon.
 */
import type { StyleProp, ViewStyle } from 'react-native';
import { router } from 'expo-router';
import { Compass, Globe, Headset, Heart, Settings, ShieldCheck, Star } from 'lucide-react-native';

import { MascotArt } from '@/components/illustrations';
import { getMascot } from '@/content/personality';
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
        value={mascot ? getMascot(mascot).quadrant : undefined}
        onPress={() => router.push('/mascot')}
      />
      <ListItem icon={Globe} iconTone="sky" {...MENU_COPY.language} onPress={() => openSection('language')} />
      <ListItem icon={Heart} iconTone="blush" {...MENU_COPY.interests} onPress={() => openSection('interests')} />
    </ListGroup>
  );
}

export type AccountOtherMenuProps = {
  onRedeem: () => void;
  onRate: () => void;
  style?: StyleProp<ViewStyle>;
};

export function AccountOtherMenu({ onRate, style }: AccountOtherMenuProps) {
  return (
    <ListGroup title={ACCOUNT_COPY.otherTitle} style={style}>
      <ListItem icon={Star} iconTone="butter" {...MENU_COPY.rate} onPress={onRate} />
      <ListItem icon={Headset} iconTone="sky" {...MENU_COPY.support} onPress={() => openSection('support')} />
      <ListItem icon={ShieldCheck} iconTone="neutral" {...MENU_COPY.legal} onPress={() => openSection('legal')} />
    </ListGroup>
  );
}
