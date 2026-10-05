/**
 * `sv()` — style variants with the API shape of cva (joe-bell/cva): base, variants,
 * defaultVariants, compoundVariants. Returns a flattened React Native style object instead of
 * class strings. Boolean variants use 'true' / 'false' keys (Tamagui convention).
 *
 *   const button = sv({
 *     base: { borderRadius: 16 },
 *     variants: { size: { sm: { height: 40 }, lg: { height: 56 } }, disabled: { true: { opacity: 0.5 } } },
 *     defaultVariants: { size: 'lg' },
 *     compoundVariants: [{ size: 'sm', disabled: true, style: { opacity: 0.4 } }],
 *   });
 *   button({ size: 'sm', disabled: true });
 */
import { StyleSheet, type ImageStyle, type TextStyle, type ViewStyle } from 'react-native';

type AnyStyle = ViewStyle | TextStyle | ImageStyle;
type VariantMap<S> = Record<string, Record<string, S>>;

type BoolKey<K> = K extends 'true' | 'false' ? boolean : K;

export type VariantProps<V extends VariantMap<unknown>> = {
  [K in keyof V]?: BoolKey<keyof V[K]>;
};

type Config<S extends AnyStyle, V extends VariantMap<S>> = {
  base?: S;
  variants: V;
  defaultVariants?: VariantProps<V>;
  compoundVariants?: (VariantProps<V> & { style: S })[];
};

export function sv<S extends AnyStyle, V extends VariantMap<S>>(config: Config<S, V>) {
  return (props: VariantProps<V> = {}): S => {
    const selected: Record<string, unknown> = { ...config.defaultVariants, ...stripUndefined(props) };
    const styles: (S | undefined)[] = [config.base];

    for (const key of Object.keys(config.variants)) {
      const value = selected[key];
      if (value === undefined) continue;
      styles.push(config.variants[key][String(value)]);
    }

    for (const { style, ...conditions } of config.compoundVariants ?? []) {
      const matches = Object.entries(conditions).every(([k, v]) => selected[k] === v);
      if (matches) styles.push(style);
    }

    return StyleSheet.flatten(styles) as S;
  };
}

function stripUndefined(obj: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));
}
