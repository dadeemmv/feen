import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { useSvgIds } from '@/components/icons/lib/svg-ids';

/** The pact's paper grain: a 14 px dot grid, drawn behind the content. */
export function PaperTexture() {
  const ids = useSvgIds('dots');
  const xml =
    `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">` +
    `<defs><pattern id="${ids.dots}" width="14" height="14" patternUnits="userSpaceOnUse">` +
    `<circle cx="2" cy="2" r="1" fill="rgba(60,40,10,0.12)"/></pattern></defs>` +
    `<rect width="100%" height="100%" fill="url(#${ids.dots})"/></svg>`;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <SvgXml xml={xml} width="100%" height="100%" />
    </View>
  );
}
