# Finanz — Architecture & design-system decisions

All structural decisions are grounded in public repositories (verified during research, Sep 2026).
Where the product needs something those repos don't cover, the choice is noted as a design decision.

## 1. References

| Pattern adopted | Source |
|---|---|
| `src/app` routes + `@/*` alias, typed routes, React Compiler (SDK 57 template) | expo/expo `templates/expo-template-default` (sdk-57) |
| Tabs nested in a root Stack; detail screens pushed on the root stack above the tab bar; `unstable_settings.anchor` | expo/expo `docs/pages/router/basics/common-navigation-patterns.mdx`, `docs/pages/router/advanced/modals.mdx` |
| Thin route files that re-export feature screens; `src/features/<feature>` | obytes/react-native-template-obytes `src/app/**`, `src/features/**` |
| Theme folder (palette → semantic colours, spacing t-shirt scale, typography with `customFontsToLoad`, timing), preset-typed components (Text/Button/Screen/Card/ListItem/Icon), hydration + font gate in root layout | infinitered/ignite `boilerplate/app/theme/*`, `boilerplate/app/components/*`, `boilerplate/src/app/_layout.tsx` |
| Theme keys (`colors`, `spacing`, `borderRadii`, `textVariants`, variants) | Shopify/restyle `src/types.ts`, `fixture/theme.ts` |
| 12-step colour scales and their jobs; brand scale added next to Radix scales | radix-ui/colors `src/light.ts`; radix-ui/website `understanding-the-scale.mdx`, `aliasing.mdx` |
| Contextual colour mode for inverted surfaces; two-layer shadows | rainbow-me/rainbow `src/design-system/color/ColorMode.tsx`, `layout/shadow.ts` |
| Primitive vs semantic typography; "do not import palette" rule | Expensify/App `src/styles/typography.ts`, `src/styles/theme/colors.ts` |
| cva-shaped variants (`sv()`) | joe-bell/cva `packages/class-variance-authority/src/index.ts` |
| Custom JS tab bar via `tabBar` prop | bluesky-social/social-app `src/Navigation.tsx`, `src/view/shell/bottom-bar/BottomBar.tsx` |
| PressableScale, haptics wrapper (no-op on web) | bluesky-social/social-app `src/lib/custom-animations/PressableScale.tsx`, `src/lib/haptics.ts` |
| Motion token module, shimmer sweep with expo-linear-gradient | rainbow-me/rainbow `src/components/animations/animationConfigs.ts`, `ShimmerAnimation.tsx` |
| Custom Reanimated bottom sheet (instead of @gorhom/bottom-sheet, whose Reanimated 4 PR #2727 is unmerged and has open web bugs), vaul curve | software-mansion/react-native-reanimated `docs/.../static/examples/BottomSheet.js`; emilkowalski/vaul `src/constants.ts` |
| Typing indicator dots | FaridSafi/react-native-gifted-chat `src/TypingIndicator/index.tsx` |
| Story viewer: segmented progress, tap zones, cube transition | birdwingo/react-native-instagram-stories `src/components/Animation/index.tsx`, `Progress/item.tsx` |
| Zustand store from slices + `persist(createJSONStorage(() => AsyncStorage))`, versioned | infinitered/ignite-cookbook `docs/recipes/Zustand.md`; pmndrs/zustand `persisting-store-data.md`; bryanjenningz/react-duolingo `src/hooks/useBoundStore.ts` |
| Streak derived from active-day list (not a counter) | bryanjenningz/react-duolingo `src/stores/createStreakStore.ts` |
| Lesson state machine: one primary button grades / retries / advances; step registry by discriminated union | sanidhyy/duolingo-clone `app/lesson/quiz.tsx`; ikyawthetpaing/euolingo `components/exercise/items/exercise-items.tsx` |
| Hearts rule: no loss in practice/subscription; tiny modal stores (exit/hearts) | sanidhyy/duolingo-clone `actions/user-progress.ts`, `store/use-exit-modal.ts` |
| Feedback panel entering/exiting, option shake/pulse | mazkev/duolingo-clone-react-native `components/FeedbackSheet.tsx`; DareDev256/buildright `app/lesson/[lessonId].tsx` |
| Zig-zag path via offset lookup tables, absolute node layout for connectors | DareDev256/buildright `app/learn/[moduleId].tsx`; sanidhyy `app/(main)/learn/lesson-button.tsx` |
| Word-bank ordering (tap-to-place) | mazkev `app/lesson.tsx`; wcandillon/can-it-be-done-in-react-native `season4/src/Duolingo` (drag version, reference) |

Design decisions (not from repos): fonts (Bricolage Grotesque + Plus Jakarta Sans), the custom
`forest` brand scale, light-only app with `brand` colour mode for inverted surfaces, economy icons.

## 2. Folder structure

```
src/
  app/                    ROUTES ONLY (thin files re-exporting feature screens)
  features/<feature>/     screens + feature components + hooks + pure logic
    home/  stories/  academy/  course/  lesson/  streak/  shop/  lives/
    account/  invite/  pro/  assistant/  onboarding/  rewards/
  components/
    ui/                   design-system primitives (Text, Button, Card, Chip, Sheet, Dialog…)
    icons/                custom SVG economy icons (Flame, Heart, KiwiCoin, Shield, Gem…)
    illustrations/        custom SVG illustrations keyed by IllustrationKey
    navigation/           FloatingTabBar, StatusHeader
  theme/                  tokens + theme runtime (palette is private)
  store/                  zustand root store (slices) + selectors + ui (non-persisted) store
  content/                typed static content: courses, lessons, stories, shop, assistant KB
  lib/                    haptics, dates, share, format, clipboard, random helpers
```

## 3. Route map (`src/app`)

```
_layout.tsx               fonts + store hydration gate, GestureHandlerRootView, SafeAreaProvider,
                          root <Stack headerShown:false>, <GlobalOverlays/> (sheets, toasts)
+html.tsx                 web: ScrollViewStyleReset, viewport-fit=cover, body background
+not-found.tsx
(tabs)/_layout.tsx        <Tabs> from 'expo-router/js-tabs' with tabBar={FloatingTabBar}, lazy
(tabs)/index.tsx          Home
(tabs)/academy.tsx        Academy
(tabs)/assistant.tsx      AI assistant
(tabs)/shop.tsx           Shop
course/[id].tsx           learning path (card push)
streak.tsx                streak screen (card push)
account/index.tsx         account (card push) + account/[section].tsx for sub-pages
invite.tsx                invite a friend (card push)
pro.tsx                   Finanz Pro paywall (modal)
lesson/[id].tsx           lesson player (fullScreenModal, gestureEnabled:false)
story/[id].tsx            story viewer (fullScreenModal, animation fade)
onboarding/_layout.tsx + onboarding/*.tsx    first-run flow (Stack), redirected to from root
```
Root layout exports `unstable_settings = { anchor: '(tabs)' }`.
Sheets and dialogs are **not routes**: Lives sheet, Referral promo, Out-of-lives, Rate app,
Redeem code are opened through the non-persisted `useUi` store and rendered by
`<GlobalOverlays/>`. Lesson-internal overlays (answer feedback, exit confirm, "Spiegami il
perchè" chat, completion) are phases of the lesson screen's own state.

## 4. State

One persisted zustand store (`src/store/index.ts`) assembled from slices, `persist` with
`createJSONStorage(() => AsyncStorage)`, `name: 'finanz-store'`, `version` + `migrate`,
`partialize` (actions excluded), `onRehydrateStorage` → `_hasHydrated`.

Slices (each `StateCreator<RootState, [], [], Slice>`):
- **profile**: `name, email, avatar, interests[], goalMinutes, experience, onboardingDone,
  referralCode, invitedFriends, language`.
- **economy**: `coins, lives, maxLives (3), lastLifeAt (refill clock), unlimitedUntil, proUntil,
  shields, purchases[]`; actions `spend(n): boolean` (atomic check+deduct), `earn(n)`,
  `loseLife()`, `addLives(n)`, `refillTick(now)`, `activateUnlimited(minutes)`, `buy(item)`.
  Lives refill 1 per 2 h while below max (derived from `lastLifeAt`).
- **progress**: `chapterRecords: Record<chapterId, {completedAt, accuracy, xp}>`,
  `session: {chapterId, stepIndex, lostLifeStepIds[]} | null` (resume = "RIPRENDI DA QUI"),
  `activeDays: string[]` ('YYYY-MM-DD'), `xp`, `claimedMilestones[]`.
- **meta**: `seenStories[]`, `pollAnswers`, `dailyRewardClaimedOn`, `lastReferralPromoOn`,
  `settings {haptics, sound, reduceMotion, notifications}`.

Derived selectors (never stored): `streakCount` (walk back from today over `activeDays`, a
shield covers one missing day), `lessonsCompleted`, `currentChapter(courseId)`, `nodeStatus`,
`milestoneProgress`, `livesWithRefill(now)`, `isUnlimited(now)`, `userLevel(xp)`.
Rewards are committed only when the user confirms the completion screen.

## 5. Design tokens (`src/theme`)
See the token files — they are the source of truth:
`tokens/palette.ts` (Radix scales + custom `forest` + economy colours, PRIVATE),
`tokens/colors.ts` (semantic `lightColors` / `brandColors` + gradients + illustration colours),
`tokens/spacing.ts`, `tokens/radius.ts`, `tokens/typography.ts` (fonts + textVariants),
`tokens/elevation.ts` (boxShadow strings), `tokens/motion.ts` (durations, bezier easings, springs,
press scales), `tokens/layout.ts` (gutters, tab bar, touch targets, max width).
Runtime: `useTheme()` (nearest colour mode), `ColorModeProvider`, `createStyles()`, `sv()`.

## 6. Component inventory (`src/components/ui`)
Text (variant/color/align/weight/numberOfLines, the only file allowed to import RN Text) ·
PressableScale · Button (primary | brand | secondary | outline | ghost | danger; sm | md | lg;
loading, disabled, iconLeft/Right, shimmer, fullWidth) · IconButton (plain | surface | brand) ·
Card (surface | elevated | brand | accent | locked | outline; padding) · Chip / StatChip
(streak | lives | coins with animated bump) · Tag (overline pill with emoji) · ProgressBar
(animated, sizes, tones) · Divider · ListItem / MenuRow (icon tile, title, subtitle, chevron) ·
Avatar · SectionHeader · Screen (fixed | scroll, safe-area edges, tab-bar inset, keyboard) ·
Sheet (custom Reanimated bottom sheet with grabber, drag-to-dismiss, scrim) · Dialog (centred
card with overlapping icon badge) · Toast · TypingDots · Shimmer · Confetti (Reanimated particle
burst) · EmptyState · Skeleton · Badge (count dot) · Radio · TextField · SegmentedProgress.

## 7. Lesson engine (`src/features/lesson/machine.ts`)
Pure reducer. State `{ index, phase: 'idle'|'selected'|'feedback-correct'|'feedback-wrong'|'completed',
answer, disabledOptionIds[], lostLifeStepIds[], results[] }`. Events `SELECT`, `CHECK`, `RETRY`
(wrong option added to `disabledOptionIds`, as in the video), `NEXT`, `RESTORE`. Info/definition
steps are always "answered" (Continua enabled). A wrong CHECK costs one life only if the step is
not already in `lostLifeStepIds` and the user is not unlimited/Pro and the chapter is not
already completed (practice). If lives are 0 when CHECK is pressed → Out-of-lives sheet.
Every NEXT persists `{chapterId, stepIndex}` so exiting shows "RIPRENDI DA QUI".
Completion commits xp, coins, activeDay (streak), chapter record.

## 8. Motion
Tokens in `tokens/motion.ts`. Use `.duration().easing()` for layout animations (web ignores
springify). Springs only in `withSpring` (runs on web in JS). Respect `useReducedMotion()`.
Signature moments: CTA shimmer, chip bump, progress fill, feedback icon pop + haptic, wrong shake,
completion confetti + counters, node unlock pulse, story segments + cube, typing dots + typewriter,
breathing orb, tab pill slide.
