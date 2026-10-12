/**
 * Italian copy of the test and of the animals' screens. The animals' own texts (titles, partners,
 * clauses) live in `@/content/personality`.
 */
import { QUIZ_LENGTH } from './lib/score';

export const MASCOT_COPY = {
  intro: {
    title: 'Che animale sei con i soldi?',
    subtitle:
      'Dodici scenari di vita vera e nessuna risposta giusta. Misurano due cose: se pensi più all’oggi o al domani, e se cerchi sicurezza o occasioni.',
    meta: `${QUIZ_LENGTH} scenari · 3 minuti`,
    cta: 'Inizia il test',
    lineupLabel: 'I quattro animali: Volpe Esploratrice, Castoro Ingegnere, Lontra Conviviale e Scoiattolo Custode',
  },

  quiz: {
    overline: 'Scenario',
    progress: (current: number, total: number) => `${current}/${total}`,
    progressLabel: (current: number, total: number) => `Scenario ${current} di ${total}`,
    back: 'Indietro',
    scaleLabel: 'Quale delle due risposte ti somiglia di più?',
    hint: 'Non ci sono risposte giuste. C’è la tua.',
  },

  reveal: {
    overline: (code: string) => `Il tuo personaggio · ${code}`,
    meet: (description: string, role: string, name: string, species: string) =>
      `${description} Ti presento ${name}: ${role === 'il tuo socio' ? 'un' : 'una'} ${species.toLowerCase()} come te, che ci è già passat${role === 'il tuo socio' ? 'o' : 'a'}.`,
    gridTitle: 'Dove sei sugli assi',
    superpowerTitle: 'Superpotere',
    blindSpotTitle: 'Punto cieco',
    partnerStory: 'La sua storia',
    clauseTitle: 'La sua clausola',
    startTitle: 'Il borgo parte da',
    othersTitle: 'Gli altri animali',
    artLabel: (title: string) => `${title}: il tuo personaggio`,
    partnerLabel: (name: string, role: string) => `${name}, ${role}`,
    position: (future: number, risk: number) =>
      `${future > 50 ? `Domani ${future}%` : `Oggi ${100 - future}%`} · ${risk > 50 ? `Audacia ${risk}%` : `Prudenza ${100 - risk}%`}`,
    share: 'Condividi la card',
    shareText: (title: string) => `Ho fatto il test di Borgo: sono ${title}. E tu che animale sei con i soldi?`,
  },

  grid: {
    a11y: (quadrant: string, future: number, risk: number) =>
      `Sei nel quadrante ${quadrant}: ${future}% verso Domani e ${risk}% verso Audacia`,
  },

  screen: {
    title: 'Il tuo personaggio',
    retake: 'Rifai il test',
    take: 'Fai il test',
    emptySubtitle: 'Scopri che animale sei con i soldi e conosci la tua socia: bastano tre minuti.',
    retakeNote:
      'Il test si rifà ogni tre mesi e ti mostra come cambiano le tue risposte sugli assi. L’animale resta lo stesso: chi ti accompagna ha firmato con te.',
    moved: (name: string) => `${name} ha notato che le tue risposte sono cambiate`,
    same: (name: string) => `${name} resta al tuo fianco`,
  },
} as const;
