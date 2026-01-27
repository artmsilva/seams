import { toCssRules } from '../convert/toCssRules.js';
import { toHash } from '../convert/toHash.js';
import type { Sheet } from '../sheet.js';
import type { CSSObject, StitchesConfig } from '../types/css.js';
import { createMemo } from '../utility/createMemo.js';
import { define } from '../utility/define.js';

const createGlobalCssFunctionMap = createMemo<GlobalCssFn, []>();

/**
 * GlobalCss object returned by the globalCss function.
 */
export interface GlobalCssObject {
  (): string;
  toString(): string;
}

/**
 * Function signature for globalCss.
 */
export type GlobalCssFn = (...styles: CSSObject[]) => GlobalCssObject;

/**
 * Creates the globalCss function.
 * Returns a function that applies global styles.
 */
export const createGlobalCssFunction = (
  config: StitchesConfig,
  sheet: Sheet,
): GlobalCssFn =>
  createGlobalCssFunctionMap(config, () => (...styles: CSSObject[]): GlobalCssObject => {
    const render = (): string => {
      for (let style of styles) {
        style = typeof style === 'object' && style ? style : {};

        const uuid = toHash(style);

        if (!sheet.rules.global.cache.has(uuid)) {
          sheet.rules.global.cache.add(uuid);

          // Support @import rules
          if ('@import' in style) {
            const importValues = ([] as string[]).concat(
              style['@import'] as string | string[],
            );

            for (let importValue of importValues) {
              // Wrap import in quotes as a convenience
              importValue =
                importValue.includes('"') || importValue.includes("'")
                  ? importValue
                  : `"${importValue}"`;

              sheet.rules.global.apply(`@import ${importValue};`);
            }

            // Create a copy without @import for further processing
            const { '@import': _, ...restStyle } = style;
            style = restStyle;
          }

          toCssRules(style, [], [], config, (cssText) => {
            sheet.rules.global.apply(cssText);
          });
        }
      }

      return '';
    };

    return define(render, {
      toString: render,
    }) as GlobalCssObject;
  });
