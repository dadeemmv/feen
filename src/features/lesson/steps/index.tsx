/**
 * Step registry keyed by `step.type` (ikyawthetpaing/euolingo `exercise-items.tsx`): adding a new
 * step type = one content type + one renderer here. TypeScript checks the map is exhaustive.
 */
import type { ComponentType } from 'react';

import type { LessonStep } from '@/content/types';

import { ChoiceStep } from './choice-step';
import { DefinitionStep } from './definition-step';
import { FillStep } from './fill-step';
import { InfoStep } from './info-step';
import { MatchStep } from './match-step';
import { OrderStep } from './order-step';
import { TrueFalseStep } from './true-false-step';
import type { StepViewProps } from './types';

type StepRegistry = { [T in LessonStep['type']]: ComponentType<StepViewProps<Extract<LessonStep, { type: T }>>> };

const STEP_VIEWS: StepRegistry = {
  choice: ChoiceStep,
  'true-false': TrueFalseStep,
  info: InfoStep,
  definition: DefinitionStep,
  match: MatchStep,
  order: OrderStep,
  fill: FillStep,
};

/** Renders the right view for any step. */
export function StepView(props: StepViewProps) {
  const View = STEP_VIEWS[props.step.type] as ComponentType<StepViewProps>;
  return <View {...props} />;
}

export type { StepViewProps } from './types';
