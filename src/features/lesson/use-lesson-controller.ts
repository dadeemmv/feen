/**
 * Lesson controller: the pure machine (`machine.ts`) + every side effect it asks for.
 *
 * - Boot: practice mode is frozen at open (a completed chapter is a replay: no lives at stake, no
 *   saved session, half XP and no coins); a saved session for this chapter is RESTOREd.
 * - Lives: a wrong CHECK / wrong match pair costs at most one life per step (machine rule) and
 *   only outside practice and without unlimited lives. At 0 lives grading is refused and the
 *   global out-of-lives sheet opens instead.
 * - Persistence: every NEXT (and every mistake) saves `{stepIndex, lostLifeStepIds}` so leaving
 *   shows "RIPRENDI DA QUI" on the path.
 * - Completion: `completeChapter` is committed exactly once, in the event that finishes the last
 *   step, and its summary (streak, milestone) feeds the celebration screen.
 *
 * Feedback dialog content is frozen at grading time (kit Dialog rule: flip `visible`, not props).
 */
import { useEffect, useRef, useState } from 'react';

import { isGradedStep, type Chapter, type Lesson, type LessonStep } from '@/content/types';
import { haptics } from '@/lib/haptics';
import { duration } from '@/theme';
import {
  computeChapterReward,
  getStoreState,
  hasUnlimitedLives,
  selectIsChapterCompleted,
  selectIsOutOfLives,
  selectLives,
  type ChapterReward,
  type CompletionSummary,
} from '@/store';
import { openSheet } from '@/store/ui';

import { COPY } from './copy';
import { buildCorrectFeedback, buildWrongFeedback, type CorrectFeedback, type WrongFeedback } from './feedback';
import {
  createLessonState,
  getLessonProgress,
  getPrimaryAction,
  transition,
  type LessonEffect,
  type LessonEvent,
  type LessonState,
  type StepAnswer,
  type StepResult,
} from './machine';

export type LessonCompletion = {
  summary: CompletionSummary;
  reward: ChapterReward;
  accuracy: number;
  results: StepResult[];
};

export type Notify = (message: string, tone?: 'neutral' | 'success' | 'danger' | 'warning') => void;

type Boot = { practice: boolean; state: LessonState; resumed: boolean };

function bootLesson(chapterId: string, steps: readonly LessonStep[]): Boot {
  const store = getStoreState();
  const practice = selectIsChapterCompleted(store, chapterId);
  const fresh = createLessonState(steps);
  const session = store.session;
  if (practice || session === null || session.chapterId !== chapterId) return { practice, state: fresh, resumed: false };
  const restored = transition(
    fresh,
    {
      type: 'RESTORE',
      index: session.stepIndex,
      lostLifeStepIds: session.lostLifeStepIds,
      mistakeStepIds: session.mistakeStepIds,
    },
    steps,
  ).state;
  return { practice, state: restored, resumed: restored.index > 0 };
}

export function useLessonController(chapter: Chapter, lesson: Lesson, notify: Notify) {
  const steps = lesson.steps;
  const chapterId = chapter.id;
  const [boot] = useState(() => bootLesson(chapterId, steps));
  const practice = boot.practice;
  const [state, setState] = useState(boot.state);
  const stateRef = useRef(boot.state);
  const [correct, setCorrect] = useState<CorrectFeedback | null>(null);
  const [wrong, setWrong] = useState<WrongFeedback | null>(null);
  const [completion, setCompletion] = useState<LessonCompletion | null>(null);
  const committed = useRef(false);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (noticeTimer.current) clearTimeout(noticeTimer.current);
    },
    [],
  );

  // Register the session ("RIPRENDI DA QUI") and stop at the door when there are no lives left.
  useEffect(() => {
    if (practice) return;
    const store = getStoreState();
    store.startOrResumeSession(chapterId);
    if (steps.some(isGradedStep) && selectIsOutOfLives(store, Date.now())) openSheet('out-of-lives');
  }, [practice, chapterId, steps]);

  const canLoseLife = (now: number) => !practice && !hasUnlimitedLives(getStoreState(), now);
  const isBlocked = (now: number) => !practice && selectIsOutOfLives(getStoreState(), now);

  const commit = (accuracy: number, results: StepResult[], now: number) => {
    if (committed.current) return;
    committed.current = true;
    const reward = computeChapterReward(chapter, accuracy, practice);
    const summary = getStoreState().completeChapter({ chapterId, accuracy, xp: reward.xp, coins: reward.coins, now });
    setCompletion({ summary, reward, accuracy, results });
  };

  const runEffects = (effects: readonly LessonEffect[], next: LessonState) => {
    if (effects.length === 0) return;
    const now = Date.now();
    // Lives first: the feedback copy depends on whether a life was actually taken.
    const lostLife = effects.some((e) => e.type === 'LOSE_LIFE') && getStoreState().loseLife(now);

    for (const effect of effects) {
      switch (effect.type) {
        case 'FEEDBACK': {
          if (effect.outcome === 'correct') {
            setCorrect(buildCorrectFeedback(next.results));
          } else if (effect.outcome === 'wrong') {
            const lives = selectLives(getStoreState(), now);
            setWrong(buildWrongFeedback({ practice, unlimited: lives.unlimited, lostLife, livesLeft: lives.lives }));
          } else {
            haptics.warning();
            // After the lives chip has bumped and shaken (the toast would cover it).
            if (lostLife) {
              if (noticeTimer.current) clearTimeout(noticeTimer.current);
              noticeTimer.current = setTimeout(() => notify(COPY.feedback.pairLifeLost, 'danger'), duration.slower);
            }
          }
          break;
        }
        case 'PERSIST_PROGRESS':
          if (!practice && !committed.current) {
            getStoreState().saveSessionStep(chapterId, effect.stepIndex, effect.lostLifeStepIds, effect.mistakeStepIds, now);
          }
          break;
        case 'COMPLETED':
          haptics.success();
          commit(effect.accuracy, effect.results, now);
          break;
        case 'LOSE_LIFE':
          break;
      }
    }
  };

  const dispatch = (event: LessonEvent) => {
    const { state: next, effects } = transition(stateRef.current, event, steps);
    if (next !== stateRef.current) {
      stateRef.current = next;
      setState(next);
    }
    runEffects(effects, next);
  };

  const refuse = () => {
    haptics.warning();
    openSheet('out-of-lives');
  };

  const select = (answer: StepAnswer) => dispatch({ type: 'SELECT', answer });

  /** Wrong pair in a match step. `false` = refused (out of lives): the step only shakes. */
  const matchMiss = (leftId: string, rightId: string): boolean => {
    const now = Date.now();
    if (isBlocked(now)) {
      refuse();
      return false;
    }
    dispatch({ type: 'MATCH_MISS', leftId, rightId, canLoseLife: canLoseLife(now) });
    return true;
  };

  const next = () => dispatch({ type: 'NEXT' });
  const retry = () => dispatch({ type: 'RETRY' });

  /** The footer button: CHECK on graded steps, NEXT on info steps, RETRY after a mistake. */
  const primaryPress = () => {
    const current = stateRef.current;
    const step = steps[current.index];
    const action = getPrimaryAction(current, step);
    if (!action.enabled) return;
    switch (action.kind) {
      case 'check': {
        const now = Date.now();
        if (step !== undefined && isGradedStep(step) && isBlocked(now)) {
          refuse();
          return;
        }
        dispatch({ type: 'CHECK', canLoseLife: canLoseLife(now) });
        return;
      }
      case 'continue':
        next();
        return;
      case 'retry':
        retry();
        return;
      case 'finish':
        return;
    }
  };

  /** Saves the current position before leaving (NEXT already saves; this covers mid-step exits). */
  const saveProgress = () => {
    if (practice || committed.current) return;
    const current = stateRef.current;
    getStoreState().saveSessionStep(chapterId, current.index, current.lostLifeStepIds, current.mistakeStepIds);
  };

  const step = steps[state.index];
  return {
    steps,
    step,
    state,
    practice,
    resumed: boot.resumed,
    initialStepId: steps[boot.state.index]?.id ?? '',
    progress: getLessonProgress(state, steps.length),
    primary: getPrimaryAction(state, step),
    correct,
    wrong,
    completion,
    select,
    matchMiss,
    primaryPress,
    next,
    retry,
    saveProgress,
  };
}

export type LessonController = ReturnType<typeof useLessonController>;
