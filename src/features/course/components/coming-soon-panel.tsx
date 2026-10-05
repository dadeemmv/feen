/**
 * Coming-soon course opened by link: what to expect + the "Avvisami" bell, instead of a path.
 */
import { StyleSheet } from 'react-native';
import { Bell, BellRing } from 'lucide-react-native';

import { EmptyBox } from '@/components/illustrations';
import { Button, Card, EmptyState, toast } from '@/components/ui';
import { spacing } from '@/theme';

import { STATE_ART } from '../constants';
import { COURSE_COPY } from '../copy';
import { useCourseNotify } from '../hooks/use-course-summary';

export function ComingSoonPanel({ courseId }: { courseId: string }) {
  const { notify, toggle } = useCourseNotify(courseId);

  const handleToggle = () => {
    const on = toggle();
    toast.show({ message: on ? COURSE_COPY.notifyOnToast : COURSE_COPY.notifyOffToast, icon: on ? BellRing : Bell, tone: on ? 'success' : 'neutral' });
  };

  return (
    <Card variant="surface" padding="lg" style={styles.card} contentStyle={styles.content}>
      <EmptyState
        compact
        illustration={<EmptyBox width={STATE_ART.width} />}
        title={COURSE_COPY.comingSoonTitle}
        message={COURSE_COPY.comingSoonMessage}
      />
      <Button
        title={notify ? COURSE_COPY.notifyActive : COURSE_COPY.notifyOn}
        iconLeft={notify ? BellRing : Bell}
        variant={notify ? 'secondary' : 'primary'}
        fullWidth
        onPress={handleToggle}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: spacing.xl },
  content: { gap: spacing.lg },
});
