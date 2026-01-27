import { defaultThemeMap } from './default/defaultThemeMap.js';
import { createCssFunction } from './features/css.js';
import type { CssFn } from './features/css.js';
import { createCreateThemeFunction } from './features/createTheme.js';
import type { CreateThemeFn, ThemeObject } from './features/createTheme.js';
import { createGlobalCssFunction } from './features/globalCss.js';
import type { GlobalCssFn } from './features/globalCss.js';
import { createKeyframesFunction } from './features/keyframes.js';
import type { KeyframesFn } from './features/keyframes.js';
import { createSheet } from './sheet.js';
import type { Sheet } from './sheet.js';
import type {
  CreateStitchesConfig,
  MediaConfig,
  StitchesConfig,
  ThemeConfig,
  ThemeMapConfig,
  UtilsConfig,
} from './types/css.js';
import { createMemo } from './utility/createMemo.js';

const createCssMap = createMemo<Stitches, []>();

/**
 * The main Stitches instance interface.
 */
export interface Stitches {
  /** Create styled component classes */
  css: CssFn;
  /** Create global CSS styles */
  globalCss: GlobalCssFn;
  /** Create keyframe animations */
  keyframes: KeyframesFn;
  /** Create a new theme */
  createTheme: CreateThemeFn;
  /** Reset all generated CSS */
  reset: () => void;
  /** The default theme object */
  theme: ThemeObject;
  /** The internal stylesheet */
  sheet: Sheet;
  /** The resolved configuration */
  config: StitchesConfig;
  /** The CSS class prefix */
  prefix: string;
  /** Get all generated CSS as a string */
  getCssText: () => string;
  /** Get all generated CSS as a string */
  toString: () => string;
}

/**
 * Creates a new Stitches instance with the given configuration.
 *
 * @example
 * ```ts
 * const { css, styled, globalCss, keyframes, createTheme, theme } = createStitches({
 *   prefix: 'my-app',
 *   theme: {
 *     colors: {
 *       primary: '#0070f3',
 *       secondary: '#ff0080',
 *     },
 *     space: {
 *       1: '4px',
 *       2: '8px',
 *       3: '16px',
 *     },
 *   },
 *   media: {
 *     sm: '(min-width: 640px)',
 *     md: '(min-width: 768px)',
 *     lg: '(min-width: 1024px)',
 *   },
 *   utils: {
 *     mx: (value) => ({ marginLeft: value, marginRight: value }),
 *     my: (value) => ({ marginTop: value, marginBottom: value }),
 *   },
 * });
 * ```
 */
export const createStitches = (initConfig?: CreateStitchesConfig): Stitches => {
  let didRun = false;

  const instance = createCssMap(initConfig, (rawConfig) => {
    didRun = true;

    const config =
      typeof rawConfig === 'object' && rawConfig ? rawConfig : ({} as CreateStitchesConfig);

    // Internal configuration
    const prefix: string = 'prefix' in config ? String(config.prefix) : '';
    const media: MediaConfig =
      typeof config.media === 'object' && config.media ? config.media : {};
    const theme: ThemeConfig =
      typeof config.theme === 'object' && config.theme ? config.theme : {};
    const themeMap: ThemeMapConfig =
      typeof config.themeMap === 'object' && config.themeMap
        ? config.themeMap
        : { ...defaultThemeMap };
    const utils: UtilsConfig =
      typeof config.utils === 'object' && config.utils ? config.utils : {};

    /** External configuration. */
    const resolvedConfig: StitchesConfig = {
      prefix,
      media,
      theme,
      themeMap,
      utils,
    };

    /** Internal stylesheet. */
    const sheet = createSheet();

    const returnValue: Stitches = {
      css: createCssFunction(resolvedConfig, sheet),
      globalCss: createGlobalCssFunction(resolvedConfig, sheet),
      keyframes: createKeyframesFunction(resolvedConfig, sheet),
      createTheme: createCreateThemeFunction(resolvedConfig, sheet),
      reset() {
        sheet.reset();
        returnValue.theme.toString();
      },
      theme: {} as ThemeObject,
      sheet,
      config: resolvedConfig,
      prefix,
      getCssText: sheet.toString,
      toString: sheet.toString,
    };

    // Initialize default theme
    String((returnValue.theme = returnValue.createTheme(theme)));

    return returnValue;
  });

  if (!didRun) instance.reset();

  return instance;
};
