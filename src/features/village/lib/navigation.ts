/** Navigation inside the village: building pages and lessons (no lives: a lesson always opens). */
import { router } from 'expo-router';

import type { BuildingId } from '@/content/village';

export function openBuilding(id: BuildingId) {
  router.push({ pathname: '/building/[id]', params: { id } });
}

export function openLesson(chapterId: string) {
  router.push({ pathname: '/lesson/[id]', params: { id: chapterId } });
}
