/**
 * Shared frame of every Account sub-page (/account/[section]): back button, `displayMd` title +
 * lead line, scrolling content, optional sticky footer (Save CTA). Blocks rise in, staggered.
 */
import { Children, isValidElement, type ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { StatusHeader } from '@/components/navigation';
import { Screen, ScreenTitle } from '@/components/ui';
import { useEntering } from '@/features/onboarding/lib/entering';
import { layout } from '@/theme';

import { backToAccount } from '../lib/navigation';

export type SectionPageProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Forms: KeyboardAvoidingView on iOS. */
  keyboard?: boolean;
  onBack?: () => void;
};

export function SectionPage({ title, subtitle, children, footer, keyboard, onBack = backToAccount }: SectionPageProps) {
  const { rise } = useEntering();
  const blocks = Children.toArray(children);

  return (
    <Screen
      edges={['top', 'bottom']}
      keyboard={keyboard}
      header={<StatusHeader stats={[]} showAvatar={false} onBack={onBack} />}
      footer={footer}>
      <ScreenTitle title={title} subtitle={subtitle} />
      {blocks.map((block, index) => (
        <Animated.View
          key={isValidElement(block) && block.key !== null ? block.key : index}
          entering={rise(index)}
          style={index > 0 ? styles.block : undefined}>
          {block}
        </Animated.View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  block: { marginTop: layout.sectionGap },
});
