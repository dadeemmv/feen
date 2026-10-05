### feature-lesson (lesson player)

The lesson player is done and works end to end. `/lesson/[id]` now plays any of the 13 chapters from the first step to the completion screen, with lives, resume, practice mode, explanations, exit and report, plus error and locked states.

**Checks**
- `npx tsc --noEmit`: 0 errors project-wide.
- `npx eslint src/features/lesson src/app/lesson`: clean.
- Web smoke test: `/` returns 200, and the entry bundle returns 200 (14.5 MB) with no "Unable to resolve" or SyntaxError payload. All lesson modules are in the bundle.
- **Machine test (scratchpad):** all 13 real lessons play through `transition()` to `COMPLETED`, with wrong answers on every graded step. Each lesson loses exactly one life per graded step even after repeated wrong answers, saves progress on every NEXT, and keeps the correct leading phrases of an order step after "Chiudi". Run it with `node --import ./register.mjs machine.test.ts` from `scratchpad/lesson-qa/unit`.
- **Visual check:** the Browser pane was hidden, so screenshots timed out there. Instead I drove headless Chrome through CDP (`scratchpad/lesson-qa/cdp.mjs` with scenarios `s1`–`s8`) at 390×844 and 375×667 (iPhone SE). It seeds the store in localStorage, clicks through the flows and captures screenshots; the result images are in `scratchpad/lesson-qa/strip-*.png`.
  - Flows covered: choice (idle, selected, wrong, faded option, correct), info, definition, true/false wrong, the explain sheet (typing dots, typed answer, follow-up, suggestion chips, hint and concept modes), fill, match (wrong pair and numbered pairs), order (wrong, then correct phrases kept), exit dialog via ✕ and via Escape, report sheet and its thank-you toast, practice mode, out-of-lives banner, error, locked, completion and "Rivedi le risposte".
  - The resulting store state was checked: coins, XP, the day added to the streak, and the session cleared after completion.
- **Not checked:** iOS/Android devices, real haptics, Android hardware back, and animation timing on a device.

**Files** (`src/features/lesson/`; route `src/app/lesson/[id].tsx` re-exports `LessonScreen`)
- **Created this run:**
  - `lesson-screen.tsx`: the route guard. Unknown id or missing content shows the error state; a locked chapter shows the locked state (dev builds also get an "Apri comunque (dev)" button). Otherwise it mounts the player, keyed by chapter.
  - `lesson-player.tsx`: wires everything together.
  - `components/lesson-footer.tsx`, `components/lesson-state-screen.tsx`.
  - `completion/completion-screen.tsx`, `completion/completion-hero.tsx`, `completion/review-sheet.tsx`.
- **Kept from the interrupted run and improved:**
  - `machine.ts`: the exported API is unchanged. RETRY on an order step now keeps the correct leading phrases instead of resetting everything.
  - `ai-fab.tsx`: fixed a type error.
  - `match-step.tsx`: matched pairs get a numbered corner badge.
  - `order-step.tsx`, `step-layout.tsx`, `metrics.ts`: smaller layout on short screens.
  - `explain/*`: suggestion chips, no repeated replies, the tiny orb avatar is fixed, and a stray "*" after bold text is gone.
  - `use-lesson-controller.ts`: the "wrong pair" toast now appears after the lives chip has animated.
  - `use-lesson-overlays.ts`: the share-failed toast, and the review sheet state lives here so Escape/back closes it first.
  - `copy.ts`.
- **Kept unchanged:** `machine.types.ts`, `feedback.ts`, `lib/arrange.ts`, the `steps/*` registry with all 7 step types, `option-tile`, `lesson-header`, `feedback-dialogs`, `exit-dialog`, `report-sheet`, `out-of-lives-banner`, `step-stage`, `explain-sheet`, and `completion/{reward-tiles,streak-moment,next-up-cards,use-tween}`.
- `machine.ts` is 355 lines: it is the pure engine, so I left it in one file.

**Per screen and state**
- **Header:** ✕ (exit dialog), ⚑ (report sheet) and share on the left. On the right, a lives chip that knows about unlimited lives and bumps and shakes when a life is lost, and a coins chip. The coins chip shows a "Hai N Kiwi" toast instead of leaving the lesson. Below sits the evergreen progress bar, `(index + answered) / steps`, plus a "Ripasso" tag in practice mode.
- **Steps:**
  - **Card and transitions:** graded steps sit in a white card that fills the height and scrolls on short screens; info and definition steps are full-bleed. Steps slide in horizontally, keyed by `step.id`, using duration and easing (a cross-fade under reduced motion).
  - **Choice:** `OptionTile` with idle, selected, wrong (shake), disabled (faded and struck through) and correct states.
  - **True/false:** ✓ Vero / ✕ Falso tiles with icon discs.
  - **Info:** rows that fade up while their emoji pops in, staggered.
  - **Definition:** a tinted box with an accent bar.
  - **Match:** tap one tile on each side. A right pair flashes green, then locks with a pair number; a wrong pair turns both tiles red, shakes them and costs at most one life for the step.
  - **Order:** tap-to-place slots with a layout reflow. After a wrong check, each slot shows green or red.
  - **Fill:** an inline blank chip that fills with the chosen word.
- **Footer:** one "Continua" button. It is disabled and pale until the answer is complete. On graded steps it checks the answer; on info steps it moves on.
- **Feedback dialogs:** bottom-anchored with the badge overlapping the top edge, and the matching haptic.
  - **Correct:** the praise rotates, starting with the video's line, plus a hint chip: "Al primo colpo", "N risposte giuste di fila" or "Ce l'hai fatta!".
  - **Wrong:** "Ops, la tua risposta non è quella giusta.", a lives note ("Hai perso una vita · ne restano N", or no life lost in practice, with unlimited lives, or on a repeat mistake), the red "Chiudi" button and a "Spiegami il perché ✨" shortcut.
  - **After a wrong answer:** the chosen option is disabled and the AI button expands into the "Spiegami il perché ✨" pill.
- **Explain sheet:** opens with the learner's bubble ("Spiegami perché ho sbagliato" after a mistake, "Spiegami meglio questo passaggio" otherwise), shows typing dots for about 1.2 s, then types the answer out (tap to reveal it at once).
  - The answer comes from `getAssistantReply` with the step context. If that fails, it falls back to local `explainMistake` / `explainStep`.
  - On a graded step that hasn't been answered yet, the reply is a hint that does not give the answer away.
  - Suggestion chips: "Spiegamelo più semplice", "Fammi un esempio", and "Qual è la risposta giusta?" in hint mode only.
  - A follow-up box for typed questions, and a disclaimer.
  - The conversation is kept per step and mode, and the lesson is paused while the sheet is open.
- **Exit:** a dialog with the 🥺 badge, "Continua a studiare" or "Esci". Esci saves progress and goes back once the dialog has closed. Android back and web Escape also open the dialog, but never while another overlay is open.
- **Resume, practice, out of lives:**
  - **Resume:** a saved session goes back to its step, lost lives and mistakes, with a "Bentornato!" toast.
  - **Practice:** opening a completed chapter starts a replay: no lives at stake, half the XP, no coins, but the day still counts for the streak.
  - **Out of lives:** at 0 lives without unlimited lives, opening the lesson or pressing Continua on a graded step opens `openSheet('out-of-lives')` without grading. An inline banner shows the countdown to the next life and a "Ricarica" button.
- **Completion:**
  - A brand-coloured full screen with confetti and a lime medal carrying the chapter emoji (trophies for the last chapter of the course).
  - "Capitolo completato!" on first completion, "Lezione completata!" on a replay, followed by the chapter name.
  - Counters for XP, Kiwi and Precisione (with a ring).
  - The streak moment: "Giorno N di fila!" with the flame popping in, or a calm "Serie di N giorni" if you already studied today.
  - Cards for the milestone reached, the next chapter unlocked, or the course completed.
  - "Continua" goes back to the path. "Rivedi le risposte" opens a sheet with every question, its outcome (first try or after a mistake) and the correct answer.
  - `completeChapter` runs exactly once, guarded by a ref, when the last step is passed.
- **Error and locked states:** a friendly empty state with a way back to the path. There is no loading state, because the root already waits for the store to hydrate.

**Deviations from the video (visual only, no feature removed)**
- Copy is "perché", not "perchè", and "una lezione", not "un lezione".
- Hearts are rose instead of green, following the design direction.
- The secondary "Esci" is an outline button, as in the video.
- Added on top of the video: a lives note in the wrong dialog, a "Spiegami il perché" shortcut inside the wrong dialog, praise chips, pair numbers on match steps, an order retry that keeps correct phrases, and suggestion chips in the explain sheet.

**Requested changes to shared files (I did not touch them)**
1. `src/components/navigation/global-overlays.tsx`: register `out-of-lives` (and `lives`) from `@/features/lives`. Until then, the lesson's `openSheet('out-of-lives')` only shows the dev toast "Sheet ... non ancora collegato", although the inline banner works.
2. **iOS check needed:** confirm that the global Sheets (RN `Modal`, rendered by the root layout) appear above the lesson's `fullScreenModal`. If they don't, the lesson should render `OutOfLivesSheet` and `LivesSheet` itself.
3. Assistant engine (optional): "Fammi un esempio" and other weak intents with a lesson context return the same text as the first explanation. The lesson works around this: a repeated reply is swapped for a knowledge-base topic card or a simpler version.
4. No new packages and no token additions were needed.
