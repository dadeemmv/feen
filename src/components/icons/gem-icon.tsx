import { Defs, G, Path, Polygon } from 'react-native-svg';

import { gradients, illustration } from '@/theme';

import { sparklePath } from './lib/geometry';
import { Linear, twoStops } from './lib/gradients';
import { IconSvg, type IconProps } from './lib/icon-svg';
import { paint, useSvgIds } from './lib/svg-ids';

const GLINT = sparklePath(15.5, 14.5, 4.6, 0.18);
const OUTLINE = '14,9 34,9 42.5,18.5 24,41.5 5.5,18.5';

/** [points, colour key, opacity] — light facets on the crown, darker ones on the right. */
const FACETS: readonly (readonly [string, 'light' | 'dark', number])[] = [
  ['5.5,18.5 14,9 18.5,18.5', 'light', 0.28],
  ['14,9 24,9 18.5,18.5', 'light', 0.5],
  ['24,9 18.5,18.5 29.5,18.5', 'light', 0.3],
  ['24,9 34,9 29.5,18.5', 'light', 0.16],
  ['34,9 42.5,18.5 29.5,18.5', 'dark', 0.06],
  ['5.5,18.5 18.5,18.5 24,41.5', 'light', 0.14],
  ['29.5,18.5 42.5,18.5 24,41.5', 'dark', 0.16],
];

/** Finanz Pro: violet brilliant-cut gem. */
export function GemIcon({ muted, ...rest }: IconProps) {
  const ids = useSvgIds('body');
  const shade = muted ? illustration.mutedDeep : illustration.ink;
  return (
    <IconSvg {...rest}>
      <Defs>
        <Linear id={ids.body} stops={twoStops(muted ? gradients.muted : gradients.gem)} from={[0.2, 0]} to={[0.8, 1]} />
      </Defs>
      {/* the stroke in the same paint rounds the silhouette's corners */}
      <Polygon points={OUTLINE} fill={paint(ids.body)} stroke={paint(ids.body)} strokeWidth={3} strokeLinejoin="round" />
      <G>
        {FACETS.map(([points, tone, opacity]) => (
          <Polygon
            key={points}
            points={points}
            fill={tone === 'light' ? illustration.white : shade}
            fillOpacity={opacity}
          />
        ))}
      </G>
      <Path d={GLINT} fill={illustration.white} fillOpacity={0.95} />
    </IconSvg>
  );
}
