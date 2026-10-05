/**
 * MessageText — chat text with the tiny markup of `markdown-lite`: paragraphs, "- " bullets,
 * "1. " numbered lines and **bold** spans. Safe for half-typed text (typewriter).
 */
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { radius, spacing, textVariants, useTheme, type ColorToken, type TextVariant } from '@/theme';

import { parseMessage, type InlineSpan, type MessageBlock } from '../markdown-lite';
import { bulletSize } from '../metrics';

export type MessageTextProps = {
  text: string;
  /** Default `bodyLg`. */
  variant?: TextVariant;
  /** Text colour. Default `text`. */
  color?: ColorToken;
  /** Bullet dot / list number colour. Default `brandSolid`. */
  markerColor?: ColorToken;
};

function Spans({ spans, variant, color }: { spans: InlineSpan[]; variant: TextVariant; color: ColorToken }) {
  return spans.map((span, index) =>
    span.bold ? (
      <Text key={index} variant={variant} color={color} weight="bold">
        {span.text}
      </Text>
    ) : (
      span.text
    ),
  );
}

export function MessageText({ text, variant = 'bodyLg', color = 'text', markerColor = 'brandSolid' }: MessageTextProps) {
  const theme = useTheme();
  const blocks = parseMessage(text);
  // The bullet dot sits centred on the first line of the item.
  const lineHeight = textVariants[variant].lineHeight;

  const renderBlock = (block: MessageBlock, index: number) => {
    const spaced = block.spaced ? styles.spaced : index > 0 ? styles.tight : undefined;
    const body = (
      <Text variant={variant} color={color} style={block.kind === 'paragraph' ? undefined : styles.itemText}>
        <Spans spans={block.spans} variant={variant} color={color} />
      </Text>
    );
    if (block.kind === 'paragraph') {
      return (
        <View key={index} style={spaced}>
          {body}
        </View>
      );
    }
    return (
      <View key={index} style={[styles.item, spaced]}>
        {block.kind === 'bullet' ? (
          <View style={[styles.markerSlot, { height: lineHeight }]}>
            <View style={[styles.dot, { backgroundColor: theme.colors[markerColor] }]} />
          </View>
        ) : (
          <Text variant={variant} weight="bold" style={[styles.number, { color: theme.colors[markerColor] }]}>
            {block.marker}
          </Text>
        )}
        {body}
      </View>
    );
  };

  return <View>{blocks.map(renderBlock)}</View>;
}

const styles = StyleSheet.create({
  spaced: { marginTop: spacing.sm },
  tight: { marginTop: spacing.xxs },
  item: { flexDirection: 'row', alignItems: 'flex-start' },
  markerSlot: { width: spacing.md, justifyContent: 'center' },
  dot: { width: bulletSize, height: bulletSize, borderRadius: radius.pill },
  number: { minWidth: spacing.lg },
  itemText: { flex: 1 },
});
