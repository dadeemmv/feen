/**
 * OrbAvatar — the Coach's tiny face next to its messages: the AssistantOrb pearl without halo,
 * sized by its *visible* diameter (the artwork box is larger than the pearl, so the SVG is
 * centred in a pearl-sized slot and overflows invisibly).
 */
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { AssistantOrb } from '@/components/illustrations';

import { ORB_PEARL_RATIO, orbSize } from '../metrics';

export type OrbAvatarProps = {
  /** Visible pearl diameter. Default `orbSize.avatar` (24). */
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export function OrbAvatar({ size = orbSize.avatar, style }: OrbAvatarProps) {
  const box = size / ORB_PEARL_RATIO;
  return (
    <View aria-hidden style={[styles.slot, { width: size, height: size }, style]}>
      <AssistantOrb halo={false} width={box} height={box} />
    </View>
  );
}

const styles = StyleSheet.create({
  slot: { alignItems: 'center', justifyContent: 'center', overflow: 'visible' },
});
