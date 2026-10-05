/**
 * Confetti — lightweight Reanimated particle burst (no native deps): ~40 paper bits in brand
 * colours shoot up from `origin`, flutter, fall with gravity and fade. One shared clock drives
 * every particle on the UI thread. Renders nothing under reduced motion.
 *
 *   <Confetti run={phase === 'completed'} origin={{ x: 0.5, y: 0.3 }} />
 */
import { useEffect, useEffectEvent, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming, type SharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { duration, gradients, radius, useTheme } from '@/theme';

import { useReduceMotion } from './use-reduce-motion';

/** Burst physics (px, px/s, deg/s) — motion geometry, tuned by eye. */
const PHYSICS = {
  count: 40,
  spreadDeg: 65,
  speedMin: 520,
  speedMax: 980,
  gravity: 1500,
  drag: 0.35,
  spinMax: 720,
  flipMin: 4,
  flipMax: 11,
  widthMin: 6,
  widthMax: 10,
  aspect: 1.5,
  fadeFrom: 0.7,
} as const;

export type ConfettiProps = {
  /** Fires a new burst each time it turns `true`. */
  run: boolean;
  /** Burst origin as fractions of the container. Default `{ x: 0.5, y: 0.35 }`. */
  origin?: { x: number; y: number };
  /** Particle count. Default 40. */
  count?: number;
  /** Override colours. Default lime, forest, gold, orange, rose. */
  colors?: string[];
  /** Burst length in ms. Default 2 × `motion.duration.celebration`. */
  duration?: number;
  onComplete?: () => void;
  style?: StyleProp<ViewStyle>;
};

type Particle = {
  vx: number;
  vy: number;
  spin: number;
  rotation: number;
  flip: number;
  width: number;
  height: number;
  color: string;
  round: boolean;
};

const between = (min: number, max: number) => min + Math.random() * (max - min);

function makeParticles(count: number, colors: string[]): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = ((-90 + between(-PHYSICS.spreadDeg, PHYSICS.spreadDeg)) * Math.PI) / 180;
    const speed = between(PHYSICS.speedMin, PHYSICS.speedMax);
    const width = between(PHYSICS.widthMin, PHYSICS.widthMax);
    const round = i % 5 === 0;
    return {
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      spin: between(-PHYSICS.spinMax, PHYSICS.spinMax),
      rotation: between(0, 360),
      flip: between(PHYSICS.flipMin, PHYSICS.flipMax),
      width,
      height: round ? width : width * PHYSICS.aspect,
      color: colors[i % colors.length],
      round,
    };
  });
}

export function Confetti({
  run,
  origin = { x: 0.5, y: 0.35 },
  count = PHYSICS.count,
  colors,
  duration: burstDuration = duration.celebration * 2,
  onComplete,
  style,
}: ConfettiProps) {
  const theme = useTheme();
  const reduceMotion = useReduceMotion();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [burst, setBurst] = useState({ id: 0, wasRunning: false });
  if (run !== burst.wasRunning) {
    setBurst({ id: run ? burst.id + 1 : burst.id, wasRunning: run });
  }

  const onSkip = useEffectEvent(() => onComplete?.());
  useEffect(() => {
    if (run && reduceMotion) onSkip();
  }, [run, reduceMotion]);

  const palette = colors ?? [
    theme.colors.accentSolid,
    theme.colors.brandSolid,
    gradients.gold[0],
    theme.colors.streak,
    theme.colors.lives,
  ];
  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
  };

  return (
    <View onLayout={onLayout} style={[StyleSheet.absoluteFill, styles.noTouch, style]}>
      {burst.id > 0 && !reduceMotion && size.width > 0 ? (
        <ConfettiBurst
          key={burst.id}
          x={size.width * origin.x}
          y={size.height * origin.y}
          count={count}
          colors={palette}
          duration={burstDuration}
          onComplete={onComplete}
        />
      ) : null}
    </View>
  );
}

type BurstProps = {
  x: number;
  y: number;
  count: number;
  colors: string[];
  duration: number;
  onComplete?: () => void;
};

function ConfettiBurst({ x, y, count, colors, duration: ms, onComplete }: BurstProps) {
  const [particles] = useState(() => makeParticles(count, colors));
  const clock = useSharedValue(0);

  const onFinished = useEffectEvent(() => onComplete?.());
  useEffect(() => {
    const done = () => onFinished();
    clock.set(
      withTiming(1, { duration: ms, easing: Easing.linear }, (finished) => {
        if (finished) scheduleOnRN(done);
      }),
    );
  }, [clock, ms]);

  return (
    <>
      {particles.map((particle, index) => (
        <ConfettiPiece key={index} particle={particle} clock={clock} x={x} y={y} seconds={ms / 1000} />
      ))}
    </>
  );
}

type PieceProps = { particle: Particle; clock: SharedValue<number>; x: number; y: number; seconds: number };

function ConfettiPiece({ particle, clock, x, y, seconds }: PieceProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const p = clock.get();
    const t = p * seconds;
    const damp = 1 - PHYSICS.drag * p;
    const tx = x + particle.vx * t * damp - particle.width / 2;
    const ty = y + particle.vy * t + 0.5 * PHYSICS.gravity * t * t - particle.height / 2;
    const opacity = p < PHYSICS.fadeFrom ? 1 : 1 - (p - PHYSICS.fadeFrom) / (1 - PHYSICS.fadeFrom);
    return {
      opacity,
      transform: [
        { translateX: tx },
        { translateY: ty },
        { rotate: `${particle.rotation + particle.spin * t}deg` },
        { scaleX: Math.cos(t * particle.flip) },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.piece,
        {
          width: particle.width,
          height: particle.height,
          backgroundColor: particle.color,
          borderRadius: particle.round ? radius.pill : radius.none + 1,
        },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  noTouch: { pointerEvents: 'none', overflow: 'hidden' },
  piece: { position: 'absolute', left: 0, top: 0 },
});
