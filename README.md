# Finanz

**Impara la finanza come si impara una lingua.** Finanz è un'app mobile di educazione finanziaria
in stile Duolingo: percorsi a livelli, lezioni da 5 minuti con quiz, vite, streak, monete
("Kiwi"), shop, stories e un coach AI.

Questa codebase ricostruisce le funzionalità dell'app mostrata nel video di riferimento
(`docs/PRODUCT_SPEC.md`) con un redesign completo: design system proprietario, illustrazioni
originali, motion e micro-interazioni.

> **Stato del lavoro, cosa manca e prossimi passi: [`docs/HANDOFF.md`](docs/HANDOFF.md).**

## Avvio rapido

Requisiti: Node LTS (≥ 20) e npm. Nessun build nativo necessario: tutte le librerie sono incluse in
Expo Go.

```bash
npm install
```

```bash
npx expo start
```

- **iPhone / Android**: scansiona il QR con l'app Expo Go.
- **Web** (anteprima rapida): premi `w`, oppure `npx expo start --web`.
- Primo avvio: parte l'onboarding. Per ricominciare da zero usa *Account → Logout*.

Controlli di qualità:

```bash
npx tsc --noEmit
```

```bash
npx expo lint
```

## Stack

Expo SDK 57 · React Native 0.86 · React 19 (React Compiler) · TypeScript · expo-router (typed
routes) · Reanimated 4 + Worklets · Gesture Handler · react-native-svg · zustand (persist su
AsyncStorage) · lucide-react-native · Radix Colors · Bricolage Grotesque + Plus Jakarta Sans.

## Struttura

```
src/
  app/            solo route (file sottili che riesportano le schermate delle feature)
  features/       home, stories, academy, course, lesson, streak, lives, shop, pro,
                  account, invite, assistant, onboarding, rewards
  components/     ui (design system), icons (SVG economy), illustrations, navigation
  theme/          token: palette → colori semantici, spacing, radius, tipografia, elevation, motion
  store/          store zustand a slice + selettori puri + regole (vite, streak, livelli)
  content/        corsi, 13 lezioni, stories, shop, knowledge base del coach
  lib/            date, formattazione, haptics, share, clipboard
docs/             spec di prodotto, architettura, art direction, API dei componenti
```

Le scelte architetturali sono documentate in `docs/ARCHITECTURE.md` con i riferimenti alle repo
pubbliche da cui derivano (Expo template SDK 57, Ignite, Obytes, Restyle, Radix Colors, Rainbow,
Bluesky, Expensify, cloni Duolingo open source). La ricerca completa è in
`docs/ARCHITECTURE_RESEARCH.md`.

## Regole di gioco

- **Vite**: 3 al massimo, se ne perde una alla prima risposta sbagliata di ogni domanda; si
  ricaricano nel tempo. Pro e "Vite illimitate per 1 ora" le rendono infinite.
- **Streak**: giorni consecutivi con almeno una lezione completata; lo *Scudo salva-streak* copre
  un giorno saltato.
- **Kiwi**: si guadagnano completando lezioni, con la ricompensa giornaliera e le sfide; si spendono
  nello Shop.
- **Traguardi**: premi sbloccati dopo 2, 10 e 15 lezioni completate.

> Contenuti a scopo educativo, non costituiscono consulenza finanziaria. Pagamenti e abbonamento
> Pro sono in modalità demo (nessun addebito).
