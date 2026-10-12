/**
 * "Costruisci con i mattoni": bricks never raise a building (knowledge cannot be bought), they
 * build homes for the residents and decorations, placed where you want. Top to bottom, the way you
 * decide: what to build (a compact catalogue, the chosen item's line under it), where (tap a
 * glowing lot on the island: a ghost shows it there), then "Costruisci qui". A house takes four
 * residents out of their tents. Nothing here costs real money.
 */
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { router } from 'expo-router';
import { X } from 'lucide-react-native';

import { BrickIcon } from '@/components/icons';
import { useSvgIds } from '@/components/icons/lib/svg-ids';
import { Button, HStack, IconButton, PressableScale, Screen, Text, borderWidth, iconSize, toast, uiOpacity } from '@/components/ui';
import { DECOR_IDS, DECORS, RESIDENTS_PER_HOUSE, type DecorId } from '@/content/village';
import { haptics } from '@/lib/haptics';
import { countInTents, freeLots, selectMascot, useStore } from '@/store';
import { fonts, layout, radius, spacing, useTheme } from '@/theme';

import { VillageMap } from './components/village-map';
import { VILLAGE_COPY } from './copy';
import { decorSceneSvg } from './lib/iso';
import { useVillage } from './lib/model';

const CARD_WIDTH = 104;
const SCENE_WIDTH = 64;

export function BuildScreen() {
  const [now] = useState(() => Date.now());
  const village = useVillage(now);
  const placements = useStore((s) => s.placements);
  const bricks = useStore((s) => s.coins);
  const build = useStore((s) => s.build);
  const mascotId = useStore(selectMascot);
  const [kind, setKind] = useState<DecorId>('casa');
  const [lot, setLot] = useState<number | undefined>(undefined);
  const copy = VILLAGE_COPY.decor;

  const free = freeLots(placements);
  const inTents = countInTents(village.residents, placements);
  const cost = DECORS[kind].cost;
  const missing = Math.max(0, cost - bricks);

  const confirm = () => {
    if (lot === undefined) return;
    const result = build(kind, lot);
    if (!result.ok) {
      haptics.warning();
      return;
    }
    haptics.success();
    setLot(undefined);
    toast.show({ message: copy.built(DECORS[kind].withArticle), tone: 'success' });
  };

  const cta =
    free.length === 0
      ? copy.full
      : missing > 0
        ? copy.missing(missing)
        : lot === undefined
          ? copy.pickLot
          : copy.cta(cost);

  return (
    <Screen
      edges={['top', 'bottom']}
      header={
        <HStack justify="space-between" style={styles.header}>
          <IconButton icon={X} variant="plain" accessibilityLabel={copy.close} onPress={() => router.back()} />
          <HStack gap="xs" accessible accessibilityLabel={copy.bricks(bricks)}>
            <BrickIcon size={iconSize.md} />
            <Text variant="titleSm" tabular>
              {copy.bricks(bricks)}
            </Text>
          </HStack>
        </HStack>
      }
      footer={
        <View style={styles.footer}>
          {missing > 0 && free.length > 0 ? (
            <Text variant="bodySm" color="textSecondary" align="center">
              {copy.missingHint}
            </Text>
          ) : null}
          <Button title={cta} fullWidth disabled={lot === undefined || missing > 0} onPress={confirm} testID="build-confirm" />
        </View>
      }>
      <View style={styles.heading}>
        <Text variant="displayMd" accessibilityRole="header">
          {copy.titleStart}
          <Text variant="displayMd" style={styles.italic}>
            {copy.titleWord}
          </Text>
        </Text>
        <Text variant="bodyMd" color="textSecondary">
          {copy.subtitle}
        </Text>
        {village.residents > 0 ? (
          <Text variant="labelMd">{inTents > 0 ? copy.tents(inTents, RESIDENTS_PER_HOUSE) : copy.housed}</Text>
        ) : null}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.catalog}
        style={styles.catalogScroll}
        accessibilityRole="radiogroup"
        accessibilityLabel={copy.catalogA11y}>
        {DECOR_IDS.map((id) => (
          <DecorCard key={id} id={id} selected={id === kind} affordable={bricks >= DECORS[id].cost} onPress={() => setKind(id)} />
        ))}
      </ScrollView>
      <Text variant="bodySm" color="textSecondary">
        <Text variant="labelMd">{`${DECORS[kind].name} · `}</Text>
        {DECORS[kind].note}
      </Text>

      <View style={styles.map}>
        <VillageMap
          village={village}
          partner={mascotId}
          onBuilding={() => undefined}
          onPartner={() => undefined}
          placement={{ free, selected: lot, preview: kind, onLot: setLot }}
        />
      </View>
    </Screen>
  );
}

function DecorCard({ id, selected, affordable, onPress }: { id: DecorId; selected: boolean; affordable: boolean; onPress: () => void }) {
  const theme = useTheme();
  const ids = useSvgIds('decor');
  const decor = DECORS[id];
  return (
    <PressableScale
      onPress={onPress}
      haptic="selection"
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${decor.name}, ${VILLAGE_COPY.decor.bricks(decor.cost)}. ${decor.note}`}
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: selected ? theme.colors.accentSolid : 'transparent' },
      ]}>
      <View style={[styles.scene, !affordable && styles.dim]}>
        <SvgXml xml={decorSceneSvg(id, ids.decor)} width={SCENE_WIDTH} height={SCENE_WIDTH} />
      </View>
      <Text variant="titleSm" numberOfLines={1}>
        {decor.name}
      </Text>
      <HStack gap="xxs">
        <BrickIcon size={iconSize.sm} muted={!affordable} />
        <Text variant="labelMd" color={affordable ? 'text' : 'textTertiary'} tabular>
          {decor.cost}
        </Text>
      </HStack>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: layout.screenX - spacing.sm, paddingRight: layout.screenX, paddingVertical: spacing.xs },
  heading: { gap: spacing.xs, marginTop: spacing.xs, marginBottom: spacing.md },
  italic: { fontFamily: fonts.serif.italic, letterSpacing: 0 },
  map: { marginHorizontal: -layout.screenX },
  catalogScroll: { marginHorizontal: -layout.screenX, flexGrow: 0 },
  catalog: { gap: spacing.xs, paddingHorizontal: layout.screenX, paddingBottom: spacing.sm },
  card: {
    width: CARD_WIDTH,
    gap: spacing.xxxs,
    padding: spacing.sm,
    borderRadius: radius.xl,
    borderWidth: borderWidth.thick,
  },
  scene: { alignItems: 'center' },
  dim: { opacity: uiOpacity.disabled },
  footer: { gap: spacing.xs },
});
