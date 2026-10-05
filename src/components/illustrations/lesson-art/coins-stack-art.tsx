import { Defs } from 'react-native-svg';

import { KiwiCoin, KiwiCoinDefs } from '@/components/icons/lib/kiwi-coin-shape';
import { useSvgIds } from '@/components/icons/lib/svg-ids';
import { illustration } from '@/theme';

import { ART, ArtSvg, type IllustrationProps } from '../lib/art-svg';
import { GlowGradient, SoftEllipse, Sparkle } from '../parts/basics';
import { CoinStack, CoinStackDefs } from '../parts/coin-stack';

/** Lesson art "coins-stack": growing stacks of kiwi coins with one coin standing in front. */
export function CoinsStackArt(props: IllustrationProps) {
  const ids = useSvgIds('shadow', 'edge', 'face', 'flesh', 'rim', 'bevel', 'coinFlesh');
  const coin = { rim: ids.rim, bevel: ids.bevel, flesh: ids.coinFlesh };
  return (
    <ArtSvg size={ART.spot} {...props}>
      <Defs>
        <GlowGradient id={ids.shadow} opacity={0.2} />
        <CoinStackDefs ids={ids} />
        <KiwiCoinDefs ids={coin} />
      </Defs>
      <SoftEllipse id={ids.shadow} cx={120} cy={158} rx={100} ry={10} />
      <CoinStack ids={ids} cx={66} baseY={156} r={26} count={3} />
      <CoinStack ids={ids} cx={172} baseY={154} r={26} count={5} />
      <CoinStack ids={ids} cx={118} baseY={162} r={30} count={7} />
      <KiwiCoin ids={coin} detail="mid" transform="translate(188 128) rotate(-8) scale(26)" />
      <Sparkle x={36} y={52} r={8} color={illustration.gold} />
      <Sparkle x={214} y={36} r={10} color={illustration.gold} />
      <Sparkle x={152} y={22} r={5} color={illustration.kiwiFlesh} />
    </ArtSvg>
  );
}
