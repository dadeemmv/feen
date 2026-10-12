/**
 * The village (borgo): the home as a diegetic hub world, the "Lezioni" list (the same map as a
 * list) and the building pages.
 */
export { VillageScreen } from './village-screen';
export { LessonsScreen } from './lessons-screen';
export { BuildingScreen } from './building-screen';
export { BuildingScene, type BuildingSceneProps } from './components/building-scene';
export { BuildingCard, type BuildingCardProps } from './components/building-card';
export { VILLAGE_COPY } from './copy';
export { useVillage, type Village } from './lib/model';
export { openBuilding, openLesson } from './lib/navigation';
