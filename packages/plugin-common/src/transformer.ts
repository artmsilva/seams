import _generate from "@babel/generator";
import * as parser from "@babel/parser";
import _traverse from "@babel/traverse";
import * as t from "@babel/types";

import type { AnalysisResult, StitchesUsage } from "./analyzer.js";
import type { ExtractionResult } from "./extractor.js";

// Handle both ESM and CJS imports
const traverse = (
  typeof _traverse === "function" ? _traverse : (_traverse as { default: typeof _traverse }).default
) as typeof _traverse;
const generate = (
  typeof _generate === "function" ? _generate : (_generate as { default: typeof _generate }).default
) as typeof _generate;

/**
 * Options for the code transformer.
 */
export interface TransformOptions {
  /** Analysis result */
  analysis: AnalysisResult;
  /** Extraction result */
  extraction: ExtractionResult;
  /** Whether to keep the original Stitches calls (for development) */
  keepOriginal?: boolean;
}

/**
 * Result of code transformation.
 */
export interface TransformResult {
  /** Transformed source code */
  code: string;
  /** Source map (if generated) */
  map?: object;
  /** Dynamic variables that need runtime CSS variable injection */
  dynamicVariables: DynamicVariable[];
}

/**
 * A dynamic CSS variable that needs runtime injection.
 */
export interface DynamicVariable {
  /** The CSS variable name */
  variableName: string;
  /** The expression that produces the value */
  expression: string;
  /** The class name this variable is associated with */
  className: string;
}

/**
 * Counter for generating unique variable names.
 */
let dynamicVarCounter = 0;

/**
 * Transforms source code to replace dynamic Stitches usages with CSS variables.
 */
export const transformSource = (options: TransformOptions): TransformResult => {
  const { analysis, extraction, keepOriginal } = options;
  const dynamicVariables: DynamicVariable[] = [];

  // Parse the source again to get a fresh AST we can modify
  const ast = parser.parse(analysis.source, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });

  // Create a map of start positions to usages for quick lookup
  const usageMap = new Map<number, StitchesUsage>();
  for (const usage of analysis.usages) {
    usageMap.set(usage.start, usage);
  }

  // Track which usages were extracted statically
  const extractedStarts = new Set(extraction.rules.map((r) => r.usage.start));

  traverse(ast, {
    // Transform JSX elements with css prop that have dynamic values
    JSXAttribute(path) {
      const { node } = path;
      if (
        t.isJSXIdentifier(node.name) &&
        node.name.name === "css" &&
        t.isJSXExpressionContainer(node.value)
      ) {
        const expr = node.value.expression;
        if (t.isObjectExpression(expr)) {
          // Create narrowed path-like object
          const narrowedPath = { node: { name: node.name, value: node.value } };
          transformCssProp(narrowedPath, expr, dynamicVariables, extraction);
        }
      }
    },

    // Transform Stitches function calls that couldn't be extracted
    CallExpression(path) {
      const start = path.node.start ?? 0;
      const usage = usageMap.get(start);

      if (!usage) return;

      // If this was extracted statically, we might want to simplify it
      if (extractedStarts.has(start) && !keepOriginal) {
        const className = extraction.classNames.get(usage.name ?? "");
        if (className && usage.name) {
          // For styled components, we can't simply replace the call
          // since we need to maintain the component structure
          // The extraction happens at build time, and the className
          // will be injected via the generated CSS
          return;
        }
      }

      // Handle dynamic usages that need CSS variable transformation
      if (usage.hasDynamicValues) {
        transformDynamicCall(path, usage, dynamicVariables, extraction);
      }
    },
  });

  const result = generate(ast, {
    sourceMaps: true,
    sourceFileName: "transformed.tsx",
  });

  return {
    code: result.code,
    map: result.map as object | undefined,
    dynamicVariables,
  };
};

/**
 * Transforms a css prop with dynamic values into CSS variables.
 */
const transformCssProp = (
  path: { node: { name: t.JSXIdentifier; value: t.JSXExpressionContainer } },
  cssObject: t.ObjectExpression,
  dynamicVariables: DynamicVariable[],
  _extraction: ExtractionResult,
): void => {
  const styleProperties: t.ObjectProperty[] = [];
  const staticProperties: t.ObjectProperty[] = [];

  for (const prop of cssObject.properties) {
    if (!t.isObjectProperty(prop)) continue;

    const key = t.isIdentifier(prop.key)
      ? prop.key.name
      : t.isStringLiteral(prop.key)
        ? prop.key.value
        : null;

    if (!key) continue;

    // Check if the value is dynamic
    if (isDynamicValue(prop.value)) {
      // Generate a CSS variable name
      const varName = `--seams-dyn-${dynamicVarCounter++}`;

      // Add to style prop for runtime injection
      styleProperties.push(t.objectProperty(t.stringLiteral(varName), prop.value as t.Expression));

      // Replace in CSS with var() reference
      staticProperties.push(t.objectProperty(prop.key, t.stringLiteral(`var(${varName})`)));

      dynamicVariables.push({
        variableName: varName,
        expression: generate(prop.value as t.Expression).code,
        className: "",
      });
    } else {
      staticProperties.push(prop);
    }
  }

  // If we have dynamic properties, we need to add a style prop
  if (styleProperties.length > 0) {
    // Update the css prop to only contain static properties
    cssObject.properties = staticProperties;

    // Note: The actual style prop injection would be handled
    // by the framework-specific plugin (Next.js or Vite)
  }
};

/**
 * Transforms a dynamic Stitches call to use CSS variables.
 */
const transformDynamicCall = (
  path: { node: t.CallExpression },
  usage: StitchesUsage,
  dynamicVariables: DynamicVariable[],
  extraction: ExtractionResult,
): void => {
  // For dynamic calls, we need to:
  // 1. Extract static parts at build time
  // 2. Convert dynamic parts to CSS variables
  // 3. Generate runtime code to set the CSS variables

  // This is a simplified implementation - a full implementation would
  // need to deeply analyze the style object and separate static from dynamic

  const args = path.node.arguments;
  if (args.length === 0) return;

  const lastArg = args[args.length - 1];
  if (!t.isObjectExpression(lastArg)) return;

  const className = extraction.classNames.get(usage.name ?? "") ?? "";

  for (const prop of lastArg.properties) {
    if (!t.isObjectProperty(prop)) continue;

    const key = t.isIdentifier(prop.key)
      ? prop.key.name
      : t.isStringLiteral(prop.key)
        ? prop.key.value
        : null;

    if (!key || key === "variants" || key === "compoundVariants" || key === "defaultVariants") {
      continue;
    }

    if (isDynamicValue(prop.value)) {
      const varName = `--seams-dyn-${dynamicVarCounter++}`;

      dynamicVariables.push({
        variableName: varName,
        expression: generate(prop.value as t.Expression).code,
        className,
      });

      // Replace the dynamic value with var() reference
      prop.value = t.stringLiteral(`var(${varName})`);
    }
  }
};

/**
 * Checks if an AST node represents a dynamic (non-static) value.
 */
const isDynamicValue = (node: t.Node): boolean => {
  if (t.isIdentifier(node)) {
    // Could be a variable reference
    return true;
  }
  if (t.isCallExpression(node)) {
    return true;
  }
  if (t.isMemberExpression(node)) {
    return true;
  }
  if (t.isConditionalExpression(node)) {
    return true;
  }
  if (t.isLogicalExpression(node)) {
    return true;
  }
  if (t.isBinaryExpression(node)) {
    return true;
  }
  if (t.isTemplateLiteral(node) && node.expressions.length > 0) {
    return true;
  }
  return false;
};

/**
 * Resets the dynamic variable counter (useful for testing).
 */
export const resetDynamicVarCounter = (): void => {
  dynamicVarCounter = 0;
};
