import { View, type StyleProp, type ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { svgA11y } from '@/components/icons/lib/icon-svg';
import { useSvgIds } from '@/components/icons/lib/svg-ids';
import type { BuildingId } from '@/content/village';
import type { BuildingState } from '@/store';

import { sceneSvg } from '../lib/iso';

export type BuildingSceneProps = {
  id: BuildingId;
  state: BuildingState;
  /** Walls of a site, 0…1. */
  progress?: number;
  /** Its resident waits at the front corner with a problem (the review). */
  visitor?: boolean;
  width: number;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

/** One building on its own isometric tile of ground (cards, the first stone). Aspect ≈ 1 : 1.2. */
export function BuildingScene({ id, state, progress, visitor, width, style, accessibilityLabel }: BuildingSceneProps) {
  const ids = useSvgIds('scene');
  return (
    <View style={[{ width, aspectRatio: 0.82 }, style]} {...svgA11y(accessibilityLabel)}>
      <SvgXml xml={sceneSvg(id, state, ids.scene, progress, visitor)} width="100%" height="100%" />
    </View>
  );
}
