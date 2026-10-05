/**
 * Home stories (spec §3.4). Copy is taken from the reference video; `emphasis` lists the exact
 * substrings rendered in bold.
 */
import type { StoryGroup } from './types';

/**
 * Value of a timeline card `emoji` that the story renderer should draw as the Finanz logo tile
 * (lime square with "FZ") instead of an emoji. Rendered as plain text it still reads correctly.
 */
export const STORY_BRAND_MARK = 'FZ';

/** Title of the poll card inside the "Aiutaci a migliorare" page. */
export const POLL_CARD_TITLE = 'Piccolo sondaggio';

export const STORY_GROUPS: StoryGroup[] = [
  {
    id: 'academy',
    title: 'Academy',
    emoji: '📚',
    theme: 'mint',
    pages: [
      {
        kind: 'academy-intro',
        title: 'ACADEMY 📚',
        subtitle: 'Cosa troverai all’interno dell’app?',
        body: 'Per cominciare tanti percorsi, quiz e informazioni utili! Inoltre sarà presto disponibile un nuovo percorso:',
        posterTitle: 'IL TUO PRIMO INVESTIMENTO',
        sticker: 'Che ti insegnerà… Si capisce vero?',
      },
      {
        kind: 'poll',
        title: '💞 AIUTACI A MIGLIORARE 💞',
        subtitle: 'Non sarà l’ultimo percorso!',
        body: 'Indica le tue preferenze con i sondaggi e dacci una mano per il futuro. Noi abbiamo messo le basi, ora costruiremo l’academy insieme!',
        pollId: 'level-1-clarity',
        question: 'Quanto è stato chiaro il primo livello del percorso?',
        options: [
          { id: 'very-clear', label: 'Molto chiaro! Ho capito tutto al volo.' },
          {
            id: 'fairly-clear',
            label: 'Abbastanza chiaro, ma qualche chiarimento avrebbe reso le cose più facili.',
          },
          { id: 'bit-confused', label: 'Un po’ confuso, ma sono riuscito a cavarmela.' },
          {
            id: 'washing-machine',
            label: 'Sembrava di stare in una lavatrice, sono più confuso di prima',
          },
        ],
        sticker: 'Un esempio di cosa NON devi farti sfuggire! 👆',
      },
    ],
  },
  {
    id: 'app',
    title: 'App',
    emoji: '📱',
    theme: 'brand',
    pages: [
      {
        kind: 'timeline',
        title: 'CHI SIAMO??',
        cards: [
          {
            text: 'Siamo una startup nata tra i banchi di scuola.',
            emphasis: ['tra i banchi di scuola'],
            emoji: '📚',
          },
          {
            text: 'Anni fa ci siamo appassionati alla finanza capendo subito la sua importanza.',
            emphasis: ['finanza', 'importanza'],
          },
          {
            text: 'Ma scoprendo anche quanto fosse complessa e costosa la sua formazione.',
            emphasis: ['complessa', 'costosa'],
            emoji: '💸',
          },
        ],
      },
      {
        kind: 'timeline',
        cards: [
          {
            text: 'Da quel momento qualcosa è cambiato.',
            emphasis: ['cambiato'],
            emoji: '✨',
          },
          {
            text: 'Abbiamo iniziato a organizzare eventi nelle scuole di tutta Italia per sensibilizzare i giovani sui temi finanziari.',
            emphasis: ['eventi nelle scuole', 'sensibilizzare'],
            emoji: '🏫',
          },
          {
            text: 'E ci siamo resi conto che gli studenti non erano gli unici ad aver bisogno di aiuto.',
            emphasis: ['non erano gli unici', 'aiuto'],
          },
        ],
      },
      {
        kind: 'timeline',
        cards: [
          {
            text: 'Quindi abbiamo creato Finanz.',
            emphasis: ['Finanz'],
            emoji: STORY_BRAND_MARK,
          },
          {
            text: 'La prima app che migliora il tuo rapporto con i soldi, aiutandoti a risparmiare, investire e imparare!',
            emphasis: ['La prima app', 'risparmiare, investire e imparare!'],
            emoji: '💰',
          },
          {
            text: 'Accessibile e intuitiva, Finanz ti supporta nel tuo viaggio verso l’indipendenza finanziaria.',
            emphasis: ['Accessibile e intuitiva', 'l’indipendenza finanziaria'],
          },
          {
            text: 'Perché la finanza non deve essere un privilegio.',
            emphasis: ['non deve essere un privilegio'],
            emoji: '💖',
          },
        ],
      },
    ],
  },
];

export function getStoryGroup(groupId: string): StoryGroup | undefined {
  return STORY_GROUPS.find((group) => group.id === groupId);
}

/** Index of a group in the viewer (for the cube transition between groups). */
export function storyGroupIndex(groupId: string): number {
  return STORY_GROUPS.findIndex((group) => group.id === groupId);
}
