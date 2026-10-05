/**
 * Platform flags, evaluated once. Prefer these over ad-hoc `Platform.OS` checks so guards for
 * native-only APIs (haptics, share sheet, keyboard behaviour) read the same everywhere.
 */
import { Platform } from 'react-native';

export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
/** iOS or Android (anything that is not react-native-web). */
export const isNative = !isWeb;

/** Pick a value per platform family: `platformSelect({ ios: 'padding', default: undefined })`. */
export function platformSelect<T>(options: { ios?: T; android?: T; web?: T; native?: T; default: T }): T {
  if (isIOS && options.ios !== undefined) return options.ios;
  if (isAndroid && options.android !== undefined) return options.android;
  if (isWeb && options.web !== undefined) return options.web;
  if (isNative && options.native !== undefined) return options.native;
  return options.default;
}
