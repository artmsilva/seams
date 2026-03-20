import type { Seams } from "@artmsilva/seams-core";
import { ruleGroupNames } from "@artmsilva/seams-core";
import type { ReactiveController, ReactiveControllerHost } from "lit";

/**
 * Whether we're in a browser environment with CSSStyleSheet constructable support.
 */
const supportsConstructableStylesheets =
  typeof CSSStyleSheet !== "undefined" && typeof CSSStyleSheet.prototype.replaceSync === "function";

/**
 * The interval in milliseconds at which the controller checks for new Seams rules.
 */
const POLL_INTERVAL_MS = 16;

/**
 * A Lit ReactiveController that keeps a shadow root's adopted stylesheets
 * in sync with dynamically generated Seams CSS.
 *
 * The controller monitors the Seams sheet for new CSS rules by tracking
 * the total rule count. When new rules are detected, it updates the
 * adopted `CSSStyleSheet` via `replaceSync`.
 *
 * @example
 * ```ts
 * import { SeamsController } from '@artmsilva/seams-lit';
 * import { stitches, css } from '../seams.config';
 *
 * const buttonStyles = css({
 *   backgroundColor: '$primary',
 *   variants: {
 *     size: {
 *       sm: { padding: '$1' },
 *       lg: { padding: '$3' },
 *     }
 *   }
 * });
 *
 * class MyButton extends LitElement {
 *   private seams = new SeamsController(this, stitches);
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
export class SeamsController implements ReactiveController {
  private _host: ReactiveControllerHost & HTMLElement;
  private _instance: Seams;
  private _sheet: CSSStyleSheet | null = null;
  private _lastRuleCount = 0;
  private _pollTimer: ReturnType<typeof setInterval> | null = null;

  constructor(host: ReactiveControllerHost & HTMLElement, instance: Seams) {
    this._host = host;
    this._instance = instance;

    host.addController(this);
  }

  /**
   * The adopted CSSStyleSheet managed by this controller.
   * Will be `null` in non-browser environments.
   */
  get stylesheet(): CSSStyleSheet | null {
    return this._sheet;
  }

  /**
   * Called when the host element is connected to the DOM.
   * Creates the CSSStyleSheet and starts polling for new rules.
   */
  hostConnected(): void {
    if (!supportsConstructableStylesheets) return;

    const shadowRoot = this._host.shadowRoot;
    if (!shadowRoot) return;

    // Create and adopt the stylesheet if not already done
    if (!this._sheet) {
      this._sheet = new CSSStyleSheet();
      this._syncCss();
    }

    // Only add to adoptedStyleSheets if not already there
    if (!shadowRoot.adoptedStyleSheets.includes(this._sheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, this._sheet];
    }

    this._startPolling();
  }

  /**
   * Called when the host element is disconnected from the DOM.
   * Stops polling for CSS updates.
   */
  hostDisconnected(): void {
    this._stopPolling();
  }

  /**
   * Called before the host element updates.
   * Syncs the CSS to ensure all new rules from the current render are adopted.
   */
  hostUpdate(): void {
    this._syncCss();
  }

  /**
   * Force an immediate sync of Seams CSS into the adopted stylesheet.
   */
  sync(): void {
    this._syncCss();
  }

  /**
   * Returns the current total number of rules across all Seams groups.
   */
  private _countRules(): number {
    let count = 0;
    for (const name of ruleGroupNames) {
      count += this._instance.sheet.rules[name].rules.length;
    }
    return count;
  }

  /**
   * Syncs the Seams CSS into the adopted CSSStyleSheet.
   * Only updates if new rules have been added since the last sync.
   */
  private _syncCss(): void {
    if (!this._sheet) return;

    const currentCount = this._countRules();
    if (currentCount !== this._lastRuleCount) {
      this._lastRuleCount = currentCount;
      this._sheet.replaceSync(this._instance.getCssText());
    }
  }

  /**
   * Starts a polling interval to detect new Seams rules added
   * outside of Lit's update cycle (e.g., from event handlers or timers).
   */
  private _startPolling(): void {
    if (this._pollTimer !== null) return;

    this._pollTimer = setInterval(() => {
      const currentCount = this._countRules();
      if (currentCount !== this._lastRuleCount) {
        this._syncCss();
        this._host.requestUpdate();
      }
    }, POLL_INTERVAL_MS);
  }

  /**
   * Stops the polling interval.
   */
  private _stopPolling(): void {
    if (this._pollTimer !== null) {
      clearInterval(this._pollTimer);
      this._pollTimer = null;
    }
  }
}
