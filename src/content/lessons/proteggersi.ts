import type { Lesson } from '../types';

/**
 * Le Mura · Proteggere quello che hai. The Beaver's second site, after the Well: his blind spot
 * is building big without a cushion for the unexpected. Draft written for 14–19 year olds (rules
 * as of 2026 in Italy: compulsory third-party insurance for mopeds, two-year legal guarantee,
 * 14-day right of withdrawal online): to be reviewed with the same fact-check as the other
 * lessons before release.
 */
export const proteggersiLesson: Lesson = {
  id: 'proteggersi',
  steps: [
    {
      id: 'mura-motorino',
      type: 'choice',
      tag: 'indovina',
      emoji: '🛵',
      prompt: 'Hai un motorino. Per usarlo su strada, quale assicurazione è obbligatoria per legge?',
      options: [
        { id: 'none', label: 'Nessuna, è facoltativa' },
        { id: 'rc', label: 'La RC, responsabilità civile' },
        { id: 'theft', label: 'Quella contro furto e incendio' },
      ],
      correctOptionId: 'rc',
      explanation:
        'La RC è obbligatoria per ogni veicolo a motore che circola, motorini compresi: paga i danni che causi agli altri. Furto e incendio sono garanzie in più, facoltative, che proteggono il tuo mezzo.',
    },
    {
      id: 'mura-definizione',
      type: 'definition',
      emoji: '🧱',
      title: 'Le Mura',
      lead: 'Non servono, finché non servono.',
      term: 'Assicurazione',
      definition:
        'Paghi una cifra piccola e sicura, il premio, per non dover pagare da solo una cifra grande e incerta se succede qualcosa. Il rischio lo dividi con tante altre persone.',
      explanation:
        'Funziona perché a pochi capita un danno grande, ma nessuno sa a chi capiterà. I premi di tutti pagano i danni di quei pochi.',
    },
    {
      id: 'mura-parole',
      type: 'info',
      emoji: '📄',
      title: 'Le parole del contratto',
      lead: 'Tre parole decidono quanto ti rimborsano.',
      rows: [
        { text: 'Premio: quanto paghi per essere assicurato, per esempio ogni mese o ogni anno.', tone: 'sky' },
        { text: 'Franchigia: la parte del danno che resta comunque a carico tuo.', tone: 'butter' },
        { text: 'Massimale: il massimo che l’assicurazione paga.', tone: 'mint' },
      ],
      explanation:
        'Prima di firmare guarda sempre franchigia e massimale: un premio basso con una franchigia alta può proteggerti meno di quanto sembra.',
    },
    {
      id: 'mura-garanzia',
      type: 'true-false',
      tag: 'mettiti-alla-prova',
      statement:
        'Hai comprato un telefono in un negozio in Italia e dopo un anno si spegne da solo per un difetto. Senza aver pagato nessuna estensione, hai diritto a farlo riparare o sostituire gratis.',
      answer: true,
      explanation:
        'In Italia la garanzia legale dura 2 anni dalla consegna ed è gratis: la deve il venditore per i difetti del prodotto. Non copre i danni che fai tu, come uno schermo rotto da una caduta. Prima di pagare un’estensione, chiediti cosa aggiunge davvero.',
    },
    {
      id: 'mura-conto',
      type: 'choice',
      tag: 'mettiti-alla-prova',
      emoji: '📱',
      prompt: 'Un’assicurazione per il telefono costa 8€ al mese per due anni. Se non succede niente, quanto hai pagato in tutto?',
      options: [
        { id: 'eight', label: '8€' },
        { id: 'ninety-six', label: '96€' },
        { id: 'one-ninety-two', label: '192€' },
      ],
      correctOptionId: 'one-ninety-two',
      explanation:
        '8€ × 24 mesi = 192€, anche se non succede niente. Non vuol dire che non convenga mai: conviene quando un danno sarebbe un problema serio per te. Ma prima fai sempre il conto.',
    },
    {
      id: 'mura-recesso',
      type: 'order',
      tag: 'ripasso',
      prompt: 'Metti in ordine: hai comprato online da un negozio una felpa che non ti piace',
      items: [
        { id: 'days', label: 'Controlla che dalla consegna siano passati meno di 14 giorni' },
        { id: 'tell', label: 'Comunica al venditore che vuoi restituirla' },
        { id: 'ship', label: 'Rispedisci la felpa' },
        { id: 'refund', label: 'Ricevi il rimborso' },
      ],
      explanation:
        'Per gli acquisti online da un’azienda hai 14 giorni dalla consegna per ripensarci, senza dover spiegare perché: si chiama diritto di recesso. Non vale per gli acquisti tra privati, e le spese per rispedire possono restare a te.',
    },
    {
      id: 'mura-franchigia',
      type: 'fill',
      tag: 'ripasso',
      prompt: 'Completa la frase',
      sentence: 'La parte del danno che resta comunque a carico tuo si chiama ___.',
      options: [
        { id: 'deductible', label: 'franchigia' },
        { id: 'premium', label: 'premio' },
        { id: 'cap', label: 'massimale' },
      ],
      correctOptionId: 'deductible',
      explanation:
        'Con una franchigia di 50€, su un danno da 200€ l’assicurazione te ne rimborsa 150: i primi 50 restano a te.',
    },
    {
      id: 'mura-prevenire',
      type: 'info',
      emoji: '🪖',
      title: 'Prevenire costa meno',
      lead: 'Le mura migliori sono quelle che non devi usare.',
      rows: [
        { text: 'Una cover e una pellicola costano meno di uno schermo nuovo.', tone: 'mint' },
        { text: 'Il casco protegge te, la RC protegge gli altri: servono tutti e due.', tone: 'sky' },
        { text: 'Prima di assicurare qualcosa, chiediti: se si rompe, riesco a ripagarlo da solo?', tone: 'butter' },
      ],
      explanation:
        'Prima viene la prevenzione, poi il Pozzo per gli imprevisti piccoli, e l’assicurazione per quelli che da solo non riusciresti a pagare.',
    },
  ],
};
