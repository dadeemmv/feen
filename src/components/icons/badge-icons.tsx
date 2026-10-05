import { Circle, Defs, Ellipse, Path } from 'react-native-svg';

import { gradients, illustration } from '@/theme';

import { Linear, twoStops } from './lib/gradients';
import { IconSvg, type IconProps } from './lib/icon-svg';
import { paint, useSvgIds } from './lib/svg-ids';

type BadgeProps = IconProps & { stops: readonly [string, string]; glyph: string };

function RoundBadge({ muted, stops, glyph, ...rest }: BadgeProps) {
  const ids = useSvgIds('disc');
  return (
    <IconSvg {...rest}>
      <Defs>
        <Linear id={ids.disc} stops={twoStops(muted ? gradients.muted : stops)} />
      </Defs>
      <Circle cx={24} cy={24} r={21} fill={paint(ids.disc)} />
      <Ellipse cx={24} cy={13.5} rx={13} ry={6.5} fill={illustration.white} fillOpacity={0.18} />
      <Path d={glyph} stroke={illustration.white} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </IconSvg>
  );
}

/** Correct answer / completed. */
export function CheckBadgeIcon(props: IconProps) {
  return <RoundBadge {...props} stops={[illustration.kiwiFlesh, illustration.kiwiFleshDark]} glyph="M15 24.5L21.2 30.7L33.5 18.2" />;
}

/** Wrong answer. */
export function CrossBadgeIcon(props: IconProps) {
  return <RoundBadge {...props} stops={[gradients.heart[0], illustration.red]} glyph="M17 17L31 31M31 17L17 31" />;
}
