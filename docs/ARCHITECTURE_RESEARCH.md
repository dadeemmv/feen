# Finanz: Architecture & Design System Decisions (v1)

Status: **decided** · 2026-09-29 · Inputs: `PRODUCT_SPEC.md` (features, flows, copy), `DESIGN_DIRECTION.md` (visual language), 4 research sweeps.
Where a research finding conflicts with the art direction, the art direction wins on visuals and this document wins on engineering.

**Baseline.** The baseline is the stack already in the repo: Expo SDK 57 (`expo ~57.0.26`), RN 0.86.3 (New Architecture only), React 19.2.3 with React Compiler, TypeScript 6, `expo-router ~57.0.24` (React Navigation is vendored), Reanimated 4.5.1 with worklets 0.10.1, RNGH ~2.32, react-native-web ~0.21, zustand 5 and AsyncStorage 2.2.
**Hard rules**
1. Every library must be included in Expo Go.
2. Everything must run on web.
3. Files are kebab-case.
4. `src/app` contains routes only.
5. Screens use tokens and `@/components/ui` primitives only.

**New dev dependencies:** `jest-expo` and `jest`, for testing the domain rules and the lesson engine. No i18next: v1 is Italian-only, so copy lives in typed `copy.ts` files (see §2).

---

## 1. References

Only sources verified in the research sweeps are listed. The code in this document is adapted from them, not copied.

| # | Adopted pattern | Repo | Path |
|---|---|---|---|
| 1 | Root layout: keep the splash until fonts and store are ready; providers wrap the root navigator | infinitered/ignite | `boilerplate/src/app/_layout.tsx` |
| 2 | Route files are one-line re-exports; feature folders; `ui` barrel | obytes/react-native-template-obytes | `src/app/**` (e.g. `src/app/(app)/index.tsx`, `src/app/feed/[id].tsx`), `src/features/**`, `src/components/ui/index.tsx` |
| 3 | Tabs group layout `<Redirect>`s to `/onboarding` | obytes/react-native-template-obytes | `src/app/(app)/_layout.tsx` |
| 4 | Web root HTML with `ScrollViewStyleReset`, `viewport-fit=cover`, inline body background | obytes/react-native-template-obytes | `src/app/+html.tsx` |
| 5 | Tabs nested in a root Stack; `unstable_settings.anchor` | expo/expo | `templates/expo-template-default` (sdk-54) `app/_layout.tsx`, `app/(tabs)/_layout.tsx` |
| 6 | Detail screens pushed on the root stack, above the tab bar | expo/expo | `docs/pages/router/basics/common-navigation-patterns.mdx` |
| 7 | Presentation values; web dismiss fallback `canGoBack() ? back() : replace('/')`; web modals are alpha in SDK 57 | expo/expo | `docs/pages/router/advanced/modals.mdx`, `docs/pages/router/advanced/web-modals.mdx` (sdk-57) |
| 8 | Typed routes, object hrefs, typed `useLocalSearchParams` | expo/expo | `docs/pages/router/reference/typed-routes.mdx` |
| 9 | Pinned SDK 57 versions | expo/expo | `packages/expo/bundledNativeModules.json` (sdk-57) |
| 10 | Custom `tabBar` component (map `state.routes`, emit `tabPress`, then navigate) | bluesky-social/social-app | `src/Navigation.tsx`, `src/view/shell/bottom-bar/BottomBar.tsx` |
| 11 | One persisted root store built from slices; `_hasHydrated` gate | infinitered/ignite-cookbook | `docs/recipes/Zustand.md` |
| 12 | persist: `partialize`, `version`/`migrate`, `merge`, `skipHydration`, `rehydrate()`, `clearStorage()` | pmndrs/zustand | `docs/reference/integrations/persisting-store-data.md` |
| 13 | Validate rehydrated ids and fall back to defaults | ikyawthetpaing/euolingo | `context/course.tsx` |
| 14 | Streak derived by walking an active-day list; XP by date | bryanjenningz/react-duolingo | `src/stores/createStreakStore.ts`, `src/stores/createXpStore.ts` |
| 15 | `spend(n): boolean` checks and deducts in one step | mazkev/duolingo-clone-react-native | `store/useGameStore.ts` |
| 16 | No heart loss in practice or with a subscription | sanidhyy/duolingo-clone | `actions/user-progress.ts` |
| 17 | Idempotent completion records | DareDev256/buildright | `src/stores/useProgressStore.ts` |
| 18 | One primary button that grades, retries or advances; resume at the first unfinished step | sanidhyy/duolingo-clone | `app/lesson/quiz.tsx` |
| 19 | Footer label follows status; Enter key triggers it on web | sanidhyy/duolingo-clone | `app/lesson/footer.tsx` |
| 20 | Tiny zustand store for global modals | sanidhyy/duolingo-clone | `store/use-exit-modal.ts` |
| 21 | Step registry keyed by a discriminated union; one item contract for every step | ikyawthetpaing/euolingo | `types/course.d.ts`, `components/exercise/items/exercise-items.tsx` |
| 22 | Level banners; node status from a progress pointer | ikyawthetpaing/euolingo | `app/(course)/learn.tsx` |
| 23 | Feedback panel mounted by phase, with entering/exiting animations | mazkev/duolingo-clone-react-native | `components/FeedbackSheet.tsx` |
| 24 | Wrong-answer shake and correct-answer pulse | DareDev256/buildright | `app/lesson/[lessonId].tsx` |
| 25 | Absolute path layout, connectors between node centers, staggered node entrance | DareDev256/buildright | `app/learn/[moduleId].tsx` |
| 26 | Lesson stats (XP, time, accuracy) calculated at completion | bryanjenningz/react-duolingo | `src/pages/lesson.tsx` |
| 27 | Private palette mapped to semantic keys; `ThemedStyle<T>` + `themed()`; `useAppTheme()` | infinitered/ignite | `boilerplate/app/theme/{colors,theme,types,context}.ts(x)` |
| 28 | Preset components (Text, Button, Screen, Card, ListItem, Icon registry); safe-area inset hook | infinitered/ignite | `boilerplate/app/components/{Text,Button,Screen,Card,ListItem,Icon}.tsx`, `boilerplate/app/utils/useSafeAreaInsetsStyle.ts` |
| 29 | Semantic role names over the palette | Shopify/restyle | `documentation/docs/fundamentals/colors.md` |
| 30 | 12-step scale roles; use-case aliases | radix-ui/website | `data/colors/docs/palette-composition/understanding-the-scale.mdx`, `data/colors/docs/overview/aliasing.mdx` |
| 31 | `satisfies` semantic color type; components never import the palette; two-layer typography with capped font scaling | Expensify/App | `src/styles/theme/types.ts`, `src/styles/theme/colors.ts`, `src/styles/typography.ts`, `src/styles/variables.ts` |
| 32 | Contextual color mode for inverted (brand) surfaces; two-layer shadows | rainbow-me/rainbow | `src/design-system/color/ColorMode.tsx`, `src/design-system/components/Box/Box.tsx`, `src/design-system/layout/shadow.ts` |
| 33 | One `boxShadow` token for web and native | necolas/react-native-web | `packages/react-native-web/src/exports/StyleSheet/preprocess.js` |
| 34 | Variant API shape: `variants` / `compoundVariants` / `defaultVariants` | joe-bell/cva | `packages/class-variance-authority/src/index.ts` |
| 35 | Type sizes and leading (iOS Large default) | Apple HIG | `developer.apple.com/design/human-interface-guidelines/typography` |
| 36 | Spring presets; layout animations on web need `.duration().easing(bezier)`; CSS transitions/animations; `scheduleOnRN` | software-mansion/react-native-reanimated | `packages/react-native-reanimated/src/animation/spring/springConfigs.ts`, `docs/docs-reanimated/docs/layout-animations/entering-exiting-animations.mdx`, `docs/docs-reanimated/docs/css-transitions/overview.mdx`, `docs/docs-reanimated/docs/guides/migration-from-3.x.md` |
| 37 | Sheet mechanics: measured height drives `translateY` and backdrop opacity | software-mansion/react-native-reanimated | `docs/docs-reanimated/static/examples/BottomSheet.js` |
| 38 | Sheet easing curve and dismiss thresholds | emilkowalski/vaul | `src/constants.ts` |
| 39 | RN `Modal` on web gives a portal, focus trap and Escape-to-close | necolas/react-native-web | `packages/react-native-web/src/exports/Modal/ModalContent.js` |
| 40 | PressableScale; haptics wrapper (off on web and when disabled in settings); dialog zoom-fade | bluesky-social/social-app | `src/lib/custom-animations/PressableScale.tsx`, `src/lib/haptics.ts`, `src/components/Dialog/index.web.tsx`, `src/alf/atoms.ts` |
| 41 | Shape of the motion-token module; sheet spring; shimmer sweep | rainbow-me/rainbow | `src/components/animations/animationConfigs.ts`, `src/components/animations/ShimmerAnimation.tsx` |
| 42 | List-row press dim | Expensify/App | `src/components/OpacityView.tsx` |
| 43 | Typing dots | FaridSafi/react-native-gifted-chat | `src/TypingIndicator/index.tsx` |
| 44 | Story segments; timer pause/resume; tap zones; long-press | birdwingo/react-native-instagram-stories | `src/components/Progress/item.tsx`, `src/components/Animation/index.tsx` |
| 45 | Cube page transform pivoting on the shared edge | SimformSolutionsPvtLtd/react-native-story-view | `src/components/MultiStoryContainer/utils/StoryTransitions.ts` |
| 46 | Haptics API and web behavior | expo/expo | `packages/expo-haptics/src/Haptics.ts`, `packages/expo-haptics/src/ExpoHaptics.web.ts` |

Rejected: `@gorhom/bottom-sheet` (see §8), Expo Router `formSheet` for sheets, NativeTabs, headless `expo-router/ui` tabs (experimental), TrueSheet (needs a dev build), Skia confetti (web setup cost), Lottie, i18next, moti, and Obytes `createSelectors`, which does not fit nested slice state.

---

## 2. Folder structure

```
finanz/
├─ app.json              typedRoutes + reactCompiler; web.output "static"; scheme "finanz"
├─ tsconfig.json         strict; @/* → src/*, @/assets/* → assets/*
├─ eslint.config.js      import bans (§6.0)
├─ jest.config.js        preset jest-expo; runs src/**/*.test.ts
├─ assets/images/        raster only (course covers, splash, icon)
└─ src/
   ├─ app/               ROUTES ONLY: layouts + one-line re-exports (§3)
   ├─ features/          one folder per product area: <area>-screen.tsx, components/, hooks, copy.ts
   │  ├─ home/ academy/ assistant/ shop/ course/ stories/ streak/
   │  ├─ lives/ referral/ account/ invite/ paywall/ onboarding/
   │  └─ lesson/         lesson-screen.tsx, steps/, celebration/, overlays/
   │     └─ engine/      types.ts · machine.ts · grade.ts · use-lesson-controller.ts (+ tests)
   ├─ components/
   │  ├─ ui/             design-system primitives + index.ts barrel (§6)
   │  ├─ icons/          icon-registry.ts (Lucide) + economy/*.tsx (custom gradient SVGs)
   │  ├─ illustrations/  SVG compositions (hero-book, envelopes, trophy, orb, burning-bill…)
   │  └─ app/            app-wide composites: header-chips, sheet-host, toast-host, web-frame, error-boundary
   ├─ theme/
   │  ├─ tokens/         palette · colors · spacing · radius · typography · elevation · motion · layout
   │  └─ theme-provider.tsx · surface-context.tsx · variants.ts · types.ts · index.ts
   ├─ store/
   │  ├─ index.ts        useAppStore = create()(persist(...))
   │  ├─ slices/         economy · progress · profile · settings (defaults + actions)
   │  ├─ selectors.ts    pure (state, now) → derived values
   │  ├─ hooks.ts        useLives(), useStreak(), useWallet(), usePath(courseId)…
   │  ├─ migrations.ts   migrate(version) + validateMerge()
   │  ├─ chat.ts         separate persisted store for assistant conversations
   │  └─ ui/             ephemeral stores: sheets.ts · toast.ts · path-fx.ts
   ├─ domain/            pure rules, no React: day.ts · lives.ts · streak.ts · rewards.ts · shop.ts · path.ts (+ *.test.ts)
   ├─ data/              typed static content: types.ts, courses/first-investment/*, stories.ts, shop.ts, onboarding.ts, copy.ts (shared UI copy)
   ├─ services/assistant/ AssistantClient interface + mock streaming client (a real LLM is called through a server proxy later; no keys in the app)
   ├─ config/            economy.ts (limits, prices, timers) · flags.ts
   └─ lib/               nav.ts · haptics.ts · share.ts · clipboard.ts · use-now.ts · use-day-rollover.ts · platform.ts
```

Delete the template scaffolding: `explore.tsx`, `app-tabs*`, `themed-*`, `hint-row`, `web-badge`, `animated-icon*`, `external-link`, `ui/collapsible`, `constants/theme.ts`, `hooks/use-theme*`.

---

## 3. Route map

```
src/app/
  _layout.tsx          providers, font + hydration gate, root <Stack>
  +html.tsx            web root HTML (static output)
  +not-found.tsx       friendly 404 with "Torna alla home"
  (tabs)/_layout.tsx   <Tabs> from 'expo-router/js-tabs' with tabBar={p => <FloatingTabBar {...p}/>}; <Redirect href="/onboarding"> if !profile.onboardedAt
  (tabs)/index.tsx     Home        "/"
  (tabs)/academy.tsx   Academy     "/academy"
  (tabs)/assistant.tsx Assistente  "/assistant"
  (tabs)/shop.tsx      Shop        "/shop"
  course/[id].tsx      learning path       push
  streak.tsx           streak / calendar   push
  account.tsx          account             push
  invite.tsx           invite a friend     push
  onboarding.tsx       5-step pager        card, fade, gesture off
  paywall.tsx          Finanz Pro          modal
  lesson/[id].tsx      lesson player (id = chapterId)   fullScreenModal
  story/[group].tsx    story viewer (group = 'academy'|'app')   fullScreenModal, fade
```

Each route file is a single line, e.g. `export { LessonScreen as default } from '@/features/lesson/lesson-screen'`.

```tsx
// src/app/_layout.tsx
export { ErrorBoundary } from 'expo-router';
export const unstable_settings = { anchor: '(tabs)' };
SplashScreen.preventAutoHideAsync();

const push = { headerShown: false } as const;
const immersive = { headerShown: false, presentation: 'fullScreenModal', gestureEnabled: false } as const;

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontsToLoad);
  const hydrated = useAppStore((s) => s._hasHydrated);
  useEffect(() => { useAppStore.persist.rehydrate(); }, []);      // skipHydration: client-only
  const ready = (fontsLoaded || !!fontError) && hydrated;
  useEffect(() => { if (ready) SplashScreen.hideAsync(); }, [ready]);
  useDayRollover();                                                // §4.4
  if (!ready) return null;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <ThemeProvider>
          <WebFrame>{/* web: centered 520px column; native: passthrough */}
            <Stack screenOptions={push}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="course/[id]" /><Stack.Screen name="streak" />
              <Stack.Screen name="account" /><Stack.Screen name="invite" />
              <Stack.Screen name="onboarding" options={{ animation: 'fade', gestureEnabled: false }} />
              <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
              <Stack.Screen name="lesson/[id]" options={{ ...immersive, animation: 'slide_from_bottom' }} />
              <Stack.Screen name="story/[group]" options={{ ...immersive, animation: 'fade' }} />
            </Stack>
            <SheetHost />
            <ToastHost />
          </WebFrame>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
```

**Stack decisions**
- Stack pushes (course, streak, account, invite) are declared on the root stack, so the tab bar hides and back returns to the tab the user came from. Screens draw their own round back `IconButton` and `HeaderChips`; no native headers.
- `fullScreenModal` falls back to `modal` on Android. On web every route is a page. Lesson, story, paywall and onboarding are designed full-height with their own close control, so they look the same on every platform.
- Android hardware back inside a lesson opens the exit dialog: a `BackHandler` subscription inside `useFocusEffect` (from `expo-router`) returns `true`.

**Navigation**
- `src/lib/nav.ts` holds every typed helper: `nav.course(id)`, `nav.lesson(id)`, `nav.story(group)`, `nav.streak()`, `nav.account()`, `nav.invite()`, `nav.paywall()`.
- Dynamic routes use object hrefs: `{ pathname: '/lesson/[id]', params: { id } }`.
- Screens read params with `useLocalSearchParams<'/lesson/[id]'>()`.
- `dismiss = () => router.canGoBack() ? router.back() : router.replace('/')` covers web deep links.

**Sheets and dialogs are not routes.** Expo Router web modals are alpha behind `EXPO_UNSTABLE_WEB_MODAL=1` in SDK 57. The out-of-lives sheet must also appear inside the full-screen lesson. So the approach is:
- `Sheet` and `Dialog` primitives (§6, §8) take `host: 'modal' | 'inline'`.
- **App-level sheets** (`lives`, `referral`) are opened through `store/ui/sheets.ts`, a sanidhyy-style store: `sheets.open('lives', { reason: 'full' | 'empty' })`. They are rendered by the single `<SheetHost/>` inside RN `<Modal transparent animationType="none">`, which floats above tabs and stacks on native and gets portal, focus trap and Escape handling on web. `sheets.close()` returns a promise that resolves after the exit animation. CTAs that navigate chain on it: `await sheets.close(); nav.invite()`. This avoids pushing while an iOS modal is still dismissing.
- **Lesson overlays** (FeedbackDialog, exit confirm "Aspetta, non uscire!", the "Spiegami il perché" chat sheet, out-of-lives) use `host="inline"`. They are absolutely positioned inside `lesson/[id]`, driven by the lesson state machine (§7), and the lesson reuses `<LivesSheetContent/>` from `features/lives`.
- **Referral promo** opens from Home's `useEffect` 600 ms after mount. It shows only if onboarded, at most once per cold launch (module-level flag) and at most once per 24 h (`settings.referralPromoLastShownAt`).
- **Toasts** render in `<ToastHost/>`, which uses react-native-screens `FullWindowOverlay` on iOS so they stay visible above modals, and an absolute `box-none` layer elsewhere.

---

## 4. State

### 4.1 Store topology
There is one persisted store, `useAppStore`, holding four namespaced slices. It is persisted under key `finanz/app`, `version: 1`, with `createJSONStorage(() => AsyncStorage)` (AsyncStorage uses localStorage on web), `skipHydration: true`, `partialize` (data only), `migrate` and `merge: validateMerge`.
- One store because lesson completion changes progress, economy and streak in one atomic `set()`, and there is a single hydration gate and a single schema version.
- Actions are plain exported functions (`economy.loseLife()`, `progress.passStep()`) that call `useAppStore.setState`. The lesson engine and non-React code call them directly.
- `store/chat.ts` is a separate persisted store (`finanz/chat`, capped at 20 conversations) so chat history can never delay the app's hydration.
- Stores that are not persisted: `ui/sheets`, `ui/toast`, `ui/path-fx` (pending unlock animation), and the lesson session (a `useReducer` in the screen).

### 4.2 Persisted shape (v1)
```ts
type Millis = number;                              // epoch ms
type DayKey = `${number}-${number}-${number}`;     // LOCAL calendar day, zero-padded 'YYYY-MM-DD'

export interface PersistedV1 {
  economy: {
    coins: number;                    // kiwi balance, integer ≥ 0
    lives: number;                    // 0..MAX_LIVES, valid as of livesAnchorAt
    livesAnchorAt: Millis;            // refill clock anchor (§4.4)
    shields: number;                  // 0..MAX_SHIELDS
    proUntil: Millis | null;          // Finanz Pro
    unlimitedUntil: Millis | null;    // "Vite illimitate per 1 ora"
    dailyRewardClaimedOn: DayKey | null;
    ledger: { id: string; at: Millis; kind: 'daily' | 'purchase' | 'lesson' | 'challenge'; sku?: ShopSku; coins: number }[]; // last 100 → "I tuoi acquisti"
  };
  progress: {
    chapters: Record<ChapterId, {
      status: 'in_progress' | 'completed';
      stepIndex: number;              // steps passed in the current attempt = resume index
      missedStepIds: StepId[];        // wrong at least once this attempt → max 1 life per question, even across exit/resume
      attemptStartedAt: Millis;
      completedAt: Millis | null;     // first completion
      bestAccuracy: number | null;    // 0..1
      timesCompleted: number;
    }>;
    xpByDay: Record<DayKey, number>;
    activeDays: DayKey[];             // sorted, unique: days with ≥1 completed chapter (practice counts)
    shieldedDays: DayKey[];           // missed days covered by a shield
    reconciledThrough: DayKey | null; // last full day processed by reconcileDays()
    challengesClaimed: Partial<Record<'marathon7' | 'marathon14', Millis>>;
    storiesSeen: ('academy' | 'app')[];
  };
  profile: {
    name: string; email: string | null; avatar: AvatarId;
    referralCode: string;             // 6 chars [A-Z0-9], generated once at onboarding
    invitesSent: number; redeemedCode: string | null;
    goal: GoalId | null; level: LevelId | null; interests: InterestId[];
    onboardedAt: Millis | null;
  };
  settings: {
    themeOverride: 'light' | 'dark' | null;   // v1 ships light; the provider is dark-ready
    haptics: boolean; sounds: boolean;
    referralPromoLastShownAt: Millis | null;
  };
}
```

**Constants (`config/economy.ts`)**
- Lives and shields: `MAX_LIVES 3`, `LIFE_REFILL_MS 30 min`, `MAX_SHIELDS 3`.
- Shop prices: `PRICE = { shield: 500, extraLife: 500, unlimited1h: 1000 }`.
- Rewards: `DAILY_REWARD 100`, `MARATHON7_REWARD 500`.
- Milestones: `MILESTONES [2, 10, 15]`.

`validateMerge` does the following:
- drops chapter records whose ids no longer exist in `src/data`;
- clamps `lives` and `shields`;
- sorts and dedupes the day lists;
- generates a missing referral code.

### 4.3 Selectors
Selectors are pure `(s: AppState, now: Millis) => T` functions in `selectors.ts`, unit-tested. Hooks in `hooks.ts` combine them with `useShallow` and `useNow(tickMs)`.

| Selector | Returns |
|---|---|
| `selectLives(s, now)` | `{ lives, max, full, unlimited, nextLifeAt \| null }` |
| `selectCanStartLesson(s, now, chapterId)` | `unlimited \|\| practice \|\| lives > 0` |
| `selectStreak(s, now)` | `{ count, activeToday, atRisk }` |
| `selectXpToday(s, now)` / `selectXpTotal(s)` | numbers |
| `selectCompletedCount(s)` | number of completed chapters (drives milestones) |
| `selectMilestones(s)` | `[{ threshold, progress: 0..1, unlocked }]` for 2/10/15 |
| `selectDailyReward(s, now)` | `{ claimable, resetsAt }` (resetsAt also drives the Shop "2h 26min" clock) |
| `selectChallenge(s, now, id)` | `{ progress: min(streak, 7) / 7, claimable, locked }` (marathon14 stays locked until streak ≥ 14) |
| `selectPath(s, courseId)` | ordered nodes `{ chapter, state: 'locked'\|'current'\|'completed', tooltip: 'start'\|'resume'\|null, level }` |
| `selectCourseProgress(s, courseId)` | `{ completed, total }` |

Path status rules:
- Chapter *i* is unlocked if `i === 0` or chapter *i−1* is completed.
- `current` is the first chapter that is unlocked and not completed.
- `tooltip` is `resume` when the current chapter's record is `in_progress` with `stepIndex > 0`, otherwise `start`.

### 4.4 Time-based rules
All time rules live in `src/domain/*`. Each takes `now` as an argument and never calls `Date.now()` inside a rule.

```ts
// domain/day.ts: always LOCAL days; build dates from components at 12:00 so DST never shifts the day
export const dayKey = (ms: Millis): DayKey => { const d = new Date(ms); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` as DayKey; };
export const addDays = (k: DayKey, n: number) => { const [y, m, d] = k.split('-').map(Number); return dayKey(new Date(y, m - 1, d + n, 12).getTime()); };
export const nextMidnight = (ms: Millis) => { const d = new Date(ms); return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime(); };

// domain/lives.ts: lazy refill, never stored as a timer
export function livesAt(e: Economy, now: Millis) {
  if (e.lives >= MAX_LIVES) return { lives: MAX_LIVES, anchor: now, nextAt: null };
  const anchor0 = Math.min(e.livesAnchorAt, now);                 // clock moved back → no negative time
  const gained = Math.floor((now - anchor0) / LIFE_REFILL_MS);
  const lives = Math.min(MAX_LIVES, e.lives + gained);
  if (lives === MAX_LIVES) return { lives, anchor: now, nextAt: null };
  const anchor = anchor0 + gained * LIFE_REFILL_MS;              // keeps partial progress toward the next life
  return { lives, anchor, nextAt: anchor + LIFE_REFILL_MS };
}
export const isUnlimited = (e: Economy, now: Millis) => (e.proUntil ?? 0) > now || (e.unlimitedUntil ?? 0) > now;
export function loseLife(e: Economy, now: Millis): Economy {
  if (isUnlimited(e, now)) return e;
  const { lives, anchor } = livesAt(e, now);                     // normalise, then decrement
  return lives === 0 ? e : { ...e, lives: lives - 1, livesAnchorAt: anchor };  // full → refill clock starts now
}

// domain/streak.ts: derived, never counted
const runEndingAt = (d: DayKey, A: Set<DayKey>, S: Set<DayKey>) => { let n = 0; while (A.has(d) || S.has(d)) { if (A.has(d)) n++; d = addDays(d, -1); } return n; };
export const streakCount = (A: Set<DayKey>, S: Set<DayKey>, today: DayKey) =>
  runEndingAt(A.has(today) ? today : addDays(today, -1), A, S);   // today not studied yet: yesterday's streak still counts
export function reconcileDays(p: Progress, e: Economy, today: DayKey) {
  // For each fully elapsed day since reconciledThrough: a missed day costs one shield, but only if a streak is alive.
  const A = new Set(p.activeDays), S = new Set(p.shieldedDays); let shields = e.shields;
  for (let d = p.reconciledThrough ? addDays(p.reconciledThrough, 1) : today; d < today; d = addDays(d, 1))
    if (!A.has(d) && !S.has(d) && shields > 0 && runEndingAt(addDays(d, -1), A, S) > 0) { shields--; S.add(d); }
  return { shields, shieldedDays: [...S].sort(), reconciledThrough: addDays(today, -1) };
}
```

**Rules**
- **Lives refill.** One life every 30 min. The value is computed on read and "materialised" only when it changes (lose, buy, refill).
- **Lives UI timers.** Lives sheet and chip timers use `useNow(1000)` while not full; otherwise they don't tick.
- **Buying lives.** "1 Vita extra" is disabled when lives are full. "Vite illimitate per 1 ora" sets `unlimitedUntil = max(now, unlimitedUntil) + 1h`.
- **Daily reward.** It is claimable when `dailyRewardClaimedOn !== dayKey(now)` and resets at local midnight. The Shop countdown is `nextMidnight(now) - now`, formatted as `2h 26min`.
- **Streak day rollover.** A day is active once a chapter is completed that day, and shielded days bridge the streak without adding to the count. `useDayRollover()` in the root layout runs `reconcileDays` in three cases:
  - after hydration;
  - on every `AppState` change to `'active'`;
  - from a `setTimeout` set for `nextMidnight(now)` and re-armed after each run. The same callback also bumps a `now` tick in the UI store, so chips and the Shop clock refresh.
- **Purchases.** `wallet.spend(price, sku)` returns `boolean`. It checks and deducts inside one `setState`, and writes the ledger entry. When it returns `false`, the UI shows the "Kiwi insufficienti" toast and a warning haptic.

---

## 5. Design tokens

Structure:
- `palette.ts` is private; only `theme/` imports it, enforced by lint.
- `colors.ts` holds semantic roles, typed `satisfies SemanticColors`, so the future dark map must be complete.
- The theme object is `{ colors, space, radius, text, elevation, motion, layout, z, isDark }`, exposed through `useAppTheme()` → `{ theme, themed }`.
- Steps follow the Radix contract:
  - 1–2: backgrounds
  - 3 / 4 / 5: component background, hover, pressed or selected
  - 6 / 7 / 8: subtle border, border, strong border or focus
  - 9 / 10: solid, solid hover
  - 11 / 12: low-contrast text, high-contrast text

### 5.1 Palette
| Step | evergreen (brand) | lime (accent) | sage (neutral) |
|---|---|---|---|
| 1 | `#F3F8F4` | `#FBFEF3` | `#FBFCF8` |
| 2 | `#E8F2EB` | `#F5FCE3` | `#F5F6F1` |
| 3 | `#D6EADC` | `#EEFDD3` | `#EEF1EA` |
| 4 | `#C1DFCB` | `#E2F9B8` | `#E9EDE5` |
| 5 | `#A6D0B4` | `#D4F59C` | `#E4E8DF` |
| 6 | `#84BC98` | `#C3EC80` | `#D6DDD0` |
| 7 | `#57A075` | `#ABDB5E` | `#C5CEBF` |
| 8 | `#2C7D52` | `#8FC23A` | `#A7B2A1` |
| 9 | `#0F3D2A` | `#B7F34A` | `#8A968F` |
| 10 | `#174D36` | `#A6E438` | `#748079` |
| 11 | `#1E6B47` | `#4E7A12` | `#4A5A51` |
| 12 | `#0B2E20` | `#2A4208` | `#0D1A13` |

Extra brand stop: `evergreenHero = ['#0B2E20', '#12482F']`, the hero gradient, with a radial "spotlight" drawn by an SVG `RadialGradient` at white 10%.

| Scale | 3 tint | 6 border | 9 solid | 10 hover | 11 text |
|---|---|---|---|---|---|
| success | `#E3F7EA` | `#A8E0BC` | `#18A957` | `#12954B` | `#0E7A3D` |
| danger | `#FDECEC` | `#F6BDBF` | `#E5484D` | `#D63B40` | `#C6282D` |
| warning | `#FFF4DB` | `#F6D78F` | `#F5A524` | `#E5961A` | `#9A5B00` |
| info | `#E8F1FF` | `#B7D0FB` | `#3B82F6` | `#2F6FE0` | `#1D5BC4` |

Content tints (lesson InfoRow, DefinitionCard, Shop illustration wells):

| Tint | bg | border | text |
|---|---|---|---|
| cyan | `#E6F5FB` | `#B9E1F1` | `#0B6A8C` |
| pink | `#FCEAF1` | `#F3C1D4` | `#A3285A` |
| cream | `#FFF6DC` | `#F1DE9E` | `#85600A` |
| lavender | `#F0EAFD` | `#D3C6F6` | `#5B3FB5` |
| mint | `#E6F8EF` | `#B4E6CB` | `#0F7A4A` |

Economy colors (gradient pair plus tint):

| Item | Gradient | Tint |
|---|---|---|
| flame | `#FF8A1F→#FF4E1B` | `#FFF1E3` |
| heart | `#FF4D6D→#E5294E` | `#FFE8ED` |
| heart gold, unlimited | `#F2B92C→#E39A0C` | `#FFF6DC` |
| shield | `#3BA7FF→#1E7FE0` | `#E6F4FF` |
| gem, Pro | `#7C5CFF→#A48BFF` | `#EFEBFF` |

Kiwi coin colors: rim `#E9B949`, flesh `#8BD345`, seeds `#1E2A12`, core `#F4F1D0`. Hearts are rose, per the art direction; the video's green hearts are dropped.

### 5.2 Semantic roles (light)
```ts
bg:     { canvas: sage2, surface: '#FFFFFF', raised: sage1, sunken: sage3, brand: evergreen12, accent: lime9, accentSubtle: lime3, scrim: 'rgba(6,20,13,0.48)' }
fg:     { primary: sage12, secondary: sage11, tertiary: sage9, disabled: sage8, onAccent: evergreen12, onBrand: '#FFFFFF', onBrandMuted: 'rgba(255,255,255,0.72)', brandAccent: lime9, link: evergreen11 }
border: { hairline: sage5, subtle: sage6, default: sage7, strong: sage8, focus: evergreen8 }
action: { primary:   { bg: lime9, bgPressed: lime10, fg: evergreen12 },
          secondary: { bg: evergreen9, bgPressed: evergreen10, fg: '#FFFFFF' },
          outline:   { bg: '#FFFFFF', bgPressed: sage3, border: sage7, fg: sage12 },
          ghost:     { bg: 'transparent', bgPressed: sage3, fg: sage12 },
          danger:    { bg: danger9, bgPressed: danger10, fg: '#FFFFFF' } }
option: { idle: { bg: '#FFFFFF', border: sage6 }, selected: { bg: lime3, border: evergreen9 },
          correct: { bg: success3, border: success9 }, wrong: { bg: danger3, border: danger9 } }
progress: { track: sage4, fill: evergreen9, fillAccent: lime9, trackOnBrand: 'rgba(255,255,255,0.16)' }
tab:    { bg: '#FFFFFF', activePill: lime9, iconActive: evergreen12, icon: sage11 }
feedback: { success|danger|warning|info: { bg: 3, border: 6, solid: 9, text: 11 } }
content:  { cyan|pink|cream|lavender|mint: { bg, border, text } }
```

**Inverted surfaces** (Rainbow pattern): `Card variant="brand"`, the streak header, the referral card and the "App" story group wrap their children in `<SurfaceContext value="brand">`. Inside, `Text`, `Icon`, `Chip`, `ProgressBar` and outline `Button` pick up `fg.onBrand`, `progress.trackOnBrand` and a white/24% border automatically, and lime display text uses `fg.brandAccent`. Text on lime is always `evergreen12`, never white.

### 5.3 Spacing, radius, layout, z-index
```ts
space  = { none: 0, xxxs: 2, xxs: 4, xs: 8, sm: 12, md: 16, lg: 20, xl: 24, xxl: 32, xxxl: 48, huge: 64 }   // 4-pt grid
radius = { xxs: 4, xs: 8, sm: 12, md: 16, lg: 20, xl: 28, pill: 999 }
// xxs tags/badges · xs small tiles · sm inputs/calendar days · md options/list groups · lg cards/path nodes · xl hero, sheets, dialogs · pill buttons/chips/tab bar
layout = { gutter: 20, cardPadding: 20, sectionGap: 32, stackGap: 12, minTouch: 44, headerHeight: 56,
           tabBarHeight: 64, tabBarSideMargin: 16, tabBarBottomGap: 8, fabSize: 56, maxContentWidth: 520,
           pathNodeSize: 128, pathRowHeight: 168 }
z      = { base: 0, raised: 10, sticky: 100, fab: 150, tabBar: 200, overlay: 300, sheet: 400, dialog: 450, toast: 500 }
```
`useTabBarInset()` returns `tabBarHeight + tabBarBottomGap + safeArea.bottom + space.sm`. Every tab `Screen` with `tabInset` pads its content by this amount.

### 5.4 Typography
Fonts come from `@expo-google-fonts/bricolage-grotesque` (700Bold, 800ExtraBold) and `@expo-google-fonts/plus-jakarta-sans` (400Regular, 500Medium, 600SemiBold, 700Bold, 800ExtraBold). Both fonts ship `tnum`, which `tabular` uses. Each weight is set by `fontFamily` (e.g. `PlusJakartaSans_700Bold`), never by `fontWeight` (Android). Variants carry no color (Expensify rule), and letter spacing is in points.

| Role | Font / weight | Size / LH | Tracking | maxScale | Use |
|---|---|---|---|---|---|
| displayHero | Bricolage 800 | 96/96 | −1.4 | 1.0 | streak number |
| displayXl | Bricolage 800 | 44/48 | −0.6 | 1.2 | "IL TUO CODICE", "GIORNI DI FILA", "TRAGUARDO RAGGIUNTO" |
| displayLg | Bricolage 800 | 36/40 | −0.5 | 1.2 | hero card headline, story titles |
| displayMd | Bricolage 700 | 28/34 | −0.3 | 1.3 | screen titles (Shop, Account, Academy) |
| titleLg | Jakarta 700 | 22/28 | −0.2 | 1.4 | dialog titles, lesson prompts |
| titleMd | Jakarta 700 | 19/24 | 0 | 1.5 | card and section titles |
| titleSm | Jakarta 600 | 17/22 | 0 | 1.6 | list titles, option labels |
| bodyLg | Jakarta 400 | 17/24 | 0 | 1.6 | lesson body, info rows |
| bodyMd | Jakarta 400 | 15/22 | 0 | 1.6 | default body |
| bodySm | Jakarta 500 | 13/18 | 0 | 1.6 | subtitles, captions |
| labelLg | Jakarta 600 | 15/20 | 0 | 1.4 | chips values, tabs a11y |
| labelMd | Jakarta 700 | 13/16 | +0.26 | 1.3 | tags, calendar |
| overline | Jakarta 700, UPPER | 11/14 | +0.9 | 1.3 | BONUS, LIVELLO 1, MENU |
| buttonLg / Md / Sm | Jakarta 700 | 17/22 · 15/20 · 13/18 | 0 | 1.3 | button sizes 56 / 48 / 40 |

### 5.5 Elevation
All elevation uses `boxShadow` strings. RN 0.86 is New Architecture only, so the same token works on iOS, Android and web. Shadows are green-ink tinted with two layers, far and near.
```ts
elevation = {
  hairline: {},                                                                     // border only
  card:     { boxShadow: '0px 1px 2px rgba(13,26,19,0.04), 0px 2px 12px rgba(13,26,19,0.06)' },
  raised:   { boxShadow: '0px 2px 6px rgba(13,26,19,0.04), 0px 8px 24px rgba(13,26,19,0.10)' },
  floating: { boxShadow: '0px 4px 10px rgba(13,26,19,0.06), 0px 12px 32px rgba(13,26,19,0.14)' }, // tab bar, FAB, toast
  glowLime: { boxShadow: '0px 6px 20px rgba(183,243,74,0.35)' },                    // hero CTA on dark green
}
```

### 5.6 Motion tokens (`tokens/motion.ts`)
```ts
duration = { instant: 90, fast: 160, base: 240, slow: 360, dialogIn: 300, dialogOut: 160, sheetOpen: 450, sheetClose: 280,
             stepIn: 360, stepOut: 240, progress: 450, countUp: 600, celebrate: 800, cube: 600, longPress: 500,
             shimmerSweep: 1400, shimmerPause: 2100, typingDot: 300, typingStagger: 150, orb: 2400, bob: 1200,
             toast: 2400, storyPage: 6000 }
easing = {  // always Easing.bezier(...) factories (web converts only these to CSS)
  out: [0.16, 1, 0.3, 1], exit: [0.4, 0, 1, 1], sheet: [0.32, 0.72, 0, 1], fade: [0.22, 1, 0.36, 1],
  press: [0.25, 0.46, 0.45, 0.94], shimmer: [0.76, 0, 0.24, 1], linear: 'linear' }
spring = {  // Reanimated 4 physics (mass 1 unless noted)
  snappy:  { damping: 20, stiffness: 300 },                            // ζ≈0.58 press release, selection
  bouncy:  { damping: 12, stiffness: 220 },                            // ζ≈0.40 icon badge, coins, hearts, unlock pop
  gentle:  { damping: 22, stiffness: 140 },                            // ζ≈0.93 cards, progress fill, layout
  precise: SnappySpringConfig,                                          // {mass 4, stiffness 900, damping 110, overshootClamping} tab pill, pagers
  sheet:   { mass: 0.8, stiffness: 680, damping: 46 },                 // ζ≈0.99 drag release
}
press = { scaleCta: 0.97, scaleSmall: 0.92, scaleDesktopWeb: 1, rowDim: 0.8, rowDimMs: 50 }
```
Every animation passes `reduceMotion: ReduceMotion.System`. Under Jest, durations are zeroed (Rainbow's `buildTestSafeConfig`).

---

## 6. Component inventory (`@/components/ui`)

### 6.0 Conventions
**Variant model.** Components use `createVariants()` in `theme/variants.ts`. It has cva's API shape (`base`, `variants`, `compoundVariants`, `defaultVariants`, boolean variants as `'true' | 'false'`) but returns flattened RN style objects. Recipes are `(theme) => spec`, memoized per theme identity, and `VariantProps<typeof recipe>` types the props.

**Press feedback.** Every tappable element builds on `PressableScale`, which is Reanimated-based:
- press-in: `withTiming(target, instant, press)`;
- release: `withSpring(1, snappy)`;
- no scale on desktop web with a mouse, and none under reduced motion;
- `haptic` prop, default `selection`.

**Lint.** ESLint `no-restricted-imports` bans the following in `features/**`: `Text`, `Pressable` and `TouchableOpacity` from `react-native`, `@/theme/tokens/palette`, and raw `expo-haptics`.

**Accessibility.** Every text prop takes a plain string, since copy comes from `copy.ts`. Every icon-only control requires an `accessibilityLabel`.

```ts
type Tone = 'neutral' | 'brand' | 'accent' | 'success' | 'danger' | 'warning' | 'info';
type Tint = 'cyan' | 'pink' | 'cream' | 'lavender' | 'mint';

<Text variant="bodyMd" color?="fg.secondary" tabular? align? numberOfLines? />       // color defaults from SurfaceContext
<Button variant="primary|secondary|outline|ghost|danger" size="lg|md|sm" label fullWidth? loading? disabled?
        shimmer? glow? leftIcon? rightIcon? haptic?="light" onPress />
<IconButton icon variant="surface|ghost|brand|inverse" size="sm|md|lg" accessibilityLabel badge? onPress />  // 36/44/52 circles
<Chip variant="outline|soft|solid" tone size="sm|md" icon? emoji? label onPress? />                          // 28/32 high
<StatChip kind="streak|lives|coins" value onPress? />      // animates on change; lives shows ∞ when unlimited, mm:ss refill subLabel
<HeaderChips show={['streak','lives','coins','avatar']} /> // wired to store + nav (streak→/streak, lives→sheet, coins→/shop, avatar→/account)
<Card variant="surface|raised|brand|accent|tint|locked|outline" tint? padding="none|sm|md|lg" radius="lg|xl" spotlight? onPress? />
<ProgressBar value={0..1} tone="brand|accent|onBrand" size="xs|sm|md|lg" animated?=true accessibilityLabel />  // 4/6/10/14 high
<Tag variant="pill|badge|overline" tone? tint? emoji? icon? label />   // "🎩 INDOVINA", "⭐ BASE", "FREE", "BONUS"
<Sheet visible onDismiss onClosed? host="modal|inline" tone="surface|brand" dismissible?=true grabber?=true keyboard? title? />
<Dialog visible onDismiss host="modal|inline" tone="success|danger|warning|brand|neutral" badge={{ icon } | { emoji }}
        title message primary={{ label, onPress, variant? }} secondary? dismissible?=false />
<Screen preset="fixed|scroll|auto" edges={['top']} background="canvas|surface|brand|assistant" keyboard="none|avoid"
        tabInset? header? stickyHeader? onScroll?(animated handler) />
FloatingTabBar(props: BottomTabBarProps)   // type from 'expo-router/js-tabs'; + useTabBarInset()
<ListItem title subtitle? leading={{ icon, tint }} trailing="chevron|none|ReactNode" size="md|sm" destructive? onPress />
<ListSection title="MENU">…</ListSection>
<Avatar emoji|source size="sm|md|lg|xl" ring="none|unseen|seen" />    // 32/40/64/88
<StoryRing group seen label emoji onPress />
<IllustrationFrame size="sm|md|lg|hero" shape="circle|rounded|none" tint? glow?>{<Illustration name="heroBook" />}</IllustrationFrame>
<EconomyIcon kind="flame|heart|heartGold|heartInfinite|kiwi|shield|gem|trophy|lock|spark" size />
// lesson
<LessonHeader progress lives coins onClose onReport onShare />
<LessonFooter state="disabled|ready|hidden" label="Continua" onPress explain="hidden|fab|pill" onExplain />
<OptionButton label index total state="idle|selected|correct|wrong|eliminated" onPress />
<TrueFalse value={boolean|null} state="idle|correct|wrong" eliminated={boolean[]} onChange />
<InfoRow tint emoji? text index />                    // text supports **bold**; emoji pop delay 120 + index·80 ms
<DefinitionCard term definition tint="lavender" emoji? />
<FeedbackDialog result="correct|wrong" visible onAck />
<StepTag kind="guess|challenge" />
// path, streak, misc
<PathNode state="locked|current|completed" title icon side="left|right" tooltip?="start|resume" playUnlock? onPress />
<PathConnector from to done />                        // SVG dashed line '6 8', round caps
<LevelBanner level emoji?="🤓" />
<Calendar month onMonthChange activeDays shieldedDays today loading? />
toast.show({ text, tone: 'neutral|success|danger', icon?, duration? })
// motion primitives: PressableScale · AnimatedNumber · TypingDots · Shimmer · ConfettiBurst · Bob · Pulse
```

**Specifications**

| Component | Decisions |
|---|---|
| Text | Precedence: variant → color → style (Ignite). Color comes from SurfaceContext. `tabular` adds `fontVariant: ['tabular-nums']`. `maxFontSizeMultiplier` is set per role. |
| Button | Pill, 56/48/40 high, horizontal padding 24/20/16, icons 20/18/16. Press: scale 0.97 plus `bgPressed`. `disabled`: opacity 0.45, no haptic (the pale "Continua"). `loading`: keeps its width, shows TypingDots, sets a11y `busy`. `shimmer`: gradient sweep skewed −20°, paused when unfocused or under reduced motion. `glow`: `glowLime`. On brand surfaces, `outline` uses a white/24% border. |
| IconButton | Circles of 36/44/52. `surface`: white, hairline, card shadow (back, share). `brand`: evergreen9 (AI FAB). `inverse`: white/12% (story close). |
| Chip / StatChip | Chip: outline × tone is a 1.5 px `border.subtle` with an economy-colored icon; soft uses step-3 bg and step-11 text. StatChip: a value change bumps it (1→1.15→1) and rolls an AnimatedNumber; losing a life adds a ±6 px shake and an error flash. |
| Card | Default: surface, hairline, `card` shadow, radius lg, padding md. `raised`. `brand`: hero gradient, radius xl, SurfaceContext brand, optional SVG radial `spotlight`. `tint`. `locked`: sunken, children at 0.6, lock badge. |
| ProgressBar | Width animates with a Reanimated CSS transition (`progress`, `out`). A white 30% highlight strip appears at size md and up. |
| Tag | `pill` (emoji + label on tint), `badge` (solid, e.g. FREE), `overline` (text only). |
| Sheet | See §8.2. Top radius xl, 36×5 grabber, padding lg, bottom padding = inset + md, max height 90%, max width 520, centered. |
| Dialog | Centered, radius xl, `raised`. A 72 px badge overlaps the top edge by 36 px. Enter: ZoomIn from 0.92 + fade (`dialogIn`, `out`), badge pops 0.6→1 (`bouncy`). Exit: fade. `accessibilityRole="alert"`. |
| Screen | Ignite presets; `auto` scrolls only when content exceeds 92% of the viewport. Uses the safe-area edges hook. Re-pressing the tab scrolls to top. `keyboard="avoid"` wraps in KeyboardAvoidingView (iOS padding). `assistant` sets the gradient background. `stickyHeader` handles the collapsing course cover. |
| FloatingTabBar | Absolute white pill, 64 high, 16 side margin, 8 above the inset, `floating` shadow. The lime pill slides between measured item centers (`precise`) with a selection haptic. Keeps the `tabPress` emit. Slides away when the keyboard opens on the Assistant tab. |
| ListItem | 64/52 high. A 40 px tinted icon tile (Lucide, not emoji). Press dims to 0.8 over 50 ms. `ListSection`: overline title plus a white radius-md group with inset dividers. |
| Avatar / StoryRing | Unseen: 2.5 px lime9→evergreen7 gradient ring with a 2 px white gap. Seen: sage6 ring. Press scales to 0.92. |
| IllustrationFrame / EconomyIcon | Sizes 64/120/180/220, tint well, optional glow. SVG with 2-stop gradients. Emoji only appear inside content. |
| LessonHeader / LessonFooter | Header: X, flag, share on the left; lives and coins chips on the right; brand sm ProgressBar below. Footer: full-width lg primary; Enter triggers it on web. A 56 px ✨ AI FAB sits bottom-right; `explain="pill"` morphs it into "Spiegami il perché ✨" (300 ms width transition). |
| OptionButton / TrueFalse | Min height 56, radius md, 2 px border. `option.*` colors change with a CSS color transition (`fast`). Wrong: shake. Correct: pulse to 1.04 (`bouncy`). Eliminated: opacity 0.4, not selectable. Role `radio`. TrueFalse is two equal buttons, "✓ Vero" and "✕ Falso". |
| InfoRow / DefinitionCard | InfoRow: tint background, emoji tile with a staggered 260 ms ZoomIn, bodyLg text. DefinitionCard: lavender, overline "DEFINIZIONE", term in titleLg. |
| FeedbackDialog | Dialog preset, rendered inline. Correct: ✓ "Risposta corretta" + "Continua". Wrong: ✕ "Risposta errata" + danger "Chiudi". |
| PathNode / Connector / LevelBanner | Node: 128 px square, radius lg, left or right by index parity; the trophy is centered. `current`: evergreen9 border, Pulse halo, bobbing lime tooltip. `completed`: check. `locked`: lock, disabled. `playUnlock`: lock ZoomOut, then a pop and a success haptic. Nodes enter with FadeInDown staggered by i·80 ms. Connector: dashed SVG line, evergreen7 when done, sage6 otherwise. Banner: full width, sunken, radius md, overline "🤓 LIVELLO n"; the y cursor resets after it. |
| Calendar | Monday first, `L M M G V S D`, month names from `Intl.DateTimeFormat('it-IT')`. Active day: flame tint with an orange ring. Shielded day: shield tint with 🛡. Today: evergreen outline. `loading` shows TypingDots. |
| Toast | Evergreen12 pill with white text and the `floating` shadow. Bottom-center, above the tab bar or footer. FadeInDown in, FadeOut out. One at a time. |

---

## 7. Lesson engine (`features/lesson/engine`)

### 7.1 Step types (`src/data/types.ts`)
```ts
type Eyebrow = { emoji: string; label: string };                         // "✨ La rivelazione"
export type Step =
  | { id: StepId; kind: 'mcq'; tag: 'guess'; illustration?: IllustrationId; prompt: string;
      options: { id: string; label: string }[]; correctId: string; explanation: string }
  | { id: StepId; kind: 'trueFalse'; tag: 'challenge'; image?: IllustrationId; statement: string;
      answer: boolean; explanation: string }
  | { id: StepId; kind: 'info'; eyebrow: Eyebrow; title: string; rows: { tint: Tint; emoji?: string; text: string }[] }
  | { id: StepId; kind: 'definition'; eyebrow: Eyebrow; title: string; term: string; definition: string; tint?: Tint };
export type GradedStep = Extract<Step, { kind: 'mcq' | 'trueFalse' }>;
export type Answer = string | boolean;                                   // option id | true/false
export interface Chapter { id: ChapterId; courseId: CourseId; level: number; title: string; icon: string; steps: Step[] }
```
- **Step registry.** `steps/registry.ts` maps `{ [K in Step['kind']]: FC<StepProps<Extract<Step, { kind: K }>>> }`. Adding a kind (`match`, `order`) fails to compile until its view is registered. Every view gets the same `StepProps = { step, phase, selection, eliminated, onSelect }`.
- **Grading.** `grade.ts` holds pure `grade(step, answer): boolean`.

### 7.2 Reducer
```ts
export type Phase = 'answering' | 'feedback' | 'complete';
export type Overlay = null | 'exit' | 'explain' | 'outOfLives';
export interface LessonState {
  index: number; phase: Phase; selection: Answer | null; result: 'correct' | 'wrong' | null;
  eliminated: Answer[];            // wrong picks on the current step (faded, unselectable)
  missed: StepId[];                // steps answered wrong ≥1× this attempt (seeded from the persisted record)
  overlay: Overlay;
}
export type LessonEvent =
  | { type: 'SELECT'; answer: Answer } | { type: 'GRADED'; correct: boolean; stepId: StepId }
  | { type: 'ACK' } | { type: 'ADVANCE' } | { type: 'OVERLAY'; overlay: Overlay };

const next = (s: LessonState, total: number): LessonState => s.index + 1 >= total
  ? { ...s, index: total, phase: 'complete', selection: null, result: null, eliminated: [] }
  : { ...s, index: s.index + 1, phase: 'answering', selection: null, result: null, eliminated: [] };

export function reducer(s: LessonState, e: LessonEvent, total: number): LessonState {
  switch (e.type) {
    case 'SELECT':  return s.phase === 'answering' && !s.eliminated.includes(e.answer) ? { ...s, selection: e.answer } : s;
    case 'GRADED':  return { ...s, phase: 'feedback', result: e.correct ? 'correct' : 'wrong',
                             missed: e.correct || s.missed.includes(e.stepId) ? s.missed : [...s.missed, e.stepId] };
    case 'ACK':     return s.result === 'wrong'
                      ? { ...s, phase: 'answering', result: null, selection: null, eliminated: [...s.eliminated, s.selection!] }
                      : next(s, total);
    case 'ADVANCE': return next(s, total);
    case 'OVERLAY': return { ...s, overlay: e.overlay };
  }
}
```
Derived UI state:
- `footer`: `ready` for info/definition steps, or when answering with a selection; `disabled` when answering with no selection; `hidden` during feedback and completion.
- `explain`: `pill` if `missed.includes(step.id)`, otherwise `fab`.
- Motion: the step container is keyed by `step.id`, entering `SlideInRight(stepIn, out)` and exiting `SlideOutLeft(stepOut, exit)`.

### 7.3 Controller: side effects and the heart rule
```ts
function onPrimary() {                                      // the single footer CTA
  const step = steps[s.index];
  if (step.kind === 'info' || step.kind === 'definition') { progress.passStep(id, s.index + 1); return dispatch({ type: 'ADVANCE' }); }
  if (s.phase !== 'answering' || s.selection == null) return;
  const now = Date.now(), unlimited = practice || isUnlimited(economyState(), now);
  if (!unlimited && livesAt(economyState(), now).lives === 0) return dispatch({ type: 'OVERLAY', overlay: 'outOfLives' });
  const correct = grade(step, s.selection);
  if (correct) { progress.passStep(id, s.index + 1); haptics.success(); }
  else {
    if (!unlimited && !s.missed.includes(step.id)) economy.loseLife(now);   // MAX 1 LIFE PER QUESTION
    if (!practice) progress.markMissed(id, step.id);
    haptics.error();
  }
  dispatch({ type: 'GRADED', correct, stepId: step.id });
}
function onAck() {                                          // FeedbackDialog "Continua" / "Chiudi"
  const wasWrong = s.result === 'wrong';
  dispatch({ type: 'ACK' });
  if (wasWrong && !practice && !isUnlimited(economyState(), Date.now()) && livesAt(economyState(), Date.now()).lives === 0)
    dispatch({ type: 'OVERLAY', overlay: 'outOfLives' });
}
```

**Hearts**
- A life is lost only on a step's first wrong answer in this attempt. `missed` is persisted in the chapter record, so exiting and resuming cannot charge the same question twice. A retry on the same question is free, as the video shows.
- Pro, "unlimited 1h" and practice runs (the chapter is already completed) never cost lives.
- With 0 lives:
  - on the path, tapping a node opens `sheets.open('lives', { reason: 'empty' })` instead of the lesson;
  - inside the lesson, the inline out-of-lives sheet offers the refill timer, "Ricarica 1 vita · 500 🥝", "Ottieni vite illimitate" (→ paywall) and "Esci".

**Wrong answers**
- The chosen option becomes `eliminated` after "Chiudi".
- On true/false this leaves only the correct answer.

**"Spiegami il perché"**
- It opens `overlay: 'explain'`: an inline Sheet with `keyboard`.
- The Sheet sends `AssistantClient.stream({ step, userAnswer, correctAnswer, explanation })`.
- The v1 mock streams `step.explanation` with typewriter chunks of 1–3 characters every 20 ms, after `TypingDots`.

### 7.4 Resume ("RIPRENDI DA QUI")
- **Start.** On mount, read `rec = progress.chapters[id]`:
  - `practice = rec?.status === 'completed'`;
  - `index = rec?.status === 'in_progress' ? rec.stepIndex : 0`;
  - `missed = rec?.missedStepIds ?? []`.

  When no record exists, `progress.startAttempt(id, now)` creates `in_progress` at step 0. `passStep` and `markMissed` do nothing on `completed` records, so a practice run lives only in the session.
- **Passing a step.** The resume pointer moves when a step is passed: a correct CHECK, or Continua on an info card. It moves at CHECK time, so exiting on the "Risposta corretta" dialog still resumes at the next step.
- **Exit.** X opens `overlay: 'exit'` ("Aspetta, non uscire!"):
  - "Continua a studiare" closes the dialog;
  - "Esci" calls `dismiss()`. Nothing else needs saving, and the path now shows "RIPRENDI DA QUI" because `stepIndex > 0`.
- **Interrupted celebration.** If `stepIndex === steps.length` at mount (the app was killed on the celebration screen), the lesson opens directly in `complete`, which commits idempotently.

### 7.5 Completion and rewards
When `phase` becomes `'complete'`, the controller calls `commitChapter(id, { missed, graded, startedAt }, now)`. It runs once, guarded by a ref, and the store makes it idempotent. It is one `setState`:

| Effect | First completion | Practice |
|---|---|---|
| XP → `xpByDay[today]` | 20, +10 if no missed step | 10 |
| Kiwi → `coins` + ledger `lesson` | 25, +25 if perfect | 0 |
| Streak → `activeDays ∪ today` | yes | yes |
| Chapter record | `completed`, `completedAt`, `bestAccuracy`, `timesCompleted+1`, `missedStepIds: []` | `bestAccuracy`, `timesCompleted+1` |
| Unlocks | next chapter becomes `current`; milestone 2/10/15 progress | none |

- `accuracy = (graded − missed.length) / graded`.
- The commit returns `{ xp, coins, accuracy, ms, streakBefore, streakAfter, unlockedChapterId }`.
- Rewards commit on arrival, not on the CTA. This deliberately differs from bryanjenningz: the chips can animate during the celebration, and a killed app never loses rewards.

**Celebration** (inline in `lesson/[id]`)
- 0 ms: `ConfettiBurst` (36 Reanimated particles in brand colors including kiwi slices; skipped under reduced motion) plus a success haptic, and the trophy pops (`bouncy`).
- 300 ms: three stat cards enter (XP, Precisione %, Tempo) with ZoomIn(`base`, `out`), staggered 80 ms.
- Then: `AnimatedNumber` count-ups (`countUp`), and the flame bumps if `streakAfter > streakBefore`.
- CTA "Continua" (shown at `celebrate` ms): sets `ui/path-fx.pendingUnlock = unlockedChapterId`, then `dismiss()`. The path screen plays `PathNode playUnlock` and scrolls to the new current node.

---

## 8. Motion guidelines and the bottom-sheet decision

### 8.1 Rules
1. **Pick the engine by trigger.**
   - Gesture-driven or interruptible motion (press, sheet drag, story pager, tab pill, counters) uses shared values with `withSpring`/`withTiming` from tokens.
   - State-driven style changes (option colors, progress width, disabled→enabled button, FAB→pill width) use Reanimated 4 **CSS transitions**.
   - Ambient loops (orb breathing, typing dots, tooltip bob, halo pulse) use **CSS animations** (`animationName` keyframes, `infinite`).
2. **Web parity.** Layout animations are CSS keyframes on web and `.springify()` is ignored there. Every `entering`/`exiting`/`layout` animation must chain `.duration(token).easing(Easing.bezier(...))`, passing the factory without `.factory()`. Springs appear only in shared-value code (`withSpring` runs on web on the JS thread).
3. **Tokens only.** No literal durations or spring numbers outside `tokens/motion.ts`.
4. **Performance.** Animate `transform`/`opacity`; the ProgressBar width is the one exception. Pause loops when a screen is unfocused (`useIsFocused`). Use `useWindowDimensions`, never `Dimensions.get('screen')` (on web that is the monitor size). Worklets call JS through `scheduleOnRN`.
5. **Reduced motion** (`useReducedMotion()` + `ReduceMotion.System`):
   - shimmer, confetti, orb breathing, bob, halo, shake and cube are off;
   - the story group transition becomes a `fast` crossfade;
   - entrances become fades of at most `fast`.
6. **Haptics.** All haptics go through `lib/haptics.ts`, a no-op on web and when `settings.haptics` is off; every call is `.catch`-wrapped.

   | Event | Haptic |
   |---|---|
   | option select, true/false, tab switch, chip tap, story tap | `selection` |
   | sheet open, copy code | `light` |
   | correct answer, reward claimed, purchase, lesson complete, unlock | `success` (Android: `AndroidHaptics.Confirm`) |
   | wrong answer, life lost, "Kiwi insufficienti" | `error` (Android: `Reject`) |
   | exit confirm, 0 lives | `warning` |

**Signature moments**

| Moment | Technique | Tokens |
|---|---|---|
| Journey CTA shimmer | animated `LinearGradient` translateX loop | shimmerSweep + shimmerPause, easing.shimmer |
| Step change | keyed container SlideInRight/SlideOutLeft | stepIn/stepOut, out/exit |
| Answer feedback | Dialog zoom-fade, badge pop, haptic, wrong-option shake | dialogIn, bouncy |
| Info-row emojis | ZoomIn, staggered | 260 ms, +80 ms per row |
| Tab pill | shared-value x | spring.precise |
| Story segments | `withTiming(1, storyPage, linear)`; pause = `cancelAnimation`, resume with the remaining time | storyPage |
| Story group cube | horizontal paged `Animated.ScrollView`; per page `perspective W·2`, pivot translateX ±W/2, rotateY ±90° clamped, edge darkening mask; settles with snap paging | cube |
| AI typing | 3 dots, translateY −4 px with opacity 0.45→1, 150 ms stagger | typingDot |

Story input:
- A tap on the left 30% goes back; anything else goes forward.
- Long-press (500 ms) pauses and hides the chrome.
- Swipe down past 120 px or at > 800 px/s closes (scale to 0.9).

### 8.2 Bottom-sheet decision: build `Sheet` in-house (~150 lines, Reanimated 4 + RNGH)
**Why**

Every Finanz sheet has one content-sized detent plus dismiss (Lives, out-of-lives, Referral, Explain chat), so a multi-snap library is overkill. We also need identical behavior on iOS, Android and web, the same component inline inside the lesson, and full visual control (brand-tone sheets, overlapping badges).

**Rejected**
- **`@gorhom/bottom-sheet` 5.2.14.**
  - It is still developed against Reanimated 3, and its Reanimated 4 PR #2727 is unmerged.
  - Its default configs use spring rest thresholds that Reanimated 4 removed.
  - It has open web bugs: #2749 (fast swipe skips `onDismiss` on Safari) and #2440.
  - It is only re-evaluated if a scrollable multi-detent sheet appears, pinned to 5.2.14.
- **Expo Router `formSheet`.** Web modals are alpha behind a flag in SDK 57, and its look differs per platform.
- **TrueSheet.** It needs a dev build (native module), and its v4 is beta.

**Mechanics**

The mechanics combine the Reanimated docs `BottomSheet.js`, vaul's constants and the RNW Modal.
- **Host.** `host="modal"` wraps the sheet in `<Modal transparent animationType="none" statusBarTranslucent onRequestClose={close}>` with a `GestureHandlerRootView` inside (required on Android). On web this gives a portal, focus trap and Escape. `host="inline"` uses an absoluteFill `View` with `zIndex: z.sheet`.
- **Open.** The panel's height `h` is measured with `onLayout` into a shared value, with `y = h` initially. Opening runs `y = withTiming(0, { duration: sheetOpen, easing: sheet })`, then fires a light haptic.
- **Drag.** `Gesture.Pan()` on the grabber and header area:
  - `onUpdate`: `y = t > 0 ? t : t * 0.2` (rubber-band upward).
  - `onEnd`: close if `velocityY > 400` px/s **or** `y > 0.25·h` (vaul's thresholds); otherwise `withSpring(0, { ...spring.sheet, velocity: velocityY })`.
- **Close.** `withTiming(h, { duration: sheetClose, easing: exit }, done => done && scheduleOnRN(onClosed))`. Unmounting happens after `onClosed`, which resolves `sheets.close()`.
- **Backdrop.** `bg.scrim`, opacity `interpolate(y, [0, h], [1, 0], 'clamp')`. Tapping it closes the sheet when `dismissible`; while closing it sets `pointerEvents` to none.
- **Keyboard.** With `keyboard`, the content is wrapped in KeyboardAvoidingView (iOS `padding`). The chat input stays pinned above the keyboard, and the sheet grows up to 90%.
- **RNGH 3 migration.** When moving to SDK 58 / RNGH 3, port `Gesture.Pan()` to `usePanGesture` (`onStart`→`onActivate`, `onEnd`→`onDeactivate`). The Sheet API does not change.

**Dialog** reuses the same host logic, backdrop and Escape handling, centered with its zoom-fade in place of the drag.

### 8.3 Smoke tests to run once scaffolded
1. RN `Modal` sheets over tab and stack screens, and CTA→push chaining, on iOS, Android and web.
2. `FullWindowOverlay` toast above a modal on iOS.
3. Reanimated CSS transitions and animations on web (Safari and Chrome).
4. The story cube's `rotateY` with perspective in iOS Safari. If it glitches, use a scale transition (0.79/1/0.78) on web only.
5. Static web output renders the null splash on the server and hydrates on the client with no mismatch warnings.
6. `boxShadow` on Android.
