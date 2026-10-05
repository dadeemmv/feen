import type { ComponentType } from 'react';

import type { MascotId } from '@/content/personality';

import type { IllustrationProps } from '../lib/art-svg';
import type { Framing } from './character-parts';
import { GiverCharacter } from './giver-character';
import { SharkCharacter } from './shark-character';
import { ValueCharacter } from './value-character';
import { VisionaryCharacter } from './visionary-character';

type CharacterProps = IllustrationProps & { framing?: Framing };

const CHARACTER_ART: Record<MascotId, ComponentType<CharacterProps>> = {
  value: ValueCharacter,
  shark: SharkCharacter,
  giver: GiverCharacter,
  visionary: VisionaryCharacter,
};

export type MascotArtProps = CharacterProps & { id: MascotId };

/**
 * One of the four companion characters by id: full figure on a 200 × 320 artboard, or
 * `framing="bust"` for a square head-and-shoulders crop (avatars, list rows). Transparent.
 */
export function MascotArt({ id, ...props }: MascotArtProps) {
  const Art = CHARACTER_ART[id];
  return <Art {...props} />;
}
