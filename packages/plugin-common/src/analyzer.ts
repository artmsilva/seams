import * as parser from '@babel/parser';
import _traverse from '@babel/traverse';
import * as t from '@babel/types';

// Handle both ESM and CJS imports
const traverse = (typeof _traverse === 'function' ? _traverse : (_traverse as { default: typeof _traverse }).default) as typeof _traverse;

/**
 * Information about a Stitches usage found in the code.
 */
export interface StitchesUsage {
  /** Type of usage: styled, css, globalCss, keyframes, createTheme */
  type: 'styled' | 'css' | 'globalCss' | 'keyframes' | 'createTheme';
  /** The variable name if assigned */
  name?: string;
  /** The AST node */
  node: t.Node;
  /** Start position in source */
  start: number;
  /** End position in source */
  end: number;
  /** Whether this contains dynamic values */
  hasDynamicValues: boolean;
  /** The style object if it can be extracted statically */
  staticStyles?: Record<string, unknown>;
}

/**
 * Information about createStitches call.
 */
export interface StitchesConfig {
  /** The variable name the result is assigned to */
  instanceName: string;
  /** The exported names (css, styled, etc.) */
  exports: string[];
  /** The configuration object if statically analyzable */
  config?: Record<string, unknown>;
}

/**
 * Result of analyzing a source file.
 */
export interface AnalysisResult {
  /** Whether the file imports from stitches */
  hasStitchesImport: boolean;
  /** The stitches configurations found */
  configs: StitchesConfig[];
  /** Individual usages of stitches functions */
  usages: StitchesUsage[];
  /** Source code */
  source: string;
  /** The parsed AST */
  ast: t.File;
}

/**
 * Checks if a node contains dynamic (non-static) values.
 */
const containsDynamicValues = (node: t.Node): boolean => {
  let hasDynamic = false;

  traverse(
    // Need to wrap in a program for traverse to work
    t.file(t.program([t.expressionStatement(node as t.Expression)])),
    {
      Identifier(path) {
        // Check if this identifier is a reference to an outer scope variable
        if (!path.scope.hasBinding(path.node.name)) {
          // Skip if it's a property key
          if (
            path.parentPath.isObjectProperty() &&
            path.parentPath.node.key === path.node
          ) {
            return;
          }
          // Skip if it's a member expression property (non-computed)
          if (
            path.parentPath.isMemberExpression() &&
            path.parentPath.node.property === path.node &&
            !path.parentPath.node.computed
          ) {
            return;
          }
          hasDynamic = true;
          path.stop();
        }
      },
      CallExpression() {
        hasDynamic = true;
      },
      TemplateLiteral(path) {
        if (path.node.expressions.length > 0) {
          hasDynamic = true;
          path.stop();
        }
      },
    },
  );

  return hasDynamic;
};

/**
 * Attempts to extract static value from an AST node.
 */
const extractStaticValue = (node: t.Node): unknown => {
  if (t.isStringLiteral(node)) {
    return node.value;
  }
  if (t.isNumericLiteral(node)) {
    return node.value;
  }
  if (t.isBooleanLiteral(node)) {
    return node.value;
  }
  if (t.isNullLiteral(node)) {
    return null;
  }
  if (t.isIdentifier(node) && node.name === 'undefined') {
    return undefined;
  }
  if (t.isUnaryExpression(node) && node.operator === '-' && t.isNumericLiteral(node.argument)) {
    return -node.argument.value;
  }
  if (t.isObjectExpression(node)) {
    const obj: Record<string, unknown> = {};
    for (const prop of node.properties) {
      if (t.isObjectProperty(prop) && !prop.computed) {
        const key = t.isIdentifier(prop.key)
          ? prop.key.name
          : t.isStringLiteral(prop.key)
            ? prop.key.value
            : null;
        if (key) {
          obj[key] = extractStaticValue(prop.value);
        }
      }
    }
    return obj;
  }
  if (t.isArrayExpression(node)) {
    return node.elements.map((el) => (el ? extractStaticValue(el) : null));
  }
  if (t.isTemplateLiteral(node) && node.expressions.length === 0) {
    return node.quasis.map((q) => q.value.cooked).join('');
  }
  return undefined;
};

/**
 * Analyzes source code for Stitches usage.
 */
export const analyzeSource = (source: string, filename: string): AnalysisResult => {
  const ast = parser.parse(source, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx'],
    sourceFilename: filename,
  });

  const configs: StitchesConfig[] = [];
  const usages: StitchesUsage[] = [];
  let hasStitchesImport = false;

  // Track imported names
  const stitchesImports = new Map<string, string>();
  // Track destructured names from createStitches result
  const stitchesExports = new Map<string, string>();

  traverse(ast, {
    ImportDeclaration(path) {
      const source = path.node.source.value;
      if (
        source === '@stitches-rsc/react' ||
        source === '@stitches-rsc/core' ||
        source === '@stitches/react' ||
        source === '@stitches/core'
      ) {
        hasStitchesImport = true;

        for (const specifier of path.node.specifiers) {
          if (t.isImportSpecifier(specifier)) {
            const imported = t.isIdentifier(specifier.imported)
              ? specifier.imported.name
              : specifier.imported.value;
            stitchesImports.set(specifier.local.name, imported);
          }
        }
      }
    },

    VariableDeclarator(path) {
      // Check for createStitches call
      if (
        t.isCallExpression(path.node.init) &&
        t.isIdentifier(path.node.init.callee) &&
        stitchesImports.get(path.node.init.callee.name) === 'createStitches'
      ) {
        // Destructured pattern: const { styled, css } = createStitches(...)
        if (t.isObjectPattern(path.node.id)) {
          const exports: string[] = [];
          for (const prop of path.node.id.properties) {
            if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
              const name = prop.key.name;
              exports.push(name);
              if (t.isIdentifier(prop.value)) {
                stitchesExports.set(prop.value.name, name);
              }
            }
          }

          const configArg = path.node.init.arguments[0];
          configs.push({
            instanceName: '',
            exports,
            config: configArg && !containsDynamicValues(configArg)
              ? (extractStaticValue(configArg) as Record<string, unknown>)
              : undefined,
          });
        }
        // Direct assignment: const stitches = createStitches(...)
        else if (t.isIdentifier(path.node.id)) {
          configs.push({
            instanceName: path.node.id.name,
            exports: ['css', 'styled', 'globalCss', 'keyframes', 'createTheme', 'theme'],
            config: path.node.init.arguments[0] && !containsDynamicValues(path.node.init.arguments[0])
              ? (extractStaticValue(path.node.init.arguments[0]) as Record<string, unknown>)
              : undefined,
          });
        }
      }
    },

    CallExpression(path) {
      const callee = path.node.callee;
      let functionName: string | null = null;

      // Direct call: css(...), styled(...)
      if (t.isIdentifier(callee)) {
        const mappedName = stitchesExports.get(callee.name) || stitchesImports.get(callee.name);
        if (mappedName) {
          functionName = mappedName;
        }
      }
      // Member call: stitches.css(...)
      else if (
        t.isMemberExpression(callee) &&
        t.isIdentifier(callee.object) &&
        t.isIdentifier(callee.property)
      ) {
        const objectName = callee.object.name;
        const propertyName = callee.property.name;
        const instanceConfig = configs.find((c) => c.instanceName === objectName);
        if (instanceConfig) {
          functionName = propertyName;
        }
      }

      if (functionName && ['styled', 'css', 'globalCss', 'keyframes', 'createTheme'].includes(functionName)) {
        const parent = path.parentPath;
        let name: string | undefined;

        // Check if assigned to a variable
        if (parent.isVariableDeclarator() && t.isIdentifier(parent.node.id)) {
          name = parent.node.id.name;
        }

        // Check for dynamic values in arguments
        let hasDynamicValues = false;
        let staticStyles: Record<string, unknown> | undefined;

        for (const arg of path.node.arguments) {
          if (containsDynamicValues(arg)) {
            hasDynamicValues = true;
            break;
          }
        }

        // Try to extract static styles
        if (!hasDynamicValues && path.node.arguments.length > 0) {
          const lastArg = path.node.arguments[path.node.arguments.length - 1];
          if (t.isObjectExpression(lastArg)) {
            staticStyles = extractStaticValue(lastArg) as Record<string, unknown>;
          }
        }

        usages.push({
          type: functionName as StitchesUsage['type'],
          name,
          node: path.node,
          start: path.node.start ?? 0,
          end: path.node.end ?? 0,
          hasDynamicValues,
          staticStyles,
        });
      }
    },
  });

  return {
    hasStitchesImport,
    configs,
    usages,
    source,
    ast,
  };
};
