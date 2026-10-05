/**
 * Showcase: chips, stat chips (bump / shake / roll), tags, badges, counters.
 */
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BookOpen, Check, Clock } from 'lucide-react-native';

import { FlameIcon, HeartIcon, KiwiCoinIcon } from '@/components/icons';
import { spacing } from '@/theme';

import { Badge } from '../badge';
import { Button } from '../button';
import { Card } from '../card';
import { Chip, type ChipVariant } from '../chip';
import { CountUp } from '../count-up';
import { iconSize } from '../metrics';
import { RollingNumber } from '../rolling-number';
import { StatChip } from '../stat-chip';
import { Tag } from '../tag';
import { Text } from '../text';
import type { Tone } from '../tones';
import { ShowcaseRow, ShowcaseSection } from './section';

const CHIP_VARIANTS: ChipVariant[] = ['soft', 'outline', 'solid', 'surface'];
const CHIP_TONES: Tone[] = ['neutral', 'accent', 'brand', 'success', 'danger', 'warning', 'streak', 'coin', 'pro'];
const TAG_TONES: Tone[] = ['butter', 'mint', 'sky', 'blush', 'lilac', 'accent', 'neutral', 'pro', 'danger'];

export function ChipShowcase() {
  const [filter, setFilter] = useState('tutti');
  return (
    <ShowcaseSection title="Chip · Tag · Badge">
      {CHIP_VARIANTS.map((variant) => (
        <ShowcaseRow key={variant} label={variant}>
          {CHIP_TONES.slice(0, variant === 'surface' ? 3 : CHIP_TONES.length).map((tone) => (
            <Chip key={tone} label={tone} tone={tone} variant={variant} />
          ))}
        </ShowcaseRow>
      ))}
      <ShowcaseRow label="content chips">
        <Chip label="+500" icon={<KiwiCoinIcon size={iconSize.sm} />} variant="surface" />
        <Chip label="13 capitoli" icon={BookOpen} size="sm" />
        <Chip label="Gratuito" iconRight="🎁" tone="accent" size="sm" />
        <Chip label="23:59" icon={Clock} variant="outline" />
        <Chip label="Completato" icon={Check} tone="success" />
      </ShowcaseRow>
      <ShowcaseRow label="filter chips (selected → solid)">
        {['tutti', 'base', 'intermedio', 'avanzato'].map((value) => (
          <Chip
            key={value}
            label={value}
            tone="brand"
            variant="outline"
            selected={filter === value}
            onPress={() => setFilter(value)}
          />
        ))}
      </ShowcaseRow>
      <ShowcaseRow label="tags">
        <Tag label="Indovina" emoji="🎩" />
        <Tag label="Mettiti alla prova" emoji="🎩" />
        {TAG_TONES.map((tone) => (
          <Tag key={tone} label={tone} tone={tone} size="sm" />
        ))}
        <Tag label="Pro" tone="pro" solid />
        <Tag label="Bonus" tone="accent" solid />
      </ShowcaseRow>
      <ShowcaseRow label="badges">
        <Badge />
        <Badge count={3} />
        <Badge count={120} />
        <Badge count={7} tone="brand" size="sm" />
        <Badge count={1} tone="accent" ring={false} />
      </ShowcaseRow>
    </ShowcaseSection>
  );
}

export function StatChipShowcase() {
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [coins, setCoins] = useState(0);
  const [unlimited, setUnlimited] = useState(false);

  return (
    <ShowcaseSection title="StatChip" note="Bumps on change, shakes when the value drops, digits roll.">
      <ShowcaseRow label="economy icons">
        <StatChip kind="streak" value={streak} muted={false} icon={<FlameIcon size={iconSize.md} muted={streak === 0} />} />
        <StatChip kind="lives" value={lives} unlimited={unlimited} icon={<HeartIcon size={iconSize.md} muted={lives === 0} />} />
        <StatChip kind="coins" value={coins} icon={<KiwiCoinIcon size={iconSize.md} />} />
      </ShowcaseRow>
      <ShowcaseRow label="lucide fallback">
        <StatChip kind="streak" value={streak} />
        <StatChip kind="lives" value={lives} unlimited={unlimited} />
        <StatChip kind="coins" value={coins} />
      </ShowcaseRow>
      <ShowcaseRow>
        <Button title="+1 streak" size="sm" variant="secondary" onPress={() => setStreak((v) => v + 1)} />
        <Button title="−1 vita" size="sm" variant="secondary" onPress={() => setLives((v) => Math.max(0, v - 1))} />
        <Button title="+1 vita" size="sm" variant="secondary" onPress={() => setLives((v) => Math.min(3, v + 1))} />
        <Button title="+250 kiwi" size="sm" variant="secondary" onPress={() => setCoins((v) => v + 250)} />
        <Button title="∞ vite" size="sm" variant="outline" onPress={() => setUnlimited((v) => !v)} />
      </ShowcaseRow>
    </ShowcaseSection>
  );
}

export function CounterShowcase() {
  const [value, setValue] = useState(1250);
  const [runKey, setRunKey] = useState(0);
  return (
    <ShowcaseSection title="RollingNumber · CountUp">
      <View style={styles.row}>
        <RollingNumber value={value} variant="displaySm" />
        <Button title="+" size="sm" variant="secondary" onPress={() => setValue((v) => v + 50)} />
        <Button title="−" size="sm" variant="secondary" onPress={() => setValue((v) => v - 50)} />
      </View>
      <Card variant="brand" padding="lg" contentStyle={styles.center}>
        <CountUp key={runKey} value={12} color="accentText" align="center" />
        <Text variant="displaySm" color="accentText" align="center">
          GIORNI DI FILA
        </Text>
        <Button title="Riproduci" size="sm" variant="ghost" onPress={() => setRunKey((k) => k + 1)} />
      </Card>
    </ShowcaseSection>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  center: { alignItems: 'center', gap: spacing.xxs },
});
