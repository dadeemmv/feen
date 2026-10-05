import { Defs, Path } from 'react-native-svg';

import { KiwiCoin, KiwiCoinDefs } from '@/components/icons/lib/kiwi-coin-shape';
import { useSvgIds } from '@/components/icons/lib/svg-ids';
import { illustration } from '@/theme';

import { ART, ArtSvg, type IllustrationProps } from '../lib/art-svg';
import { GlowGradient, SoftEllipse, Sparkle } from '../parts/basics';
import { Piggy, PiggyDefs } from '../parts/piggy';

/** Lesson art "piggy-bank": saving — a kiwi coin dropping into the piggy bank. */
export function PiggyBankArt(props: IllustrationProps) {
  const ids = useSvgIds('shadow', 'body', 'rim', 'bevel', 'flesh');
  return (
    <ArtSvg size={ART.spot} {...props}>
      <Defs>
        <GlowGradient id={ids.shadow} opacity={0.18} />
        <PiggyDefs bodyId={ids.body} />
        <KiwiCoinDefs ids={ids} />
      </Defs>
      <SoftEllipse id={ids.shadow} cx={116} cy={164} rx={76} ry={8} />
      <Piggy bodyId={ids.body} transform="translate(112 104)" />
      <Path d="M100 8V16M112 2V12M124 8V16" stroke={illustration.gold} strokeWidth={3} strokeLinecap="round" />
      <KiwiCoin ids={ids} transform="translate(112 34) rotate(14) scale(15)" />
      <Sparkle x={196} y={48} r={9} color={illustration.gold} />
      <Sparkle x={36} y={62} r={6} color={illustration.kiwiFlesh} />
    </ArtSvg>
  );
}
