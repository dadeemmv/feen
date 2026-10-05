# Finanz — Art direction (owner: lead product designer)

North star: *"What if a world-class consumer mobile team designed a Duolingo-like learning experience
for personal finance?"* — **playful + premium + trustworthy**. Keep the video's DNA (deep green + lime,
kiwi-coin currency, heavy display headlines) but execute it with far more restraint, hierarchy and
polish. Never childish, never bank-corporate.

## Brand pillars → visual rules
1. **Growth (trust)** — deep *evergreen* surfaces for hero moments (not flat #1B5E20): rich, slightly
   blue-leaning green with subtle radial light ("spotlight") and grain-free gradients.
2. **Energy (play)** — electric *lime* as the single action colour (primary CTA, active tab, progress).
   Text on lime is always evergreen-950 (never white) → AA contrast.
3. **Clarity (credibility)** — warm off-white canvas, white cards with hairline borders + very soft
   shadows, generous spacing, one idea per card, tabular figures for money.

## Colour
- Canvas `#F5F6F1` (paper, faint green-warm tint); surface `#FFFFFF`; raised surface `#FBFCF8`.
- Ink: `#0D1A13` (primary text), `#4A5A51` (secondary), `#8A968F` (tertiary/placeholder),
  hairline `#E4E8DF`, divider `#EEF1EA`.
- Evergreen scale (brand, Radix-like 12 steps) centred on `#0F3D2A` (step 11/12 used for hero bg
  `#0B2E20` → `#12482F` gradient).
- Lime scale centred on `#B7F34A` (solid/step 9), hover/pressed `#A6E438`, tint `#EEFDD3`.
- Economy colours (each with solid + tint + gradient pair):
  - Streak **flame** orange `#FF8A1F` → `#FF4E1B`.
  - Lives **heart** rose `#FF4D6D` → `#E5294E` (rose reads as "life" instantly and pops on green UI;
    the video's green hearts are replaced for clarity). Unlimited lives = **gold** heart w/ ∞.
  - Currency **Kiwi** coin: gold rim `#E9B949`, kiwi flesh `#8BD345`, seeds `#1E2A12`, core `#F4F1D0`.
  - Streak **shield** sky `#3BA7FF` → `#1E7FE0`.
  - **Pro** gem violet `#7C5CFF` → `#A48BFF` (premium tier accent, used sparingly).
- Semantic: success `#18A957` (tint `#E3F7EA`), danger `#E5484D` (tint `#FDECEC`), warning
  `#F5A524` (tint `#FFF4DB`), info `#3B82F6` (tint `#E8F1FF`).
- Content tints for lesson info rows (pastel, 1 per semantic): mint `#E6F8EF`, sky `#E6F5FB`,
  blush `#FCEAF1`, butter `#FFF6DC`, lilac `#F0EAFD` (+ matching 600 text/border tone each).

## Typography
- **Display: Bricolage Grotesque** (700/800, tight tracking −0.5…−1.5%) — hero numbers ("0 GIORNI DI
  FILA"), big headlines ("IL TUO CODICE", "TRAGUARDO RAGGIUNTO"), screen titles. It carries the
  brand personality (ink traps, quirky) while staying editorial/premium.
- **Text/UI: Plus Jakarta Sans** (400/500/600/700/800) — body, buttons, labels. Friendly geometric,
  excellent at small sizes, tabular numerals via `fontVariant: ['tabular-nums']` for money/stats.
- Scale (iOS-HIG-aligned): display.xl 44/48, display.lg 36/40, display.md 28/34 (screen titles),
  title.lg 22/28, title.md 19/24, title.sm 17/22 (semibold), body.lg 17/24, body.md 15/22,
  body.sm 13/18, label.lg 15/20 (600), label.md 13/16 (700, +2% tracking), overline 11/14 (700,
  uppercase, +8% tracking) — e.g. "BONUS", "SALVA STREAK", "LIVELLO 1", "MENU".

## Shape, depth, spacing
- 4-pt spacing grid; screen gutter 20; card padding 16–20; section gap 28–32.
- Radius: xs 8, sm 12, md 16 (inputs/options), lg 20 (cards), xl 28 (hero/sheets), pill 999.
- Depth: `hairline` (border only), `card` (y2 blur12 @6% ink), `raised` (y8 blur24 @10%),
  `floating` (tab bar/FAB: y12 blur32 @14%). Coloured glow for lime CTA on hero (lime @35%).
- Buttons: pill, heights 56 / 48 / 40. Primary = lime fill + evergreen text; Secondary = evergreen
  fill + white text; Outline = white + hairline ink border; Ghost; Danger (red). Press = spring scale
  0.97 + slight darken + light haptic. Disabled = 45% opacity lime tint (like the video's pale state).

## Iconography & illustration
- UI icons: **Lucide** (2px stroke @ 22–24px, rounded caps) — consistent outline family, matches
  the video's line icons (back arrow, flag, share, cart, book, chat, home).
- **Economy icons are custom SVG** (flame, heart, kiwi coin, shield, gem, trophy, lock, spark) with
  2-stop gradients + a soft highlight — they are the product's "jewellery", used in chips, shop,
  rewards, celebrations.
- Illustrations: custom SVG compositions in the same language (soft gradients, rounded shapes,
  evergreen/lime/gold palette): hero open-book with spotlight & sparkles, referral envelopes with
  wax seal "FZ", kiwi-slice patterns, course cover (sprout growing from a coin stack + rising
  chart), shrinking/burning banknote (inflation), trophy, shield, hearts, orb for the AI assistant.
- Emoji are allowed only inside **content** (lesson rows, stories, menu list leading glyphs are
  replaced by tinted icon tiles instead of emoji for a premium look).

## Motion (fast, intentional)
- Durations: instant 90ms, fast 160ms, base 240ms, slow 360ms, celebration 600–900ms.
- Springs: `snappy` (damping 20, stiffness 300) for press/selection; `bouncy` (damping 12,
  stiffness 220) for pops/badges/rewards; `gentle` (damping 22, stiffness 140) for sheets/cards.
- Signature moments: shimmer sweep on the journey CTA (every ~3.5 s), chip "bump" when a value
  changes (heart lost → shake + count roll), progress bar spring fill, answer feedback with icon
  pop + haptic (success/error), wrong option shake, lesson-complete confetti + counting numbers,
  path node unlock pulse, story progress segments, typing dots + typewriter for AI, breathing orb.
- Respect Reduce Motion (skip confetti/shimmer, use fades).

## Layout/device quality
- Safe areas everywhere; floating tab bar (pill, 64 high, 16 side margin, bottom = safe inset + 8);
  content bottom padding accounts for the tab bar. Min touch target 44×44. KeyboardAvoiding for chat
  input and code redemption. Max content width 520 on web/tablet (centred).
