/**
 * Piggy bank on a local grid centred on its body (≈ 150 × 120, feet at y ≈ 58, slot at y ≈ -49).
 */
import { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

import { Linear, twoStops } from '@/components/icons/lib/gradients';
import { paint } from '@/components/icons/lib/svg-ids';
import { illustration } from '@/theme';

export function PiggyDefs({ bodyId }: { bodyId: string }) {
  return <Linear id={bodyId} stops={twoStops([illustration.blush, illustration.blushDeep])} from={[0.2, 0]} to={[0.8, 1]} />;
}

export function Piggy({ bodyId, transform }: { bodyId: string; transform?: string }) {
  const deep = illustration.blushDeep;
  return (
    <G transform={transform}>
      <Path d="M-60 -4C-72 -12 -82 -2 -74 6C-68 12 -62 4 -69 -1" stroke={deep} strokeWidth={4} strokeLinecap="round" fill="none" />
      {/* back legs */}
      <Rect x={-44} y={26} width={18} height={30} rx={8} fill={deep} />
      <Rect x={26} y={26} width={18} height={30} rx={8} fill={deep} />
      {/* ear (back) */}
      <Path d="M18 -40C18 -62 36 -66 44 -44Z" fill={deep} />
      <Ellipse cx={0} cy={0} rx={64} ry={50} fill={paint(bodyId)} />
      {/* front legs */}
      <Rect x={-28} y={30} width={18} height={30} rx={8} fill={paint(bodyId)} />
      <Rect x={10} y={30} width={18} height={30} rx={8} fill={paint(bodyId)} />
      <Rect x={-28} y={52} width={18} height={8} rx={4} fill={deep} fillOpacity={0.6} />
      <Rect x={10} y={52} width={18} height={8} rx={4} fill={deep} fillOpacity={0.6} />
      {/* ear (front) */}
      <Path d="M8 -44C6 -64 24 -70 32 -46Z" fill={paint(bodyId)} />
      <Path d="M12 -46C12 -58 22 -62 27 -48Z" fill={deep} fillOpacity={0.55} />
      {/* snout + face */}
      <Ellipse cx={62} cy={6} rx={13} ry={16} fill={deep} />
      <Ellipse cx={60} cy={1} rx={2.4} ry={3.4} fill={illustration.ink} fillOpacity={0.45} />
      <Ellipse cx={65} cy={10} rx={2.4} ry={3.4} fill={illustration.ink} fillOpacity={0.45} />
      <Circle cx={36} cy={-14} r={4.6} fill={illustration.ink} />
      <Circle cx={37.6} cy={-15.6} r={1.5} fill={illustration.white} />
      <Ellipse cx={40} cy={8} rx={8} ry={4.5} fill={deep} fillOpacity={0.45} />
      {/* coin slot + gloss */}
      <Rect x={-18} y={-50} width={34} height={6} rx={3} fill={illustration.ink} fillOpacity={0.5} />
      <Ellipse cx={-28} cy={-24} rx={20} ry={9} transform="rotate(-24 -28 -24)" fill={illustration.white} fillOpacity={0.5} />
    </G>
  );
}
