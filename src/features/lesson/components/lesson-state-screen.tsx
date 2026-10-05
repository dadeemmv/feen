/**
 * Full-screen states of the lesson route that are not a lesson: unknown chapter / missing content
 * (error) and a chapter that is still locked (deep link). Close button top-left, a friendly
 * empty state in the middle, one way back to the path.
 */
import { StyleSheet, View } from 'react-native';
import { X } from 'lucide-react-native';

import { LockIcon } from '@/components/icons';
import { EmptyBox } from '@/components/illustrations';
import { EmptyState, IconButton, Screen, tileSize } from '@/components/ui';
import { layout, spacing } from '@/theme';

import { COPY } from '../copy';

export type LessonStateScreenProps = {
  kind: 'error' | 'locked';
  onBack: () => void;
  /** Dev builds only: open a locked chapter anyway (QA of later chapters). */
  onForceOpen?: () => void;
};

export function LessonStateScreen({ kind, onBack, onForceOpen }: LessonStateScreenProps) {
  const copy = kind === 'error' ? COPY.error : COPY.locked;
  return (
    <Screen preset="fixed" edges={['top', 'bottom']} statusBar="dark">
      <View style={styles.header}>
        <IconButton icon={X} variant="plain" accessibilityLabel={COPY.a11y.close} onPress={onBack} />
      </View>
      <View style={styles.body}>
        <EmptyState
          title={copy.title}
          message={copy.message}
          illustration={kind === 'error' ? <EmptyBox width={tileSize.xl * 3} /> : <LockIcon size={tileSize.xl} variant="gold" />}
          action={{ label: copy.back, onPress: onBack }}
          secondaryAction={kind === 'locked' && onForceOpen ? { label: COPY.locked.devOpen, onPress: onForceOpen } : undefined}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { height: layout.headerHeight, justifyContent: 'center', marginLeft: -spacing.xs },
  body: { flex: 1, justifyContent: 'center', paddingBottom: layout.headerHeight },
});
