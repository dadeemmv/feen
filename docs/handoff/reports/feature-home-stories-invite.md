### feature-home-stories-invite

Home, the story viewer, Invite and the milestone reward reveal are done. `npx tsc --noEmit` shows 0 errors project-wide. `eslint` is clean on all my folders and on my 3 route files. The web bundle returns 200, includes all 28 story modules and has no "Unable to resolve" or SyntaxError payload. I checked everything in the browser at 390×844 and 375×667 (iPhone SE).

Picked up from the interrupted run. Home, Invite and Rewards were already written: I re-checked them and fixed one thing. The story viewer was still the placeholder, so I built it this run.

**Two things went wrong during browser testing, both affecting other agents:**
- **Another agent's tab was reloaded.** Between two of my calls the front browser tab switched to another agent's tab (tab-3, `/account/profile`). One of my scripts ran there: it set `lastReferralPromoOn = null` in the shared store and reloaded that tab. After that I passed my own tabId on every call.
- **I edited the shared saved store for testing, then put it back.** The app's saved state (`finanz-store` in localStorage) is shared by every tab on localhost:8081. To test milestones and the promo I set test values for `chapterRecords`, `session`, `claimedMilestones`, `shields` and `lastReferralPromoOn`, and I voted in the poll. Afterwards I reverted those fields one by one (records `{}`, session `null`, claimed `[]`, shields −1, poll vote removed). Other tabs save their own copy of the state whenever it changes, so a tab could still write some of those values back.

#### Story viewer (`/story/[id]`, `features/stories/**`)
- **Opening and flow:** opens on the group in the URL (`academy` or `app`) and then continues through the next groups. A group is marked seen in the store (`markStorySeen`) when it comes to the front. After the last page of the last group the viewer closes. An unknown id shows an `EmptyState` with "Torna alla Home".
- **Timer:**
  - One `SegmentedProgress` segment per page. The active segment fills over `pageDuration`, which is `duration.storySegment` stretched for text-heavy pages.
  - The timer pauses for any of these, tracked separately in `use-pause-reasons.ts`: a finger on the screen, poll interaction, the share sheet, a cube turn, the app in background, or a screen reader (native only).
- **Touch:**
  - A quick tap on the right ⅔ goes to the next page; the left ⅓ goes back. On the first page of a group, back turns the cube to the previous group; on the very first page it restarts the page.
  - Holding the page pauses it, and after 250 ms the header fades out.
  - A sideways swipe turns the cube to the next or previous group (rubber-band past the ends). A swipe down makes the story follow the finger, shrink and get rounded corners, and closes it past 20 % of the height or on a fast fling.
  - These gestures live on a layer behind the faces, so the cube transform never affects their coordinates.
  - For screen readers the page is an adjustable element with "Pagina successiva" / "Pagina precedente" actions.
- **Cube** (`lib/cube.ts`):
  - React Native has no `translateZ`, so each face hinges on the edge it shares with the next face.
  - With a perspective of (1+√½)·width, both faces exactly fill the screen at the half-way point.
  - Each face darkens as it turns away.
  - I checked the transform maths with a DOM copy at s = 0.25, 0.5 and 0.75.
  - Under reduced motion the groups cross-fade instead.
- **Header:**
  - Group avatar and title, then share and close buttons: white surface buttons on mint pages, glass on evergreen.
  - Share calls `shareText` with an Italian message per group.
  - Close calls `router.back()`, or goes to `/` when there is nothing to go back to.
  - The status bar is dark on mint pages and light on the evergreen App pages.
- **Academy page 1:**
  - "ACADEMY 📚" in display type (the biggest Bricolage size that fits the width).
  - Subtitle and body text.
  - A course poster: the `course-first-investment` cover on an evergreen card with a "✨ Nuovo percorso" tag and "IL TUO PRIMO INVESTIMENTO" in lime.
  - The tilted sticker "Che ti insegnerà…" lands with a bouncy pop on the poster's corner.
- **Academy page 2 (poll):**
  - Title "💞 AIUTACI A MIGLIORARE 💞", with each emoji kept on the same line as its word.
  - Live "Piccolo sondaggio" card with 4 radio options.
  - A vote saves to `pollAnswers[pollId]` with a success haptic, and the vote can be changed.
  - After voting, each option becomes a result bar that fills to its share (your own answer in lime with a check), the percentage counts up, and a "1.249 voti" chip appears.
  - The results are fixed demo numbers that include your vote and always add up to 100 %.
  - Touching the card pauses the timer; after a vote the page stays paused for about 2.7 s so the bars can be read.
  - The sticker "Un esempio di cosa NON devi farti sfuggire! 👆" lets taps through to the answer under it.
- **App pages (timeline):**
  - Evergreen gradient with a spotlight. Page 1 opens with "CHI SIAMO??" in lime, with the question marks tilted at different angles.
  - White cards zig-zag left and right (at most 86 % wide), with the emphasis words in extra-bold.
  - Emoji stickers pop onto the cards' inner corners; the "FZ" mark is drawn as the `FinanzLogo` tile.
  - A dashed path with rounded elbows joins the cards. As in the video it runs across pages: it enters from the left edge on pages 2–3 and leaves through the right edge on pages 1–2.
  - Cards rise in one after another.
- **Short screens:** pages never scroll. On short screens they switch to compact type and spacing, and shrink to fit if still too tall (never below 0.78 scale). All pages fit on an iPhone SE.

#### Home (`(tabs)/index`)
- **Top of the screen:** `ConnectedStatusHeader` (streak → `/streak`, lives → lives sheet, coins → Shop, avatar → `/account`). Then the greeting "Ciao {name} 👋" with a line that changes with the streak and course progress.
- **Stories row:** "Academy" 📚 and "App" 📱 circles; unseen stories have the gradient ring, seen ones a grey ring. Tapping opens `/story/academy` or `/story/app`.
- **Hero card:**
  - Evergreen card with a spotlight, the open-book illustration and twinkling sparkles.
  - The current chapter as an overline (e.g. "LIVELLO 1 · INFLAZIONE"), course progress "x/13 capitoli", and the "Continua il tuo viaggio!" button with shimmer and glow, which opens the course.
  - A "Riprendi: <capitolo>" pill appears when a lesson is in progress.
  - **Fixed this run:** on iPhone SE the button sat partly behind the tab bar (bottom at 601 pt, tab bar top at 587 pt). The compact illustration is now smaller and the button bottom is at 577 pt.
- **Traguardi:**
  - Exactly 3 cards across with no overflow at 375 pt (checked in the DOM).
  - **Locked:** muted reward icon with a padlock, "Sblocca dopo n lezioni" and a progress row.
  - **Reached:** accent card with a "Riscatta" pill and a gentle pulse.
  - **Claimed:** check badge and "Riscattato".
  - Tapping a card always opens the reward dialog (`features/rewards`):
    - **Reached:** the reward pops in with confetti; "Riscatta premio" calls `claimMilestone` and celebrates again. Checked: shields went 0 → 1 and the milestone id was saved.
    - **Locked:** preview with lessons still needed and a button that goes to the course.
    - **Already claimed:** a short recap.
- **Referral promo:** the `ReferralSheet` opens on the first Home focus in each app launch. It is skipped if it was already shown today, if another sheet is open, or once 3 friends are invited. "Condividilo ad un amico" closes the sheet and then opens `/invite` (checked).

#### Invite (`/invite`) and ReferralSheet
- **Invite screen:**
  - Back button, "Invita un amico" and the body text.
  - Evergreen card with a band of kiwi slices and "IL TUO CODICE" in lime.
  - Code field `ZGGK2O`: tapping copies it, shows the "Codice copiato" toast and swaps the icon to a check for 2 s (checked).
  - "Condividi codice" uses `shareText` (clipboard fallback on web).
  - "Come funziona" in 3 steps.
  - "I tuoi inviti": 3 friend slots counting 0/3, then the reward row "30 giorni di Finanz Pro". It only reflects the real `invitedFriends` count; there is no simulate button.
- **`ReferralSheet({visible, onClose})`:** brand card with "30 giorni di Finanz Pro", the envelopes illustration, the friend slots and "X/3 amici invitati", plus "Condividilo ad un amico" and "Più tardi".

#### Deviations from the video (visual only, no feature removed)
- **Story visuals:** the poster is the course illustration instead of a grey photo; the App pages use a gradient with a spotlight instead of flat green; the header buttons are surface or glass circles.
- **Poll extras:** the poll shows results after voting, which the video doesn't.
- **Added viewer behaviour:** the usual Instagram gestures (hold to pause and hide the header, swipe sideways between groups, swipe down to close) and screen-reader support.
- **Copy:** text comes from `@/content` as written, e.g. "CHI SIAMO??" without the space.

#### Changes requested in shared files
1. **`components/navigation/global-overlays.tsx`:** register `ReferralSheet` from `@/features/invite/referral-sheet` as the `referral` overlay (it takes `{ visible, onClose }`). Home already renders its own copy.
2. **For the kit docs (no code change needed in my folders):**
   - **`box-none` on web:** on web, `pointerEvents: 'box-none'` doesn't work on Reanimated `Animated.View`s, because Reanimated passes styles inline and react-native-web only supports `box-none` through StyleSheet classes. I worked around it in `stories/lib/pass-through.ts`; COMPONENTS.md could mention it.
   - **Screen reader on web:** react-native-web's `AccessibilityInfo.isScreenReaderEnabled()` always returns true, so any feature that branches on it should be native-only.
3. **Optional token:** a display size between 40 and 64 (e.g. 52/52) would let "ACADEMY" and "CHI SIAMO??" fill more of the width; today they use `displayLg`.
No npm packages or theme tokens were added.

#### Not verified
- **Animation timing:** the browser pane was hidden, so animation frames ran at about 3 per second and later stopped entirely. Layouts, hit-testing, store writes, navigation and timer logic are verified. Still to check on a device or a visible browser: how the cube turn, sticker pops, reveal stagger, poll bar fill and segment fill actually look in motion, plus the hold-to-pause header fade.
- **Native gestures:** the swipe-down close was checked with a mouse on web; the swipe and tap gestures are untested on native.

#### Files (under `src/features/`)
- **stories (built this run):**
  - `story-screen.tsx`, `copy.ts`, `metrics.ts`
  - `components/`: `story-viewer.tsx`, `story-face.tsx`, `story-chrome.tsx`, `story-background.tsx`, `fit-to-height.tsx`, `display-title.tsx`, `sticker.tsx`, `reveal.tsx`
  - `components/pages/`: `academy-intro-page.tsx`, `course-poster.tsx`, `poll-page.tsx`, `poll-card.tsx`, `poll-option.tsx`, `timeline-page.tsx`, `timeline-card.tsx`, `timeline-path.tsx`
  - `lib/`: `cube.ts`, `use-story-timer.ts`, `use-story-gesture.ts`, `use-pause-reasons.ts`, `use-sticker-pop.ts`, `pass-through.ts`, `display-fit.ts` (now keeps an emoji on the same line as its word), `poll-results.ts`, `story-pages.ts`
- **home (from the interrupted run, re-checked; `metrics.ts` changed this run):** `home-screen.tsx`, `copy.ts`, `metrics.ts`, `lib/use-home-layout.ts`, `lib/use-referral-promo.ts`, `components/{greeting,stories-row,hero-card,hero-sparkles,milestones-section,milestone-card}.tsx`
- **invite (from the interrupted run, re-checked):** `invite-screen.tsx`, `referral-sheet.tsx`, `copy.ts`, `metrics.ts`, `components/{code-card,how-it-works,invite-progress-card,friend-slots}.tsx`
- **rewards (from the interrupted run, re-checked):** `index.ts`, `reward-dialog.tsx`, `reward-icon.tsx`, `pop-in.tsx`, `copy.ts`
- **Routes (thin re-exports, unchanged):** `src/app/(tabs)/index.tsx`, `src/app/story/[id].tsx`, `src/app/invite.tsx`
