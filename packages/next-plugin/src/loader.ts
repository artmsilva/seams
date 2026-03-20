import type { LoaderContext } from "webpack";

import { processSource } from "@artmsilva/seams-plugin-common";
import type { ProcessOptions } from "@artmsilva/seams-plugin-common";

/**
 * Options for the Seams webpack loader.
 */
export interface SeamsLoaderOptions extends ProcessOptions {
  /** File extensions to process */
  extensions?: string[];
}

/**
 * Webpack loader for processing Seams files.
 * Extracts CSS at build time for RSC support.
 */
export default function seamsLoader(this: LoaderContext<SeamsLoaderOptions>, source: string): void {
  const callback = this.async();
  const options = this.getOptions();
  const filename = this.resourcePath;

  // Check if file should be processed
  const extensions = options.extensions ?? [".tsx", ".ts", ".jsx", ".js"];
  const shouldProcess = extensions.some((ext) => filename.endsWith(ext));

  if (!shouldProcess) {
    callback(null, source);
    return;
  }

  try {
    const result = processSource(source, filename, {
      useScope: options.useScope,
      useLayers: options.useLayers,
      minify: options.minify,
      layerPrefix: options.layerPrefix,
      config: options.config,
    });

    if (!result.hasStitches) {
      callback(null, source);
      return;
    }

    // Emit CSS as a separate asset
    if (result.css) {
      const cssFilename = filename.replace(/\.(tsx?|jsx?)$/, ".seams.css");
      this.emitFile(cssFilename, result.css);
    }

    // Add CSS import to the transformed code
    let transformedCode = result.code;
    if (result.css) {
      const cssImport = `import './${filename
        .split("/")
        .pop()
        ?.replace(/\.(tsx?|jsx?)$/, ".seams.css")}';\n`;
      transformedCode = cssImport + transformedCode;
    }

    callback(null, transformedCode, result.map as unknown as undefined);
  } catch (error) {
    callback(error as Error);
  }
}
