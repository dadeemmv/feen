/**
 * The village as a full-screen hub world (home): the island fills the screen like FIFA City, you
 * drag it with one finger (with momentum) and zoom with two. The camera starts zoomed on today's
 * site, with the partner beside it, and finds it again when you come back from a lesson.
 *
 * Taps on buildings are recognised by position on the island, so dragging the map never opens
 * the building under your finger. Each building is still a real button for screen readers. Pin,
 * partner and the residents' bubbles stay outside the zoom: same size at any zoom, always
 * readable and touchable. A resident with a problem stands by its building, with a "?" bubble
 * over the roof that bobs gently (still under reduced motion); touching it opens the review.
 * The zoom buttons (+, −, centre) also make it work with a mouse or a keyboard.
 */
import { useEffect, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withRepeat,
  withSequence,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { SvgXml } from 'react-native-svg';
import { useIsFocused } from 'expo-router';
import { LocateFixed, Minus, Plus } from 'lucide-react-native';

import { MascotArt } from '@/components/illustrations';
import { useSvgIds } from '@/components/icons/lib/svg-ids';
import { IconButton, PressableScale, Text, useReduceMotion } from '@/components/ui';
import type { MascotId } from '@/content/personality';
import { getReviewSet } from '@/content/reviews';
import { BUILDING_IDS, BUILDINGS, type BuildingId } from '@/content/village';
import { elevation, fonts, galleryColors, radius, spacing } from '@/theme';

import { VILLAGE_COPY } from '../copy';
import { buildingAnchor, LAYOUT, P, partnerAnchor, TW, VILLAGE_VIEWBOX, villageSvg, visitorAnchor } from '../lib/iso';
import type { Village } from '../lib/model';

/** The island is drawn once at this width and zoomed with a transform. */
const BASE_WIDTH = 1000;
const UNIT = BASE_WIDTH / VILLAGE_VIEWBOX[2];
const BASE_HEIGHT = VILLAGE_VIEWBOX[3] * UNIT;
/** Default zoom: the board's phone rule (island 620 points wide, buildings big enough to touch). */
const ZOOM_DEFAULT = 620 / BASE_WIDTH;
const ZOOM_MAX = 1.3;
const ZOOM_STEP = 1.5;
/** A tap within this distance of a building's centre (island points) opens it. */
const HIT_RADIUS = TW * UNIT * 0.55;
const MEDALLION = 34;
const PIN_BOX = 200;
const PIN_HEIGHT = 26;
const PIN_TIP = 6;
const PIN_LIFT = 34;
const CAMERA_MS = 420;
const BUBBLE = 34;
const BUBBLE_TIP = 6;
/** The bubble's slow bob: up a few points and back, forever. */
const BOB = 3;
const BOB_MS = 900;

const toBase = (x: number, y: number) => ({ x: (x - VILLAGE_VIEWBOX[0]) * UNIT, y: (y - VILLAGE_VIEWBOX[1]) * UNIT });

/** Where the camera may go: the island can't leave the screen, but any corner can reach the middle. */
function bounds(s: number, view: { width: number; top: number; bottom: number }) {
  'worklet';
  const w = BASE_WIDTH * s;
  const h = BASE_HEIGHT * s;
  const band = view.bottom - view.top;
  const padX = view.width * 0.35;
  const padY = band * 0.35;
  const x: [number, number] = w + 2 * padX <= view.width ? [(view.width - w) / 2, (view.width - w) / 2] : [view.width - w - padX, padX];
  const y: [number, number] = h + 2 * padY <= band ? [view.top + (band - h) / 2, view.top + (band - h) / 2] : [view.bottom - h - padY, view.top + padY];
  return { x, y };
}

const clamp = (v: number, [min, max]: [number, number]) => {
  'worklet';
  return Math.min(max, Math.max(min, v));
};

export type VillageWorldProps = {
  village: Village;
  partner: MascotId | null;
  partnerName?: string;
  onBuilding: (id: BuildingId) => void;
  onPartner: () => void;
  /** A resident's bubble: open the review they bring. */
  onVisitor: (id: BuildingId) => void;
  /** Lessons done / total of today's site, for the pin; `open` = already a site, not a lot. */
  sitePin?: { done: number; total: number; open: boolean };
  /** Space covered by the floating header and footer: the camera frames the band between them. */
  cover: { top: number; bottom: number };
  /** Where the zoom buttons sit (absolute, inside the world). */
  controlsStyle?: StyleProp<ViewStyle>;
};

export function VillageWorld({
  village,
  partner,
  partnerName,
  onBuilding,
  onPartner,
  onVisitor,
  sitePin,
  cover,
  controlsStyle,
}: VillageWorldProps) {
  const ids = useSvgIds('village');
  const reduceMotion = useReduceMotion();
  const focused = useIsFocused();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const view = { width: size.width, top: cover.top, bottom: size.height - cover.bottom };
  const zoomMin = size.width ? Math.min(ZOOM_DEFAULT, (size.width / BASE_WIDTH) * 0.92) : ZOOM_DEFAULT;

  const camX = useSharedValue(0);
  const camY = useSharedValue(0);
  const camS = useSharedValue(ZOOM_DEFAULT);
  const start = useSharedValue({ x: 0, y: 0, s: ZOOM_DEFAULT, fx: 0, fy: 0 });

  const site = village.current;
  /** Move the camera so an island point (base units) sits in the middle of the free band. */
  const frame = (px: number, py: number, s: number, animate: boolean) => {
    if (!size.width) return;
    const b = bounds(s, view);
    const x = clamp(view.width / 2 - px * s, b.x);
    const y = clamp((view.top + view.bottom) / 2 - py * s, b.y);
    const move = (v: number) => (animate && !reduceMotion ? withTiming(v, { duration: CAMERA_MS }) : v);
    camS.value = move(s);
    camX.value = move(x);
    camY.value = move(y);
  };
  const siteFocus = () => {
    // No site (path finished): the middle of the island.
    const a = site ? buildingAnchor(site) : { x: VILLAGE_VIEWBOX[0] + VILLAGE_VIEWBOX[2] / 2, y: VILLAGE_VIEWBOX[1] + VILLAGE_VIEWBOX[3] / 2 };
    return toBase(a.x, a.y);
  };

  /** Zoom around the middle of the free band (buttons). */
  const zoomBy = (factor: number) => {
    const s0 = camS.value;
    const s = Math.min(ZOOM_MAX, Math.max(zoomMin, s0 * factor));
    const cx = view.width / 2;
    const cy = (view.top + view.bottom) / 2;
    frame((cx - camX.value) / s0, (cy - camY.value) / s0, s, true);
  };

  /** A tap on the island: the nearest building within reach opens. */
  const tapAt = (sx: number, sy: number) => {
    const px = (sx - camX.value) / camS.value;
    const py = (sy - camY.value) / camS.value;
    let best: BuildingId | null = null;
    let bestDistance = HIT_RADIUS;
    for (const id of BUILDING_IDS) {
      const a = buildingAnchor(id);
      const p = toBase(a.x, a.y);
      const d = Math.hypot(p.x - px, p.y - py);
      if (d < bestDistance) {
        best = id;
        bestDistance = d;
      }
    }
    if (best) onBuilding(best);
  };

  const vw = view.width;
  const vTop = view.top;
  const vBottom = view.bottom;
  const zMin = zoomMin;

  const pan = Gesture.Pan()
    .minDistance(6)
    .averageTouches(true)
    .onStart(() => {
      start.value = { ...start.value, x: camX.value, y: camY.value };
    })
    .onUpdate((e) => {
      const b = bounds(camS.value, { width: vw, top: vTop, bottom: vBottom });
      camX.value = clamp(start.value.x + e.translationX, b.x);
      camY.value = clamp(start.value.y + e.translationY, b.y);
    })
    .onEnd((e) => {
      const b = bounds(camS.value, { width: vw, top: vTop, bottom: vBottom });
      camX.value = withDecay({ velocity: e.velocityX, clamp: b.x });
      camY.value = withDecay({ velocity: e.velocityY, clamp: b.y });
    });

  const pinch = Gesture.Pinch()
    .onStart((e) => {
      start.value = {
        x: camX.value,
        y: camY.value,
        s: camS.value,
        fx: (e.focalX - camX.value) / camS.value,
        fy: (e.focalY - camY.value) / camS.value,
      };
    })
    .onUpdate((e) => {
      const s = Math.min(ZOOM_MAX, Math.max(zMin, start.value.s * e.scale));
      const b = bounds(s, { width: vw, top: vTop, bottom: vBottom });
      camS.value = s;
      camX.value = clamp(e.focalX - start.value.fx * s, b.x);
      camY.value = clamp(e.focalY - start.value.fy * s, b.y);
    });

  const tap = Gesture.Tap()
    .maxDistance(8)
    .onEnd((e, success) => {
      if (success) scheduleOnRN(tapAt, e.x, e.y);
    });

  const gesture = Gesture.Simultaneous(pinch, Gesture.Exclusive(pan, tap));

  const islandStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: camX.value }, { translateY: camY.value }, { scale: camS.value }],
  }));

  // Pin and partner follow an island point but keep their size.
  const pinAt = site ? P(LAYOUT[site].i + 0.5, LAYOUT[site].j + 0.5, PIN_LIFT) : null;
  const pinBase = pinAt ? toBase(pinAt[0], pinAt[1]) : { x: 0, y: 0 };
  const partnerBase = site ? toBase(partnerAnchor(site).x, partnerAnchor(site).y) : { x: 0, y: 0 };
  const pinStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: camX.value + pinBase.x * camS.value - PIN_BOX / 2 },
      { translateY: camY.value + pinBase.y * camS.value - PIN_HEIGHT - PIN_TIP },
    ],
  }));
  const partnerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: camX.value + partnerBase.x * camS.value - MEDALLION / 2 },
      { translateY: camY.value + partnerBase.y * camS.value - MEDALLION / 2 },
    ],
  }));

  // The camera starts on today's site and finds it again when you come back from a lesson.
  useEffect(() => {
    if (!focused || !size.width) return;
    const p = siteFocus();
    frame(p.x, p.y, ZOOM_DEFAULT, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on focus, size and site changes
  }, [focused, size.width, size.height, cover.top, cover.bottom, site]);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== size.width || height !== size.height) setSize({ width, height });
  };

  return (
    <View style={StyleSheet.absoluteFill} onLayout={onLayout}>
      <GestureDetector gesture={gesture}>
        <View style={StyleSheet.absoluteFill} accessibilityLabel={VILLAGE_COPY.mapLabel(village.name)}>
          <Animated.View style={[styles.island, islandStyle]}>
            <SvgXml xml={villageSvg(village, ids.village)} width={BASE_WIDTH} height={BASE_HEIGHT} />
            {BUILDING_IDS.map((id) => {
              const b = BUILDINGS[id];
              const a = buildingAnchor(id);
              const p = toBase(a.x, a.y);
              // A button for screen readers; touches go to the map's tap.
              return (
                <PressableScale
                  key={id}
                  pointerEvents="none"
                  onPress={() => onBuilding(id)}
                  accessibilityRole="button"
                  accessibilityLabel={VILLAGE_COPY.buildingA11y(b.name, b.topic, VILLAGE_COPY.state[village.states[id]])}
                  style={[styles.hit, { left: p.x - HIT_RADIUS, top: p.y - HIT_RADIUS }]}
                />
              );
            })}
          </Animated.View>
        </View>
      </GestureDetector>

      {pinAt && sitePin ? (
        <Animated.View pointerEvents="none" style={[styles.pinBox, pinStyle]}>
          <View style={styles.pin}>
            <Text variant="labelSm" style={styles.pinText}>
              {sitePin.open ? VILLAGE_COPY.pin(sitePin.done, sitePin.total) : VILLAGE_COPY.pinNext}
            </Text>
          </View>
          <View style={styles.pinTip} />
        </Animated.View>
      ) : null}

      {site && partner ? (
        <Animated.View style={[styles.medallionBox, partnerStyle]}>
          <PressableScale
            scaleTo="small"
            onPress={onPartner}
            accessibilityLabel={VILLAGE_COPY.partnerA11y(partnerName ?? '')}
            style={styles.medallion}>
            <MascotArt id={partner} framing="bust" width={MEDALLION - 6} />
          </PressableScale>
        </Animated.View>
      ) : null}

      {(village.visitors ?? []).map((id) => (
        <VisitorBubble key={id} id={id} camX={camX} camY={camY} camS={camS} onPress={onVisitor} />
      ))}

      <View style={[styles.controls, controlsStyle]} pointerEvents="box-none">
        <IconButton icon={Plus} size="sm" accessibilityLabel={VILLAGE_COPY.world.zoomIn} onPress={() => zoomBy(ZOOM_STEP)} />
        <IconButton icon={Minus} size="sm" accessibilityLabel={VILLAGE_COPY.world.zoomOut} onPress={() => zoomBy(1 / ZOOM_STEP)} />
        <IconButton
          icon={LocateFixed}
          size="sm"
          accessibilityLabel={VILLAGE_COPY.world.centre}
          onPress={() => {
            const p = siteFocus();
            frame(p.x, p.y, ZOOM_DEFAULT, true);
          }}
        />
      </View>
    </View>
  );
}

/** The "?" bubble over the roof of a building where a resident waits with a problem. */
function VisitorBubble({
  id,
  camX,
  camY,
  camS,
  onPress,
}: {
  id: BuildingId;
  camX: SharedValue<number>;
  camY: SharedValue<number>;
  camS: SharedValue<number>;
  onPress: (id: BuildingId) => void;
}) {
  const reduceMotion = useReduceMotion();
  const bob = useSharedValue(0);
  useEffect(() => {
    if (reduceMotion) return;
    bob.value = withRepeat(withSequence(withTiming(-BOB, { duration: BOB_MS }), withTiming(0, { duration: BOB_MS })), -1);
    return () => cancelAnimation(bob);
  }, [reduceMotion, bob]);

  const a = visitorAnchor(id);
  const base = toBase(a.x, a.y);
  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: camX.value + base.x * camS.value - BUBBLE / 2 },
      { translateY: camY.value + base.y * camS.value - BUBBLE - BUBBLE_TIP + bob.value },
    ],
  }));
  const resident = getReviewSet(id)?.resident;
  const label = resident ? VILLAGE_COPY.ripasso.bubbleA11y(resident.who, BUILDINGS[id].at, resident.pronoun) : BUILDINGS[id].name;

  return (
    <Animated.View style={[styles.bubbleBox, style]}>
      <PressableScale
        scaleTo="small"
        hitSlop={spacing.xs}
        onPress={() => onPress(id)}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={styles.bubble}
        testID={`village-visitor-${id}`}>
        <Text variant="titleLg" style={styles.bubbleMark}>
          ?
        </Text>
      </PressableScale>
      <View style={styles.bubbleTip} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  island: { position: 'absolute', left: 0, top: 0, width: BASE_WIDTH, height: BASE_HEIGHT, transformOrigin: 'left top' },
  hit: { position: 'absolute', width: HIT_RADIUS * 2, height: HIT_RADIUS * 2, borderRadius: radius.pill },
  pinBox: { position: 'absolute', left: 0, top: 0, width: PIN_BOX, alignItems: 'center' },
  pin: {
    height: PIN_HEIGHT,
    borderRadius: radius.pill,
    backgroundColor: galleryColors.indigo,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  pinTip: {
    width: 0,
    height: 0,
    borderLeftWidth: PIN_TIP,
    borderRightWidth: PIN_TIP,
    borderTopWidth: PIN_TIP,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: galleryColors.indigo,
  },
  pinText: { color: galleryColors.paper },
  medallionBox: { position: 'absolute', left: 0, top: 0 },
  medallion: {
    width: MEDALLION,
    height: MEDALLION,
    borderRadius: MEDALLION / 2,
    backgroundColor: galleryColors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controls: { position: 'absolute', gap: spacing.xs },
  bubbleBox: { position: 'absolute', left: 0, top: 0, width: BUBBLE, alignItems: 'center' },
  bubble: {
    width: BUBBLE,
    height: BUBBLE,
    borderRadius: BUBBLE / 2,
    backgroundColor: galleryColors.paper,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: elevation.lg,
  },
  bubbleMark: { fontFamily: fonts.serif.italic, color: galleryColors.ink },
  bubbleTip: {
    width: 0,
    height: 0,
    borderLeftWidth: BUBBLE_TIP,
    borderRightWidth: BUBBLE_TIP,
    borderTopWidth: BUBBLE_TIP,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: galleryColors.paper,
  },
});
