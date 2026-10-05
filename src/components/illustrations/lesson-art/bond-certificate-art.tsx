import { Circle, Defs, G, Path, Rect } from 'react-native-svg';

import { scallopPath } from '@/components/icons/lib/geometry';
import { Linear, twoStops } from '@/components/icons/lib/gradients';
import { paint, useSvgIds } from '@/components/icons/lib/svg-ids';
import { gradients, illustration } from '@/theme';

import { ART, ArtSvg, type IllustrationProps } from '../lib/art-svg';
import { GlowGradient, SoftEllipse, Sparkle } from '../parts/basics';

const SEAL = { x: 176, y: 104, r: 17 } as const;
const SEAL_EDGE = scallopPath(SEAL.x, SEAL.y, SEAL.r, 14, 0.1);
/** "%" glyph centred on (0, 0), ~12 units tall. */
const PERCENT = 'M4.5 -6L-4.5 6';
/** Attached coupons along the bottom (x positions); the last one is torn off and floats. */
const COUPONS = [44, 82, 120] as const;

function Coupon({ x, y, transform }: { x: number; y: number; transform?: string }) {
  return (
    <G transform={transform}>
      <Rect x={x} y={y} width={34} height={22} rx={5} fill={illustration.limeLight} stroke={illustration.kiwiFlesh} strokeWidth={1.2} />
      <G transform={`translate(${x + 17} ${y + 11})`}>
        <Path d={PERCENT} stroke={illustration.forest} strokeWidth={2.2} strokeLinecap="round" />
        <Circle cx={-4} cy={-4} r={2.2} fill={illustration.forest} />
        <Circle cx={4} cy={4} r={2.2} fill={illustration.forest} />
      </G>
    </G>
  );
}

/** Lesson art "bond-certificate": a bond with its coupons ("cedole"), one detached. */
export function BondCertificateArt(props: IllustrationProps) {
  const ids = useSvgIds('shadow', 'paper', 'seal');
  const ink = illustration.forest;
  return (
    <ArtSvg size={ART.spot} {...props}>
      <Defs>
        <GlowGradient id={ids.shadow} opacity={0.18} />
        <Linear id={ids.paper} stops={twoStops([illustration.white, illustration.paper])} />
        <Linear id={ids.seal} stops={twoStops(gradients.gold)} from={[0.2, 0]} to={[0.8, 1]} />
      </Defs>
      <SoftEllipse id={ids.shadow} cx={116} cy={166} rx={90} ry={8} />

      {/* certificate */}
      <Rect x={34} y={20} width={168} height={118} rx={10} fill={illustration.ink} fillOpacity={0.06} transform="translate(0 4)" />
      <Rect x={34} y={20} width={168} height={118} rx={10} fill={paint(ids.paper)} stroke={illustration.forestLight} strokeWidth={1.2} />
      <Rect x={42} y={28} width={152} height={102} rx={6} fill="none" stroke={ink} strokeOpacity={0.35} strokeWidth={1.5} />
      <Rect x={46} y={32} width={144} height={94} rx={4} fill="none" stroke={ink} strokeOpacity={0.15} strokeWidth={1} />
      <Rect x={78} y={42} width={80} height={9} rx={4.5} fill={ink} fillOpacity={0.85} />
      <Rect x={92} y={56} width={52} height={5} rx={2.5} fill={ink} fillOpacity={0.3} />
      <Path d="M58 76H146M58 86H138M58 96H128" stroke={ink} strokeOpacity={0.18} strokeWidth={4} strokeLinecap="round" />
      <Path d="M58 114H100" stroke={ink} strokeOpacity={0.45} strokeWidth={1.5} strokeLinecap="round" />

      {/* seal with ribbons */}
      <Path d={`M${SEAL.x - 10} ${SEAL.y + 8}L${SEAL.x - 16} ${SEAL.y + 32}L${SEAL.x - 8} ${SEAL.y + 27}L${SEAL.x - 2} ${SEAL.y + 34}L${SEAL.x}  ${SEAL.y + 10}Z`} fill={illustration.wax} />
      <Path d={`M${SEAL.x + 10} ${SEAL.y + 8}L${SEAL.x + 16} ${SEAL.y + 32}L${SEAL.x + 8} ${SEAL.y + 27}L${SEAL.x + 2} ${SEAL.y + 34}L${SEAL.x}  ${SEAL.y + 10}Z`} fill={illustration.red} />
      <Path d={SEAL_EDGE} fill={paint(ids.seal)} />
      <Circle cx={SEAL.x} cy={SEAL.y} r={SEAL.r * 0.66} fill="none" stroke={illustration.kiwiRim} strokeWidth={1.4} />
      <G transform={`translate(${SEAL.x} ${SEAL.y})`}>
        <Path d={PERCENT} stroke={illustration.kiwiRim} strokeWidth={2.4} strokeLinecap="round" />
        <Circle cx={-4} cy={-4} r={2.2} fill={illustration.kiwiRim} />
        <Circle cx={4} cy={4} r={2.2} fill={illustration.kiwiRim} />
      </G>

      {/* coupons ("cedole") */}
      <Path d="M40 142H162" stroke={ink} strokeOpacity={0.4} strokeWidth={1.4} strokeDasharray="3 3" />
      {COUPONS.map((x) => (
        <Coupon key={x} x={x} y={144} />
      ))}
      <Coupon x={176} y={138} transform="rotate(14 193 149) translate(10 4)" />
      <Sparkle x={216} y={126} r={6} color={illustration.gold} />
      <Sparkle x={24} y={40} r={7} color={illustration.kiwiFlesh} />
    </ArtSvg>
  );
}
