# Finanz — Product spec reconstructed from the reference video

Source: `franchi_video.mp4` (78 s screen recording of an iPhone with Dynamic Island, Italian UI).
The video is the **source of truth for features, flows, copy and logic**. The visual design must be
rebuilt at a much higher quality level (see "Design direction" at the end). Ignore OS-level
notifications that appear over the app in the video (LinkedIn/WhatsApp banners, Control Center) —
they are not part of the product.

Product: **Finanz** — "Duolingo for personal finance". Language: Italian. Tagline from the in-app
story: "La prima app che migliora il tuo rapporto con i soldi, aiutandoti a risparmiare, investire e
imparare!" — "Perché la finanza non deve essere un privilegio."

---

## 1. Global economy / gamification (visible everywhere)

Top-right **status chips** (pill, outlined) shown on Home, Course, Shop, Account, Academy tab:

| Chip | Meaning | Initial value in video | Tap target |
|---|---|---|---|
| `0 🔥` | Streak (giorni di fila) | 0 | opens **Streak screen** |
| `3 💚` | Lives / hearts (vite), max 3 | 3 | opens **Lives bottom sheet** |
| `0 🥝` | Coins (kiwi-slice coin — the currency) | 0 | (opens Shop) |
| avatar 🤠 | Profile avatar | — | opens **Account screen** |

Inside a lesson the header shows only `lives` and `coins` chips.

Rules observed:
- A **wrong answer costs 1 life** (3 → 2 on the first question, 2 → 1 on the true/false). In the video
  a *second* wrong attempt on the same question did NOT cost another life ⇒ max 1 life lost per question.
- Lives are persistent across screens (after leaving the lesson Home shows 1 💚).
- Coins are earned (daily reward +100, Marathon challenge +500) and spent in the Shop.
- Streak = consecutive days with at least one completed lesson. Streak shield ("Scudo salva-streak")
  protects the streak for a missed day.
- PRO subscription ("Finanz Pro") = unlimited lives. "30 giorni di Finanz Pro — invita 3 amici e
  riscattalo gratis!" referral promo.

---

## 2. Navigation architecture

Floating **bottom tab bar** (pill-shaped, white, shadow, floating above content with side margins).
Active tab = filled lime-green pill behind the icon. 4 tabs, icon-only:

1. **Home** (house icon)
2. **Academy** (open book icon)
3. **Assistente / Chat** (speech-bubble icon) — AI financial assistant
4. **Shop** (cart icon)

Stack screens pushed on top of tabs (no tab bar): Course detail (path), Lesson player, Streak,
Account, Invite a friend, Story viewer (full-screen modal).
Bottom sheets / modals: Lives sheet, Referral promo sheet, Answer feedback modal, Exit-confirm
modal, "Spiegami il perchè" AI chat sheet.

```
Tabs ─┬─ Home ──┬─> Story viewer (modal, full screen)       [tap story circle]
      │         ├─> Course detail / path (push)             [Continua il tuo viaggio!]
      │         │     └─> Lesson player (full-screen modal)  [tap current node / INIZIA DA QUI]
      │         ├─> Streak screen (push)                     [🔥 chip]
      │         ├─> Lives sheet (bottom sheet)               [💚 chip]
      │         ├─> Account (push)                           [avatar]
      │         │     └─> Invite a friend (push)             [Condividilo ad un amico / Invita un amico]
      │         └─> Referral promo sheet (bottom sheet)      [shown on app open]
      ├─ Academy ─> Course detail (push)                     [tap course card]
      ├─ Chat (AI assistant)
      └─ Shop
```

---

## 3. Screens & states (in video order)

### 3.1 Referral promo bottom sheet (t=0 s)
Shown over Home at launch (dimmed backdrop, grabber handle).
- Dark-green card: **"30 giorni di Finanz Pro"**, subtitle "Invita 3 amici e riscattalo gratis!",
  illustration of 3 envelopes with wax seals.
- CTA (lime, full width): **"Condividilo ad un amico"** → Invite a friend screen.
- Swipe down / tap backdrop dismisses.

### 3.2 Invite a friend (t=1–3 s)
- Back arrow (circle button). Title **"Invita un amico"**. Body "Condividi questo codice con gli amici
  per ricevere la tua ricompensa!"
- Big dark-green card with kiwi-slice illustrations, headline **"IL TUO CODICE"** (heavy display
  font, lime), code field **`ZGGK2O`** with copy icon (tap → copy to clipboard + feedback), CTA
  **"Condividi codice"** with share icon (opens native share sheet).
- Improvement ideas: progress "0/3 amici invitati", toast "Codice copiato".

### 3.3 Home (t=3–5 s)
Top: status chips + avatar.
**Stories row** (Instagram-like circles with light-green ring & emoji): "Academy" 📚, "App" 📱.
Tap → Story viewer.
**Hero card** (dark green, spotlight gradient, sparkles, open-book illustration):
"Il tuo percorso personale!" + CTA **"Continua il tuo viaggio!"** (lime, with a shimmer sweep
animation passing over the button) → Course detail.
**Unlock milestones row** — 3 small cards, each with padlock + progress bar:
"Sblocca dopo 2 lezioni", "Sblocca dopo 10 lezioni", "Sblocca dopo 15 lezioni" (progress = lessons
completed / threshold). These are locked rewards / features unlocked by lesson count.

### 3.4 Story viewer (t=5.5–10 s) — Instagram-style stories
Full-screen, segmented progress bars at top (one per page, auto-advance with timer, tap right =
next, tap left = previous), header: story avatar + name, share button, close X.
Two story groups; moving between groups uses a 3D cube transition.
- **Group "Academy"** (mint/teal background, teal display font):
  1. "ACADEMY 📚" — "Cosa troverai all'interno dell'app?" — "Per cominciare tanti percorsi, quiz e
     informazioni utili! Inoltre sarà presto disponibile un nuovo percorso:" + course poster
     "IL TUO PRIMO INVESTIMENTO" + tilted sticker "Che ti insegnerà... Si capisce vero?"
  2. "💞 AIUTACI A MIGLIORARE 💞" — "Non sarà l'ultimo percorso!" — "Indica le tue preferenze con i
     sondaggi e dacci una mano per il futuro. Noi abbiamo messo le basi, ora costruiremo l'academy
     insieme!" + interactive **poll card "Piccolo sondaggio"**: "Quanto è stato chiaro il primo livello
     del percorso?" options (radio): "Molto chiaro! Ho capito tutto al volo." / "Abbastanza chiaro, ma
     qualche chiarimento avrebbe reso le cose più facili." / "Un po' confuso, ma sono riuscito a
     cavarmela." / "Sembrava di stare in una lavatrice, sono più confuso di prima" + sticker
     "Un esempio di cosa NON devi farti sfuggire! 👆"
- **Group "App"** (dark green background, lime display font, cards connected by dashed path):
  1. "CHI SIAMO ??" — "Siamo una startup nata tra i banchi di scuola. 📚" → "Anni fa ci siamo
     appassionati alla finanza capendo subito la sua importanza." → "💸 Ma scoprendo anche quanto
     fosse complessa e costosa la sua formazione."
  2. "✨ Da quel momento qualcosa è cambiato." → "Abbiamo iniziato a organizzare eventi nelle scuole di
     tutta Italia per sensibilizzare i giovani sui temi finanziari. 🏫" → "E ci siamo resi conto che
     gli studenti non erano gli unici ad aver bisogno di aiuto."
  3. "Quindi abbiamo creato Finanz. [FZ logo]" → "💰 La prima app che migliora il tuo rapporto con i
     soldi, aiutandoti a risparmiare, investire e imparare!" → "Accessibile e intuitiva, Finanz ti
     supporta nel tuo viaggio verso l'indipendenza finanziaria." → "Perché la finanza non deve essere
     un privilegio. 💖"
- Seen stories: ring turns grey.

### 3.5 Streak screen (t=11–16 s)
- Dark-green header with big lime number **"0"** and **"GIORNI DI FILA"** (heavy display font),
  faint flame watermark; back button; share button.
- **"Calendario dei progressi"**: month calendar card ("September 2026", prev/next arrows, Mon-first
  week M T W T F S S, days of adjacent months greyed). Days with activity highlighted. Shows a
  loading state (animated dots) before the month renders.
- **"Scudo salva-streak"** card: shield illustration, "Se ti dimentichi di studiare, grazie agli
  scudi non perderai i tuoi progressi!", CTA **"Acquista scudi"** (→ Shop).
- **"Sfide Maratona"** section: challenge card 😎 "Ti senti pronto per una sfida?" reward pill
  "+ 500 🥝", progress pill "0/7" (7-day streak challenge). Locked card: 🔒 "Raggiungi 14 giorni di fila
  per sbloccare una nuova sfida".

### 3.6 Lives bottom sheet (t=17–19 s)
Title: "Vite al massimo! Ne perderai una quando sbagli una risposta." Two option cards:
- **PRO** card (selected, check badge): infinity-heart icon, "Vite illimitate".
- Current state card: 💚💚💚 **"Piena!"** "Le tue vite sono al massimo".
CTA **"Ottieni vite illimitate"** (lime) → Pro/paywall; secondary outline **"No, grazie"**.
(When not full: show hearts count + refill timer, and "Ricarica" with coins.)

### 3.7 Shop (t=19–22 s and 75–78 s)
Header: **"Shop"** + clock icon + refresh countdown **"2h 26min"** (daily offers reset).
Product cards (illustration area on tinted background + label + title + price pill):
1. badge **FREE**, "+100 🥝" — label BONUS — **"Ricompensa giornaliera"** — pill "Gratuito 🎁"
   (claim once per day → +100 coins; then shows claimed / countdown).
2. shield "1 🛡" — SALVA STREAK — **"1 Scudo salva streak"** — "500 🥝"
3. green heart "1 💚" — VITE EXTRA — **"1 Vita extra"** — "500 🥝"
4. golden heart "⏱ 1h 💛" — VITE EXTRA — **"Vite illimitate per 1 ora"** — "1000 🥝"
Purchases deduct coins; insufficient coins → disabled/"Kiwi insufficienti" feedback.

### 3.8 Account (t=23–27 s)
Back button + chips. Title **"Account"**.
- Profile row: avatar 🤠, name "alberto", email (truncated), chevron.
- Referral card "30 giorni di Finanz Pro" + CTA "Condividilo ad un amico".
- Section **MENU**: Impostazioni (Modifica le impostazioni) ⚙️ · Lingua e Paese (Cambia lingua e Paese
  del…) 🌍 · I tuoi acquisti (Visualizza i tuoi acquisti) 🛍 · Finanz PRO (Dettagli abbonamento) 💎 ·
  Invita un amico (Genera codice) 🫶 · I tuoi interessi (Cambia i tuoi interessi) 💖
- Section **ALTRO**: Utilizza codice (Inserisci il codice) 🔍 · Valuta app (Che voto ci daresti?) ✨ ·
  Supporto (Hai bisogno di aiuto?) 🧑‍💻 · Informazioni legali (Termini, condizioni e privacy) 🔐
- **Logout** (underlined text link).

### 3.9 Course detail / learning path (t=29–38 s)
Header image (photo: plant growing from coins, chart) that collapses on scroll into a sticky title.
- Level badge "⭐ BASE", title **"Fai il tuo primo investimento"**, course progress bar, pill
  "📖 13 capitoli".
- Path grouped by **levels** (full-width grey banner "🤓 LIVELLO n"). Chapters are square cards in a
  zig-zag (left / right alternating) connected by dashed lines:
  - LIVELLO 1: **Inflazione** (📈, current, green border) · Interesse composto · Rischi e rendimenti
  - LIVELLO 2: Le azioni · Dividendi · Capital gain · Obbligazioni
  - LIVELLO 3: Cedole · Gli ETF · Diversifica
  - LIVELLO 4: Il Broker · Scegli il broker · Dentro un broker
  (13 chapters total.)
- Locked chapters: padlock icon, greyed title. Current chapter: highlighted card with a green
  tooltip-style label **"INIZIA DA QUI"** (before starting) / **"RIPRENDI DA QUI"** (after a partial
  attempt). Tapping it opens the Lesson player. Completed chapters: check / filled state.
- End of path: trophy card **"TRAGUARDO RAGGIUNTO"** — "Ottimo lavoro! Condividi il tuo successo con
  gli amici." + CTA "Condividi con gli amici" (locked/dimmed until the course is done).

### 3.10 Lesson player (t=39–71 s) — chapter "Inflazione"
Header: close X, report flag, share; right: lives chip + coins chip. Below: **lesson progress bar**
(dark green fill, animated). Footer: full-width **"Continua"** CTA (disabled/pale until an answer is
selected; enabled lime after selection; on info cards always enabled).
Floating **AI sparkle button** (dark green circle ✨, bottom-right) on every step; after a wrong
answer it expands into a pill **"Spiegami il perchè ✨"**.

Step sequence observed:
1. **Multiple choice — tag "🎩 INDOVINA"** (yellow pill). Illustration 📖. Prompt: "Nel 2020 con
   1.000€ riempivi il carrello per un mese. Oggi con gli stessi soldi..." Options: "Compri di più" /
   "Compri uguale" / "Compri di meno" (correct). Flow: select option (highlighted) → Continua → if
   wrong: modal **"Risposta errata"** (red ✕ icon, "Ops, la tua risposta non è quella giusta.", red CTA
   "Chiudi"); the wrong option becomes disabled/faded, 1 life lost, "Spiegami il perchè" pill
   appears. If correct: modal **"Risposta corretta"** (green ✓ icon, "Complimenti, risposta esatta!
   Continua così!", lime CTA "Continua") → next step (horizontal slide transition).
2. **Info card "✨ La rivelazione"** — "I tuoi 1.000€ sono sempre lì. Ma valgono di meno." Tinted
   rows: 🍕 "Pizza margherita: da 5€ a oltre 7€" (cyan), 🚗 "Fiat Panda: da 12.000€ a €15.900" (pink),
   note "I prezzi salgono ogni anno. I tuoi soldi fermi no. Con gli stessi soldi, compri sempre meno
   cose." (cream). Emojis pop in with a staggered animation.
3. **Definition card "😈 Il colpevole"** — "Questo fenomeno ha un nome: INFLAZIONE." Lavender box:
   **Inflazione** — "L'aumento generale dei prezzi nel tempo. Leggi sempre 1.000€ sul conto, ma ogni
   anno comprano un po' meno."
4. **True / False — tag "🎩 METTITI ALLA PROVA"**. Image: burning dollar bill. Statement: "Hai 1.000€
   che potrai spendere solo tra un anno. Con un'inflazione del 3%, tra un anno comprerai esattamente
   le stesse cose di oggi." Buttons: ✓ **Vero** / ✕ **Falso** (correct = Falso).
5. **Info card "🌊 Erosione"** — "Perché l'inflazione ti fa così tanto male?" rows: "Perché erode il tuo
   potere d'acquisto: la quantità di cose reali che i tuoi soldi possono comprare." (cyan) / "Stessi
   1.000€. Ma meno spesa, meno benzina, meno tutto. Il numero non cambia, ciò che compri sì." (pink)
6. …(video stops here; the lesson continues with more steps and ends with a completion screen — to be
   designed: XP/coins earned, accuracy, streak +1, chapter unlocked.)

**"Spiegami il perchè" AI sheet** (t=57–64 s): bottom sheet with chat UI: user bubble (dark green)
"Spiegami perchè ho sbagliato", assistant typing indicator (3 animated dots), input "Chiedi
qualcosa..." + send button. The assistant should answer with an explanation of the current question.

**Exit confirmation** (tap X mid-lesson, t=66–70 s): modal with 🥺 emoji, **"Aspetta, non uscire!"**,
"Ti bastano meno di 5 minuti per completare un lezione, non mollare!", CTA lime **"Continua a
studiare"**, outline **"Esci"**. Esci → back to course path, current node now says "RIPRENDI DA QUI"
(progress inside the lesson is saved).

### 3.11 Academy tab (t=72 s)
Title **"Academy"**. Section "📖 Continua a studiare": large course card (photo, "⭐ BASE",
"Fai il tuo primo investimento", progress bar, "📖 13 capitoli"). Section "🤓 Potrebbe interessarti":
horizontal carousel of course cards ("Fai il tuo primo investi…", "Investi in azioni" …, some locked /
coming soon).

### 3.12 AI assistant tab (t=73–75 s)
Soft green gradient background, top-left menu (≡ conversation history), top-right new-chat (✎).
Center: glowing orb avatar (breathing animation). Typing dots, then streamed greeting: "Ciao! 🦊 Sono
il tuo assistente finanziario personale. So…" (typewriter effect). Input "Chiedi qualcosa..." + send
button above the floating tab bar.

---

## 4. Motion & micro-interactions observed
- Shimmer sweep across the "Continua il tuo viaggio!" CTA.
- Bottom sheets slide up with dimmed backdrop; modals scale/fade in with a big icon overlapping the
  top edge.
- Lesson steps slide horizontally; progress bar animates.
- Option press state (tinted fill + darker border).
- Story progress bars fill over time; cube transition between story groups.
- Typing indicator dots; typewriter text for AI.
- Emojis in info rows fade/pop in.
- Streak calendar loading dots.

## 5. Things NOT shown but required for a complete product (design them coherently)
- Lesson completion / celebration screen (XP + coins + accuracy + streak increment, confetti).
- Out of lives state (0 hearts) → sheet with refill options (wait timer, buy with coins, Pro).
- Completed chapter state on the path; unlocking next chapter animation.
- Onboarding (first launch): welcome → goal/interests → level → notifications → start. (The account
  has "I tuoi interessi", implying interests were collected during onboarding.)
- Pro paywall screen (Finanz Pro benefits: unlimited lives, no ads, AI explanations).
- Empty/locked/loading/error states.
