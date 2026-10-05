/**
 * Layout helpers with gaps from the spacing scale (Restyle/Tamagui-style stacks).
 *   <VStack gap="md">…</VStack>   <HStack gap="xs" justify="space-between">…</HStack>
 */
import type { ReactNode } from 'react';
import { View, type FlexAlignType, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { spacing, type SpacingToken } from '@/theme';

type Justify = NonNullable<ViewStyle['justifyContent']>;

type StackLayout = {
  /** Gap between children. Default `none`. */
  gap?: SpacingToken;
  /** Cross-axis alignment. HStack defaults to `center`. */
  align?: FlexAlignType;
  justify?: Justify;
  wrap?: boolean;
  /** Padding on all sides. */
  padding?: SpacingToken;
  /** Horizontal padding. */
  paddingX?: SpacingToken;
  /** Vertical padding. */
  paddingY?: SpacingToken;
  /** `flex: 1`. */
  flex?: boolean;
};

export type StackProps = Omit<ViewProps, 'style'> &
  StackLayout & {
    children?: ReactNode;
    style?: StyleProp<ViewStyle>;
  };

function toStyle(direction: 'row' | 'column', layout: StackLayout): ViewStyle {
  const { gap = 'none', align, justify, wrap, padding, paddingX, paddingY, flex } = layout;
  return {
    flexDirection: direction,
    gap: spacing[gap],
    alignItems: align,
    justifyContent: justify,
    flexWrap: wrap ? 'wrap' : undefined,
    padding: padding ? spacing[padding] : undefined,
    paddingHorizontal: paddingX ? spacing[paddingX] : undefined,
    paddingVertical: paddingY ? spacing[paddingY] : undefined,
    flex: flex ? 1 : undefined,
  };
}

function Stack({
  direction,
  children,
  style,
  gap,
  align,
  justify,
  wrap,
  padding,
  paddingX,
  paddingY,
  flex,
  ...rest
}: StackProps & { direction: 'row' | 'column' }) {
  const layout = { gap, align, justify, wrap, padding, paddingX, paddingY, flex };
  return (
    <View style={[toStyle(direction, layout), style]} {...rest}>
      {children}
    </View>
  );
}

export function VStack(props: StackProps) {
  return <Stack direction="column" {...props} />;
}

export function HStack({ align = 'center', ...props }: StackProps) {
  return <Stack direction="row" align={align} {...props} />;
}

export type SpacerProps = {
  /** Fixed size from the spacing scale; omit to flex-fill. */
  size?: SpacingToken;
  horizontal?: boolean;
};

/** Fixed gap (`size`) or flexible filler (no size). */
export function Spacer({ size, horizontal = false }: SpacerProps) {
  if (!size) return <View style={{ flex: 1 }} />;
  const value = spacing[size];
  return <View style={horizontal ? { width: value } : { height: value }} />;
}
