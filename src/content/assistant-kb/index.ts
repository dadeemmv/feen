import type { AssistantKbEntry } from '../extra-types';
import { APP_KB } from './app';
import { BASICS_KB } from './basics';
import { MARKETS_KB } from './markets';
import { PRACTICE_KB } from './practice';

/**
 * Offline knowledge base of the AI coach. Order matters only for exact score ties (earlier wins),
 * so the no-advice guardrail and specific topics come first.
 */
export const ASSISTANT_KB: AssistantKbEntry[] = [
  ...PRACTICE_KB,
  ...MARKETS_KB,
  ...BASICS_KB,
  ...APP_KB,
];
