import { G, Path, Rect } from 'react-native-svg';

import { gradients, illustration } from '@/theme';

import { Linear, twoStops } from './gradients';
import { paint } from './svg-ids';

/** Gold cup trophy on the 48 grid — shared by `TrophyIcon` and the `TrophyCups` illustration. */
export const TROPHY_CUP =
  'M13.5 8C13.5 7.2 14.2 6.5 15 6.5H33C33.8 6.5 34.5 7.2 34.5 8V16.5C34.5 23 29.8 28 24 28' +
  'C18.2 28 13.5 23 13.5 16.5Z';
export const TROPHY_HANDLES =
  'M14 11.5H10.8C9 11.5 7.8 12.9 8 14.7C8.5 19.1 11.6 22.1 15.8 22.7' +
  'M34 11.5H37.2C39 11.5 40.2 12.9 40 14.7C39.5 19.1 36.4 22.1 32.2 22.7';
export const TROPHY_STEM = 'M21.5 27.5H26.5V30.5C26.5 32 27.5 33.2 29 33.8H19C20.5 33.2 21.5 32 21.5 30.5Z';
const STAR =
  'M24 11.2L25.4 14.1L28.5 14.5L26.2 16.7L26.8 19.8L24 18.3L21.2 19.8L21.8 16.7L19.5 14.5L22.6 14.1Z';

export type TrophyIds = { cup: string; base: string };

/** Gradients for `TrophyBody`; render inside `<Defs>`. */
export function TrophyDefs({ ids, muted }: { ids: TrophyIds; muted?: boolean }) {
  return (
    <>
      <Linear id={ids.cup} stops={twoStops(muted ? gradients.muted : gradients.gold)} from={[0, 0]} to={[1, 0.6]} />
      <Linear id={ids.base} stops={twoStops(muted ? gradients.muted : [illustration.goldDeep, illustration.kiwiRim])} />
    </>
  );
}

/** The trophy artwork (no `<Svg>`), drawn on the 48 grid. */
export function TrophyBody({ ids, muted, transform }: { ids: TrophyIds; muted?: boolean; transform?: string }) {
  const deep = muted ? illustration.mutedDeep : illustration.kiwiRim;
  return (
    <G transform={transform}>
      <Path d={TROPHY_HANDLES} stroke={paint(ids.cup)} strokeWidth={3.2} strokeLinecap="round" fill="none" />
      <Path d={TROPHY_STEM} fill={paint(ids.base)} />
      <Path d={TROPHY_CUP} fill={paint(ids.cup)} />
      <Path d={STAR} fill={illustration.white} fillOpacity={0.9} strokeLinejoin="round" stroke={illustration.white} strokeWidth={0.8} />
      <Path
        d="M17.5 11V16.5C17.5 19.4 18.7 21.9 20.6 23.4"
        stroke={illustration.white}
        strokeOpacity={0.55}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
      <Rect x={15} y={33.5} width={18} height={4.5} rx={1.6} fill={paint(ids.base)} />
      <Rect x={12.5} y={37.5} width={23} height={6.5} rx={2.2} fill={deep} />
      <Rect x={18} y={39.6} width={12} height={2.3} rx={1.15} fill={illustration.white} fillOpacity={0.35} />
    </G>
  );
}
