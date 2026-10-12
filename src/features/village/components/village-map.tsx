/**
 * The village map — the home is the village itself, a diegetic hub world like FIFA City. The
 * island stays 620 points wide on the phone (never a thumbnail) and scrolls sideways; the camera
 * starts centred on today's site, with the partner beside it, so buildings are big enough to
 * touch. Every building is a real button (its whole tile), announced with name, topic and state.
 */
import { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useIsFocused } from 'expo-router';

import { MascotArt } from '@/components/illustrations';
import { useSvgIds } from '@/components/icons/lib/svg-ids';
import { PressableScale, Text } from '@/components/ui';
import type { MascotId } from '@/content/personality';
import { BUILDING_IDS, BUILDINGS, type BuildingId } from '@/content/village';
import { galleryColors, radius, spacing } from '@/theme';

import { VILLAGE_COPY } from '../copy';
import { buildingAnchor, LAYOUT, P, partnerAnchor, TW, VILLAGE_VIEWBOX, villageSvg } from '../lib/iso';
import type { Village } from '../lib/model';

/** Width of the island on screen (the board's phone rule). */
export const MAP_WIDTH = 620;
const SCALE = MAP_WIDTH / VILLAGE_VIEWBOX[2];
const MAP_HEIGHT = VILLAGE_VIEWBOX[3] * SCALE;
const HIT = TW * SCALE * 0.95;
const MEDALLION = 34;
/** The pin box is wider than any label; the pill inside sizes to its text. */
const PIN_BOX = 200;
const PIN_HEIGHT = 26;
const PIN_TIP = 6;
/** Height of the pin's tip above the ground of its tile, in viewBox units (the board's value). */
const PIN_LIFT = 34;

const toScreen = (x: number, y: number) => ({
  left: (x - VILLAGE_VIEWBOX[0]) * SCALE,
  top: (y - VILLAGE_VIEWBOX[1]) * SCALE,
});

export type VillageMapProps = {
  village: Village;
  partner: MascotId | null;
  partnerName?: string;
  onBuilding: (id: BuildingId) => void;
  onPartner: () => void;
  /** Lessons done / total of today's site, for the pin; `open` = already a site, not a lot. */
  sitePin?: { done: number; total: number; open: boolean };
};

export function VillageMap({ village, partner, partnerName, onBuilding, onPartner, sitePin }: VillageMapProps) {
  const ids = useSvgIds('village');
  const scroll = useRef<ScrollView>(null);
  const { width } = useWindowDimensions();
  const viewport = Math.min(width, MAP_WIDTH);

  // The camera starts on today's site, and finds it again when you come back from a lesson
  // (a hidden screen cannot scroll, so it waits for the focus).
  const site = village.current;
  const focused = useIsFocused();
  useEffect(() => {
    if (!site || !focused) return;
    const { left } = toScreen(buildingAnchor(site).x, 0);
    const x = Math.max(0, Math.min(MAP_WIDTH - viewport, left - viewport / 2));
    const frame = requestAnimationFrame(() => scroll.current?.scrollTo({ x, animated: false }));
    return () => cancelAnimationFrame(frame);
  }, [site, viewport, focused]);

  const current = village.current;
  // The pin stands on the tile like the board's: just above the site, never on the roofs behind.
  const pinAt = current ? P(LAYOUT[current].i + 0.5, LAYOUT[current].j + 0.5, PIN_LIFT) : null;

  return (
    <ScrollView
      ref={scroll}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ width: MAP_WIDTH }}
      accessibilityLabel={VILLAGE_COPY.mapLabel(village.name)}>
      <View style={{ width: MAP_WIDTH, height: MAP_HEIGHT }}>
        <SvgXml xml={villageSvg(village, ids.village)} width={MAP_WIDTH} height={MAP_HEIGHT} />

        {BUILDING_IDS.map((id) => {
          const b = BUILDINGS[id];
          const a = buildingAnchor(id);
          const pos = toScreen(a.x, a.y);
          const state = village.states[id];
          return (
            <PressableScale
              key={id}
              scaleTo="small"
              haptic="selection"
              onPress={() => onBuilding(id)}
              accessibilityLabel={VILLAGE_COPY.buildingA11y(b.name, b.topic, VILLAGE_COPY.state[state])}
              style={[styles.hit, { left: pos.left - HIT / 2, top: pos.top - HIT / 2 }]}
            />
          );
        })}

        {pinAt && sitePin ? (
          <View
            pointerEvents="none"
            style={[
              styles.pinBox,
              { left: toScreen(pinAt[0], 0).left - PIN_BOX / 2, top: toScreen(0, pinAt[1]).top - PIN_HEIGHT - PIN_TIP },
            ]}>
            <View style={styles.pin}>
              <Text variant="labelSm" style={styles.pinText}>
                {sitePin.open ? VILLAGE_COPY.pin(sitePin.done, sitePin.total) : VILLAGE_COPY.pinNext}
              </Text>
            </View>
            <View style={styles.pinTip} />
          </View>
        ) : null}

        {current && partner ? (
          <PressableScale
            scaleTo="small"
            onPress={onPartner}
            accessibilityLabel={VILLAGE_COPY.partnerA11y(partnerName ?? '')}
            style={[
              styles.medallion,
              {
                left: toScreen(partnerAnchor(current).x, 0).left - MEDALLION / 2,
                top: toScreen(0, partnerAnchor(current).y).top - MEDALLION / 2,
              },
            ]}>
            <MascotArt id={partner} framing="bust" width={MEDALLION - 6} />
          </PressableScale>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hit: { position: 'absolute', width: HIT, height: HIT, borderRadius: radius.md },
  pinBox: { position: 'absolute', width: PIN_BOX, alignItems: 'center' },
  pin: {
    height: PIN_HEIGHT,
    borderRadius: radius.pill,
    backgroundColor: galleryColors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  // A small ink triangle under the pill, pointing at the site.
  pinTip: {
    width: 0,
    height: 0,
    borderLeftWidth: PIN_TIP,
    borderRightWidth: PIN_TIP,
    borderTopWidth: PIN_TIP,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: galleryColors.ink,
  },
  pinText: { color: galleryColors.sprout },
  medallion: {
    position: 'absolute',
    width: MEDALLION,
    height: MEDALLION,
    borderRadius: MEDALLION / 2,
    backgroundColor: galleryColors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
