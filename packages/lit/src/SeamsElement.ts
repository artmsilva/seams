import type { Seams } from "@artmsilva/seams-core";
import { LitElement } from "lit";

import { SeamsController } from "./SeamsController.js";

/**
 * A LitElement base class that automatically adopts Seams-generated CSS
 * into the shadow root.
 *
 * Subclasses must set the static `seamsInstance` property to a Seams
 * instance (returned by `createStitches()`). The base class uses a
 * `SeamsController` internally to keep the shadow root in sync with
 * dynamically generated CSS rules.
 *
 * @example
 * ```ts
 * import { SeamsElement } from '@artmsilva/seams-lit';
 * import { stitches, css } from '../seams.config';
 *
 * const buttonStyles = css({
 *   backgroundColor: '$primary',
 *   padding: '$2',
 *   variants: {
 *     size: {
 *       sm: { padding: '$1' },
 *       lg: { padding: '$3' },
 *     }
 *   }
 * });
 *
 * class MyButton extends SeamsElement {
 *   static seamsInstance = stitches;
 *
 *   @property() size: 'sm' | 'lg' = 'sm';
 *
 *   render() {
 *     const styles = buttonStyles({ size: this.size });
 *     return html`<button class=${styles.className}><slot></slot></button>`;
 *   }
 * }
 * ```
 */
export class SeamsElement extends LitElement {
  /**
   * The Seams instance to use for CSS adoption.
   * Must be set by subclasses.
   */
  static seamsInstance: Seams;

  /**
   * The internal SeamsController that manages CSS adoption.
   */
  protected seamsController: SeamsController;

  constructor() {
    super();

    const ctor = this.constructor as typeof SeamsElement;

    if (!ctor.seamsInstance) {
      throw new Error(
        `${ctor.name} must set a static \`seamsInstance\` property. ` +
          "Assign the return value of createStitches() to the static property.",
      );
    }

    this.seamsController = new SeamsController(this, ctor.seamsInstance);
  }
}
