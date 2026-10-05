/**
 * Italian copy of the Home tab (spec §3.3 + docs/SCREEN_SPECS.md "Home").
 */
import { formatDays, formatFraction, plural } from '@/lib/format';

export const HOME_COPY = {
  greeting: (name: string) => `Ciao ${name} 👋`,
  /** Contextual line under the greeting, driven by the streak and the course progress. */
  subtitle: ({ streak, courseDone, studiedToday }: { streak: number; courseDone: boolean; studiedToday: boolean }) => {
    if (courseDone) return 'Hai completato il percorso: ripassa quando vuoi!';
    if (streak === 0) return 'Completa una lezione per accendere la tua serie';
    if (!studiedToday) return `Sei a ${formatDays(streak)} di fila: studia oggi per non perderla!`;
    return `Sei a ${formatDays(streak)} di fila. Continua così!`;
  },

  stories: {
    a11y: (title: string, seen: boolean) => `Storia ${title}${seen ? ', già vista' : ', da vedere'}`,
    hint: 'Apre la storia a schermo intero',
  },

  hero: {
    title: 'Il tuo percorso personale!',
    cta: 'Continua il tuo viaggio!',
    ctaHint: 'Apre il percorso “Fai il tuo primo investimento”',
    level: (level: number, chapter: string) => `Livello ${level} · ${chapter}`,
    done: 'Percorso completato',
    progress: (done: number, total: number) => `${formatFraction(done, total)} ${plural(total, 'capitolo', 'capitoli')}`,
    progressA11y: (done: number, total: number) => `${done} capitoli completati su ${total}`,
    resume: (chapter: string) => `Riprendi: ${chapter}`,
  },

  milestones: {
    title: 'Traguardi',
    subtitle: 'Sblocca premi completando le lezioni',
    claim: 'Riscatta',
    claimed: 'Riscattato',
    a11y: ({ title, label, current, threshold, reached, claimed }: MilestoneA11yInput) =>
      claimed
        ? `${title}: premio riscattato`
        : reached
          ? `${title}: traguardo raggiunto, premio da riscattare`
          : `${title}. ${label}. ${current} lezioni completate su ${threshold}`,
    hint: 'Mostra i dettagli del premio',
  },
} as const;

type MilestoneA11yInput = {
  title: string;
  label: string;
  current: number;
  threshold: number;
  reached: boolean;
  claimed: boolean;
};
