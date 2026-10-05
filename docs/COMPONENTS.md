# Finanz UI kit: component reference

Screens are built **only** from these primitives plus the `@/theme` tokens. Read §0 first. Every
prop listed below exists in the code. If this document and the code disagree, the code wins.
Please report the mismatch so the document can be fixed.

```ts
import { Button, Card, Screen, Text } from '@/components/ui';
import { FloatingTabBar, StatusHeader, useTabBarInset } from '@/components/navigation';
import { haptics } from '@/lib/haptics';
import { isWeb, isIOS } from '@/lib/platform';
import { FlameIcon, HeartIcon, KiwiCoinIcon } from '@/components/icons';   // economy SVG icons (another package)
```

For visual QA, render `<UiShowcase />` from `@/components/ui/showcase` on a `/dev` route. It shows
every component in every state. It is dev-only and is not exported from the barrel.

---

## 0. Rules that apply to every component

| Rule | Detail |
|---|---|
| **Tokens only** | Colours come from `useTheme().colors` or `ColorToken` props. Spacing comes from `spacing`, radii from `radius`, type from `variant`, motion from `motion`. Control sizes come from the kit's metrics (`controlHeight`, `iconSize`, `tileSize`, `avatarSize`, …, exported from `@/components/ui`). Never inline hex values or pixel sizes in screens. |
| **Text** | `Text` / `AnimatedText` from the kit are the only text components. Never import `Text` from `react-native`. |
| **Colour mode** | `<Card variant="brand">` and `<Screen background="brand">` wrap their children in `ColorModeProvider mode="brand"`. Everything inside them picks brand tokens automatically: text turns white, `fill` becomes translucent white, the primary button gets a lime face. For any other dark surface, wrap it yourself: `<ColorModeProvider mode="brand">…</ColorModeProvider>` (from `@/theme`). |
| **`IconSource`** | Props named `icon`, `iconLeft`, `iconRight` and `leading` accept any of these: (1) a **Lucide component** (`icon={Share}`), which the kit renders with the right size, colour and stroke; (2) a **React element** (`icon={<KiwiCoinIcon size={16} />}`), rendered as-is, so you size it yourself; (3) a **string**, rendered as an emoji glyph at icon size. |
| **Tones** | `Tone = 'neutral' \| 'accent' \| 'brand' \| 'success' \| 'danger' \| 'warning' \| 'info' \| 'streak' \| 'lives' \| 'coin' \| 'shield' \| 'pro' \| 'mint' \| 'sky' \| 'blush' \| 'butter' \| 'lilac'`. `resolveTone(theme, tone)` returns `{ bg, fg, border, solid, onSolid }`. Chip, Tag, IconTile, Badge, Avatar and StatTile all use it. `ContentTone` from `@/content/types` (mint/sky/blush/butter/lilac) is a subset, so you can pass lesson row tones straight through. |
| **Haptics** | Pressables take `haptic?: 'selection' \| 'light' \| 'medium'`. Defaults: Button uses `light`; IconButton, Chip, ListItem, Radio, Switch and the tab bar use `selection`. Haptics are a no-op on web and when the user setting is off. For grading feedback, call `haptics.success()` / `haptics.error()` yourself. Dialog does this for you when it opens (see `haptic`). |
| **Reduced motion** | Every animated primitive checks `useReduceMotion()`, which is true when the OS setting or the in-app setting is on. Under reduced motion: no confetti, no shimmer, no scale-on-press (opacity feedback instead), no bumps or shakes, and counters jump straight to the value. The shell mirrors the app setting with `setReduceMotionOverride(settings.reduceMotion)`. |
| **Accessibility** | Icon-only controls **require** an Italian `accessibilityLabel` ("Indietro", "Chiudi", "Condividi", "Invia"). Buttons default the label to `title`. Headers use `accessibilityRole="header"`. react-native-web **ignores `accessibilityState`**. `PressableScale`, and every kit pressable built on it, translates the state into `aria-disabled`, `aria-selected`, `aria-checked`, `aria-busy` and `aria-expanded`, which work on iOS, Android and web. In your own Views, use `aria-*` props and `aria-hidden` rather than `accessibilityState` or `accessibilityElementsHidden`. |
| **Web** | Everything renders with react-native-web. `Screen`, `Sheet`, `Dialog`, `Toast` and the tab bar are constrained to `layout.maxContentWidth` (480) and centred. |
| **React Compiler** | No `useMemo` or `useCallback` needed. Never read `sharedValue.value` during render. Use `.get()` inside worklets and `.set()` in handlers. |

### Control geometry (exported from `@/components/ui`)
`controlHeight {sm 40, md 48, lg 56}` · `iconButtonSize {sm 36, md 40, lg 48}` ·
`iconSize {xs 14, sm 16, md 20, lg 24, xl 28}` · `iconStroke {regular 2, bold 2.5, heavy 3}` ·
`chipHeight {sm 28, md 34}` · `tileSize {sm 32, md 40, lg 48, xl 56}` ·
`avatarSize {xs 28, sm 36, md 44, lg 64, xl 88}` · `progressHeight {sm 6, md 10, lg 14}` ·
`radioSize {sm 20, md 24}` · `badgeSize {sm 16, md 20}` · `dialogBadgeSize 88` ·
`borderWidth {thin 1, regular 1.5, thick 2, ring 2.5}` · `hairline` · `readableWidth 320` ·
`uiOpacity {disabled .45, dimmed .55, pressed .72, …}` · `zIndex {tabBar, toast}`.

---

## 1. Typography & icons

### `Text`
The only file that imports RN `Text`. It accepts every RN `TextProps` plus the props below.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `TextVariant` | `'bodyMd'` | `displayXl`, `displayLg`, `displayMd`, `displaySm`, `titleLg`, `titleMd`, `titleSm`, `bodyLg`, `bodyMd`, `bodySm`, `labelLg`, `labelMd`, `labelSm`, `overline` (uppercase and tracked), `numeric` (tabular figures) |
| `color` | `ColorToken` | `'text'` | any semantic token: `textSecondary`, `textTertiary`, `accentText`, `brandText`, `dangerText`, `onAccent`, … |
| `align` | `'auto' \| 'left' \| 'center' \| 'right' \| 'justify'` | | |
| `weight` | `'regular' \| 'medium' \| 'semiBold' \| 'bold' \| 'extraBold'` | | keeps the variant's family (display or text face) |
| `tabular` | `boolean` | | tabular figures on any variant (always on for `numeric`) |
| `numberOfLines`, `style`, `ref`, `accessibilityRole`, … | RN | | `maxFontSizeMultiplier` defaults to 1.2 for display variants and 1.4 for the rest |

```tsx
<Text variant="displayMd" accessibilityRole="header">Academy</Text>
<Text variant="bodyMd" color="textSecondary" numberOfLines={2}>Completa una lezione per accendere la tua serie</Text>
<Text variant="overline" color="accentText">Livello 1 · Inflazione</Text>
```

- **`AnimatedText`** is the same API on `Animated.Text`. `style` accepts `useAnimatedStyle` results and Reanimated CSS-transition props.
- **`useTextStyle({ variant, color, align, weight, tabular })`** returns the resolved style array. Use it for a `TextInput` or any custom text.

### `Icon` / `renderIcon`
- `<Icon icon={Share} size="md" color="textSecondary" fill? strokeWidth? />` renders a themed Lucide icon. `size` is an `IconSizeToken` or a number, default `'lg'` (24).
- `renderIcon(source: IconSource, { size, color, strokeWidth?, fill? })` renders any `IconSource`. It is used inside primitives and is handy for custom ones.

---

## 2. Layout

### `Screen`
The root of every route. It handles background, safe areas, tab-bar clearance, the iOS keyboard, a sticky header and footer, and a centred column on web.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `preset` | `'scroll' \| 'fixed'` | `'scroll'` | `scroll` renders an `Animated.ScrollView` (keyboard taps persist, no scroll indicator) |
| `edges` | `Edge[]` | `['top']` | safe-area edges applied as padding. Add `'bottom'` on screens without a tab bar or footer |
| `background` | `'background' \| 'surface' \| 'brand'` | `'background'` | `brand` switches the whole screen to brand tokens |
| `withTabBar` | `boolean` | `false` | **tab screens**: pads the bottom by `useTabBarInset()` |
| `header` | `ReactNode` | | sticky, above the content, not padded (use `StatusHeader`) |
| `footer` | `ReactNode` | | sticky at the bottom, padded by the gutter and `max(safe inset, 16)`, or by the tab-bar inset when `withTabBar` |
| `padded` | `boolean` | `true` | horizontal gutter `layout.screenX` (20) on the content and footer |
| `keyboard` | `boolean` | `false` | `KeyboardAvoidingView` (iOS `padding`) |
| `statusBar` | `'light' \| 'dark'` | | renders an expo-status-bar |
| `contentContainerStyle` | style | | the scroll content container, or the content view in `fixed` |
| `scrollProps` | Animated.ScrollView props | | `onScroll` (from `useAnimatedScrollHandler`), `refreshControl`, … |
| `scrollRef`, `style` | | | |

```tsx
// Tab root
<Screen withTabBar header={<ConnectedStatusHeader />}>
  <ScreenTitle title="Academy" />
  …
</Screen>

// Pushed page with a sticky CTA
<Screen edges={['top']} header={<StatusHeader onBack={router.back} … />}
        footer={<Button title="Invita un amico" fullWidth onPress={share} />}>
  …
</Screen>

// Brand full-screen (lesson completion)
<Screen background="brand" preset="fixed" edges={['top', 'bottom']} statusBar="light">…</Screen>
```

### `ScreenTitle`
`title: string`, `subtitle?: string`, `trailing?: ReactNode` (sits on the title row, e.g. the Shop countdown Chip), `style`.
It renders `displayMd` with margin top `xs` and margin bottom `lg`, as in the redlines.
```tsx
<ScreenTitle title="Shop" trailing={<Chip label="23:59:12" icon={Clock} variant="surface" />} />
```

### `SectionHeader`
| Prop | Type | Default |
|---|---|---|
| `title` | `string` | |
| `variant` | `'overline' \| 'title'` | `'overline'` ("MENU", "ALTRO") · `title` renders `titleMd` ("📖 Continua a studiare") |
| `emoji` | `string` | placed before the title |
| `action` | `{ label, onPress } \| ReactNode` | a text action ("Vedi tutti") in `brandText`, or any node |
| `style` | | |

```tsx
<SectionHeader variant="title" emoji="📖" title="Continua a studiare" action={{ label: 'Vedi tutti', onPress: openAll }} />
```

### `VStack` / `HStack` / `Spacer`
`VStack` and `HStack` take `ViewProps` plus these props: `gap: SpacingToken` (default `'none'`), `align` (for `HStack` the default is `'center'`), `justify`, `wrap`, `padding`, `paddingX`, `paddingY` (all `SpacingToken`), and `flex` (boolean, `flex: 1`).
`<Spacer size="md" />` adds a fixed gap. `<Spacer />` with no `size` fills the free space.
```tsx
<HStack gap="xs" justify="space-between"><Text>Livello 3</Text><Text variant="numeric">120/200 XP</Text></HStack>
```

### `Divider`
`vertical?`, `inset?: number` (start inset in pt), `spacing?: SpacingToken` (margin on both sides of the line), `color?: ColorToken` (default `borderSubtle`), `thickness?` (default hairline), `style`.

---

## 3. Actions

### `Button`
A pill-shaped CTA. The label is `labelMd` for `sm` and `labelLg` for `md` and `lg`. Colours glide between enabled, pressed and disabled with CSS transitions.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title` | `string` | | required |
| `onPress` | `() => void` | | |
| `variant` | `'primary' \| 'brand' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger'` | `'primary'` | primary is a lime face with an evergreen label · brand is evergreen with a white label · secondary is surface with a border and a small shadow · outline is transparent with `borderStrong` · ghost is text only · danger is red with a white label |
| `size` | `'sm' \| 'md' \| 'lg'` | `'lg'` | heights 40 / 48 / 56 |
| `disabled` | `boolean` | | primary becomes a pale `accentBg` face with a `textTertiary` label (the lesson "Continua" before an answer is picked) |
| `loading` | `boolean` | | shows a spinner, keeps the width, blocks presses, sets `busy` |
| `iconLeft` / `iconRight` | `IconSource` | | |
| `fullWidth` | `boolean` | | `alignSelf: 'stretch'`. In a row, use `style={{ flex: 1 }}` instead |
| `shimmer` | `boolean` | | a light sweep that loops every `shimmer + shimmerPause` ms. Off when disabled or under reduced motion |
| `glow` | `boolean` | | `elevation.accentGlow`. Use it for the primary button on brand surfaces |
| `haptic` | `'selection' \| 'light' \| 'medium' \| false` | `'light'` | |
| `accessibilityLabel`, `accessibilityHint`, `testID`, `style` | | | |

```tsx
<Button title="Continua" disabled={phase === 'idle'} fullWidth onPress={check} />
<Button title="Continua il tuo viaggio!" shimmer glow fullWidth onPress={openCourse} />      // inside a brand Card
<Button title="Acquista" iconRight={<KiwiCoinIcon size={20} />} loading={buying} onPress={buy} />
<Button title="Chiudi" variant="danger" size="md" onPress={close} />
```

### `IconButton`
A circular, icon-only button. `hitSlop` grows the touch target to at least 44 pt.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `icon` | `IconSource` | | |
| `accessibilityLabel` | `string` | | **required** |
| `onPress` | | | |
| `variant` | `'plain' \| 'surface' \| 'brand' \| 'accent' \| 'glass'` | `'surface'` | surface is white with a hairline border and a small shadow (back button) · plain has no background (lesson header X / flag / share) · brand is evergreen with a glow (AI button) · accent is lime (chat send; disabled turns grey) · glass is translucent fill (on brand or story backgrounds) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 36 / 40 / 48 |
| `disabled`, `iconColor?: ColorToken`, `badge?: number \| true` (count, or a dot when `true`), `haptic` (default `'selection'`), `accessibilityHint`, `testID`, `style` | | | |

```tsx
<IconButton icon={ArrowLeft} accessibilityLabel="Indietro" onPress={router.back} />
<IconButton icon={Send} variant="accent" disabled={!draft.trim()} accessibilityLabel="Invia" onPress={send} />
```

### `PressableScale`
The press primitive behind everything else. It scales down on press-in (a short timing) and springs back (`spring.snappy`).
It accepts every RN `PressableProps`, plus: `scaleTo?: 'large' (0.97, default) | 'small' (0.93) | number | false`,
`dimOnPress?: boolean` (dims to `uiOpacity.pressed`), `haptic?`, `style`, `ref`. Web gets a pointer cursor.
```tsx
<PressableScale onPress={openStory} scaleTo="small" haptic="selection" accessibilityLabel="Storia Academy">…</PressableScale>
```

---

## 4. Surfaces & content

### `Card`
| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `'surface' \| 'elevated' \| 'brand' \| 'accent' \| 'locked' \| 'outline'` | `'surface'` | surface is white with a hairline border and `elevation.sm`, radius xl · elevated uses `elevation.md` · **brand** is an evergreen gradient with radius xxl, and its children switch to brand tokens · accent is `accentBg` with `accentBorder` (a reached milestone) · locked is a `fill` background with children dimmed to 55 % · outline is a transparent 1 pt border |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'lg'` | 0 / 12 / 16 / 20 |
| `spotlight` | `boolean` | | brand only: a radial lime glow falling from the top edge |
| `radius` | `RadiusToken` | | overrides the corner radius (default xl, or xxl for brand) |
| `onPress`, `disabled`, `haptic` | | | makes the whole card a `PressableScale` (0.97) |
| `style` | | | the outer box (width, margins, `flex`) |
| `contentStyle` | | | the inner layout (`gap`, `flexDirection`, `alignItems`) |
| `accessibilityLabel`, `accessibilityHint`, `testID` | | | |

```tsx
<Card variant="brand" spotlight padding="lg" contentStyle={{ gap: spacing.md }}>
  <HeroBookSpotlight />
  <Text variant="overline" color="accentText">Livello 1 · Inflazione</Text>
  <Text variant="displaySm">Il tuo percorso personale!</Text>
  <ProgressBar value={1 / 13} size="sm" tone="accent" />
  <Button title="Continua il tuo viaggio!" shimmer glow fullWidth onPress={go} />
</Card>
<Card variant="locked" padding="sm" style={{ flex: 1 }}>…</Card>
```
For image bands such as Shop product art, use `padding="none"` with `style={{ overflow: 'hidden' }}`, then add your own padded body.

### `Spotlight`
A standalone radial light, to use inside any clipped container (streak header, story page).
Props: `origin?: {x,y}` (fractions, default top-centre), `reach?: {x,y}`, `colors?: [inner, outer]` (default `gradients.heroSpotlight`), `style`. It ignores touches.

### `ListItem` (alias `MenuRow`)
| Prop | Type | Default | Notes |
|---|---|---|---|
| `title` | `string` | | `titleSm`, 1 line |
| `subtitle` | `string` | | `bodySm textSecondary`, 1 line |
| `icon` / `emoji` | `IconSource` / `string` | | leading 40 pt tinted `IconTile` |
| `iconTone` | `Tone` | `'neutral'` | Account menu tints: Impostazioni neutral, Lingua sky, Acquisti blush, Pro lilac, Invita mint |
| `leading` | `ReactNode` | | replaces the tile (for example an `Avatar`) |
| `value` | `string` | | secondary value placed before the chevron ("Italiano") |
| `trailing` | `ReactNode \| 'chevron' \| 'none'` | `'chevron'` when pressable | Switch, Badge, Chip, … |
| `onPress`, `disabled`, `haptic` (default `'selection'`) | | | pressed rows tint to `fill` |
| `destructive` | `boolean` | | title in `dangerText` (Esci) |
| `variant` | `'plain' \| 'card'` | `'plain'` | `plain` goes inside a `ListGroup` · `card` is its own white card (profile row) |
| `accessibilityLabel`, `accessibilityHint`, `testID`, `style` | | | |

Rows are at least 64 pt tall. A row that is not pressable and has a custom `trailing` control stays reachable by screen readers.

### `ListGroup`
An iOS-style grouped card. Hairline dividers are inset to the row text.
Props: `children` (ListItems), `title?` (renders a `SectionHeader` overline above the card), `action?` (header action), `dividerInset?: number` (`0` = full width), `style`.
```tsx
<ListGroup title="Menu">
  <ListItem icon={Settings} title="Impostazioni" subtitle="Modifica le impostazioni" onPress={…} />
  <ListItem icon={Globe} iconTone="sky" title="Lingua e Paese" value="Italiano" onPress={…} />
  <ListItem icon={Vibrate} iconTone="mint" title="Vibrazione"
            trailing={<Switch value={haptics} onValueChange={setHaptics} accessibilityLabel="Vibrazione" />} />
</ListGroup>
<ListItem variant="card" leading={<Avatar emoji="🤠" tone="butter" />} title="alberto" subtitle={email} onPress={…} />
```

### `IconTile` / `EmojiTile`
A tinted rounded square holding a glyph. Props: `icon?: IconSource`, `emoji?: string`, `tone?: Tone` (default `'brand'`),
`size?: 'sm' | 'md' | 'lg' | 'xl'` (32 / 40 / 48 / 56, default `md`), `solid?` (solid fill with a contrasting glyph), `round?` (circle), `style`.
`<EmojiTile emoji="📚" tone="mint" />` is shorthand for an emoji tile. Use tiles instead of bare emoji in UI chrome.

### `Avatar` / `StoryRing`
`Avatar` props: `emoji?`, `name?` (initials fallback: "Alberto Rossi" becomes "AR"), `size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number` (28 / 36 / 44 / 64 / 88, default `md`),
`tone?: Tone` (background, default `accent`), `ring?: 'unseen' | 'seen'`, `ringGapColor?: ColorToken` (match the surface underneath, default `background`),
`onPress?` (becomes a pressable at 0.93), `accessibilityLabel?`, `style`.
`StoryRing` props: `children`, `size` (content diameter), `seen?` (a `border` grey ring instead of the lime→mint gradient), `thickness?`, `gap?`, `gapColor?`, `style`.
```tsx
<Avatar emoji="📚" size="lg" tone="mint" ring={seen ? 'seen' : 'unseen'} onPress={open} accessibilityLabel="Storia Academy" />
```

### `StatTile`
Icon, then a large value, then a small label. Use 2–3 per row (Account stats, lesson completion). On brand surfaces it turns into a raised evergreen tile.
Props: `icon?: IconSource`, `value: ReactNode` (a string or number renders as tabular `titleLg`, or `displaySm` when `size="lg"`; you can also pass a `CountUp`),
`label: string`, `tone?: Tone` (icon colour for Lucide or emoji icons), `size?: 'md' | 'lg'`, `style`. It uses `flex: 1`, so put tiles in a row.
```tsx
<HStack gap="xs"><StatTile icon="⚡" value="120" label="XP totali" /><StatTile icon={<KiwiCoinIcon size={24} />} value="1.250" label="Kiwi" /></HStack>
```

### `EmptyState`
Props: `title`, `message?`, `illustration?: ReactNode` (or `emoji?` for an xl round tile tinted by `tone`, default accent),
`action?: { label, onPress, variant? }` (md Button, default primary), `secondaryAction?: { label, onPress }` (ghost),
`compact?` (tighter, for cards and sheets), `style`. It fades in.

---

## 5. Chips, tags, badges, counters

### `Chip`
| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` / `children` | `string` / `ReactNode` | | children replace the label (for example a `RollingNumber`) |
| `icon` / `iconRight` | `IconSource` | | |
| `tone` | `Tone` | `'neutral'` | |
| `variant` | `'soft' \| 'outline' \| 'solid' \| 'surface'` | `'soft'` | `surface` is the white hairline chip with a shadow (status row, amount pills) |
| `size` | `'sm' \| 'md'` | `'md'` | 28 / 34 |
| `selected` | `boolean` | | filter chips: selected renders `solid` |
| `onPress`, `disabled`, `haptic` (default `'selection'`), `accessibilityLabel`, `accessibilityHint`, `textVariant`, `style` | | | |

```tsx
<Chip label="13 capitoli" icon={BookOpen} size="sm" />
<Chip label="+500" icon={<KiwiCoinIcon size={16} />} variant="surface" />
<Chip label="Gratuito" iconRight="🎁" tone="accent" size="sm" />
```

### `StatChip`
An economy counter: a white pill 34 pt high, with a tabular value that rolls when it changes. When the value changes, the chip bumps (1 → 1.18 → 1, `spring.bouncy`). When the value drops, it also shakes.
Props: `kind: 'streak' | 'lives' | 'coins'`, `value: number`, `onPress?`, `unlimited?` (lives: ∞ with a gold heart),
`icon?: ReactNode` (**pass the economy SVG icon**, otherwise a Lucide Flame / Heart / Circle is used), `muted?` (greys the icon; defaults to true for a 0-day streak), `accessibilityLabel?`, `style`.
```tsx
<StatChip kind="lives" value={lives} onPress={openLivesSheet} icon={<HeartIcon size={iconSize.md} muted={lives === 0} />} />
```
Use `StatusHeader` instead of assembling chips yourself.

### `Tag`
An overline pill: "🎩 INDOVINA", "⭐ BASE", "PRO". For `butter`, the soft background is `warningBg` (the video's yellow pill), because `tintButter` is too pale at pill size. Props: `label`, `emoji?`, `icon?: IconSource`, `tone?: Tone` (default `'butter'`),
`solid?`, `size?: 'sm' | 'md'` (22 / 28, default md), `style`.
```tsx
<Tag emoji="🎩" label="Mettiti alla prova" />      <Tag label="Pro" tone="pro" solid size="sm" />
```

### `Badge`
A count pill or a dot, with a surface-coloured ring. Props: `count?` (omit it for a dot), `max?` (default 99, shown as "99+"), `tone?` (default danger),
`size?: 'sm' | 'md'`, `ring?` (default true), `accessibilityLabel?`, `style`. You position it yourself, or use `IconButton badge`.

### `RollingNumber`
Digits roll when the value changes (up from below for increases, down from above for decreases). Props: `value`, `format?` (default Italian grouping, e.g. `1.500`, `125k`),
`variant?` (default `numeric`), `color?`, `textStyle?`, `style`.

### `CountUp`
Counts from `from` (default 0) to `value` once when it mounts. Later changes to `value` count on from the number currently shown.
Props: `value`, `from?`, `duration?` (default `motion.duration.celebration`), `delay?`, `format?` (e.g. ``(n) => `+${n}` ``),
`variant?` (default `displayXl`), `color?`, `align?`, `onDone?`, `style`.
```tsx
<CountUp value={streak} color="accentText" align="center" />   // streak hero
<CountUp value={xp} format={(n) => `+${n}`} variant="displaySm" delay={300} />
```

---

## 6. Progress & loading

### `ProgressBar`
Props: `value: number` (0…1, clamped), `size?: 'sm' | 'md' | 'lg'` (6 / 10 / 14, default md),
`tone?: 'brand' | 'accent' | 'streak' | 'lives' | 'success'` (default brand, the evergreen lesson bar),
`highlight?` (glossy sheen, on by default for md and lg), `animateOnMount?` (default true), `accessibilityLabel?`, `style`.
The fill animates with `duration.progress` and `easing.enter`, and becomes a pill as soon as the value is above 0.
```tsx
<ProgressBar value={index / steps.length} tone="brand" accessibilityLabel="Avanzamento lezione" />
```

### `SegmentedProgress`
Story bars. Props: `count`, `activeIndex`, `progress: SharedValue<number>` (0…1 for the active segment, driven by your timer on the UI thread),
`tone?: 'light' | 'dark'` (white bars on dark or photo backgrounds, ink bars on light ones), `style`.
```tsx
const progress = useSharedValue(0);
useEffect(() => { progress.set(0); progress.set(withTiming(1, { duration: motion.duration.storySegment, easing: Easing.linear }, (done) => { if (done) scheduleOnRN(next); })); }, [index]);
<SegmentedProgress count={pages.length} activeIndex={index} progress={progress} />
```

### `TypingDots`
Three staggered dots. Props: `color?: ColorToken` (default brandText), `size?` (default 8), `bubble?` (renders inside an assistant chat bubble),
`accessibilityLabel?` (default "Sta scrivendo"), `style`.

### `Skeleton` / `SkeletonText`
`Skeleton` props: `width?` (default 100 %), `height?` (default 16), `size?` (square, or the circle diameter), `circle?`, `radius?: RadiusToken` (default sm),
`shimmer?` (adds a sweep on top of the opacity pulse), `style`. `SkeletonText` props: `lines?` (default 3), `lineHeight?`, `gap?`, `lastLineWidth?` (0.6), `style`.

### `Shimmer`
A reusable sweep overlay. Put it as the first child of a container with `overflow: 'hidden'`, or pass `borderRadius`.
Props: `active?` (default true), `duration?`, `pause?`, `delay?`, `bandRatio?`, `borderRadius?`, `intensity?` (0–1), `style`. It renders nothing under reduced motion.

### `Confetti`
A particle burst of about 40 pieces in lime, forest, gold, orange and rose. It fills its parent (absolute) and ignores touches.
Props: `run: boolean` (a new burst fires every time it turns true), `origin?: {x,y}` (fractions, default `{0.5, 0.35}`), `count?`, `colors?`,
`duration?` (default 2 × celebration), `onComplete?`, `style`. Under reduced motion it renders nothing and calls `onComplete` right away.
```tsx
<View style={{ flex: 1 }}>…<Confetti run={phase === 'completed'} origin={{ x: 0.5, y: 0.3 }} /></View>
```

---

## 7. Inputs

### `TextField`
A rounded field on a soft `fill` background. Focus draws a 2 pt evergreen ring (lime on brand surfaces). An error draws a red ring and shows the message. It accepts every RN `TextInputProps` except `style`, `editable` and `placeholderTextColor`, plus the props below.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | | `labelMd textSecondary`, placed above the field |
| `helper` | `string` | | hint below the field |
| `error` | `string \| boolean` | | a string shows a message that replaces the helper · `true` shows the red ring only |
| `leading` | `IconSource` | | icon inside the field, before the text (tertiary colour) |
| `trailing` | `ReactNode` | | inside, after the text (send `IconButton`, clear button) |
| `size` | `'md' \| 'lg'` | `'lg'` | 48 / 56 |
| `shape` | `'rounded' \| 'pill'` | `'rounded'` | pill is for the chat composer. Its radius is half the resting height, so a multiline composer grows into a soft rounded box |
| `variant` | `'fill' \| 'surface'` | `'fill'` | `surface` is white with a hairline border, for tinted or gradient backgrounds |
| `align` | `'left' \| 'center'` | `'left'` | centre it for the redeem code |
| `textVariant` | `TextVariant` | `'bodyLg'` | |
| `showCount` | `boolean` | | "12/40" when `maxLength` is set |
| `disabled` | `boolean` | | |
| `multiline` | `boolean` | | grows up to 128 pt (on web too: it starts at 1 row and grows with the content). Adornments stay on the last line |
| `ref` | `Ref<TextInput>` | | |
| `style` / `fieldStyle` / `inputStyle` | | | outer container / field box / text (e.g. `letterSpacing`) |

```tsx
// Chat composer (Assistant tab, "Spiegami il perchè" sheet footer)
<TextField shape="pill" variant="surface" multiline placeholder="Chiedi qualcosa..." value={draft} onChangeText={setDraft}
  trailing={<IconButton icon={Send} variant="accent" disabled={!draft.trim()} accessibilityLabel="Invia" onPress={send} />} />
// Redeem code
<TextField label="Codice" align="center" autoCapitalize="characters" maxLength={8} textVariant="titleLg" error={codeError} value={code} onChangeText={setCode} />
```
Wrap forms in `<Screen keyboard>`. The sheet already avoids the keyboard.

### `Radio`
The selection indicator. When it turns on, a solid disc pops in (`spring.bouncy`) with a bold check.
Props: `selected: boolean`, `size?: 'sm' | 'md'` (20 / 24), `tone?: 'accent' | 'brand'` (default accent, a lime disc with an evergreen check),
`shape?: 'circle' | 'square'` (square is the checkbox look), `disabled?`, `onPress?` (standalone use: pressable with the radio or checkbox role), `accessibilityLabel?`, `style`.

### `ChoiceRow`
A selectable card row with a trailing Radio. Use it for story polls, onboarding answers and settings pickers. It is **not** for graded lesson options: the lesson feature owns an OptionTile with correct and wrong states.
Props: `label`, `description?`, `selected`, `onPress`, `multiple?` (checkbox look and role), `emoji?` / `icon?` with `iconTone?` (a leading 32 pt tile),
`trailing?` (replaces the radio), `tone?: 'accent' | 'brand'`, `labelVariant?` (default `labelLg`; use `bodyMd` for long poll answers),
`disabled?`, `accessibilityHint?`, `testID?`, `style`.
```tsx
{options.map((o) => <ChoiceRow key={o.id} label={o.label} labelVariant="bodyMd" selected={answer === o.id} onPress={() => setAnswer(o.id)} />)}
```

### `Switch`
Props: `value`, `onValueChange(next)`, `disabled?`, `accessibilityLabel?` (pass the row title), `testID?`, `style`.
It is evergreen when on over light surfaces and lime over brand surfaces. The thumb springs across with `spring.snappy`.

---

## 8. Overlays

### `Sheet`
A custom Reanimated bottom sheet inside a transparent RN `Modal`, so it covers tabs and stacks. It has a grabber and a radius-xxl top, and follows the vaul curve.
| Prop | Type | Default | Notes |
|---|---|---|---|
| `visible` | `boolean` | | |
| `onClose` | `() => void` | | called **after** a user-initiated dismiss has finished animating (drag down, scrim tap, Android back). Set `visible` to false here |
| `onClosed` | `() => void` | | called after any exit, just before unmount |
| `title` | `string` | | `titleLg`, centred |
| `dismissible` | `boolean` | `true` | when false: no drag, no scrim tap, no back dismiss |
| `maxHeight` | `number` | `0.9` | fraction of the window |
| `scrollable` | `boolean` | | wraps the children in a ScrollView. Dragging then works from the handle and title only |
| `dragArea` | `'sheet' \| 'handle'` | `'sheet'` | |
| `footer` | `ReactNode` | | sticky bottom area (chat input, CTA row) |
| `keyboard` | `boolean` | `true` | iOS KeyboardAvoidingView |
| `background` | `'surface' \| 'background'` | `'surface'` | |
| `contentStyle`, `accessibilityLabel` | | | |

Behaviour: the scrim fades in, and the sheet measures its own height and slides up (`duration.sheet`, `easing.sheet`). Dragging down dismisses it when the velocity is above 400 or the drag passes 25 % of the height. Otherwise it springs back (`spring.sheetRelease`). Dragging up rubber-bands.
Setting `visible={false}` from the parent also animates out before unmounting.
```tsx
<Sheet visible={sheet === 'lives'} onClose={closeSheet} title="Vite">
  <LivesContent />
  <Button title="Continua" fullWidth onPress={closeSheet} />
</Sheet>
```
Global sheets (lives, referral, rate, redeem) are rendered by `<GlobalOverlays/>` from `useUi().sheet`. Screens call `openSheet(name)`.

### `Dialog`
A modal card with an overlapping 88 pt badge that pops in with `spring.bouncy`. On phones it is anchored to the bottom, like the video. On tablet and web widths it is centred.
| Prop | Type | Default | Notes |
|---|---|---|---|
| `visible`, `onClose` | | | `onClose` fires from ✕, the scrim (when `dismissible`) and Android back |
| `onClosed` | | | after the exit animation |
| `tone` | `'success' \| 'danger' \| 'warning' \| 'neutral'` | `'neutral'` | badge colours, the default primary variant (danger uses `danger`) and the notification haptic on open |
| `badge` | `'success' \| 'danger' \| 'warning' \| { type: 'emoji', emoji } \| { type: 'node', node }` | | ✓ / ✕ / ! glyph presets |
| `icon` | `ReactNode` | | shorthand for `badge={{ type: 'node', node }}` (e.g. `<TrophyIcon size={56} />`) |
| `title` | `string` | | `displaySm`, centred |
| `message` | `ReactNode` | | a string renders as `bodyMd textSecondary` |
| `children` | | | extra content placed before the actions |
| `primaryAction` / `secondaryAction` | `DialogAction` | | `{ label, onPress, variant?, loading?, disabled?, iconLeft? }`. Secondary defaults to `outline` |
| `showClose` | `boolean` | `true` | ✕ in the top-right corner |
| `dismissible` | `boolean` | `true` | |
| `placement` | `'auto' \| 'bottom' \| 'center'` | `'auto'` | |
| `haptic` | `boolean` | `true` | success / error / warning haptic when it opens |
| `style` | | | |

```tsx
<Dialog visible={phase === 'feedback-wrong'} onClose={retry} tone="danger" badge="danger"
  title="Risposta errata" message="Hai perso una vita."
  primaryAction={{ label: 'Riprova', onPress: retry }}
  secondaryAction={{ label: 'Spiegami il perchè ✨', onPress: explain, variant: 'ghost' }} />
<Dialog visible={exitOpen} onClose={stay} tone="warning" badge={{ type: 'emoji', emoji: '🥺' }}
  title="Aspetta, non uscire!" primaryAction={{ label: 'Continua la lezione', onPress: stay }}
  secondaryAction={{ label: 'Esci', onPress: exit, variant: 'ghost' }} />
```
Keep the content stable while the dialog animates out: flip `visible`, not the props.

### Toast (`ToastHost`, `toast`, `useToast`)
Shows one toast at a time. It slides down from under the top safe area, hides itself after `duration.toast`, and hides on tap. It is an evergreen pill with a tone icon.
- `toast.show(message | { message, tone?: 'neutral' | 'success' | 'danger' | 'warning' | 'info', icon?: IconSource, duration? })` returns an id. `toast.hide(id?)`. `useToast()` returns the same object.
- Mount **one** `<ToastHost />` at the root, after the navigator.
- **Controlled mode** lets you bridge the app store: `<ToastHost toast={useUi((s) => s.toast)} onHide={useUi((s) => s.hideToast)} />`. The store's `{ id, message, tone, icon }` shape fits directly.
- Known limit: on native, a toast renders under an open RN `Modal` (Sheet or Dialog). Show toasts after closing the overlay.

---

## 9. Navigation (`@/components/navigation`)

### `FloatingTabBar`
A custom `tabBar` for `Tabs` from `'expo-router/js-tabs'`. It is a white floating pill (height `layout.tabBarHeight`, side inset 16, bottom = safe inset + 8, `elevation.lg`). The active tab sits on a lime pill that slides between items with `spring.snappy`. As it does, the item widens and reveals its label.
Routes are mapped as `index` → House "Home", `academy` → BookOpen "Academy", `assistant` → MessageCircle "Coach", `shop` → ShoppingCart "Shop". Other routes use their `title` and a neutral icon.
It honours `href: null` (hidden routes), `tabBarBadge`, `tabBarLabel` (string), `tabBarAccessibilityLabel`, `tabBarButtonTestID`,
`tabBarStyle: { display: 'none' }` (hides the bar), and `tabBarHideOnKeyboard` (default true on Android). Every press emits `tabPress` (which can be prevented) and fires a selection haptic.
```tsx
// src/app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router/js-tabs';
import { FloatingTabBar } from '@/components/navigation';
export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <FloatingTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" /><Tabs.Screen name="academy" /><Tabs.Screen name="assistant" /><Tabs.Screen name="shop" />
    </Tabs>
  );
}
```
The bar floats over the screens (it is absolutely positioned), so **every tab screen must clear it**: use `<Screen withTabBar>`, or `paddingBottom: useTabBarInset()` on custom scroll views.
For anything floating above the bar (the Assistant composer), use `getTabBarBottomOffset(insets.bottom) + layout.tabBarHeight + spacing.sm` as its `bottom`.

### `useTabBarInset()` / `getTabBarInset(safeBottom)` / `getTabBarBottomOffset(safeBottom)`
- `useTabBarInset()` is the bottom padding a tab screen needs: bar offset + bar height + `spacing.lg`.
- `getTabBarBottomOffset(safeBottom)` is the distance from the screen bottom to the bar's bottom edge.

### `StatusHeader`
A **presentational** chips row, `layout.headerHeight` (56) tall with padding `screenX`. It has an optional left slot, then the streak, lives and coins `StatChip`s (always in that order, with the economy SVG icons), then a 36 pt avatar. It never reads the store: the shell provides a connected wrapper.
| Prop | Type | Default |
|---|---|---|
| `streak`, `lives`, `coins` | `number` | `0` |
| `unlimited` | `boolean` | `false` (lives chip shows ∞ with the gold heart) |
| `stats` | `StatKind[]` | `['streak', 'lives', 'coins']`. The lesson header uses `['lives', 'coins']` |
| `onStreakPress`, `onLivesPress`, `onCoinsPress`, `onAvatarPress` | `() => void` | |
| `showAvatar` | `boolean` | `true` |
| `avatarEmoji`, `avatarName` | `string` | |
| `left` | `ReactNode` | overrides `onBack` |
| `onBack` | `() => void` | renders a surface back button ("Indietro") |
| `style` | | |

```tsx
<StatusHeader streak={streak} lives={lives} coins={coins} unlimited={isUnlimited} avatarEmoji={avatar}
  onStreakPress={() => router.push('/streak')} onLivesPress={() => openSheet('lives')} onAvatarPress={() => router.push('/account')} />
// Lesson header
<StatusHeader stats={['lives', 'coins']} lives={lives} coins={coins} showAvatar={false}
  left={<><IconButton icon={X} variant="plain" accessibilityLabel="Chiudi lezione" onPress={askExit} />
          <IconButton icon={Flag} variant="plain" accessibilityLabel="Segnala" onPress={report} />
          <IconButton icon={Share} variant="plain" accessibilityLabel="Condividi" onPress={share} /></>} />
```

---

## 10. Motion helpers & libs

- `useShake()` returns `{ style, shake }`: a horizontal shake for wrong answers. Put `style` on an `Animated.View` and call `shake()`.
- `useBump(peak?)` returns `{ style, bump }`: a scale bump for rewards and value changes.
- The worklet builders `bumpAnimation()`, `shakeAnimation()` and `popAnimation()`, plus `feedbackMotion` (their amplitudes), are for custom shared values.
- `useReduceMotion()` and `setReduceMotionOverride(forced)`: see §0.
- For layout animations, use `FadeIn.duration(motion.duration.base).easing(motion.easing.enter)` and similar. **Do not use `.springify()`**, because web ignores it.
- `@/lib/haptics` exports `haptics.selection | light | medium | heavy | success | warning | error`, `triggerHaptic(kind)` and `setHapticsEnabled(bool)`, which the shell calls from `settings.haptics`. All of them are no-ops on web.
- `@/lib/platform` exports `isWeb`, `isIOS`, `isAndroid`, `isNative` and `platformSelect({ ios?, android?, web?, native?, default })`.

## 11. Screen recipes (quick reference)

| Screen part | Build it with |
|---|---|
| Home hero | `Card variant="brand" spotlight` + illustration + `Text overline accentText` + `displaySm` + `ProgressBar tone="accent" size="sm"` + `Button shimmer glow fullWidth` |
| Stories row | `Avatar size="lg" ring="unseen"/"seen" onPress` + a `labelSm` caption, in an `HStack gap="md"` |
| Milestones | 3 × `Card padding="sm" style={{flex:1}}` (variant `accent` when reached, `locked` when locked) + `ProgressBar size="sm"` |
| Lesson footer | `Screen footer={<Button title="Continua" disabled={!selected} fullWidth />}` |
| Feedback | `Dialog tone="success"/"danger" badge=…` (bottom-anchored) + `haptics` via the `haptic` prop |
| Completion | `Screen background="brand"` + `Confetti run` + `CountUp` + 3 × `StatTile size="lg"` + `Button glow` |
| Streak hero | `ColorModeProvider mode="brand"` block with `Spotlight`, `CountUp variant="displayXl" color="accentText"`, glass `IconButton`s |
| Account | `ScreenTitle` + `ListItem variant="card"` (profile) + `StatTile` row + `ListGroup` groups + `Switch` rows |
| Shop product | `Card padding="none"` + a tinted art band + `Chip variant="surface"` amount pill + `Text overline` + `titleMd` + price `Chip` |
| Assistant | `TypingDots bubble` + a `TextField shape="pill" variant="surface" multiline` composer placed above the tab bar |
| Polls / onboarding | `ChoiceRow` (single) / `ChoiceRow multiple` (multi) |
| Loading | `Skeleton` / `SkeletonText` shaped like the content |
