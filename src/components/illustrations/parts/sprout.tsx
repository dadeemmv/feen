/** A two-leaf sprout on a local grid whose origin is the base of the stem (grows upward). */
import { Circle, G, Path } from 'react-native-svg';

import { Linear, twoStops } from '@/components/icons/lib/gradients';
import { paint } from '@/components/icons/lib/svg-ids';
import { illustration } from '@/theme';

const STEM = 'M0 0C-1.5 -14 2 -26 1 -40';
const LEAF_LEFT = 'M0.5 -20C-10 -34 -22 -38 -30 -36C-26 -26 -14 -18 0.5 -20Z';
const LEAF_RIGHT = 'M1 -32C10 -48 22 -54 34 -54C30 -42 18 -32 1 -32Z';
const RIBS = 'M0.5 -20C-8 -27 -16 -32 -24 -34.5M1 -32C10 -40 20 -47 29 -51';

export function SproutDefs({ leafId }: { leafId: string }) {
  return <Linear id={leafId} stops={twoStops([illustration.kiwiFlesh, illustration.kiwiFleshDark])} from={[0, 0]} to={[1, 1]} />;
}

export function Sprout({ leafId, transform }: { leafId: string; transform?: string }) {
  return (
    <G transform={transform}>
      <Path d={STEM} stroke={illustration.kiwiFleshDark} strokeWidth={4} strokeLinecap="round" fill="none" />
      <Path d={LEAF_LEFT} fill={paint(leafId)} />
      <Path d={LEAF_RIGHT} fill={paint(leafId)} />
      <Path d={RIBS} stroke={illustration.limeLight} strokeOpacity={0.8} strokeWidth={1.4} strokeLinecap="round" fill="none" />
      <Circle cx={1} cy={-41} r={3.2} fill={illustration.kiwiFlesh} />
    </G>
  );
}
