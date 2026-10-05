import { Circle, Defs, Path, Rect } from 'react-native-svg';

import { gradients, illustration } from '@/theme';

import { Linear, twoStops } from './lib/gradients';
import { IconSvg, type IconProps } from './lib/icon-svg';
import { paint, useSvgIds } from './lib/svg-ids';

export type LockIconProps = IconProps & {
  /** 'grey' = soft locked state (default); 'gold' = premium padlock with a steel shackle. */
  variant?: 'grey' | 'gold';
};

/** Padlock for locked milestones, chapters and challenges. */
export function LockIcon({ variant = 'grey', muted, ...rest }: LockIconProps) {
  const ids = useSvgIds('body', 'shackle');
  const gold = variant === 'gold' && !muted;
  const body = gold ? gradients.gold : gradients.muted;
  const shackle: readonly [string, string] = [illustration.mutedLight, gradients.muted[1]];
  const keyhole = gold ? illustration.kiwiRim : illustration.mutedDeep;
  return (
    <IconSvg {...rest}>
      <Defs>
        <Linear id={ids.body} stops={twoStops(body)} />
        <Linear id={ids.shackle} stops={twoStops(shackle)} from={[0, 0]} to={[1, 0]} />
      </Defs>
      <Path
        d="M16 21.5V15.5C16 11 19.6 7.5 24 7.5C28.4 7.5 32 11 32 15.5V21.5"
        stroke={paint(ids.shackle)}
        strokeWidth={4.6}
        strokeLinecap="round"
        fill="none"
      />
      <Rect x={9.5} y={20} width={29} height={23} rx={6.5} fill={paint(ids.body)} />
      <Rect x={13} y={23.2} width={8} height={2.6} rx={1.3} fill={illustration.white} fillOpacity={0.55} />
      <Circle cx={24} cy={30} r={3.2} fill={keyhole} />
      <Rect x={22.7} y={30.5} width={2.6} height={6.5} rx={1.3} fill={keyhole} />
    </IconSvg>
  );
}
