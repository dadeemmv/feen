/**
 * Completion stats: XP (bolt), Kiwi (coin) and Precisione (ring that fills to the accuracy), each
 * value counting up with a small stagger. Raised evergreen tiles on the brand surface.
 */
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { BoltIcon, KiwiCoinIcon } from '@/components/icons';
import { CountUp, StatTile, iconSize } from '@/components/ui';
import { spacing, useTheme } from '@/theme';

import { COPY } from '../copy';
import { COMPLETION } from '../metrics';
import { useTween } from './use-tween';

export type RewardTilesProps = {
  xp: number;
  coins: number;
  /** 0…1. */
  accuracy: number;
  /** Delay before the first counter starts (ms). */
  delay: number;
};

const plus = (n: number) => `+${n}`;
const percent = (n: number) => `${n}%`;

export function RewardTiles({ xp, coins, accuracy, delay }: RewardTilesProps) {
  const step = COMPLETION.revealMs;
  return (
    <View style={styles.row}>
      <StatTile
        size="lg"
        icon={<BoltIcon size={iconSize.xl} />}
        value={<CountUp value={xp} format={plus} variant="displaySm" delay={delay} />}
        label={COPY.completion.xp}
      />
      <StatTile
        size="lg"
        icon={<KiwiCoinIcon size={iconSize.xl} muted={coins === 0} />}
        value={<CountUp value={coins} format={plus} variant="displaySm" delay={delay + step} />}
        label={COPY.completion.kiwi}
      />
      <StatTile
        size="lg"
        icon={<AccuracyRing ratio={accuracy} delay={delay + step * 2} />}
        value={<CountUp value={Math.round(accuracy * 100)} format={percent} variant="displaySm" delay={delay + step * 2} />}
        label={COPY.completion.accuracy}
      />
    </View>
  );
}

function AccuracyRing({ ratio, delay }: { ratio: number; delay: number }) {
  const theme = useTheme();
  const shown = useTween(ratio, delay);
  const size = COMPLETION.ring;
  const stroke = COMPLETION.ringStroke;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const centre = size / 2;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <Circle cx={centre} cy={centre} r={r} stroke={theme.colors.border} strokeWidth={stroke} fill="none" />
      <Circle
        cx={centre}
        cy={centre}
        r={r}
        stroke={theme.colors.accentSolid}
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={circumference * (1 - Math.min(1, Math.max(0, shown)))}
        transform={`rotate(-90 ${centre} ${centre})`}
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.xs, alignSelf: 'stretch' },
});
