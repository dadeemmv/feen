/**
 * DisplayTitle — the giant magazine headline of a story page ("ACADEMY 📚", "💞 AIUTACI A
 * MIGLIORARE 💞", "CHI SIAMO??"). Picks the biggest Bricolage display size whose longest word
 * fits the column, keeps edge emoji glued to their word, and — for a trailing "??" — lets the
 * question marks dance (tilted, staggered) like the original story.
 */
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { spacing, textVariants, type ColorToken, type TextVariant } from '@/theme';

import { NBSP, fitDisplayVariant } from '../lib/display-fit';
import { splitTitleEmoji } from '../lib/story-pages';

export type DisplayTitleProps = {
  title: string;
  /** Width of the text column, used to pick the size. */
  width: number;
  color: ColorToken;
  /** Largest variants first. */
  sizes?: readonly TextVariant[];
};

const DEFAULT_SIZES: readonly TextVariant[] = ['displayXl', 'displayLg', 'displayMd'];
const QUESTION_MARKS = /^(.*?)(\?{2,})$/u;
/** Tilt (deg) and vertical offset (fraction of the font size) of each dancing "?". */
const MARK_POSES = [
  { rotate: -14, lift: -0.18 },
  { rotate: 12, lift: 0.14 },
  { rotate: -6, lift: -0.08 },
];

export function DisplayTitle({ title, width, color, sizes = DEFAULT_SIZES }: DisplayTitleProps) {
  const { lead, words, trail } = splitTitleEmoji(title);
  const marks = QUESTION_MARKS.exec(words);

  if (marks && !lead && !trail) {
    const [, base, questionMarks] = marks;
    const variant = fitDisplayVariant(`${base}${questionMarks}`, width, sizes, 'line');
    return (
      <View style={styles.row} accessible accessibilityRole="header" accessibilityLabel={title}>
        <Text variant={variant} color={color} align="center">
          {base}
        </Text>
        <View style={styles.marks}>
          {questionMarks.split('').map((mark, index) => (
            <QuestionMark key={index} mark={mark} variant={variant} color={color} pose={index % MARK_POSES.length} />
          ))}
        </View>
      </View>
    );
  }

  // Glue the edge emoji to their neighbouring word so a wrap never strands them on a line alone.
  const text = [lead ? `${lead}${NBSP}` : '', joinLastWord(words, trail)].join('');
  const variant = fitDisplayVariant(text, width, sizes, 'word');
  return (
    <Text variant={variant} color={color} align="center" accessibilityRole="header">
      {text}
    </Text>
  );
}

function joinLastWord(words: string, trail?: string): string {
  return trail ? `${words}${NBSP}${trail}` : words;
}

function QuestionMark({
  mark,
  variant,
  color,
  pose,
}: {
  mark: string;
  variant: TextVariant;
  color: ColorToken;
  pose: number;
}) {
  const { rotate, lift } = MARK_POSES[pose];
  return (
    <Text
      variant={variant}
      color={color}
      aria-hidden
      style={{
        transform: [{ rotate: `${rotate}deg` }, { translateY: lift * textVariants[variant].fontSize }],
      }}>
      {mark}
    </Text>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  marks: { flexDirection: 'row', marginLeft: spacing.xxxs },
});
