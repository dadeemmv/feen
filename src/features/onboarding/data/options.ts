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
    description: 'Non so bene cosa sia l’inflazione, e va benissimo così.',
    icon: Sprout,
    tone: 'mint',
  },
  {
    id: 'some',
    label: 'Conosco le basi',
    description: 'So cos’è un conto deposito e ho sentito parlare di ETF.',
    icon: BookOpen,
    tone: 'sky',
  },
  {
    id: 'expert',
    label: 'Investo già',
    description: 'Ho un broker e voglio capire meglio cosa sto facendo.',
    icon: TrendingUp,
    tone: 'lilac',
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
