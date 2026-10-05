# Finanz — documento di consegna (5 ottobre 2026)

App mobile di educazione finanziaria in stile Duolingo, ricostruita a partire dal video di
riferimento (`franchi_video.mp4`) con un redesign completo. Questo documento descrive **lo stato
reale del lavoro**, come avviarlo e cosa resta da fare.

## 1. Sintesi

| Area | Stato |
|---|---|
| Analisi del video → spec di prodotto | ✅ Completa (`docs/PRODUCT_SPEC.md`) |
| Architettura (fondata su repo GitHub pubbliche) | ✅ Completa (`docs/ARCHITECTURE.md`, ricerca in `docs/ARCHITECTURE_RESEARCH.md`) |
| Art direction + redline per schermata | ✅ Completa (`docs/DESIGN_DIRECTION.md`, `docs/SCREEN_SPECS.md`) |
| Design system: token, UI kit (~40 componenti), tab bar, header | ✅ Completo (`docs/COMPONENTS.md`, demo in app su `/dev/ui`) |
| Icone economy + illustrazioni SVG originali | ✅ Complete (`/dev/icons`, `/dev/illustrations`) |
| Contenuti: 13 lezioni, stories, shop, KB del coach | ✅ Completi e **verificati da fact-check** (fonti ISTAT, BCE, TUB, Consob…) |
| Store (vite, streak, scudi, Kiwi, XP, progressi, ripresa lezione) | ✅ Completo, logica pura testata |
| Shell di navigazione, onboarding gate, overlay globali | ✅ Completi |
| Home, Stories, Invita, Traguardi | ✅ Completi (report in `docs/handoff/reports/`) |
| Lezione (7 tipi di step, feedback, AI "Spiegami il perché", uscita, ripresa, completamento) | ✅ Completa (report incluso) |
| Account + 7 sezioni + Onboarding | ✅ Completi (report incluso) |
| Percorso del corso + Academy | ✅ Implementati e funzionanti (vedi §4) |
| Streak, Vite (sheet), Shop, Pro paywall | ✅ Implementati e funzionanti (vedi §4) |
| Coach AI (tab) | ✅ Implementato, motore offline (vedi §4) |
| QA visivo sistematico + polish finale per area | ⏳ **Da fare** (vedi §5) |
| Verifica su device fisico iOS/Android | ⏳ **Da fare** |

Verifiche eseguite al momento della consegna:
- `tsc --noEmit`: **0 errori**.
- `eslint src`: **pulito**.
- Smoke test web a 390×844 su Home, Percorso, Lezione, Streak, Shop, sheet Vite, Pro, Academy e Coach:
  tutte le schermate si caricano **senza errori in console**.
- Codebase: ~485 file TypeScript, ~38.700 righe.

## 2. Avvio

Requisiti: Node LTS ≥ 20 e npm. Non serve Xcode né Android Studio: tutte le librerie sono incluse
in **Expo Go**.

```bash
npm install
```

```bash
npx expo start
```

- **Telefono:** scansiona il QR con Expo Go (stessa rete Wi-Fi).
- **Web:** premi `w` (anteprima rapida; usa una finestra stretta o l'emulazione mobile del
  browser).
- **Primo avvio:** parte l'onboarding. Per ricominciare da zero usa *Account → Logout*.
- **Pagine di sviluppo:** `/dev` (catalogo), `/dev/ui`, `/dev/icons`, `/dev/illustrations`.

Controlli di qualità:

```bash
npx tsc --noEmit
```

```bash
npx expo lint
```

## 3. Stack e struttura

Expo SDK 57 · React Native 0.86 · React 19 (React Compiler attivo) · TypeScript strict ·
expo-router (typed routes) · Reanimated 4 + Worklets · Gesture Handler · react-native-svg ·
zustand con persist su AsyncStorage · lucide-react-native · Radix Colors · font Bricolage Grotesque
e Plus Jakarta Sans.

```
src/app/          solo route (file sottili che riesportano le schermate)
src/features/     una cartella per feature: schermate, componenti, hook, logica
src/components/   ui (design system) · icons · illustrations · navigation
src/theme/        token (palette privata → colori semantici, spacing, radius, tipografia, motion…)
src/store/        store zustand a slice, selettori puri, regole (vite, streak, livelli), store UI
src/content/      corsi, 13 lezioni, stories, shop, knowledge base del coach
src/lib/          date, formattazione, haptics, share, clipboard
docs/             spec, architettura, art direction, redline, API componenti, questo documento
```

Le regole del progetto per chi continua (anche con un agente AI) sono in `CLAUDE.md` e `AGENTS.md`.

## 4. Note per area

**Completate con report di chiusura** (dettaglio in `docs/handoff/reports/`):
- **Home, Stories, Invita, Traguardi.** Viewer stile Instagram con transizione a cubo, sondaggio
  interattivo e promo referral all'avvio.
- **Lezione.** Regola "massimo 1 vita persa per domanda" verificata su tutte le 13 lezioni;
  ripasso dei capitoli completati senza perdita di vite; completamento con premi registrati una
  sola volta.
- **Account e Onboarding.** Le sezioni sono impostazioni, lingua, acquisti, interessi, supporto,
  note legali e profilo. Sheet "Utilizza codice" (codici demo `FINANZ100`, `STREAK`) e
  "Valuta app".

**Bussola dei soldi e 4 personaggi (aggiunta il 5 ottobre 2026).**
- Onboarding: nome → *Che tipo sei con i soldi?* (intro) → 12 affermazioni su scala a 7 cerchi
  stile 16Personalities → risultato → interessi → livello → ritmo → tutto pronto.
- Due assi stile political compass, sei affermazioni ciascuno, metà in senso inverso:
  orizzontale *Left* (i soldi per la casetta dei sogni, chi ami, restituire) ↔ *Right* (i soldi per
  farne altri, lo yacht); verticale *Unrisk* ↔ *Risk*. A pari merito si cade in Unrisk Left.
- Quadranti e personaggi (archetipi ispirati, non ritratti): Risk Left *Vera, la Visionaria*;
  Risk Right *Max, lo Squalo*; Unrisk Left *Teo, il Filantropo*; Unrisk Right *Bruno, il
  Cassettista*.
- Dati e testi in `src/content/personality.ts`; punteggio puro in `src/features/mascots/lib/score.ts`;
  bussola in `src/features/mascots/components/money-compass.tsx`; personaggi SVG (figura intera
  200 × 320 o busto con `framing="bust"`) in `src/components/illustrations/mascots/`, QA su
  `/dev/mascots`.
- Il risultato sta nel profilo (`personality`: `mascot`, `right`, `risk`) e compare in "Tutto
  pronto", accanto al saluto in Home e in Account → *Il tuo personaggio* (`/mascot`), da dove si
  rifà il test. Un risultato salvato con la versione precedente (animali) viene ignorato e il test
  viene riproposto.

**Implementate ma senza report di chiusura dell'agente:** il lavoro si è interrotto per i limiti
di utilizzo subito prima del passaggio finale di verifica.
- **Percorso e Academy.**
- **Streak, Vite, Shop, Pro.**
- **Coach AI.**

Il codice compila, passa il lint e le schermate funzionano, ma vanno ripassate nel QA (§5).

**Integrazione.** Gli sheet globali sono collegati in `src/components/navigation/global-overlays.tsx`:
`lives`, `out-of-lives`, `referral`, `rate`, `redeem`, `shield-info`. Si aprono da qualunque punto
con `openSheet('<nome>')` da `@/store/ui`.

**Demo, da sostituire prima del rilascio:**
- **Pagamenti e abbonamento Pro:** sono simulati, con la dicitura "Demo — nessun addebito".
- **Coach AI:** risponde con un motore offline basato sulla knowledge base
  (`src/features/assistant/engine.ts`). L'interfaccia `AssistantProvider` è pronta per un backend
  LLM reale.
- **Dati utente:** sono locali (AsyncStorage). Non ci sono backend né account reali.

## 5. Prossimi passi consigliati (in ordine)

1. **QA visivo per area** a 390×844 e 375×667. Va percorso ogni flusso:
   - onboarding → home → story → percorso → lezione "Inflazione" (una risposta sbagliata, poi
     tutte giuste) → completamento → il nodo successivo diventa corrente;
   - streak (oggi attivo) → shop (ricompensa giornaliera e acquisti) → account e tutte le
     sezioni → logout.

   Ogni problema va annotato con file e fix.
2. **Polish per area.** Gerarchia, spaziature (sempre token), coerenza delle chip di stato,
   feedback (scala alla pressione + haptic) su ogni tap, animazioni d'ingresso con
   `.duration().easing()` (su web `springify` viene ignorato).
3. **Device fisico.** Da verificare su telefono:
   - haptics;
   - fluidità delle animazioni Reanimated;
   - sheet globali sopra la lezione (che è un `fullScreenModal`) su iOS;
   - tasto indietro Android nella lezione;
   - safe area con notch e Dynamic Island.
4. **Test automatici (Jest).** Le regole pure dello store (`src/store/rules/*`) e la macchina della
   lezione (`src/features/lesson/machine.ts`) sono già scritte per essere testabili senza UI.
5. **Prodotto.**
   - Backend per account, progressi e coach AI.
   - Pagamenti reali (StoreKit / Play Billing).
   - Notifiche promemoria.
   - i18n: oggi tutti i testi sono in italiano, nei file `copy.ts` delle feature e in
     `src/content`.

## 6. Problemi noti

- **Stato condiviso sul web.** Tutte le schede del browser su `localhost:8081` condividono lo
  stato salvato (localStorage). Durante i test in più schede i valori possono sovrascriversi a
  vicenda.
- **Traguardo "15 lezioni".** Conta anche i ripassi, perché il corso ha 13 capitoli
  (`selectChaptersCompleted` dà il numero di capitoli distinti).
- **Coach AI.** Per richieste generiche come "Fammi un esempio" può ripetere la stessa
  spiegazione. La lezione aggira il problema, ma il motore andrebbe migliorato.
- **Toast sotto gli sheet.** Su native un toast può comparire sotto uno sheet o un dialog
  aperto.

## 7. Materiale incluso

- `docs/` contiene spec di prodotto, architettura (con riferimenti GitHub verificati), ricerca,
  art direction, redline, API dei componenti e questo documento.
- `docs/handoff/reports/` contiene i report tecnici degli agenti per le aree completate.
- `docs/handoff/workflows/features-workflow.js` è lo script usato per orchestrare gli agenti
  sulle feature (Claude Code Workflow), utile come riferimento per continuare allo stesso modo.
- `assets/` contiene icona dell'app, splash, favicon e icone Android/iOS del brand Finanz.
