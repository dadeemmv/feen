/**
 * Streak screen "Sfide Maratona" (spec §3.5): a 7-day challenge available from day one and a
 * second challenge that unlocks with a 14-day streak.
 */
import type { MarathonChallenge } from './extra-types';

export const MARATHON_CHALLENGES: MarathonChallenge[] = [
  {
    id: 'marathon-7-days',
    days: 7,
    reward: 500,
    emoji: '😎',
    title: 'Ti senti pronto per una sfida?',
    unlockAtStreak: 0,
    lockedLabel: '',
  },
  {
    id: 'marathon-30-days',
    days: 30,
    reward: 1500,
    emoji: '🏅',
    title: 'Un mese intero da campione',
    unlockAtStreak: 14,
    lockedLabel: 'Raggiungi 14 giorni di fila per sbloccare una nuova sfida',
  },
];
