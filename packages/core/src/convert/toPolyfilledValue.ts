import type { CSSObject } from "../types/css.js";

const splitBySpace = /\s+(?![^()]*\))/;

const split =
  <T extends (...args: string[]) => CSSObject>(fn: T) =>
  (data: string | number): CSSObject =>
    fn(...(typeof data === "string" ? String(data).split(splitBySpace) : [String(data)]));

/**
 * Property polyfills that transform values into cross-browser compatible CSS.
 * Includes vendor prefixes and logical property expansions.
 */
export const toPolyfilledValue: Record<string, (data: string | number) => CSSObject> = {
  // Prefixed properties
  appearance: (d) => ({ WebkitAppearance: d, appearance: d }),
  backfaceVisibility: (d) => ({ WebkitBackfaceVisibility: d, backfaceVisibility: d }),
  backdropFilter: (d) => ({ WebkitBackdropFilter: d, backdropFilter: d }),
  backgroundClip: (d) => ({ WebkitBackgroundClip: d, backgroundClip: d }),
  boxDecorationBreak: (d) => ({ WebkitBoxDecorationBreak: d, boxDecorationBreak: d }),
  clipPath: (d) => ({ WebkitClipPath: d, clipPath: d }),
  content: (d) => ({
    content:
      String(d).includes('"') ||
      String(d).includes("'") ||
      /^([A-Za-z]+\([^]*|[^]*-quote|inherit|initial|none|normal|revert|unset)$/.test(String(d))
        ? d
        : `"${d}"`,
  }),
  hyphens: (d) => ({ WebkitHyphens: d, hyphens: d }),
  maskImage: (d) => ({ WebkitMaskImage: d, maskImage: d }),
  maskSize: (d) => ({ WebkitMaskSize: d, maskSize: d }),
  textSizeAdjust: (d) => ({ WebkitTextSizeAdjust: d, textSizeAdjust: d }),
  userSelect: (d) => ({ WebkitUserSelect: d, userSelect: d }),

  // Logical properties
  marginBlock: split((s, e) => ({ marginBlockStart: s, marginBlockEnd: e || s })),
  marginInline: split((s, e) => ({ marginInlineStart: s, marginInlineEnd: e || s })),
  maxSize: split((b, i) => ({ maxBlockSize: b, maxInlineSize: i || b })),
  minSize: split((b, i) => ({ minBlockSize: b, minInlineSize: i || b })),
  paddingBlock: split((s, e) => ({ paddingBlockStart: s, paddingBlockEnd: e || s })),
  paddingInline: split((s, e) => ({ paddingInlineStart: s, paddingInlineEnd: e || s })),
};
