import { Circle, Defs, Ellipse, G, Path, Rect } from 'react-native-svg';

import { FzMonogram } from '@/components/icons/finanz-logo';
import { scallopPath } from '@/components/icons/lib/geometry';
import { Linear, twoStops } from '@/components/icons/lib/gradients';
import { paint, useSvgIds } from '@/components/icons/lib/svg-ids';
import { illustration } from '@/theme';

import { ArtSvg, type IllustrationProps } from './lib/art-svg';

export const REFERRAL_ENVELOPES_SIZE = [320, 160] as const;
/** Envelope artboard: 96 × 64, seal centred on the flap tip. */
const W = 96;
const H = 64;
const SEAL = { x: 48, y: 38, r: 13 } as const;
const SEAL_EDGE = scallopPath(SEAL.x, SEAL.y, SEAL.r, 11, 0.12);
const FLAP = 'M0 8C0 3.6 3.6 0 8 0H88C92.4 0 96 3.6 96 8L53 38.5C50 40.6 46 40.6 43 38.5Z';
/** FZ monogram (48 grid, ~31 wide) scaled to sit inside the seal. */
const MONO_SCALE = 0.3;
const MONO_T = `translate(${SEAL.x - 24 * MONO_SCALE} ${SEAL.y - 24 * MONO_SCALE}) scale(${MONO_SCALE})`;

const ENVELOPES = [
  { x: 14, y: 58, rotate: -9 },
  { x: 210, y: 58, rotate: 9 },
  { x: 112, y: 42, rotate: 2 },
] as const;

type EnvelopeIds = { paper: string; flap: string; wax: string };

function Envelope({ ids, x, y, rotate }: { ids: EnvelopeIds; x: number; y: number; rotate: number }) {
  return (
    <G transform={`translate(${x} ${y}) rotate(${rotate} ${W / 2} ${H / 2})`}>
      <Rect x={2} y={6} width={W} height={H} rx={8} fill={illustration.ink} fillOpacity={0.22} />
      <Rect width={W} height={H} rx={8} fill={paint(ids.paper)} />
      <Path d="M5 60L40 33M91 60L56 33" stroke={illustration.ink} strokeOpacity={0.1} strokeWidth={1.4} strokeLinecap="round" />
      <Path d={FLAP} fill={paint(ids.flap)} />
      <Path d="M3 5L43 38.5C46 40.6 50 40.6 53 38.5L93 5" stroke={illustration.ink} strokeOpacity={0.08} strokeWidth={1.2} fill="none" />
      {/* wax seal */}
      <Path d={SEAL_EDGE} transform="translate(0.8 1.6)" fill={illustration.ink} fillOpacity={0.22} />
      <Path d={SEAL_EDGE} fill={paint(ids.wax)} />
      <Circle cx={SEAL.x} cy={SEAL.y} r={SEAL.r * 0.7} fill="none" stroke={illustration.ink} strokeOpacity={0.18} strokeWidth={1.2} />
      <FzMonogram color={illustration.ink} strokeWidth={5.5} transform={`translate(0.4 0.7) ${MONO_T}`} />
      <G opacity={0.5}>
        <FzMonogram color={illustration.white} strokeWidth={5.5} transform={MONO_T} />
      </G>
      <Ellipse cx={SEAL.x - 5} cy={SEAL.y - 7} rx={4} ry={2} fill={illustration.white} fillOpacity={0.45} transform={`rotate(-25 ${SEAL.x - 5} ${SEAL.y - 7})`} />
    </G>
  );
}

/** Three tilted envelopes sealed with red "FZ" wax — "30 giorni di Finanz Pro" referral promo. */
export function ReferralEnvelopes(props: IllustrationProps) {
  const ids = useSvgIds('paper', 'flap', 'wax');
  return (
    <ArtSvg size={REFERRAL_ENVELOPES_SIZE} {...props}>
      <Defs>
        <Linear id={ids.paper} stops={twoStops([illustration.white, illustration.paper])} />
        <Linear id={ids.flap} stops={twoStops([illustration.white, illustration.paper])} from={[0, 1]} to={[0, 0]} />
        <Linear id={ids.wax} stops={twoStops([illustration.red, illustration.wax])} from={[0.2, 0]} to={[0.8, 1]} />
      </Defs>
      {ENVELOPES.map((e) => (
        <Envelope key={e.x} ids={ids} {...e} />
      ))}
    </ArtSvg>
  );
}
