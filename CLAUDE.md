@AGENTS.md

# Finanz — project conventions

Duolingo-style personal-finance learning app. Italian UI copy. Product spec: `docs/PRODUCT_SPEC.md`.
Architecture & design-system decisions: `docs/ARCHITECTURE.md`. Art direction: `docs/DESIGN_DIRECTION.md`.

## Stack facts (verified in node_modules — do not guess)
- Expo SDK 57, React Native 0.86, React 19.2, TypeScript 6, **React Compiler enabled** (no manual
  `useMemo`/`useCallback` needed; never mutate props/state or read `sharedValue.value` during render).
- expo-router 57 (React Navigation is vendored inside it — there is no `@react-navigation/*` package):
  - `import { Stack, Link, router, useLocalSearchParams } from 'expo-router'`
  - JS tabs with a custom tab bar: `import { Tabs } from 'expo-router/js-tabs'` (the `Tabs` export
    from `'expo-router'` is deprecated). `tabBar={(props) => <FloatingTabBar {...props} />}`.
  - Stack screen `presentation`: `'card' | 'modal' | 'transparentModal' | 'fullScreenModal' | 'formSheet' ...`
- react-native-reanimated 4.5 + react-native-worklets 0.10: use `scheduleOnRN` from
  `'react-native-worklets'` to call JS from worklets (`runOnJS` is deprecated). `withSpring` config
  accepts either `{ damping, stiffness, mass }` or `{ duration, dampingRatio }` (mutually exclusive).
- react-native-gesture-handler 2.32 (`Gesture`, `GestureDetector`), safe-area-context 5.7,
  react-native-svg, expo-linear-gradient, expo-haptics, expo-clipboard, expo-sharing, expo-blur,
  expo-image, @react-native-async-storage/async-storage, zustand 5, lucide-react-native,
  @expo-google-fonts/bricolage-grotesque + plus-jakarta-sans.
- Everything must also work on **web** (react-native-web) — guard native-only APIs
  (`Platform.OS !== 'web'` for haptics; `expo-sharing` fallback to `navigator.share`/clipboard).
- All libraries used are in Expo Go (no custom native code) — keep it that way.

## Code conventions (from the template)
- File names kebab-case (`stat-chip.tsx`), components PascalCase named exports, `@/` alias → `src/`.
- Routes only in `src/app/`. Non-route code outside it.
- No hard-coded colours/spacing/radii/font sizes in screens: always use `@/theme` tokens and the
  `@/components/ui` primitives. If a value is missing, add a token instead of inlining it.
- Italian copy lives next to the feature (or in `src/data`) — keep strings consistent with the spec.
- Run `npx tsc --noEmit` and `npx expo lint` before declaring work done.
