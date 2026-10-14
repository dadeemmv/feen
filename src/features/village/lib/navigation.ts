/**
 * Navigation inside the village: building pages, lessons (no lives: a lesson always opens) and
 * the reviews the residents bring.
 */
import { router } from 'expo-router';

import type { BuildingId } from '@/content/village';

export function openBuilding(id: BuildingId) {
  router.push({ pathname: '/building/[id]', params: { id } });
}

export function openLesson(chapterId: string) {
  router.push({ pathname: '/lesson/[id]', params: { id: chapterId } });
}

export function openReview(id: BuildingId) {
  router.push({ pathname: '/review/[id]', params: { id } });
}
