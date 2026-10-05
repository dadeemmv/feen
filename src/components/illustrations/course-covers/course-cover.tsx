import type { ComponentType } from 'react';

import type { IllustrationKey } from '@/content/types';

import { BudgetCover } from './budget-cover';
import type { CourseCoverProps } from './cover-frame';
import { CryptoCover } from './crypto-cover';
import { FirstInvestmentCover } from './first-investment-cover';
import { StocksCover } from './stocks-cover';

export type CourseCoverKey = Extract<IllustrationKey, `course-${string}`>;

export const COURSE_COVERS: Record<CourseCoverKey, ComponentType<CourseCoverProps>> = {
  'course-first-investment': FirstInvestmentCover,
  'course-stocks': StocksCover,
  'course-budget': BudgetCover,
  'course-crypto': CryptoCover,
};

export const isCourseCoverKey = (key: IllustrationKey): key is CourseCoverKey => key in COURSE_COVERS;

/**
 * 16:9 course header art. Fills its box (crops, never letterboxes): give it the card's width
 * and height, e.g. `<CourseCover variant={course.cover} width="100%" height={180} />`.
 */
export function CourseCover({ variant, ...props }: CourseCoverProps & { variant: CourseCoverKey }) {
  const Cover = COURSE_COVERS[variant];
  return <Cover {...props} />;
}
