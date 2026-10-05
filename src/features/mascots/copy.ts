/**
 * Italian copy of the money-personality test and of the companion mascots' screens.
 * The mascots' own texts (names, types, descriptions) live in `@/content/personality`.
 */
import { QUIZ_LENGTH } from './lib/score';

export const MASCOT_COPY = {
  intro: {
    title: 'Che tipo sei con i soldi?',
    subtitle: 'Rispondi d’istinto: non ci sono risposte giuste o sbagliate. Alla fine scopri quale dei quattro compagni ti accompagnerà nel percorso.',
    meta: `${QUIZ_LENGTH} affermazioni · 2 minuti`,
    cta: 'Inizia il test',
    lineupLabel: 'I quattro compagni: Scoiattolo, Gufo, Volpe e Koala',
  },

  quiz: {
    overline: 'Il tuo stile con i soldi',
    progress: (current: number, total: number) => `${current}/${total}`,
    progressLabel: (current: number, total: number) => `Affermazione ${current} di ${total}`,
    agree: 'D’accordo',
    disagree: 'In disaccordo',
    back: 'Indietro',
    scaleLabel: 'Quanto sei d’accordo?',
    hint: 'Tocca un cerchio: più è grande, più la risposta è netta.',
  },

  reveal: {
    overline: 'Il tuo compagno',
    meet: (name: string) => `${name} sarà il tuo compagno di viaggio: lezione dopo lezione, al tuo ritmo.`,
    traitsTitle: 'Il tuo profilo',
    strengthsTitle: 'Punti di forza',
    watchOutTitle: 'Da allenare',
    othersTitle: 'Gli altri compagni',
    continue: 'Continua',
    artLabel: (animal: string, name: string) => `${animal} ${name}, il tuo compagno`,
    traitA11y: (left: string, leftValue: number, right: string, rightValue: number) =>
      `${left} ${leftValue}%, ${right} ${rightValue}%`,
  },

  screen: {
    title: 'Il tuo compagno',
    retake: 'Rifai il test',
    take: 'Fai il test',
    emptySubtitle: 'Fai il test di personalità: bastano due minuti.',
    saved: (name: string) => `${name} è il tuo nuovo compagno`,
    same: (name: string) => `${name} resta il tuo compagno`,
  },
} as const;
