# Screen specs — lead-designer redlines

Companion to `DESIGN_DIRECTION.md`. Values reference tokens (`spacing.md` = 16, `layout.screenX` = 20…).
Principles for every screen: **one primary action per viewport**, clear top → bottom reading order,
generous whitespace, economy information always glanceable (status chips), and a satisfying
response to every tap (press scale + haptic + visual state change within 100 ms).

## Global chrome
- **Status header** (Home, Academy, Shop, Course, Account): height 56, padding x `screenX`. Left:
  back button (IconButton surface 40) or nothing. Right: chips gap `xs` (8), avatar 36 last.
  Chips are identical everywhere (same order: streak, lives, coins).
- **Screen title** (tab roots): `displayMd`, margin top `xs`, margin bottom `lg`.
- **Section header**: `titleLg` (or `overline` for list groups), margin top `sectionGap` (32),
  bottom `sm` (12). Optional right action as ghost `labelMd` link.
- **Tab bar**: floating pill; content bottom padding = `useTabBarInset()` + `lg`.
- Background canvas `background`; cards `surface`. Never put a card on a card of the same colour
  without a border.

## Home
1. Status header (no back). 
2. Greeting block: `titleLg` "Ciao Alberto 👋" + `bodyMd textSecondary` contextual line
   (streak 0 → "Completa una lezione per accendere la tua serie"; streak n → "Sei a n giorni di
   fila. Continua così!"). Margin bottom `lg`.
3. Stories row: circles 64 with 3 px ring + 2 px gap, label `labelSm` below, gap `md`. Left aligned.
   Margin bottom `xl`.
4. Hero card (brand, radius xxl, padding `xl`, min height ~340 on 390 w): illustration occupies top
   ~55 %, then `overline` (lime, "LIVELLO 1 · INFLAZIONE"), headline `displaySm` white
   "Il tuo percorso personale!", a thin progress bar (accent) with "1/13 capitoli" `labelSm`
   whiteA, CTA primary lg full width with shimmer + glow. The card must feel like a *place*, not
   a banner: subtle spotlight gradient, sparkles twinkle (opacity loop 2.4 s, staggered).
5. Milestones: section header "Traguardi" + `bodySm` "Sblocca premi completando le lezioni".
   3 equal cards in a row, gap `xs`, padding `sm`, radius lg: reward icon 36 on a tinted circle
   (locked = muted icon + small LockIcon badge), `labelSm` "Sblocca dopo 2 lezioni" (2 lines max,
   centred), mini progress bar sm. Reached → accent border + "Riscatta" `labelSm` accentText +
   gentle pulse. Claimed → success check badge + "Riscattato".

## Story viewer
- Full bleed; segments 3 px, gap 4, top = safe inset + `xs`, side `sm`. Header row below (avatar 32,
  `titleSm`, spacer, share + close glass IconButtons 36).
- Content padding x `xl`. Titles `displayLg` (mint pages: mint12-ish teal via `tintMintText`;
  brand pages: lime). Body `bodyLg` centred for mint pages; timeline cards: surface white, radius lg,
  padding `md`, `bodyLg` centred with bold emphasis, max width 86 %, alternating alignment,
  dashed connector (2 px, whiteA6, dash 6/6) between cards; emoji stickers 36 overlapping corners.
- Stickers: rotated −6°…−10°, radius lg, solid `tintMintText`/lime background, `titleSm` white.

## Course path
- Collapsing cover 220 → sticky bar 56. Title block padding x `screenX`: tier row (`overline`
  with star), title `displaySm`, progress bar md + "0 di 13 capitoli" `labelSm`.
- Level banner: full-width, radius lg, `fill` background, height 52, emoji tile 32 + "LIVELLO 1"
  `overline` + level title `titleSm` on the right side of the tile; margin y `xl`.
- Nodes: cards 44 % of width, square-ish (height ≈ width × 0.9), radius xl; alternate left/right
  with 12 % horizontal offset; vertical gap 28. Content centred: emoji tile 48 (circle, `fill`),
  title `titleSm` 2 lines. Connectors: dashed 2 px `border` colour, rounded elbows (radius 16).
- Current: accent border 2 px + `elevation.md` + glow pulse; tooltip pill below/above: brandSolid
  background, white `labelMd` uppercase "INIZIA DA QUI", caret 8 px, bobbing 4 px.
- Completed: `brandBg` background, emoji tile brand, small success check badge top-right.
- Locked: `fill` background, no shadow, LockIcon muted 24, title `textTertiary`.

## Lesson player
- Header: 3 IconButtons plain 40 (X, flag, share) left; lives + coins chips right. Progress bar md,
  margin x `screenX`, top `xs`.
- Graded card: surface, radius xxl, padding `lg`, margin x `md`, fills available height; tag pill
  centred at top; art 120–160 high; prompt `titleMd` centred (max 3 lines); options below with gap
  `sm`: OptionTile height ≥ 56, radius md, border 1.5 `border`, label `bodyLg` centred.
- Info steps: no card; emoji 32 inline before title `displaySm`; lead `titleSm`; rows radius md,
  padding `md`, gap `xs`, emoji 22 leading, `bodyMd`.
- Footer: hairline top border, padding `md`, CTA lg full width. FAB 56 bottom-right, 16 above the
  footer, brandSolid + sparkle; expanded pill "Spiegami il perchè ✨" (`labelLg`, height 52).
- Feedback dialog: bottom-anchored card (margin `md`, radius xxl, padding top 56 for the badge),
  badge 88 overlapping by 44; title `displaySm`; message `bodyLg` textSecondary; CTA lg.
- Completion: brand background full screen, confetti, headline `displayLg` lime, 3 stat tiles
  (surface raised on brand, radius xl, icon 28, value `displaySm`, label `labelSm`), streak strip,
  CTA primary lg with glow.

## Streak
- Brand header ~300 high incl. safe area: back/share glass buttons; number `displayXl` lime (count
  up 600 ms); "GIORNI DI FILA" `displayLg` lime; `bodyMd` whiteA line. Flame watermark right, 30 %
  opacity, cropped.
- Calendar card radius xl padding `lg`: month `titleMd` brandText centred with chevrons; weekday
  row `labelSm textTertiary`; day cells 40 circles; active = flame gradient fill + white numeric;
  consecutive active days joined by a 40 px band (streakBg); today = 2 px brandSolid ring.

## Shop
- Title row: "Shop" `displayMd` + countdown chip (clock icon + `labelMd`) aligned to the baseline.
- Product card: radius xl, overflow hidden; art band 150 high on tinted bg (daily = brand with kiwi
  pattern; shield = sky tint; life = blush tint; unlimited = butter tint), amount pill centred on
  the art (white, radius pill, `titleMd` + icon); body padding `md`: `overline` textTertiary,
  `titleMd`, price pill (fill bg, `numeric` + KiwiCoinIcon 16) — or "Gratuito 🎁".

## Account
- Profile card: avatar 56 + name `titleMd` + email `bodySm` + chevron; below a divider the level
  strip: BoltIcon + "Livello 3 · Risparmiatore" `labelMd` + progress bar sm + "120/200 XP".
- Stats row: 3 tiles (icon, `titleLg` value, `labelSm` label).
- Menu groups: ListGroup cards, rows 64 high, icon tiles 40 with tints: Impostazioni olive,
  Lingua sky, Acquisti blush, Pro lilac (GemIcon), Invita mint, Interessi blush; Altro group same.
- Logout: centred `labelLg` dangerText underlined, margin y `xxl`.

## Assistant
- Gradient bg; orb 120 centred at 22 % height when empty, shrinks to 56 at top when chatting.
- Messages: user bubble brandSolid radius lg (bottom-right radius xs), max 80 %; assistant text
  `bodyLg` with orb avatar 24; gap `md`. Input bar floating above the tab bar: surface pill 52,
  send button 40 accent when enabled.

## Sheets & dialogs
- Sheet: radius xxl top, grabber 36×5 `border`, padding x `lg`, bottom = safe inset + `lg`, title
  `titleLg` centred, max height 90 %.
- Lives sheet cards: two equal cards, radius xl, padding `md`, min height 150; selected PRO card has
  2 px pro border + check badge.
