import { toCssRules } from '../convert/toCssRules.js';
import { toHash } from '../convert/toHash.js';
import { toTailDashed } from '../convert/toTailDashed.js';
import type { Sheet } from '../sheet.js';
import type { CSSObject, StitchesConfig } from '../types/css.js';
import { createMemo } from '../utility/createMemo.js';
import { define } from '../utility/define.js';

const createKeyframesFunctionMap = createMemo<KeyframesFn, []>();

/**
 * Keyframes object returned by the keyframes function.
 */
export interface KeyframesObject {
  (): string;
  readonly name: string;
  toString(): string;
}

/**
 * Function signature for keyframes.
 */
export type KeyframesFn = (style: CSSObject) => KeyframesObject;

/**
 * Creates the keyframes function.
 * Returns a function that applies a keyframes rule.
 */
export const createKeyframesFunction = (
  config: StitchesConfig,
  sheet: Sheet,
): KeyframesFn =>
  createKeyframesFunctionMap(config, () => (style: CSSObject): KeyframesObject => {
    /** Keyframes Unique Identifier: `{CONFIG_PREFIX}k-{KEYFRAME_UUID}` */
    const name = `${toTailDashed(config.prefix)}k-${toHash(style)}`;

    const render = (): string => {
      if (!sheet.rules.global.cache.has(name)) {
        sheet.rules.global.cache.add(name);

        const cssRules: string[] = [];

        toCssRules(style, [], [], config, (cssText) => cssRules.push(cssText));

        const cssText = `@keyframes ${name}{${cssRules.join('')}}`;

        sheet.rules.global.apply(cssText);
      }

      return name;
    };

    return define(render, {
      get name() {
        return render();
      },
      toString: render,
    }) as KeyframesObject;
  });
