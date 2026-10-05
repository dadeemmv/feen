/**
 * Dashed connectors between path blocks (react-native-svg, strokeDasharray), drawn behind the
 * nodes from the pure layout. Segments the learner has already walked are tinted evergreen.
 */
import { StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { useTheme } from '@/theme';

import { CONNECTOR } from '../constants';
import type { PathConnectorLayout } from '../path-layout';

export type PathConnectorsProps = {
  width: number;
  height: number;
  connectors: PathConnectorLayout[];
  /** Ids of connectors whose destination is reached (completed or current). */
  walked: ReadonlySet<string>;
};

export function PathConnectors({ width, height, connectors, walked }: PathConnectorsProps) {
  const theme = useTheme();
  return (
    <Svg width={width} height={height} style={styles.svg} aria-hidden>
      {connectors.map((connector) => (
        <Path
          key={connector.id}
          d={connector.d}
          fill="none"
          stroke={walked.has(connector.id) ? theme.colors.brandBorder : theme.colors.border}
          strokeWidth={CONNECTOR.width}
          strokeDasharray={[...CONNECTOR.dash]}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </Svg>
  );
}

const styles = StyleSheet.create({
  svg: { position: 'absolute', top: 0, left: 0, pointerEvents: 'none' },
});
