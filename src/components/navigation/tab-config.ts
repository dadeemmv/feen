/**
 * Tab routes of `src/app/(tabs)` → icon + short label revealed inside the active pill.
 * Unknown routes fall back to the screen's `title` and a neutral icon.
 */
import { Circle, House, ListChecks, ScrollText, UserRound, type LucideIcon } from 'lucide-react-native';

export type TabRouteName = 'index' | 'lessons' | 'pact' | 'profile';

export type TabConfig = { icon: LucideIcon; label: string; accessibilityLabel: string };

export const TAB_CONFIG: Record<TabRouteName, TabConfig> = {
  index: { icon: House, label: 'Borgo', accessibilityLabel: 'Borgo' },
  lessons: { icon: ListChecks, label: 'Lezioni', accessibilityLabel: 'Lezioni: il borgo in forma di lista' },
  pact: { icon: ScrollText, label: 'Patto', accessibilityLabel: 'Il patto' },
  profile: { icon: UserRound, label: 'Profilo', accessibilityLabel: 'Profilo' },
};

export function getTabConfig(routeName: string, title?: string): TabConfig {
  if (routeName in TAB_CONFIG) return TAB_CONFIG[routeName as TabRouteName];
  const label = title ?? routeName;
  return { icon: Circle, label, accessibilityLabel: label };
}
