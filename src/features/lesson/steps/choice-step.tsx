/**
 * Multiple choice ("🎩 INDOVINA"): tag, art, prompt, one OptionTile per option. Options keep the
 * content order (the content spreads the correct answer across positions on purpose).
 */
import type { ChoiceStep as ChoiceStepData } from '@/content/types';

import { OptionTile } from '../components/option-tile';
import { GradedStepCard, StepArt, StepPrompt } from '../components/step-layout';
import { isAnswering, singleOptionStatus, type StepViewProps } from './types';

export function ChoiceStep({
  step,
  answer,
  phase,
  disabledOptionIds,
  wrongSignal,
  onSelect,
  bottomInset,
  compact,
}: StepViewProps<ChoiceStepData>) {
  const selectedId = typeof answer === 'string' ? answer : null;
  const answering = isAnswering(phase);

  return (
    <GradedStepCard
      tag={step.tag}
      art={<StepArt illustration={step.illustration} emoji={step.emoji} compact={compact} />}
      prompt={<StepPrompt>{step.prompt}</StepPrompt>}
      bottomInset={bottomInset}
      compact={compact}>
      {step.options.map((option) => {
        const status = singleOptionStatus(option.id, selectedId, phase, disabledOptionIds);
        return (
          <OptionTile
            key={option.id}
            label={option.label}
            status={status}
            locked={!answering}
            onPress={() => onSelect(option.id)}
            shakeSignal={status === 'wrong' ? wrongSignal : 0}
            testID={`option-${option.id}`}
          />
        );
      })}
    </GradedStepCard>
  );
}
