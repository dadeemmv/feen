/**
 * Italian copy of the streak screen and the shield info sheet (docs/PRODUCT_SPEC.md §3.5).
 * "GIORNI DI FILA", "Calendario dei progressi", "Scudo salva-streak", "Acquista scudi" and
 * "Sfide Maratona" are the reference video's strings.
 */
import { formatDays, formatShields } from '@/lib/format';

export const STREAK_COPY = {
  back: 'Indietro',
  share: 'Condividi la tua serie',
  daysLabel: (count: number) => (count === 1 ? 'GIORNO DI FILA' : 'GIORNI DI FILA'),
  zeroLine: 'Completa una lezione oggi per accendere la fiamma',
  activeTodayLine: 'Oggi hai già studiato: la fiamma è accesa! 🔥',
  atRiskLine: 'Completa una lezione entro mezzanotte per non perdere la serie',
  shieldSavingLine: 'Uno scudo sta proteggendo la tua serie di ieri',
  record: (days: number) => `Record: ${formatDays(days)}`,

  calendarTitle: 'Calendario dei progressi',
  monthSummary: (days: number, month: string) =>
    days === 0 ? `Nessun giorno di studio a ${month}` : `${formatDays(days)} di studio a ${month}`,
  prevMonth: 'Mese precedente',
  nextMonth: 'Mese successivo',
  loading: 'Carico il calendario',
  legendActive: 'Giorno di studio',
  legendShield: 'Protetto da uno scudo',
  legendToday: 'Oggi',
  dayA11y: (label: string, status: 'active' | 'shielded' | 'none', today: boolean) =>
    `${label}${today ? ', oggi' : ''}${status === 'active' ? ', hai studiato' : status === 'shielded' ? ', protetto da uno scudo' : ''}`,

  shieldTitle: 'Scudo salva-streak',
  shieldBody: 'Se ti dimentichi di studiare, grazie agli scudi non perderai i tuoi progressi!',
  shieldOwned: (count: number) => (count === 0 ? 'Non hai ancora scudi' : `Ne hai ${formatShields(count)}`),
  shieldCta: 'Acquista scudi',
  shieldInfo: 'Come funzionano',
  shieldInfoHint: 'Spiega come gli scudi proteggono la serie',
  shieldSaving: 'Uno scudo sta salvando la tua serie',

  marathonTitle: 'Sfide Maratona',
  reward: (coins: string) => `+ ${coins}`,
  progress: (current: number, total: number) => `${current}/${total}`,
  claim: 'Riscatta',
  claimed: 'Riscattata',
  claimedToast: (coins: string) => `+${coins} Kiwi aggiunti al tuo saldo`,
  challengeDone: 'Sfida completata!',
  daysLeft: (days: number) => `Ancora ${formatDays(days)}`,
  progressA11y: (current: number, total: number) => `${current} giorni su ${total}`,
  rewardA11y: (coins: string) => `Premio: ${coins} Kiwi`,
  lockedA11y: (label: string) => `Sfida bloccata. ${label}`,
  claimFailed: 'Non è stato possibile riscattare la sfida',

  shareTitle: 'La mia serie su Finanz',
  shareCopied: 'Testo copiato: incollalo dove vuoi',
  shareMessage: (days: number) =>
    days > 0
      ? `Sono a ${formatDays(days)} di fila su Finanz! 🔥 Impara anche tu a gestire i tuoi soldi, 5 minuti al giorno.`
      : 'Sto iniziando la mia serie su Finanz 🔥 Impara anche tu a gestire i tuoi soldi, 5 minuti al giorno.',
} as const;

export const SHIELD_INFO_COPY = {
  title: 'Scudo salva-streak',
  lead: 'Lo scudo è la tua rete di sicurezza: protegge la serie quando salti un giorno di studio.',
  points: [
    { emoji: '🛡️', text: 'Se ieri non hai studiato, uno scudo copre il giorno mancato in automatico.' },
    { emoji: '1️⃣', text: 'Ogni scudo protegge un solo giorno: due giorni di pausa di fila interrompono la serie.' },
    { emoji: '🥝', text: 'Li trovi nello Shop a 500 Kiwi, oppure come premio dei traguardi.' },
  ],
  owned: (count: number) => (count === 0 ? 'Non hai ancora scudi' : `Hai ${formatShields(count)} pronti all’uso`),
  cta: 'Acquista scudi',
  close: 'Ho capito',
} as const;
