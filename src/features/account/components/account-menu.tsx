/**
 * Account menu groups "MENU" and "ALTRO" (spec §3.8). Emoji leading glyphs of the video are
 * replaced by tinted Lucide tiles (art direction); the Pro row carries the custom GemIcon.
 */
import type { StyleProp, ViewStyle } from 'react-native';
import { router } from 'expo-router';
import {
  Globe,
  Headset,
  Heart,
  HeartHandshake,
  Compass,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Star,
  TicketPercent,
} from 'lucide-react-native';

import { GemIcon } from '@/components/icons';
import { MascotArt } from '@/components/illustrations';
import { getMascot } from '@/content/personality';
import { mascotMetrics } from '@/features/mascots/metrics';
import { ListGroup, ListItem, iconSize } from '@/components/ui';
import { selectIsPro, selectMascot, useStore } from '@/store';
import { useNow } from '@/store/hooks';

import { ACCOUNT_COPY, MENU_COPY } from '../copy';
import { openSection } from '../lib/navigation';

export function AccountMainMenu({ style }: { style?: StyleProp<ViewStyle> }) {
  const now = useNow();
  const isPro = useStore((s) => selectIsPro(s, now));
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
      <ListItem icon={ShoppingBag} iconTone="blush" {...MENU_COPY.purchases} onPress={() => openSection('purchases')} />
      <ListItem
        icon={<GemIcon size={iconSize.md} />}
        iconTone="lilac"
        {...MENU_COPY.pro}
        value={isPro ? ACCOUNT_COPY.proActive : undefined}
        onPress={() => router.push('/pro')}
      />
      <ListItem icon={HeartHandshake} iconTone="mint" {...MENU_COPY.invite} onPress={() => router.push('/invite')} />
      <ListItem icon={Heart} iconTone="blush" {...MENU_COPY.interests} onPress={() => openSection('interests')} />
    </ListGroup>
  );
}

export type AccountOtherMenuProps = {
  onRedeem: () => void;
  onRate: () => void;
  style?: StyleProp<ViewStyle>;
};

export function AccountOtherMenu({ onRedeem, onRate, style }: AccountOtherMenuProps) {
  return (
    <ListGroup title={ACCOUNT_COPY.otherTitle} style={style}>
      <ListItem icon={TicketPercent} iconTone="mint" {...MENU_COPY.redeem} onPress={onRedeem} />
      <ListItem icon={Star} iconTone="butter" {...MENU_COPY.rate} onPress={onRate} />
      <ListItem icon={Headset} iconTone="sky" {...MENU_COPY.support} onPress={() => openSection('support')} />
      <ListItem icon={ShieldCheck} iconTone="neutral" {...MENU_COPY.legal} onPress={() => openSection('legal')} />
    </ListGroup>
  );
}
