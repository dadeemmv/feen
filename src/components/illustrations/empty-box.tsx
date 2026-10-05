import { Defs, G, Path, Polygon, Rect } from 'react-native-svg';

import { Linear, twoStops } from '@/components/icons/lib/gradients';
import { paint, useSvgIds } from '@/components/icons/lib/svg-ids';
import { illustration } from '@/theme';

import { ART, ArtSvg, type IllustrationProps } from './lib/art-svg';
import { GlowGradient, SoftEllipse, Sparkle } from './parts/basics';

/** Box opening: back edge y 70 (x 70–170), front edge y 92 (x 58–182). */
const OPENING = '70,70 170,70 182,92 58,92';
const FRONT = 'M58 92H182V140C182 145.5 177.5 150 172 150H68C62.5 150 58 145.5 58 140Z';
const FLAPS = [
  '70,70 170,70 158,42 82,42',
  '70,70 58,92 26,82 40,58',
  '170,70 182,92 214,82 200,58',
] as const;

/** Friendly empty state: an open, empty box with a few floating sparkles. */
export function EmptyBox(props: IllustrationProps) {
  const ids = useSvgIds('shadow', 'inside', 'front', 'flap');
  const line = illustration.forestLight;
  return (
    <ArtSvg size={ART.spot} {...props}>
      <Defs>
        <GlowGradient id={ids.shadow} opacity={0.18} />
        <Linear id={ids.inside} stops={[[0, illustration.forest, 0.55], [1, illustration.forest, 0.2]]} />
        <Linear id={ids.front} stops={twoStops([illustration.white, illustration.limeLight])} />
        <Linear id={ids.flap} stops={twoStops([illustration.paper, illustration.white])} />
      </Defs>
      <SoftEllipse id={ids.shadow} cx={120} cy={154} rx={86} ry={8} />

      <G strokeLinejoin="round">
        {FLAPS.map((points) => (
          <Polygon key={points} points={points} fill={paint(ids.flap)} stroke={line} strokeWidth={1.5} />
        ))}
        <Polygon points={OPENING} fill={illustration.paper} />
        <Polygon points={OPENING} fill={paint(ids.inside)} stroke={line} strokeWidth={1.5} />
        <Path d={FRONT} fill={paint(ids.front)} stroke={line} strokeWidth={1.5} />
      </G>
      {/* front lip + label */}
      <Path d="M60 97H180" stroke={illustration.white} strokeWidth={2} strokeLinecap="round" />
      <Rect x={98} y={112} width={44} height={22} rx={6} fill={illustration.white} stroke={line} strokeWidth={1.2} />
      <Path d="M106 120H134M106 127H124" stroke={illustration.forest} strokeOpacity={0.3} strokeWidth={2.4} strokeLinecap="round" />

      <Sparkle x={120} y={24} r={8} color={illustration.gold} />
      <Sparkle x={150} y={30} r={4.5} color={illustration.kiwiFlesh} />
      <Sparkle x={94} y={34} r={5} color={illustration.sky} />
    </ArtSvg>
  );
}
