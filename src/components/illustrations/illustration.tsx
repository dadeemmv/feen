import type { ComponentType } from 'react';

import type { IllustrationKey } from '@/content/types';

import { COURSE_COVERS, isCourseCoverKey } from './course-covers/course-cover';
import type { CoverBackground } from './course-covers/cover-frame';
import { SHIELD_PAIR_SIZE, ShieldPair } from './economy/shield-pair';
import { TrophyCups } from './economy/trophy-cups';
import { KIWI_PATTERN_SIZE, KiwiPattern } from './kiwi-pattern';
import { BondCertificateArt } from './lesson-art/bond-certificate-art';
import { BrokerPhoneArt } from './lesson-art/broker-phone-art';
import { BurningBanknoteArt } from './lesson-art/burning-banknote-art';
import { CoinsStackArt } from './lesson-art/coins-stack-art';
import { CompoundSnowballArt } from './lesson-art/compound-snowball-art';
import { OpenBookArt } from './lesson-art/open-book-art';
import { PieDiversifyArt } from './lesson-art/pie-diversify-art';
import { PiggyBankArt } from './lesson-art/piggy-bank-art';
import { RiskScaleArt } from './lesson-art/risk-scale-art';
import { ShoppingCartArt } from './lesson-art/shopping-cart-art';
import { StockChartArt } from './lesson-art/stock-chart-art';
import { ART, type IllustrationProps } from './lib/art-svg';
import { REFERRAL_ENVELOPES_SIZE, ReferralEnvelopes } from './referral-envelopes';

type Entry = {
  Component: ComponentType<IllustrationProps>;
  /** Natural artboard [width, height] — use it to size the container to the art's aspect ratio. */
  size: readonly [number, number];
};

const art = (Component: ComponentType<IllustrationProps>, size: readonly [number, number] = ART.spot): Entry => ({
  Component,
  size,
});

const REGISTRY: Record<IllustrationKey, Entry> = {
  'course-first-investment': art(COURSE_COVERS['course-first-investment'], ART.cover),
  'course-stocks': art(COURSE_COVERS['course-stocks'], ART.cover),
  'course-budget': art(COURSE_COVERS['course-budget'], ART.cover),
  'course-crypto': art(COURSE_COVERS['course-crypto'], ART.cover),
  'open-book': art(OpenBookArt),
  'shopping-cart': art(ShoppingCartArt),
  'burning-banknote': art(BurningBanknoteArt),
  'compound-snowball': art(CompoundSnowballArt),
  'risk-scale': art(RiskScaleArt),
  'stock-chart': art(StockChartArt),
  'piggy-bank': art(PiggyBankArt),
  'coins-stack': art(CoinsStackArt),
  'broker-phone': art(BrokerPhoneArt),
  'pie-diversify': art(PieDiversifyArt),
  'bond-certificate': art(BondCertificateArt),
  trophy: art(TrophyCups),
  shield: art(ShieldPair, SHIELD_PAIR_SIZE),
  envelopes: art(ReferralEnvelopes, REFERRAL_ENVELOPES_SIZE),
  'kiwi-pattern': art(KiwiPattern, KIWI_PATTERN_SIZE),
};

/** Every key, in registry order (galleries, content validation). */
export const ILLUSTRATION_KEYS = Object.keys(REGISTRY) as IllustrationKey[];

/** Natural artboard size of an illustration (e.g. for `aspectRatio: w / h`). */
export const illustrationSize = (name: IllustrationKey) => REGISTRY[name].size;

export type IllustrationRegistryProps = IllustrationProps & {
  name: IllustrationKey;
  /** Course covers only: 'brand' (evergreen, default) or 'paper' background. Ignored otherwise. */
  background?: CoverBackground;
};

/**
 * Renders any content illustration by key. Spot art letterboxes inside the box ('meet');
 * course covers and the kiwi pattern fill it ('slice').
 *
 *   <Illustration name={step.illustration} width={220} />
 *   <Illustration name={course.cover} width="100%" height={180} />
 */
export function Illustration({ name, background, ...props }: IllustrationRegistryProps) {
  if (isCourseCoverKey(name)) {
    const Cover = COURSE_COVERS[name];
    return <Cover background={background} {...props} />;
  }
  const { Component } = REGISTRY[name];
  return <Component {...props} />;
}
