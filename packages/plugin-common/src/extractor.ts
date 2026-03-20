import { createStitches, toHash, toTailDashed, toCssRules } from "@artmsilva/seams-core";
import type { CSSObject, ThemeConfig } from "@artmsilva/seams-core";

import type { AnalysisResult, StitchesUsage } from "./analyzer.js";

/**
 * Extracted CSS rule information.
 */
export interface ExtractedRule {
  /** The CSS class name */
  className: string;
  /** The CSS selector */
  selector: string;
  /** The CSS rule text */
  cssText: string;
  /** The layer this rule belongs to */
  layer: "themed" | "global" | "styled" | "onevar" | "resonevar" | "allvar" | "inline";
  /** The source usage that generated this rule */
  usage: StitchesUsage;
}

/**
 * Result of CSS extraction.
 */
export interface ExtractionResult {
  /** All extracted CSS rules */
  rules: ExtractedRule[];
  /** CSS content organized by layer */
  layers: Map<string, string[]>;
  /** Map of component names to their class names */
  classNames: Map<string, string>;
  /** Usages that couldn't be extracted (contain dynamic values) */
  dynamicUsages: StitchesUsage[];
}

/**
 * Options for the CSS extractor.
 */
export interface ExtractorOptions {
  /** The Stitches configuration */
  config?: {
    prefix?: string;
    theme?: ThemeConfig;
    media?: Record<string, string>;
    themeMap?: Record<string, string>;
    utils?: Record<string, (value: unknown) => CSSObject>;
  };
}

/**
 * Extracts static CSS from analyzed Stitches usages.
 */
export const extractCss = (
  analysis: AnalysisResult,
  options: ExtractorOptions = {},
): ExtractionResult => {
  const rules: ExtractedRule[] = [];
  const layers = new Map<string, string[]>();
  const classNames = new Map<string, string>();
  const dynamicUsages: StitchesUsage[] = [];

  // Initialize layers
  const layerNames = [
    "themed",
    "global",
    "styled",
    "onevar",
    "resonevar",
    "allvar",
    "inline",
  ] as const;
  for (const layer of layerNames) {
    layers.set(layer, []);
  }

  // Get config from analysis or options
  const analysisConfig = analysis.configs[0]?.config;
  const mergedConfig = {
    prefix: options.config?.prefix ?? (analysisConfig?.["prefix"] as string | undefined) ?? "",
    theme: options.config?.theme ?? (analysisConfig?.["theme"] as ThemeConfig | undefined) ?? {},
    media:
      options.config?.media ??
      (analysisConfig?.["media"] as Record<string, string> | undefined) ??
      {},
    themeMap:
      options.config?.themeMap ??
      (analysisConfig?.["themeMap"] as Record<string, string> | undefined) ??
      {},
    utils:
      options.config?.utils ??
      (analysisConfig?.["utils"] as Record<string, (value: unknown) => CSSObject> | undefined) ??
      {},
  };

  // Create a Stitches instance for CSS generation
  const stitches = createStitches(mergedConfig);

  for (const usage of analysis.usages) {
    if (usage.hasDynamicValues) {
      dynamicUsages.push(usage);
      continue;
    }

    if (!usage.staticStyles) {
      continue;
    }

    try {
      switch (usage.type) {
        case "css":
        case "styled": {
          const styles = usage.staticStyles;
          const {
            variants,
            compoundVariants,
            defaultVariants: _defaultVariants,
            ...baseStyles
          } = styles as {
            variants?: Record<string, Record<string, CSSObject>>;
            compoundVariants?: Array<{ css?: CSSObject; [key: string]: unknown }>;
            defaultVariants?: Record<string, unknown>;
            [key: string]: unknown;
          };

          // Generate class name
          const hash = toHash(baseStyles);
          const componentNamePrefix = usage.name ? `c-${usage.name}` : "c";
          const className = `${toTailDashed(mergedConfig.prefix)}${componentNamePrefix}-${hash}`;
          const selector = `.${className}`;

          if (usage.name) {
            classNames.set(usage.name, className);
          }

          // Extract base styles
          const cssRules: string[] = [];
          toCssRules(baseStyles as CSSObject, [selector], [], stitches.config, (cssText) =>
            cssRules.push(cssText),
          );

          for (const cssText of cssRules) {
            rules.push({
              className,
              selector,
              cssText,
              layer: "styled",
              usage,
            });
            layers.get("styled")!.push(cssText);
          }

          // Extract variant styles
          if (variants) {
            for (const variantName in variants) {
              const variantPairs = variants[variantName]!;
              for (const pairName in variantPairs) {
                const variantStyle = variantPairs[pairName]!;
                const variantHash = toHash(variantStyle);
                const variantClassName = `${className}-${variantHash}-${variantName}-${pairName}`;
                const variantSelector = `.${variantClassName}`;

                const variantRules: string[] = [];
                toCssRules(variantStyle, [variantSelector], [], stitches.config, (cssText) =>
                  variantRules.push(cssText),
                );

                for (const cssText of variantRules) {
                  rules.push({
                    className: variantClassName,
                    selector: variantSelector,
                    cssText,
                    layer: "onevar",
                    usage,
                  });
                  layers.get("onevar")!.push(cssText);
                }
              }
            }
          }

          // Extract compound variant styles
          if (compoundVariants) {
            for (const compound of compoundVariants) {
              const { css: compoundStyle, ..._conditions } = compound;
              if (compoundStyle) {
                const compoundHash = toHash(compoundStyle);
                const compoundClassName = `${className}-${compoundHash}-cv`;
                const compoundSelector = `.${compoundClassName}`;

                const compoundRules: string[] = [];
                toCssRules(compoundStyle, [compoundSelector], [], stitches.config, (cssText) =>
                  compoundRules.push(cssText),
                );

                for (const cssText of compoundRules) {
                  rules.push({
                    className: compoundClassName,
                    selector: compoundSelector,
                    cssText,
                    layer: "allvar",
                    usage,
                  });
                  layers.get("allvar")!.push(cssText);
                }
              }
            }
          }
          break;
        }

        case "globalCss": {
          const globalStyles = usage.staticStyles;
          const cssRules: string[] = [];
          toCssRules(globalStyles as CSSObject, [], [], stitches.config, (cssText) =>
            cssRules.push(cssText),
          );

          for (const cssText of cssRules) {
            rules.push({
              className: "",
              selector: "",
              cssText,
              layer: "global",
              usage,
            });
            layers.get("global")!.push(cssText);
          }
          break;
        }

        case "keyframes": {
          const keyframeStyles = usage.staticStyles;
          const keyframeName = `${toTailDashed(mergedConfig.prefix)}k-${toHash(keyframeStyles)}`;

          const keyframeRules: string[] = [];
          toCssRules(keyframeStyles as CSSObject, [], [], stitches.config, (cssText) =>
            keyframeRules.push(cssText),
          );

          const cssText = `@keyframes ${keyframeName}{${keyframeRules.join("")}}`;

          rules.push({
            className: keyframeName,
            selector: "",
            cssText,
            layer: "global",
            usage,
          });
          layers.get("global")!.push(cssText);

          if (usage.name) {
            classNames.set(usage.name, keyframeName);
          }
          break;
        }

        case "createTheme": {
          // Theme extraction is handled separately
          break;
        }
      }
    } catch {
      // If extraction fails, mark as dynamic
      dynamicUsages.push(usage);
    }
  }

  return {
    rules,
    layers,
    classNames,
    dynamicUsages,
  };
};
