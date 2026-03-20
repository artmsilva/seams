import { toTailDashed } from "./toTailDashed.js";

/**
 * Token pattern that matches:
 * - Optional direction (+/-)
 * - Optional multiplier (numeric value)
 * - Separator ($ for theme token or -- for custom property)
 * - Token name (with optional nested $ separators)
 */
const tokenPattern = /([+-])?((?:\d+(?:\.\d*)?|\.\d+)(?:[Ee][+-]?\d+)?)?(\$|--)([$\w-]+)/g;

/**
 * Transforms design tokens in CSS values into CSS custom property references.
 *
 * Examples:
 * - `$colorPrimary` → `var(--{prefix}colors-colorPrimary)`
 * - `--my-color` → `var(--my-color)`
 * - `2$fontSize` → `calc(var(--{prefix}fontSizes-fontSize)*2)`
 * - `-1$spacing` → `calc(var(--{prefix}space-spacing)*-1)`
 */
export const toTokenizedValue = (value: string, prefix: string, scale?: string): string =>
  value.replace(
    tokenPattern,
    (
      $0,
      direction: string | undefined,
      multiplier: string | undefined,
      separator: string,
      token: string,
    ) =>
      // If separator is $ but multiplier exists without direction, return as-is
      // (handles cases like "2$" which shouldn't be transformed)
      (separator === "$") === !!multiplier
        ? $0
        : // Start calc wrapper if direction exists or separator is '--'
          (direction || separator === "--" ? "calc(" : "") +
          // Build the var() reference
          "var(--" +
          (separator === "$"
            ? // Theme token: add prefix and scale
              toTailDashed(prefix) +
              // Only add scale if token doesn't contain nested $
              (!token.includes("$") ? toTailDashed(scale ?? "") : "") +
              // Replace nested $ with dashes
              token.replace(/\$/g, "-")
            : // Custom property: pass through as-is
              token) +
          ")" +
          // Close calc wrapper with multiplier if needed
          (direction || separator === "--"
            ? "*" + (direction || "") + (multiplier || "1") + ")"
            : ""),
  );
