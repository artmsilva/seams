import type * as CSS from 'csstype';

import type { ThemeScale } from '../default/defaultThemeMap.js';

/**
 * A CSS object with nested rules and token support.
 */
export type CSSObject = {
  [K: string]: CSSValue | CSSObject | CSSObject[] | undefined;
};

/**
 * A CSS value that can be a string, number, or undefined.
 */
export type CSSValue = string | number | undefined;

/**
 * CSS properties with additional Stitches-specific features.
 */
export type CSSProperties = CSS.Properties<string | number> & {
  // Allow $ prefix for custom properties
  [K: `$${string}`]: CSSValue;
};

/**
 * Media query configuration mapping names to query strings.
 */
export type MediaConfig = Record<string, string>;

/**
 * Theme configuration mapping scale names to token objects.
 */
export type ThemeConfig = {
  [K in ThemeScale]?: Record<string, string | number>;
};

/**
 * Theme map configuration mapping CSS properties to theme scales.
 */
export type ThemeMapConfig = Record<string, ThemeScale | string>;

/**
 * Utility function configuration.
 */
export type UtilsConfig = Record<string, (value: unknown) => CSSObject>;

/**
 * Internal Stitches configuration.
 */
export interface StitchesConfig {
  prefix: string;
  media: MediaConfig;
  theme: ThemeConfig;
  themeMap: ThemeMapConfig;
  utils: UtilsConfig;
}

/**
 * User-provided configuration for createStitches.
 */
export interface CreateStitchesConfig {
  prefix?: string;
  media?: MediaConfig;
  theme?: ThemeConfig;
  themeMap?: ThemeMapConfig;
  utils?: UtilsConfig;
}
