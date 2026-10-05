import type { GradedStep } from '../types';

/**
 * Human-readable correct answer of a graded step, used by "Spiegami il perché" and the wrong
 * answer feedback ("La risposta corretta è …").
 */
export function getCorrectAnswerLabel(step: GradedStep): string {
  switch (step.type) {
    case 'choice':
    case 'fill':
      return step.options.find((option) => option.id === step.correctOptionId)?.label ?? '';
    case 'true-false':
      return step.answer ? 'Vero' : 'Falso';
    case 'match':
      return step.pairs.map((pair) => `${pair.left} → ${pair.right}`).join('\n');
    case 'order':
      return step.items.map((item, index) => `${index + 1}. ${item.label}`).join('\n');
  }
}
