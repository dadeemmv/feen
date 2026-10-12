/**
 * Single-choice answers of the onboarding steps "Livello" and "Ritmo". Values map 1:1 to the
 * profile slice (`experience`, `goalMinutes`).
 */
import { BookOpen, Sprout, TrendingUp, type LucideIcon } from 'lucide-react-native';

import type { Tone } from '@/components/ui';
import type { Experience } from '@/store';

export type ExperienceOption = {
  id: Experience;
  label: string;
  description: string;
  icon: LucideIcon;
  tone: Tone;
};

export const EXPERIENCE_OPTIONS: readonly ExperienceOption[] = [
  {
    id: 'beginner',
    label: 'Parto da zero',
    description: 'Non ho mai fatto due conti sui miei soldi, e va benissimo così.',
    icon: Sprout,
    tone: 'neutral',
  },
  {
    id: 'some',
    label: 'Qualcosa so',
    description: 'Metto da parte un po’ di soldi e so più o meno quanto spendo.',
    icon: BookOpen,
    tone: 'neutral',
  },
  {
    id: 'expert',
    label: 'Me la cavo già',
    description: 'Ho un conto o una prepagata e voglio capire anche come si investe.',
    icon: TrendingUp,
    tone: 'neutral',
  },
];

export type GoalOption = {
  minutes: number;
  label: string;
  description: string;
  recommended?: boolean;
};

export const GOAL_OPTIONS: readonly GoalOption[] = [
  { minutes: 5, label: 'Leggero', description: '1 lezione al giorno' },
  { minutes: 10, label: 'Regolare', description: '2 lezioni al giorno', recommended: true },
  { minutes: 15, label: 'Intenso', description: '3 lezioni al giorno' },
];

export const getExperienceOption = (id: Experience) => EXPERIENCE_OPTIONS.find((option) => option.id === id);
export const getGoalOption = (minutes: number) => GOAL_OPTIONS.find((option) => option.minutes === minutes);
