import { ThemeToken } from '../ThemeToken.js';
import { toHash } from '../convert/toHash.js';
import { toTailDashed } from '../convert/toTailDashed.js';
import { toTokenizedValue } from '../convert/toTokenizedValue.js';
import type { Sheet } from '../sheet.js';
import type { StitchesConfig, ThemeConfig } from '../types/css.js';
import { createMemo } from '../utility/createMemo.js';

const createCreateThemeFunctionMap = createMemo<CreateThemeFn, []>();

/**
 * Theme object returned by createTheme.
 * Uses intersection to combine scale tokens with metadata properties.
 */
export type ThemeObject = {
  [scale: string]: {
    [token: string]: ThemeToken;
  };
} & {
  readonly className: string;
  readonly selector: string;
  toString(): string;
};

/**
 * Function signature for createTheme.
 */
export type CreateThemeFn = {
  (className: string, theme: ThemeConfig): ThemeObject;
  (theme: ThemeConfig): ThemeObject;
};

/**
 * Creates the createTheme function.
 * Returns a function that applies a theme and returns tokens of that theme.
 */
export const createCreateThemeFunction = (
  config: StitchesConfig,
  sheet: Sheet,
): CreateThemeFn =>
  createCreateThemeFunctionMap(config, () => {
    return ((classNameOrTheme: string | ThemeConfig, styleArg?: ThemeConfig): ThemeObject => {
      // Theme is the first argument if it is an object, otherwise the second argument
      const style: ThemeConfig =
        typeof classNameOrTheme === 'object' && classNameOrTheme
          ? classNameOrTheme
          : (styleArg ?? {});

      // Class name is the first argument if it is a string, otherwise generate one
      let className =
        typeof classNameOrTheme === 'string' ? classNameOrTheme : '';

      if (!className) {
        className = `${toTailDashed(config.prefix)}t-${toHash(style)}`;
      }

      const selector = `.${className}`;

      const themeObject: Record<string, Record<string, ThemeToken>> = {};
      const cssProps: string[] = [];

      for (const scale in style) {
        themeObject[scale] = {};
        const scaleTokens = style[scale as keyof ThemeConfig];

        if (scaleTokens) {
          for (const token in scaleTokens) {
            const propertyName = `--${toTailDashed(config.prefix)}${scale}-${token}`;
            const propertyValue = toTokenizedValue(
              String(scaleTokens[token]),
              config.prefix,
              scale,
            );

            themeObject[scale]![token] = new ThemeToken(
              token,
              propertyValue,
              scale,
              config.prefix,
            );

            cssProps.push(`${propertyName}:${propertyValue}`);
          }
        }
      }

      const render = (): string => {
        if (cssProps.length && !sheet.rules.themed.cache.has(className)) {
          sheet.rules.themed.cache.add(className);

          const rootPrelude = style === config.theme ? ':root,' : '';
          const cssText = `${rootPrelude}.${className}{${cssProps.join(';')}}`;

          sheet.rules.themed.apply(cssText);
        }

        return className;
      };

      return {
        ...themeObject,
        get className() {
          return render();
        },
        selector,
        toString: render,
      } as ThemeObject;
    }) as CreateThemeFn;
  });
