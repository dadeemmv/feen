### feature-account-onboarding

Account (/account), all 7 account sub-pages, the Redeem and Rate sheets, and the full onboarding flow are finished and work end to end.
- **Checks:** `npx tsc --noEmit` shows 0 errors across the whole project, and `eslint` is clean on `src/features/{account,onboarding}` and `src/app/{account,onboarding}`.
- **Web bundle:** HTML 200 and `entry.bundle` 200 (14.3 MB). Every "Unable to resolve" / "SyntaxError" match in it is library error-formatting code, not a build error.

**How it was tested**
- **In the app:** I walked through it in the Browser pane at 375×667 and 390×844. The pane was then taken over by another agent and stopped drawing frames.
- **Headless Chrome:** I finished QA with headless Chrome driven over CDP, at 2× scale, at both sizes. Script: `scratchpad/acct-qa/shot.mjs` (copied from econ-qa), scenarios `*.json`, screenshots in `acct-qa/out/`.
- **Checked against the saved store:**
  - **New-user flow:** "Anna Maria", 2 interests, "Parto da zero", 15 min. The store ends with `onboardingDone: true`, `email: anna.maria@finanz.app`, `interests: [risparmio, crypto]`, `experience: beginner`, `goalMinutes: 15`, notifications and reminder slot saved.
  - **"Ho già un account":** shows "Bentornato, Alberto!" and keeps the saved profile.
  - **Logout:** the `finanz-store` key is removed and the app lands on `/onboarding`.
- **Also exercised:**
  - Redeem: an invalid code shakes the field with "Codice non valido"; FINANZ100 adds +100 Kiwi with the reward view; each code works once.
  - Rate: the 4★ branch (thanks + review) and the 2★ branch (feedback, then "Feedback ricevuto").
  - Settings: switches write to the store immediately; the reminder time row hides when reminders are off.
  - Interests: Save writes `profile.interests` and shows a toast.
  - Navigation guards: an unknown section goes back; deep-linking `/onboarding/pace` redirects to the first unanswered step.
- **Not verified:** animation timing on a real device.
- No packages needed.

**Files** (all under `finanz/src/`)
- **Routes** (thin re-exports): `app/account/index.tsx`, `app/account/[section].tsx`, `app/onboarding/{_layout,index,name,interests,level,pace,ready}.tsx`.
- **`features/account/`:**
  - `index.ts` exports `AccountScreen`, `AccountSectionScreen`, `RedeemCodeSheet`, `RateAppSheet`, `openSection`, `AccountSection`.
  - `copy.ts`, `metrics.ts`, `help-content.ts` (FAQ and legal texts built from store constants), `redeem-codes.ts`.
  - `account-screen.tsx`, `account-section-screen.tsx`.
  - `components/`: `account-menu`, `account-stats`, `profile-card`, `referral-card`, `logout-section`, `section-page`, `accordion`, `segmented-options`, `purchase-row`, `avatar-picker`, `interest-toggle`.
  - `sections/`: `settings`, `language`, `purchases`, `interests`, `support`, `legal`, `profile` (`-section.tsx`).
  - `sheets/`: `redeem-code-sheet`, `rate-app-sheet`, `rating-stars`, `reward-burst`.
  - `lib/`: `navigation`, `logout`, `use-content-width`.
- **`features/onboarding/`:**
  - `index.ts` (barrel), `copy.ts`, `steps.ts` (step registry, deep-link guard, `finishOnboarding`), `draft-store.ts` (answers kept in memory, not saved, until the end).
  - `onboarding-layout.tsx`, `data/{interests,name,options}.ts`, `lib/entering.ts`.
  - `components/`: `step-header`, `step-screen`, `select-card`, `first-path-card`.
  - `screens/`: `welcome`, `name`, `interests`, `level`, `pace`, `ready` (`-screen.tsx`).
- **This run:**
  - **New:** `screens/welcome-screen.tsx`, `components/first-path-card.tsx`, `onboarding/index.ts`.
  - **Removed:** the shell's placeholder `onboarding-screen.tsx`.
  - **Fixed:**
    - "Tutto pronto": the path card was white text on a white card, because `useTheme` was read outside the brand colour mode.
    - A lint error in `step-header`: setState inside an effect.
  - **Polished:**
    - Prices in purchase rows are now plain text, so long titles keep their room.
    - Shorter settings subtitles, which were being cut off.
    - The name field shows the "only letters" error as soon as a digit is typed.
    - A demo email is derived from the name.

**Account (/account)**
- **Header and title:** back button (to Home if there is no history), the shared status chips without the avatar, and "Account" in `displayMd`.
- **Profile card:**
  - Avatar 56 on its emoji tint, name, truncated email and a chevron; the whole card opens the profile editor.
  - Below a divider: the level strip (BoltIcon, "Livello n · Titolo", "x/y XP", lime progress bar), or "livello massimo".
- **Three stat tiles** (streak, lessons completed, Kiwi). Each is a shortcut: Streak screen, learning path, Shop.
- **Referral card:** evergreen card with "30 giorni di Finanz Pro", the subtitle, ReferralEnvelopes, an "n/3 amici invitati" chip and the "Condividilo ad un amico" button → `/invite`.
- **MENU and ALTRO:** grouped lists, rows at least 64 tall, tinted 40 pt icon tiles.
  - **MENU:** Impostazioni (Settings, neutral), Lingua e Paese (Globe, sky), I tuoi acquisti (ShoppingBag, blush), Finanz PRO (custom GemIcon, lilac; shows "Attivo" when Pro is on) → `/pro`, Invita un amico (HeartHandshake, mint) → `/invite`, I tuoi interessi (Heart, blush).
  - **ALTRO:** Utilizza codice (TicketPercent, mint) → Redeem sheet, Valuta app (Star, butter) → Rate sheet, Supporto (Headset, sky), Informazioni legali (ShieldCheck).
- **Logout:** centred, underlined, danger colour. It opens a confirm Dialog ("Vuoi uscire?", "Esci e cancella" / "Annulla"). After the dialog has closed, it calls `router.replace('/onboarding')`, then `resetStore()` (clears saved data and returns to the demo user), wipes the Coach chats (`clearChatHistory`) and resets the onboarding draft.
- **Footnote:** FZ logo, "Finanz 1.0.0 · versione demo" and "Fatto con 💚 in Italia".
- **Motion:** blocks rise in, staggered; turned off under reduced motion.

**Sub-pages** (shared frame: back button, `displayMd` title and lead line, optional sticky footer button; an unknown section goes back)
- **settings:** Vibrazione, Suoni and Riduci animazioni switches write `settings` immediately. Vibrazione also calls `setHapticsEnabled` straight away. Notifiche promemoria shows a Mattina 9:00 / Pomeriggio 14:00 / Sera 20:30 picker (spring thumb) that saves `reminderSlot`, plus a "demo: no real notifications" note.
- **language:** Italiano 🇮🇹 selected; English disabled with a "Presto" tag; Paese: Italia, with a note.
- **purchases:**
  - Two summary tiles (Kiwi spent, number of purchases), then the history grouped by month: item icon on its tint, title, date and time, "−500" plus a coin.
  - Empty state: EmptyBox illustration, "Nessun acquisto ancora", and "Vai allo Shop".
- **interests:** 11 topic pills (same catalogue as onboarding). Save is enabled only after a change with at least 1 topic; it saves, shows a success toast and goes back. The counter warns when nothing is selected.
- **support:** 5 FAQ items in an accordion (one open at a time; chevron turns; answers built from the real rules). A contact card with "Scrivici" opens `mailto:supporto@finanz.app` through Linking; if that fails it copies the address with a toast.
- **legal:** Termini di servizio, Privacy and Cookie as expandable sections. A "demo, no legal value" banner sits on top and every text carries a "Testo di esempio" tag.
- **profile:**
  - A live preview card; the avatar bumps when a new one is picked.
  - Name field with count and the same rules as onboarding: 2–24 characters, letters only, errors shown after blur, or right away for invalid characters.
  - Read-only email with a helper line; a 12-emoji avatar grid that behaves as a radio group.
  - "Salva modifiche" is enabled only when something changed and the name is valid; it saves, shows a toast and goes back.

**Sheets** (both take `{visible, onClose}`, the overlay registry's prop shape)
- **RedeemCodeSheet:**
  - The code field upper-cases and strips symbols, and shows a demo hint. "Riscatta" needs at least 3 characters and also fires on Enter.
  - FINANZ100 adds +100 Kiwi through `earn`; STREAK adds +1 shield through `addShields` + `syncStreak`. Either one switches the sheet to a reward view: lime halo, the icon popping in, confetti, and "Fantastico!".
  - A wrong code gives a shake, an error haptic and "Codice non valido"; a used code shows "Hai già usato questo codice" (tracked in `redeemedCodes`).
- **RateAppSheet:**
  - Five stars; tapping fills them with a staggered spring pop and a label from "Pessima" to "Fantastica!". The vote is saved to `appRating` and preselected next time.
  - 4–5 stars: "Grazie! 💚" with "Lascia una recensione" (no-op; a thank-you toast after the sheet closes) and "Magari più tardi".
  - 1–3 stars: a feedback field; "Invia" is enabled once text is entered and leads to "Feedback ricevuto".

**Onboarding** (one Stack route per step, so iOS swipe-back, Android back and browser history all work)
1. **Welcome:**
   - Evergreen screen with spotlight, the FZ wordmark, and HeroBookSpotlight drifting gently (still under reduced motion).
   - "La finanza, finalmente **semplice.**" ("semplice." in lime) and the subtitle from the spec.
   - Three perk chips: 5 min al giorno, Quiz e sfide, Premi in Kiwi.
   - "Inizia" (shimmer, glow, arrow) and "Ho già un account" (demo: keeps the saved profile and jumps to the end).
   - Below 720 pt window height the headline drops one size, so the button stays above the fold on an iPhone SE.
2. **Nome:** "Come ti chiami?", field focused on open, keyboard-aware, Enter submits. A "Piacere di conoscerti, X! 👋" card appears once the name is valid, plus a privacy line.
3. **Obiettivo:** "Cosa vuoi imparare?", two columns of interest cards (icon tile, topic, hint, checkbox). At least 1 is required, with a live counter.
4. **Livello:** Parto da zero / Conosco le basi / Investo già, single choice, with a reassuring note.
5. **Ritmo:** 5 / 10 / 15 min cards (10 tagged "Consigliato"), the "Attiva promemoria" switch and the same time picker as Settings.

- **Steps 2–5 share:** back button, a lime progress bar that fills from the previous step, an "n/4" counter, and a sticky "Continua" that stays disabled until the step is valid.
- **Tutto pronto:**
  - Confetti, the avatar popping in, and "Ciao **<nome>**, il tuo percorso è pronto".
  - Recap chips (minutes per day, level, number of interests, reminder time) and an "Il tuo primo percorso" card (course cover, title, "13 capitoli · Si parte da Inflazione").
  - "Inizia il percorso" (or "Vai alla Home" for a returning user) runs `completeOnboarding({name, interests, experience, goalMinutes})`, sets the email, notifications and reminder slot, plays a success haptic, then `router.dismissTo('/')`.

**Deviations from the video, and why** (visual or completeness only; no feature removed)
- **Icons:** the emoji menu icons are replaced by tinted Lucide tiles, and the Pro row by the custom GemIcon (art direction).
- **Referral card:** "Condividilo ad un amico" sits inside the card instead of under it, so it reads as one unit; the "n/3 invitati" chip is new.
- **Logout:** centred, as in the redlines; the video shows it left-aligned.
- **Progress bar:** it shows on the 4 question steps. The Welcome screen is a cover without a bar, a common first-run pattern; the 5 steps the brief asks for are all there.
- **Demo email:** onboarding has no sign-up, so a new profile gets `<nome>@finanz.app` instead of keeping Alberto's address.
- **Demo-only features:** reminders and "Lascia una recensione" are clearly marked demo. Real notifications would need `expo-notifications`, which is not installed.

**Requested changes to shared files** (integrator)
1. `src/components/navigation/global-overlays.tsx`: register `rate: RateAppSheet` and `redeem: RedeemCodeSheet` from `@/features/account`. Account opens them locally, so nothing breaks before this is done.
2. Optional, `@/components/ui`:
   - Promote `features/account/components/segmented-options.tsx`, which onboarding also uses, to a kit `SegmentedControl`.
   - Add a `titleLines` prop to `ListItem`: at 375 pt the longest purchase title is cut off ("Vite illimitate per 1 o…").
3. No store changes needed. The store already has `reminderSlot` / `setReminderSlot`, `redeemedCodes` / `markCodeRedeemed`, `appRating` / `setAppRating`, `completeOnboarding(answers)` and `resetStore()`.

**Imports from other features**
- `PopIn` from `@/features/rewards` (public barrel).
- `clearChatHistory` from `@/features/assistant/chat-store`, so Logout also wipes the Coach chats.

Main files:
- /Users/sami/Library/Application Support/Claude/scratch-workspaces/ff5c0b24-8b45-4a60-8168-828b5622921e/346a4904-d962-464e-a954-66c144faa0ee/scratch-2026-09-29-4e59a3/finanz/src/features/account/index.ts
- /Users/sami/Library/Application Support/Claude/scratch-workspaces/ff5c0b24-8b45-4a60-8168-828b5622921e/346a4904-d962-464e-a954-66c144faa0ee/scratch-2026-09-29-4e59a3/finanz/src/features/account/account-screen.tsx
- /Users/sami/Library/Application Support/Claude/scratch-workspaces/ff5c0b24-8b45-4a60-8168-828b5622921e/346a4904-d962-464e-a954-66c144faa0ee/scratch-2026-09-29-4e59a3/finanz/src/features/account/account-section-screen.tsx
- /Users/sami/Library/Application Support/Claude/scratch-workspaces/ff5c0b24-8b45-4a60-8168-828b5622921e/346a4904-d962-464e-a954-66c144faa0ee/scratch-2026-09-29-4e59a3/finanz/src/features/onboarding/index.ts
- /Users/sami/Library/Application Support/Claude/scratch-workspaces/ff5c0b24-8b45-4a60-8168-828b5622921e/346a4904-d962-464e-a954-66c144faa0ee/scratch-2026-09-29-4e59a3/finanz/src/features/onboarding/steps.ts
- /Users/sami/Library/Application Support/Claude/scratch-workspaces/ff5c0b24-8b45-4a60-8168-828b5622921e/346a4904-d962-464e-a954-66c144faa0ee/scratch-2026-09-29-4e59a3/finanz/src/features/onboarding/screens/welcome-screen.tsx
- /Users/sami/Library/Application Support/Claude/scratch-workspaces/ff5c0b24-8b45-4a60-8168-828b5622921e/346a4904-d962-464e-a954-66c144faa0ee/scratch-2026-09-29-4e59a3/finanz/src/features/onboarding/screens/ready-screen.tsx
