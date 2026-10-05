/**
 * Open book on a 160 × 96 local grid (spine at x = 80). The left half is drawn once and mirrored
 * for the right half, so both pages share the same gradients.
 */
import { G, Path } from 'react-native-svg';

import { Linear, twoStops } from '@/components/icons/lib/gradients';
import { paint } from '@/components/icons/lib/svg-ids';
import { gradients, illustration } from '@/theme';

export type OpenBookIds = { cover: string; page: string };
export type BookCover = 'lime' | 'forest';

const COVER = 'M80 96C62 86 34 84 0 90V18C34 10 62 14 80 28Z';
const UNDER_PAGES = ['M80 92C63 82 36 80 5 85V14C36 6 63 10 80 25Z', 'M80 89C63 79 38 77 8 82V12C38 4.5 63 8.5 80 23.5Z'];
const PAGE = 'M80 86C64 76 40 74 11 79V10C40 3 64 7 80 22Z';
/** Text lines follow the curvature of the page's top edge. */
const LINES = [13, 23, 33, 43, 53].map((d, i) =>
  i === 4
    ? `M23 ${7.6 + d}C34 ${6 + d} 44 ${6 + d} 52 ${8 + d}`
    : `M23 ${7.6 + d}C40 ${5.5 + d} 60 ${7.5 + d} 71 ${15.5 + d}`,
);

export function OpenBookDefs({ ids, cover }: { ids: OpenBookIds; cover: BookCover }) {
  return (
    <>
      <Linear
        id={ids.cover}
        stops={twoStops(cover === 'lime' ? gradients.accent : [illustration.forest, illustration.forestDeep])}
      />
      <Linear
        id={ids.page}
        from={[0, 0]}
        to={[1, 0]}
        stops={[
          [0, illustration.white],
          [0.7, illustration.white],
          [1, illustration.limeLight],
        ]}
      />
    </>
  );
}

function BookHalf({ ids, cover }: { ids: OpenBookIds; cover: BookCover }) {
  return (
    <G>
      <Path d={COVER} fill={paint(ids.cover)} />
      {UNDER_PAGES.map((d) => (
        <Path key={d} d={d} fill={illustration.paper} stroke={illustration.forestLight} strokeOpacity={0.8} strokeWidth={0.8} />
      ))}
      <Path d={PAGE} fill={paint(ids.page)} />
      <G stroke={cover === 'lime' ? illustration.lime : illustration.kiwiFlesh} strokeOpacity={cover === 'lime' ? 0.9 : 0.75} strokeWidth={2.4} strokeLinecap="round" fill="none">
        {LINES.map((d) => (
          <Path key={d} d={d} />
        ))}
      </G>
    </G>
  );
}

type OpenBookProps = { ids: OpenBookIds; cover: BookCover; transform?: string };

export function OpenBook({ ids, cover, transform }: OpenBookProps) {
  return (
    <G transform={transform}>
      <BookHalf ids={ids} cover={cover} />
      <G transform="translate(160 0) scale(-1 1)">
        <BookHalf ids={ids} cover={cover} />
      </G>
      <Path d="M80 22V86" stroke={illustration.forestLight} strokeWidth={1.4} strokeLinecap="round" />
    </G>
  );
}
