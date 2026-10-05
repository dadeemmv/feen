/**
 * Italian copy of the money-compass test and of the companion characters' screens.
 * The characters' own texts (names, titles, descriptions) live in `@/content/personality`.
 */
import { QUIZ_LENGTH } from './lib/score';

export const MASCOT_COPY = {
  intro: {
    title: 'Che tipo sei con i soldi?',
    subtitle:
      'Come il political compass, ma per i soldi: li vuoi per la casetta dei sogni o per lo yacht? E quanto rischio accetti? Rispondi d’istinto.',
    meta: `${QUIZ_LENGTH} affermazioni · 2 minuti`,
    cta: 'Inizia il test',
    lineupLabel: 'I quattro personaggi: la Visionaria, lo Squalo, il Filantropo e il Cassettista',
  },

  quiz: {
    overline: 'La tua bussola dei soldi',
    progress: (current: number, total: number) => `${current}/${total}`,
    progressLabel: (current: number, total: number) => `Affermazione ${current} di ${total}`,
    agree: 'D’accordo',
    disagree: 'In disaccordo',
    back: 'Indietro',
    scaleLabel: 'Quanto sei d’accordo?',
    hint: 'Tocca un cerchio: più è grande, più la risposta è netta.',
  },

  reveal: {
    overline: 'Il tuo quadrante',
    meet: (name: string, title: string) =>
      `Il tuo personaggio è ${name}, ${title.toLowerCase()}: ti accompagnerà lezione dopo lezione.`,
    compassTitle: 'La tua bussola',
    strengthsTitle: 'Punti di forza',
    watchOutTitle: 'Da allenare',
    othersTitle: 'Gli altri personaggi',
    continue: 'Continua',
    artLabel: (name: string, title: string) => `${name}, ${title.toLowerCase()}: il tuo personaggio`,
    position: (right: number, risk: number) =>
      `${right > 50 ? `Right ${right}%` : `Left ${100 - right}%`} · ${risk > 50 ? `Risk ${risk}%` : `Unrisk ${100 - risk}%`}`,
  },

  compass: {
    a11y: (quadrant: string, right: number, risk: number) =>
      `Bussola dei soldi: sei nel quadrante ${quadrant}, ${right}% verso Right e ${risk}% verso Risk`,
  },

  screen: {
    retake: 'Rifai il test',
    take: 'Fai il test',
    emptySubtitle: 'Scopri il tuo quadrante e il tuo personaggio: bastano due minuti.',
    saved: (name: string) => `${name} è il tuo nuovo personaggio`,
    same: (name: string) => `${name} resta il tuo personaggio`,
  },
} as const;
