/**
 * Tab routes of `src/app/(tabs)` → icon + short label revealed inside the active pill.
 * Unknown routes fall back to the screen's `title` and a neutral icon.
 */
import { BookOpen, Circle, House, MessageCircle, ShoppingCart, type LucideIcon } from 'lucide-react-native';

export type TabRouteName = 'index' | 'academy' | 'assistant' | 'shop';

export type TabConfig = { icon: LucideIcon; label: string; accessibilityLabel: string };

export const TAB_CONFIG: Record<TabRouteName, TabConfig> = {
  index: { icon: House, label: 'Home', accessibilityLabel: 'Home' },
  academy: { icon: BookOpen, label: 'Academy', accessibilityLabel: 'Academy' },
  assistant: { icon: MessageCircle, label: 'Coach', accessibilityLabel: 'Coach, assistente finanziario' },
  shop: { icon: ShoppingCart, label: 'Shop', accessibilityLabel: 'Shop' },
};

export function getTabConfig(routeName: string, title?: string): TabConfig {
  if (routeName in TAB_CONFIG) return TAB_CONFIG[routeName as TabRouteName];
  const label = title ?? routeName;
  return { icon: Circle, label, accessibilityLabel: label };
}
