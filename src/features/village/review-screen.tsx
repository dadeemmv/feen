/**
 * A resident's review (/review/[id], concept board §04 "Il ripasso arriva dagli abitanti"): a week
 * after a building is finished, one of its residents comes by with a real money problem on its
 * topic. One problem, one answer, no clock:
 * - right → the building blooms: the screen turns lilac (the achievement colour) with confetti,
 *   the resident says thanks and leaves a few bricks, the partner says why;
 * - wrong → the partner says why, the resident comes back in a few days with another problem, and
 *   nothing is lost (no flowers taken, no bricks).
 * The problem is frozen when the screen opens, so answering never swaps it under your finger.
 */
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, StyleSheet, View, type ScrollView } from 'react-native';
import Animated from 'react-native-reanimated';
import { useLocalSearchParams } from 'expo-router';
import { X } from 'lucide-react-native';

import { BrickIcon } from '@/components/icons';
import { MascotArt } from '@/components/illustrations';
import {
  avatarSize,
  Button,
  Confetti,
  HStack,
  IconButton,
  iconSize,
  Screen,
  StatTile,
  Text,
  useReduceMotion,
  VStack,
} from '@/components/ui';
import { getMascot } from '@/content/personality';
import { getReviewSet, type ReviewProblem } from '@/content/reviews';
import { agree, BUILDINGS, isBuildingId, theBuilding, type BuildingId } from '@/content/village';
import { OptionTile, type OptionStatus } from '@/features/lesson/components/option-tile';
import { useEntering } from '@/features/onboarding/lib/entering';
import { PopIn } from '@/features/rewards';
import { goBackOr } from '@/features/shop/lib/navigation';
import { haptics } from '@/lib/haptics';
import { getStoreState, isReviewWaiting, nextProblem, REVIEW_RETRY_DAYS, selectMascot, useStore } from '@/store';
import { buildingTones, duration, fonts, layout, radius, spacing, useTheme } from '@/theme';

import { BuildingScene } from './components/building-scene';
import { VILLAGE_COPY } from './copy';

const ART = 132;
const ART_BLOOM = 200;
const CONFETTI_ORIGIN = { x: 0.5, y: 0.22 };

type Phase = 'ask' | 'right' | 'wrong' | 'bloom';

/** The building and its problem, read once: null when nobody is waiting there now. */
function bootReview(id: string): { building: BuildingId; problem: ReviewProblem } | null {
  if (!isBuildingId(id)) return null;
  const s = getStoreState();
  if (!isReviewWaiting(id, s, Date.now())) return null;
  const problem = nextProblem(id, s);
  return problem ? { building: id, problem } : null;
}

const close = () => goBackOr('/');

export function ReviewScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? (params.id[0] ?? '') : (params.id ?? '');
  const [boot] = useState(() => bootReview(id));
  if (!boot) return <NobodyHere id={id} />;
  return <Review building={boot.building} problem={boot.problem} />;
}

function Review({ building, problem }: { building: BuildingId; problem: ReviewProblem }) {
  const theme = useTheme();
  const reduceMotion = useReduceMotion();
  const { rise, fade } = useEntering();
  const mascotId = useStore(selectMascot);
  const partner = mascotId ? getMascot(mascotId) : null;
  const [selected, setSelected] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>('ask');
  const [bricks, setBricks] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef = useRef<Animated.ScrollView & ScrollView>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  // After a wrong answer the partner's explanation appears under the answers: bring it in view.
  useEffect(() => {
    if (phase !== 'wrong') return;
    const frame = requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: !reduceMotion }));
    return () => cancelAnimationFrame(frame);
  }, [phase, reduceMotion]);

  const b = BUILDINGS[building];
  const tone = buildingTones[b.tone];
  const resident = getReviewSet(building)?.resident ?? { who: 'un abitante', pronoun: 'lo' as const };
  const copy = VILLAGE_COPY.ripasso;
  const bloomedWord = agree(b, 'fiorit');

  const answer = () => {
    if (phase !== 'ask' || selected === null) return;
    const result = getStoreState().answerReview(building, problem.id, selected);
    if (!result.ok) {
      close();
      return;
    }
    if (result.right) {
      haptics.success();
      setBricks(result.bricks);
      setPhase('right');
      AccessibilityInfo.announceForAccessibility(copy.rightA11y(b.name, bloomedWord));
      // The right option lights up green for a beat, then the building blooms.
      timer.current = setTimeout(() => setPhase('bloom'), reduceMotion ? 0 : duration.slower);
    } else {
      haptics.warning();
      setPhase('wrong');
      AccessibilityInfo.announceForAccessibility(copy.wrongA11y);
    }
  };

  if (phase === 'bloom') {
    return (
      <View style={styles.root}>
        <Screen
          background="reward"
          edges={['top', 'bottom']}
          statusBar="dark"
          contentContainerStyle={styles.bloomContent}
          footer={<Button title={copy.back} fullWidth onPress={close} testID="review-back" />}>
          <PopIn style={styles.center}>
            <BuildingScene id={building} state="fiorito" width={ART_BLOOM} accessibilityLabel={`${b.name}, ${b.topic}`} />
          </PopIn>
          <Animated.View entering={rise(1)} style={styles.titles}>
            <Text variant="code" color="onReward" align="center">
              {copy.overline(b.name)}
            </Text>
            <Text variant="displayLg" color="onReward" align="center" accessibilityRole="header">
              {`${b.name} `}
              <Text variant="displayLg" color="onReward" style={styles.italic}>
                {`${bloomedWord}.`}
              </Text>
            </Text>
          </Animated.View>
          <Animated.View entering={rise(2)} style={styles.thanks}>
            <Text variant="labelMd" color="onReward" align="center">
              {copy.resident(resident.who)}
            </Text>
            <Text variant="titleMd" color="onReward" align="center">
              {`«${problem.thanks}»`}
            </Text>
          </Animated.View>
          {partner ? (
            <Animated.View entering={rise(3)}>
              <HStack gap="sm" align="flex-start">
                <MascotArt id={partner.id} framing="bust" width={avatarSize.md} />
                <Text variant="bodyMd" color="onReward" style={styles.flex}>
                  <Text variant="labelMd" color="onReward">{`${partner.partner.name} · `}</Text>
                  {problem.why}
                </Text>
              </HStack>
            </Animated.View>
          ) : null}
          {bricks > 0 ? (
            <Animated.View entering={rise(4)}>
              <StatTile
                size="lg"
                style={{ backgroundColor: theme.colors.surfaceRaised }}
                icon={<BrickIcon size={iconSize.xl} />}
                value={`+${bricks}`}
                label={copy.giftFrom(resident.who)}
              />
            </Animated.View>
          ) : null}
        </Screen>
        <Confetti run origin={CONFETTI_ORIGIN} />
      </View>
    );
  }

  const statusOf = (optionId: string): OptionStatus => {
    if (phase === 'ask') return optionId === selected ? 'selected' : 'idle';
    if (optionId === problem.correctOptionId) return 'correct';
    return optionId === selected ? 'wrong' : 'idle';
  };

  const footer =
    phase === 'ask' ? (
      <Button title={copy.cta} disabled={selected === null} fullWidth onPress={answer} testID="review-answer" />
    ) : (
      <Button title={copy.back} fullWidth disabled={phase === 'right'} onPress={close} testID="review-back" />
    );

  return (
    <Screen
      edges={['top', 'bottom']}
      scrollRef={scrollRef}
      header={
        <View style={styles.header}>
          <IconButton icon={X} accessibilityLabel={copy.close} onPress={close} />
        </View>
      }
      footer={footer}>
      <VStack gap="lg" style={styles.body}>
        <Animated.View entering={rise(0)} style={styles.center}>
          <BuildingScene id={building} state="costruito" visitor width={ART} />
          <Text variant="code" align="center" style={{ color: tone.deep }}>
            {copy.overline(b.name)}
          </Text>
          <Text variant="labelMd" color="textSecondary" align="center">
            {copy.asks(resident.who)}
          </Text>
        </Animated.View>

        <Animated.View entering={rise(1)} style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text variant="titleMd" align="center" accessibilityRole="header">
            {`«${problem.ask}»`}
          </Text>
          <View style={styles.answers} accessibilityRole="radiogroup">
            {problem.options.map((option) => (
              <OptionTile
                key={option.id}
                label={option.label}
                status={statusOf(option.id)}
                locked={phase !== 'ask'}
                onPress={() => setSelected(option.id)}
                testID={`review-option-${option.id}`}
              />
            ))}
          </View>
        </Animated.View>

        {phase === 'wrong' && partner ? (
          <Animated.View entering={fade(0)} style={styles.explain}>
            <HStack gap="sm" align="flex-start">
              <MascotArt id={partner.id} framing="bust" width={avatarSize.md} />
              <VStack flex gap="xs">
                <Text variant="bodyMd">
                  <Text variant="labelMd">{`${partner.partner.name} · `}</Text>
                  {`${copy.wrongTitle} ${problem.why}`}
                </Text>
                <Text variant="bodySm" color="textSecondary">
                  {copy.wrongNote(resident.who, REVIEW_RETRY_DAYS, theBuilding(b))}
                </Text>
              </VStack>
            </HStack>
          </Animated.View>
        ) : null}
      </VStack>
    </Screen>
  );
}

/** Opened from an old link, or the resident already went home: say when they come. */
function NobodyHere({ id }: { id: string }) {
  const copy = VILLAGE_COPY.ripasso;
  const at = isBuildingId(id) ? BUILDINGS[id].at : 'qui';
  return (
    <Screen
      edges={['top', 'bottom']}
      header={
        <View style={styles.header}>
          <IconButton icon={X} accessibilityLabel={copy.close} onPress={close} />
        </View>
      }
      footer={<Button title={copy.back} fullWidth onPress={close} />}>
      <VStack gap="sm" style={styles.nobody}>
        <Text variant="titleLg" accessibilityRole="header">
          {copy.nobody(at)}
        </Text>
        <Text variant="bodyMd" color="textSecondary">
          {copy.nobodyHint}
        </Text>
      </VStack>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  header: { height: layout.headerHeight, flexDirection: 'row', alignItems: 'center', paddingHorizontal: layout.screenX },
  body: { paddingBottom: spacing.xl },
  center: { alignItems: 'center', gap: spacing.xxs },
  card: { borderRadius: radius.xxl, padding: spacing.lg, gap: spacing.md },
  answers: { gap: spacing.sm },
  explain: { paddingHorizontal: spacing.xxs },
  bloomContent: { flexGrow: 1, justifyContent: 'center', gap: spacing.lg, paddingTop: spacing.md },
  titles: { gap: spacing.xxs, alignItems: 'center' },
  thanks: { gap: spacing.xxs, alignItems: 'center' },
  italic: { fontFamily: fonts.serif.italic, letterSpacing: 0 },
  nobody: { paddingTop: spacing.huge },
});
