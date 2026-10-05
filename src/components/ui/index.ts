/**
 * Finanz design-system primitives. Screens import from here only:
 *   import { Button, Card, Screen, Text } from '@/components/ui';
 * Documentation with props and examples: docs/COMPONENTS.md.
 * (`collapsible.tsx` is an Expo-template leftover used by the template's explore route: not part
 * of the kit. `showcase.tsx` is dev-only: import it from '@/components/ui/showcase'.)
 */

// Typography & icons
export { AnimatedText, Text, useTextStyle, type AnimatedTextProps, type TextAlign, type TextProps } from './text';
export { Icon, renderIcon, resolveIconSize, type IconProps, type IconSource } from './icon';

// Layout
export { HStack, Spacer, VStack, type SpacerProps, type StackProps } from './stack';
export { Divider, type DividerProps } from './divider';
export { Screen, type ScreenBackground, type ScreenProps } from './screen';
export { ScreenTitle, type ScreenTitleProps } from './screen-title';
export { SectionHeader, type SectionHeaderProps } from './section-header';

// Actions
export { PressableScale, type PressableScaleProps, type PressScale } from './pressable-scale';
export { Button, type ButtonProps, type ButtonSize, type ButtonVariant } from './button';
export { IconButton, type IconButtonProps, type IconButtonSize, type IconButtonVariant } from './icon-button';

// Surfaces & content
export { Card, type CardPadding, type CardProps, type CardVariant } from './card';
export { Spotlight, type SpotlightProps } from './spotlight';
export { ListItem, MenuRow, type ListItemProps, type MenuRowProps } from './list-item';
export { ListGroup, type ListGroupProps } from './list-group';
export { EmojiTile, IconTile, type IconTileProps, type IconTileSize } from './icon-tile';
export { Avatar, StoryRing, type AvatarProps, type AvatarSize, type StoryRingProps } from './avatar';
export { StatTile, type StatTileProps } from './stat-tile';
export { EmptyState, type EmptyStateProps } from './empty-state';

// Chips, tags, badges, counters
export { Chip, type ChipProps, type ChipSize, type ChipVariant } from './chip';
export { StatChip, type StatChipProps, type StatKind } from './stat-chip';
export { Tag, type TagProps } from './tag';
export { Badge, type BadgeProps } from './badge';
export { RollingNumber, type RollingNumberProps } from './rolling-number';
export { CountUp, type CountUpProps } from './count-up';

// Progress & loading
export { ProgressBar, type ProgressBarProps, type ProgressSize, type ProgressTone } from './progress-bar';
export { SegmentedProgress, type SegmentedProgressProps } from './segmented-progress';
export { Skeleton, SkeletonText, type SkeletonProps, type SkeletonTextProps } from './skeleton';
export { TypingDots, type TypingDotsProps } from './typing-dots';

// Inputs
export { TextField, type TextFieldProps } from './text-field';
export { Radio, type RadioProps, type RadioTone } from './radio';
export { ChoiceRow, type ChoiceRowProps } from './choice-row';
export { Switch, type SwitchProps } from './switch';

// Overlays
export { Sheet, type SheetProps } from './sheet';
export { Dialog, type DialogAction, type DialogProps } from './dialog';
export { DialogBadge, type DialogBadgePreset, type DialogBadgeProps, type DialogTone } from './dialog-badge';
export { ToastHost, toast, useToast, type ToastHostProps, type ToastOptions, type ToastTone } from './toast';

// Motion
export { Shimmer, type ShimmerProps } from './shimmer';
export { Confetti, type ConfettiProps } from './confetti';
export {
  bumpAnimation,
  feedbackMotion,
  popAnimation,
  shakeAnimation,
  useBump,
  useShake,
} from './motion-presets';
export { setReduceMotionOverride, useReduceMotion } from './use-reduce-motion';

// Tokens for control geometry & tone resolution
export {
  avatarSize,
  badgeSize,
  borderWidth,
  chipHeight,
  controlHeight,
  dialogBadgeSize,
  hairline,
  iconButtonSize,
  iconSize,
  iconStroke,
  progressHeight,
  radioSize,
  readableWidth,
  tileSize,
  uiOpacity,
  zIndex,
  type IconSizeToken,
} from './metrics';
export { resolveTone, type EconomyTone, type FeedbackTone, type Tone, type ToneColors } from './tones';
