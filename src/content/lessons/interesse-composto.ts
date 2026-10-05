import type { Lesson } from '../types';

/**
 * Livello 1 · Capitolo 2.
 * Maths (5% annuo): 1.000 → 1.050 → 1.102,50 → 1.157,63; 10 anni ≈ 1.628,89; 30 anni ≈ 4.321,94.
 */
export const interesseCompostoLesson: Lesson = {
  id: 'interesse-composto',
  steps: [
    {
      id: 'composto-due-anni',
      type: 'choice',
      tag: 'indovina',
      illustration: 'compound-snowball',
      emoji: '❄️',
      prompt:
        'Investi 1.000€ al 5% annuo e reinvesti sempre gli interessi. Quanto hai dopo 2 anni?',
      options: [
        { id: 'one-year', label: '1.050€' },
        { id: 'simple', label: '1.100€' },
        { id: 'compound', label: '1.102,50€' },
      ],
      correctOptionId: 'compound',
      explanation:
        'Il primo anno guadagni 50€, il 5% di 1.000€, e arrivi a 1.050€. Il secondo anno il 5% si calcola su 1.050€: sono 52,50€, quindi arrivi a 1.102,50€. Quei 2,50€ in più sono interessi sugli interessi.',
    },
    {
      id: 'composto-definizione',
      type: 'definition',
      emoji: '❄️',
      title: 'L’effetto palla di neve',
      lead: 'Gli interessi che guadagni iniziano a produrre altri interessi.',
      term: 'Interesse composto',
      definition:
        'Interesse calcolato sul capitale iniziale più gli interessi già maturati. Più tempo passa, più la crescita accelera.',
      tone: 'mint',
      explanation:
        'Come una palla di neve che rotola e diventa sempre più grande, il capitale cresce su una base che aumenta ogni anno.',
    },
    {
      id: 'composto-confronto',
      type: 'info',
      emoji: '🔍',
      title: 'Semplice o composto?',
      lead: '1.000€ al 5% annuo, due modi di farli crescere:',
      rows: [
        {
          emoji: '➖',
          text: 'Interesse semplice: +50€ ogni anno, sempre uguali. Dopo 10 anni hai 1.500€.',
          tone: 'sky',
        },
        {
          emoji: '❄️',
          text: 'Interesse composto: gli interessi si sommano al capitale. Dopo 10 anni hai circa 1.629€.',
          tone: 'mint',
        },
        {
          emoji: '⏳',
          text: 'Col tempo la differenza esplode: dopo 30 anni sono 2.500€ contro oltre 4.300€.',
          tone: 'butter',
        },
      ],
      explanation:
        'Con l’interesse semplice guadagni sempre sul capitale iniziale. Con il composto guadagni anche sugli interessi passati, e l’effetto cresce con gli anni. Per semplicità non consideriamo tasse e costi, che nella realtà riducono la crescita.',
    },
    {
      id: 'composto-vero-falso',
      type: 'true-false',
      tag: 'mettiti-alla-prova',
      illustration: 'compound-snowball',
      statement:
        'Con l’interesse composto, il guadagno di ogni anno è sempre uguale a quello del primo anno.',
      answer: false,
      explanation:
        'Questo succede con l’interesse semplice. Con il composto ogni anno gli interessi si calcolano su una base più grande, quindi il guadagno cresce: 50€ il primo anno, 52,50€ il secondo, circa 55,13€ il terzo.',
    },
    {
      id: 'composto-tempo',
      type: 'info',
      emoji: '⏰',
      title: 'Il tempo è il tuo alleato',
      lead: 'Con l’interesse composto conta tantissimo quando inizi.',
      rows: [
        {
          emoji: '🌱',
          text: 'Chi inizia prima lascia lavorare gli interessi più a lungo, anche partendo da cifre piccole.',
          tone: 'mint',
        },
        {
          emoji: '📏',
          text: 'Regola del 72: dividi 72 per il rendimento annuo e scopri in quanti anni, circa, il capitale raddoppia.',
          tone: 'butter',
        },
        {
          emoji: '🧮',
          text: 'Esempio: al 6% annuo servono circa 72 ÷ 6 = 12 anni per raddoppiare.',
          tone: 'sky',
        },
      ],
      explanation:
        'La regola del 72 è una scorciatoia per stimare il tempo di raddoppio con l’interesse composto. Non è un calcolo esatto, ma è molto utile per farsi un’idea.',
    },
    {
      id: 'composto-fill',
      type: 'fill',
      tag: 'ripasso',
      prompt: 'Completa la frase',
      sentence: 'Con l’interesse composto guadagni anche sugli ___ già maturati.',
      options: [
        { id: 'salary', label: 'stipendi' },
        { id: 'costs', label: 'addebiti' },
        { id: 'interest', label: 'interessi' },
      ],
      correctOptionId: 'interest',
      explanation:
        'È proprio questo il segreto: gli interessi maturati si aggiungono al capitale e iniziano a loro volta a produrre interessi. Per questo si parla di “interessi sugli interessi”.',
    },
    {
      id: 'composto-regola-72',
      type: 'choice',
      tag: 'scenario',
      emoji: '📏',
      prompt:
        'Secondo la regola del 72, con un rendimento del 4% annuo in quanti anni circa raddoppi il capitale?',
      options: [
        { id: 'eight', label: '8 anni' },
        { id: 'eighteen', label: '18 anni' },
        { id: 'twenty-nine', label: '29 anni' },
      ],
      correctOptionId: 'eighteen',
      explanation:
        '72 diviso 4 fa 18: con un rendimento del 4% annuo, reinvestendo sempre i guadagni, il capitale raddoppia in circa 18 anni. Il calcolo esatto dà circa 17,7 anni: la regola è una stima rapida, ma ti dà subito un ordine di grandezza.',
    },
    {
      id: 'composto-ordine',
      type: 'order',
      tag: 'ripasso',
      prompt: 'Metti in ordine: come funziona l’interesse composto?',
      items: [
        { id: 'invest', label: 'Investi un capitale' },
        { id: 'earn', label: 'Maturano gli interessi' },
        { id: 'reinvest', label: 'Li reinvesti nel capitale' },
        { id: 'grow', label: 'I nuovi interessi sono più alti' },
      ],
      explanation:
        'Prima investi, poi maturano gli interessi. Se li reinvesti invece di spenderli, il capitale diventa più grande e gli interessi successivi crescono: il ciclo ricomincia.',
    },
    {
      id: 'composto-sintesi',
      type: 'info',
      emoji: '🚀',
      title: 'In sintesi',
      lead: 'L’interesse composto premia pazienza e costanza.',
      rows: [
        { emoji: '🌱', text: 'Inizia presto, anche con poco: il tempo fa gran parte del lavoro.', tone: 'mint' },
        { emoji: '🔁', text: 'Reinvesti i guadagni invece di spenderli.', tone: 'sky' },
        {
          emoji: '⚠️',
          text: 'Vale anche al contrario: sui debiti con tassi alti, come le carte revolving, il tempo gioca contro di te.',
          tone: 'blush',
        },
      ],
      explanation:
        'Tempo e interessi lavorano a tuo favore quando investi e contro di te quando hai debiti con tassi alti: più a lungo resti indebitato, più interessi paghi. Nel prossimo capitolo scopri perché rendimento e rischio vanno sempre insieme.',
    },
  ],
};
