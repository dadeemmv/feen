/**
 * Finanz illustrations — custom SVG compositions in the economy-icon language (soft 2-stop
 * gradients, rounded geometry, evergreen / lime / gold). Every artwork has a transparent
 * background (except course covers and `KiwiPattern`, which fill their box) and takes
 * `{ width?, height?, style?, accessibilityLabel? }`.
 *
 * - Content art is rendered by key: `<Illustration name={step.illustration} width={220} />`.
 * - Special compositions are named exports.
 * - Visual QA: `import { IllustrationGallery } from '@/components/illustrations/gallery'`.
 */
export { Illustration, ILLUSTRATION_KEYS, illustrationSize, type IllustrationRegistryProps } from './illustration';
export { ART, type IllustrationProps } from './lib/art-svg';

// Hero, promo and pattern art
export { HERO_BOOK_SIZE, HeroBookSpotlight } from './hero-book-spotlight';
export { REFERRAL_ENVELOPES_SIZE, ReferralEnvelopes } from './referral-envelopes';
export { KIWI_PATTERN_SIZE, KiwiPattern, type KiwiPatternDensity, type KiwiPatternProps } from './kiwi-pattern';
export type { KiwiSliceMode } from './parts/kiwi-slice';

// Course covers (16:9, fill their box)
export { COURSE_COVERS, CourseCover, isCourseCoverKey, type CourseCoverKey } from './course-covers/course-cover';
export type { CourseCoverProps, CoverBackground } from './course-covers/cover-frame';
export { BudgetCover } from './course-covers/budget-cover';
export { CryptoCover } from './course-covers/crypto-cover';
export { FirstInvestmentCover } from './course-covers/first-investment-cover';
export { StocksCover } from './course-covers/stocks-cover';

// Lesson spot art (4:3)
export { BondCertificateArt } from './lesson-art/bond-certificate-art';
export { BrokerPhoneArt } from './lesson-art/broker-phone-art';
export { BurningBanknoteArt } from './lesson-art/burning-banknote-art';
export { CoinsStackArt } from './lesson-art/coins-stack-art';
export { CompoundSnowballArt } from './lesson-art/compound-snowball-art';
export { OpenBookArt } from './lesson-art/open-book-art';
export { PieDiversifyArt } from './lesson-art/pie-diversify-art';
export { PiggyBankArt } from './lesson-art/piggy-bank-art';
export { RiskScaleArt } from './lesson-art/risk-scale-art';
export { ShoppingCartArt } from './lesson-art/shopping-cart-art';
export { StockChartArt } from './lesson-art/stock-chart-art';

// Economy & celebration compositions
export { HEARTS_TRIO_SIZE, HeartsTrio, type HeartsTrioProps, type HeartsTrioVariant } from './economy/hearts-trio';
export { SHIELD_PAIR_SIZE, ShieldPair, type ShieldPairProps } from './economy/shield-pair';
export {
  STREAK_FLAME_SIZE,
  StreakFlameHero,
  type StreakFlameHeroProps,
  type StreakFlameTone,
} from './economy/streak-flame-hero';
export { TrophyCups, type TrophyCupsProps } from './economy/trophy-cups';

// Companion characters (200 × 320 full figure, or square bust; transparent)
export { MascotArt, type MascotArtProps } from './mascots/mascot-art';
export { BUST_FRAME, CHARACTER_SIZE, type Framing } from './mascots/character-parts';
export { GiverCharacter } from './mascots/giver-character';
export { SharkCharacter } from './mascots/shark-character';
export { ValueCharacter } from './mascots/value-character';
export { VisionaryCharacter } from './mascots/visionary-character';

// Assistant & states
export { ASSISTANT_ORB_SIZE, AssistantOrb, type AssistantOrbProps } from './assistant-orb';
export { EmptyBox } from './empty-box';
