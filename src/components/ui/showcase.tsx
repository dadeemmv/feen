/**
 * UiShowcase — every primitive in every state, for visual QA on a `/dev` route:
 *   export default function Dev() { return <UiShowcase />; }
 * Dev-only: not exported from the barrel. Renders its own <Screen> and (by default) a local
 * <ToastHost/> so toasts work even before the root layout mounts one.
 */
import { useState, type ComponentType } from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '@/theme';

import { Chip } from './chip';
import { Screen } from './screen';
import { ScreenTitle } from './screen-title';
import { ButtonShowcase, IconButtonShowcase, TypographyShowcase } from './showcase-parts/basics';
import { ChipShowcase, CounterShowcase, StatChipShowcase } from './showcase-parts/indicators';
import { SelectionShowcase, TextFieldShowcase } from './showcase-parts/inputs';
import { NavigationShowcase } from './showcase-parts/navigation';
import { OverlayShowcase } from './showcase-parts/overlays';
import { LoadingShowcase, ProgressShowcase, StoryProgressShowcase } from './showcase-parts/progress';
import { CardShowcase, EmptyStateShowcase, IdentityShowcase, ListShowcase } from './showcase-parts/surfaces';
import { ToastHost } from './toast';

type Group = { id: string; label: string; sections: ComponentType[] };

const GROUPS: Group[] = [
  { id: 'base', label: 'Base', sections: [TypographyShowcase, ButtonShowcase, IconButtonShowcase] },
  { id: 'surfaces', label: 'Superfici', sections: [CardShowcase, ListShowcase, IdentityShowcase, EmptyStateShowcase] },
  { id: 'indicators', label: 'Indicatori', sections: [ChipShowcase, StatChipShowcase, CounterShowcase] },
  { id: 'progress', label: 'Progresso', sections: [ProgressShowcase, StoryProgressShowcase, LoadingShowcase] },
  { id: 'inputs', label: 'Input', sections: [TextFieldShowcase, SelectionShowcase] },
  { id: 'overlays', label: 'Overlay', sections: [OverlayShowcase] },
  { id: 'navigation', label: 'Navigazione', sections: [NavigationShowcase] },
];

export type UiShowcaseProps = {
  /** Mount a local ToastHost. Pass `false` if the root layout already renders one. Default `true`. */
  toastHost?: boolean;
  /** Pad the bottom for the floating tab bar (when shown inside a tab). Default `false`. */
  withTabBar?: boolean;
};

export function UiShowcase({ toastHost = true, withTabBar = false }: UiShowcaseProps) {
  const [groupId, setGroupId] = useState<string>('all');
  const visible = groupId === 'all' ? GROUPS : GROUPS.filter((group) => group.id === groupId);

  return (
    <View style={styles.flex}>
      <Screen edges={['top', 'bottom']} withTabBar={withTabBar}>
        <ScreenTitle title="Design system" subtitle="Finanz UI kit — tutti i componenti e i loro stati." />
        <View style={styles.filters}>
          <Chip label="Tutto" variant="outline" tone="brand" selected={groupId === 'all'} onPress={() => setGroupId('all')} />
          {GROUPS.map((group) => (
            <Chip
              key={group.id}
              label={group.label}
              variant="outline"
              tone="brand"
              selected={groupId === group.id}
              onPress={() => setGroupId(group.id)}
            />
          ))}
        </View>
        {visible.map((group) => group.sections.map((Section, index) => <Section key={`${group.id}-${index}`} />))}
      </Screen>
      {toastHost ? <ToastHost /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.xl },
});
