import type { Seams } from "@artmsilva/seams-core";

/**
 * Whether we're in a browser environment with CSSStyleSheet constructable support.
 */
const supportsConstructableStylesheets =
  typeof CSSStyleSheet !== "undefined" && typeof CSSStyleSheet.prototype.replaceSync === "function";

/**
 * Adopts Seams-generated CSS into a shadow root's `adoptedStyleSheets`.
 *
 * This is a one-shot utility -- it creates a `CSSStyleSheet` from the
 * current Seams CSS and appends it to the shadow root. It does not
 * set up reactive updates. For automatic syncing, use `SeamsController`.
 *
 * @example
 * ```ts
 * import { adoptSeams } from '@artmsilva/seams-lit';
 * import { stitches } from '../seams.config';
 *
 * class MyComponent extends LitElement {
 *   connectedCallback() {
 *     super.connectedCallback();
 *     adoptSeams(this.shadowRoot!, stitches);
 *   }
 * }
 * ```
 *
 * @param shadowRoot - The shadow root to adopt styles into
 * @param instance - A Seams instance (returned by `createStitches()`)
 * @returns The `CSSStyleSheet` that was adopted, or `null` in non-browser environments
 */
export const adoptSeams = (shadowRoot: ShadowRoot, instance: Seams): CSSStyleSheet | null => {
  if (!supportsConstructableStylesheets) {
    return null;
  }

  const sheet = new CSSStyleSheet();
  sheet.replaceSync(instance.getCssText());

  shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, sheet];

  return sheet;
};
