/** Unknown course id (stale link): friendly empty state with a way back to the Academy. */
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';

import { ConnectedStatusHeader } from '@/components/navigation/connected-status-header';
import { EmptyBox } from '@/components/illustrations';
import { EmptyState, Screen } from '@/components/ui';

import { STATE_ART } from '../constants';
import { COURSE_COPY } from '../copy';
import { leaveCourse } from '../lib/navigation';

export function CourseNotFound() {
  return (
    <Screen preset="fixed" edges={['top', 'bottom']} header={<ConnectedStatusHeader onBack={leaveCourse} />} contentContainerStyle={styles.center}>
      <EmptyState
        illustration={<EmptyBox width={STATE_ART.width} />}
        title={COURSE_COPY.notFoundTitle}
        message={COURSE_COPY.notFoundMessage}
        action={{ label: COURSE_COPY.backToAcademy, onPress: () => router.replace('/academy') }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { justifyContent: 'center' },
});
