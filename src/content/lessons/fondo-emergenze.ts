import type { Lesson } from '../types';

/**
 * Il Pozzo · Il fondo emergenze. Draft written for 14–19 year olds (concept board, screen 6):
 * to be reviewed with the same fact-check as the other lessons before release.
 */
export const fondoEmergenzeLesson: Lesson = {
  id: 'fondo-emergenze',
  steps: [
    {
      id: 'fondo-schermo',
      type: 'choice',
      tag: 'indovina',
      emoji: '📱',
      prompt: 'Ti cade il telefono e lo schermo si rompe. Ripararlo costa 120€. Cosa ti salva senza chiedere a nessuno?',
      options: [
        { id: 'luck', label: 'Sperare che non succeda' },
        { id: 'fund', label: 'Dei soldi messi da parte proprio per gli imprevisti' },
        { id: 'goal', label: 'I risparmi per il viaggio dell’estate' },
      ],
      correctOptionId: 'fund',
      explanation:
        'Gli imprevisti capitano a tutti. Se hai una scorta dedicata, li paghi senza rinunciare ai tuoi obiettivi (come il viaggio) e senza chiedere un prestito. Questa scorta si chiama fondo emergenze.',
    },
    {
      id: 'fondo-pozzo',
      type: 'definition',
      emoji: '🪣',
      title: 'Il Pozzo',
      lead: 'Quando arriva la siccità, l’acqua c’è.',
      term: 'Fondo emergenze',
      definition:
        'Soldi messi da parte solo per le spese che non avevi previsto: un guasto, una visita, una multa. Non servono per i desideri, servono per non andare in difficoltà.',
      tone: 'mint',
      explanation:
        'Il fondo emergenze è come un pozzo: lo riempi piano piano quando piove, e quando arriva la siccità ci attingi. Poi lo riempi di nuovo.',
    },
    {
      id: 'fondo-separato',
      type: 'info',
      emoji: '🧺',
      title: 'Due cesti, non uno',
      lead: 'Il fondo emergenze sta separato dai risparmi per gli obiettivi.',
      rows: [
        { emoji: '🎯', text: 'Risparmi per un obiettivo: il viaggio, le cuffie, il motorino. Sai quando li userai.', tone: 'sky' },
        { emoji: '🪣', text: 'Fondo emergenze: non sai quando servirà. Sai solo che prima o poi servirà.', tone: 'mint' },
        { text: 'Se li tieni insieme, il primo imprevisto si mangia il tuo obiettivo.', tone: 'butter' },
      ],
      explanation:
        'Tenere i due cesti separati ti aiuta a non toccare il fondo per un desiderio, e a non rinunciare all’obiettivo per un imprevisto.',
    },
    {
      id: 'fondo-vero-falso',
      type: 'true-false',
      tag: 'mettiti-alla-prova',
      statement: 'Il fondo emergenze va tenuto in qualcosa che può salire o scendere molto di valore, così cresce di più.',
      answer: false,
      explanation:
        'Un imprevisto non aspetta: quei soldi devono esserci tutti e subito, anche nel giorno peggiore. Per questo il fondo emergenze sta in un posto sicuro e facile da usare, come un conto o un salvadanaio, non in investimenti che possono scendere.',
    },
    {
      id: 'fondo-quanto',
      type: 'choice',
      tag: 'mettiti-alla-prova',
      emoji: '🧮',
      prompt: 'Per un adulto che vive da solo, un fondo emergenze dovrebbe coprire…',
      options: [
        { id: 'week', label: 'Una settimana di spese' },
        { id: 'months', label: 'Da 3 a 6 mesi di spese essenziali' },
        { id: 'years', label: 'Cinque anni di spese' },
      ],
      correctOptionId: 'months',
      explanation:
        'La regola più citata è da 3 a 6 mesi di spese essenziali (casa, cibo, bollette, trasporti). Una settimana non basta per un imprevisto serio; cinque anni sono troppi soldi fermi. Alla tua età basta molto meno: una cifra che copra un imprevisto tipico, come riparare lo schermo.',
    },
    {
      id: 'fondo-ordine',
      type: 'order',
      tag: 'ripasso',
      prompt: 'Metti in ordine: come si riempie il Pozzo',
      items: [
        { id: 'target', label: 'Scegli una cifra da raggiungere' },
        { id: 'first', label: 'Quando arrivano soldi, metti da parte subito una parte' },
        { id: 'use', label: 'Usalo solo per un imprevisto vero' },
        { id: 'refill', label: 'Dopo averlo usato, riempilo di nuovo' },
      ],
      explanation:
        'Prima decidi quanto, poi metti da parte appena arrivano i soldi (si chiama «pagare prima se stessi»), lo usi solo per gli imprevisti e, se lo svuoti, ricominci a riempirlo.',
    },
    {
      id: 'fondo-fill',
      type: 'fill',
      tag: 'ripasso',
      prompt: 'Completa la frase',
      sentence: 'Mettere da parte una quota appena ricevi dei soldi, prima di spendere, si chiama ___.',
      options: [
        { id: 'first', label: 'pagare prima se stessi' },
        { id: 'budget', label: 'fare un prestito' },
        { id: 'invest', label: 'investire in borsa' },
      ],
      correctOptionId: 'first',
      explanation:
        'Se aspetti la fine del mese per vedere cosa avanza, spesso non avanza niente. Mettere da parte subito, anche poco, rende il risparmio automatico.',
    },
    {
      id: 'fondo-chiusura',
      type: 'info',
      emoji: '💧',
      title: 'Prima l’acqua, poi la vista',
      lead: 'Con il Pozzo pieno puoi pensare alla Torre.',
      rows: [
        { emoji: '🪣', text: 'Il fondo emergenze ti protegge dagli imprevisti senza debiti.', tone: 'mint' },
        { emoji: '🗼', text: 'Solo dopo ha senso investire: i soldi investiti devono poter restare fermi a lungo.', tone: 'sky' },
      ],
      explanation:
        'Per questo nel borgo la Torre (investire) si apre dopo il Pozzo: chi investe senza una riserva rischia di dover vendere nel momento sbagliato per pagare un imprevisto.',
    },
  ],
};
