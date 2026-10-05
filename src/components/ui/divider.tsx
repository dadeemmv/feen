/**
 * Divider — hairline separator. `inset` indents the start (e.g. to align with row titles).
 */
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { spacing, useTheme, type ColorToken, type SpacingToken } from '@/theme';

import { hairline } from './metrics';

export type DividerProps = {
  vertical?: boolean;
  /** Start inset in pt (horizontal dividers). */
  inset?: number;
  /** Margin on both sides along the cross axis. Default `none`. */
  spacing?: SpacingToken;
  /** Default `borderSubtle`. */
  color?: ColorToken;
  /** Line thickness. Default hairline. */
  thickness?: number;
  style?: StyleProp<ViewStyle>;
};

export function Divider({
  vertical = false,
  inset = 0,
  spacing: gap = 'none',
  color = 'borderSubtle',
  thickness = hairline,
  style,
}: DividerProps) {
  const theme = useTheme();
  const margin = spacing[gap];
  return (
    <View
      aria-hidden
      importantForAccessibility="no"
      style={[
        { backgroundColor: theme.colors[color] },
        vertical
          ? { width: thickness, alignSelf: 'stretch', marginHorizontal: margin }
          : { height: thickness, marginLeft: inset, marginVertical: margin },
        style,
      ]}
    />
  );
}
