/**
 * The signature: a white box with a baseline where you sign with your finger, or — "Preferisco
 * scrivere il nome" — your name written in serif italic in the signature ink. A tap or a dot is
 * not enough: a drawn signature needs a minimum of real ink. `need` lights the box with the red
 * thread for a moment (the hold was pressed before signing).
 */
import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Svg, { Path } from 'react-native-svg';

import { borderWidth, PressableScale, Text } from '@/components/ui';
import { fonts, radius, spacing, useTheme } from '@/theme';

import { PACT_COPY } from '../copy';

/** Minimum length of drawn ink (points) for a signature to count. */
const MIN_INK = 40;
const PAD_HEIGHT = 120;

export type Signature = { kind: 'drawn' | 'typed'; name: string };

export type SignaturePadProps = {
  /** The student's name, used for a drawn signature and as the typed default. */
  name: string;
  /** Called with the signature when it becomes valid, null when it is cleared. */
  onChange: (signature: Signature | null) => void;
  /** Flash the red thread around the box. */
  need?: boolean;
  /** After the pact is sealed the signature can no longer change. */
  locked?: boolean;
};

const toPath = (stroke: readonly [number, number][]) =>
  stroke.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');

export function SignaturePad({ name, onChange, need = false, locked = false }: SignaturePadProps) {
  const { colors } = useTheme();
  const [typed, setTyped] = useState(false);
  const [text, setText] = useState('');
  const [strokes, setStrokes] = useState<[number, number][][]>([]);
  const [ink, setInk] = useState(0);

  useEffect(() => {
    if (typed) onChange(text.trim().length > 1 ? { kind: 'typed', name: text.trim() } : null);
    else onChange(ink >= MIN_INK ? { kind: 'drawn', name } : null);
    // `onChange` is the caller's setter; the signature depends on the mode, the text and the ink.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typed, text, ink, name]);

  const pan = Gesture.Pan()
    .runOnJS(true)
    .minDistance(0)
    .enabled(!locked && !typed)
    .onBegin((e) => setStrokes((all) => [...all, [[e.x, e.y]]]))
    .onUpdate((e) =>
      setStrokes((all) => {
        const last = all[all.length - 1] ?? [];
        const [px, py] = last[last.length - 1] ?? [e.x, e.y];
        setInk((n) => n + Math.hypot(e.x - px, e.y - py));
        return [...all.slice(0, -1), [...last, [e.x, e.y]]];
      }),
    );

  const clear = () => {
    setStrokes([]);
    setInk(0);
    setText('');
  };

  const ringColor = need ? colors.thread : 'transparent';

  return (
    <View style={styles.root}>
      <View
        style={[styles.box, { backgroundColor: colors.surfaceRaised, borderColor: ringColor }]}
        accessible={!typed}
        accessibilityLabel={PACT_COPY.signA11y}>
        {typed ? (
          <TextInput
            value={text}
            onChangeText={setText}
            editable={!locked}
            placeholder={PACT_COPY.typedPlaceholder}
            placeholderTextColor={colors.textTertiary}
            autoFocus
            autoCapitalize="words"
            maxLength={40}
            style={[styles.typed, { color: colors.signInk }]}
            selectionColor={colors.signInk}
            accessibilityLabel={PACT_COPY.typedPlaceholder}
          />
        ) : (
          <GestureDetector gesture={pan}>
            <View style={StyleSheet.absoluteFill}>
              <Svg width="100%" height="100%">
                {strokes.map((stroke, i) => (
                  <Path
                    key={i}
                    d={toPath(stroke)}
                    stroke={colors.signInk}
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                ))}
              </Svg>
              {strokes.length === 0 ? (
                <Text variant="bodySm" color="textTertiary" style={styles.placeholder} pointerEvents="none">
                  {PACT_COPY.signHere}
                </Text>
              ) : null}
            </View>
          </GestureDetector>
        )}
        <View style={[styles.baseline, { backgroundColor: colors.borderStrong }]} pointerEvents="none" />
        <Text variant="labelSm" color="textTertiary" style={styles.caption} pointerEvents="none">
          {PACT_COPY.signature}
        </Text>
      </View>

      {locked ? null : (
        <View style={styles.actions}>
          <PressableScale
            scaleTo="small"
            onPress={() => {
              clear();
              setTyped((t) => !t);
            }}
            style={styles.link}>
            <Text variant="labelMd" style={styles.underline}>
              {typed ? PACT_COPY.drawInstead : PACT_COPY.typeInstead}
            </Text>
          </PressableScale>
          <PressableScale scaleTo="small" onPress={clear} style={styles.link}>
            <Text variant="labelMd" color="textSecondary" style={styles.underline}>
              {PACT_COPY.clear}
            </Text>
          </PressableScale>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.xs },
  box: {
    height: PAD_HEIGHT,
    borderRadius: radius.md,
    borderWidth: borderWidth.ring,
    overflow: 'hidden',
  },
  placeholder: { position: 'absolute', top: spacing.sm, left: spacing.md },
  typed: {
    flex: 1,
    fontFamily: fonts.serif.italic,
    fontSize: 30,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  baseline: { position: 'absolute', left: spacing.md, right: spacing.md, bottom: spacing.xl, height: StyleSheet.hairlineWidth },
  caption: { position: 'absolute', left: spacing.md, bottom: spacing.xs },
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  link: { minHeight: 44, justifyContent: 'center' },
  underline: { textDecorationLine: 'underline' },
});
