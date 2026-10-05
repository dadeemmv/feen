/**
 * Visual QA for the economy icons: every icon at two sizes on paper and on evergreen, the muted
 * (locked) rendering, and the brand marks. Not used in product screens.
 *
 *   <ScrollView><IconGallery /></ScrollView>   or   <IconGallery scrollable />
 */
import type { ComponentType } from 'react';

import { BoltIcon } from './bolt-icon';
import { CheckBadgeIcon, CrossBadgeIcon } from './badge-icons';
import { FinanzLogo } from './finanz-logo';
import { FinanzWordmark } from './finanz-wordmark';
import { FlameIcon } from './flame-icon';
import { GemIcon } from './gem-icon';
import { GiftIcon } from './gift-icon';
import { HeartIcon } from './heart-icon';
import { HeartInfinityIcon } from './heart-infinity-icon';
import { KiwiCoinIcon } from './kiwi-coin-icon';
import { GALLERY_SURFACES, GalleryCell, GalleryPage, GallerySection, type GallerySurface } from './lib/gallery-kit';
import type { IconProps } from './lib/icon-svg';
import { LockIcon } from './lock-icon';
import { ShieldIcon } from './shield-icon';
import { SparkleIcon } from './sparkle-icon';
import { TrophyIcon } from './trophy-icon';

/** `skipMuted` = the icon has no muted rendering (brand marks). */
type Entry = { label: string; Icon: ComponentType<IconProps>; skipMuted?: boolean };

const LockGold = (props: IconProps) => <LockIcon {...props} variant="gold" />;
const SparkleLime = (props: IconProps) => <SparkleIcon {...props} tone="lime" />;
const SparkleGold = (props: IconProps) => <SparkleIcon {...props} tone="gold" />;
const SparkleBrand = (props: IconProps) => <SparkleIcon {...props} tone="brand" />;
const LogoBrand = (props: IconProps) => <FinanzLogo {...props} tone="brand" />;

const ENTRIES: readonly Entry[] = [
  { label: 'Flame', Icon: FlameIcon },
  { label: 'Heart', Icon: HeartIcon },
  { label: 'HeartInfinity', Icon: HeartInfinityIcon },
  { label: 'KiwiCoin', Icon: KiwiCoinIcon },
  { label: 'Shield', Icon: ShieldIcon },
  { label: 'Gem', Icon: GemIcon },
  { label: 'Trophy', Icon: TrophyIcon },
  { label: 'Lock', Icon: LockIcon },
  { label: 'Lock gold', Icon: LockGold },
  { label: 'Sparkle white', Icon: SparkleIcon },
  { label: 'Sparkle lime', Icon: SparkleLime },
  { label: 'Sparkle gold', Icon: SparkleGold },
  { label: 'Sparkle brand', Icon: SparkleBrand },
  { label: 'Gift', Icon: GiftIcon },
  { label: 'Bolt', Icon: BoltIcon },
  { label: 'CheckBadge', Icon: CheckBadgeIcon },
  { label: 'CrossBadge', Icon: CrossBadgeIcon },
  { label: 'FinanzLogo', Icon: FinanzLogo, skipMuted: true },
  { label: 'FinanzLogo brand', Icon: LogoBrand, skipMuted: true },
];

const SURFACE_TITLE: Record<GallerySurface, string> = { paper: 'Su carta', evergreen: 'Su evergreen' };

export type IconGalleryProps = {
  /** The two preview sizes (large, small). Default [48, 20] — 20 is the chip size. */
  sizes?: readonly [number, number];
  /** Wrap in its own ScrollView. Default false. */
  scrollable?: boolean;
};

function IconCell({ entry, sizes, muted }: { entry: Entry; sizes: readonly [number, number]; muted?: boolean }) {
  const { Icon, label } = entry;
  return (
    <GalleryCell label={label}>
      <Icon size={sizes[0]} muted={muted} accessibilityLabel={label} />
      <Icon size={sizes[1]} muted={muted} />
    </GalleryCell>
  );
}

export function IconGallery({ sizes = [48, 20], scrollable }: IconGalleryProps) {
  return (
    <GalleryPage title="Icone" scrollable={scrollable}>
      {GALLERY_SURFACES.map((surface) => (
        <GallerySection key={surface} title={SURFACE_TITLE[surface]} surface={surface}>
          {ENTRIES.map((entry) => (
            <IconCell key={entry.label} entry={entry} sizes={sizes} />
          ))}
        </GallerySection>
      ))}
      <GallerySection title="Muted / bloccato" surface="paper">
        {ENTRIES.filter((entry) => !entry.skipMuted).map((entry) => (
          <IconCell key={entry.label} entry={entry} sizes={sizes} muted />
        ))}
      </GallerySection>
      {GALLERY_SURFACES.map((surface) => (
        <GallerySection key={surface} title={`Wordmark — ${SURFACE_TITLE[surface].toLowerCase()}`} surface={surface}>
          <GalleryCell label="withMark">
            <FinanzWordmark height={36} withMark tone={surface === 'paper' ? 'ink' : 'white'} />
          </GalleryCell>
          <GalleryCell label={surface === 'paper' ? 'ink' : 'lime'}>
            <FinanzWordmark height={28} tone={surface === 'paper' ? 'ink' : 'lime'} />
            <FinanzWordmark height={16} tone={surface === 'paper' ? 'ink' : 'lime'} />
          </GalleryCell>
        </GallerySection>
      ))}
    </GalleryPage>
  );
}
