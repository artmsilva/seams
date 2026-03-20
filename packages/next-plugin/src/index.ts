import type { NextConfig } from "next";
import path from "path";

import type { ProcessOptions } from "@stitches-rsc/plugin-common";

/**
 * Options for the Stitches RSC Next.js plugin.
 */
export interface StitchesNextPluginOptions extends ProcessOptions {
  /** File extensions to process */
  extensions?: string[];
  /** Directories to include (default: ['app', 'components', 'src']) */
  include?: string[];
  /** Directories to exclude (default: ['node_modules']) */
  exclude?: string[];
}

/**
 * Creates a Next.js plugin for Stitches RSC.
 *
 * @example
 * ```js
 * // next.config.js
 * const withStitchesRSC = require('@stitches-rsc/next-plugin');
 *
 * module.exports = withStitchesRSC({
 *   useScope: true,
 *   useLayers: true,
 * })({
 *   // Your Next.js config
 * });
 * ```
 */
export const withStitchesRSC = (pluginOptions: StitchesNextPluginOptions = {}) => {
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
export default withStitchesRSC;

// Re-export types from plugin-common
export type { ProcessOptions, ProcessResult } from "@stitches-rsc/plugin-common";
