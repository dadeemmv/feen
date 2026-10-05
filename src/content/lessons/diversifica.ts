import type { Lesson } from '../types';

/** Livello 3 · Capitolo 10. Maths: 10.000€ su 50 aziende = 200€ ciascuna → un fallimento pesa il 2%. */
export const diversificaLesson: Lesson = {
  id: 'diversifica',
  steps: [
    {
      id: 'diversifica-rischio',
      type: 'choice',
      tag: 'indovina',
      illustration: 'pie-diversify',
      emoji: '🥚',
      prompt: 'Hai 10.000€ da investire. Quale scelta ti espone al rischio più alto?',
      options: [
        { id: 'single', label: 'Tutto su una sola azienda' },
        { id: 'global', label: 'Un ETF globale' },
        { id: 'mix', label: 'Metà azioni, metà obbligazioni' },
      ],
      correctOptionId: 'single',
      explanation:
        'Se metti tutto su un’unica azienda, il tuo risultato dipende solo da lei: se va male, perdi tanto. Distribuendo i soldi su molti titoli, il problema di una singola azienda pesa molto meno sul totale.',
    },
    {
      id: 'diversifica-definizione',
      type: 'definition',
      emoji: '🧺',
      title: 'Mai tutte le uova in un paniere',
      lead: 'Il proverbio della nonna è anche una regola della finanza.',
      term: 'Diversificazione',
      definition:
        'Distribuire i soldi su tanti investimenti diversi, così che il cattivo andamento di uno pesi meno sul totale.',
      tone: 'mint',
      explanation:
        'Diversificare non serve a guadagnare di più, ma a non dipendere da una sola scommessa. È uno dei pochi modi per ridurre il rischio senza dover per forza rinunciare al rendimento.',
    },
    {
      id: 'diversifica-livelli',
      type: 'info',
      emoji: '🧩',
      title: 'Come si diversifica',
      lead: 'Puoi diversificare su più livelli:',
      rows: [
        { emoji: '🏢', text: 'Tra aziende: non una sola, ma tante.', tone: 'sky' },
        { emoji: '🏭', text: 'Tra settori: tecnologia, salute, energia, consumi…', tone: 'mint' },
        { emoji: '🌍', text: 'Tra Paesi: non solo Italia o Stati Uniti, ma tutto il mondo.', tone: 'butter' },
        { emoji: '⚖️', text: 'Tra strumenti: azioni, obbligazioni e liquidità.', tone: 'lilac' },
      ],
      explanation:
        'Aziende dello stesso settore o dello stesso Paese tendono a muoversi insieme. Più le fonti di rischio sono diverse, più la diversificazione funziona.',
    },
    {
      id: 'diversifica-vero-falso',
      type: 'true-false',
      tag: 'mettiti-alla-prova',
      illustration: 'pie-diversify',
      statement: 'Diversificare elimina completamente il rischio di perdere soldi.',
      answer: false,
      explanation:
        'La diversificazione riduce il rischio specifico, cioè quello legato a una singola azienda o a un settore. Resta però il rischio di mercato: in una crisi generale, come nel 2008, molti investimenti scendono insieme.',
    },
    {
      id: 'diversifica-esempio',
      type: 'info',
      emoji: '📉',
      title: 'Un esempio concreto',
      lead: 'Due portafogli da 10.000€. Un’azienda che possiedi fallisce e le sue azioni si azzerano:',
      rows: [
        { emoji: '🥚', text: 'Portafoglio A, una sola azienda: perdi 10.000€, cioè il 100%.', tone: 'blush' },
        {
          emoji: '🧺',
          text: 'Portafoglio B, 50 aziende da 200€ ciascuna: perdi 200€, cioè il 2%.',
          tone: 'mint',
        },
      ],
      explanation:
        'Con 50 aziende ognuna pesa solo il 2% del portafoglio. Anche nel caso peggiore per una di loro, il danno resta limitato.',
    },
    {
      id: 'diversifica-scenario',
      type: 'choice',
      tag: 'scenario',
      emoji: '🌍',
      prompt: 'Quale di questi portafogli è il più diversificato?',
      options: [
        { id: 'banks', label: '5 banche italiane' },
        { id: 'tech', label: '3 aziende tech americane' },
        { id: 'global', label: 'ETF su oltre 1.000 aziende globali' },
      ],
      correctOptionId: 'global',
      explanation:
        'Cinque banche italiane sono nello stesso settore e nello stesso Paese, quindi tendono a salire e scendere insieme. Un ETF globale distribuisce il rischio su tanti settori e Paesi. Diversificare non vuol dire solo avere tanti titoli, ma titoli diversi tra loro.',
    },
    {
      id: 'diversifica-ordine',
      type: 'order',
      tag: 'ripasso',
      prompt: 'Ordina dal meno al più diversificato',
      items: [
        { id: 'one', label: 'Azioni di una sola azienda' },
        { id: 'sector', label: '10 aziende dello stesso settore' },
        { id: 'country', label: 'ETF su un solo Paese' },
        { id: 'world', label: 'ETF globale su molti Paesi' },
      ],
      explanation:
        'Puntare su una sola azienda è il massimo della concentrazione. Dieci aziende dello stesso settore sono già meglio, un ETF su un Paese copre molti settori e uno globale aggiunge anche tanti Paesi diversi.',
    },
    {
      id: 'diversifica-fill',
      type: 'fill',
      tag: 'ripasso',
      prompt: 'Completa la frase',
      sentence: 'Distribuire i soldi su molti investimenti diversi si chiama ___.',
      options: [
        { id: 'speculation', label: 'speculazione' },
        { id: 'concentration', label: 'concentrazione' },
        { id: 'diversification', label: 'diversificazione' },
      ],
      correctOptionId: 'diversification',
      explanation:
        'La diversificazione è l’opposto della concentrazione, cioè puntare tutto su pochi titoli. Speculare, invece, significa cercare guadagni rapidi accettando rischi alti.',
    },
    {
      id: 'diversifica-ribilanciare',
      type: 'info',
      emoji: '🔄',
      title: 'Ribilanciare',
      lead: 'Nel tempo le proporzioni del portafoglio cambiano da sole.',
      rows: [
        {
          emoji: '📈',
          text: 'Se le azioni salgono molto, finiscono per pesare più di quanto avevi deciso.',
          tone: 'sky',
        },
        {
          emoji: '⚖️',
          text: 'Ribilanciare significa riportare le quote alle percentuali scelte, per esempio una volta l’anno.',
          tone: 'mint',
        },
        {
          emoji: '🎉',
          text: 'Hai completato il Livello 3! Ora scopri dove si investe davvero: il broker.',
          tone: 'butter',
        },
      ],
      explanation:
        'Ribilanciare mantiene il rischio al livello che hai scelto. Si può fare vendendo ciò che è cresciuto troppo oppure indirizzando i nuovi risparmi su ciò che pesa meno.',
    },
  ],
};
