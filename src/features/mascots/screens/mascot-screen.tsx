/**
 * "Il tuo personaggio" (/mascot, from the Home greeting and Account): the saved money compass on
 * evergreen with "Rifai il test", or — for a profile without a result — the test intro. The retake
 * runs the same quiz in place with its own answers; finishing saves the new result, toasts whether
 * the character changed and shows the reveal again.
 */
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ArrowLeft, Clock, RotateCcw } from 'lucide-react-native';

import { Button, Card, Chip, Confetti, IconButton, Screen, Spotlight, Text, toast, VStack } from '@/components/ui';
import { getMascot, type AgreementValue } from '@/content/personality';
import { goBackOr } from '@/features/shop/lib/navigation';
import { getStoreState, selectPersonality, useStore } from '@/store';
import { layout, spacing } from '@/theme';

import { MascotLineup } from '../components/mascot-lineup';
import { MascotReveal } from '../components/mascot-reveal';
import { PersonalityQuiz } from '../components/personality-quiz';
import { MASCOT_COPY } from '../copy';
import { scorePersonality } from '../lib/score';

type Phase = 'result' | 'quiz';

function BackHeader() {
  return (
    <View style={styles.header}>
      <IconButton icon={ArrowLeft} variant="glass" accessibilityLabel={MASCOT_COPY.quiz.back} onPress={() => goBackOr('/')} />
    </View>
  );
}

export function MascotScreen() {
  const personality = useStore(selectPersonality);
  const [phase, setPhase] = useState<Phase>('result');
  const [answers, setAnswers] = useState<Record<string, AgreementValue>>({});
  const [index, setIndex] = useState(0);
  const [celebrate, setCelebrate] = useState(0);
  const copy = MASCOT_COPY.screen;

  const startQuiz = () => {
    setAnswers({});
    setIndex(0);
    setPhase('quiz');
  };

  const finishQuiz = () => {
    const previous = getStoreState().personality?.mascot;
    const result = scorePersonality(answers);
    getStoreState().setPersonality(result);
    const { name } = getMascot(result.mascot);
    toast.show({ message: previous === result.mascot ? copy.same(name) : copy.saved(name), tone: 'success' });
    setCelebrate((n) => n + 1);
    setPhase('result');
  };

  if (phase === 'quiz') {
    return (
      <PersonalityQuiz
        answers={answers}
        index={index}
        onAnswer={(id, value) => setAnswers((current) => ({ ...current, [id]: value }))}
        onIndexChange={setIndex}
        onComplete={finishQuiz}
        onExit={() => setPhase('result')}
      />
    );
  }

  if (!personality) {
    return (
      <Screen
        edges={['top', 'bottom']}
        header={
          <View style={styles.header}>
            <IconButton icon={ArrowLeft} accessibilityLabel={MASCOT_COPY.quiz.back} onPress={() => goBackOr('/')} />
          </View>
        }
        footer={<Button title={copy.take} fullWidth onPress={startQuiz} />}>
        <VStack gap="xs" style={styles.introHeading}>
          <Text variant="displaySm" accessibilityRole="header">
            {MASCOT_COPY.intro.title}
          </Text>
          <Text variant="bodyLg" color="textSecondary">
            {copy.emptySubtitle}
          </Text>
        </VStack>
        <Card padding="lg" contentStyle={styles.introCard}>
          <MascotLineup columns={2} accessibilityLabel={MASCOT_COPY.intro.lineupLabel} />
          <Chip icon={Clock} label={MASCOT_COPY.intro.meta} size="sm" style={styles.meta} />
        </Card>
      </Screen>
    );
  }

  return (
    <View style={styles.flex}>
      <Screen
        background="brand"
        edges={['top', 'bottom']}
        statusBar="light"
        header={<BackHeader />}
        footer={<Button title={copy.retake} iconLeft={RotateCcw} variant="outline" fullWidth onPress={startQuiz} />}>
        <Spotlight reach={{ x: 0.9, y: 0.5 }} />
        <MascotReveal key={personality.takenAt} result={personality} />
      </Screen>
      {celebrate > 0 ? <Confetti key={celebrate} run origin={{ x: 0.5, y: 0.2 }} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { height: layout.headerHeight, flexDirection: 'row', alignItems: 'center', paddingHorizontal: layout.screenX },
  introHeading: { marginTop: spacing.md, marginBottom: spacing.xl },
  introCard: { gap: spacing.lg },
  meta: { alignSelf: 'center' },
});
