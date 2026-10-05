import { G, Path } from 'react-native-svg';

import { illustration } from '@/theme';

/** Heater shield on the 48 grid. */
export const SHIELD_PATH =
  'M24 4.5C24.5 4.5 25 4.6 25.5 4.8L37.8 9.6C39.4 10.2 40.5 11.8 40.5 13.5V22.5' +
  'C40.5 32.8 33.6 40.4 25.6 43.9C24.6 44.3 23.4 44.3 22.4 43.9C14.4 40.4 7.5 32.8 7.5 22.5' +
  'V13.5C7.5 11.8 8.6 10.2 10.2 9.6L22.5 4.8C23 4.6 23.5 4.5 24 4.5Z';

/** Left half — painted lighter to read as a bevelled facet. */
const SHIELD_LEFT_FACET =
  'M24 4.5C23.5 4.5 23 4.6 22.5 4.8L10.2 9.6C8.6 10.2 7.5 11.8 7.5 13.5V22.5' +
  'C7.5 32.8 14.4 40.4 22.4 43.9C22.9 44.1 23.5 44.2 24 44.2Z';

/** Inner chevron (rank mark), pointing down. */
const SHIELD_CHEVRON = 'M14.5 17.5L24 24.5L33.5 17.5V23.3L24 30.3L14.5 23.3Z';

type ShieldDetailsProps = {
  chevronColor?: string;
  /** Draw the rank chevron (default). Pass false to place a custom emblem instead. */
  chevron?: boolean;
};

/** Facet + chevron overlay drawn on top of a filled `SHIELD_PATH`. */
export function ShieldDetails({ chevronColor = illustration.white, chevron = true }: ShieldDetailsProps) {
  return (
    <G>
      <Path d={SHIELD_LEFT_FACET} fill={illustration.white} fillOpacity={0.2} />
      {chevron ? (
        <Path d={SHIELD_CHEVRON} fill={chevronColor} fillOpacity={0.92} strokeLinejoin="round" stroke={chevronColor} strokeWidth={1.4} />
      ) : null}
      <Path
        d="M11.5 14.2V22.5C11.5 27.6 13.4 31.9 16.4 35.2"
        stroke={illustration.white}
        strokeOpacity={0.55}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
    </G>
  );
}
