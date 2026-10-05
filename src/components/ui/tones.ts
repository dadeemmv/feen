/**
 * Tone → colour-role resolution shared by Chip, Tag, IconTile, Badge, Toast and Dialog badges.
 * A tone names a *meaning* (economy item, feedback state, content tint); the resolver maps it to
 * semantic tokens of the current colour mode, so tones also work on brand surfaces.
 */
import type { ContentTone } from '@/content/types';
import type { Theme } from '@/theme';

export type FeedbackTone = 'success' | 'danger' | 'warning' | 'info';
export type EconomyTone = 'streak' | 'lives' | 'coin' | 'shield' | 'pro';
export type Tone = 'neutral' | 'accent' | 'brand' | FeedbackTone | EconomyTone | ContentTone;

export type ToneColors = {
  /** Soft tinted background. */
  bg: string;
  /** Text/icon colour on `bg`. */
  fg: string;
  /** Border for outline variants. */
  border: string;
  /** Solid fill. */
  solid: string;
  /** Text/icon colour on `solid`. */
  onSolid: string;
};

export function resolveTone(theme: Theme, tone: Tone): ToneColors {
  const c = theme.colors;
  switch (tone) {
    case 'neutral':
      return { bg: c.fill, fg: c.text, border: c.border, solid: c.text, onSolid: c.surface };
    case 'accent':
      return { bg: c.accentBg, fg: c.accentText, border: c.accentBorder, solid: c.accentSolid, onSolid: c.onAccent };
    case 'brand':
      return { bg: c.brandBg, fg: c.brandText, border: c.brandBorder, solid: c.brandSolid, onSolid: c.onBrand };
    case 'success':
      return { bg: c.successBg, fg: c.successText, border: c.successBorder, solid: c.successSolid, onSolid: c.onBrand };
    case 'danger':
      return { bg: c.dangerBg, fg: c.dangerText, border: c.dangerBorder, solid: c.dangerSolid, onSolid: c.onBrand };
    case 'warning':
      return { bg: c.warningBg, fg: c.warningText, border: c.warningSolid, solid: c.warningSolid, onSolid: c.onAccent };
    case 'info':
      return { bg: c.infoBg, fg: c.infoText, border: c.infoSolid, solid: c.infoSolid, onSolid: c.onBrand };
    case 'streak':
      return { bg: c.streakBg, fg: c.streak, border: c.streak, solid: c.streak, onSolid: c.onBrand };
    case 'lives':
      return { bg: c.livesBg, fg: c.lives, border: c.lives, solid: c.lives, onSolid: c.onBrand };
    case 'coin':
      return { bg: c.coinBg, fg: c.coin, border: c.coin, solid: c.coin, onSolid: c.onBrand };
    case 'shield':
      return { bg: c.shieldBg, fg: c.shield, border: c.shield, solid: c.shield, onSolid: c.onBrand };
    case 'pro':
      return { bg: c.proBg, fg: c.pro, border: c.pro, solid: c.pro, onSolid: c.onBrand };
    case 'mint':
      return { bg: c.tintMint, fg: c.tintMintText, border: c.tintMintText, solid: c.tintMintText, onSolid: c.onBrand };
    case 'sky':
      return { bg: c.tintSky, fg: c.tintSkyText, border: c.tintSkyText, solid: c.tintSkyText, onSolid: c.onBrand };
    case 'blush':
      return { bg: c.tintBlush, fg: c.tintBlushText, border: c.tintBlushText, solid: c.tintBlushText, onSolid: c.onBrand };
    case 'butter':
      return {
        bg: c.tintButter,
        fg: c.tintButterText,
        border: c.tintButterText,
        solid: c.tintButterText,
        onSolid: c.onBrand,
      };
    case 'lilac':
      return { bg: c.tintLilac, fg: c.tintLilacText, border: c.tintLilacText, solid: c.tintLilacText, onSolid: c.onBrand };
  }
}
