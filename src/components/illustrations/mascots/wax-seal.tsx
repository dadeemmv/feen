import { View, type StyleProp, type ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { svgA11y } from '@/components/icons/lib/icon-svg';
import { useSvgIds } from '@/components/icons/lib/svg-ids';

import { sealSvg } from './animal-svg';

export type WaxSealProps = {
  size: number;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

/** The partner's countersignature: a red wax seal with the paw print. */
export function WaxSeal({ size, style, accessibilityLabel }: WaxSealProps) {
  const ids = useSvgIds('seal');
  return (
    <View style={[{ width: size, height: size }, style]} {...svgA11y(accessibilityLabel)}>
      <SvgXml xml={sealSvg(ids.seal)} width="100%" height="100%" />
    </View>
  );
}
