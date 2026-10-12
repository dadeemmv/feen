/**
 * A signature as it stands on the signed pact: the strokes drawn with the finger, redrawn in the
 * signature ink at the pact's width, or the name written in serif italic (typed signatures, and
 * drawn ones saved before the strokes were kept).
 */
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Text } from '@/components/ui';
import type { PactSignature } from '@/store';
import { fonts, spacing, useTheme } from '@/theme';

import { PACT_COPY } from '../copy';

/** Height of a drawn signature on the pact (the pad is 120: the ink keeps its proportions). */
const DRAWN_HEIGHT = 84;

export function SignatureMark({ signature }: { signature: PactSignature }) {
  const { colors } = useTheme();
  const { path, box } = signature;
  const drawn = signature.kind === 'drawn' && path && box ? { path, box } : null;

  return (
    <View
      style={[styles.line, { borderBottomColor: colors.borderStrong }]}
      accessible
      accessibilityLabel={`${PACT_COPY.signature}: ${signature.name}`}>
      {drawn ? (
        <Svg
          width="100%"
          height={DRAWN_HEIGHT}
          viewBox={`0 0 ${drawn.box[0]} ${drawn.box[1]}`}
          preserveAspectRatio="xMinYMid meet">
          <Path
            d={drawn.path}
            stroke={colors.signInk}
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      ) : (
        <Text style={[styles.typed, { color: colors.signInk }]}>{signature.name}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  line: { borderBottomWidth: StyleSheet.hairlineWidth, paddingBottom: spacing.xs },
  typed: { fontFamily: fonts.serif.italic, fontSize: 30, lineHeight: 36 },
});
