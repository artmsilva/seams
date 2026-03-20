import type { CSSObject, StitchesConfig } from "../types/css.js";

import { toCamelCase } from "./toCamelCase.js";
import { toHyphenCase } from "./toHyphenCase.js";
import { toPolyfilledValue } from "./toPolyfilledValue.js";
import { toResolvedMediaQueryRanges } from "./toResolvedMediaQueryRanges.js";
import { toResolvedSelectors } from "./toResolvedSelectors.js";
import { toSizingValue } from "./toSizingValue.js";
import { toTailDashed } from "./toTailDashed.js";
import { toTokenizedValue } from "./toTokenizedValue.js";

/** Comma matcher outside rounded brackets. */
const comma = /\s*,\s*(?![^()]*\))/;

/** Default toString method of Objects. */
const toStringOfObject = Object.prototype.toString;

/** CSS Properties whose number values should be unitless. */
export const unitlessProps: Record<string, 1> = {
  animationIterationCount: 1,
  borderImageOutset: 1,
  borderImageSlice: 1,
  borderImageWidth: 1,
  boxFlex: 1,
  boxFlexGroup: 1,
  boxOrdinalGroup: 1,
  columnCount: 1,
  columns: 1,
  flex: 1,
  flexGrow: 1,
  flexPositive: 1,
  flexShrink: 1,
  flexNegative: 1,
  flexOrder: 1,
  gridRow: 1,
  gridRowEnd: 1,
  gridRowSpan: 1,
  gridRowStart: 1,
  gridColumn: 1,
  gridColumnEnd: 1,
  gridColumnSpan: 1,
  gridColumnStart: 1,
  msGridRow: 1,
  msGridRowSpan: 1,
  msGridColumn: 1,
  msGridColumnSpan: 1,
  fontWeight: 1,
  lineHeight: 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  tabSize: 1,
  widows: 1,
  zIndex: 1,
  zoom: 1,
  WebkitLineClamp: 1,

  // SVG-related properties
  fillOpacity: 1,
  floodOpacity: 1,
  stopOpacity: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
  strokeMiterlimit: 1,
  strokeOpacity: 1,
  strokeWidth: 1,
};

/**
 * Converts a CSSOM-compatible rule to a CSS string.
 */
const toCssString = (declarations: string[], selectors: string[], conditions: string[]): string =>
  `${conditions.map((condition) => `${condition}{`).join("")}${selectors.length ? `${selectors.join(",")}{` : ""}${declarations.join(";")}${selectors.length ? `}` : ""}${Array(conditions.length ? conditions.length + 1 : 0).join("}")}`;

/**
 * Converts style objects into CSSOM-compatible CSS text strings.
 * Handles at-rules, nesting, tokens, and vendor prefixes.
 */
export const toCssRules = (
  style: CSSObject,
  selectors: string[],
  conditions: string[],
  config: StitchesConfig,
  onCssText: (cssText: string) => void,
): void => {
  /** CSSOM-compatible rule being created. */
  let currentRule: [string[], string[], string[]] | undefined = undefined;

  /** Last utility that was used, cached to prevent recursion. */
  let lastUtil: ((data: unknown) => CSSObject) | null = null;

  /** Last polyfill that was used, cached to prevent recursion. */
  let lastPoly: ((data: string | number) => CSSObject) | null = null;

  /** Walks CSS styles and converts them into CSSOM-compatible rules. */
  const walk = (style: CSSObject, selectors: string[], conditions: string[]): void => {
    let name: string;
    let data: unknown;

    const each = (style: CSSObject): void => {
      for (name in style) {
        /** Whether the current name represents an at-rule. */
        const isAtRuleLike = name.charCodeAt(0) === 64;

        const styleValue = style[name];
        const datas = isAtRuleLike && Array.isArray(styleValue) ? styleValue : [styleValue];

        for (data of datas) {
          const camelName = toCamelCase(name);

          /** Whether the current data represents a nesting rule. */
          const isRuleLike =
            typeof data === "object" &&
            data &&
            (data as object).toString === toStringOfObject &&
            (!(camelName in config.utils) || !selectors.length);

          // If the left-hand "name" matches a configured utility
          // conditionally transform the current data using the configured utility
          if (camelName in config.utils && !isRuleLike) {
            const util = config.utils[camelName]!;

            if (util !== lastUtil) {
              lastUtil = util;
              each(util(data) as CSSObject);
              lastUtil = null;
              continue;
            }
          }
          // Otherwise, if the left-hand "name" matches a configured polyfill
          // conditionally transform the current data using the polyfill
          else if (camelName in toPolyfilledValue) {
            const poly = toPolyfilledValue[camelName]!;

            if (poly !== lastPoly) {
              lastPoly = poly;
              each(poly(data as string | number));
              lastPoly = null;
              continue;
            }
          }

          // If the left-hand "name" matches a configured at-rule
          if (isAtRuleLike) {
            // Transform the current name with the configured media at-rule prelude
            const atRuleName = name.slice(1);
            name = toResolvedMediaQueryRanges(
              atRuleName in config.media ? "@media " + config.media[atRuleName] : name,
            );
          }

          if (isRuleLike) {
            /** Next conditions, which may include one new condition (if this is an at-rule). */
            const nextConditions = isAtRuleLike ? conditions.concat(name) : [...conditions];

            /** Next selectors, which may include one new selector (if this is not an at-rule). */
            const nextSelections = isAtRuleLike
              ? [...selectors]
              : toResolvedSelectors(selectors, name.split(comma));

            if (currentRule !== undefined) {
              onCssText(toCssString(...currentRule));
            }

            currentRule = undefined;

            walk(data as CSSObject, nextSelections, nextConditions);
          } else {
            if (currentRule === undefined) {
              currentRule = [[], selectors, conditions];
            }

            /** CSS left-hand side value, which may be a specially-formatted custom property. */
            let cssName = name;
            if (!isAtRuleLike && name.charCodeAt(0) === 36) {
              cssName = `--${toTailDashed(config.prefix)}${name.slice(1).replace(/\$/g, "-")}`;
            }

            /** CSS right-hand side value. */
            let cssValue: string;

            if (isRuleLike) {
              cssValue = String(data);
            } else if (typeof data === "number") {
              // Replace all non-unitless props that are not custom properties with pixel versions
              cssValue =
                data && !(camelName in unitlessProps) && cssName.charCodeAt(0) !== 45
                  ? String(data) + "px"
                  : String(data);
            } else {
              // Replace tokens with stringified primitive values
              cssValue = toTokenizedValue(
                toSizingValue(camelName, data == null ? "" : String(data)),
                config.prefix,
                config.themeMap[camelName],
              );
            }

            currentRule[0].push(
              `${isAtRuleLike ? `${cssName} ` : `${toHyphenCase(cssName)}:`}${cssValue}`,
            );
          }
        }
      }
    };

    each(style);

    if (currentRule !== undefined) {
      onCssText(toCssString(...currentRule));
    }
    currentRule = undefined;
  };

  walk(style, selectors, conditions);
};
