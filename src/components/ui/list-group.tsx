/**
 * ListGroup — iOS-style grouped list: one white card, hairline dividers between rows, dividers
 * inset to the row text. Optional `title` renders a SectionHeader above ("MENU", "ALTRO").
 */
import { Children, Fragment, isValidElement, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { elevation, radius, spacing, useTheme } from '@/theme';

import { Divider } from './divider';
import { hairline, tileSize } from './metrics';
import { SectionHeader, type SectionHeaderProps } from './section-header';

export type ListGroupProps = {
  children: ReactNode;
  /** Section title above the card. */
  title?: string;
  /** Action next to the title. */
  action?: SectionHeaderProps['action'];
  /** Divider start inset. Default: aligned with row text (after the icon tile). `0` = full width. */
  dividerInset?: number;
  style?: StyleProp<ViewStyle>;
};

const DEFAULT_INSET = spacing.md + tileSize.md + spacing.sm;

export function ListGroup({ children, title, action, dividerInset = DEFAULT_INSET, style }: ListGroupProps) {
  const theme = useTheme();
  const rows = Children.toArray(children).filter(isValidElement);

  return (
    <View style={[styles.section, style]}>
      {title ? <SectionHeader title={title} action={action} /> : null}
      <View style={[styles.shadow, { backgroundColor: theme.colors.surface, borderColor: theme.colors.borderSubtle }]}>
        <View style={styles.clip}>
          {rows.map((row, index) => (
            <Fragment key={row.key ?? index}>
              {index > 0 ? <Divider inset={dividerInset} /> : null}
              {row}
            </Fragment>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.xs },
  shadow: { borderRadius: radius.xl, borderWidth: hairline, boxShadow: elevation.sm },
  clip: { borderRadius: radius.xl, overflow: 'hidden' },
});
