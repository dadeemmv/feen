import type { ComponentType } from 'react';

import type { MascotId } from '@/content/personality';

import type { IllustrationProps } from '../lib/art-svg';
import { FoxMascot } from './fox-mascot';
import { KoalaMascot } from './koala-mascot';
import { OwlMascot } from './owl-mascot';
import { SquirrelMascot } from './squirrel-mascot';

const MASCOT_ART: Record<MascotId, ComponentType<IllustrationProps>> = {
  squirrel: SquirrelMascot,
  owl: OwlMascot,
  fox: FoxMascot,
  koala: KoalaMascot,
};

export type MascotArtProps = IllustrationProps & { id: MascotId };

/** One of the four companion mascots by id (square 200 × 200 artboard, transparent). */
export function MascotArt({ id, ...props }: MascotArtProps) {
  const Art = MASCOT_ART[id];
  return <Art {...props} />;
}
