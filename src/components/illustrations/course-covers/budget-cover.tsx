import { G, Path } from 'react-native-svg';

import { KiwiCoin, KiwiCoinDefs } from '@/components/icons/lib/kiwi-coin-shape';
import { useSvgIds } from '@/components/icons/lib/svg-ids';

import { GlowGradient, SoftEllipse, Sparkle } from '../parts/basics';
import { CoinStack, CoinStackDefs } from '../parts/coin-stack';
import { Piggy, PiggyDefs } from '../parts/piggy';
import { CoverFrame, coverInk, type CourseCoverProps } from './cover-frame';

/** "Gestisci il budget": piggy bank catching a kiwi coin, with savings stacks around. */
export function BudgetCover({ background = 'brand', ...props }: CourseCoverProps) {
  const ids = useSvgIds('shadow', 'body', 'edge', 'face', 'flesh', 'rim', 'bevel', 'coinFlesh');
  const coin = { rim: ids.rim, bevel: ids.bevel, flesh: ids.coinFlesh };
  const ink = coverInk[background];
  return (
    <CoverFrame
      background={background}
      {...props}
      defs={
        <>
          <GlowGradient id={ids.shadow} color={ink.shadow} opacity={ink.shadowOpacity} />
          <PiggyDefs bodyId={ids.body} />
          <CoinStackDefs ids={ids} />
          <KiwiCoinDefs ids={coin} />
        </>
      }
    >
      <SoftEllipse id={ids.shadow} cx={160} cy={166} rx={128} ry={10} />
      <CoinStack ids={ids} cx={62} baseY={167} r={20} count={3} />
      <Piggy bodyId={ids.body} transform="translate(152 104) scale(0.95)" />
      <CoinStack ids={ids} cx={258} baseY={168} r={24} count={4} />
      <G>
        <Path d="M146 10V20M160 4V16M174 10V20" stroke={ink.line} strokeOpacity={0.6} strokeWidth={3} strokeLinecap="round" />
        <KiwiCoin ids={coin} transform="translate(160 36) rotate(18) scale(14)" />
      </G>
      <Sparkle x={96} y={42} r={8} color={ink.sparkle} />
      <Sparkle x={226} y={58} r={6} color={ink.line} />
    </CoverFrame>
  );
}
