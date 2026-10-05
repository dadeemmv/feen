import { Circle, Defs, Ellipse, G, Path } from 'react-native-svg';

import { Linear, Radial } from '@/components/icons/lib/gradients';
import { paint, useSvgIds } from '@/components/icons/lib/svg-ids';
import { illustration } from '@/theme';

import { ArtSvg, type IllustrationProps } from './lib/art-svg';
import { GlowGradient, SoftEllipse, Sparkle } from './parts/basics';
import { OpenBook, OpenBookDefs } from './parts/open-book';

export const HERO_BOOK_SIZE = [320, 220] as const;
const MOTES = [
  [128, 58, 1.6],
  [196, 44, 1.2],
  [182, 92, 1.4],
  [140, 110, 1],
] as const;

/**
 * Home hero: an open book floating in a cone of light above a soft glowing floor, with three
 * sparkles. Transparent background — designed for the dark evergreen hero card.
 */
export function HeroBookSpotlight(props: IllustrationProps) {
  const ids = useSvgIds('cone', 'coneCore', 'source', 'floor', 'shadow', 'cover', 'page');
  return (
    <ArtSvg size={HERO_BOOK_SIZE} {...props}>
      <Defs>
        <Linear id={ids.cone} stops={[[0, illustration.lime, 0.26], [1, illustration.lime, 0]]} />
        <Linear id={ids.coneCore} stops={[[0, illustration.white, 0.22], [0.85, illustration.white, 0]]} />
        <GlowGradient id={ids.source} color={illustration.limeLight} opacity={0.4} />
        <Radial
          id={ids.floor}
          stops={[
            [0, illustration.lime, 0.55],
            [0.45, illustration.lime, 0.2],
            [1, illustration.lime, 0],
          ]}
        />
        <GlowGradient id={ids.shadow} color={illustration.forestDeep} opacity={0.75} />
        <OpenBookDefs ids={ids} cover="lime" />
      </Defs>

      {/* light */}
      <Path d="M128 0H192L268 190H52Z" fill={paint(ids.cone)} />
      <Path d="M146 0H174L220 170H100Z" fill={paint(ids.coneCore)} />
      <SoftEllipse id={ids.source} cx={160} cy={0} rx={70} ry={18} />
      <Ellipse cx={160} cy={186} rx={118} ry={22} fill={paint(ids.floor)} />
      <Ellipse cx={160} cy={186} rx={74} ry={9} fill="none" stroke={illustration.lime} strokeOpacity={0.35} strokeWidth={1.2} />
      <SoftEllipse id={ids.shadow} cx={160} cy={186} rx={62} ry={7} />

      {/* dust motes in the beam */}
      <G fill={illustration.white}>
        {MOTES.map(([x, y, r]) => (
          <Circle key={`${x}-${y}`} cx={x} cy={y} r={r} fillOpacity={0.55} />
        ))}
      </G>

      <OpenBook ids={ids} cover="lime" transform="translate(80 58)" />

      <Sparkle x={66} y={74} r={13} />
      <Sparkle x={262} y={96} r={9} color={illustration.lime} />
      <Sparkle x={240} y={42} r={6} opacity={0.85} />
    </ArtSvg>
  );
}
