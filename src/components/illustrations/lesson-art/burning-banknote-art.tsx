import { Circle, ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

import { FLAME_CORE, FLAME_OUTER } from '@/components/icons/flame-icon';
import { Linear, twoStops } from '@/components/icons/lib/gradients';
import { KiwiFace, KiwiFleshGradient } from '@/components/icons/lib/kiwi-face';
import { paint, useSvgIds } from '@/components/icons/lib/svg-ids';
import { gradients, illustration } from '@/theme';

import { ART, ArtSvg, type IllustrationProps } from '../lib/art-svg';
import { GlowGradient, SoftEllipse } from '../parts/basics';

/** Note drawn on a 160 × 84 local grid; the right side is eaten by an irregular burnt edge. */
const BURN_EDGE =
  'M124 0C128 7 134 12 132 20C130 27 126 29 128 34C130 40 140 42 140 48C140 55 133 57 134 62C135 70 144 76 142 84';
const NOTE = `M10 0H124${BURN_EDGE.slice('M124 0'.length)}H10C4.5 84 0 79.5 0 74V10C0 4.5 4.5 0 10 0Z`;
const NOTE_T = 'translate(30 58) rotate(-8 80 42)';
/** Euro-like glyph + guilloche rings (generic note, not a real banknote design). */
const CURRENCY = 'M111 32A14 14 0 1 0 111 56M91 40H106M91 48H104';
const GUILLOCHE = 'M40 14A28 28 0 0 1 68 42M40 70A28 28 0 0 1 12 42M16 22A32 32 0 0 1 36 10';

/** [x, y (flame base on the burnt edge, world units), scale]. */
const FLAMES = [
  [152, 60, 1.05],
  [165, 88, 1.45],
  [175, 122, 0.95],
] as const;
const EMBERS = [
  [198, 46, 2.4],
  [206, 72, 1.8],
  [188, 30, 1.6],
  [212, 102, 2],
  [194, 128, 1.4],
] as const;

/** Lesson art "burning-banknote": inflation slowly burns the value of cash. */
export function BurningBanknoteArt(props: IllustrationProps) {
  const ids = useSvgIds('shadow', 'note', 'clip', 'flesh', 'flame', 'core', 'glow');
  return (
    <ArtSvg size={ART.spot} {...props}>
      <Defs>
        <GlowGradient id={ids.shadow} opacity={0.18} />
        <GlowGradient id={ids.glow} color={illustration.orange} opacity={0.35} />
        <Linear id={ids.note} stops={twoStops([illustration.mint, illustration.forestLight])} from={[0, 0]} to={[1, 1]} />
        <Linear id={ids.flame} stops={twoStops(gradients.flame)} from={[0.3, 0]} to={[0.6, 1]} />
        <Linear id={ids.core} stops={twoStops([gradients.flame[0], illustration.flameCore])} />
        <KiwiFleshGradient id={ids.flesh} />
        <ClipPath id={ids.clip}>
          <Path d={NOTE} />
        </ClipPath>
      </Defs>

      <SoftEllipse id={ids.shadow} cx={112} cy={158} rx={86} ry={8} />
      <SoftEllipse id={ids.glow} cx={168} cy={92} rx={64} ry={64} />

      <G transform={NOTE_T}>
        <Path d={NOTE} fill={paint(ids.note)} />
        <G clipPath={paint(ids.clip)}>
          <Rect x={7} y={7} width={150} height={70} rx={6} stroke={illustration.forest} strokeOpacity={0.3} strokeWidth={1.5} fill="none" />
          <Path d={GUILLOCHE} stroke={illustration.forest} strokeOpacity={0.25} strokeWidth={1.2} fill="none" />
          <Circle cx={40} cy={42} r={22} fill={illustration.white} fillOpacity={0.6} />
          <KiwiFace fleshId={ids.flesh} detail="mid" transform="translate(40 42) scale(15)" />
          <Path d={CURRENCY} stroke={illustration.forest} strokeOpacity={0.75} strokeWidth={4} strokeLinecap="round" fill="none" />
          <Rect x={72} y={13} width={30} height={5} rx={2.5} fill={illustration.forest} fillOpacity={0.3} />
          <Rect x={72} y={66} width={44} height={5} rx={2.5} fill={illustration.forest} fillOpacity={0.3} />
          {/* charred band along the burnt edge */}
          <Path d={BURN_EDGE} stroke={illustration.kiwiSeed} strokeOpacity={0.7} strokeWidth={12} fill="none" />
        </G>
        <Path d={BURN_EDGE} stroke={illustration.orange} strokeWidth={2.6} strokeLinecap="round" fill="none" />
      </G>

      {FLAMES.map(([x, y, s]) => (
        <G key={x} transform={`translate(${x - 24 * s} ${y - 44 * s}) scale(${s})`}>
          <Path d={FLAME_OUTER} fill={paint(ids.flame)} />
          <Path d={FLAME_CORE} fill={paint(ids.core)} />
        </G>
      ))}
      <G>
        {EMBERS.map(([x, y, r], i) => (
          <Circle key={x} cx={x} cy={y} r={r} fill={i % 2 ? illustration.orange : illustration.flameCore} />
        ))}
      </G>
      <Path d="M170 26C162 16 178 10 170 0" stroke={illustration.ink} strokeOpacity={0.08} strokeWidth={5} strokeLinecap="round" fill="none" />
    </ArtSvg>
  );
}
