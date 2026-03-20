import type { NextConfig } from "next";
import path from "path";

import type { ProcessOptions } from "@artmsilva/seams-plugin-common";

/**
 * Options for the Seams Next.js plugin.
 */
export interface SeamsNextPluginOptions extends ProcessOptions {
  /** File extensions to process */
  extensions?: string[];
  /** Directories to include (default: ['app', 'components', 'src']) */
  include?: string[];
  /** Directories to exclude (default: ['node_modules']) */
  exclude?: string[];
}

/**
 * Creates a Next.js plugin for Seams.
 *
 * @example
 * ```js
 * // next.config.js
 * const { withSeams } = require('@artmsilva/seams-next-plugin');
 *
 * module.exports = withSeams({
 *   useScope: true,
 *   useLayers: true,
 * })({
 *   // Your Next.js config
 * });
 * ```
 */
export const withSeams = (pluginOptions: SeamsNextPluginOptions = {}) => {
  const {
    extensions = [".tsx", ".ts", ".jsx", ".js"],
    include = ["app", "components", "src", "pages"],
    exclude = ["node_modules"],
    ...processOptions
  } = pluginOptions;

  return (nextConfig: NextConfig = {}): NextConfig => {
    return {
      ...nextConfig,
      webpack: (config, context) => {
        // Get the project root
        const projectRoot = context.dir;

        // Create include/exclude patterns
        const includePatterns = include.map((dir) => path.resolve(projectRoot, dir));
        const excludePatterns = exclude.map((dir) => path.resolve(projectRoot, dir));

        // Add our loader
        config.module.rules.push({
          test: new RegExp(`\\.(${extensions.map((e) => e.slice(1)).join("|")})$`),
          include: includePatterns,
          exclude: excludePatterns,
          use: [
            {
              loader: require.resolve("./loader"),
              options: {
                extensions,
                ...processOptions,
              },
            },
          ],
        });

        // Call the original webpack function if it exists
        if (typeof nextConfig.webpack === "function") {
          return nextConfig.webpack(config, context);
        }

        return config;
      },
    };
  };
};

// Default export for CommonJS compatibility
export default withSeams;

// Backward compatibility aliases
/** @deprecated Use `SeamsNextPluginOptions` instead */
export type StitchesNextPluginOptions = SeamsNextPluginOptions;
/** @deprecated Use `withSeams` instead */
export const withStitchesRSC = withSeams;

// Re-export types from plugin-common
export type { ProcessOptions, ProcessResult } from "@artmsilva/seams-plugin-common";
