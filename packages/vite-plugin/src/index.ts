import type { Plugin, ResolvedConfig } from "vite";
import path from "path";

import { processSource } from "@artmsilva/seams-plugin-common";
import type { ProcessOptions } from "@artmsilva/seams-plugin-common";

/**
 * Options for the Seams Vite plugin.
 */
export interface SeamsVitePluginOptions extends ProcessOptions {
  /** File extensions to process */
  extensions?: string[];
  /** Directories to include (relative to project root) */
  include?: string[];
  /** Directories to exclude */
  exclude?: string[];
}

/**
 * Collected CSS from all processed files.
 */
interface CollectedCss {
  filename: string;
  css: string;
}

/**
 * Creates a Vite plugin for Seams.
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import { defineConfig } from 'vite';
 * import react from '@vitejs/plugin-react';
 * import seams from '@artmsilva/seams-vite-plugin';
 *
 * export default defineConfig({
 *   plugins: [
 *     react(),
 *     seams({
 *       useScope: true,
 *       useLayers: true,
 *     }),
 *   ],
 * });
 * ```
 */
export const seams = (options: SeamsVitePluginOptions = {}): Plugin => {
  const {
    extensions = [".tsx", ".ts", ".jsx", ".js"],
    include = ["src", "app", "components"],
    exclude = ["node_modules"],
    ...processOptions
  } = options;

  let config: ResolvedConfig;
  const collectedCss: Map<string, CollectedCss> = new Map();

  // Virtual module ID for the combined CSS
  const virtualModuleId = "virtual:seams.css";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  return {
    name: "seams",
    enforce: "pre",

    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },

    load(id) {
      if (id === resolvedVirtualModuleId) {
        // Combine all collected CSS
        const allCss = Array.from(collectedCss.values())
          .map((c) => c.css)
          .join("\n");
        return allCss;
      }
    },

    transform(code, id) {
      // Check if this file should be processed
      const ext = path.extname(id);
      if (!extensions.includes(ext)) {
        return null;
      }

      // Check include/exclude patterns
      const relativePath = path.relative(config.root, id);
      const shouldInclude = include.some((dir) => relativePath.startsWith(dir));
      const shouldExclude = exclude.some((dir) => relativePath.includes(dir));

      if (!shouldInclude || shouldExclude) {
        return null;
      }

      try {
        const result = processSource(code, id, {
          useScope: processOptions.useScope,
          useLayers: processOptions.useLayers,
          minify: config.mode === "production",
          layerPrefix: processOptions.layerPrefix,
          config: processOptions.config,
        });

        if (!result.hasStitches) {
          return null;
        }

        // Collect the CSS
        if (result.css) {
          collectedCss.set(id, {
            filename: id,
            css: result.css,
          });
        }

        // Add import for the virtual CSS module
        const transformedCode = `import '${virtualModuleId}';\n${result.code}`;

        return {
          code: transformedCode,
          map: result.map
            ? {
                version: 3 as const,
                sources: [id],
                names: (result.map as { names?: string[] }).names ?? [],
                mappings: (result.map as { mappings?: string }).mappings ?? "",
              }
            : undefined,
        };
      } catch (error) {
        this.error(`Error processing Seams in ${id}: ${String(error)}`);
        return null;
      }
    },

    handleHotUpdate({ file, server }) {
      // When a file with Seams changes, invalidate the virtual CSS module
      if (collectedCss.has(file)) {
        const mod = server.moduleGraph.getModuleById(resolvedVirtualModuleId);
        if (mod) {
          server.moduleGraph.invalidateModule(mod);
        }
      }
    },

    generateBundle(_, _bundle) {
      // In production, emit a separate CSS file
      if (config.mode === "production" && collectedCss.size > 0) {
        const allCss = Array.from(collectedCss.values())
          .map((c) => c.css)
          .join("\n");

        this.emitFile({
          type: "asset",
          fileName: "seams.css",
          source: allCss,
        });
      }
    },
  };
};

// Default export
export default seams;

// Backward compatibility aliases
/** @deprecated Use `SeamsVitePluginOptions` instead */
export type StitchesVitePluginOptions = SeamsVitePluginOptions;
/** @deprecated Use `seams` instead */
export const stitchesRSC = seams;

// Re-export types
export type { ProcessOptions, ProcessResult } from "@artmsilva/seams-plugin-common";
