import type { Seams } from "@artmsilva/seams-core";

/**
 * Whether we're in a browser environment with CSSStyleSheet constructable support.
 */
const supportsConstructableStylesheets =
  typeof CSSStyleSheet !== "undefined" && typeof CSSStyleSheet.prototype.replaceSync === "function";

/**
 * Creates a `CSSStyleSheet` from a Seams instance's collected CSS.
 *
 * Use this to get a snapshot of all Seams-generated CSS at call time.
 * The returned stylesheet is static -- it does not update when new Seams
 * rules are added. For reactive updates, use `SeamsController` instead.
 *
 * @example
 * ```ts
 * import { seamsStyles } from '@artmsilva/seams-lit';
 * import { stitches } from '../seams.config';
 *
 * class MyComponent extends LitElement {
 *   static styles = [seamsStyles(stitches)];
 * }
 * ```
 *
 * @param instance - A Seams instance (returned by `createStitches()`)
 * @returns A `CSSStyleSheet` containing all collected Seams CSS
 */
export const seamsStyles = (instance: Seams): CSSStyleSheet => {
  if (!supportsConstructableStylesheets) {
    throw new Error(
      "seamsStyles() requires constructable CSSStyleSheet support. " +
        "This API is only available in browser environments.",
    );
  }

  const sheet = new CSSStyleSheet();
  sheet.replaceSync(instance.getCssText());
  return sheet;
};
