/**
 * Theme token type representing a design token reference.
 */
export interface Token<
  Name extends string | number = string | number,
  Value extends string | number = string | number,
  Scale extends string | void = string | void,
  Prefix extends string | void = string | void,
> {
  /** The token name. */
  token: Name;
  /** The token value. */
  value: Value;
  /** The scale this token belongs to. */
  scale: Scale;
  /** The CSS prefix. */
  prefix: Prefix;
  /** The computed CSS value using var(). */
  computedValue: string;
  /** The CSS custom property name. */
  variable: string;
  /** Returns the computed value. */
  toString(): string;
}

/**
 * Theme scale configuration.
 */
export interface ThemeScales {
  borderStyles?: Record<string, string | number>;
  borderWidths?: Record<string, string | number>;
  colors?: Record<string, string | number>;
  fonts?: Record<string, string | number>;
  fontSizes?: Record<string, string | number>;
  fontWeights?: Record<string, string | number>;
  letterSpacings?: Record<string, string | number>;
  lineHeights?: Record<string, string | number>;
  radii?: Record<string, string | number>;
  shadows?: Record<string, string | number>;
  sizes?: Record<string, string | number>;
  space?: Record<string, string | number>;
  transitions?: Record<string, string | number>;
  zIndices?: Record<string, string | number>;
}

/**
 * Converts a theme definition into typed tokens.
 */
export type ThemeTokens<Theme extends ThemeScales, Prefix extends string = ""> = {
  [Scale in keyof Theme]: {
    [TokenName in keyof Theme[Scale]]: Token<
      Extract<TokenName, string | number>,
      Theme[Scale][TokenName] & (string | number),
      Extract<Scale, string>,
      Prefix
    >;
  };
};
