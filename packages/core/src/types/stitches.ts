import type * as CSS from "csstype";

import type { CSSObject, MediaConfig, ThemeConfig, ThemeMapConfig, UtilsConfig } from "./css.js";
import type { Token } from "./theme.js";

/**
 * CSS type with media queries and theme tokens.
 * Simplified version for better TypeScript performance.
 */
export type StitchesCSS<
  Media extends MediaConfig = MediaConfig,
  Theme extends ThemeConfig = ThemeConfig,
  _ThemeMap extends ThemeMapConfig = ThemeMapConfig,
  _Utils extends UtilsConfig = UtilsConfig,
> = CSS.Properties<string | number> & {
  // Media query nesting
  [K in `@${string}` | `&${string}`]?: StitchesCSS<Media, Theme>;
} & {
  // Custom properties
  [K in `$${string}`]?: string | number;
} & CSSObject;

/**
 * Variant definition type.
 */
export interface VariantDefinition {
  [variantName: string]: {
    [variantValue: string]: CSSObject;
  };
}

/**
 * Style definition with variants support.
 * Note: Uses intersection type to avoid index signature conflicts.
 */
export type StyleDefinition = CSSObject & {
  variants?: VariantDefinition;
  compoundVariants?: Array<{
    [key: string]: unknown;
    css?: CSSObject;
  }>;
  defaultVariants?: Record<string, string | number | boolean>;
};

/**
 * CSS function type.
 */
export interface CssFunctionType {
  (...composers: Array<string | StyleDefinition | unknown>): {
    (props?: Record<string, unknown>): {
      className: string;
      selector: string;
      props: Record<string, unknown>;
    };
    className: string;
    selector: string;
    toString(): string;
  };
  withConfig(config: {
    componentId?: string;
    displayName?: string;
    shouldForwardStitchesProp?: (prop: string) => boolean | void;
  }): CssFunctionType;
}

/**
 * Global CSS function type.
 */
export interface GlobalCssFunctionType {
  (...styles: CSSObject[]): {
    (): string;
    toString(): string;
  };
}

/**
 * Keyframes function type.
 */
export interface KeyframesFunctionType {
  (style: Record<string, CSSObject>): {
    (): string;
    name: string;
    toString(): string;
  };
}

/**
 * Create theme function type.
 */
export interface CreateThemeFunctionType<Theme extends ThemeConfig = ThemeConfig> {
  (
    nameOrTheme: string | Theme,
    theme?: Theme,
  ): string & {
    className: string;
    selector: string;
  } & {
    [scale: string]: {
      [token: string]: Token;
    };
  };
}

/**
 * Full Stitches configuration type.
 */
export interface StitchesConfigType<
  Prefix extends string = "",
  Media extends MediaConfig = MediaConfig,
  Theme extends ThemeConfig = ThemeConfig,
  ThemeMap extends ThemeMapConfig = ThemeMapConfig,
  Utils extends UtilsConfig = UtilsConfig,
> {
  config: {
    prefix: Prefix;
    media: Media;
    theme: Theme;
    themeMap: ThemeMap;
    utils: Utils;
  };
  prefix: Prefix;
  globalCss: GlobalCssFunctionType;
  keyframes: KeyframesFunctionType;
  createTheme: CreateThemeFunctionType<Theme>;
  theme: string & {
    className: string;
    selector: string;
    [scale: string]: unknown;
  };
  reset: () => void;
  getCssText: () => string;
  css: CssFunctionType;
}
