/**
 * Behaviour shared by both CourseCard sizes: the course summary, the notify bell and the tap.
 * - available course → push its learning path;
 * - coming-soon course → turn the "Avvisami" bell on and confirm with a toast (video t=72 s:
 *   locked carousel cards), the bell itself toggles on/off.
 */
import { Bell, BellRing } from 'lucide-react-native';

import { toast } from '@/components/ui';
import type { Course } from '@/content/types';
import { useCourseNotify, useCourseSummary } from '@/features/course/hooks/use-course-summary';
import { openCourse } from '@/features/course/lib/navigation';

import { ACADEMY_COPY } from '../copy';

export function useCourseCard(course: Course) {
  const summary = useCourseSummary(course);
  const { notify, toggle } = useCourseNotify(course.id);

  const toggleNotify = () => {
    const on = toggle();
    toast.show({
      message: on ? ACADEMY_COPY.notifyOnToast : ACADEMY_COPY.notifyOffToast,
      icon: on ? BellRing : Bell,
      tone: on ? 'success' : 'neutral',
    });
  };

  const open = () => {
    if (summary.available) {
      openCourse(course.id);
      return;
    }
    if (!notify) toggle();
    toast.show({ message: ACADEMY_COPY.notifyOnToast, icon: BellRing, tone: 'success' });
  };

  return { summary, notify, toggleNotify, open };
}
