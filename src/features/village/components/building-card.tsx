/**
 * A building as a product card (on the model of Bending Spoons' product cards): its tint, the
 * glow of its colour under it, name and topic, state, and the building's scene bleeding out of
 * the card's edge. The whole card opens the building.
 */
import { StyleSheet, View } from 'react-native';

import { PressableScale, Text } from '@/components/ui';
import { BUILDINGS, type BuildingId } from '@/content/village';
import type { BuildingState } from '@/store';
import { buildingTones, radius, spacing } from '@/theme';

import { VILLAGE_COPY } from '../copy';
import { BuildingScene } from './building-scene';

export type BuildingCardProps = {
  id: BuildingId;
  state: BuildingState;
  done: number;
  progress?: number;
  onPress: () => void;
};

const ART = 108;

export function BuildingCard({ id, state, done, progress, onPress }: BuildingCardProps) {
  const b = BUILDINGS[id];
  const tone = buildingTones[b.tone];
  const total = b.chapterIds.length;
  return (
    <PressableScale
      onPress={onPress}
      haptic="selection"
      accessibilityLabel={VILLAGE_COPY.buildingA11y(b.name, b.topic, VILLAGE_COPY.state[state])}
      accessibilityHint={VILLAGE_COPY.lessons.see}
      style={[styles.card, { backgroundColor: tone.tint, boxShadow: `0px 70px 70px -70px ${tone.glow}` }]}>
      <View style={styles.text}>
        <Text variant="titleMd">{b.name}</Text>
        <Text variant="bodySm" style={{ color: tone.deep }}>
          {b.topic}
        </Text>
        <View style={styles.meta}>
          <Text variant="labelSm" style={{ color: tone.deep }}>
            {VILLAGE_COPY.stateShort[state]}
          </Text>
          <Text variant="labelSm" style={{ color: tone.deep }}>
            {`· ${VILLAGE_COPY.lessons.count(done, total)}`}
          </Text>
        </View>
      </View>
      <BuildingScene id={id} state={state} progress={progress} width={ART} style={styles.art} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.xl,
    paddingLeft: spacing.lg,
    minHeight: 112,
    overflow: 'visible',
  },
  text: { flex: 1, gap: spacing.xxxs, paddingVertical: spacing.md },
  meta: { flexDirection: 'row', gap: spacing.xxs, flexWrap: 'wrap', marginTop: spacing.xxs },
  art: { marginVertical: -spacing.md, marginRight: spacing.xs },
});
