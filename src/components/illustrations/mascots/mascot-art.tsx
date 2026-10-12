import { View, type StyleProp, type ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { svgA11y } from '@/components/icons/lib/icon-svg';
import { useSvgIds } from '@/components/icons/lib/svg-ids';
import type { MascotId } from '@/content/personality';

import { animalSvg } from './animal-svg';

export type Framing = 'full' | 'bust';

export type MascotArtProps = {
  id: MascotId;
  /** Square side. `width` wins over `height`; both default to 200. */
  width?: number;
  height?: number;
  /**
   * `full` (default): rounded square on the animal's tint (reveal, cards).
   * `bust`: round avatar (greeting, list rows, the partner in the village).
   */
  framing?: Framing;
  /** Drop the tinted backdrop (the animal alone, e.g. on the pact's paper). */
  bare?: boolean;
  style?: StyleProp<ViewStyle>;
  /** When set the artwork is announced as an image; otherwise it is decorative. */
  accessibilityLabel?: string;
};

/**
 * One of the four animals: a 200 × 200 bust with volume (light from the top left, soft shadows),
 * on the tint of its character colour. Square; the frame rounds it into a card or an avatar.
 */
export function MascotArt({ id, width, height, framing = 'full', bare = false, style, accessibilityLabel }: MascotArtProps) {
  const ids = useSvgIds('animal');
  const side = width ?? height ?? 200;
  const radius = framing === 'bust' ? side / 2 : side * 0.24;
  return (
    <View
      style={[{ width: side, height: side, borderRadius: radius, overflow: 'hidden' }, style]}
      {...svgA11y(accessibilityLabel)}>
      <SvgXml xml={animalSvg(id, ids.animal, !bare)} width="100%" height="100%" />
    </View>
  );
}
