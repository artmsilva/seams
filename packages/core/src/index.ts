// Main API
export { createStitches } from "./createStitches.js";
export type { Seams } from "./createStitches.js";
/** @deprecated Use `Seams` instead */
export type { Seams as Stitches } from "./createStitches.js";

// Features
export {
  createCssFunction,
  createCreateThemeFunction,
  createGlobalCssFunction,
  createKeyframesFunction,
} from "./features/index.js";
export type {
  ComponentConfig,
  CssComponent,
  CssFn,
  CreateThemeFn,
  GlobalCssFn,
  GlobalCssObject,
  KeyframesFn,
  KeyframesObject,
  RenderProps,
  RenderResult,
  StyleConfig,
  ThemeObject,
} from "./features/index.js";

// ThemeToken
export { ThemeToken } from "./ThemeToken.js";

// Sheet
export { createSheet, createRulesInjectionDeferrer, ruleGroupNames } from "./sheet.js";
export type { RuleGroup, RuleGroupName, Sheet } from "./sheet.js";

// Default theme map
export { defaultThemeMap } from "./default/defaultThemeMap.js";
export type { ThemeScale } from "./default/defaultThemeMap.js";

// Types
export type {
  CSSObject,
  CSSProperties,
  CSSValue,
  CreateStitchesConfig,
  MediaConfig,
  SeamsConfig,
  StitchesConfig,
  ThemeConfig,
  ThemeMapConfig,
  UtilsConfig,
} from "./types/css.js";

// Advanced types
export type {
  // Utility types
  Assign,
  DeepPartial,
  Function,
  Index,
  NumberKeys,
  Prefixed,
  RemoveIndex,
  String,
  StringKeys,
  Widen,
  WideObject,
  // Theme types
  Token,
  ThemeScales,
  ThemeTokens,
  // Styled component types
  $$StyledComponentMedia,
  $$StyledComponentProps,
  $$StyledComponentType,
  CssComponent as CssComponentType,
  StyledComponentProps,
  StyledComponentType,
  TransformProps,
  VariantProps,
  // Seams types
  CssFunctionType,
  CreateThemeFunctionType,
  GlobalCssFunctionType,
  KeyframesFunctionType,
  SeamsConfigType,
  SeamsCSS,
  StitchesConfigType,
  StitchesCSS,
  StyleDefinition,
  VariantDefinition,
} from "./types/index.js";

// Utilities
export { createMemo, define, hasNames, hasOwn, internal } from "./utility/index.js";

// Converters
export {
  toCamelCase,
  toCssRules,
  toHash,
  toHyphenCase,
  toPolyfilledValue,
  toResolvedMediaQueryRanges,
  toResolvedSelectors,
  toSizingValue,
  toTailDashed,
  toTokenizedValue,
  unitlessProps,
} from "./convert/index.js";
