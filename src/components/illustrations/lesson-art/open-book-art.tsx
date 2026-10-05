import { Defs } from 'react-native-svg';

import { useSvgIds } from '@/components/icons/lib/svg-ids';
import { illustration } from '@/theme';

import { ART, ArtSvg, type IllustrationProps } from '../lib/art-svg';
import { GlowGradient, SoftEllipse, Sparkle } from '../parts/basics';
import { OpenBook, OpenBookDefs } from '../parts/open-book';

/** Lesson art "open-book": evergreen-bound book with lime-tinted pages, for paper cards. */
export function OpenBookArt(props: IllustrationProps) {
  const ids = useSvgIds('shadow', 'glow', 'cover', 'page');
  return (
    <ArtSvg size={ART.spot} {...props}>
      <Defs>
        <GlowGradient id={ids.shadow} opacity={0.18} />
        <GlowGradient id={ids.glow} color={illustration.lime} opacity={0.45} />
        <OpenBookDefs ids={ids} cover="forest" />
      </Defs>
      <SoftEllipse id={ids.glow} cx={120} cy={92} rx={112} ry={72} />
      <SoftEllipse id={ids.shadow} cx={120} cy={160} rx={78} ry={8} />
      <OpenBook ids={ids} cover="forest" transform="translate(40 48)" />
      <Sparkle x={36} y={42} r={10} color={illustration.gold} />
      <Sparkle x={206} y={30} r={7} color={illustration.kiwiFlesh} />
      <Sparkle x={214} y={124} r={5} color={illustration.gold} />
    </ArtSvg>
  );
}
