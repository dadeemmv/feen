/**
 * Visual QA for the illustration set: every `IllustrationKey` plus the named compositions and
 * their variants, each at two widths, on paper and on evergreen. Not used in product screens.
 *
 *   <ScrollView><IllustrationGallery /></ScrollView>   or   <IllustrationGallery scrollable />
 */
import type { ComponentType } from 'react';

import {
  GALLERY_SURFACES,
  GalleryCell,
  GalleryPage,
  GallerySection,
  type GallerySurface,
} from '@/components/icons/lib/gallery-kit';

import { AssistantOrb } from './assistant-orb';
import { HeartsTrio } from './economy/hearts-trio';
import { ShieldPair } from './economy/shield-pair';
import { StreakFlameHero } from './economy/streak-flame-hero';
import { TrophyCups } from './economy/trophy-cups';
import { EmptyBox } from './empty-box';
import { HeroBookSpotlight } from './hero-book-spotlight';
import { ILLUSTRATION_KEYS, Illustration } from './illustration';
import { KiwiPattern } from './kiwi-pattern';
import { GiverCharacter } from './mascots/giver-character';
import { SharkCharacter } from './mascots/shark-character';
import { ValueCharacter } from './mascots/value-character';
import { VisionaryCharacter } from './mascots/visionary-character';
import type { IllustrationProps } from './lib/art-svg';

type Entry = { label: string; Art: ComponentType<IllustrationProps> };

const byKey = (name: (typeof ILLUSTRATION_KEYS)[number]): Entry => ({
  label: name,
  Art: (props: IllustrationProps) => <Illustration name={name} {...props} />,
});

/** Variants that the registry does not reach (non-default props, special compositions). */
const VARIANTS: readonly Entry[] = [
  { label: 'Personaggio · Visionaria', Art: VisionaryCharacter },
  { label: 'Personaggio · Squalo', Art: SharkCharacter },
  { label: 'Personaggio · Filantropo', Art: GiverCharacter },
  { label: 'Personaggio · Cassettista', Art: ValueCharacter },
  { label: 'HeroBookSpotlight', Art: HeroBookSpotlight },
  { label: 'course-first-investment · paper', Art: (p) => <Illustration name="course-first-investment" background="paper" {...p} /> },
  { label: 'course-stocks · paper', Art: (p) => <Illustration name="course-stocks" background="paper" {...p} /> },
  { label: 'course-budget · paper', Art: (p) => <Illustration name="course-budget" background="paper" {...p} /> },
  { label: 'course-crypto · paper', Art: (p) => <Illustration name="course-crypto" background="paper" {...p} /> },
  { label: 'KiwiPattern · regular ghost', Art: (p) => <KiwiPattern density="regular" mode="ghost" {...p} /> },
  { label: 'KiwiPattern · dense tint', Art: (p) => <KiwiPattern density="dense" mode="tint" {...p} /> },
  { label: 'StreakFlameHero · ghost', Art: StreakFlameHero },
  { label: 'StreakFlameHero · vivid', Art: (p) => <StreakFlameHero tone="vivid" {...p} /> },
  { label: 'ShieldPair · muted', Art: (p) => <ShieldPair muted {...p} /> },
  { label: 'HeartsTrio', Art: HeartsTrio },
  { label: 'HeartsTrio · 1 vita', Art: (p) => <HeartsTrio filled={1} {...p} /> },
  { label: 'HeartsTrio · gold', Art: (p) => <HeartsTrio variant="gold" {...p} /> },
  { label: 'TrophyCups · muted', Art: (p) => <TrophyCups muted {...p} /> },
  { label: 'AssistantOrb', Art: AssistantOrb },
  { label: 'EmptyBox', Art: EmptyBox },
];

const ENTRIES: readonly Entry[] = [...ILLUSTRATION_KEYS.map(byKey), ...VARIANTS];

const SURFACE_TITLE: Record<GallerySurface, string> = { paper: 'Su carta', evergreen: 'Su evergreen' };

export type IllustrationGalleryProps = {
  /** The two preview widths (large, small); heights follow each artboard. Default [176, 88]. */
  widths?: readonly [number, number];
  /** Limit to one surface to halve the render cost. Default: both. */
  surface?: GallerySurface;
  /** Wrap in its own ScrollView. Default false. */
  scrollable?: boolean;
};

export function IllustrationGallery({ widths = [176, 88], surface, scrollable }: IllustrationGalleryProps) {
  const surfaces = surface ? [surface] : GALLERY_SURFACES;
  return (
    <GalleryPage title="Illustrazioni" scrollable={scrollable}>
      {surfaces.map((s) => (
        <GallerySection key={s} title={SURFACE_TITLE[s]} surface={s}>
          {ENTRIES.map(({ label, Art }) => (
            <GalleryCell key={label} label={label}>
              <Art width={widths[0]} accessibilityLabel={label} />
              <Art width={widths[1]} />
            </GalleryCell>
          ))}
        </GallerySection>
      ))}
    </GalleryPage>
  );
}
