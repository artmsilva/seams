import type { ExtractionResult } from './extractor.js';

/**
 * Options for CSS generation.
 */
export interface CssGeneratorOptions {
  /** Whether to use @scope for component isolation */
  useScope?: boolean;
  /** Whether to use @layer for cascade control */
  useLayers?: boolean;
  /** Whether to minify the output */
  minify?: boolean;
  /** Custom layer prefix */
  layerPrefix?: string;
}

/**
 * Layer names and their order in the cascade.
 */
const LAYER_ORDER = [
  'themed',
  'global',
  'styled',
  'onevar',
  'resonevar',
  'allvar',
  'inline',
] as const;

/**
 * Generates the CSS output from extracted rules.
 */
export const generateCss = (
  extraction: ExtractionResult,
  options: CssGeneratorOptions = {},
): string => {
  const {
    useScope = true,
    useLayers = true,
    minify = false,
    layerPrefix = 'stitches',
  } = options;

  const parts: string[] = [];
  const nl = minify ? '' : '\n';
  const indent = minify ? '' : '  ';

  // Generate @layer declaration
  if (useLayers) {
    const layerNames = LAYER_ORDER.map((l) => `${layerPrefix}.${l}`).join(', ');
    parts.push(`@layer ${layerNames};${nl}`);
  }

  // Generate CSS for each layer
  for (const layerName of LAYER_ORDER) {
    const layerRules = extraction.layers.get(layerName) ?? [];
    if (layerRules.length === 0) continue;

    const layerContent = generateLayerContent(
      layerName,
      layerRules,
      extraction,
      { useScope, minify, indent },
    );

    if (useLayers) {
      parts.push(`${nl}@layer ${layerPrefix}.${layerName} {${nl}${layerContent}${nl}}${nl}`);
    } else {
      parts.push(layerContent);
    }
  }

  return parts.join('');
};

/**
 * Generates content for a specific layer.
 */
const generateLayerContent = (
  layerName: string,
  rules: string[],
  extraction: ExtractionResult,
  options: { useScope: boolean; minify: boolean; indent: string },
): string => {
  const { useScope, minify, indent } = options;
  const nl = minify ? '' : '\n';

  // For styled components, optionally wrap in @scope
  if (useScope && (layerName === 'styled' || layerName === 'onevar' || layerName === 'resonevar' || layerName === 'allvar')) {
    return generateScopedRules(rules, extraction, { minify, indent });
  }

  // For other layers, just join the rules
  return rules.map((r) => `${indent}${r}`).join(nl);
};

/**
 * Generates scoped CSS rules.
 */
const generateScopedRules = (
  rules: string[],
  extraction: ExtractionResult,
  options: { minify: boolean; indent: string },
): string => {
  const { minify, indent } = options;
  const nl = minify ? '' : '\n';

  // Group rules by their root class name
  const rulesByClass = new Map<string, string[]>();

  for (const rule of rules) {
    // Extract class name from selector (simple parsing)
    const classMatch = rule.match(/^\.([a-zA-Z_-][\w-]*)/);
    if (classMatch) {
      const className = classMatch[1]!;
      // Get the base class (before variant hash)
      const baseClass = className.split('-').slice(0, 3).join('-');

      if (!rulesByClass.has(baseClass)) {
        rulesByClass.set(baseClass, []);
      }
      rulesByClass.get(baseClass)!.push(rule);
    } else {
      // Rules without a class selector go to a general bucket
      if (!rulesByClass.has('_general')) {
        rulesByClass.set('_general', []);
      }
      rulesByClass.get('_general')!.push(rule);
    }
  }

  const scopedParts: string[] = [];

  for (const [baseClass, classRules] of rulesByClass) {
    if (baseClass === '_general') {
      // Non-class rules don't get scoped
      scopedParts.push(...classRules.map((r) => `${indent}${r}`));
    } else {
      // Wrap in @scope
      const scopeSelector = `.${baseClass}`;
      const scopedContent = classRules
        .map((r) => {
          // Transform selector to use :scope
          return r.replace(
            new RegExp(`^\\.${baseClass}\\b`),
            ':scope',
          );
        })
        .map((r) => `${indent}${indent}${r}`)
        .join(nl);

      scopedParts.push(`${indent}@scope (${scopeSelector}) {${nl}${scopedContent}${nl}${indent}}`);
    }
  }

  return scopedParts.join(nl);
};

/**
 * Generates a Firefox fallback for @scope.
 * Uses :where() to maintain specificity without @scope support.
 */
export const generateScopeFallback = (
  extraction: ExtractionResult,
  options: CssGeneratorOptions = {},
): string => {
  const { useLayers = true, minify = false, layerPrefix = 'stitches' } = options;
  const nl = minify ? '' : '\n';
  const indent = minify ? '' : '  ';

  const parts: string[] = [];

  // Wrap in @supports not
  parts.push(`@supports not (selector(:scope)) {${nl}`);

  // Generate fallback CSS for each layer that uses @scope
  for (const layerName of ['styled', 'onevar', 'resonevar', 'allvar'] as const) {
    const layerRules = extraction.layers.get(layerName) ?? [];
    if (layerRules.length === 0) continue;

    const fallbackRules = layerRules.map((rule) => {
      // Transform .className { ... } to .className:where(.className) { ... }
      return rule.replace(
        /^(\.[\w-]+)/,
        (match, className) => `${className}:where(${className})`,
      );
    });

    const content = fallbackRules.map((r) => `${indent}${indent}${r}`).join(nl);

    if (useLayers) {
      parts.push(`${indent}@layer ${layerPrefix}.${layerName} {${nl}${content}${nl}${indent}}${nl}`);
    } else {
      parts.push(content);
    }
  }

  parts.push(`}${nl}`);

  return parts.join('');
};

/**
 * Generates the complete CSS output including fallbacks.
 */
export const generateFullCss = (
  extraction: ExtractionResult,
  options: CssGeneratorOptions = {},
): string => {
  const mainCss = generateCss(extraction, options);
  const fallbackCss = generateScopeFallback(extraction, options);

  return mainCss + '\n' + fallbackCss;
};
