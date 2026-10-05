import { Circle, Defs, Ellipse, G, Path, Rect } from 'react-native-svg';

import { Linear, twoStops } from '@/components/icons/lib/gradients';
import { paint, useSvgIds } from '@/components/icons/lib/svg-ids';
import { gradients, illustration } from '@/theme';

import { ART, ArtSvg, type IllustrationProps } from '../lib/art-svg';
import { GlowGradient, SoftEllipse, Sparkle } from '../parts/basics';

const BASKET = 'M62 64H194L182 124H78Z';
const BASKET_GRID = 'M92 64L96 124M122 64V124M150 64V124M178 64L172 124M68 86H190M73 106H186';

/** Lesson art "shopping-cart": a grocery cart full of shopping (the monthly spend). */
export function ShoppingCartArt(props: IllustrationProps) {
  const ids = useSvgIds('shadow', 'bread', 'basket', 'greens', 'apple', 'orange');
  const metal = illustration.forest;
  return (
    <ArtSvg size={ART.spot} {...props}>
      <Defs>
        <GlowGradient id={ids.shadow} opacity={0.18} />
        <Linear id={ids.bread} stops={twoStops(gradients.gold)} />
        <Linear id={ids.basket} stops={twoStops([illustration.white, illustration.limeLight], [0.92, 0.92])} />
        <Linear id={ids.greens} stops={twoStops([illustration.kiwiFlesh, illustration.kiwiFleshDark])} />
        <Linear id={ids.apple} stops={twoStops(gradients.heart)} from={[0.2, 0]} to={[0.8, 1]} />
        <Linear id={ids.orange} stops={twoStops(gradients.flame)} from={[0.2, 0]} to={[0.8, 1]} />
      </Defs>
      <SoftEllipse id={ids.shadow} cx={128} cy={160} rx={84} ry={8} />

      {/* groceries (behind the basket front) */}
      <G>
        <G transform="rotate(-24 96 48)">
          <Rect x={62} y={40} width={70} height={17} rx={8.5} fill={paint(ids.bread)} />
          <Path d="M76 45L82 52M92 45L98 52M108 45L114 52" stroke={illustration.kiwiRim} strokeWidth={2.4} strokeLinecap="round" />
        </G>
        <Rect x={150} y={24} width={26} height={44} rx={4} fill={illustration.white} stroke={illustration.forestLight} strokeWidth={1.5} />
        <Path d="M150 30L156 18H170L176 30Z" fill={illustration.white} stroke={illustration.forestLight} strokeWidth={1.5} strokeLinejoin="round" />
        <Rect x={150} y={38} width={26} height={14} fill={illustration.sky} />
        <G fill={paint(ids.greens)}>
          <Circle cx={126} cy={52} r={13} />
          <Circle cx={140} cy={46} r={11} />
          <Circle cx={116} cy={42} r={9} />
        </G>
        <Circle cx={104} cy={60} r={10} fill={paint(ids.orange)} />
        <Circle cx={186} cy={58} r={11} fill={paint(ids.apple)} />
        <Path d="M186 47C186 43 189 40 193 40" stroke={illustration.kiwiFleshDark} strokeWidth={2.4} strokeLinecap="round" fill="none" />
        <Ellipse cx={182} cy={53} rx={3} ry={2} fill={illustration.white} fillOpacity={0.6} />
      </G>

      {/* cart */}
      <Path d={BASKET} fill={paint(ids.basket)} />
      <Path d={BASKET_GRID} stroke={metal} strokeOpacity={0.35} strokeWidth={2} />
      <Path d={BASKET} stroke={metal} strokeWidth={5} strokeLinejoin="round" fill="none" />
      <Path d="M30 42H48L62 64M78 124L84 140H184" stroke={metal} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Rect x={22} y={37} width={18} height={10} rx={5} fill={illustration.forestDeep} />
      <G>
        <Circle cx={98} cy={150} r={9} fill={illustration.forestDeep} />
        <Circle cx={98} cy={150} r={3.5} fill={illustration.forestLight} />
        <Circle cx={170} cy={150} r={9} fill={illustration.forestDeep} />
        <Circle cx={170} cy={150} r={3.5} fill={illustration.forestLight} />
      </G>

      <Sparkle x={40} y={96} r={7} color={illustration.gold} />
      <Sparkle x={212} y={100} r={9} color={illustration.kiwiFlesh} />
    </ArtSvg>
  );
}
