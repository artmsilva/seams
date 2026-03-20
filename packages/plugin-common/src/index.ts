// Analyzer
export { analyzeSource } from "./analyzer.js";
export type { AnalysisResult, StitchesConfig, StitchesUsage } from "./analyzer.js";

// Extractor
export { extractCss } from "./extractor.js";
export type { ExtractedRule, ExtractionResult, ExtractorOptions } from "./extractor.js";

// Transformer
export { transformSource, resetDynamicVarCounter } from "./transformer.js";
export type { TransformOptions, TransformResult, DynamicVariable } from "./transformer.js";

// CSS Generator
export { generateCss, generateScopeFallback, generateFullCss } from "./cssGenerator.js";
export type { CssGeneratorOptions } from "./cssGenerator.js";

/**
 * Main processing pipeline for Stitches RSC.
 *
 * @example
 * ```ts
 * import { processSource } from '@stitches-rsc/plugin-common';
 *
 * const result = processSource(sourceCode, 'component.tsx', {
 *   useScope: true,
 *   useLayers: true,
 * });
 *
 * // result.css - Generated CSS to be injected
 * // result.code - Transformed source code
 * // result.dynamicVariables - CSS variables for runtime injection
 * ```
 */
export interface ProcessResult {
  /** Generated CSS */
  css: string;
  /** Transformed source code */
  code: string;
  /** Source map */
  map?: object;
  /** Dynamic CSS variables */
  dynamicVariables: Array<{
    variableName: string;
    expression: string;
    className: string;
  }>;
  /** Whether the file contains Stitches usage */
  hasStitches: boolean;
}

export interface ProcessOptions {
  /** Whether to use @scope for component isolation */
  useScope?: boolean;
  /** Whether to use @layer for cascade control */
  useLayers?: boolean;
  /** Whether to minify CSS output */
  minify?: boolean;
  /** Custom layer prefix */
  layerPrefix?: string;
  /** Stitches configuration */
  config?: {
    prefix?: string;
    theme?: Record<string, Record<string, string | number>>;
    media?: Record<string, string>;
  };
}

import { analyzeSource } from "./analyzer.js";
import { extractCss } from "./extractor.js";
import { transformSource } from "./transformer.js";
import { generateFullCss } from "./cssGenerator.js";

/**
 * Process a source file through the complete Stitches RSC pipeline.
 */
export const processSource = (
  source: string,
  filename: string,
  options: ProcessOptions = {},
): ProcessResult => {
  // Step 1: Analyze the source for Stitches usage
  const analysis = analyzeSource(source, filename);

  if (!analysis.hasStitchesImport || analysis.usages.length === 0) {
    return {
      css: "",
      code: source,
      dynamicVariables: [],
      hasStitches: false,
    };
  }

  // Step 2: Extract static CSS
  const extraction = extractCss(analysis, { config: options.config });

  // Step 3: Transform source code for dynamic values
  const transformed = transformSource({
    analysis,
    extraction,
  });

  // Step 4: Generate final CSS
  const css = generateFullCss(extraction, {
    useScope: options.useScope ?? true,
    useLayers: options.useLayers ?? true,
    minify: options.minify ?? false,
    layerPrefix: options.layerPrefix ?? "stitches",
  });

  return {
    css,
    code: transformed.code,
    map: transformed.map,
    dynamicVariables: transformed.dynamicVariables,
    hasStitches: true,
  };
};
